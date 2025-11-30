"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";

interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface LiveMarketWidgetProps {
  tickers?: string[];
}

export function LiveMarketWidget({ tickers }: LiveMarketWidgetProps) {
  const [stocks, setStocks] = useState<MarketQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        // If specific tickers provided, fetch those; otherwise fetch top gainers
        let url = "/api/market/quotes";
        if (tickers && tickers.length > 0) {
          url += `?symbols=${tickers.join(",")}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          // If no specific tickers, take first 4 from market indices
          const relevantStocks = tickers?.length
            ? data
            : data.slice(0, 4);
          setStocks(relevantStocks);
        }
      } catch (error) {
        console.error("Error fetching quotes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();

    // Refresh every 30 seconds
    const interval = setInterval(fetchQuotes, 30000);
    return () => clearInterval(interval);
  }, [tickers]);

  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Related Markets</h3>
      </div>
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : stocks.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No market data available
          </div>
        ) : (
          stocks.map((stock) => {
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
          })
        )}
      </div>
    </div>
  );
}
