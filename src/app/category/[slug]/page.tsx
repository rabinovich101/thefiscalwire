// Force dynamic rendering - no static generation at build time
export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarketTicker } from "@/components/layout/MarketTicker";
import { TrendingSidebar } from "@/components/home/TrendingSidebar";
import { MarketMovers } from "@/components/home/MarketMovers";
import { LoadMoreArticles } from "@/components/home/LoadMoreArticles";
import {
  getCategoryArticlesWithPlacements,
  getTrendingStories,
  getCategoryBySlug,
  getCategoryPageContent,
} from "@/lib/data";
import { ZoneRenderer } from "@/components/zones";
import {
  TrendingUp,
  DollarSign,
  Bitcoin,
  Landmark,
  BarChart2,
  Building2,
  Wallet,
  HeartPulse,
  Home,
  Tv,
  Truck,
  Factory,
  Trophy,
  Cpu,
  Vote,
  ShoppingCart,
  MessageSquare,
  LucideIcon,
} from "lucide-react";

// Category icon mapping
const categoryIcons: Record<string, LucideIcon> = {
  'us-markets': TrendingUp,
  'europe-markets': TrendingUp,
  'asia-markets': TrendingUp,
  'forex': DollarSign,
  'crypto': Bitcoin,
  'bonds': Landmark,
  'etf': BarChart2,
  'economy': Building2,
  'finance': Wallet,
  'health-science': HeartPulse,
  'real-estate': Home,
  'media': Tv,
  'transportation': Truck,
  'industrial': Factory,
  'sports': Trophy,
  'tech': Cpu,
  'politics': Vote,
  'consumption': ShoppingCart,
  'opinion': MessageSquare,
};

// Category descriptions
const categoryDescriptions: Record<string, string> = {
  'us-markets': 'US stock market news, analysis, and trading insights.',
  'europe-markets': 'European market coverage, FTSE, DAX, and Euro Stoxx updates.',
  'asia-markets': 'Asian market news including Nikkei, Hang Seng, and Shanghai.',
  'forex': 'Foreign exchange markets, currency pairs, and forex trading analysis.',
  'crypto': 'Cryptocurrency news, Bitcoin and Ethereum analysis, DeFi trends.',
  'bonds': 'Fixed income, Treasury yields, and bond market analysis.',
  'etf': 'Exchange-traded funds, ETF analysis, and investment strategies.',
  'economy': 'Economic news, GDP reports, and macroeconomic analysis.',
  'finance': 'Financial services, banking, and corporate finance news.',
  'health-science': 'Healthcare industry, biotech, pharma, and scientific breakthroughs.',
  'real-estate': 'Real estate market trends, housing, and property investment.',
  'media': 'Media industry, entertainment, and streaming platforms.',
  'transportation': 'Airlines, shipping, logistics, and transportation industry.',
  'industrial': 'Manufacturing, industrial production, and supply chain.',
  'sports': 'Sports business, team valuations, and athletic industry news.',
  'tech': 'Technology news, AI, semiconductors, and tech industry updates.',
  'politics': 'Political news impacting markets and business.',
  'consumption': 'Consumer spending, retail, and e-commerce trends.',
  'opinion': 'Expert commentary, analysis, and market perspectives.',
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found | The Fiscal Wire",
    };
  }

  return {
    title: `${category.name} | The Fiscal Wire`,
    description: categoryDescriptions[slug] || `Latest ${category.name} news and analysis.`,
  };
}

const PAGE_SIZE = 8;

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Try to get page builder content
  const pageContent = await getCategoryPageContent(slug);

  const [articleData, trendingStories] = await Promise.all([
    getCategoryArticlesWithPlacements(slug, PAGE_SIZE, 0),
    getTrendingStories(8),
  ]);

  const { articles, total: totalCount } = articleData;

  const Icon = categoryIcons[slug] || TrendingUp;
  const description = categoryDescriptions[slug] || `Latest ${category.name} news and analysis.`;

  // Extract color class for gradient
  const colorClass = category.color || 'bg-gray-600';
  const gradientColor = colorClass.replace('bg-', '');

  // If page builder is configured, render zones
  const usePageBuilder = pageContent && pageContent.size > 0;

  // Helper to get zone content
  const getZoneContent = (zoneSlug: string) => {
    if (!pageContent) return null;
    return pageContent.get(zoneSlug);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <MarketTicker />

      <main className="flex-1">
        {/* Hero Section */}
        <section className={`bg-gradient-to-b from-${gradientColor}/10 to-transparent py-12`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 ${colorClass} rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {description}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Articles Grid - use zone if configured */}
              <div className="lg:col-span-2">
                {usePageBuilder && getZoneContent("article-grid") ? (
                  <ZoneRenderer
                    zoneType={getZoneContent("article-grid")!.zoneType}
                    content={getZoneContent("article-grid")!.content}
                  />
                ) : usePageBuilder && getZoneContent("article-list") ? (
                  <ZoneRenderer
                    zoneType={getZoneContent("article-list")!.zoneType}
                    content={getZoneContent("article-list")!.content}
                  />
                ) : (
                  <LoadMoreArticles
                    initialArticles={articles}
                    category={slug}
                    initialTotal={totalCount}
                    pageSize={PAGE_SIZE}
                  />
                )}
              </div>

              {/* Sidebar - use zone if configured */}
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
      </main>

      <Footer />
    </div>
  );
}
