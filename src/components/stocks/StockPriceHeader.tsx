"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Clock, Building2, Globe, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockData {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  type: string;
  price: number;
  previousClose: number;
  open?: number;
  dayHigh?: number;
  dayLow?: number;
  change: number;
  changePercent: number;
  marketState: string;
  preMarketPrice?: number;
  preMarketChange?: number;
  preMarketChangePercent?: number;
  postMarketPrice?: number;
  postMarketChange?: number;
  postMarketChangePercent?: number;
  sector?: string;
  industry?: string;
  website?: string;
}

interface StockPriceHeaderProps {
  stock: StockData;
}

export function StockPriceHeader({ stock }: StockPriceHeaderProps) {
  const [currentPrice, setCurrentPrice] = useState(stock.price);
  const [isUpdating, setIsUpdating] = useState(false);

  const isPositive = stock.change >= 0;
  const marketOpen = stock.marketState === "REGULAR";

  // Simulated real-time updates (refresh every 30 seconds)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setIsUpdating(true);
        const res = await fetch(`/api/stocks/${stock.symbol}/quote`);
        const data = await res.json();
        if (data.price) {
          setCurrentPrice(data.price);
        }
      } catch (error) {
        console.error("Failed to refresh price:", error);
      } finally {
        setIsUpdating(false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [stock.symbol]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: stock.currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number, percent: number) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
  };

  const getMarketStateLabel = () => {
    switch (stock.marketState) {
      case "PRE":
        return "Pre-Market";
      case "REGULAR":
        return "Market Open";
      case "POST":
        return "After Hours";
      case "CLOSED":
        return "Market Closed";
      default:
        return stock.marketState;
    }
  };

  return (
    <div className="space-y-6">
      {/* Company Info Row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          {/* Symbol and Name */}
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {stock.symbol}
            </h1>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                marketOpen
                  ? "bg-positive/10 text-positive"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  marketOpen ? "bg-positive animate-pulse" : "bg-muted-foreground"
                )}
              />
              {getMarketStateLabel()}
            </span>
          </div>

          {/* Company Name */}
          <p className="text-lg text-muted-foreground font-medium">
            {stock.name}
          </p>

          {/* Exchange and Type */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              {stock.exchange}
            </span>
            {stock.sector && (
              <span className="px-2 py-0.5 bg-muted/50 rounded text-xs">
                {stock.sector}
              </span>
            )}
            {stock.industry && (
              <span className="px-2 py-0.5 bg-muted/50 rounded text-xs">
                {stock.industry}
              </span>
            )}
            {stock.website && (
              <a
                href={stock.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <Globe className="h-3.5 w-3.5" />
                Website
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Price Display - Apple/Google Inspired Large Typography */}
      <div className="space-y-3">
        {/* Main Price */}
        <div className="flex items-baseline gap-4">
          <span
            className={cn(
              "text-5xl sm:text-6xl font-bold tracking-tighter tabular-nums",
              "transition-opacity duration-300",
              isUpdating && "opacity-50"
            )}
          >
            {formatPrice(currentPrice)}
          </span>
          <span className="text-lg text-muted-foreground font-medium">
            {stock.currency}
          </span>
        </div>

        {/* Change Indicator */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-xl",
              isPositive ? "bg-positive/10" : "bg-negative/10"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-positive" />
            ) : (
              <TrendingDown className="h-5 w-5 text-negative" />
            )}
            <span
              className={cn(
                "text-lg font-semibold tabular-nums",
                isPositive ? "text-positive" : "text-negative"
              )}
            >
              {formatChange(stock.change, stock.changePercent)}
            </span>
          </div>
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            Today
          </span>
        </div>

        {/* Pre/Post Market Prices */}
        {stock.marketState === "PRE" && stock.preMarketPrice && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">Pre-Market:</span>
            <span className="tabular-nums">{formatPrice(stock.preMarketPrice)}</span>
            <span
              className={cn(
                "tabular-nums",
                (stock.preMarketChange || 0) >= 0 ? "text-positive" : "text-negative"
              )}
            >
              {formatChange(stock.preMarketChange || 0, stock.preMarketChangePercent || 0)}
            </span>
          </div>
        )}

        {stock.marketState === "POST" && stock.postMarketPrice && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">After Hours:</span>
            <span className="tabular-nums">{formatPrice(stock.postMarketPrice)}</span>
            <span
              className={cn(
                "tabular-nums",
                (stock.postMarketChange || 0) >= 0 ? "text-positive" : "text-negative"
              )}
            >
              {formatChange(stock.postMarketChange || 0, stock.postMarketChangePercent || 0)}
            </span>
          </div>
        )}
      </div>

      {/* Quick Stats Bar */}
      <div className="flex flex-wrap gap-6 pt-4 border-t border-border/50">
        <QuickStat label="Previous Close" value={formatPrice(stock.previousClose)} />
        <QuickStat
          label="Day Range"
          value={`${formatPrice(stock.dayLow || 0)} - ${formatPrice(stock.dayHigh || 0)}`}
        />
      </div>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
        {label}
      </p>
      <p className="text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}

// Extended props for the full header
interface ExtendedStockData extends StockData {
  dayHigh?: number;
  dayLow?: number;
}

export function StockPriceHeaderFull({ stock }: { stock: ExtendedStockData }) {
  return <StockPriceHeader stock={stock} />;
}
