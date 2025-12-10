"use client";

import { useState, useMemo } from "react";
import { Calendar, List, Clock, CalendarDays, ArrowRight } from "lucide-react";
import { EarningsCalendar, EarningsCard, EarningsTable } from "@/components/stocks";
import type { EarningsCalendarEntry } from "@/lib/alpha-vantage";

interface EarningsPageClientProps {
  allEarnings: EarningsCalendarEntry[];
  todaysEarnings: EarningsCalendarEntry[];
  thisWeeksEarnings: EarningsCalendarEntry[];
}

type FilterType = "all" | "today" | "thisWeek" | "nextWeek" | "selected";
type ViewType = "calendar" | "table";

export function EarningsPageClient({
  allEarnings,
  todaysEarnings,
  thisWeeksEarnings,
}: EarningsPageClientProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [viewType, setViewType] = useState<ViewType>("calendar");

  // Get next week's earnings
  const nextWeeksEarnings = useMemo(() => {
    const today = new Date();
    const startOfNextWeek = new Date(today);
    startOfNextWeek.setDate(today.getDate() - today.getDay() + 7);
    startOfNextWeek.setHours(0, 0, 0, 0);

    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
    endOfNextWeek.setHours(23, 59, 59, 999);

    return allEarnings.filter((e) => {
      const date = new Date(e.reportDate);
      return date >= startOfNextWeek && date <= endOfNextWeek;
    });
  }, [allEarnings]);

  // Helper to format date in local timezone (YYYY-MM-DD)
  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get earnings for selected date
  const selectedDateEarnings = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = formatDateKey(selectedDate);
    return allEarnings.filter((e) => e.reportDate === dateStr);
  }, [selectedDate, allEarnings]);

  // Get filtered earnings based on active filter
  const filteredEarnings = useMemo(() => {
    switch (activeFilter) {
      case "today":
        return todaysEarnings;
      case "thisWeek":
        return thisWeeksEarnings;
      case "nextWeek":
        return nextWeeksEarnings;
      case "selected":
        return selectedDateEarnings;
      default:
        return allEarnings;
    }
  }, [
    activeFilter,
    allEarnings,
    todaysEarnings,
    thisWeeksEarnings,
    nextWeeksEarnings,
    selectedDateEarnings,
  ]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setActiveFilter("selected");
    }
  };

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const filterButtons = [
    { id: "all" as FilterType, label: "All", count: allEarnings.length },
    { id: "today" as FilterType, label: "Today", count: todaysEarnings.length },
    {
      id: "thisWeek" as FilterType,
      label: "This Week",
      count: thisWeeksEarnings.length,
    },
    {
      id: "nextWeek" as FilterType,
      label: "Next Week",
      count: nextWeeksEarnings.length,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-16">
      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => {
                setActiveFilter(btn.id);
                if (btn.id !== "selected") {
                  setSelectedDate(undefined);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === btn.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              {btn.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeFilter === btn.id
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {btn.count}
              </span>
            </button>
          ))}
          {activeFilter === "selected" && selectedDate && (
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gold/10 text-gold border border-gold/20"
              onClick={() => {
                setActiveFilter("all");
                setSelectedDate(undefined);
              }}
            >
              <CalendarDays className="h-4 w-4" />
              {formatSelectedDate(selectedDate)}
              <span className="text-xs">&times;</span>
            </button>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-surface border border-border/50 rounded-lg p-1">
          <button
            onClick={() => setViewType("calendar")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewType === "calendar"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Calendar
          </button>
          <button
            onClick={() => setViewType("table")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewType === "table"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="h-4 w-4" />
            Table
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Sidebar (Desktop) / Full Width (Mobile when calendar view) */}
        <div
          className={`${
            viewType === "calendar" ? "lg:col-span-1" : "hidden lg:block lg:col-span-1"
          }`}
        >
          <div className="sticky top-4">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gold" />
              Select Date
            </h2>
            <EarningsCalendar
              earnings={allEarnings}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />

            {/* Today's Highlights (only show when not filtering by today) */}
            {activeFilter !== "today" && todaysEarnings.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gold" />
                    Today&apos;s Earnings
                  </h3>
                  <button
                    onClick={() => setActiveFilter("today")}
                    className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    View All
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="bg-surface rounded-xl border border-border/50 overflow-hidden">
                  {todaysEarnings.slice(0, 5).map((earning, i) => (
                    <EarningsCard
                      key={`${earning.symbol}-${i}`}
                      earning={earning}
                      variant="compact"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className={viewType === "calendar" ? "lg:col-span-2" : "lg:col-span-2"}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {activeFilter === "today"
                ? "Today's Earnings"
                : activeFilter === "thisWeek"
                ? "This Week's Earnings"
                : activeFilter === "nextWeek"
                ? "Next Week's Earnings"
                : activeFilter === "selected" && selectedDate
                ? `Earnings for ${formatSelectedDate(selectedDate)}`
                : "All Upcoming Earnings"}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredEarnings.length} companies
            </span>
          </div>

          {filteredEarnings.length === 0 ? (
            <div className="bg-surface rounded-xl border border-border/50 p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                No earnings scheduled for this period
              </p>
            </div>
          ) : viewType === "table" ? (
            <EarningsTable earnings={filteredEarnings} />
          ) : (
            <div className="space-y-4">
              {/* Group by date for calendar view */}
              {(() => {
                const grouped = new Map<string, EarningsCalendarEntry[]>();
                for (const earning of filteredEarnings) {
                  const existing = grouped.get(earning.reportDate) || [];
                  existing.push(earning);
                  grouped.set(earning.reportDate, existing);
                }

                const sortedDates = Array.from(grouped.keys()).sort();

                return sortedDates.map((date) => {
                  const earnings = grouped.get(date) || [];
                  const dateObj = new Date(date);
                  const formattedDate = dateObj.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  });
                  const isToday = date === formatDateKey(new Date());

                  return (
                    <div key={date} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-semibold text-foreground">
                          {formattedDate}
                        </h3>
                        {isToday && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold font-medium">
                            Today
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {earnings.length} reports
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {earnings.map((earning, i) => (
                          <EarningsCard
                            key={`${earning.symbol}-${date}-${i}`}
                            earning={earning}
                            variant="default"
                          />
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
