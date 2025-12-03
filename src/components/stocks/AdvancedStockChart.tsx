"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createChart,
  ColorType,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  HistogramData,
  LineData,
  Time,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  HistogramSeries,
} from "lightweight-charts";

type Period = "1d" | "5d" | "1mo" | "6mo" | "ytd" | "1y" | "5y" | "max";

interface OHLCData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface AdvancedStockChartProps {
  symbol: string;
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

type ChartType = "candlestick" | "line" | "area";
type IndicatorType = "volume" | "sma" | "ema" | "none";
type Interval = "1m" | "5m" | "15m" | "30m" | "1h" | "1d" | "1wk" | "1mo";

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: "candlestick", label: "Candle" },
  { value: "line", label: "Line" },
  { value: "area", label: "Area" },
];

const INDICATORS: { value: IndicatorType; label: string }[] = [
  { value: "volume", label: "Volume" },
  { value: "sma", label: "SMA (20/50)" },
  { value: "ema", label: "EMA (12/26)" },
  { value: "none", label: "None" },
];

const INTERVALS: { value: Interval; label: string }[] = [
  { value: "1m", label: "1m" },
  { value: "5m", label: "5m" },
  { value: "15m", label: "15m" },
  { value: "30m", label: "30m" },
  { value: "1h", label: "1H" },
  { value: "1d", label: "1D" },
  { value: "1wk", label: "1W" },
  { value: "1mo", label: "1M" },
];

// Get valid intervals based on selected period
// Yahoo Finance API limitations:
// - 1m/5m/15m/30m: only available for last 7 days
// - 1h: only available for last 730 days (~2 years)
// - 1d/1wk/1mo: available for all time
function getValidIntervals(period: Period): Interval[] {
  switch (period) {
    case "1d":
      // 1 day: all intraday intervals work
      return ["1m", "5m", "15m", "30m", "1h"];
    case "5d":
      // 5 days: all intraday intervals work
      return ["1m", "5m", "15m", "30m", "1h"];
    case "1mo":
      // 1 month: only 1h and daily work (minute data not available beyond 7 days)
      return ["1h", "1d"];
    case "6mo":
      // 6 months: only daily and weekly work
      return ["1d", "1wk"];
    case "ytd":
      // YTD: only daily and weekly work
      return ["1d", "1wk"];
    case "1y":
      // 1 year: only daily, weekly, monthly work
      return ["1d", "1wk", "1mo"];
    case "5y":
      // 5 years: daily and larger intervals
      return ["1d", "1wk", "1mo"];
    case "max":
      // Max history: daily, weekly and monthly
      return ["1d", "1wk", "1mo"];
    default:
      return ["1d"];
  }
}

// Get default interval for period
function getDefaultInterval(period: Period): Interval {
  switch (period) {
    case "1d":
      return "5m";
    case "5d":
      return "15m";
    case "1mo":
      return "1h";
    case "6mo":
    case "ytd":
    case "1y":
      return "1d";
    case "5y":
      return "1wk";
    case "max":
      return "1mo";
    default:
      return "1d";
  }
}

// Simple Moving Average calculation
function calculateSMA(data: OHLCData[], period: number): LineData[] {
  const result: LineData[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    result.push({
      time: data[i].time,
      value: sum / period,
    });
  }
  return result;
}

// Exponential Moving Average calculation
function calculateEMA(data: OHLCData[], period: number): LineData[] {
  const result: LineData[] = [];
  const multiplier = 2 / (period + 1);

  // Start with SMA for first value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }
  let ema = sum / period;
  result.push({ time: data[period - 1].time, value: ema });

  // Calculate EMA for remaining values
  for (let i = period; i < data.length; i++) {
    ema = (data[i].close - ema) * multiplier + ema;
    result.push({ time: data[i].time, value: ema });
  }
  return result;
}

export function AdvancedStockChart({ symbol, className }: AdvancedStockChartProps) {
  const [period, setPeriod] = useState<Period>("6mo");
  const [interval, setInterval] = useState<Interval>("1d");
  const [chartType, setChartType] = useState<ChartType>("candlestick");
  const [indicator, setIndicator] = useState<IndicatorType>("volume");
  const [rawData, setRawData] = useState<OHLCData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Update interval when period changes
  useEffect(() => {
    const validIntervals = getValidIntervals(period);
    if (!validIntervals.includes(interval)) {
      setInterval(getDefaultInterval(period));
    }
  }, [period, interval]);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<"Candlestick"> | ISeriesApi<"Line"> | ISeriesApi<"Area"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const smaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const emaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  // Fetch data
  useEffect(() => {
    // Only fetch if interval is valid for the period
    const validIntervals = getValidIntervals(period);
    if (!validIntervals.includes(interval)) {
      // Skip fetch - the interval sync effect will update the interval
      return;
    }

    const fetchChart = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/stocks/${symbol}/chart?period=${period}&interval=${interval}`);
        const result = await res.json();

        const ohlcData: OHLCData[] = (result.data || [])
          .filter((d: { open?: number; high?: number; low?: number; price?: number }) =>
            d.open !== undefined && d.high !== undefined && d.low !== undefined
          )
          .map((d: { timestamp: number; open: number; high: number; low: number; price: number; volume?: number }) => ({
            time: Math.floor(d.timestamp / 1000) as Time,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.price,
            volume: d.volume || 0,
          }));

        setRawData(ohlcData);
      } catch (error) {
        console.error("Failed to fetch chart:", error);
        setRawData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChart();
  }, [symbol, period, interval]);


  // Create and update chart
  useEffect(() => {
    if (!chartContainerRef.current || rawData.length === 0) return;

    // Clean up existing chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    // Create new chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#9ca3af",
      },
      grid: {
        vertLines: { color: "rgba(55, 65, 81, 0.5)" },
        horzLines: { color: "rgba(55, 65, 81, 0.5)" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "#9ca3af",
          width: 1,
          style: 2,
          labelBackgroundColor: "#374151",
        },
        horzLine: {
          color: "#9ca3af",
          width: 1,
          style: 2,
          labelBackgroundColor: "#374151",
        },
      },
      rightPriceScale: {
        borderColor: "#374151",
        scaleMargins: {
          top: 0.1,
          bottom: indicator === "volume" ? 0.25 : 0.1,
        },
      },
      timeScale: {
        borderColor: "#374151",
        timeVisible: period === "1d" || period === "5d",
        secondsVisible: false,
      },
      handleScale: {
        axisPressedMouseMove: true,
      },
      handleScroll: {
        vertTouchDrag: false,
      },
    });

    chartRef.current = chart;

    // Add main series based on chart type
    if (chartType === "candlestick") {
      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderUpColor: "#22c55e",
        borderDownColor: "#ef4444",
        wickUpColor: "#22c55e",
        wickDownColor: "#ef4444",
      });
      candlestickSeries.setData(rawData as CandlestickData[]);
      mainSeriesRef.current = candlestickSeries;
    } else if (chartType === "line") {
      const lineSeries = chart.addSeries(LineSeries, {
        color: "#3b82f6",
        lineWidth: 2,
      });
      lineSeries.setData(rawData.map(d => ({ time: d.time, value: d.close })));
      mainSeriesRef.current = lineSeries;
    } else {
      const areaSeries = chart.addSeries(AreaSeries, {
        topColor: "rgba(59, 130, 246, 0.4)",
        bottomColor: "rgba(59, 130, 246, 0.0)",
        lineColor: "#3b82f6",
        lineWidth: 2,
      });
      areaSeries.setData(rawData.map(d => ({ time: d.time, value: d.close })));
      mainSeriesRef.current = areaSeries;
    }

    // Add volume histogram if enabled
    if (indicator === "volume") {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        color: "#6b7280",
        priceFormat: {
          type: "volume",
        },
        priceScaleId: "",
      });

      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      const volumeData: HistogramData[] = rawData.map(d => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open ? "rgba(34, 197, 94, 0.5)" : "rgba(239, 68, 68, 0.5)",
      }));
      volumeSeries.setData(volumeData);
      volumeSeriesRef.current = volumeSeries;
    }

    // Add SMA if enabled
    if (indicator === "sma") {
      const sma20Series = chart.addSeries(LineSeries, {
        color: "#f59e0b",
        lineWidth: 1,
        title: "SMA 20",
      });
      const sma50Series = chart.addSeries(LineSeries, {
        color: "#8b5cf6",
        lineWidth: 1,
        title: "SMA 50",
      });

      if (rawData.length >= 20) {
        sma20Series.setData(calculateSMA(rawData, 20));
      }
      if (rawData.length >= 50) {
        sma50Series.setData(calculateSMA(rawData, 50));
      }
      smaSeriesRef.current = sma20Series;
    }

    // Add EMA if enabled
    if (indicator === "ema") {
      const ema12Series = chart.addSeries(LineSeries, {
        color: "#f59e0b",
        lineWidth: 1,
        title: "EMA 12",
      });
      const ema26Series = chart.addSeries(LineSeries, {
        color: "#8b5cf6",
        lineWidth: 1,
        title: "EMA 26",
      });

      if (rawData.length >= 12) {
        ema12Series.setData(calculateEMA(rawData, 12));
      }
      if (rawData.length >= 26) {
        ema26Series.setData(calculateEMA(rawData, 26));
      }
      emaSeriesRef.current = ema12Series;
    }

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [rawData, chartType, indicator, period]);

  // Get current price info
  const lastData = rawData[rawData.length - 1];
  const firstData = rawData[0];
  const priceChange = lastData && firstData ? lastData.close - firstData.close : 0;
  const priceChangePercent = firstData ? (priceChange / firstData.close) * 100 : 0;
  const isPositive = priceChange >= 0;

  if (isLoading) {
    return (
      <div className={cn("relative h-[500px]", className)}>
        <div className="absolute inset-0 flex items-center justify-center bg-surface/50 rounded-xl">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (rawData.length === 0) {
    return (
      <div className={cn("relative h-[500px]", className)}>
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          No chart data available for advanced view. Try a longer time period.
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Price Info Bar */}
      {lastData && (
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="font-semibold text-lg">${lastData.close.toFixed(2)}</span>
          <span className={cn("font-medium", isPositive ? "text-positive" : "text-negative")}>
            {isPositive ? "+" : ""}{priceChange.toFixed(2)} ({isPositive ? "+" : ""}{priceChangePercent.toFixed(2)}%)
          </span>
        </div>
      )}

      {/* Chart Type, Interval & Indicator Controls - TOP */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Chart Type Dropdown */}
        <div className="relative">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
            className="appearance-none bg-muted/50 border border-border/50 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          >
            {CHART_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Interval/Timeframe Dropdown */}
        <div className="relative">
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value as Interval)}
            className="appearance-none bg-muted/50 border border-border/50 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          >
            {INTERVALS.filter(i => getValidIntervals(period).includes(i.value)).map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Indicators Dropdown */}
        <div className="relative">
          <select
            value={indicator}
            onChange={(e) => setIndicator(e.target.value as IndicatorType)}
            className="appearance-none bg-muted/50 border border-border/50 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          >
            {INDICATORS.map((ind) => (
              <option key={ind.value} value={ind.value}>
                {ind.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Chart Container */}
      <div
        ref={chartContainerRef}
        className="h-[400px] w-full"
      />

      {/* Period Selector - BOTTOM */}
      <div className="flex justify-center">
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

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
        {chartType === "candlestick" && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#22c55e] rounded-sm" />
              <span>Bullish</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#ef4444] rounded-sm" />
              <span>Bearish</span>
            </div>
          </>
        )}
        {indicator === "sma" && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#f59e0b]" />
              <span>SMA 20</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#8b5cf6]" />
              <span>SMA 50</span>
            </div>
          </>
        )}
        {indicator === "ema" && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#f59e0b]" />
              <span>EMA 12</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#8b5cf6]" />
              <span>EMA 26</span>
            </div>
          </>
        )}
        {indicator === "volume" && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#6b7280] opacity-50 rounded-sm" />
            <span>Volume</span>
          </div>
        )}
      </div>
    </div>
  );
}
