import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { rateLimitMiddleware } from '@/lib/rate-limit'
import { validateSearchParams, articleQuerySchema, validationErrorResponse } from '@/lib/validations'

// Category colors map
const categoryColors: Record<string, string> = {
  markets: 'bg-blue-600',
  tech: 'bg-purple-600',
  crypto: 'bg-orange-500',
  economy: 'bg-green-600',
  opinion: 'bg-gray-600',
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

// Prisma article type
interface PrismaArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  imageUrl: string
  readTime: number
  isFeatured: boolean
  isBreaking: boolean
  publishedAt: Date
  category?: { slug: string; color: string | null } | null
  author?: { name: string; avatar: string | null } | null
}

// Transform Prisma article to frontend Article
function transformArticle(article: PrismaArticle) {
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

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = rateLimitMiddleware(request, 'public')
  if (rateLimitResponse) return rateLimitResponse

  // Validate input
  const validation = validateSearchParams(request.nextUrl.searchParams, articleQuerySchema)
  if (!validation.success) {
    return validationErrorResponse(validation.error)
  }

  const { category, offset, limit, sector, stock, market, sentiment, businessType } = validation.data

  try {

    // Build where clause with proper Prisma types
    const where: Prisma.ArticleWhereInput = {}
    if (category) {
      // Use many-to-many relation - articles can belong to multiple categories
      where.categories = { some: { slug: category } }
    }

    // Add analysis filters
    if (sector || stock || market || sentiment || businessType) {
      const analysisFilter: Prisma.ArticleAnalysisWhereInput = {}

      if (sector) {
        analysisFilter.primarySector = sector
      }

      if (stock) {
        analysisFilter.mentionedStocks = { has: stock.toUpperCase() }
      }

      if (market) {
        analysisFilter.markets = { has: market }
      }

      if (sentiment) {
        analysisFilter.sentiment = sentiment
      }

      if (businessType) {
        analysisFilter.businessType = businessType
      }

      where.analysis = analysisFilter
    }

    // Get total count for pagination info
    const totalCount = await prisma.article.count({ where })

    // Fetch articles with pagination
    const articles = await prisma.article.findMany({
      where,
      include: {
        author: true,
        category: true,
        analysis: true,
      },
      orderBy: { publishedAt: 'desc' },
      skip: offset,
      take: limit,
    })

    const transformedArticles = articles.map(transformArticle)

    return NextResponse.json({
      articles: transformedArticles,
      pagination: {
        offset,
        limit,
        total: totalCount,
        hasMore: offset + articles.length < totalCount,
      },
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}
