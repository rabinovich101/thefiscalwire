import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarketTicker } from "@/components/layout/MarketTicker";
import { TrendingSidebar } from "@/components/home/TrendingSidebar";
import { MarketMovers } from "@/components/home/MarketMovers";
import { LoadMoreArticles } from "@/components/home/LoadMoreArticles";
import {
  getArticlesByCategory,
  getArticleCountByCategory,
  getTrendingStories,
} from "@/lib/data";
import { Bitcoin } from "lucide-react";

export const metadata: Metadata = {
  title: "Crypto | The Fiscal Wire",
  description: "Cryptocurrency news, Bitcoin analysis, blockchain technology, and digital asset market updates.",
};

const PAGE_SIZE = 8;

export default async function CryptoPage() {
  const [articles, totalCount, trendingStories] = await Promise.all([
    getArticlesByCategory("crypto", PAGE_SIZE),
    getArticleCountByCategory("crypto"),
    getTrendingStories(8),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <MarketTicker />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-orange-500/10 to-transparent py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Bitcoin className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Crypto</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Cryptocurrency news, Bitcoin and Ethereum analysis, DeFi trends, and blockchain innovations.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Articles Grid */}
              <div className="lg:col-span-2">
                <LoadMoreArticles
                  initialArticles={articles}
                  category="crypto"
                  initialTotal={totalCount}
                  pageSize={PAGE_SIZE}
                />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <TrendingSidebar stories={trendingStories} />
                <MarketMovers />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
