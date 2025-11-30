import { ArticleTOC } from "./ArticleTOC";
import { LiveMarketWidget } from "./LiveMarketWidget";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import type { ArticleHeading, Article } from "@/lib/data";

interface ArticleSidebarProps {
  headings: ArticleHeading[];
  tickers?: string[];
  relatedArticles?: Article[];
}

export function ArticleSidebar({ headings, tickers, relatedArticles }: ArticleSidebarProps) {
  return (
    <div className="sticky top-28 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
      {/* Table of Contents */}
      {headings.length > 0 && <ArticleTOC headings={headings} />}

      {/* Live Market Widget */}
      <LiveMarketWidget tickers={tickers} />

      {/* Related Articles (Sidebar variant) */}
      {relatedArticles && relatedArticles.length > 0 && (
        <RelatedArticles articles={relatedArticles} variant="sidebar" />
      )}
    </div>
  );
}
