import prisma from './prisma'

// Types for the frontend (matching existing mockData types)
export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  categoryColor: string
  imageUrl: string
  author: string
  authorAvatar?: string
  publishedAt: string
  readTime: number
  isFeatured: boolean
  isBreaking: boolean
}

export interface ArticleDetail extends Article {
  content: ArticleContentBlock[]
  tags: string[]
  relevantTickers: string[]
  headings: ArticleHeading[]
}

export interface ArticleContentBlock {
  type: 'paragraph' | 'heading' | 'image' | 'chart' | 'quote' | 'callout' | 'list'
  content?: string
  level?: 2 | 3
  items?: string[]
  chartData?: ChartDataPoint[]
  chartSymbol?: string
  attribution?: string
  imageUrl?: string
  imageCaption?: string
}

export interface ChartDataPoint {
  time: string
  value: number
  volume?: number
}

export interface ArticleHeading {
  id: string
  text: string
  level: 2 | 3
}

export interface MarketIndex {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

export interface TrendingItem {
  rank: number
  title: string
  category: string
  url: string
}

export interface Video {
  id: string
  title: string
  thumbnail: string
  duration: string
  category: string
}

export interface BreakingNews {
  isActive: boolean
  headline: string
  url: string
}

// Helper to format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

// Category colors map
const categoryColors: Record<string, string> = {
  // Markets Section
  'us-markets': 'bg-blue-600',
  'europe-markets': 'bg-blue-500',
  'asia-markets': 'bg-blue-400',
  'forex': 'bg-cyan-600',
  'crypto': 'bg-orange-500',
  'bonds': 'bg-indigo-600',
  'etf': 'bg-teal-600',
  // Business Section
  'economy': 'bg-green-600',
  'finance': 'bg-emerald-600',
  'health-science': 'bg-red-500',
  'real-estate': 'bg-amber-600',
  'media': 'bg-pink-600',
  'transportation': 'bg-slate-600',
  'industrial': 'bg-zinc-600',
  'sports': 'bg-lime-600',
  'tech': 'bg-purple-600',
  'politics': 'bg-rose-600',
  'consumption': 'bg-yellow-600',
  'opinion': 'bg-gray-600',
}

// Prisma article type with relations
interface PrismaArticleWithRelations {
  id: string
  slug: string
  title: string
  excerpt: string
  imageUrl: string
  readTime: number
  isFeatured: boolean
  isBreaking: boolean
  publishedAt: Date
  content: unknown
  headings: unknown
  relevantTickers: string[]
  category?: { slug: string; color: string | null } | null
  author?: { name: string; avatar?: string | null } | null
  tags?: { name: string }[]
  relatedTo?: PrismaArticleWithRelations[]
}

// Transform Prisma article to frontend Article
function transformArticle(article: PrismaArticleWithRelations): Article {
  const categorySlug = article.category?.slug || 'markets'
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: categorySlug,
    categoryColor: article.category?.color || categoryColors[categorySlug] || 'bg-gray-600',
    imageUrl: article.imageUrl,
    author: article.author?.name || 'Unknown',
    authorAvatar: article.author?.avatar ?? undefined,
    publishedAt: formatRelativeTime(article.publishedAt),
    readTime: article.readTime,
    isFeatured: article.isFeatured,
    isBreaking: article.isBreaking,
  }
}

// Transform Prisma article to frontend ArticleDetail
function transformArticleDetail(article: PrismaArticleWithRelations): ArticleDetail {
  return {
    ...transformArticle(article),
    content: article.content as ArticleContentBlock[],
    tags: article.tags?.map((t) => t.name) || [],
    relevantTickers: article.relevantTickers || [],
    headings: (article.headings as ArticleHeading[]) || [],
  }
}

// =========================
// Data Fetching Functions
// =========================

export async function getFeaturedArticle(): Promise<Article | null> {
  // First try to find a featured article
  let article = await prisma.article.findFirst({
    where: { isFeatured: true },
    include: {
      author: true,
      category: true,
    },
    orderBy: { publishedAt: 'desc' },
  })

  // If no featured article, fallback to the most recent article
  if (!article) {
    article = await prisma.article.findFirst({
      include: {
        author: true,
        category: true,
      },
      orderBy: { publishedAt: 'desc' },
    })
  }

  return article ? transformArticle(article) : null
}

export async function getSecondaryArticles(limit = 3): Promise<Article[]> {
  // Check if there's a featured article
  const hasFeatured = await prisma.article.findFirst({
    where: { isFeatured: true },
    select: { id: true },
  })

  const articles = await prisma.article.findMany({
    where: hasFeatured ? { isFeatured: false } : undefined,
    include: {
      author: true,
      category: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    skip: hasFeatured ? 0 : 1, // Skip first article if it's being used as featured
  })

  return articles.map(transformArticle)
}

export async function getTopStories(limit = 6): Promise<Article[]> {
  // Check if there's a featured article
  const hasFeatured = await prisma.article.findFirst({
    where: { isFeatured: true },
    select: { id: true },
  })

  const articles = await prisma.article.findMany({
    where: hasFeatured ? { isFeatured: false } : undefined,
    include: {
      author: true,
      category: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    skip: hasFeatured ? 3 : 4, // Skip featured + secondary articles
  })

  return articles.map(transformArticle)
}

export async function getAllArticles(): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    include: {
      author: true,
      category: true,
    },
    orderBy: { publishedAt: 'desc' },
  })

  return articles.map(transformArticle)
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
      tags: true,
      relatedTo: {
        include: {
          author: true,
          category: true,
        },
      },
    },
  })

  return article ? transformArticleDetail(article) : null
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
  })
}

export async function getRelatedArticles(articleId: string): Promise<Article[]> {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      relatedTo: {
        include: {
          author: true,
          category: true,
        },
      },
    },
  })

  return article?.relatedTo.map(transformArticle) || []
}

export async function getArticleSlugs(): Promise<string[]> {
  const articles = await prisma.article.findMany({
    select: { slug: true },
  })

  return articles.map((a) => a.slug)
}

export async function getTrendingStories(limit = 8): Promise<TrendingItem[]> {
  const articles = await prisma.article.findMany({
    include: {
      category: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })

  return articles.map((article, index) => ({
    rank: index + 1,
    title: article.title,
    category: article.category?.slug || 'markets',
    url: `/article/${article.slug}`,
  }))
}

export async function getMarketIndices(): Promise<MarketIndex[]> {
  const indices = await prisma.marketIndex.findMany()

  return indices.map((index) => ({
    symbol: index.symbol,
    name: index.name,
    price: index.price,
    change: index.change,
    changePercent: index.changePercent,
  }))
}

export async function getVideos(limit = 4): Promise<Video[]> {
  const videos = await prisma.video.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
  })

  return videos.map((video) => ({
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnail,
    duration: video.duration,
    category: video.category,
  }))
}

export async function getBreakingNews(): Promise<BreakingNews | null> {
  const news = await prisma.breakingNews.findFirst({
    where: { isActive: true },
  })

  return news
    ? {
        isActive: news.isActive,
        headline: news.headline,
        url: news.url,
      }
    : null
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function getArticlesByCategory(categorySlug: string, limit?: number): Promise<Article[]> {
  // Use the many-to-many relation to find articles in this category
  // Articles can belong to multiple categories
  const articles = await prisma.article.findMany({
    where: {
      categories: {
        some: {
          slug: categorySlug,
        },
      },
    },
    include: {
      author: true,
      category: true, // Primary category for display
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })

  return articles.map(transformArticle)
}

export async function getArticleCountByCategory(categorySlug: string): Promise<number> {
  // Use the many-to-many relation to count articles in this category
  return prisma.article.count({
    where: {
      categories: {
        some: {
          slug: categorySlug,
        },
      },
    },
  })
}

// ============================================
// Page Builder Data Functions
// ============================================

import { getPageZonesContent, type ResolvedContent } from './auto-fill'
import type { ZoneContent } from '@/components/zones/types'

export interface PageConfiguration {
  id: string
  name: string
  slug: string
  pageType: string
  isActive: boolean
  zones: PageZoneConfig[]
}

export interface PageZoneConfig {
  id: string
  slug: string
  zoneType: string
  isEnabled: boolean
  sortOrder: number
}

/**
 * Gets the page configuration for a specific page slug
 */
export async function getPageConfiguration(slug: string): Promise<PageConfiguration | null> {
  const page = await prisma.pageDefinition.findFirst({
    where: { slug, isActive: true },
    include: {
      zones: {
        where: { isEnabled: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          zoneDefinition: true,
        },
      },
    },
  })

  if (!page) {
    return null
  }

  return {
    id: page.id,
    name: page.name,
    slug: page.slug,
    pageType: page.pageType,
    isActive: page.isActive,
    zones: page.zones.map((zone) => ({
      id: zone.id,
      slug: zone.zoneDefinition?.slug || zone.id,
      zoneType: zone.zoneDefinition?.zoneType || 'CUSTOM',
      isEnabled: zone.isEnabled,
      sortOrder: zone.sortOrder,
    })),
  }
}

/**
 * Gets all content for a page by its slug, with zones resolved
 */
export async function getPageContent(
  pageSlug: string
): Promise<Map<string, { zoneType: string; content: ZoneContent[] }> | null> {
  const zonesContent = await getPageZonesContent(pageSlug)

  if (!zonesContent || zonesContent.size === 0) {
    return null
  }

  // Transform to the expected format
  const result = new Map<string, { zoneType: string; content: ZoneContent[] }>()

  for (const [zoneSlug, data] of zonesContent) {
    result.set(zoneSlug, {
      zoneType: data.zoneType,
      content: data.content.map(transformZoneContent),
    })
  }

  return result
}

/**
 * Transform auto-fill content to zone content format
 */
function transformZoneContent(item: ResolvedContent): ZoneContent {
  if ('slug' in item) {
    // It's an article
    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      imageUrl: item.imageUrl,
      publishedAt: item.publishedAt,
      isFeatured: item.isFeatured,
      isBreaking: item.isBreaking,
      category: item.category,
      author: item.author,
    }
  } else {
    // It's a video
    return {
      id: item.id,
      title: item.title,
      thumbnail: item.thumbnail,
      duration: item.duration,
      category: item.category,
      createdAt: item.createdAt,
    }
  }
}

/**
 * Gets homepage configuration
 */
export async function getHomepageConfiguration(): Promise<PageConfiguration | null> {
  return getPageConfiguration('homepage')
}

/**
 * Gets homepage content with all zones resolved
 */
export async function getHomepageContent(): Promise<Map<string, { zoneType: string; content: ZoneContent[] }> | null> {
  return getPageContent('homepage')
}

/**
 * Gets category page configuration
 */
export async function getCategoryPageConfiguration(
  categorySlug: string
): Promise<PageConfiguration | null> {
  // First try to find a specific category page
  const specificPage = await prisma.pageDefinition.findFirst({
    where: {
      isActive: true,
      pageType: 'CATEGORY',
      category: { slug: categorySlug },
    },
    include: {
      zones: {
        where: { isEnabled: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          zoneDefinition: true,
        },
      },
    },
  })

  if (specificPage) {
    return {
      id: specificPage.id,
      name: specificPage.name,
      slug: specificPage.slug,
      pageType: specificPage.pageType,
      isActive: specificPage.isActive,
      zones: specificPage.zones.map((zone) => ({
        id: zone.id,
        slug: zone.zoneDefinition?.slug || zone.id,
        zoneType: zone.zoneDefinition?.zoneType || 'CUSTOM',
        isEnabled: zone.isEnabled,
        sortOrder: zone.sortOrder,
      })),
    }
  }

  // Fall back to a generic category template
  return getPageConfiguration('category-template')
}

/**
 * Gets category page content with all zones resolved
 */
export async function getCategoryPageContent(
  categorySlug: string
): Promise<Map<string, { zoneType: string; content: ZoneContent[] }> | null> {
  // First try to find a specific category page
  const specificPage = await prisma.pageDefinition.findFirst({
    where: {
      isActive: true,
      pageType: 'CATEGORY',
      category: { slug: categorySlug },
    },
  })

  if (specificPage) {
    return getPageContent(specificPage.slug)
  }

  // Fall back to category-template
  return getPageContent('category-template')
}

// ============================================
// Category Articles with Page Builder Support
// ============================================

/**
 * Gets articles for a category page using page builder placements for ordering.
 * Falls back to chronological order if no page builder configuration exists.
 *
 * @param categorySlug - The category slug (e.g., "crypto", "tech")
 * @param limit - Number of articles to return
 * @param offset - Number of articles to skip (for pagination)
 * @returns Articles in page builder order (if configured), then chronological
 */
export async function getCategoryArticlesWithPlacements(
  categorySlug: string,
  limit: number,
  offset: number = 0
): Promise<{
  articles: Article[]
  total: number
  hasPageBuilder: boolean
}> {
  // 1. Find the category page definition with placements
  const categoryPage = await prisma.pageDefinition.findFirst({
    where: {
      isActive: true,
      pageType: 'CATEGORY',
      category: { slug: categorySlug },
    },
    include: {
      zones: {
        where: {
          isEnabled: true,
        },
        include: {
          placements: {
            where: {
              contentType: 'ARTICLE',
              articleId: { not: null },
              // Filter by valid date range
              OR: [
                { startDate: null, endDate: null },
                { startDate: null, endDate: { gte: new Date() } },
                { startDate: { lte: new Date() }, endDate: null },
                { startDate: { lte: new Date() }, endDate: { gte: new Date() } },
              ],
            },
            orderBy: { position: 'asc' },
            include: {
              article: {
                include: {
                  author: true,
                  category: true,
                }
              }
            }
          },
          zoneDefinition: true,
        }
      }
    }
  })

  // 2. If no page builder config or no zones, fall back to default behavior
  if (!categoryPage || categoryPage.zones.length === 0) {
    const [articles, total] = await Promise.all([
      getArticlesByCategoryWithOffset(categorySlug, limit, offset),
      getArticleCountByCategory(categorySlug),
    ])
    return { articles, total, hasPageBuilder: false }
  }

  // 3. Collect all placed articles (maintaining position order)
  // Deduplicate articles that might be in multiple zones
  const seenArticleIds = new Set<string>()
  const placedArticles: PrismaArticleWithRelations[] = []

  for (const zone of categoryPage.zones) {
    for (const placement of zone.placements) {
      if (placement.article && !seenArticleIds.has(placement.article.id)) {
        seenArticleIds.add(placement.article.id)
        placedArticles.push(placement.article as PrismaArticleWithRelations)
      }
    }
  }

  // 4. If no placements exist, fall back to default behavior
  if (placedArticles.length === 0) {
    const [articles, total] = await Promise.all([
      getArticlesByCategoryWithOffset(categorySlug, limit, offset),
      getArticleCountByCategory(categorySlug),
    ])
    return { articles, total, hasPageBuilder: false }
  }

  // 5. Get additional articles not in placements (for infinite scroll)
  const additionalArticles = await prisma.article.findMany({
    where: {
      categories: { some: { slug: categorySlug } },
      id: { notIn: Array.from(seenArticleIds) }
    },
    include: { author: true, category: true },
    orderBy: { publishedAt: 'desc' },
  })

  // 6. Combine: placed articles first (in position order), then chronological
  const allArticles = [...placedArticles, ...additionalArticles]
  const paginatedArticles = allArticles.slice(offset, offset + limit)

  return {
    articles: paginatedArticles.map(transformArticle),
    total: allArticles.length,
    hasPageBuilder: true,
  }
}

/**
 * Helper function to get articles by category with offset support
 */
async function getArticlesByCategoryWithOffset(
  categorySlug: string,
  limit: number,
  offset: number
): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    where: {
      categories: {
        some: {
          slug: categorySlug,
        },
      },
    },
    include: {
      author: true,
      category: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    skip: offset,
  })

  return articles.map(transformArticle)
}

// Export category colors for use in components
export { categoryColors }
