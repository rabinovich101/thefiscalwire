"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrendingStock } from "@/lib/yahoo-finance";

interface TrendingStockCardProps {
  stock: TrendingStock;
  rank?: number;
  variant?: "default" | "compact" | "featured";
}

export function TrendingStockCard({ stock, rank, variant = "default" }: TrendingStockCardProps) {
  const isPositive = stock.changePercent >= 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatLargeNumber = (value: number) => {
    if (!value) return "—";
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatVolume = (volume: number) => {
    if (!volume) return "—";
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
    return volume.toString();
  };

  // Calculate volume ratio (current vs average)
  const volumeRatio = stock.avgVolume > 0 ? stock.volume / stock.avgVolume : 0;
  const isHighVolume = volumeRatio > 1.5;

  // Calculate 52-week position
  const weekRange = stock.fiftyTwoWeekHigh - stock.fiftyTwoWeekLow;
  const weekPosition = weekRange > 0
    ? ((stock.price - stock.fiftyTwoWeekLow) / weekRange) * 100
    : 50;

  if (variant === "compact") {
    return (
      <Link
        href={`/stocks/${stock.symbol}`}
        className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          {rank && (
            <span className="text-xs font-medium text-muted-foreground w-5 text-center">
              {rank}
            </span>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{stock.symbol}</span>
              {isHighVolume && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                  HIGH VOL
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="font-semibold tabular-nums">{formatPrice(stock.price)}</p>
          <p className={cn(
            "text-xs font-medium tabular-nums flex items-center justify-end gap-0.5",
            isPositive ? "text-positive" : "text-negative"
          )}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/stocks/${stock.symbol}`}
        className="group block bg-surface rounded-2xl border border-border/50 p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {rank && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                {rank}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {stock.symbol}
                </h3>
                {isHighVolume && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold font-semibold animate-pulse">
                    TRENDING
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate max-w-[200px]">{stock.name}</p>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-semibold",
            isPositive ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative"
          )}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%
          </div>
        </div>

        {/* Price Section */}
        <div className="mb-6">
          <div className="text-3xl font-bold tabular-nums text-foreground">
            {formatPrice(stock.price)}
          </div>
          <div className={cn(
            "text-sm tabular-nums mt-1",
            isPositive ? "text-positive" : "text-negative"
          )}>
            {isPositive ? "+" : ""}{formatPrice(stock.change)} today
          </div>
        </div>

        {/* 52-Week Range */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>52W Low: {formatPrice(stock.fiftyTwoWeekLow)}</span>
            <span>52W High: {formatPrice(stock.fiftyTwoWeekHigh)}</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-negative via-gold to-positive rounded-full"
              style={{ width: "100%" }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-foreground rounded-full border-2 border-background shadow-lg"
              style={{ left: `calc(${Math.min(100, Math.max(0, weekPosition))}% - 6px)` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Market Cap</div>
            <div className="text-sm font-semibold text-foreground">{formatLargeNumber(stock.marketCap)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Volume</div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground">{formatVolume(stock.volume)}</span>
              {isHighVolume && <Activity className="h-3.5 w-3.5 text-gold" />}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">P/E Ratio</div>
            <div className="text-sm font-semibold text-foreground">
              {stock.trailingPE?.toFixed(2) || "—"}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">EPS</div>
            <div className="text-sm font-semibold text-foreground">
              {stock.eps ? formatPrice(stock.eps) : "—"}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      href={`/stocks/${stock.symbol}`}
      className="group block bg-surface rounded-xl border border-border/50 p-4 hover:border-primary/30 hover:bg-surface/80 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {rank && (
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              {rank}
            </span>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {stock.symbol}
              </span>
              {isHighVolume && (
                <Activity className="h-3.5 w-3.5 text-gold" />
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate max-w-[140px]">{stock.name}</p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-full",
          isPositive ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative"
        )}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-xl font-bold tabular-nums">{formatPrice(stock.price)}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Vol: {formatVolume(stock.volume)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Mkt Cap</div>
          <div className="text-sm font-medium text-foreground">{formatLargeNumber(stock.marketCap)}</div>
        </div>
      </div>

      {/* Mini 52-week range indicator */}
      <div className="mt-3 pt-3 border-t border-border/30">
        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-negative/50 via-gold/50 to-positive/50 rounded-full w-full" />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-foreground rounded-full"
            style={{ left: `calc(${Math.min(100, Math.max(0, weekPosition))}% - 4px)` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
          <span>52W: {formatPrice(stock.fiftyTwoWeekLow)}</span>
          <span>{formatPrice(stock.fiftyTwoWeekHigh)}</span>
        </div>
      </div>
    </Link>
  );
}

// Mini spark line component for visual appeal
export function MiniSparkline({ positive }: { positive: boolean }) {
  return (
    <div className="w-16 h-6 relative">
      <svg viewBox="0 0 64 24" className="w-full h-full">
        <path
          d={positive
            ? "M0,20 L8,18 L16,16 L24,14 L32,12 L40,8 L48,6 L56,4 L64,2"
            : "M0,4 L8,6 L16,8 L24,10 L32,12 L40,16 L48,18 L56,20 L64,22"}
          fill="none"
          stroke={positive ? "var(--positive)" : "var(--negative)"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
