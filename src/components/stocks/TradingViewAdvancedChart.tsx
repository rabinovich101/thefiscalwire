"use client";

import { useEffect, useRef } from "react";

interface TradingViewAdvancedChartProps {
  symbol: string;
  theme?: "light" | "dark";
  height?: number;
}

export function TradingViewAdvancedChart({
  symbol,
  theme = "dark",
  height = 500
}: TradingViewAdvancedChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = "";

    // Create the widget container div first
    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    widgetDiv.style.height = `${height}px`;
    widgetDiv.style.width = "100%";
    containerRef.current.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: height,
      symbol: symbol,
      interval: "D",
      timezone: "America/New_York",
      theme: theme,
      style: "1",
      locale: "en",
      allow_symbol_change: false,
      calendar: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      support_host: "https://www.tradingview.com"
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, theme, height]);

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{ height, minHeight: height }}
    />
  );
}
