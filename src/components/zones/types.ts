export interface ZoneArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  imageUrl: string
  publishedAt: Date
  isFeatured?: boolean
  isBreaking?: boolean
  readTime?: number
  category: {
    id: string
    name: string
    slug: string
    color: string
  } | null
  author: {
    id: string
    name: string
    avatar: string | null
  } | null
}

export interface ZoneVideo {
  id: string
  title: string
  thumbnail: string
  duration: string
  category: string
  createdAt: Date
}

export type ZoneContent = ZoneArticle | ZoneVideo

export interface ZonePlacement {
  isPinned: boolean
  content: ZoneContent | Record<string, unknown>
}

export interface ZoneProps {
  zoneType: string
  content: ZoneContent[]
  placements?: ZonePlacement[]
  className?: string
}

export type ZoneType =
  | "HERO_FEATURED"
  | "HERO_SECONDARY"
  | "ARTICLE_GRID"
  | "ARTICLE_LIST"
  | "TRENDING_SIDEBAR"
  | "BREAKING_BANNER"
  | "MARKET_TICKER"
  | "MARKET_MOVERS"
  | "VIDEO_CAROUSEL"
  | "CATEGORY_NAV"
  | "CUSTOM_HTML"
  | "STOCK_CHART"
  | "STOCK_NEWS"

export function isArticle(content: ZoneContent): content is ZoneArticle {
  return "slug" in content && "excerpt" in content
}

export function isVideo(content: ZoneContent): content is ZoneVideo {
  return "duration" in content && "thumbnail" in content
}
