import prisma from "@/lib/prisma"

export interface AutoFillConfig {
  source: "articles" | "videos"
  filters?: {
    categorySlug?: string
    categoryId?: string
    isFeatured?: boolean
    isBreaking?: boolean
    tags?: string[]
    maxAge?: "24h" | "7d" | "30d"
  }
  sort?: "publishedAt" | "createdAt" | "title"
  order?: "asc" | "desc"
  limit?: number
  skip?: number
}

export interface ResolvedArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  imageUrl: string
  publishedAt: Date
  isFeatured: boolean
  isBreaking: boolean
  category: {
    id: string
    name: string
    slug: string
    color: string
  } | null
  // Dual category system
  marketsCategory: {
    id: string
    name: string
    slug: string
    color: string
  } | null
  businessCategory: {
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

export interface ResolvedVideo {
  id: string
  title: string
  thumbnail: string
  duration: string
  category: string
  createdAt: Date
}

export type ResolvedContent = ResolvedArticle | ResolvedVideo

/**
 * Resolves auto-fill rules to actual content items
 */
export async function resolveAutoFillRules(
  config: AutoFillConfig
): Promise<ResolvedContent[]> {
  if (config.source === "articles") {
    return resolveArticles(config)
  } else if (config.source === "videos") {
    return resolveVideos(config)
  }
  return []
}

async function resolveArticles(config: AutoFillConfig): Promise<ResolvedArticle[]> {
  // Build where clause
  // Use PRIMARY category to match how live pages query articles
  const where: {
    categoryId?: string
    category?: { slug: string }
    isFeatured?: boolean
    isBreaking?: boolean
    tags?: { some: { slug: { in: string[] } } }
    publishedAt?: { gte: Date }
  } = {}

  if (config.filters?.categoryId) {
    where.categoryId = config.filters.categoryId
  }
  if (config.filters?.categorySlug) {
    // Use PRIMARY category relation (same as live pages)
    where.category = { slug: config.filters.categorySlug }
  }
  if (config.filters?.isFeatured !== undefined) {
    where.isFeatured = config.filters.isFeatured
  }
  if (config.filters?.isBreaking !== undefined) {
    where.isBreaking = config.filters.isBreaking
  }
  if (config.filters?.tags && config.filters.tags.length > 0) {
    where.tags = { some: { slug: { in: config.filters.tags } } }
  }
  if (config.filters?.maxAge) {
    const now = new Date()
    let ageMs = 0
    switch (config.filters.maxAge) {
      case "24h":
        ageMs = 24 * 60 * 60 * 1000
        break
      case "7d":
        ageMs = 7 * 24 * 60 * 60 * 1000
        break
      case "30d":
        ageMs = 30 * 24 * 60 * 60 * 1000
        break
    }
    where.publishedAt = { gte: new Date(now.getTime() - ageMs) }
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy: { [config.sort || "publishedAt"]: config.order || "desc" },
    skip: config.skip || 0,
    take: config.limit || 10,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      imageUrl: true,
      publishedAt: true,
      isFeatured: true,
      isBreaking: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
        },
      },
      marketsCategory: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
        },
      },
      businessCategory: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  })

  return articles
}

async function resolveVideos(config: AutoFillConfig): Promise<ResolvedVideo[]> {
  const videos = await prisma.video.findMany({
    orderBy: { [config.sort || "createdAt"]: config.order || "desc" },
    skip: config.skip || 0,
    take: config.limit || 10,
    select: {
      id: true,
      title: true,
      thumbnail: true,
      duration: true,
      category: true,
      createdAt: true,
    },
  })

  return videos
}

/**
 * Gets content for a zone, combining pinned placements with auto-fill rules
 */
export async function getZoneContent(
  zoneId: string,
  maxItems?: number
): Promise<{
  placements: Array<{
    id: string
    position: number
    isPinned: boolean
    contentType: string
    article?: ResolvedArticle
    video?: ResolvedVideo
    customContent?: Record<string, unknown>
  }>
  autoFilled: ResolvedContent[]
}> {
  // Get the zone with its placements and auto-fill rules
  const zone = await prisma.pageZone.findUnique({
    where: { id: zoneId },
    include: {
      placements: {
        orderBy: { position: "asc" },
        include: {
          article: {
            select: {
              id: true,
              title: true,
              slug: true,
              excerpt: true,
              imageUrl: true,
              publishedAt: true,
              isFeatured: true,
              isBreaking: true,
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  color: true,
                },
              },
              marketsCategory: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  color: true,
                },
              },
              businessCategory: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  color: true,
                },
              },
              author: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
          },
          video: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
              duration: true,
              category: true,
              createdAt: true,
            },
          },
        },
      },
      zoneDefinition: true,
    },
  })

  if (!zone) {
    return { placements: [], autoFilled: [] }
  }

  // Filter valid placements (check date ranges)
  const now = new Date()
  const validPlacements = zone.placements.filter((p) => {
    if (p.startDate && p.startDate > now) return false
    if (p.endDate && p.endDate < now) return false
    return true
  })

  // Resolve auto-fill if configured
  let autoFilled: ResolvedContent[] = []
  const autoFillRules = zone.autoFillRules as AutoFillConfig | null

  if (autoFillRules && autoFillRules.source) {
    // Get IDs of already placed content to exclude
    const placedArticleIds = validPlacements
      .filter((p) => p.articleId)
      .map((p) => p.articleId!)
    const placedVideoIds = validPlacements
      .filter((p) => p.videoId)
      .map((p) => p.videoId!)

    // Calculate how many items to auto-fill
    const zoneMax = zone.zoneDefinition?.maxItems || maxItems || 10
    const placedCount = validPlacements.length
    const autoFillLimit = Math.max(0, zoneMax - placedCount)

    if (autoFillLimit > 0) {
      const resolved = await resolveAutoFillRules({
        ...autoFillRules,
        limit: autoFillLimit + placedArticleIds.length + placedVideoIds.length,
      })

      // Filter out already placed content
      autoFilled = resolved.filter((item) => {
        if ("slug" in item) {
          // It's an article
          return !placedArticleIds.includes(item.id)
        } else {
          // It's a video
          return !placedVideoIds.includes(item.id)
        }
      }).slice(0, autoFillLimit)
    }
  }

  return {
    placements: validPlacements.map((p) => ({
      id: p.id,
      position: p.position,
      isPinned: p.isPinned,
      contentType: p.contentType,
      article: p.article || undefined,
      video: p.video || undefined,
      customContent: p.customContent as Record<string, unknown> | undefined,
    })),
    autoFilled,
  }
}

/**
 * Gets all content for a page by resolving all its zones
 */
export async function getPageZonesContent(
  pageSlug: string
): Promise<
  Map<
    string,
    {
      zoneType: string
      content: ResolvedContent[]
      placements: Array<{
        isPinned: boolean
        content: ResolvedContent | Record<string, unknown>
      }>
    }
  >
> {
  const page = await prisma.pageDefinition.findFirst({
    where: { slug: pageSlug, isActive: true },
    include: {
      zones: {
        where: { isEnabled: true },
        orderBy: { sortOrder: "asc" },
        include: {
          zoneDefinition: true,
        },
      },
    },
  })

  if (!page) {
    return new Map()
  }

  const result = new Map<
    string,
    {
      zoneType: string
      content: ResolvedContent[]
      placements: Array<{
        isPinned: boolean
        content: ResolvedContent | Record<string, unknown>
      }>
    }
  >()

  for (const zone of page.zones) {
    const { placements, autoFilled } = await getZoneContent(zone.id)

    // Combine pinned placements and auto-filled content
    const allContent: ResolvedContent[] = []
    const allPlacements: Array<{
      isPinned: boolean
      content: ResolvedContent | Record<string, unknown>
    }> = []

    // Add pinned placements first
    for (const p of placements) {
      if (p.article) {
        allContent.push(p.article)
        allPlacements.push({ isPinned: p.isPinned, content: p.article })
      } else if (p.video) {
        allContent.push(p.video)
        allPlacements.push({ isPinned: p.isPinned, content: p.video })
      } else if (p.customContent) {
        allPlacements.push({ isPinned: p.isPinned, content: p.customContent })
      }
    }

    // Add auto-filled content
    for (const item of autoFilled) {
      allContent.push(item)
      allPlacements.push({ isPinned: false, content: item })
    }

    result.set(zone.zoneDefinition?.slug || zone.id, {
      zoneType: zone.zoneDefinition?.zoneType || "CUSTOM",
      content: allContent,
      placements: allPlacements,
    })
  }

  return result
}
