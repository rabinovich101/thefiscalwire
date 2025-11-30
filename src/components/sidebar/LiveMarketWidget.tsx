import { TrendingUp, TrendingDown } from "lucide-react";
import { topGainers, topLosers } from "@/data/mockData";

interface LiveMarketWidgetProps {
  tickers?: string[];
}

export function LiveMarketWidget({ tickers }: LiveMarketWidgetProps) {
  // Filter stocks based on relevant tickers, or show top movers
  const allStocks = [...topGainers, ...topLosers];
  const relevantStocks = tickers?.length
    ? allStocks.filter((stock) => tickers.includes(stock.symbol))
    : topGainers.slice(0, 4);

  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Related Markets</h3>
      </div>
      <div className="space-y-3">
        {relevantStocks.map((stock) => {
          const isPositive = stock.change >= 0;
          return (
            <div
              key={stock.symbol}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div>
                <span className="text-sm font-semibold text-foreground">
                  {stock.symbol}
                </span>
                <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                  {stock.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground tabular-nums">
                  ${stock.price.toFixed(2)}
                </p>
                <div
                  className={`flex items-center justify-end gap-0.5 text-xs ${
                    isPositive ? "text-positive" : "text-negative"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span className="tabular-nums">
                    {isPositive ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
