import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarketTicker } from "@/components/layout/MarketTicker";
import { BreakingNewsBanner } from "@/components/home/BreakingNewsBanner";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryNav } from "@/components/home/CategoryNav";
import { ArticleGrid } from "@/components/home/ArticleGrid";
import { TrendingSidebar } from "@/components/home/TrendingSidebar";
import { MarketMovers } from "@/components/home/MarketMovers";
import { VideoCarousel } from "@/components/home/VideoCarousel";
import {
  getFeaturedArticle,
  getSecondaryArticles,
  getTopStories,
  getTrendingStories,
  getMarketIndices,
  getVideos,
  getBreakingNews,
} from "@/lib/data";

// Static mock data for market movers (these could be fetched from an API in the future)
const topGainers = [
  { symbol: "NVDA", name: "NVIDIA", price: 142.62, change: 8.44, changePercent: 6.29 },
  { symbol: "AMD", name: "AMD", price: 138.91, change: 5.22, changePercent: 3.91 },
  { symbol: "TSLA", name: "Tesla", price: 352.56, change: 11.88, changePercent: 3.48 },
  { symbol: "COIN", name: "Coinbase", price: 312.45, change: 9.67, changePercent: 3.19 },
  { symbol: "MSTR", name: "MicroStrategy", price: 402.33, change: 10.55, changePercent: 2.69 },
];

const topLosers = [
  { symbol: "XOM", name: "Exxon Mobil", price: 108.22, change: -3.88, changePercent: -3.46 },
  { symbol: "CVX", name: "Chevron", price: 148.90, change: -4.21, changePercent: -2.75 },
  { symbol: "BA", name: "Boeing", price: 178.44, change: -4.11, changePercent: -2.25 },
  { symbol: "PFE", name: "Pfizer", price: 26.18, change: -0.52, changePercent: -1.95 },
  { symbol: "DIS", name: "Disney", price: 112.33, change: -1.89, changePercent: -1.66 },
];

export default async function Home() {
  // Fetch all data in parallel
  const [
    featuredArticle,
    secondaryArticles,
    topStories,
    trendingStories,
    marketIndices,
    videos,
    breakingNews,
  ] = await Promise.all([
    getFeaturedArticle(),
    getSecondaryArticles(3),
    getTopStories(6),
    getTrendingStories(8),
    getMarketIndices(),
    getVideos(4),
    getBreakingNews(),
  ]);

  // Handle case where no featured article exists
  if (!featuredArticle) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No articles found. Please seed the database.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header />

      {/* Market Ticker */}
      <MarketTicker indices={marketIndices} />

      {/* Breaking News */}
      <BreakingNewsBanner news={breakingNews} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          featuredArticle={featuredArticle}
          secondaryArticles={secondaryArticles}
        />

        {/* Category Navigation */}
        <CategoryNav />

        {/* Main Content Grid */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Top Stories</h2>
              <a
                href="/news"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                View All
              </a>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Article Grid - 2/3 width */}
              <div className="lg:col-span-2">
                <ArticleGrid articles={topStories} />
              </div>

              {/* Sidebar - 1/3 width */}
              <div className="lg:col-span-1">
                <TrendingSidebar stories={trendingStories} />
                <MarketMovers gainers={topGainers} losers={topLosers} />
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <VideoCarousel videos={videos} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
