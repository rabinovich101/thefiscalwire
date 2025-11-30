import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarketTicker } from "@/components/layout/MarketTicker";
import { ArticleHero } from "@/components/article/ArticleHero";
import { ArticleBody } from "@/components/article/ArticleBody";
import { ArticleSidebar } from "@/components/sidebar/ArticleSidebar";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import {
  getArticleBySlug,
  getRelatedArticles,
  getArticleSlugs,
} from "@/lib/data";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  // Fetch article
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Fetch related articles
  const relatedArticles = await getRelatedArticles(article.id);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header />

      {/* Market Ticker - fetches live data from Yahoo Finance */}
      <MarketTicker />

      {/* Main Content */}
      <main className="flex-1">
        {/* Full-bleed Hero */}
        <ArticleHero article={article} />

        {/* Content Grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content - 2/3 width on desktop */}
            <div className="lg:col-span-2">
              <ArticleBody article={article} />
            </div>

            {/* Sidebar - 1/3 width on desktop, hidden on mobile */}
            <aside className="hidden lg:block">
              <ArticleSidebar
                headings={article.headings}
                tickers={article.relevantTickers}
                relatedArticles={relatedArticles}
              />
            </aside>
          </div>

          {/* Related Articles - Full Width (mobile and below sidebar) */}
          <div className="lg:hidden">
            <RelatedArticles articles={relatedArticles} />
          </div>
        </div>

        {/* Related Articles - Full Width on Desktop (after main content) */}
        <div className="hidden lg:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
          <RelatedArticles articles={relatedArticles} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Generate static params for known articles
export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata
export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${article.title} | FinanceNews`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.imageUrl],
    },
  };
}
