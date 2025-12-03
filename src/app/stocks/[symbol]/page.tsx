import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Share2, Star, Bell } from "lucide-react";
import { StockPriceHeader, StockChart, StockStatistics, StockNews } from "@/components/stocks";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ symbol: string }>;
}

async function getStockData(symbol: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/stocks/${symbol}/quote`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch stock data:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  const stock = await getStockData(upperSymbol);

  if (!stock) {
    return {
      title: `${upperSymbol} | Stock Not Found`,
    };
  }

  const priceFormatted = stock.price?.toFixed(2) || "N/A";
  const changeFormatted = stock.change >= 0
    ? `+${stock.change?.toFixed(2)}`
    : stock.change?.toFixed(2);

  return {
    title: `${stock.name} (${upperSymbol}) Stock Price, Quote & News | The Fiscal Wire`,
    description: `Get the latest ${stock.name} (${upperSymbol}) stock price, news, and financial data. Current price: $${priceFormatted} (${changeFormatted})`,
    openGraph: {
      title: `${upperSymbol} - $${priceFormatted} | The Fiscal Wire`,
      description: `${stock.name} stock quote and analysis`,
    },
  };
}

export default async function StockDetailPage({ params }: PageProps) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  const stock = await getStockData(upperSymbol);

  if (!stock || stock.error) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-16">
      {/* Sub Navigation Bar */}
      <div className="sticky top-16 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Back Button */}
            <Link
              href="/stocks"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Stocks</span>
            </Link>

            {/* Quick Info */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{upperSymbol}</span>
              <span className="text-lg font-semibold tabular-nums">
                ${stock.price?.toFixed(2)}
              </span>
              <span
                className={`text-sm font-medium tabular-nums ${
                  stock.change >= 0 ? "text-positive" : "text-negative"
                }`}
              >
                {stock.change >= 0 ? "+" : ""}
                {stock.changePercent?.toFixed(2)}%
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Star className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price Header */}
            <section className="bg-surface rounded-2xl border border-border/50 p-6 sm:p-8">
              <StockPriceHeader stock={stock} />
            </section>

            {/* Chart */}
            <section className="bg-surface rounded-2xl border border-border/50 p-6 sm:p-8">
              <h2 className="text-lg font-semibold mb-4">Price Chart</h2>
              <StockChart symbol={upperSymbol} />
            </section>

            {/* Company Description */}
            {stock.description && (
              <section className="bg-surface rounded-2xl border border-border/50 p-6 sm:p-8">
                <h2 className="text-lg font-semibold mb-4">About {stock.name}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6">
                  {stock.description}
                </p>
                {stock.employees && (
                  <p className="text-sm text-muted-foreground mt-4">
                    <span className="font-medium text-foreground">Employees:</span>{" "}
                    {stock.employees.toLocaleString()}
                  </p>
                )}
              </section>
            )}

            {/* News Section */}
            <section className="bg-surface rounded-2xl border border-border/50 p-6 sm:p-8">
              <h2 className="text-lg font-semibold mb-4">Latest News</h2>
              <StockNews symbol={upperSymbol} />
            </section>
          </div>

          {/* Sidebar - Statistics */}
          <div className="lg:col-span-1">
            <div className="sticky top-[7.5rem]">
              <section className="bg-surface rounded-2xl border border-border/50 p-6">
                <h2 className="text-lg font-semibold mb-6">Key Statistics</h2>
                <StockStatistics stock={stock} currency={stock.currency} />
              </section>
            </div>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
