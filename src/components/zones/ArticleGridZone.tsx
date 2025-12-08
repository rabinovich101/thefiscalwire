import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ZoneProps, isArticle, ZoneArticle } from "./types"
import { formatDistanceToNow } from "date-fns"

interface ArticleCardProps {
  article: ZoneArticle
}

function ArticleCard({ article }: ArticleCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-surface border border-border/40 hover:border-primary/50 transition-colors"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-1">
          {article.marketsCategory && (
            <Badge
              variant="secondary"
              className="text-[10px] font-semibold uppercase text-white border-0"
              style={{ backgroundColor: article.marketsCategory.color }}
            >
              {article.marketsCategory.name}
            </Badge>
          )}
          {article.businessCategory && (
            <Badge
              variant="secondary"
              className="text-[10px] font-semibold uppercase text-white border-0"
              style={{ backgroundColor: article.businessCategory.color }}
            >
              {article.businessCategory.name}
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-4">
        <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
          {article.author && <span>{article.author.name}</span>}
          <span>•</span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </Link>
  )
}

export function ArticleGridZone({ content, className }: ZoneProps) {
  const articles = content.filter(isArticle)

  if (articles.length === 0) {
    return null
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${className || ""}`}>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
