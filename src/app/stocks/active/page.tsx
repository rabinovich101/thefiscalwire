import { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TrendingStockCard } from "@/components/stocks";
import { getMostActiveStocks } from "@/lib/yahoo-finance";

export const metadata: Metadata = {
  title: "Most Active Stocks | The Fiscal Wire",
  description: "Stocks with the highest trading volume today - see what's moving the market.",
};

export const dynamic = "force-dynamic";

export default async function MostActivePage() {
  const mostActive = await getMostActiveStocks(20).catch(() => []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 border-b border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/stocks"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Stocks
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                Most <span className="text-primary">Active</span>
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Stocks with the highest trading volume today. Updated in real-time.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {mostActive.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mostActive.map((stock, index) => (
                <TrendingStockCard
                  key={stock.symbol}
                  stock={stock}
                  rank={index + 1}
                  variant="featured"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Activity className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No active stocks data available</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
