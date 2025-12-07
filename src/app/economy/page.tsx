// Force dynamic rendering - no static generation at build time
export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarketTicker } from "@/components/layout/MarketTicker";
import { TrendingSidebar } from "@/components/home/TrendingSidebar";
import { MarketMovers } from "@/components/home/MarketMovers";
import { LoadMoreArticles } from "@/components/home/LoadMoreArticles";
import {
  getCategoryArticlesWithPlacements,
  getTrendingStories,
} from "@/lib/data";
import { Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Economy | The Fiscal Wire",
  description: "Economic news, Federal Reserve updates, GDP reports, and macroeconomic analysis.",
};

const PAGE_SIZE = 8;

export default async function EconomyPage() {
  const [articleData, trendingStories] = await Promise.all([
    getCategoryArticlesWithPlacements("economy", PAGE_SIZE, 0),
    getTrendingStories(8),
  ]);

  const { articles, total: totalCount } = articleData;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <MarketTicker />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-green-600/10 to-transparent py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-600 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Economy</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Track economic indicators, Federal Reserve policy, employment data, and global economic trends.
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
                  category="economy"
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
