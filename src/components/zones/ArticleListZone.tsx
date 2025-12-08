import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ZoneProps, isArticle, ZoneArticle } from "./types"
import { formatDistanceToNow } from "date-fns"

interface ArticleListItemProps {
  article: ZoneArticle
}

function ArticleListItem({ article }: ArticleListItemProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex gap-4 p-4 rounded-lg bg-surface hover:bg-surface-hover border border-border/40 transition-colors"
    >
      {/* Image */}
      <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center min-w-0 flex-1">
        <div className="flex gap-1 mb-1.5">
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
        <h3 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
          {article.author && <span>{article.author.name}</span>}
          <span>•</span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListZone({ content, className }: ZoneProps) {
  const articles = content.filter(isArticle)

  if (articles.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-col gap-4 ${className || ""}`}>
      {articles.map((article) => (
        <ArticleListItem key={article.id} article={article} />
      ))}
    </div>
  )
}
