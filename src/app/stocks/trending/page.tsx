import { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Flame,
  Activity,
  BarChart3,
  ArrowLeft,
  Sparkles,
  Zap,
  LineChart,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TrendingStockCard } from "@/components/stocks";
import {
  getTrendingStocks,
  getMostActiveStocks,
  getTopGainers,
  getTopLosers,
  getMarketIndices,
} from "@/lib/yahoo-finance";

export const metadata: Metadata = {
  title: "Trending Stocks | The Fiscal Wire",
  description:
    "Discover the hottest trending stocks, top gainers, top losers, and most actively traded stocks in real-time.",
};

export const dynamic = "force-dynamic";

export default async function TrendingStocksPage() {
  // Fetch all data in parallel
  const [trending, mostActive, gainers, losers, indices] = await Promise.all([
    getTrendingStocks(20).catch(() => []),
    getMostActiveStocks(10).catch(() => []),
    getTopGainers().catch(() => []),
    getTopLosers().catch(() => []),
    getMarketIndices().catch(() => []),
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 border-b border-border/50 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold/5" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse delay-1000" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Back Link */}
            <Link
              href="/stocks"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Stocks
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 text-gold text-sm font-medium">
                  <Flame className="h-4 w-4" />
                  Real-time Trending Data
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-gold">Stocks</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Discover the most talked-about stocks, biggest movers, and highest volume
                  trades happening right now in the market.
                </p>
              </div>

              {/* Market Status */}
              <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-surface border border-border/50">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-positive"></span>
                  </span>
                  <span className="text-sm font-medium text-foreground">Markets Open</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Market Ticker */}
        {indices.length > 0 && (
          <section className="w-full border-b border-border/40 bg-surface/95 backdrop-blur">
            <div className="relative h-14 overflow-hidden">
              <div className="absolute left-0 top-0 z-10 flex h-full items-center bg-surface px-6 border-r border-border/40">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-gold" />
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Markets
                  </span>
                </div>
              </div>

              <div className="flex h-full items-center animate-ticker pl-28">
                {[...indices, ...indices].map((index, i) => (
                  <div
                    key={`${index.symbol}-${i}`}
                    className="flex items-center gap-4 px-6 border-r border-border/40"
                  >
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                      {index.name}
                    </span>
                    <span className="text-sm font-bold tabular-nums text-foreground">
                      {formatPrice(index.price)}
                    </span>
                    <div
                      className={`flex items-center gap-1 ${
                        index.changePercent >= 0 ? "text-positive" : "text-negative"
                      }`}
                    >
                      {index.changePercent >= 0 ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5" />
                      )}
                      <span className="text-sm font-semibold tabular-nums">
                        {index.changePercent >= 0 ? "+" : ""}
                        {index.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-surface to-transparent pointer-events-none" />
            </div>
          </section>
        )}

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Featured Trending Section */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold/10">
                  <Sparkles className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Top Trending</h2>
                  <p className="text-sm text-muted-foreground">
                    Most searched and talked about stocks today
                  </p>
                </div>
              </div>
            </div>

            {trending.length > 0 ? (
              <>
                {/* Featured Cards - Top 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {trending.slice(0, 3).map((stock, index) => (
                    <TrendingStockCard
                      key={stock.symbol}
                      stock={stock}
                      rank={index + 1}
                      variant="featured"
                    />
                  ))}
                </div>

                {/* Remaining Trending - Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {trending.slice(3, 15).map((stock, index) => (
                    <TrendingStockCard
                      key={stock.symbol}
                      stock={stock}
                      rank={index + 4}
                      variant="default"
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No trending data available</p>
              </div>
            )}
          </section>

          {/* Three Column Grid - Gainers, Losers, Most Active */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Top Gainers */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-positive/10">
                  <TrendingUp className="h-5 w-5 text-positive" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Top Gainers</h2>
                  <p className="text-xs text-muted-foreground">Biggest price increases</p>
                </div>
              </div>

              <div className="bg-surface rounded-2xl border border-border/50 overflow-hidden">
                {gainers.length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {gainers.map((stock, index) => (
                      <TrendingStockCard
                        key={stock.symbol}
                        stock={{
                          ...stock,
                          volume: 0,
                          avgVolume: 0,
                          marketCap: 0,
                          fiftyTwoWeekHigh: 0,
                          fiftyTwoWeekLow: 0,
                          fiftyDayAverage: 0,
                          twoHundredDayAverage: 0,
                          trailingPE: null,
                          forwardPE: null,
                          eps: null,
                          dividendYield: null,
                          beta: null,
                          exchange: "",
                          quoteType: "EQUITY",
                        }}
                        rank={index + 1}
                        variant="compact"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-12 text-center text-muted-foreground">
                    No gainers data available
                  </div>
                )}
              </div>
            </section>

            {/* Top Losers */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-negative/10">
                  <TrendingDown className="h-5 w-5 text-negative" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Top Losers</h2>
                  <p className="text-xs text-muted-foreground">Biggest price decreases</p>
                </div>
              </div>

              <div className="bg-surface rounded-2xl border border-border/50 overflow-hidden">
                {losers.length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {losers.map((stock, index) => (
                      <TrendingStockCard
                        key={stock.symbol}
                        stock={{
                          ...stock,
                          volume: 0,
                          avgVolume: 0,
                          marketCap: 0,
                          fiftyTwoWeekHigh: 0,
                          fiftyTwoWeekLow: 0,
                          fiftyDayAverage: 0,
                          twoHundredDayAverage: 0,
                          trailingPE: null,
                          forwardPE: null,
                          eps: null,
                          dividendYield: null,
                          beta: null,
                          exchange: "",
                          quoteType: "EQUITY",
                        }}
                        rank={index + 1}
                        variant="compact"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-12 text-center text-muted-foreground">
                    No losers data available
                  </div>
                )}
              </div>
            </section>

            {/* Most Active */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Most Active</h2>
                  <p className="text-xs text-muted-foreground">Highest trading volume</p>
                </div>
              </div>

              <div className="bg-surface rounded-2xl border border-border/50 overflow-hidden">
                {mostActive.length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {mostActive.slice(0, 5).map((stock, index) => (
                      <TrendingStockCard
                        key={stock.symbol}
                        stock={stock}
                        rank={index + 1}
                        variant="compact"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-12 text-center text-muted-foreground">
                    No active stocks data available
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Additional Most Active Section with More Details */}
          {mostActive.length > 5 && (
            <section className="mt-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">More Active Stocks</h2>
                  <p className="text-sm text-muted-foreground">
                    High volume stocks with detailed metrics
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mostActive.slice(5, 10).map((stock, index) => (
                  <TrendingStockCard
                    key={stock.symbol}
                    stock={stock}
                    rank={index + 6}
                    variant="default"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Market Summary Stats */}
          <section className="mt-16 pt-16 border-t border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-surface rounded-2xl border border-border/50 p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-gold" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{trending.length}</div>
                <div className="text-sm text-muted-foreground">Trending Stocks</div>
              </div>

              <div className="bg-surface rounded-2xl border border-border/50 p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-positive/10 mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-positive" />
                </div>
                <div className="text-3xl font-bold text-positive mb-1">{gainers.length}</div>
                <div className="text-sm text-muted-foreground">Top Gainers</div>
              </div>

              <div className="bg-surface rounded-2xl border border-border/50 p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-negative/10 mx-auto mb-4">
                  <TrendingDown className="h-6 w-6 text-negative" />
                </div>
                <div className="text-3xl font-bold text-negative mb-1">{losers.length}</div>
                <div className="text-sm text-muted-foreground">Top Losers</div>
              </div>

              <div className="bg-surface rounded-2xl border border-border/50 p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-1">{mostActive.length}</div>
                <div className="text-sm text-muted-foreground">Most Active</div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
