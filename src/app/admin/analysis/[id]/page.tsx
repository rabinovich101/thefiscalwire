// Force dynamic rendering
export const dynamic = "force-dynamic";

import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, Minus, Building2, Globe, Tag, Users } from "lucide-react"

// Sector display names and colors
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

const SENTIMENT_CONFIG: Record<string, { icon: typeof TrendingUp; color: string; bgColor: string }> = {
  'bullish': { icon: TrendingUp, color: 'text-green-500', bgColor: 'bg-green-600/20' },
  'bearish': { icon: TrendingDown, color: 'text-red-500', bgColor: 'bg-red-600/20' },
  'neutral': { icon: Minus, color: 'text-zinc-400', bgColor: 'bg-zinc-600/20' },
}

export default async function AnalysisDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const analysis = await prisma.articleAnalysis.findUnique({
    where: { id: params.id },
    include: {
      article: {
        include: {
          author: true,
          category: true,
          marketsCategory: true,
          businessCategory: true,
        },
      },
    },
  })

  if (!analysis) {
    notFound()
  }

  const sentimentConfig = SENTIMENT_CONFIG[analysis.sentiment || 'neutral']
  const SentimentIcon = sentimentConfig?.icon || Minus
  const competitors = analysis.competitors as Record<string, string[]> | null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/analysis"
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Analysis Details</h1>
          <p className="text-zinc-400 text-sm mt-1 line-clamp-1">{analysis.article.title}</p>
        </div>
        <Link
          href={`/article/${analysis.article.slug}`}
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Article
        </Link>
      </div>

      {/* Article Info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Article Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Author</div>
            <div className="text-white">{analysis.article.author.name}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Categories</div>
            <div className="flex flex-wrap gap-1">
              {analysis.article.marketsCategory && (
                <span className={`text-xs px-2 py-1 rounded ${analysis.article.marketsCategory.color} text-white`}>
                  {analysis.article.marketsCategory.name}
                </span>
              )}
              {analysis.article.businessCategory && (
                <span className={`text-xs px-2 py-1 rounded ${analysis.article.businessCategory.color} text-white`}>
                  {analysis.article.businessCategory.name}
                </span>
              )}
            </div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Published</div>
            <div className="text-white">{new Date(analysis.article.publishedAt).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Analyzed</div>
            <div className="text-white">{new Date(analysis.createdAt).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Markets */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-zinc-400" />
            <h2 className="text-lg font-semibold text-white">Markets</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.markets.length > 0 ? (
              analysis.markets.map((market) => (
                <span key={market} className="px-3 py-1 bg-zinc-700 text-white rounded-full text-sm">
                  {market}
                </span>
              ))
            ) : (
              <span className="text-zinc-500">No markets identified</span>
            )}
          </div>
        </div>

        {/* Sectors */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-zinc-400" />
            <h2 className="text-lg font-semibold text-white">Sectors</h2>
          </div>
          <div className="space-y-3">
            {analysis.primarySector && (
              <div>
                <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Primary</div>
                <span className={`text-sm px-3 py-1 rounded ${SECTOR_COLORS[analysis.primarySector] || 'bg-zinc-600'} text-white`}>
                  {SECTOR_NAMES[analysis.primarySector] || analysis.primarySector}
                </span>
              </div>
            )}
            {analysis.secondarySectors.length > 0 && (
              <div>
                <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Secondary</div>
                <div className="flex flex-wrap gap-2">
                  {analysis.secondarySectors.map((sector) => (
                    <span key={sector} className={`text-xs px-2 py-1 rounded ${SECTOR_COLORS[sector] || 'bg-zinc-600'} text-white`}>
                      {SECTOR_NAMES[sector] || sector}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {!analysis.primarySector && analysis.secondarySectors.length === 0 && (
              <span className="text-zinc-500">No sectors identified</span>
            )}
          </div>
        </div>

        {/* Sub-sectors & Industries */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-zinc-400" />
            <h2 className="text-lg font-semibold text-white">Sub-sectors & Industries</h2>
          </div>
          <div className="space-y-3">
            {analysis.subSectors.length > 0 && (
              <div>
                <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Sub-sectors</div>
                <div className="flex flex-wrap gap-2">
                  {analysis.subSectors.map((sub) => (
                    <span key={sub} className="px-2 py-1 bg-zinc-700 text-zinc-200 rounded text-sm">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {analysis.industries.length > 0 && (
              <div>
                <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Industries</div>
                <div className="flex flex-wrap gap-2">
                  {analysis.industries.map((ind) => (
                    <span key={ind} className="px-2 py-1 bg-zinc-700 text-zinc-200 rounded text-sm">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {analysis.subSectors.length === 0 && analysis.industries.length === 0 && (
              <span className="text-zinc-500">None identified</span>
            )}
          </div>
        </div>

        {/* Business Context */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-zinc-400" />
            <h2 className="text-lg font-semibold text-white">Business Context</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Type</div>
              <div className="text-white capitalize">{analysis.businessType?.replace('_', ' ') || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Sentiment</div>
              {analysis.sentiment ? (
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded ${sentimentConfig?.bgColor}`}>
                  <SentimentIcon className={`w-4 h-4 ${sentimentConfig?.color}`} />
                  <span className={`capitalize ${sentimentConfig?.color}`}>{analysis.sentiment}</span>
                </div>
              ) : (
                <div className="text-zinc-500">-</div>
              )}
            </div>
            <div>
              <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Impact</div>
              <div className={`capitalize ${
                analysis.impactLevel === 'high' ? 'text-red-400' :
                analysis.impactLevel === 'medium' ? 'text-yellow-400' :
                'text-zinc-400'
              }`}>
                {analysis.impactLevel || '-'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stocks Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-zinc-400" />
          <h2 className="text-lg font-semibold text-white">Stocks & Competitors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mentioned Stocks */}
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Mentioned Stocks</div>
            {analysis.mentionedStocks.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analysis.mentionedStocks.map((stock) => (
                  <span
                    key={stock}
                    className={`px-3 py-1 rounded text-sm ${
                      stock === analysis.primaryStock
                        ? 'bg-blue-600 text-white font-medium'
                        : 'bg-zinc-700 text-white'
                    }`}
                  >
                    {stock}
                    {stock === analysis.primaryStock && ' (Primary)'}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-zinc-500">No stocks mentioned</span>
            )}
          </div>

          {/* Competitors */}
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Competitors</div>
            {competitors && Object.keys(competitors).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(competitors).map(([stock, comps]) => (
                  <div key={stock} className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-400">{stock}:</span>
                    <div className="flex flex-wrap gap-1">
                      {comps.map((comp) => (
                        <span key={comp} className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-xs">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-zinc-500">No competitors identified</span>
            )}
          </div>
        </div>
      </div>

      {/* Confidence & AI Info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">AI Analysis Metadata</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">AI Model</div>
            <div className="text-white">{analysis.aiModel}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Confidence Score</div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    (analysis.confidence || 0) > 0.7 ? 'bg-green-500' :
                    (analysis.confidence || 0) > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(analysis.confidence || 0) * 100}%` }}
                />
              </div>
              <span className="text-white">{Math.round((analysis.confidence || 0) * 100)}%</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Analysis ID</div>
            <div className="text-white font-mono text-sm">{analysis.id.slice(0, 8)}...</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Last Updated</div>
            <div className="text-white">{new Date(analysis.updatedAt).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
