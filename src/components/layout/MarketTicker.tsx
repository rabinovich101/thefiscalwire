"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface TickerItemProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

function TickerItem({ symbol, name, price, change, changePercent }: TickerItemProps) {
  const isPositive = change >= 0;

  return (
    <div className="flex items-center gap-3 px-4 border-r border-border/40 last:border-r-0">
      <div className="flex flex-col">
        <span className="text-xs font-medium text-muted-foreground">{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tabular-nums text-foreground">
            {price.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <div className={`flex items-center gap-0.5 ${isPositive ? "text-positive" : "text-negative"}`}>
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span className="text-xs font-medium tabular-nums">
              {isPositive ? "+" : ""}
              {changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MarketTickerProps {
  initialIndices?: MarketIndex[];
}

export function MarketTicker({ initialIndices = [] }: MarketTickerProps) {
  const [indices, setIndices] = useState<MarketIndex[]>(initialIndices);
  const [isLoading, setIsLoading] = useState(initialIndices.length === 0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch live data
  const fetchQuotes = async () => {
    try {
      const response = await fetch("/api/market/quotes");
      if (response.ok) {
        const data = await response.json();
        setIndices(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Error fetching market quotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately
    fetchQuotes();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchQuotes, 30000);

    return () => clearInterval(interval);
  }, []);

  // Use initial indices while loading, then switch to live data
  const displayIndices = indices.length > 0 ? indices : initialIndices;

  // Duplicate items for seamless scrolling
  const allItems = [...displayIndices, ...displayIndices];

  if (displayIndices.length === 0 && isLoading) {
    return (
      <div className="sticky top-16 z-40 w-full border-b border-border/40 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
        <div className="h-12 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Loading market data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-16 z-40 w-full border-b border-border/40 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="relative h-12 overflow-hidden">
        {/* Market Status Indicator */}
        <div className="absolute left-0 top-0 z-10 flex h-full items-center bg-surface px-4 border-r border-border/40">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-positive"></span>
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Live
            </span>
          </div>
        </div>

        {/* Scrolling Ticker */}
        <div className="flex h-full items-center animate-ticker pl-24">
          {allItems.map((item, index) => (
            <TickerItem
              key={`${item.symbol}-${index}`}
              {...item}
            />
          ))}
        </div>

        {/* Gradient Fade Right */}
        <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-surface to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
