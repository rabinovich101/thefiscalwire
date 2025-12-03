"use client";

import { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Period = "1d" | "5d" | "1mo" | "6mo" | "ytd" | "1y" | "5y" | "max";

interface ChartDataPoint {
  time: string;
  timestamp: number;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

interface ChartSummary {
  firstPrice: number;
  lastPrice: number;
  priceChange: number;
  percentChange: number;
  high: number;
  low: number;
}

interface StockChartProps {
  symbol: string;
  initialData?: ChartDataPoint[];
  className?: string;
}

const PERIODS: { value: Period; label: string }[] = [
  { value: "1d", label: "1D" },
  { value: "5d", label: "5D" },
  { value: "1mo", label: "1M" },
  { value: "6mo", label: "6M" },
  { value: "ytd", label: "YTD" },
  { value: "1y", label: "1Y" },
  { value: "5y", label: "5Y" },
  { value: "max", label: "MAX" },
];

export function StockChart({ symbol, initialData, className }: StockChartProps) {
  const [period, setPeriod] = useState<Period>("1mo");
  const [data, setData] = useState<ChartDataPoint[]>(initialData || []);
  const [summary, setSummary] = useState<ChartSummary | null>(null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [hoveredData, setHoveredData] = useState<ChartDataPoint | null>(null);

  useEffect(() => {
    const fetchChart = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/stocks/${symbol}/chart?period=${period}`);
        const result = await res.json();
        setData(result.data || []);
        setSummary(result.summary || null);
      } catch (error) {
        console.error("Failed to fetch chart:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChart();
  }, [symbol, period]);

  const isPositive = useMemo(() => {
    if (!summary) return true;
    return summary.priceChange >= 0;
  }, [summary]);

  const chartColor = isPositive ? "var(--positive)" : "var(--negative)";
  const chartColorFaded = isPositive
    ? "rgba(34, 197, 94, 0.1)"
    : "rgba(239, 68, 68, 0.1)";

  const displayPrice = hoveredData?.price ?? summary?.lastPrice ?? 0;
  const displayChange = summary?.priceChange ?? 0;
  const displayPercent = summary?.percentChange ?? 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Calculate Y-axis domain with padding
  const yDomain = useMemo(() => {
    if (data.length === 0) return [0, 100];
    const prices = data.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1;
    return [min - padding, max + padding];
  }, [data]);

  // Reference line at first price
  const referencePrice = summary?.firstPrice || (data[0]?.price ?? 0);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Chart Header with Period Hover Stats */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-1">
          {hoveredData && (
            <p className="text-sm text-muted-foreground">
              {hoveredData.time}
            </p>
          )}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold tabular-nums tracking-tight">
              {formatPrice(displayPrice)}
            </span>
            {!hoveredData && summary && (
              <div className="flex items-center gap-1.5">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-positive" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-negative" />
                )}
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    isPositive ? "text-positive" : "text-negative"
                  )}
                >
                  {displayChange >= 0 ? "+" : ""}
                  {displayChange.toFixed(2)} ({displayPercent >= 0 ? "+" : ""}
                  {displayPercent.toFixed(2)}%)
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {PERIODS.find((p) => p.value === period)?.label} Performance
          </p>
        </div>

        {/* Period Selector - Apple Style Segmented Control */}
        <div className="flex p-1 bg-muted/50 rounded-xl">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
                period === p.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-[350px] sm:h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/50 rounded-xl">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            No chart data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              onMouseMove={(e) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const payload = (e as any)?.activePayload?.[0]?.payload;
                if (payload) {
                  setHoveredData(payload);
                }
              }}
              onMouseLeave={() => setHoveredData(null)}
            >
              <defs>
                <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                dy={10}
                interval="preserveStartEnd"
                minTickGap={50}
              />

              <YAxis
                domain={yDomain}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                dx={-10}
                width={60}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const point = payload[0].payload as ChartDataPoint;
                  return (
                    <div className="bg-popover border border-border rounded-xl px-4 py-3 shadow-xl">
                      <p className="text-sm text-muted-foreground mb-1">
                        {point.time}
                      </p>
                      <p className="text-lg font-bold tabular-nums">
                        {formatPrice(point.price)}
                      </p>
                      {point.volume && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Vol: {(point.volume / 1000000).toFixed(2)}M
                        </p>
                      )}
                    </div>
                  );
                }}
                cursor={{
                  stroke: "var(--muted-foreground)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />

              {/* Reference Line at Starting Price */}
              <ReferenceLine
                y={referencePrice}
                stroke="var(--muted-foreground)"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
              />

              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                fill={`url(#gradient-${symbol})`}
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Chart Footer Stats */}
      {summary && !isLoading && (
        <div className="flex justify-between pt-4 border-t border-border/50">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Period High
            </p>
            <p className="text-sm font-semibold tabular-nums text-positive">
              {formatPrice(summary.high)}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Period Low
            </p>
            <p className="text-sm font-semibold tabular-nums text-negative">
              {formatPrice(summary.low)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
