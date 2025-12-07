// Force dynamic rendering - no static generation at build time
export const dynamic = "force-dynamic";

import Link from "next/link"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { Eye, RefreshCw, TrendingUp, TrendingDown, Minus, Building2, DollarSign, BarChart3 } from "lucide-react"
import { VALID_SECTORS, VALID_SENTIMENTS, VALID_BUSINESS_TYPES } from "@/lib/article-analyzer"

// Sector display names
const SECTOR_NAMES: Record<string, string> = {
  'technology': 'Technology',
  'healthcare': 'Healthcare',
  'financial': 'Financial',
  'consumer-discretionary': 'Consumer Discretionary',
  'consumer-staples': 'Consumer Staples',
  'industrial': 'Industrial',
  'energy': 'Energy',
  'utilities': 'Utilities',
  'real-estate': 'Real Estate',
  'materials': 'Materials',
  'communication-services': 'Communication Services',
}

// Sector colors
const SECTOR_COLORS: Record<string, string> = {
  'technology': 'bg-blue-600',
  'healthcare': 'bg-emerald-600',
  'financial': 'bg-amber-600',
  'consumer-discretionary': 'bg-pink-600',
  'consumer-staples': 'bg-orange-600',
  'industrial': 'bg-slate-600',
  'energy': 'bg-red-600',
  'utilities': 'bg-yellow-600',
  'real-estate': 'bg-violet-600',
  'materials': 'bg-stone-600',
  'communication-services': 'bg-indigo-600',
}

// Sentiment icons and colors
const SENTIMENT_CONFIG: Record<string, { icon: typeof TrendingUp; color: string; bgColor: string }> = {
  'bullish': { icon: TrendingUp, color: 'text-green-500', bgColor: 'bg-green-600/20' },
  'bearish': { icon: TrendingDown, color: 'text-red-500', bgColor: 'bg-red-600/20' },
  'neutral': { icon: Minus, color: 'text-zinc-400', bgColor: 'bg-zinc-600/20' },
}

export default async function AnalysisPage({
  searchParams,
}: {
  searchParams: { sector?: string; stock?: string; sentiment?: string; businessType?: string; page?: string }
}) {
  const page = parseInt(searchParams.page || '1')
  const limit = 20
  const offset = (page - 1) * limit

  // Build where clause for filters with proper Prisma types
  const where: Prisma.ArticleAnalysisWhereInput = {}

  if (searchParams.sector) {
    where.primarySector = searchParams.sector
  }
  if (searchParams.stock) {
    where.mentionedStocks = { has: searchParams.stock.toUpperCase() }
  }
  if (searchParams.sentiment) {
    where.sentiment = searchParams.sentiment
  }
  if (searchParams.businessType) {
    where.businessType = searchParams.businessType
  }

  // Get analyses with articles
  const [analyses, totalCount, sectorStats, sentimentStats] = await Promise.all([
    prisma.articleAnalysis.findMany({
      where,
      include: {
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
            publishedAt: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.articleAnalysis.count({ where }),
    // Sector distribution
    prisma.articleAnalysis.groupBy({
      by: ['primarySector'],
      _count: true,
      where: { primarySector: { not: null } },
    }),
    // Sentiment distribution
    prisma.articleAnalysis.groupBy({
      by: ['sentiment'],
      _count: true,
      where: { sentiment: { not: null } },
    }),
  ])

  const totalPages = Math.ceil(totalCount / limit)

  // Build filter URL helper
  const buildFilterUrl = (key: string, value: string) => {
    const params = new URLSearchParams()
    if (searchParams.sector && key !== 'sector') params.set('sector', searchParams.sector)
    if (searchParams.stock && key !== 'stock') params.set('stock', searchParams.stock)
    if (searchParams.sentiment && key !== 'sentiment') params.set('sentiment', searchParams.sentiment)
    if (searchParams.businessType && key !== 'businessType') params.set('businessType', searchParams.businessType)
    if (value) params.set(key, value)
    return `/admin/analysis${params.toString() ? '?' + params.toString() : ''}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">AI Article Analysis</h1>
        <div className="text-sm text-zinc-400">
          {totalCount} analyzed articles
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sector Distribution */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-5 h-5 text-zinc-400" />
            <h3 className="text-sm font-medium text-zinc-400">Top Sectors</h3>
          </div>
          <div className="space-y-2">
            {sectorStats
              .sort((a, b) => b._count - a._count)
              .slice(0, 5)
              .map((stat) => (
                <Link
                  key={stat.primarySector}
                  href={buildFilterUrl('sector', stat.primarySector || '')}
                  className="flex items-center justify-between hover:bg-zinc-800 p-1 rounded"
                >
                  <span className={`text-xs px-2 py-1 rounded ${SECTOR_COLORS[stat.primarySector || ''] || 'bg-zinc-600'} text-white`}>
                    {SECTOR_NAMES[stat.primarySector || ''] || stat.primarySector}
                  </span>
                  <span className="text-sm text-zinc-400">{stat._count}</span>
                </Link>
              ))}
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-zinc-400" />
            <h3 className="text-sm font-medium text-zinc-400">Sentiment</h3>
          </div>
          <div className="space-y-2">
            {sentimentStats.map((stat) => {
              const config = SENTIMENT_CONFIG[stat.sentiment || 'neutral']
              const Icon = config?.icon || Minus
              return (
                <Link
                  key={stat.sentiment}
                  href={buildFilterUrl('sentiment', stat.sentiment || '')}
                  className="flex items-center justify-between hover:bg-zinc-800 p-1 rounded"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${config?.color || 'text-zinc-400'}`} />
                    <span className="text-sm text-zinc-300 capitalize">{stat.sentiment}</span>
                  </div>
                  <span className="text-sm text-zinc-400">{stat._count}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-zinc-400" />
            <h3 className="text-sm font-medium text-zinc-400">Quick Filters</h3>
          </div>
          <div className="space-y-2">
            <Link
              href="/admin/analysis"
              className="block text-sm text-blue-400 hover:text-blue-300"
            >
              Clear all filters
            </Link>
            {searchParams.sector && (
              <div className="text-xs text-zinc-400">
                Sector: <span className="text-white">{SECTOR_NAMES[searchParams.sector] || searchParams.sector}</span>
              </div>
            )}
            {searchParams.stock && (
              <div className="text-xs text-zinc-400">
                Stock: <span className="text-white">{searchParams.stock}</span>
              </div>
            )}
            {searchParams.sentiment && (
              <div className="text-xs text-zinc-400">
                Sentiment: <span className="text-white capitalize">{searchParams.sentiment}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-800">
            <tr>
              <th className="text-left text-sm font-medium text-zinc-400 px-4 py-3">Article</th>
              <th className="text-left text-sm font-medium text-zinc-400 px-4 py-3">Sector</th>
              <th className="text-left text-sm font-medium text-zinc-400 px-4 py-3">Stocks</th>
              <th className="text-left text-sm font-medium text-zinc-400 px-4 py-3">Sentiment</th>
              <th className="text-left text-sm font-medium text-zinc-400 px-4 py-3">Business Type</th>
              <th className="text-left text-sm font-medium text-zinc-400 px-4 py-3">Confidence</th>
              <th className="text-right text-sm font-medium text-zinc-400 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {analyses.map((analysis) => {
              const sentimentConfig = SENTIMENT_CONFIG[analysis.sentiment || 'neutral']
              const SentimentIcon = sentimentConfig?.icon || Minus

              return (
                <tr key={analysis.id} className="hover:bg-zinc-800/50">
                  <td className="px-4 py-3">
                    <div className="max-w-xs">
                      <Link
                        href={`/article/${analysis.article.slug}`}
                        target="_blank"
                        className="text-white font-medium hover:text-blue-400 line-clamp-2"
                      >
                        {analysis.article.title}
                      </Link>
                      <div className="text-xs text-zinc-500 mt-1">
                        {new Date(analysis.article.publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {analysis.primarySector ? (
                      <Link href={buildFilterUrl('sector', analysis.primarySector)}>
                        <span className={`text-xs px-2 py-1 rounded ${SECTOR_COLORS[analysis.primarySector] || 'bg-zinc-600'} text-white`}>
                          {SECTOR_NAMES[analysis.primarySector] || analysis.primarySector}
                        </span>
                      </Link>
                    ) : (
                      <span className="text-xs text-zinc-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {analysis.mentionedStocks.slice(0, 3).map((stock) => (
                        <Link
                          key={stock}
                          href={buildFilterUrl('stock', stock)}
                          className="text-xs px-2 py-0.5 bg-zinc-700 text-white rounded hover:bg-zinc-600"
                        >
                          {stock}
                        </Link>
                      ))}
                      {analysis.mentionedStocks.length > 3 && (
                        <span className="text-xs text-zinc-500">+{analysis.mentionedStocks.length - 3}</span>
                      )}
                      {analysis.mentionedStocks.length === 0 && (
                        <span className="text-xs text-zinc-500">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {analysis.sentiment ? (
                      <Link
                        href={buildFilterUrl('sentiment', analysis.sentiment)}
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${sentimentConfig?.bgColor}`}
                      >
                        <SentimentIcon className={`w-3 h-3 ${sentimentConfig?.color}`} />
                        <span className={sentimentConfig?.color}>{analysis.sentiment}</span>
                      </Link>
                    ) : (
                      <span className="text-xs text-zinc-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {analysis.businessType ? (
                      <Link
                        href={buildFilterUrl('businessType', analysis.businessType)}
                        className="text-xs text-zinc-300 hover:text-white capitalize"
                      >
                        {analysis.businessType.replace('_', ' ')}
                      </Link>
                    ) : (
                      <span className="text-xs text-zinc-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {analysis.confidence !== null ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-zinc-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${analysis.confidence > 0.7 ? 'bg-green-500' : analysis.confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${analysis.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-400">{Math.round(analysis.confidence * 100)}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/article/${analysis.article.slug}`}
                        target="_blank"
                        className="p-2 text-zinc-400 hover:text-white transition-colors"
                        title="View Article"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/analysis/${analysis.id}`}
                        className="p-2 text-zinc-400 hover:text-blue-400 transition-colors"
                        title="View Analysis Details"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {analyses.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            No analyzed articles found. Import articles to see analysis data.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/admin/analysis?page=${page - 1}${searchParams.sector ? `&sector=${searchParams.sector}` : ''}${searchParams.stock ? `&stock=${searchParams.stock}` : ''}${searchParams.sentiment ? `&sentiment=${searchParams.sentiment}` : ''}`}
              className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700"
            >
              Previous
            </Link>
          )}
          <span className="text-zinc-400">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/admin/analysis?page=${page + 1}${searchParams.sector ? `&sector=${searchParams.sector}` : ''}${searchParams.stock ? `&stock=${searchParams.stock}` : ''}${searchParams.sentiment ? `&sentiment=${searchParams.sentiment}` : ''}`}
              className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
