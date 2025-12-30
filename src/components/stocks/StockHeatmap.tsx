"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Loader2, Maximize2, Share2, X, Menu } from "lucide-react";
import { HeatmapSidebar } from "./HeatmapSidebar";
import { HeatmapTreemap } from "./HeatmapTreemap";
import { HeatmapIndex, INDEX_INFO, DATA_TYPE_OPTIONS } from "@/lib/stock-lists";
import { useTheme } from "@/components/providers/ThemeProvider";

// Theme-aware color legends
const DARK_COLOR_LEGEND = [
  { color: "#7c0a02", label: "-6%" },
  { color: "#b33a2c", label: "-4%" },
  { color: "#d85a4a", label: "-2%" },
  { color: "#444444", label: "0%" },
  { color: "#3a9a3a", label: "+2%" },
  { color: "#1aba1a", label: "+4%" },
  { color: "#00ea00", label: "+6%" },
];

const LIGHT_COLOR_LEGEND = [
  { color: "#991b1b", label: "-6%" },
  { color: "#c74a3a", label: "-4%" },
  { color: "#e87a6a", label: "-2%" },
  { color: "#94a3b8", label: "0%" },
  { color: "#2ab82a", label: "+2%" },
  { color: "#10d410", label: "+4%" },
  { color: "#00f800", label: "+6%" },
];

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
  const { theme } = useTheme();
  const isLightMode = theme === "light";
  const colorLegend = isLightMode ? LIGHT_COLOR_LEGEND : DARK_COLOR_LEGEND;

  const [index, setIndex] = useState<HeatmapIndex>("sp500");
  const [dataType, setDataType] = useState<string>("d1");
  const [stocks, setStocks] = useState<HeatmapStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [highlightedStock, setHighlightedStock] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Fetch data - supports background refresh without full loading state
  const fetchData = useCallback(async (isBackground = false) => {
    if (!isBackground) {
      setLoading(true);
    } else {
      setIsUpdating(true);
    }
    setError(null);
    try {
      const response = await fetch(`/api/stocks/heatmap?index=${index}&dataType=${dataType}`);
      if (!response.ok) throw new Error("Failed to fetch heatmap data");
      const data = await response.json();
      setStocks(data.stocks || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching heatmap:", err);
      if (!isBackground) {
        setError("Failed to load heatmap data. Please try again.");
      }
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  }, [index, dataType]);

  // Initial fetch and polling interval (30 seconds)
  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData(true); // Background refresh
    }, 30000);

    return () => clearInterval(interval);
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

  return (
    <div
      className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50" : "rounded-xl overflow-hidden"}`}
      style={{
        backgroundColor: 'var(--heatmap-bg)',
        borderColor: 'var(--heatmap-border)',
        borderWidth: isFullscreen ? '0' : '1px',
        borderStyle: 'solid',
      }}
    >
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-4"
        style={{
          backgroundColor: 'var(--heatmap-bg)',
          borderBottomColor: 'var(--heatmap-border)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
        }}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded transition-colors"
            style={{
              backgroundColor: 'var(--heatmap-surface)',
              color: 'var(--foreground)'
            }}
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium" style={{ color: 'var(--foreground)' }}>{indexName} Map</span>
            {/* Live indicator with pulse */}
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] sm:text-xs text-green-500 font-medium">Live</span>
            </div>
            {/* Updating indicator */}
            {isUpdating && (
              <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
            )}
          </div>
          <span className="hidden lg:inline text-xs" style={{ color: 'var(--heatmap-help-text)' }}>
            {indexName} index stocks categorized by sectors and industries. Size represents market cap.
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs rounded transition-colors"
            style={{ color: 'var(--heatmap-sector-label)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--heatmap-surface)';
              e.currentTarget.style.color = 'var(--foreground)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--heatmap-sector-label)';
            }}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
          <button
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs rounded transition-colors"
            style={{ color: 'var(--heatmap-sector-label)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--heatmap-surface)';
              e.currentTarget.style.color = 'var(--foreground)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--heatmap-sector-label)';
            }}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share Map</span>
          </button>
          {isFullscreen && (
            <button
              onClick={() => document.exitFullscreen()}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs rounded transition-colors"
              style={{ color: 'var(--heatmap-sector-label)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--heatmap-surface)';
                e.currentTarget.style.color = 'var(--foreground)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--heatmap-sector-label)';
              }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          {/* Sidebar */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[280px] shadow-xl"
            style={{ backgroundColor: 'var(--heatmap-bg)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--heatmap-border)' }}>
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Filters</span>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 rounded"
                style={{ color: 'var(--heatmap-sector-label)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <HeatmapSidebar
              selectedIndex={index}
              onIndexChange={(newIndex) => {
                setIndex(newIndex);
                setIsMobileSidebarOpen(false);
              }}
              selectedDataType={dataType}
              onDataTypeChange={(newDataType) => {
                setDataType(newDataType);
                setIsMobileSidebarOpen(false);
              }}
              isMobile
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px]" style={{ height: isFullscreen ? "calc(100vh - 110px)" : undefined }}>
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <HeatmapSidebar
            selectedIndex={index}
            onIndexChange={setIndex}
            selectedDataType={dataType}
            onDataTypeChange={setDataType}
          />
        </div>

        {/* Treemap area */}
        <div className="flex-1 relative h-full overflow-hidden">
          {loading ? (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: 'var(--heatmap-bg)' }}
            >
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                <p style={{ color: 'var(--heatmap-sector-label)' }}>Loading {indexName} data...</p>
              </div>
            </div>
          ) : error ? (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: 'var(--heatmap-bg)' }}
            >
              <div className="text-center">
                <p style={{ color: 'var(--negative)' }} className="mb-4">{error}</p>
                <button
                  onClick={() => fetchData()}
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
      <div
        className="px-3 sm:px-4 py-2 sm:py-3"
        style={{
          backgroundColor: 'var(--heatmap-bg)',
          borderTopColor: 'var(--heatmap-border)',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          {/* Help text - hidden on mobile */}
          <div className="hidden md:flex items-center gap-4 text-xs" style={{ color: 'var(--heatmap-help-text)' }}>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--heatmap-help-text)' }} />
              Use mouse wheel to zoom in and out. Drag zoomed map to pan it.
            </span>
            <span>Double-click a ticker to display detailed information.</span>
          </div>
          {/* Mobile help text - shorter */}
          <div className="md:hidden text-[10px]" style={{ color: 'var(--heatmap-help-text)' }}>
            Pinch to zoom. Tap a ticker for details.
          </div>

          {/* Color legend and last updated */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap">
              {colorLegend.map((item, i) => (
                <div key={i} className="flex items-center gap-0.5">
                  <div
                    className="w-5 h-3 sm:w-8 sm:h-4 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  {(i === 0 || i === colorLegend.length - 1 || i === Math.floor(colorLegend.length / 2)) && (
                    <span className="text-[10px] sm:text-xs ml-0.5" style={{ color: 'var(--heatmap-sector-label)' }}>{item.label}</span>
                  )}
                </div>
              ))}
            </div>
            {/* Last updated timestamp */}
            {lastUpdated && (
              <span className="text-[10px] sm:text-xs whitespace-nowrap" style={{ color: 'var(--heatmap-help-text)' }}>
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
