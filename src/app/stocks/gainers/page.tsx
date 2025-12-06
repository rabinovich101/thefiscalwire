import { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TrendingStockCard } from "@/components/stocks";
import { getTopGainers } from "@/lib/yahoo-finance";

export const metadata: Metadata = {
  title: "Top 10 Gainers | The Fiscal Wire",
  description: "Today's biggest stock gainers - see which stocks are making the biggest moves up.",
};

export const dynamic = "force-dynamic";

export default async function GainersPage() {
  const gainers = await getTopGainers().catch(() => []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 border-b border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-positive/5 via-transparent to-positive/5" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-positive/10 rounded-full blur-3xl animate-pulse" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/stocks"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Stocks
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-positive/10">
                <TrendingUp className="h-6 w-6 text-positive" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                Top 10 <span className="text-positive">Gainers</span>
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Stocks with the biggest price increases today. Updated in real-time.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {gainers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  variant="featured"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No gainers data available</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
