// Types
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string; // Dynamic category slug
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

// Article Detail Types for full article view
export interface ChartDataPoint {
  time: string;
  value: number;
  volume?: number;
}

export interface ArticleHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface ArticleContentBlock {
  type: 'paragraph' | 'heading' | 'image' | 'chart' | 'quote' | 'callout' | 'list';
  content?: string;
  level?: 2 | 3;
  items?: string[];
  chartData?: ChartDataPoint[];
  chartSymbol?: string;
  attribution?: string;
  imageUrl?: string;
  imageCaption?: string;
}

export interface ArticleDetail extends Article {
  slug: string;
  content: ArticleContentBlock[];
  tags: string[];
  relatedArticleIds: string[];
  relevantTickers: string[];
  headings: ArticleHeading[];
}

// Category colors
export const categoryColors: Record<string, string> = {
  // Markets Section
  'us-markets': 'bg-blue-600',
  'europe-markets': 'bg-blue-500',
  'asia-markets': 'bg-blue-400',
  'forex': 'bg-cyan-600',
  'crypto': 'bg-orange-500',
  'bonds': 'bg-indigo-600',
  'etf': 'bg-teal-600',
  // Business Section
  'economy': 'bg-green-600',
  'finance': 'bg-emerald-600',
  'health-science': 'bg-red-500',
  'real-estate': 'bg-amber-600',
  'media': 'bg-pink-600',
  'transportation': 'bg-slate-600',
  'industrial': 'bg-zinc-600',
  'sports': 'bg-lime-600',
  'tech': 'bg-purple-600',
  'politics': 'bg-rose-600',
  'consumption': 'bg-yellow-600',
  'opinion': 'bg-gray-600',
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
  category: "us-markets",
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
    category: "us-markets",
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
    category: "us-markets",
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
  { rank: 4, title: "Oil Prices Under Pressure", category: "us-markets", url: "#" },
  { rank: 5, title: "Apple AI Plans Leaked", category: "tech", url: "#" },
  { rank: 6, title: "Housing Recovery Gains Steam", category: "economy", url: "#" },
  { rank: 7, title: "Tesla Delivery Beat", category: "us-markets", url: "#" },
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
    category: "us-markets",
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

// All Categories (19 total)
export const categories = [
  // Markets Section
  { name: "US Markets", slug: "us-markets", icon: "TrendingUp" },
  { name: "Europe Markets", slug: "europe-markets", icon: "TrendingUp" },
  { name: "Asia Markets", slug: "asia-markets", icon: "TrendingUp" },
  { name: "Forex", slug: "forex", icon: "DollarSign" },
  { name: "Crypto", slug: "crypto", icon: "Bitcoin" },
  { name: "Bonds", slug: "bonds", icon: "Landmark" },
  { name: "ETF", slug: "etf", icon: "BarChart2" },
  // Business Section
  { name: "Economy", slug: "economy", icon: "Building2" },
  { name: "Finance", slug: "finance", icon: "Wallet" },
  { name: "Health & Science", slug: "health-science", icon: "HeartPulse" },
  { name: "Real Estate", slug: "real-estate", icon: "Home" },
  { name: "Media", slug: "media", icon: "Tv" },
  { name: "Transportation", slug: "transportation", icon: "Truck" },
  { name: "Industrial", slug: "industrial", icon: "Factory" },
  { name: "Sports", slug: "sports", icon: "Trophy" },
  { name: "Tech", slug: "tech", icon: "Cpu" },
  { name: "Politics", slug: "politics", icon: "Vote" },
  { name: "Consumption", slug: "consumption", icon: "ShoppingCart" },
  { name: "Opinion", slug: "opinion", icon: "MessageSquare" },
];

// Navigation Links
export const navLinks = [
  { name: "Stocks", href: "/stocks" },
  { name: "US Markets", href: "/category/us-markets" },
  { name: "Economy", href: "/category/economy" },
  { name: "Tech", href: "/category/tech" },
  { name: "Crypto", href: "/category/crypto" },
  { name: "Opinion", href: "/category/opinion" },
];

// Mock Stock Chart Data
export const stockChartData: Record<string, ChartDataPoint[]> = {
  NVDA: [
    { time: "Nov 1", value: 132.50, volume: 45000000 },
    { time: "Nov 4", value: 135.20, volume: 52000000 },
    { time: "Nov 5", value: 138.80, volume: 48000000 },
    { time: "Nov 6", value: 136.40, volume: 41000000 },
    { time: "Nov 7", value: 140.20, volume: 55000000 },
    { time: "Nov 8", value: 139.50, volume: 47000000 },
    { time: "Nov 11", value: 142.80, volume: 51000000 },
    { time: "Nov 12", value: 145.60, volume: 62000000 },
    { time: "Nov 13", value: 143.20, volume: 44000000 },
    { time: "Nov 14", value: 147.90, volume: 58000000 },
    { time: "Nov 15", value: 146.30, volume: 49000000 },
    { time: "Nov 18", value: 149.80, volume: 53000000 },
    { time: "Nov 19", value: 152.40, volume: 67000000 },
    { time: "Nov 20", value: 148.90, volume: 71000000 },
    { time: "Nov 21", value: 145.20, volume: 68000000 },
    { time: "Nov 22", value: 142.62, volume: 54000000 },
  ],
  BTC: [
    { time: "Nov 1", value: 69500, volume: 28000000000 },
    { time: "Nov 4", value: 71200, volume: 32000000000 },
    { time: "Nov 5", value: 74800, volume: 35000000000 },
    { time: "Nov 6", value: 76200, volume: 38000000000 },
    { time: "Nov 7", value: 78500, volume: 42000000000 },
    { time: "Nov 8", value: 77100, volume: 36000000000 },
    { time: "Nov 11", value: 82300, volume: 45000000000 },
    { time: "Nov 12", value: 87600, volume: 52000000000 },
    { time: "Nov 13", value: 89200, volume: 48000000000 },
    { time: "Nov 14", value: 91800, volume: 55000000000 },
    { time: "Nov 15", value: 90400, volume: 47000000000 },
    { time: "Nov 18", value: 93200, volume: 51000000000 },
    { time: "Nov 19", value: 95800, volume: 58000000000 },
    { time: "Nov 20", value: 94200, volume: 49000000000 },
    { time: "Nov 21", value: 96500, volume: 53000000000 },
    { time: "Nov 22", value: 97245, volume: 56000000000 },
  ],
};

// Mock Article Details
export const articleDetails: Record<string, ArticleDetail> = {
  "tech-giants-lead-market-rally": {
    id: "1",
    slug: "tech-giants-lead-market-rally",
    title: "Tech Giants Lead Market Rally as AI Investments Surge to Record Highs",
    excerpt: "Major technology companies posted significant gains on Wednesday as investors pile into artificial intelligence stocks, with semiconductor makers leading the charge.",
    category: "us-markets",
    imageUrl: "https://picsum.photos/seed/tech-rally/1920/1080",
    author: "Sarah Chen",
    publishedAt: "2h ago",
    readTime: 5,
    isFeatured: true,
    tags: ["AI", "Technology", "S&P 500", "NVIDIA", "Semiconductors"],
    relevantTickers: ["NVDA", "AMD", "MSFT", "GOOGL"],
    relatedArticleIds: ["2", "4", "6"],
    headings: [
      { id: "ai-boom", text: "The AI Investment Boom", level: 2 },
      { id: "key-players", text: "Key Players Leading the Charge", level: 2 },
      { id: "nvidia-analysis", text: "NVIDIA Performance Analysis", level: 3 },
      { id: "market-outlook", text: "Market Outlook for 2025", level: 2 },
    ],
    content: [
      {
        type: "paragraph",
        content: "The technology sector delivered its strongest performance in months on Wednesday, with the S&P 500 tech sector surging 2.3% as investors doubled down on artificial intelligence plays. The rally, led by semiconductor giants, signals renewed confidence in the AI narrative despite recent market volatility.",
      },
      {
        type: "heading",
        level: 2,
        content: "The AI Investment Boom",
      },
      {
        type: "paragraph",
        content: "Artificial intelligence investments have reached unprecedented levels, with corporations worldwide committing over $200 billion to AI infrastructure in 2024 alone. This spending spree shows no signs of slowing down, as companies race to integrate generative AI capabilities into their products and services.",
      },
      {
        type: "callout",
        content: "Global AI spending reached $200B+ in 2024, with projections of $500B by 2027",
      },
      {
        type: "paragraph",
        content: "The demand for AI computing power has created a supply crunch for high-end GPUs, benefiting manufacturers like NVIDIA and AMD. Data center operators are scrambling to secure capacity, leading to extended wait times for the latest AI accelerators.",
      },
      {
        type: "heading",
        level: 2,
        content: "Key Players Leading the Charge",
      },
      {
        type: "paragraph",
        content: "NVIDIA remains the undisputed leader in AI computing, with its data center revenue growing 279% year-over-year. The company's H100 and upcoming B100 chips have become essential components for training large language models and running AI inference workloads.",
      },
      {
        type: "quote",
        content: "We're seeing demand that exceeds anything we've experienced in our history. The AI revolution is just beginning, and we're positioned at the center of it.",
        attribution: "Jensen Huang, CEO of NVIDIA",
      },
      {
        type: "heading",
        level: 3,
        content: "NVIDIA Performance Analysis",
      },
      {
        type: "paragraph",
        content: "NVIDIA shares have gained over 200% in the past year, making it one of the best-performing large-cap stocks. The company's market capitalization briefly exceeded $1.5 trillion, placing it among the world's most valuable companies.",
      },
      {
        type: "chart",
        chartSymbol: "NVDA",
        chartData: stockChartData.NVDA,
      },
      {
        type: "paragraph",
        content: "Technical analysts note strong support at the 50-day moving average, with resistance near the recent all-time highs. The stock's relative strength index (RSI) suggests momentum remains favorable despite elevated valuations.",
      },
      {
        type: "list",
        items: [
          "NVIDIA: +6.29% ($142.62)",
          "AMD: +3.91% ($138.91)",
          "Microsoft: +1.8% ($378.50)",
          "Google: +2.1% ($152.80)",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Market Outlook for 2025",
      },
      {
        type: "paragraph",
        content: "Wall Street analysts remain broadly bullish on the AI trade, though valuations have become a concern for some. The sector trades at roughly 30 times forward earnings, compared to 18 times for the broader S&P 500.",
      },
      {
        type: "paragraph",
        content: "However, bulls argue that the growth trajectory justifies premium multiples. With AI adoption still in early stages across most industries, the addressable market continues to expand. Enterprise software companies are racing to embed AI features, creating sustained demand for the underlying infrastructure.",
      },
      {
        type: "callout",
        content: "Analyst consensus: 78% rate NVDA as 'Buy' with an average price target of $165",
      },
      {
        type: "paragraph",
        content: "Investors should monitor upcoming earnings reports from major tech companies for signals about AI spending trends. Any indication of slowing investment could trigger a sector-wide reassessment, though current evidence points to accelerating adoption.",
      },
    ],
  },
  "bitcoin-surges-past-97k": {
    id: "2",
    slug: "bitcoin-surges-past-97k",
    title: "Bitcoin Surges Past $97K as Institutional Demand Accelerates",
    excerpt: "Cryptocurrency markets continue their impressive rally as major financial institutions increase their Bitcoin holdings.",
    category: "crypto",
    imageUrl: "https://picsum.photos/seed/bitcoin-surge/1920/1080",
    author: "Michael Torres",
    publishedAt: "3h ago",
    readTime: 4,
    tags: ["Bitcoin", "Cryptocurrency", "Institutional Investment", "ETF"],
    relevantTickers: ["BTC", "ETH", "COIN", "MSTR"],
    relatedArticleIds: ["7", "3", "1"],
    headings: [
      { id: "institutional-wave", text: "The Institutional Wave", level: 2 },
      { id: "etf-flows", text: "ETF Flows Drive Momentum", level: 2 },
      { id: "price-analysis", text: "Price Analysis", level: 3 },
      { id: "road-to-100k", text: "The Road to $100K", level: 2 },
    ],
    content: [
      {
        type: "paragraph",
        content: "Bitcoin has surged past $97,000 for the first time in its history, extending a remarkable rally fueled by institutional adoption and the success of spot Bitcoin ETFs. The world's largest cryptocurrency is now within striking distance of the psychologically significant $100,000 level.",
      },
      {
        type: "heading",
        level: 2,
        content: "The Institutional Wave",
      },
      {
        type: "paragraph",
        content: "Major financial institutions have dramatically increased their exposure to Bitcoin over the past year. Asset managers now hold over 1 million BTC through various investment vehicles, representing approximately 5% of the total supply.",
      },
      {
        type: "callout",
        content: "Institutional investors now hold over 1 million BTC worth approximately $97 billion",
      },
      {
        type: "quote",
        content: "Bitcoin has proven itself as a legitimate asset class. We're allocating a portion of our portfolio to digital assets as part of our diversification strategy.",
        attribution: "BlackRock CEO Larry Fink",
      },
      {
        type: "heading",
        level: 2,
        content: "ETF Flows Drive Momentum",
      },
      {
        type: "paragraph",
        content: "The launch of spot Bitcoin ETFs in January 2024 marked a turning point for cryptocurrency adoption. These products have attracted over $50 billion in net inflows, with BlackRock's IBIT leading the pack.",
      },
      {
        type: "heading",
        level: 3,
        content: "Price Analysis",
      },
      {
        type: "chart",
        chartSymbol: "BTC",
        chartData: stockChartData.BTC,
      },
      {
        type: "paragraph",
        content: "Bitcoin's price action shows a clear uptrend with higher highs and higher lows. The cryptocurrency has successfully broken through multiple resistance levels, with strong buying pressure on any dips.",
      },
      {
        type: "heading",
        level: 2,
        content: "The Road to $100K",
      },
      {
        type: "paragraph",
        content: "Market analysts are increasingly confident that Bitcoin will breach $100,000 before year-end. The combination of institutional demand, limited supply due to the April 2024 halving, and improving regulatory clarity creates a favorable backdrop.",
      },
      {
        type: "list",
        items: [
          "Spot ETF inflows: $50B+ since January",
          "Post-halving supply reduction: 50%",
          "Active addresses: All-time high",
          "Miner revenue: Stabilizing after halving",
        ],
      },
      {
        type: "paragraph",
        content: "However, traders should remain cautious about potential volatility. Bitcoin has historically experienced sharp corrections even during bull markets, and leveraged positions remain elevated across major exchanges.",
      },
    ],
  },
};
