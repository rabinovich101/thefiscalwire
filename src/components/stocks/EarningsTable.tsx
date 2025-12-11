"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Sun,
  Moon,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EarningsCalendarEntry } from "@/lib/alpha-vantage";

// Modern skeleton loader component with pulse + shimmer effect
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md",
        "bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20",
        "animate-pulse",
        "after:absolute after:inset-0 after:-translate-x-full",
        "after:animate-[shimmer_1.5s_infinite]",
        "after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent",
        className
      )}
    />
  );
}

interface EarningsTableProps {
  earnings: EarningsCalendarEntry[];
  className?: string;
  showWeekSelector?: boolean;
  isLoadingEnhancedData?: boolean;
}

type SortField = "symbol" | "name" | "reportTime" | "estimate" | "expectedMove" | "marketCap";
type SortDirection = "asc" | "desc";

export function EarningsTable({ earnings, className, showWeekSelector = true, isLoadingEnhancedData = false }: EarningsTableProps) {
  const [sortField, setSortField] = useState<SortField>("marketCap");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Get the current week's dates
  const weekDates = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);

    const dates: { date: Date; dateStr: string; dayName: string; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const count = earnings.filter(e => e.reportDate === dateStr).length;
      dates.push({
        date: d,
        dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        count
      });
    }
    return dates;
  }, [earnings]);

  // Get today's date string
  const todayStr = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Initialize selected date to today if not set and today has earnings
  useMemo(() => {
    if (!selectedDate) {
      const todayHasEarnings = weekDates.find(d => d.dateStr === todayStr && d.count > 0);
      if (todayHasEarnings) {
        setSelectedDate(todayStr);
      } else {
        // Find first day with earnings
        const firstDayWithEarnings = weekDates.find(d => d.count > 0);
        if (firstDayWithEarnings) {
          setSelectedDate(firstDayWithEarnings.dateStr);
        }
      }
    }
  }, [weekDates, todayStr, selectedDate]);

  // Filter earnings by selected date
  const filteredEarnings = useMemo(() => {
    if (!selectedDate) return earnings;
    return earnings.filter(e => e.reportDate === selectedDate);
  }, [earnings, selectedDate]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "marketCap" ? "desc" : "asc");
    }
    setCurrentPage(1);
  };

  const sortedEarnings = useMemo(() => {
    return [...filteredEarnings].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "symbol":
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "reportTime":
          const timeOrder = { BMO: 0, AMC: 1, TBD: 2 };
          const aTime = a.reportTime || 'TBD';
          const bTime = b.reportTime || 'TBD';
          comparison = (timeOrder[aTime as keyof typeof timeOrder] ?? 2) - (timeOrder[bTime as keyof typeof timeOrder] ?? 2);
          break;
        case "estimate":
          const aEst = a.estimate ?? -Infinity;
          const bEst = b.estimate ?? -Infinity;
          comparison = aEst - bEst;
          break;
        case "expectedMove":
          const aEM = a.expectedMovePercent ?? 0;
          const bEM = b.expectedMovePercent ?? 0;
          comparison = aEM - bEM;
          break;
        case "marketCap":
          const aMC = a.marketCap ?? 0;
          const bMC = b.marketCap ?? 0;
          comparison = aMC - bMC;
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredEarnings, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedEarnings.length / rowsPerPage);
  const paginatedEarnings = sortedEarnings.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const formatEPS = (eps: number | null) => {
    if (eps === null) return "-";
    return eps.toFixed(2);
  };

  const formatMarketCap = (marketCap?: number) => {
    if (!marketCap) return "-";
    if (marketCap >= 1e12) return `${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `${(marketCap / 1e6).toFixed(2)}M`;
    return marketCap.toLocaleString();
  };

  const formatExpectedMove = (earning: EarningsCalendarEntry) => {
    if (!earning.expectedMovePercent) return "-";
    return `±${earning.expectedMovePercent.toFixed(1)}%`;
  };

  const ReportTimeBadge = ({ reportTime, isLoading }: { reportTime?: string; isLoading?: boolean }) => {
    if (isLoading) {
      return <Skeleton className="h-5 w-12 mx-auto" />;
    }

    if (!reportTime || reportTime === 'TBD') {
      return <span className="text-muted-foreground">TBD</span>;
    }

    if (reportTime === 'BMO') {
      return (
        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
          <Sun className="h-3.5 w-3.5" />
          BMO
        </span>
      );
    }

    if (reportTime === 'AMC') {
      return (
        <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
          <Moon className="h-3.5 w-3.5" />
          AMC
        </span>
      );
    }

    return null;
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    const isActive = sortField === field;
    if (!isActive) {
      return <ArrowUpDown className="h-3.5 w-3.5 ml-1 opacity-30 group-hover:opacity-60 transition-opacity" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1 text-primary" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1 text-primary" />
    );
  };

  const SortableHeader = ({
    field,
    children,
    align = "left"
  }: {
    field: SortField;
    children: React.ReactNode;
    align?: "left" | "center" | "right";
  }) => {
    const isActive = sortField === field;
    return (
      <button
        onClick={() => handleSort(field)}
        className={cn(
          "group flex items-center text-xs font-semibold transition-colors w-full",
          align === "center" && "justify-center",
          align === "right" && "justify-end",
          isActive
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {children}
        <SortIcon field={field} />
      </button>
    );
  };

  const selectedDateFormatted = selectedDate
    ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : '';

  if (earnings.length === 0) {
    return (
      <div className={cn("bg-surface rounded-xl border border-border/50 p-8 text-center", className)}>
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground">No earnings scheduled</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Week Day Selector - Yahoo Finance Style */}
      {showWeekSelector && (
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <div className="flex-1 grid grid-cols-7 gap-1">
            {weekDates.map((day) => {
              const isSelected = day.dateStr === selectedDate;
              const isToday = day.dateStr === todayStr;
              const hasEarnings = day.count > 0;

              return (
                <button
                  key={day.dateStr}
                  onClick={() => hasEarnings && setSelectedDate(day.dateStr)}
                  disabled={!hasEarnings}
                  className={cn(
                    "flex flex-col items-center py-2 px-1 rounded-lg transition-all text-sm",
                    isSelected && "bg-primary text-primary-foreground",
                    !isSelected && hasEarnings && "hover:bg-muted/50 cursor-pointer",
                    !hasEarnings && "opacity-50 cursor-not-allowed",
                    isToday && !isSelected && "ring-1 ring-primary/50"
                  )}
                >
                  <span className={cn(
                    "text-xs font-medium",
                    !isSelected && "text-muted-foreground"
                  )}>
                    {day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  {hasEarnings && (
                    <span className={cn(
                      "text-xs mt-1 px-2 py-0.5 rounded-full",
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    )}>
                      {day.count} Earnings
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Table Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Earnings on {selectedDateFormatted}
        </h3>
        <span className="text-sm text-muted-foreground">
          {filteredEarnings.length} companies
        </span>
      </div>

      {/* Desktop Table */}
      <div className="bg-surface rounded-xl border border-border/50 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left px-4 py-3 w-24">
                  <SortableHeader field="symbol">Symbol</SortableHeader>
                </th>
                <th className="text-left px-4 py-3">
                  <SortableHeader field="name">Company</SortableHeader>
                </th>
                <th className="text-left px-4 py-3 w-40">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Event Name
                  </span>
                </th>
                <th className="text-center px-4 py-3 w-32">
                  <SortableHeader field="reportTime" align="center">Earnings Call Time</SortableHeader>
                </th>
                <th className="text-right px-4 py-3 w-28">
                  <SortableHeader field="estimate" align="right">EPS Estimate</SortableHeader>
                </th>
                <th className="text-right px-4 py-3 w-28">
                  <SortableHeader field="expectedMove" align="right">Expected Move</SortableHeader>
                </th>
                <th className="text-right px-4 py-3 w-28">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Reported EPS
                  </span>
                </th>
                <th className="text-right px-4 py-3 w-24">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Surprise (%)
                  </span>
                </th>
                <th className="text-right px-4 py-3 w-28">
                  <SortableHeader field="marketCap" align="right">Market Cap</SortableHeader>
                </th>
                <th className="text-center px-4 py-3 w-16">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Follow
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedEarnings.map((earning, index) => (
                <tr
                  key={`${earning.symbol}-${earning.reportDate}-${index}`}
                  className="border-b border-border/30 last:border-b-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/stocks/${earning.symbol}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {earning.symbol}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {earning.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      Earnings Announcement
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ReportTimeBadge reportTime={earning.reportTime} isLoading={isLoadingEnhancedData && !earning.reportTime} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm tabular-nums">
                      {formatEPS(earning.estimate)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isLoadingEnhancedData && earning.expectedMovePercent === undefined ? (
                      <Skeleton className="h-5 w-14 ml-auto" />
                    ) : (
                      <span className={cn(
                        "text-sm tabular-nums font-medium",
                        earning.expectedMovePercent
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-muted-foreground"
                      )}>
                        {formatExpectedMove(earning)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-muted-foreground">-</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-muted-foreground">-</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isLoadingEnhancedData && !earning.marketCap ? (
                      <Skeleton className="h-5 w-16 ml-auto" />
                    ) : (
                      <span className="text-sm tabular-nums">
                        {formatMarketCap(earning.marketCap)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="p-1.5 hover:bg-muted/50 rounded transition-colors">
                      <Star className="h-4 w-4 text-muted-foreground hover:text-yellow-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List */}
        <div className="md:hidden">
          {paginatedEarnings.map((earning, index) => (
            <Link
              key={`${earning.symbol}-${earning.reportDate}-${index}`}
              href={`/stocks/${earning.symbol}`}
              className="flex items-center justify-between px-4 py-4 border-b border-border/30 last:border-b-0 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">
                      {earning.symbol}
                    </span>
                    <ReportTimeBadge reportTime={earning.reportTime} isLoading={isLoadingEnhancedData && !earning.reportTime} />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {earning.name}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-sm font-medium tabular-nums">
                  EPS: {formatEPS(earning.estimate)}
                </div>
                {isLoadingEnhancedData && earning.expectedMovePercent === undefined ? (
                  <Skeleton className="h-4 w-12 ml-auto mt-1" />
                ) : earning.expectedMovePercent ? (
                  <div className="text-xs font-medium text-amber-600 dark:text-amber-400">
                    {formatExpectedMove(earning)}
                  </div>
                ) : null}
                {isLoadingEnhancedData && !earning.marketCap ? (
                  <Skeleton className="h-4 w-14 ml-auto mt-1" />
                ) : (
                  <div className="text-xs text-muted-foreground">
                    {formatMarketCap(earning.marketCap)}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 bg-muted/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Rows per page</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-surface border border-border/50 rounded px-2 py-1 text-sm"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, sortedEarnings.length)} of {sortedEarnings.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 hover:bg-muted/50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <ChevronLeft className="h-4 w-4 -ml-2" />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 hover:bg-muted/50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 hover:bg-muted/50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 hover:bg-muted/50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4 -ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
