"use client";

import { useState, useEffect } from "react";
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
  // Start with loading=true so skeleton shows immediately
  const [isLoadingEnhancedData, setIsLoadingEnhancedData] = useState(true);
  const [enhancedDataLoaded, setEnhancedDataLoaded] = useState(false);
  const [allEarnings, setAllEarnings] = useState(initialAllEarnings);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch enhanced data (report timing + market cap) on component mount
  useEffect(() => {
    const fetchEnhancedData = async () => {
      if (enhancedDataLoaded || initialThisWeeksEarnings.length === 0) return;

      setIsLoadingEnhancedData(true);
      try {
        // Fetch enhanced data for this week's earnings
        const response = await fetch(`/api/stocks/earnings?filter=thisWeek&expectedMove=true`);
        if (response.ok) {
          const data = await response.json();
          const earningsWithData: EarningsCalendarEntry[] = data.earnings;

          // Create a map of symbol -> enhanced data
          const enhancedDataMap = new Map<string, Partial<EarningsCalendarEntry>>();
          earningsWithData.forEach(e => {
            const enhancedData: Partial<EarningsCalendarEntry> = {};

            // Add expected move data if available
            if (e.expectedMovePercent !== undefined) {
              enhancedData.stockPrice = e.stockPrice;
              enhancedData.expectedMove = e.expectedMove;
              enhancedData.expectedMovePercent = e.expectedMovePercent;
              enhancedData.impliedVolatility = e.impliedVolatility;
            }

            // Add report timing data if available
            if (e.reportTime) {
              enhancedData.reportTime = e.reportTime;
            }

            // Add market cap data if available
            if (e.marketCap) {
              enhancedData.marketCap = e.marketCap;
            }

            if (Object.keys(enhancedData).length > 0) {
              enhancedDataMap.set(e.symbol, enhancedData);
            }
          });

          // Update all earnings with enhanced data
          const updateEarnings = (earnings: EarningsCalendarEntry[]) =>
            earnings.map(e => {
              const enhancedData = enhancedDataMap.get(e.symbol);
              return enhancedData ? { ...e, ...enhancedData } : e;
            });

          setAllEarnings(updateEarnings(initialAllEarnings));
          setEnhancedDataLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching enhanced earnings data:", error);
      } finally {
        setIsLoadingEnhancedData(false);
      }
    };

    fetchEnhancedData();
  }, [initialAllEarnings, initialTodaysEarnings, initialThisWeeksEarnings, enhancedDataLoaded]);

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
              Loading data...
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
