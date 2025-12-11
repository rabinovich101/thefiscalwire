"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, Search } from "lucide-react";
import { EarningsTable } from "@/components/stocks";
import type { EarningsCalendarEntry } from "@/lib/alpha-vantage";

interface EarningsPageClientProps {
  allEarnings: EarningsCalendarEntry[];
  todaysEarnings: EarningsCalendarEntry[];
  thisWeeksEarnings: EarningsCalendarEntry[];
}

export function EarningsPageClient({
  allEarnings: initialAllEarnings,
  todaysEarnings: initialTodaysEarnings,
  thisWeeksEarnings: initialThisWeeksEarnings,
}: EarningsPageClientProps) {
  // NASDAQ data already includes enhanced data, so no need to fetch more
  const [isLoadingEnhancedData, setIsLoadingEnhancedData] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalToLoad, setTotalToLoad] = useState(0);
  const [allEarnings, setAllEarnings] = useState(initialAllEarnings);
  const [searchQuery, setSearchQuery] = useState("");
  const eventSourceRef = useRef<EventSource | null>(null);
  const hasStartedLoading = useRef(false);

  // Update a single earnings entry with enhanced data
  const updateEarningsEntry = useCallback((update: Partial<EarningsCalendarEntry> & { symbol: string }) => {
    setAllEarnings(prev =>
      prev.map(e => {
        if (e.symbol === update.symbol) {
          return { ...e, ...update };
        }
        return e;
      })
    );
    setLoadedCount(prev => prev + 1);
  }, []);

  // Fetch expected move data via SSE stream for upcoming earnings
  // NASDAQ provides most data, but expected move comes from Yahoo options
  useEffect(() => {
    if (hasStartedLoading.current || initialAllEarnings.length === 0) {
      return;
    }

    hasStartedLoading.current = true;

    // Get today's date and filter for upcoming earnings (today + future)
    const today = new Date().toISOString().split('T')[0];
    const upcomingEarnings = initialAllEarnings
      .filter(e => e.reportDate >= today)
      .slice(0, 50); // Limit to 50 for performance

    if (upcomingEarnings.length === 0) {
      setIsLoadingEnhancedData(false);
      return;
    }

    setIsLoadingEnhancedData(true);
    setTotalToLoad(upcomingEarnings.length);

    // Build symbol:date pairs to pass to stream
    const symbolDatePairs = upcomingEarnings
      .map(e => `${e.symbol}:${e.reportDate}`)
      .join(",");

    // Use EventSource for Server-Sent Events with symbol:date pairs
    const eventSource = new EventSource(
      `/api/stocks/earnings/stream?expectedMove=true&symbols=${encodeURIComponent(symbolDatePairs)}`
    );
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.done) {
          // Stream completed
          setIsLoadingEnhancedData(false);
          eventSource.close();
          return;
        }

        if (data.error) {
          console.error("Stream error:", data.error);
          setIsLoadingEnhancedData(false);
          eventSource.close();
          return;
        }

        // Update the earnings entry with expected move data
        if (data.expectedMove || data.expectedMovePercent) {
          updateEarningsEntry(data);
        }
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource error:", err);
      setIsLoadingEnhancedData(false);
      eventSource.close();
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
    };
  }, [initialAllEarnings, updateEarningsEntry]);

  // Filter earnings by search query
  const filteredEarnings = searchQuery
    ? allEarnings.filter(e =>
        e.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allEarnings;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-16">
      {/* Header Controls - Yahoo Finance Style */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-foreground">
            Earnings Calendar
          </h2>
          {isLoadingEnhancedData && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              {loadedCount > 0 ? (
                <span>Loading {loadedCount}/{totalToLoad}...</span>
              ) : (
                <span>Loading data...</span>
              )}
            </div>
          )}
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Find earnings for symbols"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 bg-surface border border-border/50 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
          />
        </div>
      </div>

      {/* Main Table */}
      <EarningsTable
        earnings={filteredEarnings}
        showWeekSelector={!searchQuery}
        isLoadingEnhancedData={isLoadingEnhancedData}
      />
    </section>
  );
}
