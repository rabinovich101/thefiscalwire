import { PageType } from "@prisma/client"

export interface PageRegistryEntry {
  slug: string           // PageDefinition slug (unique identifier)
  route: string          // Actual URL path
  name: string           // Display name
  pageType: PageType
  categorySlug?: string  // For CATEGORY pages - links to Category model
  description?: string   // For admin preview
}

// Centralized registry of all known pages in the application
export const PAGE_REGISTRY: PageRegistryEntry[] = [
  // ============ HOMEPAGE ============
  {
    slug: "homepage",
    route: "/",
    name: "Homepage",
    pageType: "HOMEPAGE",
    description: "Main landing page"
  },

  // ============ CATEGORY PAGES ============
  // These map to static routes that show category content
  {
    slug: "crypto",
    route: "/crypto",
    name: "Crypto",
    pageType: "CATEGORY",
    categorySlug: "crypto",
    description: "Cryptocurrency news and analysis"
  },
  {
    slug: "economy",
    route: "/economy",
    name: "Economy",
    pageType: "CATEGORY",
    categorySlug: "economy",
    description: "Economic news and indicators"
  },
  {
    slug: "finance",
    route: "/finance",
    name: "Finance",
    pageType: "CATEGORY",
    categorySlug: "finance",
    description: "Personal and corporate finance"
  },
  {
    slug: "tech",
    route: "/tech",
    name: "Tech",
    pageType: "CATEGORY",
    categorySlug: "tech",
    description: "Technology sector news"
  },
  {
    slug: "politics",
    route: "/politics",
    name: "Politics",
    pageType: "CATEGORY",
    categorySlug: "politics",
    description: "Political news and policy"
  },
  {
    slug: "health-science",
    route: "/health-science",
    name: "Health & Science",
    pageType: "CATEGORY",
    categorySlug: "healthcare",
    description: "Healthcare and scientific news"
  },
  {
    slug: "real-estate",
    route: "/real-estate",
    name: "Real Estate",
    pageType: "CATEGORY",
    categorySlug: "real-estate",
    description: "Real estate market news"
  },
  {
    slug: "transportation",
    route: "/transportation",
    name: "Transportation",
    pageType: "CATEGORY",
    categorySlug: "transportation",
    description: "Transportation sector news"
  },
  {
    slug: "industrial",
    route: "/industrial",
    name: "Industrial",
    pageType: "CATEGORY",
    categorySlug: "industrial",
    description: "Industrial sector news"
  },
  {
    slug: "sports",
    route: "/sports",
    name: "Sports",
    pageType: "CATEGORY",
    categorySlug: "sports",
    description: "Sports business news"
  },
  {
    slug: "consumption",
    route: "/consumption",
    name: "Consumption",
    pageType: "CATEGORY",
    categorySlug: "consumer",
    description: "Consumer trends and retail"
  },
  {
    slug: "opinion",
    route: "/opinion",
    name: "Opinion",
    pageType: "CATEGORY",
    categorySlug: "opinion",
    description: "Opinion and analysis pieces"
  },

  // ============ MARKETS PAGES ============
  {
    slug: "markets",
    route: "/markets",
    name: "Markets",
    pageType: "MARKETS",
    description: "US Markets overview"
  },
  {
    slug: "markets-bonds",
    route: "/markets/bonds",
    name: "Bonds",
    pageType: "MARKETS",
    description: "Bond markets and yields"
  },
  {
    slug: "markets-forex",
    route: "/markets/forex",
    name: "Forex",
    pageType: "MARKETS",
    description: "Foreign exchange markets"
  },
  {
    slug: "markets-etf",
    route: "/markets/etf",
    name: "ETF",
    pageType: "MARKETS",
    description: "Exchange-traded funds"
  },
  {
    slug: "markets-asia",
    route: "/markets/asia",
    name: "Asia Markets",
    pageType: "MARKETS",
    description: "Asian markets overview"
  },
  {
    slug: "markets-europe",
    route: "/markets/europe",
    name: "Europe Markets",
    pageType: "MARKETS",
    description: "European markets overview"
  },

  // ============ STOCKS PAGES ============
  {
    slug: "stocks",
    route: "/stocks",
    name: "Stocks",
    pageType: "STOCK",
    description: "Stocks overview and search"
  },
  {
    slug: "stocks-gainers",
    route: "/stocks/gainers",
    name: "Top Gainers",
    pageType: "STOCK",
    description: "Today's top gaining stocks"
  },
  {
    slug: "stocks-losers",
    route: "/stocks/losers",
    name: "Top Losers",
    pageType: "STOCK",
    description: "Today's top losing stocks"
  },
  {
    slug: "stocks-trending",
    route: "/stocks/trending",
    name: "Trending Stocks",
    pageType: "STOCK",
    description: "Most searched stocks"
  },
  {
    slug: "stocks-active",
    route: "/stocks/active",
    name: "Most Active",
    pageType: "STOCK",
    description: "Highest volume stocks"
  },
  {
    slug: "stocks-heatmap",
    route: "/stocks/heatmap",
    name: "Market Heatmap",
    pageType: "STOCK",
    description: "Visual market heatmap"
  },
  {
    slug: "stocks-sectors",
    route: "/stocks/sectors",
    name: "Sectors",
    pageType: "STOCK",
    description: "Sector performance overview"
  },

  // ============ STATIC PAGES ============
  {
    slug: "about",
    route: "/about",
    name: "About",
    pageType: "STATIC",
    description: "About The Fiscal Wire"
  },
  {
    slug: "contact",
    route: "/contact",
    name: "Contact",
    pageType: "STATIC",
    description: "Contact information"
  },
  {
    slug: "privacy",
    route: "/privacy",
    name: "Privacy Policy",
    pageType: "STATIC",
    description: "Privacy policy"
  },
  {
    slug: "terms",
    route: "/terms",
    name: "Terms of Service",
    pageType: "STATIC",
    description: "Terms of service"
  },
]

// Helper functions
export function findPageByRoute(route: string): PageRegistryEntry | undefined {
  return PAGE_REGISTRY.find(p => p.route === route)
}

export function findPageBySlug(slug: string): PageRegistryEntry | undefined {
  return PAGE_REGISTRY.find(p => p.slug === slug)
}

export function getPagesByType(pageType: PageType): PageRegistryEntry[] {
  return PAGE_REGISTRY.filter(p => p.pageType === pageType)
}

// Get all page slugs for quick lookup
export function getAllPageSlugs(): string[] {
  return PAGE_REGISTRY.map(p => p.slug)
}
