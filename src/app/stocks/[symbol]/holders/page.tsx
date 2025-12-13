"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Building2, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstitutionalHolder {
  organization: string | null;
  reportDate: string | null;
  pctHeld: number | null;
  position: number | null;
  value: number | null;
  pctChange: number | null;
}

interface InsiderHolder {
  name: string | null;
  relation: string | null;
  positionDirect: number | null;
  latestTransDate: string | null;
}

interface InsiderTransaction {
  filerName: string | null;
  filerRelation: string | null;
  transactionText: string | null;
  startDate: string | null;
  shares: number | null;
  value: number | null;
}

interface HoldersData {
  majorHoldersBreakdown: {
    insidersPercentHeld: number | null;
    institutionsPercentHeld: number | null;
    institutionsFloatPercentHeld: number | null;
    institutionsCount: number | null;
  } | null;
  institutionOwnership: InstitutionalHolder[];
  fundOwnership: InstitutionalHolder[];
  insiderHolders: InsiderHolder[];
  insiderTransactions: InsiderTransaction[];
}

type TabType = "institutional" | "funds" | "insiders" | "transactions";

export default function HoldersPage() {
  const params = useParams();
  const symbol = (params.symbol as string).toUpperCase();

  const [data, setData] = useState<HoldersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("institutional");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/stocks/${symbol}/holders`);
        const json = await res.json();
        if (!json.error) {
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch holders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  const formatPercent = (value: number | null) => {
    if (value === null) return "—";
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatShares = (value: number | null) => {
    if (value === null) return "—";
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toLocaleString();
  };

  const formatValue = (value: number | null) => {
    if (value === null) return "—";
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        Holders data not available
      </div>
    );
  }

  const breakdown = data.majorHoldersBreakdown;

  return (
    <div className="space-y-6">
      {/* Major Holders Breakdown */}
      {breakdown && (
        <section className="bg-surface rounded-xl border border-border/50 p-6">
          <h2 className="text-lg font-semibold mb-4">Major Holders</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <BreakdownCard
              label="Insiders"
              value={formatPercent(breakdown.insidersPercentHeld)}
              icon={<User className="h-5 w-5" />}
            />
            <BreakdownCard
              label="Institutions"
              value={formatPercent(breakdown.institutionsPercentHeld)}
              icon={<Building2 className="h-5 w-5" />}
            />
            <BreakdownCard
              label="Institutions (Float)"
              value={formatPercent(breakdown.institutionsFloatPercentHeld)}
              icon={<Building2 className="h-5 w-5" />}
            />
            <BreakdownCard
              label="# of Institutions"
              value={breakdown.institutionsCount?.toLocaleString() || "—"}
              icon={<Building2 className="h-5 w-5" />}
            />
          </div>
        </section>
      )}

      {/* Tabs Section */}
      <section className="bg-surface rounded-xl border border-border/50 p-6">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-4">
          {[
            { value: "institutional", label: "Top Institutions" },
            { value: "funds", label: "Top Mutual Funds" },
            { value: "insiders", label: "Insider Holders" },
            { value: "transactions", label: "Insider Transactions" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as TabType)}
              className={cn(
                "px-4 py-2 text-sm rounded-lg transition-colors",
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground font-medium"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "institutional" && (
          <HolderTable
            data={data.institutionOwnership}
            formatPercent={formatPercent}
            formatShares={formatShares}
            formatValue={formatValue}
          />
        )}

        {activeTab === "funds" && (
          <HolderTable
            data={data.fundOwnership}
            formatPercent={formatPercent}
            formatShares={formatShares}
            formatValue={formatValue}
          />
        )}

        {activeTab === "insiders" && (
          <InsiderTable
            data={data.insiderHolders}
            formatShares={formatShares}
          />
        )}

        {activeTab === "transactions" && (
          <TransactionTable
            data={data.insiderTransactions}
            formatShares={formatShares}
            formatValue={formatValue}
          />
        )}
      </section>
    </div>
  );
}

function BreakdownCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-muted/30 rounded-lg p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="text-xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

function HolderTable({
  data,
  formatPercent,
  formatShares,
  formatValue,
}: {
  data: InstitutionalHolder[];
  formatPercent: (v: number | null) => string;
  formatShares: (v: number | null) => string;
  formatValue: (v: number | null) => string;
}) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Holder</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Shares</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">% Out</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Value</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">% Change</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Report Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {data.map((holder, idx) => {
            const change = holder.pctChange || 0;
            return (
              <tr key={idx} className="hover:bg-muted/30">
                <td className="py-3 px-2 font-medium max-w-[200px] truncate">
                  {holder.organization || "—"}
                </td>
                <td className="py-3 px-2 text-right tabular-nums">
                  {formatShares(holder.position)}
                </td>
                <td className="py-3 px-2 text-right tabular-nums">
                  {formatPercent(holder.pctHeld)}
                </td>
                <td className="py-3 px-2 text-right tabular-nums">
                  {formatValue(holder.value)}
                </td>
                <td className={cn(
                  "py-3 px-2 text-right tabular-nums",
                  change > 0 ? "text-positive" : change < 0 ? "text-negative" : ""
                )}>
                  {formatPercent(holder.pctChange)}
                </td>
                <td className="py-3 px-2 text-right text-muted-foreground">
                  {holder.reportDate || "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function InsiderTable({
  data,
  formatShares,
}: {
  data: InsiderHolder[];
  formatShares: (v: number | null) => string;
}) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No insider data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Name</th>
            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Relation</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Shares Held</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Last Trans. Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {data.map((insider, idx) => (
            <tr key={idx} className="hover:bg-muted/30">
              <td className="py-3 px-2 font-medium">{insider.name || "—"}</td>
              <td className="py-3 px-2 text-muted-foreground">{insider.relation || "—"}</td>
              <td className="py-3 px-2 text-right tabular-nums">
                {formatShares(insider.positionDirect)}
              </td>
              <td className="py-3 px-2 text-right text-muted-foreground">
                {insider.latestTransDate || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TransactionTable({
  data,
  formatShares,
  formatValue,
}: {
  data: InsiderTransaction[];
  formatShares: (v: number | null) => string;
  formatValue: (v: number | null) => string;
}) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No recent transactions
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Insider</th>
            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Relation</th>
            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Transaction</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Shares</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Value</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {data.map((trans, idx) => (
            <tr key={idx} className="hover:bg-muted/30">
              <td className="py-3 px-2 font-medium max-w-[150px] truncate">
                {trans.filerName || "—"}
              </td>
              <td className="py-3 px-2 text-muted-foreground text-xs max-w-[100px] truncate">
                {trans.filerRelation || "—"}
              </td>
              <td className="py-3 px-2 text-xs max-w-[200px]">
                {trans.transactionText || "—"}
              </td>
              <td className="py-3 px-2 text-right tabular-nums">
                {formatShares(trans.shares)}
              </td>
              <td className="py-3 px-2 text-right tabular-nums">
                {formatValue(trans.value)}
              </td>
              <td className="py-3 px-2 text-right text-muted-foreground">
                {trans.startDate || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
