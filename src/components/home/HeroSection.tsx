import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/lib/data";

interface SecondaryArticleCardProps {
  article: Article;
}

function SecondaryArticleCard({ article }: SecondaryArticleCardProps) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex gap-4 p-4 rounded-lg bg-surface hover:bg-surface-hover transition-colors"
    >
      {/* Thumbnail */}
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center min-w-0">
        <Badge
          variant="secondary"
          className={`w-fit mb-1.5 text-[10px] font-semibold uppercase ${article.categoryColor} text-white border-0`}
        >
          {article.category}
        </Badge>
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <span className="mt-1 text-xs text-muted-foreground">
          {article.publishedAt}
        </span>
      </div>
    </Link>
  );
}

interface HeroSectionProps {
  featuredArticle: Article;
  secondaryArticles: Article[];
}

export function HeroSection({ featuredArticle, secondaryArticles }: HeroSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Featured Article */}
        <Link
          href={`/article/${featuredArticle.slug}`}
          className="group relative col-span-1 lg:col-span-2 h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden rounded-xl bg-surface"
        >
          {/* Background Image */}
          <Image
            src={featuredArticle.imageUrl}
            alt={featuredArticle.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 gradient-overlay" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <Badge
              variant="secondary"
              className={`mb-3 text-xs font-semibold uppercase ${featuredArticle.categoryColor} text-white border-0`}
            >
              {featuredArticle.category}
            </Badge>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 group-hover:text-primary transition-colors">
              {featuredArticle.title}
            </h1>

            <p className="text-sm sm:text-base text-gray-300 line-clamp-2 mb-4 max-w-2xl">
              {featuredArticle.excerpt}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{featuredArticle.author}</span>
              <span>•</span>
              <span>{featuredArticle.publishedAt}</span>
              <span>•</span>
              <span>{featuredArticle.readTime} min read</span>
            </div>
          </div>
        </Link>

        {/* Secondary Articles */}
        <div className="flex flex-col gap-2">
          {secondaryArticles.map((article) => (
            <SecondaryArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
