"use client";

import { TrendingUp, TrendingDown, BarChart3, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface MarketMover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface MarketMoversProps {
  initialGainers?: MarketMover[];
  initialLosers?: MarketMover[];
}

type TabType = "gainers" | "losers";

export function MarketMovers({ initialGainers = [], initialLosers = [] }: MarketMoversProps) {
  const [activeTab, setActiveTab] = useState<TabType>("gainers");
  const [gainers, setGainers] = useState<MarketMover[]>(initialGainers);
  const [losers, setLosers] = useState<MarketMover[]>(initialLosers);
  const [isLoading, setIsLoading] = useState(initialGainers.length === 0);

  // Fetch live market movers
  const fetchMovers = async () => {
    try {
      const response = await fetch("/api/market/movers");
      if (response.ok) {
        const data = await response.json();
        if (data.gainers) setGainers(data.gainers);
        if (data.losers) setLosers(data.losers);
      }
    } catch (error) {
      console.error("Error fetching market movers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately
    fetchMovers();

    // Set up auto-refresh every 60 seconds
    const interval = setInterval(fetchMovers, 60000);

    return () => clearInterval(interval);
  }, []);

  const data = activeTab === "gainers" ? gainers : losers;

  return (
    <div className="rounded-xl bg-surface border border-border/40 p-5 mt-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Market Movers</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg mb-4">
        <Button
          variant={activeTab === "gainers" ? "default" : "ghost"}
          size="sm"
          className={`flex-1 text-xs ${
            activeTab === "gainers"
              ? "bg-positive hover:bg-positive/90 text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("gainers")}
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          Gainers
        </Button>
        <Button
          variant={activeTab === "losers" ? "default" : "ghost"}
          size="sm"
          className={`flex-1 text-xs ${
            activeTab === "losers"
              ? "bg-negative hover:bg-negative/90 text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("losers")}
        >
          <TrendingDown className="h-3 w-3 mr-1" />
          Losers
        </Button>
      </div>

      {/* Stock List */}
      <div className="space-y-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No data available
          </div>
        ) : (
          data.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0"
            >
              {/* Symbol & Name */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  {stock.symbol}
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                  {stock.name}
                </span>
              </div>

              {/* Price & Change */}
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium tabular-nums text-foreground">
                  ${stock.price.toFixed(2)}
                </span>
                <span
                  className={`text-xs font-medium tabular-nums ${
                    stock.change >= 0 ? "text-positive" : "text-negative"
                  }`}
                >
                  {stock.change >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
