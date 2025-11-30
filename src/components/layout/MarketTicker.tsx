"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { marketIndices } from "@/data/mockData";

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

export function MarketTicker() {
  // Duplicate items for seamless scrolling
  const allItems = [...marketIndices, ...marketIndices];

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
