// DUAL CATEGORY BADGES - Both markets and business categories
// Updated to show TWO badges per article (markets + business)
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
        <div className="flex gap-1 mb-1.5">
          <Badge
            variant="secondary"
            className={`text-[10px] font-semibold uppercase ${article.marketsCategoryColor} text-white border-0`}
          >
            {article.marketsCategory}
          </Badge>
          <Badge
            variant="secondary"
            className={`text-[10px] font-semibold uppercase ${article.businessCategoryColor} text-white border-0`}
          >
            {article.businessCategory}
          </Badge>
        </div>
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
  console.log("DEBUG HeroSection featuredArticle:", {
    title: featuredArticle.title,
    marketsCategory: featuredArticle.marketsCategory,
    businessCategory: featuredArticle.businessCategory,
  });
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
            <div className="flex gap-2 mb-3">
              <Badge
                variant="secondary"
                className={`text-xs font-semibold uppercase ${featuredArticle.marketsCategoryColor} text-white border-0`}
              >
                {featuredArticle.marketsCategory}
              </Badge>
              <Badge
                variant="secondary"
                className={`text-xs font-semibold uppercase ${featuredArticle.businessCategoryColor} text-white border-0`}
              >
                {featuredArticle.businessCategory}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors">
              {featuredArticle.title}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 mb-4 max-w-2xl">
              {featuredArticle.excerpt}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
