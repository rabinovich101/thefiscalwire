// Types
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: "markets" | "tech" | "crypto" | "economy" | "opinion";
  imageUrl: string;
  author: string;
  publishedAt: string;
  readTime: number;
  isFeatured?: boolean;
  isBreaking?: boolean;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface TrendingItem {
  rank: number;
  title: string;
  category: string;
  url: string;
}

export interface MarketMover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  category: string;
}

// Category colors
export const categoryColors: Record<string, string> = {
  markets: "bg-blue-600",
  tech: "bg-purple-600",
  crypto: "bg-orange-500",
  economy: "bg-green-600",
  opinion: "bg-gray-600",
};

// Mock Market Data
export const marketIndices: MarketIndex[] = [
  { symbol: "SPX", name: "S&P 500", price: 5998.74, change: 22.44, changePercent: 0.38 },
  { symbol: "IXIC", name: "NASDAQ", price: 19060.48, change: -47.11, changePercent: -0.25 },
  { symbol: "DJI", name: "DOW", price: 44910.65, change: 188.59, changePercent: 0.42 },
  { symbol: "RUT", name: "Russell 2000", price: 2434.73, change: 12.88, changePercent: 0.53 },
  { symbol: "BTC", name: "Bitcoin", price: 97245.00, change: 1892.50, changePercent: 1.98 },
  { symbol: "ETH", name: "Ethereum", price: 3642.18, change: -28.44, changePercent: -0.77 },
  { symbol: "GC", name: "Gold", price: 2678.40, change: 8.20, changePercent: 0.31 },
  { symbol: "CL", name: "Crude Oil", price: 68.72, change: -0.94, changePercent: -1.35 },
];

// Mock Breaking News
export const breakingNews = {
  isActive: true,
  headline: "Federal Reserve signals potential rate cut in early 2025 amid cooling inflation",
  url: "/article/fed-rate-cut-2025",
};

// Mock Featured Articles
export const featuredArticle: Article = {
  id: "1",
  title: "Tech Giants Lead Market Rally as AI Investments Surge to Record Highs",
  excerpt: "Major technology companies posted significant gains on Wednesday as investors pile into artificial intelligence stocks, with semiconductor makers leading the charge. The S&P 500 tech sector rose 2.3% in its best session since October.",
  category: "markets",
  imageUrl: "https://picsum.photos/seed/tech-rally/1200/800",
  author: "Sarah Chen",
  publishedAt: "2h ago",
  readTime: 5,
  isFeatured: true,
};

export const secondaryArticles: Article[] = [
  {
    id: "2",
    title: "Bitcoin Surges Past $97K as Institutional Demand Accelerates",
    excerpt: "Cryptocurrency markets continue their impressive rally.",
    category: "crypto",
    imageUrl: "https://picsum.photos/seed/bitcoin/600/400",
    author: "Michael Torres",
    publishedAt: "3h ago",
    readTime: 4,
  },
  {
    id: "3",
    title: "Fed Minutes Reveal Divided Opinion on Rate Path Forward",
    excerpt: "Central bank officials weigh inflation risks against growth concerns.",
    category: "economy",
    imageUrl: "https://picsum.photos/seed/fed-minutes/600/400",
    author: "Jennifer Walsh",
    publishedAt: "4h ago",
    readTime: 6,
  },
  {
    id: "4",
    title: "NVIDIA Reports Record Revenue on AI Chip Demand",
    excerpt: "Chipmaker exceeds Wall Street expectations for Q4.",
    category: "tech",
    imageUrl: "https://picsum.photos/seed/nvidia/600/400",
    author: "David Kim",
    publishedAt: "5h ago",
    readTime: 3,
  },
];

// Mock Top Stories
export const topStories: Article[] = [
  {
    id: "5",
    title: "Oil Prices Drop as OPEC+ Considers Production Increase",
    excerpt: "Crude futures fall 1.5% on reports of potential supply boost from major producers.",
    category: "markets",
    imageUrl: "https://picsum.photos/seed/oil-markets/600/400",
    author: "Robert Hayes",
    publishedAt: "1h ago",
    readTime: 4,
  },
  {
    id: "6",
    title: "Apple Unveils New AI Features for iPhone Coming in 2025",
    excerpt: "Tech giant announces major software update with enhanced machine learning capabilities.",
    category: "tech",
    imageUrl: "https://picsum.photos/seed/apple-ai/600/400",
    author: "Lisa Park",
    publishedAt: "2h ago",
    readTime: 5,
  },
  {
    id: "7",
    title: "Ethereum Foundation Announces Major Protocol Upgrade",
    excerpt: "Next-generation improvements aim to enhance scalability and reduce transaction costs.",
    category: "crypto",
    imageUrl: "https://picsum.photos/seed/ethereum/600/400",
    author: "Alex Rivera",
    publishedAt: "3h ago",
    readTime: 6,
  },
  {
    id: "8",
    title: "Housing Market Shows Signs of Recovery in Major Cities",
    excerpt: "Home sales rise for third consecutive month as mortgage rates stabilize.",
    category: "economy",
    imageUrl: "https://picsum.photos/seed/housing/600/400",
    author: "Maria Santos",
    publishedAt: "4h ago",
    readTime: 4,
  },
  {
    id: "9",
    title: "Why the Stock Market Could Surprise Everyone in 2025",
    excerpt: "Contrarian view suggests overlooked factors may drive unexpected gains.",
    category: "opinion",
    imageUrl: "https://picsum.photos/seed/opinion/600/400",
    author: "James Mitchell",
    publishedAt: "5h ago",
    readTime: 7,
  },
  {
    id: "10",
    title: "Tesla Stock Jumps After Cybertruck Delivery Numbers Revealed",
    excerpt: "Electric vehicle maker beats expectations with strong Q4 delivery figures.",
    category: "markets",
    imageUrl: "https://picsum.photos/seed/tesla/600/400",
    author: "Emma Thompson",
    publishedAt: "6h ago",
    readTime: 3,
  },
];

// Mock Trending Stories
export const trendingStories: TrendingItem[] = [
  { rank: 1, title: "Fed Signals Rate Cut Path for 2025", category: "economy", url: "#" },
  { rank: 2, title: "NVIDIA Stock Hits All-Time High", category: "tech", url: "#" },
  { rank: 3, title: "Bitcoin Eyes $100K Milestone", category: "crypto", url: "#" },
  { rank: 4, title: "Oil Prices Under Pressure", category: "markets", url: "#" },
  { rank: 5, title: "Apple AI Plans Leaked", category: "tech", url: "#" },
  { rank: 6, title: "Housing Recovery Gains Steam", category: "economy", url: "#" },
  { rank: 7, title: "Tesla Delivery Beat", category: "markets", url: "#" },
  { rank: 8, title: "Crypto Regulation Update", category: "crypto", url: "#" },
];

// Mock Market Movers
export const topGainers: MarketMover[] = [
  { symbol: "NVDA", name: "NVIDIA", price: 142.62, change: 8.44, changePercent: 6.29 },
  { symbol: "AMD", name: "AMD", price: 138.91, change: 5.22, changePercent: 3.91 },
  { symbol: "TSLA", name: "Tesla", price: 352.56, change: 11.88, changePercent: 3.48 },
  { symbol: "COIN", name: "Coinbase", price: 312.45, change: 9.67, changePercent: 3.19 },
  { symbol: "MSTR", name: "MicroStrategy", price: 402.33, change: 10.55, changePercent: 2.69 },
];

export const topLosers: MarketMover[] = [
  { symbol: "XOM", name: "Exxon Mobil", price: 108.22, change: -3.88, changePercent: -3.46 },
  { symbol: "CVX", name: "Chevron", price: 148.90, change: -4.21, changePercent: -2.75 },
  { symbol: "BA", name: "Boeing", price: 178.44, change: -4.11, changePercent: -2.25 },
  { symbol: "PFE", name: "Pfizer", price: 26.18, change: -0.52, changePercent: -1.95 },
  { symbol: "DIS", name: "Disney", price: 112.33, change: -1.89, changePercent: -1.66 },
];

// Mock Videos
export const latestVideos: Video[] = [
  {
    id: "v1",
    title: "Market Close: Tech Leads Rally as Fed Minutes Released",
    thumbnail: "https://picsum.photos/seed/market-close/400/225",
    duration: "8:42",
    category: "markets",
  },
  {
    id: "v2",
    title: "Bitcoin Analysis: Technical Levels to Watch",
    thumbnail: "https://picsum.photos/seed/btc-analysis/400/225",
    duration: "12:15",
    category: "crypto",
  },
  {
    id: "v3",
    title: "NVIDIA Earnings Preview: What Investors Need to Know",
    thumbnail: "https://picsum.photos/seed/nvda-earnings/400/225",
    duration: "6:33",
    category: "tech",
  },
  {
    id: "v4",
    title: "Economic Outlook 2025: Expert Panel Discussion",
    thumbnail: "https://picsum.photos/seed/econ-outlook/400/225",
    duration: "24:18",
    category: "economy",
  },
];

// Navigation Categories
export const categories = [
  { name: "Markets", slug: "markets", icon: "TrendingUp" },
  { name: "Tech", slug: "tech", icon: "Cpu" },
  { name: "Crypto", slug: "crypto", icon: "Bitcoin" },
  { name: "Economy", slug: "economy", icon: "Building2" },
  { name: "Personal Finance", slug: "personal-finance", icon: "Wallet" },
  { name: "Opinion", slug: "opinion", icon: "MessageSquare" },
];

// Navigation Links
export const navLinks = [
  { name: "Markets", href: "/markets" },
  { name: "Economy", href: "/economy" },
  { name: "Tech", href: "/tech" },
  { name: "Crypto", href: "/crypto" },
  { name: "Opinion", href: "/opinion" },
];
