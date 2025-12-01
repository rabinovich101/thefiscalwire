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
import { Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Tech | The Fiscal Wire",
  description: "Technology news, AI developments, big tech earnings, and innovation in the tech sector.",
};

const PAGE_SIZE = 8;

export default async function TechPage() {
  const [articles, totalCount, trendingStories] = await Promise.all([
    getArticlesByCategory("tech", PAGE_SIZE),
    getArticleCountByCategory("tech"),
    getTrendingStories(8),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <MarketTicker />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-purple-600/10 to-transparent py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Tech</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Breaking technology news, AI innovations, big tech earnings, and the future of the digital economy.
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
                  category="tech"
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
