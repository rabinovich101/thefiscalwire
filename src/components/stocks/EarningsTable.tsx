"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  ExternalLink,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EarningsCalendarEntry } from "@/lib/alpha-vantage";

interface EarningsTableProps {
  earnings: EarningsCalendarEntry[];
  className?: string;
}

type SortField = "symbol" | "name" | "reportDate" | "estimate" | "expectedMove";
type SortDirection = "asc" | "desc";

export function EarningsTable({ earnings, className }: EarningsTableProps) {
  const [sortField, setSortField] = useState<SortField>("reportDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedEarnings = [...earnings].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case "symbol":
        comparison = a.symbol.localeCompare(b.symbol);
        break;
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "reportDate":
        comparison = a.reportDate.localeCompare(b.reportDate);
        break;
      case "estimate":
        const aEst = a.estimate ?? -Infinity;
        const bEst = b.estimate ?? -Infinity;
        comparison = aEst - bEst;
        break;
      case "expectedMove":
        const aMove = a.expectedMovePercent ?? -Infinity;
        const bMove = b.expectedMovePercent ?? -Infinity;
        comparison = aMove - bMove;
        break;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatEPS = (eps: number | null) => {
    if (eps === null) return "—";
    return `$${eps.toFixed(2)}`;
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 ml-1 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 ml-1" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 ml-1" />
    );
  };

  if (earnings.length === 0) {
    return (
      <div className={cn("bg-surface rounded-xl border border-border/50 p-8 text-center", className)}>
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground">No earnings scheduled</p>
      </div>
    );
  }

  return (
    <div className={cn("bg-surface rounded-xl border border-border/50 overflow-hidden", className)}>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/30">
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort("symbol")}
                  className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  Symbol
                  <SortIcon field="symbol" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  Company
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort("reportDate")}
                  className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  Report Date
                  <SortIcon field="reportDate" />
                </button>
              </th>
              <th className="text-right px-4 py-3">
                <button
                  onClick={() => handleSort("estimate")}
                  className="flex items-center justify-end text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors w-full"
                >
                  EPS Est.
                  <SortIcon field="estimate" />
                </button>
              </th>
              <th className="text-right px-4 py-3">
                <button
                  onClick={() => handleSort("expectedMove")}
                  className="flex items-center justify-end text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors w-full"
                >
                  <Activity className="h-3 w-3 mr-1" />
                  Exp. Move
                  <SortIcon field="expectedMove" />
                </button>
              </th>
              <th className="text-right px-4 py-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedEarnings.map((earning, index) => (
              <tr
                key={`${earning.symbol}-${earning.reportDate}-${index}`}
                className="border-b border-border/30 last:border-b-0 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/stocks/${earning.symbol}`}
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {earning.symbol}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
                    {earning.name}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gold" />
                    <span className="text-sm font-medium">
                      {formatDate(earning.reportDate)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-semibold tabular-nums">
                    {formatEPS(earning.estimate)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {earning.expectedMovePercent !== undefined ? (
                    <span className="text-sm font-semibold tabular-nums text-amber-500">
                      ±{earning.expectedMovePercent.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/stocks/${earning.symbol}`}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    View
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="md:hidden">
        {sortedEarnings.map((earning, index) => (
          <Link
            key={`${earning.symbol}-${earning.reportDate}-${index}`}
            href={`/stocks/${earning.symbol}`}
            className="flex items-center justify-between px-4 py-4 border-b border-border/30 last:border-b-0 hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold text-sm flex-shrink-0">
                {earning.symbol.slice(0, 2)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  {earning.symbol}
                  {earning.expectedMovePercent !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-medium">
                      ±{earning.expectedMovePercent.toFixed(1)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {earning.name}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <div className="text-sm font-semibold tabular-nums">
                {formatEPS(earning.estimate)}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                <Calendar className="h-3 w-3 text-gold" />
                {formatDate(earning.reportDate)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
