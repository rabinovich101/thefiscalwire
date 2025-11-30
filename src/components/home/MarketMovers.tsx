"use client";

import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MarketMover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface MarketMoversProps {
  gainers: MarketMover[];
  losers: MarketMover[];
}

type TabType = "gainers" | "losers";

export function MarketMovers({ gainers, losers }: MarketMoversProps) {
  const [activeTab, setActiveTab] = useState<TabType>("gainers");

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
        {data.map((stock) => (
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
        ))}
      </div>
    </div>
  );
}
