'use client'

import { useState } from 'react'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import type { Article } from '@/lib/data'

interface LoadMoreArticlesProps {
  initialArticles: Article[]
  category?: string
  initialTotal: number
  pageSize?: number
}

export function LoadMoreArticles({
  initialArticles,
  category,
  initialTotal,
  pageSize = 8,
}: LoadMoreArticlesProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialArticles.length < initialTotal)

  const loadMore = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        offset: articles.length.toString(),
        limit: pageSize.toString(),
      })
      if (category) {
        params.set('category', category)
      }

      const response = await fetch(`/api/articles?${params.toString()}`)
      const data = await response.json()

      if (data.articles) {
        setArticles((prev) => [...prev, ...data.articles])
        setHasMore(data.pagination.hasMore)
      }
    } catch (error) {
      console.error('Error loading more articles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No articles found.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={loadMore}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
