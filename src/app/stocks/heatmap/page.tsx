import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  LayoutGrid,
  TrendingUp,
  TrendingDown,
  Zap,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StockHeatmap } from "@/components/stocks";
import { getMarketIndices } from "@/lib/yahoo-finance";

export const metadata: Metadata = {
  title: "Stock Market Heatmap | The Fiscal Wire",
  description:
    "Visualize S&P 500 and NASDAQ-100 stock performance with our interactive heatmap. See market trends at a glance.",
};

export const dynamic = "force-dynamic";

export default async function HeatmapPage() {
  // Fetch market indices for the ticker
  const indices = await getMarketIndices().catch(() => []);

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
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

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
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <LayoutGrid className="h-4 w-4" />
                  Interactive Visualization
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  Market{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-red-500">
                    Heatmap
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Visualize market performance across S&P 500 and NASDAQ-100 stocks.
                  Box size represents market cap, colors show daily change.
                </p>
              </div>

              {/* Market Status */}
              <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-surface border border-border/50">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-positive"></span>
                  </span>
                  <span className="text-sm font-medium text-foreground">Live Data</span>
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

        {/* Main Content - Heatmap */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <StockHeatmap />
        </div>
      </main>
      <Footer />
    </div>
  );
}
