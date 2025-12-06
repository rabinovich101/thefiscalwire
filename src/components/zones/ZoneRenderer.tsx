import { ZoneProps, ZoneType } from "./types"
import { HeroFeaturedZone } from "./HeroFeaturedZone"
import { ArticleGridZone } from "./ArticleGridZone"
import { ArticleListZone } from "./ArticleListZone"
import { TrendingSidebarZone } from "./TrendingSidebarZone"
import { BreakingBannerZone } from "./BreakingBannerZone"
import { VideoCarouselZone } from "./VideoCarouselZone"

interface ZoneRendererProps extends ZoneProps {
  fallback?: React.ReactNode
}

const zoneComponents: Partial<Record<ZoneType, React.ComponentType<ZoneProps>>> = {
  HERO_FEATURED: HeroFeaturedZone,
  ARTICLE_GRID: ArticleGridZone,
  ARTICLE_LIST: ArticleListZone,
  TRENDING_SIDEBAR: TrendingSidebarZone,
  BREAKING_BANNER: BreakingBannerZone,
  VIDEO_CAROUSEL: VideoCarouselZone,
}

export function ZoneRenderer({
  zoneType,
  content,
  placements,
  className,
  fallback,
}: ZoneRendererProps) {
  const Component = zoneComponents[zoneType as ZoneType]

  if (!Component) {
    if (fallback) {
      return <>{fallback}</>
    }
    // Return null for unsupported zone types without fallback
    console.warn(`Unknown zone type: ${zoneType}`)
    return null
  }

  // If no content and no placements, don't render anything
  if ((!content || content.length === 0) && (!placements || placements.length === 0)) {
    if (fallback) {
      return <>{fallback}</>
    }
    return null
  }

  return (
    <Component
      zoneType={zoneType}
      content={content}
      placements={placements}
      className={className}
    />
  )
}
