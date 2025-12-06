// Navigation Configuration
// Add or remove menu items here to update the site navigation

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavCategory {
  label: string;
  href?: string; // Optional: if set, the category label itself is clickable
  items: NavItem[];
}

export type NavConfig = NavCategory[];

export const navigationConfig: NavConfig = [
  {
    label: "Markets",
    href: "/markets",
    items: [
      { label: "US Markets", href: "/markets", description: "US market summary and indices" },
      { label: "Crypto", href: "/crypto", description: "Cryptocurrency prices and news" },
    ],
  },
  {
    label: "Markets Research",
    href: "/stocks",
    items: [
      { label: "All Stocks", href: "/stocks", description: "Browse all stocks" },
      { label: "Heatmap", href: "/stocks/heatmap", description: "S&P 500 & NASDAQ visualization" },
      { label: "By Sector", href: "/stocks/sectors", description: "Tech, Healthcare, Finance..." },
      { label: "Trending", href: "/stocks/trending", description: "Most searched stocks" },
    ],
  },
  {
    label: "Business",
    href: "/",
    items: [
      { label: "Economy", href: "/economy", description: "Economic news and data" },
      { label: "Finance", href: "/category/finance", description: "Financial sector news" },
      { label: "Health & Science", href: "/category/health-science", description: "Healthcare and science news" },
      { label: "Real Estate", href: "/category/real-estate", description: "Property and housing market" },
      { label: "Media", href: "/category/media", description: "Media industry news" },
      { label: "Transportation", href: "/category/transportation", description: "Transport and logistics" },
      { label: "Industrial", href: "/category/industrial", description: "Manufacturing and industry" },
      { label: "Sports", href: "/category/sports", description: "Sports business news" },
      { label: "Tech", href: "/tech", description: "Technology sector news" },
      { label: "Politics", href: "/category/politics", description: "Political news and policy" },
      { label: "Consumption", href: "/category/consumption", description: "Consumer spending and retail" },
      { label: "Opinion", href: "/opinion", description: "Opinion and editorial content" },
    ],
  },
];

// Simple links that don't have dropdowns (optional)
export const directLinks: NavItem[] = [
  // { label: "Watchlist", href: "/watchlist" },
];
