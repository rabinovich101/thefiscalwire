"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface HeatmapStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  sector: string;
}

interface TreemapData {
  name: string;
  symbol: string;
  size: number;
  changePercent: number;
  price: number;
  change: number;
  marketCap: number;
  sector: string;
  fill: string;
}

// Color scale for percentage changes
function getColorForChange(changePercent: number): string {
  if (changePercent <= -5) return "#991b1b"; // Deep red
  if (changePercent <= -3) return "#dc2626"; // Red
  if (changePercent <= -1) return "#ef4444"; // Light red
  if (changePercent <= -0.5) return "#f87171"; // Very light red
  if (changePercent < 0) return "#fca5a5"; // Pale red
  if (changePercent === 0) return "#6b7280"; // Gray
  if (changePercent < 0.5) return "#86efac"; // Pale green
  if (changePercent < 1) return "#4ade80"; // Very light green
  if (changePercent < 3) return "#22c55e"; // Light green
  if (changePercent < 5) return "#16a34a"; // Green
  return "#15803d"; // Deep green
}

function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
  return `$${marketCap.toFixed(2)}`;
}

function formatPrice(price: number): string {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Custom content renderer for treemap cells
interface CustomContentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  symbol: string;
  changePercent: number;
  fill: string;
  depth: number;
  index: number;
}

const CustomContent = (props: CustomContentProps) => {
  const { x, y, width, height, symbol, changePercent, fill, depth } = props;

  if (depth !== 1) return null;

  // More aggressive thresholds to show text on smaller boxes
  const showSymbol = width > 30 && height > 20;
  const showPercent = width > 45 && height > 35;

  // Dynamic font sizing based on box dimensions
  const symbolFontSize = Math.min(
    Math.max(width / 5, 10),
    Math.max(height / 3, 10),
    16
  );
  const percentFontSize = Math.min(symbolFontSize - 2, 12);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke="#0f172a"
        strokeWidth={1}
        rx={2}
        className="cursor-pointer transition-opacity hover:opacity-80"
      />
      {showSymbol && (
        <>
          {/* Text shadow for better contrast */}
          <text
            x={x + width / 2}
            y={y + height / 2 - (showPercent ? 7 : 0)}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#000000"
            fontSize={symbolFontSize}
            fontWeight="bold"
            className="pointer-events-none"
            style={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            }}
          >
            {symbol}
          </text>
          {/* Main text - bright white */}
          <text
            x={x + width / 2}
            y={y + height / 2 - (showPercent ? 7 : 0)}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ffffff"
            fontSize={symbolFontSize}
            fontWeight="bold"
            className="pointer-events-none"
            style={{
              textShadow: '0 1px 3px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.5)',
            }}
          >
            {symbol}
          </text>
        </>
      )}
      {showPercent && (
        <>
          {/* Percentage text shadow */}
          <text
            x={x + width / 2}
            y={y + height / 2 + 9}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#000000"
            fontSize={percentFontSize}
            fontWeight="600"
            className="pointer-events-none"
          >
            {changePercent >= 0 ? "+" : ""}
            {changePercent.toFixed(2)}%
          </text>
          {/* Main percentage text - bright white */}
          <text
            x={x + width / 2}
            y={y + height / 2 + 9}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ffffff"
            fontSize={percentFontSize}
            fontWeight="600"
            className="pointer-events-none"
            style={{
              textShadow: '0 1px 3px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.5)',
            }}
          >
            {changePercent >= 0 ? "+" : ""}
            {changePercent.toFixed(2)}%
          </text>
        </>
      )}
    </g>
  );
};

// Custom tooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: TreemapData;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const isPositive = data.changePercent >= 0;

  return (
    <div className="bg-surface border border-border rounded-lg shadow-xl p-4 min-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg">{data.symbol}</span>
        <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
          {data.sector}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-3 truncate">{data.name}</p>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Price</span>
          <span className="font-medium">{formatPrice(data.price)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Change</span>
          <span className={`font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? "+" : ""}
            {data.change.toFixed(2)} ({isPositive ? "+" : ""}
            {data.changePercent.toFixed(2)}%)
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Market Cap</span>
          <span className="font-medium">{formatMarketCap(data.marketCap)}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">Click to view details</p>
      </div>
    </div>
  );
};

export function StockHeatmap() {
  const [index, setIndex] = useState<"sp500" | "nasdaq">("sp500");
  const [stocks, setStocks] = useState<HeatmapStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/stocks/heatmap?index=${index}`);
      if (!response.ok) throw new Error("Failed to fetch heatmap data");
      const data = await response.json();
      setStocks(data.stocks);
    } catch (err) {
      console.error("Error fetching heatmap:", err);
      setError("Failed to load heatmap data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [index]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Transform data for treemap
  const treemapData = useMemo(() => {
    return stocks.map((stock) => ({
      name: stock.name,
      symbol: stock.symbol,
      size: stock.marketCap,
      changePercent: stock.changePercent,
      price: stock.price,
      change: stock.change,
      marketCap: stock.marketCap,
      sector: stock.sector,
      fill: getColorForChange(stock.changePercent),
    }));
  }, [stocks]);

  // Handle click on treemap cell
  const handleClick = (data: TreemapData) => {
    if (data?.symbol) {
      window.location.href = `/stocks/${data.symbol}`;
    }
  };

  // Calculate market stats
  const stats = useMemo(() => {
    if (stocks.length === 0) return null;

    const gainers = stocks.filter((s) => s.changePercent > 0).length;
    const losers = stocks.filter((s) => s.changePercent < 0).length;
    const unchanged = stocks.length - gainers - losers;
    const avgChange = stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length;

    return { gainers, losers, unchanged, avgChange };
  }, [stocks]);

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Market Heatmap</h2>
          <p className="text-muted-foreground">
            Visualize market performance by market cap
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Select value={index} onValueChange={(v) => setIndex(v as "sp500" | "nasdaq")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Index" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sp500">S&P 500 Top 100</SelectItem>
              <SelectItem value="nasdaq">NASDAQ-100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats bar */}
      {stats && !loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-surface border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{stats.gainers}</p>
            <p className="text-sm text-muted-foreground">Advancing</p>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{stats.losers}</p>
            <p className="text-sm text-muted-foreground">Declining</p>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-500">{stats.unchanged}</p>
            <p className="text-sm text-muted-foreground">Unchanged</p>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4 text-center">
            <p className={`text-2xl font-bold ${stats.avgChange >= 0 ? "text-green-500" : "text-red-500"}`}>
              {stats.avgChange >= 0 ? "+" : ""}{stats.avgChange.toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground">Avg Change</p>
          </div>
        </div>
      )}

      {/* Color legend */}
      <div className="flex items-center justify-center gap-1 text-sm">
        <span className="text-muted-foreground mr-2">Change:</span>
        <div className="flex items-center gap-1">
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#991b1b" }} />
          <span className="text-xs text-muted-foreground">-5%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#dc2626" }} />
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#ef4444" }} />
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#fca5a5" }} />
          <span className="text-xs text-muted-foreground">0%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#86efac" }} />
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#22c55e" }} />
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#15803d" }} />
          <span className="text-xs text-muted-foreground">+5%</span>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-surface border border-border rounded-xl p-4">
        {loading ? (
          <div className="h-[600px] flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading {index === "sp500" ? "S&P 500" : "NASDAQ-100"} data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-[600px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={600}>
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#1f2937"
              content={<CustomContent x={0} y={0} width={0} height={0} name="" symbol="" changePercent={0} fill="" depth={0} index={0} />}
              onClick={handleClick}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        )}
      </div>

      {/* Help text */}
      <p className="text-center text-sm text-muted-foreground">
        Box size represents market capitalization. Click on any stock to view details.
      </p>
    </div>
  );
}
