import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import type { Article } from "@/lib/data";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/article/${article.slug}`}
        className="group flex gap-4 py-3 border-b border-border/40 last:border-0"
      >
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <span className="mt-1 text-xs text-muted-foreground">
            {article.publishedAt}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Card className="group overflow-hidden bg-surface border-border/40 hover:border-primary/30 transition-all card-hover">
      <Link href={`/article/${article.slug}`}>
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className={`text-[10px] font-semibold uppercase ${article.categoryColor} text-white border-0`}
            >
              {article.category}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <BookmarkButton articleId={article.slug} variant="overlay" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{article.author}</span>
            <span>•</span>
            <span>{article.publishedAt}</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
