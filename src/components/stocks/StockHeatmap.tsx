"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Loader2, Maximize2, Share2, X, Minus, Plus } from "lucide-react";
import { HeatmapSidebar } from "./HeatmapSidebar";
import { HeatmapTreemap } from "./HeatmapTreemap";
import { HeatmapIndex, INDEX_INFO, DATA_TYPE_OPTIONS } from "@/lib/stock-lists";

interface HeatmapStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  sector: string;
  sectorId: string;
  industryId: string;
  value: number;
}

export function StockHeatmap() {
  const [index, setIndex] = useState<HeatmapIndex>("sp500");
  const [dataType, setDataType] = useState<string>("d1");
  const [stocks, setStocks] = useState<HeatmapStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [highlightedStock, setHighlightedStock] = useState<string | null>(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/stocks/heatmap?index=${index}&dataType=${dataType}`);
      if (!response.ok) throw new Error("Failed to fetch heatmap data");
      const data = await response.json();
      setStocks(data.stocks || []);
    } catch (err) {
      console.error("Error fetching heatmap:", err);
      setError("Failed to load heatmap data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [index, dataType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Error entering fullscreen:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.error("Error exiting fullscreen:", err);
      });
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Get index display name
  const indexName = useMemo(() => {
    const info = INDEX_INFO.find((i) => i.id === index);
    return info?.name || "S&P 500";
  }, [index]);

  // Get data type display name
  const dataTypeName = useMemo(() => {
    const option = DATA_TYPE_OPTIONS.find((opt) => opt.id === dataType);
    return option?.label || "1-Week Performance";
  }, [dataType]);

  // Handle stock click from sidebar
  const handleStockClickFromSidebar = (symbol: string) => {
    setHighlightedStock(symbol);
    // Navigate to stock details
    window.location.href = `/stocks/${symbol}`;
  };

  // Calculate stats
  const stats = useMemo(() => {
    if (stocks.length === 0) return null;

    const isPerformanceMetric = dataType.startsWith("d") || dataType.startsWith("w") || dataType.startsWith("m") || dataType.startsWith("y") || dataType === "intraday" || dataType === "mtd" || dataType === "ytd";

    if (isPerformanceMetric) {
      const gainers = stocks.filter((s) => s.value > 0).length;
      const losers = stocks.filter((s) => s.value < 0).length;
      const unchanged = stocks.length - gainers - losers;
      const avgChange = stocks.reduce((sum, s) => sum + s.value, 0) / stocks.length;
      return { gainers, losers, unchanged, avgChange };
    }

    return null;
  }, [stocks, dataType]);

  // Color legend values
  const colorLegend = [
    { color: "#7c0a02", label: "-6%" },
    { color: "#b33a2c", label: "-4%" },
    { color: "#d85a4a", label: "-2%" },
    { color: "#444444", label: "0%" },
    { color: "#3a9a3a", label: "+2%" },
    { color: "#1aba1a", label: "+4%" },
    { color: "#00ea00", label: "+6%" },
  ];

  return (
    <div className={`flex flex-col bg-[#0f172a] ${isFullscreen ? "fixed inset-0 z-50" : "rounded-xl border border-[#1f2937] overflow-hidden"}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111827] border-b border-[#1f2937]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{indexName} Map</span>
          </div>
          <span className="text-xs text-gray-400">
            {indexName} index stocks categorized by sectors and industries. Size represents market cap.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-[#1f2937] rounded transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Fullscreen</span>
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-[#1f2937] rounded transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Map</span>
          </button>
          {isFullscreen && (
            <button
              onClick={() => document.exitFullscreen()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-[#1f2937] rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex" style={{ height: isFullscreen ? "calc(100vh - 110px)" : "600px" }}>
        {/* Sidebar */}
        <HeatmapSidebar
          selectedIndex={index}
          onIndexChange={setIndex}
          selectedDataType={dataType}
          onDataTypeChange={setDataType}
        />

        {/* Treemap area */}
        <div className="flex-1 relative h-full overflow-hidden">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#111827]">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                <p className="text-gray-400">Loading {indexName} data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#111827]">
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <HeatmapTreemap
              stocks={stocks}
              dataType={dataType}
              onStockHover={setHighlightedStock}
              highlightedStock={highlightedStock}
            />
          )}
        </div>
      </div>

      {/* Footer with legend and help text */}
      <div className="px-4 py-3 bg-[#111827] border-t border-[#1f2937]">
        <div className="flex items-center justify-between">
          {/* Help text */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-500" />
              Use mouse wheel to zoom in and out. Drag zoomed map to pan it.
            </span>
            <span>Double-click a ticker to display detailed information.</span>
          </div>

          {/* Color legend */}
          <div className="flex items-center gap-1">
            {colorLegend.map((item, i) => (
              <div key={i} className="flex items-center gap-0.5">
                <div
                  className="w-8 h-4 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                {(i === 0 || i === colorLegend.length - 1 || i === Math.floor(colorLegend.length / 2)) && (
                  <span className="text-xs text-gray-400 ml-0.5">{item.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
