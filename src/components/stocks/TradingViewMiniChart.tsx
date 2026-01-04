"use client";

import { useEffect, useRef } from "react";

interface TradingViewMiniChartProps {
  symbol: string;
  theme?: "light" | "dark";
  height?: number;
  dateRange?: "1D" | "1M" | "3M" | "12M" | "60M" | "ALL";
}

export function TradingViewMiniChart({
  symbol,
  theme = "dark",
  height = 400,
  dateRange = "12M"
}: TradingViewMiniChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: "100%",
      height: height,
      locale: "en",
      dateRange: dateRange,
      colorTheme: theme,
      isTransparent: true,
      autosize: true,
      largeChartUrl: ""
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, theme, dateRange, height]);

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{ height, minHeight: height }}
    />
  );
}
