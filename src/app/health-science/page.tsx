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
  getCategoryPageContent,
} from "@/lib/data";
import { ZoneRenderer } from "@/components/zones";
import { HeartPulse } from "lucide-react";

export const metadata: Metadata = {
  title: "Health & Science | The Fiscal Wire",
  description: "Healthcare industry, biotech, pharmaceutical, and scientific breakthrough news.",
};

const PAGE_SIZE = 8;

export default async function HealthSciencePage() {
  const [articleData, trendingStories, pageContent] = await Promise.all([
    getCategoryArticlesWithPlacements("health-science", PAGE_SIZE, 0),
    getTrendingStories(8),
    getCategoryPageContent("health-science"),
  ]);

  const { articles, total: totalCount } = articleData;
  const trendingSidebarZone = pageContent?.get("trending-sidebar");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <MarketTicker />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-rose-600/10 to-transparent py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-600 rounded-lg">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Health & Science</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Healthcare industry news, biotech innovations, pharmaceutical updates, and scientific breakthroughs.
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
                  category="health-science"
                  initialTotal={totalCount}
                  pageSize={PAGE_SIZE}
                />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {trendingSidebarZone ? (
                  <ZoneRenderer
                    zoneType={trendingSidebarZone.zoneType}
                    content={trendingSidebarZone.content}
                  />
                ) : (
                  <TrendingSidebar stories={trendingStories} />
                )}
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
