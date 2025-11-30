import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArticleMeta } from "./ArticleMeta";
import { categoryColors, type ArticleDetail } from "@/data/mockData";

interface ArticleHeroProps {
  article: ArticleDetail;
}

export function ArticleHero({ article }: ArticleHeroProps) {
  return (
    <section className="relative w-full min-h-[50vh] sm:min-h-[55vh] lg:min-h-[65vh]">
      {/* Full-bleed background image */}
      <Image
        src={article.imageUrl}
        alt={article.title}
        fill
        className="object-cover"
        priority
      />

      {/* Gradient overlay - darker for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />

      {/* Content container */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="mx-auto max-w-4xl px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16">
          {/* Category Badge */}
          <Badge
            variant="secondary"
            className={`mb-4 text-xs font-semibold uppercase ${categoryColors[article.category]} text-white border-0`}
          >
            {article.category}
          </Badge>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-base sm:text-lg text-gray-300 mb-6 max-w-3xl">
            {article.excerpt}
          </p>

          {/* Meta Info */}
          <ArticleMeta
            author={article.author}
            publishedAt={article.publishedAt}
            readTime={article.readTime}
          />
        </div>
      </div>
    </section>
  );
}
