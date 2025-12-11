"use client";

import Link from "next/link";
import { Calendar, Clock, TrendingUp, TrendingDown, DollarSign, Activity, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EarningsCalendarEntry, EarningsHistorical } from "@/lib/alpha-vantage";

interface EarningsCardProps {
  earning: EarningsCalendarEntry;
  historical?: EarningsHistorical[];
  variant?: "default" | "compact" | "featured";
}

export function EarningsCard({
  earning,
  historical,
  variant = "default",
}: EarningsCardProps) {
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

  // Get the most recent historical quarter for surprise data
  const lastQuarter = historical?.[0];
  const surprise = lastQuarter?.surprisePercentage;
  const hasPositiveSurprise = surprise !== null && surprise !== undefined && surprise > 0;
  const hasNegativeSurprise = surprise !== null && surprise !== undefined && surprise < 0;

  // Report time badge component
  const ReportTimeBadge = () => {
    const reportTime = earning.reportTime;
    if (!reportTime || reportTime === 'TBD') {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted/50 text-muted-foreground">
          TBD
        </span>
      );
    }

    if (reportTime === 'BMO') {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <Sun className="h-3 w-3" />
          BMO
        </span>
      );
    }

    if (reportTime === 'AMC') {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
          <Moon className="h-3 w-3" />
          AMC
        </span>
      );
    }

    return null;
  };

  if (variant === "compact") {
    return (
      <Link
        href={`/stocks/${earning.symbol}`}
        className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors border-b border-border/30 last:border-b-0"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold text-sm">
            {earning.symbol.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{earning.symbol}</span>
              {/* Expected Move Badge */}
              {earning.expectedMovePercent !== undefined && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-medium">
                  ±{earning.expectedMovePercent.toFixed(1)}%
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
              {earning.name}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="text-sm font-medium tabular-nums">
            Est: {formatEPS(earning.estimate)}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground justify-end">
            {formatDate(earning.reportDate)}
            <ReportTimeBadge />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/stocks/${earning.symbol}`}
        className="group block bg-surface rounded-2xl border border-border/50 p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold text-lg">
              {earning.symbol.slice(0, 2)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {earning.symbol}
              </h3>
              <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                {earning.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gold/10 text-gold text-sm font-medium">
              <Calendar className="h-4 w-4" />
              {formatDate(earning.reportDate)}
            </div>
            <ReportTimeBadge />
          </div>
        </div>

        {/* EPS Section */}
        <div className={cn("grid gap-4 mb-4", earning.expectedMovePercent !== undefined ? "grid-cols-3" : "grid-cols-2")}>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              EPS Estimate
            </div>
            <div className="text-2xl font-bold tabular-nums text-foreground">
              {formatEPS(earning.estimate)}
            </div>
          </div>
          {/* Expected Move */}
          {earning.expectedMovePercent !== undefined && (
            <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
              <div className="text-xs text-amber-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Expected Move
              </div>
              <div className="text-2xl font-bold tabular-nums text-amber-500">
                ±{earning.expectedMovePercent.toFixed(1)}%
              </div>
              {earning.stockPrice && (
                <div className="text-xs text-muted-foreground mt-1">
                  ${earning.stockPrice.toFixed(2)} ± ${earning.expectedMove?.toFixed(2)}
                </div>
              )}
            </div>
          )}
          {lastQuarter && (
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Last Quarter
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tabular-nums text-foreground">
                  {formatEPS(lastQuarter.reportedEPS)}
                </span>
                {surprise !== null && surprise !== undefined && (
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      hasPositiveSurprise
                        ? "bg-positive/10 text-positive"
                        : hasNegativeSurprise
                        ? "bg-negative/10 text-negative"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {surprise > 0 ? "+" : ""}
                    {surprise.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Historical Quarters */}
        {historical && historical.length > 1 && (
          <div className="border-t border-border/30 pt-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Recent Quarters
            </div>
            <div className="flex gap-2">
              {historical.slice(0, 4).map((q, i) => (
                <div
                  key={i}
                  className="flex-1 text-center bg-muted/20 rounded-lg py-2 px-1"
                >
                  <div className="text-[10px] text-muted-foreground mb-1">
                    {q.fiscalDateEnding.slice(0, 7)}
                  </div>
                  <div className="text-sm font-semibold tabular-nums">
                    {formatEPS(q.reportedEPS)}
                  </div>
                  {q.surprisePercentage !== null && (
                    <div
                      className={cn(
                        "text-[10px] font-medium",
                        q.surprisePercentage > 0
                          ? "text-positive"
                          : q.surprisePercentage < 0
                          ? "text-negative"
                          : "text-muted-foreground"
                      )}
                    >
                      {q.surprisePercentage > 0 ? "+" : ""}
                      {q.surprisePercentage.toFixed(1)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      href={`/stocks/${earning.symbol}`}
      className="group block bg-surface rounded-xl border border-border/50 p-4 hover:border-primary/30 hover:bg-surface/80 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold text-sm">
            {earning.symbol.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {earning.symbol}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate max-w-[140px]">
              {earning.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium">
            <Calendar className="h-3 w-3" />
            {formatDate(earning.reportDate)}
          </div>
          <ReportTimeBadge />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs text-muted-foreground mb-1">EPS Estimate</div>
          <div className="text-xl font-bold tabular-nums">
            {formatEPS(earning.estimate)}
          </div>
        </div>
        {/* Expected Move */}
        {earning.expectedMovePercent !== undefined && (
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Expected Move
            </div>
            <div className="text-sm font-semibold tabular-nums text-amber-500">
              ±{earning.expectedMovePercent.toFixed(1)}%
            </div>
          </div>
        )}
        {lastQuarter && !earning.expectedMovePercent && (
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-1">Last Quarter</div>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-sm font-medium tabular-nums">
                {formatEPS(lastQuarter.reportedEPS)}
              </span>
              {surprise !== null && surprise !== undefined && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    hasPositiveSurprise
                      ? "text-positive"
                      : hasNegativeSurprise
                      ? "text-negative"
                      : "text-muted-foreground"
                  )}
                >
                  {hasPositiveSurprise ? (
                    <TrendingUp className="h-3 w-3 inline" />
                  ) : hasNegativeSurprise ? (
                    <TrendingDown className="h-3 w-3 inline" />
                  ) : null}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
