import { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  LayoutGrid,
  BarChart3,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectorCard } from "@/components/stocks/SectorCard";
import { getAllSectorsPerformance, getMarketIndices } from "@/lib/yahoo-finance";

export const metadata: Metadata = {
  title: "Market Sectors | The Fiscal Wire",
  description:
    "Explore stock market sectors. View performance, top stocks, and trends across Technology, Healthcare, Financial, and more.",
};

export const dynamic = "force-dynamic";

export default async function SectorsPage() {
  const [sectors, indices] = await Promise.all([
    getAllSectorsPerformance().catch(() => []),
    getMarketIndices().catch(() => []),
  ]);

  // Calculate market overview stats
  const totalStocks = sectors.reduce((sum, s) => sum + s.stockCount, 0);
  const totalAdvancers = sectors.reduce((sum, s) => sum + s.advancers, 0);
  const totalDecliners = sectors.reduce((sum, s) => sum + s.decliners, 0);
  const marketAvgChange =
    sectors.length > 0
      ? sectors.reduce((sum, s) => sum + s.avgChange, 0) / sectors.length
      : 0;

  // Get best and worst performing sectors
  const bestSector = sectors[0];
  const worstSector = sectors[sectors.length - 1];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 border-b border-border/50 overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <LayoutGrid className="h-4 w-4" />
                11 Market Sectors
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Market{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-cyan-500">
                  Sectors
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover performance across all market sectors. From Technology
                to Healthcare, find the best opportunities in each industry.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground tabular-nums">
                    {totalStocks}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Stocks
                  </div>
                </div>
                <div className="w-px h-12 bg-border/50 hidden sm:block" />
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold tabular-nums flex items-center justify-center gap-1 ${
                      marketAvgChange >= 0 ? "text-positive" : "text-negative"
                    }`}
                  >
                    {marketAvgChange >= 0 ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                    {marketAvgChange >= 0 ? "+" : ""}
                    {marketAvgChange.toFixed(2)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Change</div>
                </div>
                <div className="w-px h-12 bg-border/50 hidden sm:block" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-positive tabular-nums">
                    {totalAdvancers}
                  </div>
                  <div className="text-sm text-muted-foreground">Advancing</div>
                </div>
                <div className="w-px h-12 bg-border/50 hidden sm:block" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-negative tabular-nums">
                    {totalDecliners}
                  </div>
                  <div className="text-sm text-muted-foreground">Declining</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Market Indices Ticker */}
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
                          <div
                            className={`flex items-center gap-0.5 ${
                              index.changePercent >= 0
                                ? "text-positive"
                                : "text-negative"
                            }`}
                          >
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

        {/* Top & Bottom Performers Highlight */}
        {bestSector && worstSector && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Best Performer */}
              <Link
                href={`/stocks/sectors/${bestSector.sectorId}`}
                className="group relative overflow-hidden rounded-2xl border border-positive/20 bg-gradient-to-br from-positive/5 to-positive/10 p-6 hover:border-positive/40 transition-all duration-300"
              >
                <div className="absolute top-4 right-4">
                  <Sparkles className="h-5 w-5 text-positive" />
                </div>
                <div className="text-sm font-medium text-positive mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Best Performing Sector
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {bestSector.sectorInfo.name}
                </div>
                <div className="text-lg font-semibold text-positive tabular-nums mb-3">
                  +{bestSector.avgChange.toFixed(2)}%
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{bestSector.stockCount} stocks</span>
                  <span>•</span>
                  <span>{bestSector.advancers} advancing</span>
                </div>
                <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-positive opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>

              {/* Worst Performer */}
              <Link
                href={`/stocks/sectors/${worstSector.sectorId}`}
                className="group relative overflow-hidden rounded-2xl border border-negative/20 bg-gradient-to-br from-negative/5 to-negative/10 p-6 hover:border-negative/40 transition-all duration-300"
              >
                <div className="absolute top-4 right-4">
                  <BarChart3 className="h-5 w-5 text-negative" />
                </div>
                <div className="text-sm font-medium text-negative mb-2 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Underperforming Sector
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {worstSector.sectorInfo.name}
                </div>
                <div className="text-lg font-semibold text-negative tabular-nums mb-3">
                  {worstSector.avgChange.toFixed(2)}%
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{worstSector.stockCount} stocks</span>
                  <span>•</span>
                  <span>{worstSector.decliners} declining</span>
                </div>
                <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-negative opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
            </div>
          </section>
        )}

        {/* All Sectors Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                All Sectors
              </h2>
              <p className="text-muted-foreground mt-1">
                Sorted by performance (best to worst)
              </p>
            </div>
            <Link
              href="/stocks/heatmap"
              className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              View Heatmap
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {sectors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectors.map((sector, index) => (
                <SectorCard
                  key={sector.sectorId}
                  sector={sector}
                  rank={index + 1}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <LayoutGrid className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Unable to load sector data. Please try again later.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
