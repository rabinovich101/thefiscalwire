import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { ZoneProps, isArticle } from "./types"

export function BreakingBannerZone({ content, className }: ZoneProps) {
  // Get the first breaking article
  const breakingArticle = content.filter(isArticle).find((a) => a.isBreaking)
  const article = breakingArticle || content.filter(isArticle)[0]

  if (!article) {
    return null
  }

  return (
    <div
      className={`bg-red-600 text-white py-2 px-4 ${className || ""}`}
    >
      <div className="mx-auto max-w-7xl flex items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <AlertTriangle className="h-4 w-4 animate-pulse" />
          <span className="font-bold text-sm uppercase tracking-wide">Breaking</span>
        </div>
        <div className="h-4 w-px bg-white/30" />
        <Link
          href={`/article/${article.slug}`}
          className="text-sm font-medium truncate hover:underline"
        >
          {article.title}
        </Link>
      </div>
    </div>
  )
}
