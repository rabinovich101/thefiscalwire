// Force dynamic rendering - no static generation at build time
export const dynamic = "force-dynamic";

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
import { ZoneRenderer } from "@/components/zones";
import {
  getFeaturedArticle,
  getSecondaryArticles,
  getTopStories,
  getTrendingStories,
  getVideos,
  getBreakingNews,
  getHomepageContent,
} from "@/lib/data";

export default async function Home() {
  // Try to get page builder content first
  const pageContent = await getHomepageContent();

  // Fetch all fallback data in parallel (for when page builder is not configured)
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

  // If page builder is configured, render zones
  const usePageBuilder = pageContent && pageContent.size > 0;

  // Handle case where no featured article exists (and no page builder)
  if (!featuredArticle && !usePageBuilder) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main id="main-content" className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No articles found. Please seed the database.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Helper to get zone content
  const getZoneContent = (zoneSlug: string) => {
    if (!pageContent) return null;
    return pageContent.get(zoneSlug);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header />

      {/* Market Ticker - fetches live data from Yahoo Finance */}
      <MarketTicker />

      {/* Breaking News - use zone if configured, otherwise fallback */}
      {usePageBuilder && getZoneContent("breaking-banner") ? (
        <ZoneRenderer
          zoneType={getZoneContent("breaking-banner")!.zoneType}
          content={getZoneContent("breaking-banner")!.content}
        />
      ) : (
        <BreakingNewsBanner news={breakingNews} />
      )}

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {/* Hero Section - use zone if configured, otherwise fallback */}
        {usePageBuilder && getZoneContent("hero-featured") ? (
          <ZoneRenderer
            zoneType={getZoneContent("hero-featured")!.zoneType}
            content={getZoneContent("hero-featured")!.content}
          />
        ) : featuredArticle ? (
          <HeroSection
            featuredArticle={featuredArticle}
            secondaryArticles={secondaryArticles}
          />
        ) : null}

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
                aria-label="View all top stories"
              >
                View All
              </a>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Article Grid - 2/3 width - use zone if configured */}
              <div className="lg:col-span-2">
                {usePageBuilder && getZoneContent("article-grid") ? (
                  <ZoneRenderer
                    zoneType={getZoneContent("article-grid")!.zoneType}
                    content={getZoneContent("article-grid")!.content}
                  />
                ) : (
                  <ArticleGrid articles={topStories} />
                )}
              </div>

              {/* Sidebar - 1/3 width */}
              <div className="lg:col-span-1">
                {usePageBuilder && getZoneContent("trending-sidebar") ? (
                  <ZoneRenderer
                    zoneType={getZoneContent("trending-sidebar")!.zoneType}
                    content={getZoneContent("trending-sidebar")!.content}
                  />
                ) : (
                  <TrendingSidebar stories={trendingStories} />
                )}
                <MarketMovers />
              </div>
            </div>
          </div>
        </section>

        {/* Video Section - use zone if configured */}
        {usePageBuilder && getZoneContent("video-carousel") ? (
          <ZoneRenderer
            zoneType={getZoneContent("video-carousel")!.zoneType}
            content={getZoneContent("video-carousel")!.content}
            className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
          />
        ) : (
          <VideoCarousel videos={videos} />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
