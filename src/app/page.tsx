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
  getVideos,
  getBreakingNews,
} from "@/lib/data";

export default async function Home() {
  // Fetch all data in parallel
  const [
    featuredArticle,
    secondaryArticles,
    topStories,
    trendingStories,
    videos,
    breakingNews,
  ] = await Promise.all([
    getFeaturedArticle(),
    getSecondaryArticles(3),
    getTopStories(6),
    getTrendingStories(8),
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

      {/* Market Ticker - fetches live data from Yahoo Finance */}
      <MarketTicker />

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
                <MarketMovers />
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
