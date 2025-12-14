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
      { label: "Europe Markets", href: "/markets/europe", description: "European market overview" },
      { label: "Asia Markets", href: "/markets/asia", description: "Asian market overview" },
      { label: "Forex", href: "/markets/forex", description: "Foreign exchange rates" },
      { label: "Crypto", href: "/crypto", description: "Cryptocurrency prices and news" },
      { label: "Bonds", href: "/markets/bonds", description: "Bond yields and prices" },
      { label: "ETF", href: "/markets/etf", description: "Exchange-traded funds" },
    ],
  },
  {
    label: "Business",
    href: "/",
    items: [
      { label: "Economy", href: "/economy", description: "Economic news and data" },
      { label: "Finance", href: "/finance", description: "Financial sector news" },
      { label: "Health & Science", href: "/health-science", description: "Healthcare and science news" },
      { label: "Real Estate", href: "/real-estate", description: "Property and housing market" },
      { label: "Media", href: "/media", description: "Media industry news" },
      { label: "Transportation", href: "/transportation", description: "Transport and logistics" },
      { label: "Industrial", href: "/industrial", description: "Manufacturing and industry" },
      { label: "Sports", href: "/sports", description: "Sports business news" },
      { label: "Tech", href: "/tech", description: "Technology sector news" },
      { label: "Politics", href: "/politics", description: "Political news and policy" },
      { label: "Consumption", href: "/consumption", description: "Consumer spending and retail" },
      { label: "Opinion", href: "/opinion", description: "Opinion and editorial content" },
    ],
  },
  {
    label: "Markets Research",
    href: "/stocks",
    items: [
      { label: "All Stocks", href: "/stocks", description: "Browse all stocks" },
      { label: "Earnings Calendar", href: "/stocks/earnings", description: "Upcoming earnings reports" },
      { label: "Heatmap", href: "/stocks/heatmap", description: "S&P 500 & NASDAQ visualization" },
      { label: "By Sector", href: "/stocks/sectors", description: "Tech, Healthcare, Finance..." },
      { label: "Top 10 Gainers", href: "/stocks/gainers", description: "Today's biggest winners" },
      { label: "Top 10 Losers", href: "/stocks/losers", description: "Today's biggest losers" },
      { label: "Most Active", href: "/stocks/active", description: "Highest trading volume" },
      { label: "Trending", href: "/stocks/trending", description: "Most searched stocks" },
    ],
  },
];

// Simple links that don't have dropdowns (optional)
export const directLinks: NavItem[] = [
  // { label: "Watchlist", href: "/watchlist" },
];
