import { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, TrendingDown, Sparkles, Flame, BarChart3 } from "lucide-react";
import { StockSearchBar } from "@/components/stocks";
import { getTopGainers, getTopLosers, getMarketIndices } from "@/lib/yahoo-finance";

export const metadata: Metadata = {
  title: "Stocks | The Fiscal Wire",
  description: "Search and explore stocks, ETFs, and market indices. Real-time quotes, charts, and financial data.",
};

export const dynamic = "force-dynamic";

// Popular stocks to show by default
const POPULAR_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "BRK-B", name: "Berkshire Hathaway" },
];

export default async function StocksPage() {
  // Fetch market data in parallel
  const [gainers, losers, indices] = await Promise.all([
    getTopGainers().catch(() => []),
    getTopLosers().catch(() => []),
    getMarketIndices().catch(() => []),
  ]);

  return (
    <main className="min-h-screen">
      {/* Hero Section with Search */}
      <section className="relative py-16 sm:py-24 border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Real-time Market Data
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Search <span className="text-primary">Stocks</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get real-time quotes, interactive charts, and comprehensive financial data
              for any stock, ETF, or market index.
            </p>

            {/* Search Bar */}
            <div className="pt-4">
              <StockSearchBar variant="hero" autoFocus />
            </div>
          </div>
        </div>
      </section>

      {/* Market Indices */}
      {indices.length > 0 && (
        <section className="py-6 border-b border-border/50 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
              {indices.map((index) => (
                <div
                  key={index.symbol}
                  className="flex items-center gap-3 flex-shrink-0"
                >
                  <span className="text-sm font-medium text-muted-foreground">
                    {index.name}
                  </span>
                  <span className="text-sm font-semibold tabular-nums">
                    {index.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span
                    className={`text-xs font-medium tabular-nums ${
                      index.changePercent >= 0 ? "text-positive" : "text-negative"
                    }`}
                  >
                    {index.changePercent >= 0 ? "+" : ""}
                    {index.changePercent.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Popular Stocks */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Popular Stocks</h2>
            </div>
            <div className="bg-surface rounded-2xl border border-border/50 divide-y divide-border/50">
              {POPULAR_STOCKS.map((stock) => (
                <Link
                  key={stock.symbol}
                  href={`/stocks/${stock.symbol}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <div>
                    <span className="font-semibold text-foreground">
                      {stock.symbol}
                    </span>
                    <p className="text-xs text-muted-foreground">{stock.name}</p>
                  </div>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>

          {/* Gainers & Losers */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Top Gainers */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-positive" />
                <h2 className="text-lg font-semibold">Top Gainers</h2>
              </div>
              <div className="bg-surface rounded-2xl border border-border/50 divide-y divide-border/50">
                {gainers.length > 0 ? (
                  gainers.map((stock) => (
                    <Link
                      key={stock.symbol}
                      href={`/stocks/${stock.symbol}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-foreground">
                          {stock.symbol}
                        </span>
                        <p className="text-xs text-muted-foreground truncate">
                          {stock.name}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="font-semibold tabular-nums">
                          ${stock.price.toFixed(2)}
                        </p>
                        <p className="text-xs font-medium text-positive tabular-nums">
                          +{stock.changePercent.toFixed(2)}%
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>
            </div>

            {/* Top Losers */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-negative" />
                <h2 className="text-lg font-semibold">Top Losers</h2>
              </div>
              <div className="bg-surface rounded-2xl border border-border/50 divide-y divide-border/50">
                {losers.length > 0 ? (
                  losers.map((stock) => (
                    <Link
                      key={stock.symbol}
                      href={`/stocks/${stock.symbol}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-foreground">
                          {stock.symbol}
                        </span>
                        <p className="text-xs text-muted-foreground truncate">
                          {stock.name}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="font-semibold tabular-nums">
                          ${stock.price.toFixed(2)}
                        </p>
                        <p className="text-xs font-medium text-negative tabular-nums">
                          {stock.changePercent.toFixed(2)}%
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
