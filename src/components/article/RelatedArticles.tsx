import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/lib/data";

interface RelatedArticlesProps {
  articles: Article[];
  variant?: "sidebar" | "full";
}

function CompactArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex gap-3 p-2 rounded-lg hover:bg-surface-hover transition-colors"
    >
      {/* Thumbnail */}
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted/50">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover object-center transition-transform group-hover:scale-105"
          sizes="96px"
          quality={75}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center min-w-0">
        <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h4>
        <span className="mt-1 text-xs text-muted-foreground">
          {article.publishedAt}
        </span>
      </div>
    </Link>
  );
}

function FullArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group block bg-surface rounded-xl overflow-hidden hover:bg-surface-hover transition-colors"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted/50">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={75}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <Badge
          variant="secondary"
          className={`mb-2 text-[10px] font-semibold uppercase ${article.categoryColor} text-white border-0`}
        >
          {article.category}
        </Badge>
        <h4 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h4>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {article.excerpt}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{article.author}</span>
          <span>•</span>
          <span>{article.publishedAt}</span>
        </div>
      </div>
    </Link>
  );
}

export function RelatedArticles({ articles, variant = "full" }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  if (variant === "sidebar") {
    return (
      <div className="bg-surface rounded-xl p-4 border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-4 pb-3 border-b border-border">
          Related Articles
        </h3>
        <div className="space-y-2">
          {articles.slice(0, 4).map((article) => (
            <CompactArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h2 className="text-xl font-bold text-foreground mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(0, 3).map((article) => (
          <FullArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
