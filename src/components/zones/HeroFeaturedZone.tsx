import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ZoneProps, isArticle, ZoneArticle } from "./types"
import { formatDistanceToNow } from "date-fns"

interface SecondaryArticleCardProps {
  article: ZoneArticle
}

function SecondaryArticleCard({ article }: SecondaryArticleCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })

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
        {article.category && (
          <Badge
            variant="secondary"
            className="w-fit mb-1.5 text-[10px] font-semibold uppercase text-white border-0"
            style={{ backgroundColor: article.category.color }}
          >
            {article.category.name}
          </Badge>
        )}
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <span className="mt-1 text-xs text-muted-foreground">{timeAgo}</span>
      </div>
    </Link>
  )
}

export function HeroFeaturedZone({ content, className }: ZoneProps) {
  // Filter to only articles
  const articles = content.filter(isArticle)

  if (articles.length === 0) {
    return null
  }

  const featuredArticle = articles[0]
  const secondaryArticles = articles.slice(1, 5) // Up to 4 secondary articles

  const timeAgo = formatDistanceToNow(new Date(featuredArticle.publishedAt), { addSuffix: true })

  return (
    <section className={`mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ${className || ""}`}>
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
            {featuredArticle.category && (
              <Badge
                variant="secondary"
                className="mb-3 text-xs font-semibold uppercase text-white border-0"
                style={{ backgroundColor: featuredArticle.category.color }}
              >
                {featuredArticle.category.name}
              </Badge>
            )}

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors">
              {featuredArticle.title}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 mb-4 max-w-2xl">
              {featuredArticle.excerpt}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {featuredArticle.author && <span>{featuredArticle.author.name}</span>}
              <span>•</span>
              <span>{timeAgo}</span>
              {featuredArticle.readTime && (
                <>
                  <span>•</span>
                  <span>{featuredArticle.readTime} min read</span>
                </>
              )}
            </div>
          </div>
        </Link>

        {/* Secondary Articles */}
        {secondaryArticles.length > 0 && (
          <div className="flex flex-col gap-2">
            {secondaryArticles.map((article) => (
              <SecondaryArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
