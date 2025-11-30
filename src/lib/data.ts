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
  markets: 'bg-blue-600',
  tech: 'bg-purple-600',
  crypto: 'bg-orange-500',
  economy: 'bg-green-600',
  opinion: 'bg-gray-600',
}

// Transform Prisma article to frontend Article
function transformArticle(article: any): Article {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category?.slug || 'markets',
    categoryColor: article.category?.color || categoryColors[article.category?.slug] || 'bg-gray-600',
    imageUrl: article.imageUrl,
    author: article.author?.name || 'Unknown',
    authorAvatar: article.author?.avatar,
    publishedAt: formatRelativeTime(article.publishedAt),
    readTime: article.readTime,
    isFeatured: article.isFeatured,
    isBreaking: article.isBreaking,
  }
}

// Transform Prisma article to frontend ArticleDetail
function transformArticleDetail(article: any): ArticleDetail {
  return {
    ...transformArticle(article),
    content: article.content as ArticleContentBlock[],
    tags: article.tags?.map((t: any) => t.name) || [],
    relevantTickers: article.relevantTickers || [],
    headings: (article.headings as ArticleHeading[]) || [],
  }
}

// =========================
// Data Fetching Functions
// =========================

export async function getFeaturedArticle(): Promise<Article | null> {
  const article = await prisma.article.findFirst({
    where: { isFeatured: true },
    include: {
      author: true,
      category: true,
    },
    orderBy: { publishedAt: 'desc' },
  })

  return article ? transformArticle(article) : null
}

export async function getSecondaryArticles(limit = 3): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    where: { isFeatured: false },
    include: {
      author: true,
      category: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })

  return articles.map(transformArticle)
}

export async function getTopStories(limit = 6): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    where: { isFeatured: false },
    include: {
      author: true,
      category: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    skip: 3, // Skip the secondary articles
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

// Export category colors for use in components
export { categoryColors }
