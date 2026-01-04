"use client";

import { useState } from "react";
import { BarChart3, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { TradingViewMiniChart } from "./TradingViewMiniChart";
import { TradingViewAdvancedChart } from "./TradingViewAdvancedChart";

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
        <TradingViewAdvancedChart symbol={symbol} theme="dark" height={500} />
      ) : (
        <TradingViewMiniChart symbol={symbol} theme="dark" height={400} dateRange="12M" />
      )}
    </div>
  );
}
