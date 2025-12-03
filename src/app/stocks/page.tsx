import { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, TrendingDown, Sparkles, Flame, BarChart3 } from "lucide-react";
import { StockSearchBar } from "@/components/stocks";
import { getTopGainers, getTopLosers, getMarketIndices } from "@/lib/yahoo-finance";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
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

      {/* Market Indices - styled like MarketTicker */}
      {indices.length > 0 && (
        <section className="w-full border-b border-border/40 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative h-12 overflow-hidden">
            {/* Market Status Indicator */}
            <div className="absolute left-0 top-0 z-10 flex h-full items-center bg-surface px-4 border-r border-border/40">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-positive"></span>
                </span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Live
                </span>
              </div>
            </div>

            {/* Scrolling Ticker */}
            <div className="flex h-full items-center animate-ticker pl-24">
              {[...indices, ...indices].map((index, i) => (
                <div
                  key={`${index.symbol}-${i}`}
                  className="flex items-center gap-3 px-4 border-r border-border/40 last:border-r-0"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-muted-foreground">
                      {index.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold tabular-nums text-foreground">
                        {index.price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <div className={`flex items-center gap-0.5 ${index.changePercent >= 0 ? "text-positive" : "text-negative"}`}>
                        {index.changePercent >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span className="text-xs font-medium tabular-nums">
                          {index.changePercent >= 0 ? "+" : ""}
                          {index.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gradient Fade Right */}
            <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-surface to-transparent pointer-events-none" />
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
      <Footer />
    </div>
  );
}
