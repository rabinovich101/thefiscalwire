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
      { label: "Market Overview", href: "/markets", description: "US market summary and indices" },
      { label: "Crypto", href: "/crypto", description: "Cryptocurrency prices and news" },
      { label: "Commodities", href: "/markets/commodities", description: "Gold, oil, and more" },
      { label: "Global Markets", href: "/markets/global", description: "International markets" },
    ],
  },
  {
    label: "Stocks",
    href: "/stocks",
    items: [
      { label: "All Stocks", href: "/stocks", description: "Browse all stocks" },
      { label: "By Sector", href: "/stocks/sectors", description: "Tech, Healthcare, Finance..." },
      { label: "Top 10 Gainers", href: "/stocks/gainers", description: "Today's biggest winners" },
      { label: "Top 10 Losers", href: "/stocks/losers", description: "Today's biggest losers" },
      { label: "Most Active", href: "/stocks/active", description: "Highest trading volume" },
      { label: "Trending", href: "/stocks/trending", description: "Most searched stocks" },
    ],
  },
  {
    label: "News",
    href: "/",
    items: [
      { label: "Latest Headlines", href: "/", description: "Breaking financial news" },
      { label: "Economy", href: "/economy", description: "Economic news and data" },
      { label: "Tech", href: "/tech", description: "Technology sector news" },
      { label: "Earnings", href: "/news/earnings", description: "Earnings reports and analysis" },
      { label: "Opinion", href: "/opinion", description: "Expert analysis and commentary" },
    ],
  },
];

// Simple links that don't have dropdowns (optional)
export const directLinks: NavItem[] = [
  // { label: "Watchlist", href: "/watchlist" },
];
