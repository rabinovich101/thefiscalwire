"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

interface EstimateColumn {
  period: string | null;
  periodLabel: string;
  endDate: string | null;
  growth: number | null;
  earningsEstimate: {
    avg: number | null;
    low: number | null;
    high: number | null;
    numberOfAnalysts: number | null;
    yearAgoEps: number | null;
  };
  revenueEstimate: {
    avg: number | null;
    low: number | null;
    high: number | null;
    numberOfAnalysts: number | null;
    yearAgoRevenue: number | null;
    growth: number | null;
  };
  epsTrend: {
    current: number | null;
    sevenDaysAgo: number | null;
    thirtyDaysAgo: number | null;
    sixtyDaysAgo: number | null;
    ninetyDaysAgo: number | null;
  };
  epsRevisions: {
    upLast7Days: number | null;
    upLast30Days: number | null;
    downLast7Days: number | null;
    downLast30Days: number | null;
  };
}

interface EarningsHistory {
  epsActual: number | null;
  epsEstimate: number | null;
  epsDifference: number | null;
  surprisePercent: number | null;
  quarterDate: string | null;
  quarterLabel: string | null;
}

interface GrowthEstimates {
  stock: {
    currentQtr: number | null;
    nextQtr: number | null;
    currentYear: number | null;
    nextYear: number | null;
  };
  index: {
    symbol: string;
    currentQtr: number | null;
    nextQtr: number | null;
    currentYear: number | null;
    nextYear: number | null;
  };
}

interface EarningsTrendChartData {
  quarter: string;
  actual: number | null;
  estimate: number | null;
}

interface RevenueEarningsChartData {
  quarter: string;
  revenue: number | null;
  netIncome: number | null;
}

interface AnalysisData {
  symbol: string;
  estimateColumns: EstimateColumn[];
  earningsHistory: EarningsHistory[];
  growthEstimates: GrowthEstimates;
  earningsTrendsChart: EarningsTrendChartData[];
  revenueEarningsChart: RevenueEarningsChartData[];
}

export default function AnalysisPage() {
  const params = useParams();
  const symbol = (params.symbol as string).toUpperCase();

  const [data, setData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/stocks/${symbol}/analysis`);
        const json = await res.json();
        if (!json.error) {
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch analysis:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  const formatNumber = (value: number | null, decimals: number = 2): string => {
    if (value === null || value === undefined) return "—";
    return value.toFixed(decimals);
  };

  const formatLargeNumber = (value: number | null): string => {
    if (value === null || value === undefined) return "—";
    if (Math.abs(value) >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
    if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    return value.toFixed(2);
  };

  const formatPercent = (value: number | null): string => {
    if (value === null || value === undefined) return "—";
    return `${(value * 100).toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data || !data.estimateColumns || data.estimateColumns.length === 0) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        Analysis data not available
      </div>
    );
  }

  const columns = data.estimateColumns;

  // Format large numbers for Revenue vs Earnings chart
  const formatChartValue = (value: number): string => {
    if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    return value.toFixed(2);
  };

  // Custom tooltip for EPS chart
  const EpsTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-foreground">
              <span className="text-muted-foreground">{entry.dataKey === "estimate" ? "Estimate: " : "Actual: "}</span>
              {entry.value !== null ? `$${entry.value.toFixed(2)}` : "—"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for Revenue/Earnings chart
  const RevenueTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-foreground">
              <span className="text-muted-foreground">{entry.dataKey === "revenue" ? "Revenue: " : "Earnings: "}</span>
              {entry.value !== null ? formatChartValue(entry.value) : "—"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Earnings Trends Section - Charts */}
      {(data.earningsTrendsChart.length > 0 || data.revenueEarningsChart.length > 0) && (
        <section className="bg-surface rounded-xl border border-border/50 p-6">
          <h2 className="text-lg font-semibold mb-6">Earnings Trends: {symbol}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings Per Share Chart */}
            {data.earningsTrendsChart.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-foreground">Earnings Per Share</h3>
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm bg-indigo-500" />
                      <span className="text-foreground/80">Estimate</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm bg-violet-500" />
                      <span className="text-foreground/80">Actual</span>
                    </div>
                  </div>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.earningsTrendsChart}
                      margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                      barCategoryGap="20%"
                    >
                      <XAxis
                        dataKey="quarter"
                        tick={{ fill: "var(--foreground)", fontSize: 11 }}
                        axisLine={{ stroke: "var(--border)" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "var(--foreground)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value: number) => `$${value.toFixed(2)}`}
                      />
                      <Tooltip content={<EpsTooltip />} />
                      <Bar dataKey="estimate" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey="actual" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Revenue vs. Earnings Chart */}
            {data.revenueEarningsChart.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-foreground">Revenue vs. Earnings</h3>
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm bg-indigo-500" />
                      <span className="text-foreground/80">Revenue</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm bg-violet-500" />
                      <span className="text-foreground/80">Earnings</span>
                    </div>
                  </div>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.revenueEarningsChart}
                      margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                      barCategoryGap="20%"
                    >
                      <XAxis
                        dataKey="quarter"
                        tick={{ fill: "var(--foreground)", fontSize: 11 }}
                        axisLine={{ stroke: "var(--border)" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "var(--foreground)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value: number) => formatChartValue(value)}
                      />
                      <Tooltip content={<RevenueTooltip />} />
                      <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey="netIncome" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Earnings Estimate */}
      <section className="bg-surface rounded-xl border border-border/50 p-6">
        <h2 className="text-lg font-semibold mb-4">Earnings Estimate</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Currency in USD</th>
                {columns.map((col, idx) => (
                  <th key={idx} className="text-right py-3 px-2 font-medium text-muted-foreground">
                    {col.periodLabel}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">No. of Analysts</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {col.earningsEstimate.numberOfAnalysts ?? "—"}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">Avg. Estimate</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {formatNumber(col.earningsEstimate.avg)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">Low Estimate</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {formatNumber(col.earningsEstimate.low)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">High Estimate</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {formatNumber(col.earningsEstimate.high)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">Year Ago EPS</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {formatNumber(col.earningsEstimate.yearAgoEps)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Revenue Estimate */}
      <section className="bg-surface rounded-xl border border-border/50 p-6">
        <h2 className="text-lg font-semibold mb-4">Revenue Estimate</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Currency in USD</th>
                {columns.map((col, idx) => (
                  <th key={idx} className="text-right py-3 px-2 font-medium text-muted-foreground">
                    {col.periodLabel}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">No. of Analysts</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {col.revenueEstimate.numberOfAnalysts ?? "—"}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">Avg. Estimate</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {formatLargeNumber(col.revenueEstimate.avg)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">Low Estimate</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {formatLargeNumber(col.revenueEstimate.low)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">High Estimate</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {formatLargeNumber(col.revenueEstimate.high)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">Year Ago Sales</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {formatLargeNumber(col.revenueEstimate.yearAgoRevenue)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">Sales Growth (year/est)</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {formatPercent(col.revenueEstimate.growth)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Earnings History */}
      {data.earningsHistory.length > 0 && (
        <section className="bg-surface rounded-xl border border-border/50 p-6">
          <h2 className="text-lg font-semibold mb-4">Earnings History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Currency in USD</th>
                  {data.earningsHistory.map((h, idx) => (
                    <th key={idx} className="text-right py-3 px-2 font-medium text-muted-foreground">
                      {h.quarterLabel || "—"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr className="hover:bg-muted/30">
                  <td className="py-3 px-2">EPS Est.</td>
                  {data.earningsHistory.map((h, idx) => (
                    <td key={idx} className="py-3 px-2 text-right tabular-nums">
                      {formatNumber(h.epsEstimate)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="py-3 px-2">EPS Actual</td>
                  {data.earningsHistory.map((h, idx) => (
                    <td key={idx} className="py-3 px-2 text-right tabular-nums font-medium">
                      {formatNumber(h.epsActual)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="py-3 px-2">Difference</td>
                  {data.earningsHistory.map((h, idx) => (
                    <td key={idx} className="py-3 px-2 text-right tabular-nums">
                      {formatNumber(h.epsDifference)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="py-3 px-2">Surprise %</td>
                  {data.earningsHistory.map((h, idx) => (
                    <td key={idx} className="py-3 px-2 text-right tabular-nums">
                      {formatPercent(h.surprisePercent)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* EPS Trend */}
      <section className="bg-surface rounded-xl border border-border/50 p-6">
        <h2 className="text-lg font-semibold mb-4">EPS Trend</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Currency in USD</th>
                {columns.map((col, idx) => (
                  <th key={idx} className="text-right py-3 px-2 font-medium text-muted-foreground">
                    {col.periodLabel}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">Current Estimate</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {formatNumber(col.epsTrend.current)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">7 Days Ago</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {formatNumber(col.epsTrend.sevenDaysAgo)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">30 Days Ago</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {formatNumber(col.epsTrend.thirtyDaysAgo)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">60 Days Ago</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {formatNumber(col.epsTrend.sixtyDaysAgo)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">90 Days Ago</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {formatNumber(col.epsTrend.ninetyDaysAgo)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* EPS Revisions */}
      <section className="bg-surface rounded-xl border border-border/50 p-6">
        <h2 className="text-lg font-semibold mb-4">EPS Revisions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Currency in USD</th>
                {columns.map((col, idx) => (
                  <th key={idx} className="text-right py-3 px-2 font-medium text-muted-foreground">
                    {col.periodLabel}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">Up Last 7 Days</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {col.epsRevisions.upLast7Days ?? "—"}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">Up Last 30 Days</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {col.epsRevisions.upLast30Days ?? "—"}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">Down Last 7 Days</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {col.epsRevisions.downLast7Days ?? "—"}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">Down Last 30 Days</td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-3 px-2 text-right tabular-nums">
                    {col.epsRevisions.downLast30Days ?? "—"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Growth Estimates */}
      <section className="bg-surface rounded-xl border border-border/50 p-6">
        <h2 className="text-lg font-semibold mb-4">Growth Estimates</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Symbol</th>
                <th className="text-right py-3 px-2 font-medium text-muted-foreground">Current Qtr.</th>
                <th className="text-right py-3 px-2 font-medium text-muted-foreground">Next Qtr.</th>
                <th className="text-right py-3 px-2 font-medium text-muted-foreground">Current Year</th>
                <th className="text-right py-3 px-2 font-medium text-muted-foreground">Next Year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2 font-medium">{symbol}</td>
                <td className="py-3 px-2 text-right tabular-nums">
                  {formatPercent(data.growthEstimates.stock.currentQtr)}
                </td>
                <td className="py-3 px-2 text-right tabular-nums">
                  {formatPercent(data.growthEstimates.stock.nextQtr)}
                </td>
                <td className="py-3 px-2 text-right tabular-nums">
                  {formatPercent(data.growthEstimates.stock.currentYear)}
                </td>
                <td className="py-3 px-2 text-right tabular-nums">
                  {formatPercent(data.growthEstimates.stock.nextYear)}
                </td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-3 px-2">{data.growthEstimates.index.symbol}</td>
                <td className="py-3 px-2 text-right tabular-nums">
                  {formatPercent(data.growthEstimates.index.currentQtr)}
                </td>
                <td className="py-3 px-2 text-right tabular-nums">
                  {formatPercent(data.growthEstimates.index.nextQtr)}
                </td>
                <td className="py-3 px-2 text-right tabular-nums">
                  {formatPercent(data.growthEstimates.index.currentYear)}
                </td>
                <td className="py-3 px-2 text-right tabular-nums">
                  {formatPercent(data.growthEstimates.index.nextYear)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
