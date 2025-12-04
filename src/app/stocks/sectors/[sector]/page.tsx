import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Cpu,
  Heart,
  Landmark,
  ShoppingBag,
  Coffee,
  Factory,
  Flame,
  Zap,
  Building2,
  Gem,
  Radio,
  BarChart3,
  Search,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StockSearchBar, SectorStocksTable } from "@/components/stocks";
import {
  getSectorStocksPaginated,
  getSymbolsForSector,
  SECTORS,
  getMarketIndices,
} from "@/lib/yahoo-finance";

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu,
  Heart,
  Landmark,
  ShoppingBag,
  Coffee,
  Factory,
  Flame,
  Zap,
  Building2,
  Gem,
  Radio,
};

// Color configurations
const colorConfig: Record<
  string,
  {
    iconBg: string;
    iconColor: string;
    gradient: string;
    accentBg: string;
  }
> = {
  blue: {
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    gradient: "from-blue-500/10 via-blue-600/5 to-transparent",
    accentBg: "bg-blue-500/10",
  },
  emerald: {
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    gradient: "from-emerald-500/10 via-emerald-600/5 to-transparent",
    accentBg: "bg-emerald-500/10",
  },
  amber: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    gradient: "from-amber-500/10 via-amber-600/5 to-transparent",
    accentBg: "bg-amber-500/10",
  },
  pink: {
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-500",
    gradient: "from-pink-500/10 via-pink-600/5 to-transparent",
    accentBg: "bg-pink-500/10",
  },
  orange: {
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
    gradient: "from-orange-500/10 via-orange-600/5 to-transparent",
    accentBg: "bg-orange-500/10",
  },
  slate: {
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-400",
    gradient: "from-slate-500/10 via-slate-600/5 to-transparent",
    accentBg: "bg-slate-500/10",
  },
  red: {
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
    gradient: "from-red-500/10 via-red-600/5 to-transparent",
    accentBg: "bg-red-500/10",
  },
  yellow: {
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-500",
    gradient: "from-yellow-500/10 via-yellow-600/5 to-transparent",
    accentBg: "bg-yellow-500/10",
  },
  violet: {
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    gradient: "from-violet-500/10 via-violet-600/5 to-transparent",
    accentBg: "bg-violet-500/10",
  },
  stone: {
    iconBg: "bg-stone-500/10",
    iconColor: "text-stone-400",
    gradient: "from-stone-500/10 via-stone-600/5 to-transparent",
    accentBg: "bg-stone-500/10",
  },
  indigo: {
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
    gradient: "from-indigo-500/10 via-indigo-600/5 to-transparent",
    accentBg: "bg-indigo-500/10",
  },
};

interface PageProps {
  params: Promise<{ sector: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { sector: sectorId } = await params;
  const sectorInfo = SECTORS.find((s) => s.id === sectorId);

  if (!sectorInfo) {
    return {
      title: "Sector Not Found | The Fiscal Wire",
    };
  }

  return {
    title: `${sectorInfo.name} Stocks | The Fiscal Wire`,
    description: `Browse all ${sectorInfo.name} stocks. ${sectorInfo.description}`,
  };
}

export const dynamic = "force-dynamic";

// Helper function for market cap formatting (used in stats)
function formatMarketCap(value: number) {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

export default async function SectorPage({ params }: PageProps) {
  const { sector: sectorId } = await params;

  // Find sector info
  const sectorInfo = SECTORS.find((s) => s.id === sectorId);
  if (!sectorInfo) {
    notFound();
  }

  // Fetch initial page of stocks and market indices
  const INITIAL_LIMIT = 20;
  const [paginatedResult, indices] = await Promise.all([
    getSectorStocksPaginated(sectorId, 1, INITIAL_LIMIT).catch(() => ({
      stocks: [],
      page: 1,
      limit: INITIAL_LIMIT,
      total: 0,
      totalPages: 0,
      hasMore: false,
    })),
    getMarketIndices().catch(() => []),
  ]);

  const stocks = paginatedResult.stocks;
  const totalStocks = getSymbolsForSector(sectorId).length;

  const IconComponent = iconMap[sectorInfo.icon] || Cpu;
  const colors = colorConfig[sectorInfo.color] || colorConfig.blue;

  // Calculate sector stats from initial batch (estimates)
  const advancers = stocks.filter((s) => s.changePercent > 0).length;
  const decliners = stocks.filter((s) => s.changePercent < 0).length;
  const avgChange =
    stocks.length > 0
      ? stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length
      : 0;
  const totalMarketCap = stocks.reduce((sum, s) => sum + s.marketCap, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 border-b border-border/50 overflow-hidden">
          {/* Background gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-b ${colors.gradient}`}
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Link
                href="/stocks/sectors"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sectors
              </Link>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Left: Sector Info */}
              <div className="flex items-start gap-5">
                {/* Icon */}
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-2xl ${colors.iconBg}`}
                >
                  <IconComponent className={`w-8 h-8 ${colors.iconColor}`} />
                </div>

                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                    {sectorInfo.name}
                  </h1>
                  <p className="text-muted-foreground max-w-lg">
                    {sectorInfo.description}
                  </p>
                </div>
              </div>

              {/* Right: Quick Stats */}
              <div className="flex flex-wrap gap-6 lg:gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold tabular-nums">
                    {totalStocks}
                  </div>
                  <div className="text-sm text-muted-foreground">Stocks</div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold tabular-nums flex items-center justify-center gap-1 ${
                      avgChange >= 0 ? "text-positive" : "text-negative"
                    }`}
                  >
                    {avgChange >= 0 ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                    {avgChange >= 0 ? "+" : ""}
                    {avgChange.toFixed(2)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Change</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold tabular-nums">
                    {formatMarketCap(totalMarketCap)}
                  </div>
                  <div className="text-sm text-muted-foreground">Market Cap</div>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="mt-8 flex flex-wrap items-center gap-6 p-4 rounded-xl bg-surface/50 border border-border/50">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-positive" />
                <span className="text-sm">
                  <span className="font-semibold text-positive">{advancers}</span>{" "}
                  <span className="text-muted-foreground">advancing</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-negative" />
                <span className="text-sm">
                  <span className="font-semibold text-negative">{decliners}</span>{" "}
                  <span className="text-muted-foreground">declining</span>
                </span>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Search all stocks:
                </span>
                <div className="w-64">
                  <StockSearchBar variant="header" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Market Ticker */}
        {indices.length > 0 && (
          <section className="w-full border-b border-border/40 bg-surface/95 backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative h-12 overflow-hidden">
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
                <div className="flex h-full items-center animate-ticker pl-24">
                  {[...indices, ...indices].map((index, i) => (
                    <div
                      key={`${index.symbol}-${i}`}
                      className="flex items-center gap-3 px-4 border-r border-border/40"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-muted-foreground">
                          {index.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold tabular-nums">
                            {index.price.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          <span
                            className={`text-xs font-medium tabular-nums ${
                              index.changePercent >= 0
                                ? "text-positive"
                                : "text-negative"
                            }`}
                          >
                            {index.changePercent >= 0 ? "+" : ""}
                            {index.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-surface to-transparent pointer-events-none" />
              </div>
            </div>
          </section>
        )}

        {/* Stocks Table with Lazy Loading */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                All {sectorInfo.name} Stocks
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {totalStocks} stocks sorted by market capitalization
              </p>
            </div>
            <Link
              href="/stocks/heatmap"
              className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
            >
              <BarChart3 className="h-4 w-4" />
              View Heatmap
            </Link>
          </div>

          {stocks.length > 0 ? (
            <SectorStocksTable
              sectorId={sectorId}
              initialStocks={stocks}
              initialPagination={{
                page: paginatedResult.page,
                limit: paginatedResult.limit,
                total: paginatedResult.total,
                totalPages: paginatedResult.totalPages,
                hasMore: paginatedResult.hasMore,
              }}
            />
          ) : (
            <div className="text-center py-16 text-muted-foreground bg-surface rounded-2xl border border-border/50">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No stocks found for this sector.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
