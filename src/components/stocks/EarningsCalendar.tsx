"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EarningsCalendarEntry } from "@/lib/alpha-vantage";

interface EarningsCalendarProps {
  earnings: EarningsCalendarEntry[];
  onDateSelect?: (date: Date | undefined) => void;
  selectedDate?: Date;
  className?: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function EarningsCalendar({
  earnings,
  onDateSelect,
  selectedDate,
  className,
}: EarningsCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Group earnings by date
  const earningsByDate = useMemo(() => {
    const map = new Map<string, EarningsCalendarEntry[]>();
    for (const earning of earnings) {
      const existing = map.get(earning.reportDate) || [];
      existing.push(earning);
      map.set(earning.reportDate, existing);
    }
    return map;
  }, [earnings]);

  // Get max earnings count for heat intensity calculation
  const maxEarnings = useMemo(() => {
    let max = 0;
    earningsByDate.forEach((list) => {
      if (list.length > max) max = list.length;
    });
    return max || 1;
  }, [earningsByDate]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Fill remaining slots to complete the grid (6 rows x 7 days = 42)
    while (days.length < 42) {
      days.push(null);
    }

    return days;
  }, [currentMonth]);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    onDateSelect?.(new Date());
  };

  const formatDateKey = (date: Date) => {
    // Use local date components to avoid UTC timezone conversion issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getHeatIntensity = (count: number) => {
    if (count === 0) return 0;
    // Scale from 0.15 to 1 based on count relative to max
    return 0.15 + (count / maxEarnings) * 0.85;
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl",
      "bg-gradient-to-br from-surface via-surface to-surface/80",
      "border border-border/50",
      "shadow-xl shadow-black/5",
      className
    )}>
      {/* Decorative gradient orbs */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">
                {MONTHS[currentMonth.getMonth()]}
              </h3>
              <p className="text-xs text-muted-foreground">
                {currentMonth.getFullYear()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-xs font-medium text-primary hover:text-primary/80
                         bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors
                         border border-primary/10 hover:border-primary/20"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground
                         hover:bg-muted/50 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateMonth("next")}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground
                         hover:bg-muted/50 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="px-5">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="text-center text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-widest py-2"
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="px-5 pb-5">
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateKey = formatDateKey(date);
            const dayEarnings = earningsByDate.get(dateKey) || [];
            const count = dayEarnings.length;
            const intensity = getHeatIntensity(count);
            const dayIsToday = isToday(date);
            const dayIsSelected = isSelected(date);

            return (
              <button
                key={dateKey}
                onClick={() => onDateSelect?.(date)}
                className={cn(
                  "relative aspect-square rounded-xl transition-all duration-200",
                  "flex flex-col items-center justify-center gap-0.5",
                  "hover:scale-105 hover:z-10",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 focus:ring-offset-background",
                  // Base states
                  !count && !dayIsToday && !dayIsSelected && "hover:bg-muted/50",
                  // Has earnings - gradient background with intensity
                  count > 0 && !dayIsSelected && "group",
                  // Today highlight
                  dayIsToday && !dayIsSelected && "ring-2 ring-gold/50 ring-inset",
                  // Selected state
                  dayIsSelected && "bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25"
                )}
                style={
                  count > 0 && !dayIsSelected
                    ? {
                        background: `linear-gradient(135deg,
                          rgba(var(--primary-rgb, 59, 130, 246), ${intensity * 0.15}) 0%,
                          rgba(var(--primary-rgb, 59, 130, 246), ${intensity * 0.25}) 100%)`,
                      }
                    : undefined
                }
              >
                {/* Glow effect for today */}
                {dayIsToday && !dayIsSelected && (
                  <div className="absolute inset-0 rounded-xl bg-gold/10 animate-pulse" />
                )}

                {/* Sparkle for high earnings days */}
                {count >= 30 && !dayIsSelected && (
                  <Sparkles className="absolute top-0.5 right-0.5 w-3 h-3 text-gold animate-pulse" />
                )}

                {/* Day number */}
                <span
                  className={cn(
                    "text-sm font-medium transition-colors relative z-10",
                    dayIsSelected && "text-primary-foreground font-semibold",
                    dayIsToday && !dayIsSelected && "text-gold font-bold",
                    count > 0 && !dayIsSelected && !dayIsToday && "text-primary font-semibold",
                    !count && !dayIsToday && !dayIsSelected && "text-foreground/80"
                  )}
                >
                  {date.getDate()}
                </span>

                {/* Earnings count badge */}
                {count > 0 && (
                  <div
                    className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none relative z-10",
                      "transition-all duration-200",
                      dayIsSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : count >= 50
                        ? "bg-gradient-to-r from-gold to-amber-500 text-white shadow-sm shadow-gold/30"
                        : count >= 20
                        ? "bg-primary/30 text-primary"
                        : "bg-primary/20 text-primary/90"
                    )}
                  >
                    {count}
                  </div>
                )}

                {/* Dot indicators for low count days */}
                {count > 0 && count < 5 && !dayIsSelected && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full bg-primary/60"
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <div className="flex items-center gap-4">
            {/* Heat scale */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Density</span>
              <div className="flex gap-0.5">
                {[0.15, 0.3, 0.5, 0.7, 1].map((intensity, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      background: `rgba(59, 130, 246, ${intensity * 0.3})`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm ring-2 ring-gold/50 ring-inset" />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-primary to-primary/80" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-gold" />
              <span>30+ Reports</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
