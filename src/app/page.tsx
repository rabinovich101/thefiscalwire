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

  // Fetch hero and grid articles first (for when page builder is not configured)
  const [
    featuredArticle,
    secondaryArticles,
    topStories,
    videos,
    breakingNews,
  ] = await Promise.all([
    getFeaturedArticle(),
    getSecondaryArticles(3),
    getTopStories(6),
    getVideos(4),
    getBreakingNews(),
  ]);

  // Collect IDs from hero section and article grid to exclude from trending
  const excludeIds: string[] = [];
  if (featuredArticle) excludeIds.push(featuredArticle.id);
  secondaryArticles.forEach(a => excludeIds.push(a.id));
  topStories.forEach(a => excludeIds.push(a.id));

  // Fetch trending stories excluding articles already shown
  const trendingStories = await getTrendingStories(8, excludeIds);

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

  // Collect hero article IDs for filtering (from zone or fallback)
  const heroZone = getZoneContent("hero-featured");
  const heroArticleIds: Set<string> = new Set();

  if (heroZone && heroZone.content.length > 0) {
    // Hero is from page builder zone
    heroZone.content.forEach(item => {
      if ('slug' in item) heroArticleIds.add(item.id);
    });
  } else {
    // Hero is from fallback
    if (featuredArticle) heroArticleIds.add(featuredArticle.id);
    secondaryArticles.forEach(a => heroArticleIds.add(a.id));
  }

  // Helper to filter zone content (exclude hero articles)
  const getFilteredZoneContent = (zoneSlug: string, excludeIds: Set<string>) => {
    const zone = getZoneContent(zoneSlug);
    if (!zone) return null;
    return {
      ...zone,
      content: zone.content.filter(item => {
        if ('slug' in item) return !excludeIds.has(item.id);
        return true; // Keep non-article items (videos, etc.)
      })
    };
  };

  // Get filtered content for article-grid (exclude hero articles)
  const articleGridZone = getFilteredZoneContent("article-grid", heroArticleIds);

  // Collect article-grid IDs for trending filtering
  const articleGridIds: Set<string> = new Set(heroArticleIds);
  if (articleGridZone) {
    articleGridZone.content.forEach(item => {
      if ('slug' in item) articleGridIds.add(item.id);
    });
  } else {
    topStories.forEach(a => articleGridIds.add(a.id));
  }

  // Get filtered content for trending (exclude hero + article-grid articles)
  const trendingZone = getFilteredZoneContent("trending-sidebar", articleGridIds);

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
        <section className="py-6 sm:py-8">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Top Stories</h2>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Article Grid - 2/3 width - use zone if configured (filtered to exclude hero articles) */}
              <div className="lg:col-span-2">
                {usePageBuilder && articleGridZone && articleGridZone.content.length > 0 ? (
                  <ZoneRenderer
                    zoneType={articleGridZone.zoneType}
                    content={articleGridZone.content}
                  />
                ) : (
                  <ArticleGrid articles={topStories} />
                )}
              </div>

              {/* Sidebar - 1/3 width */}
              <div className="lg:col-span-1">
                {usePageBuilder && trendingZone && trendingZone.content.length > 0 ? (
                  <ZoneRenderer
                    zoneType={trendingZone.zoneType}
                    content={trendingZone.content}
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
