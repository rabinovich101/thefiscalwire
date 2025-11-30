"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { ChartDataPoint } from "@/data/mockData";

interface InlineStockChartProps {
  symbol: string;
  data: ChartDataPoint[];
}

export function InlineStockChart({ symbol, data }: InlineStockChartProps) {
  // Calculate if the stock is up or down
  const firstValue = data[0]?.value ?? 0;
  const lastValue = data[data.length - 1]?.value ?? 0;
  const isPositive = lastValue >= firstValue;
  const change = lastValue - firstValue;
  const changePercent = ((change / firstValue) * 100).toFixed(2);

  // Format value based on magnitude (for BTC vs stocks)
  const formatValue = (value: number) => {
    if (value >= 1000) {
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="my-8 p-4 sm:p-6 bg-surface rounded-xl border border-border">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-foreground">{symbol}</span>
          <span className="text-2xl font-bold text-foreground tabular-nums">
            {formatValue(lastValue)}
          </span>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded ${
            isPositive ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative"
          }`}
        >
          <span className="text-sm font-medium tabular-nums">
            {isPositive ? "+" : ""}
            {changePercent}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositive ? "#22c55e" : "#ef4444"}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? "#22c55e" : "#ef4444"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#262626"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#737373", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              domain={["dataMin - 5", "dataMax + 5"]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#737373", fontSize: 12 }}
              tickFormatter={(value) => formatValue(value)}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #262626",
                borderRadius: "8px",
                padding: "12px",
              }}
              labelStyle={{ color: "#737373", marginBottom: "4px" }}
              formatter={(value: number) => [formatValue(value), "Price"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "#22c55e" : "#ef4444"}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#gradient-${symbol})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Last 30 days</span>
        <span>Data for illustration purposes only</span>
      </div>
    </div>
  );
}
