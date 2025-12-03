"use client";

import { useState, lazy, Suspense } from "react";
import { BarChart3, LineChart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { StockChart } from "./StockChart";

// Lazy load the advanced chart since it's heavy
const AdvancedStockChart = lazy(() =>
  import("./AdvancedStockChart").then((mod) => ({ default: mod.AdvancedStockChart }))
);

interface StockChartSectionProps {
  symbol: string;
  className?: string;
}

export function StockChartSection({ symbol, className }: StockChartSectionProps) {
  const [isAdvanced, setIsAdvanced] = useState(false);

  return (
    <div className={className}>
      {/* Header with Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Price Chart</h2>
        <button
          onClick={() => setIsAdvanced(!isAdvanced)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all",
            isAdvanced
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background border-border hover:border-primary hover:text-primary"
          )}
        >
          {isAdvanced ? (
            <>
              <LineChart className="h-4 w-4" />
              <span className="hidden sm:inline">Simple View</span>
            </>
          ) : (
            <>
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced Charts</span>
            </>
          )}
        </button>
      </div>

      {/* Chart Content */}
      {isAdvanced ? (
        <Suspense
          fallback={
            <div className="h-[500px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <AdvancedStockChart symbol={symbol} />
        </Suspense>
      ) : (
        <StockChart symbol={symbol} />
      )}
    </div>
  );
}
