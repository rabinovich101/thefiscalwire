import Link from "next/link"
import { TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ZoneProps, isArticle } from "./types"

export function TrendingSidebarZone({ content, className }: ZoneProps) {
  const articles = content.filter(isArticle)

  if (articles.length === 0) {
    return null
  }

  return (
    <div className={`rounded-xl bg-surface border border-border/40 p-5 ${className || ""}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/40">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Trending Now</h2>
      </div>

      {/* Trending List */}
      <div className="space-y-0">
        {articles.map((article, index) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group flex items-start gap-3 py-3 border-b border-border/40 last:border-0"
          >
            {/* Rank Number */}
            <span className="text-2xl font-bold text-muted-foreground/50 tabular-nums w-6 shrink-0">
              {index + 1}
            </span>

            {/* Content */}
            <div className="flex flex-col min-w-0">
              <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              {article.category && (
                <Badge
                  variant="outline"
                  className="w-fit mt-1.5 text-[10px] font-medium text-muted-foreground border-border/40"
                >
                  {article.category.name}
                </Badge>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
