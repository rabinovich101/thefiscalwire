import YahooFinance from "yahoo-finance2";

// Create singleton instance
const yahooFinance = new YahooFinance();

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  volume?: number;
}

export interface TrendingStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume: number;
  marketCap: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  fiftyDayAverage: number;
  twoHundredDayAverage: number;
  trailingPE: number | null;
  forwardPE: number | null;
  eps: number | null;
  dividendYield: number | null;
  beta: number | null;
  exchange: string;
  quoteType: string;
}

// Symbol mapping from display symbols to Yahoo Finance symbols
export const SYMBOL_MAP: Record<string, { yahoo: string; name: string }> = {
  // Market Indices
  SPX: { yahoo: "^GSPC", name: "S&P 500" },
  IXIC: { yahoo: "^IXIC", name: "NASDAQ" },
  DJI: { yahoo: "^DJI", name: "DOW" },
  RUT: { yahoo: "^RUT", name: "Russell 2000" },
  // Crypto
  BTC: { yahoo: "BTC-USD", name: "Bitcoin" },
  ETH: { yahoo: "ETH-USD", name: "Ethereum" },
  // Commodities
  GC: { yahoo: "GC=F", name: "Gold" },
  CL: { yahoo: "CL=F", name: "Crude Oil" },
};

// Reverse mapping from Yahoo symbols to display symbols
const YAHOO_TO_DISPLAY: Record<string, string> = Object.entries(SYMBOL_MAP).reduce(
  (acc, [display, { yahoo }]) => {
    acc[yahoo] = display;
    return acc;
  },
  {} as Record<string, string>
);

// Get Yahoo Finance symbol from display symbol
function getYahooSymbol(symbol: string): string {
  return SYMBOL_MAP[symbol]?.yahoo || symbol;
}

// Get display symbol from Yahoo symbol
function getDisplaySymbol(yahooSymbol: string): string {
  return YAHOO_TO_DISPLAY[yahooSymbol] || yahooSymbol;
}

// Get name for a symbol
function getSymbolName(symbol: string, shortName?: string): string {
  return SYMBOL_MAP[symbol]?.name || shortName || symbol;
}

/**
 * Fetch real-time quotes for multiple symbols
 */
export async function getQuotes(symbols: string[]): Promise<MarketQuote[]> {
  try {
    const yahooSymbols = symbols.map(getYahooSymbol);
    const results = await yahooFinance.quote(yahooSymbols);

    // Handle both single result and array
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const quotesArray: any[] = Array.isArray(results) ? results : [results];

    return quotesArray.map((quote) => {
      const displaySymbol = getDisplaySymbol(quote.symbol);
      return {
        symbol: displaySymbol,
        name: getSymbolName(displaySymbol, quote.shortName || quote.longName),
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
      };
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    throw error;
  }
}

/**
 * Fetch market indices (S&P 500, NASDAQ, DOW, etc.)
 */
export async function getMarketIndices(): Promise<MarketQuote[]> {
  const indexSymbols = ["SPX", "IXIC", "DJI", "RUT", "BTC", "ETH", "GC", "CL"];
  return getQuotes(indexSymbols);
}

/**
 * Fetch top gainers from US market
 */
export async function getTopGainers(): Promise<MarketQuote[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await yahooFinance.screener({
      scrIds: "day_gainers",
      count: 5,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result.quotes || []).slice(0, 5).map((quote: any) => ({
      symbol: quote.symbol,
      name: quote.shortName || quote.longName || quote.symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
    }));
  } catch (error) {
    console.error("Error fetching top gainers:", error);
    throw error;
  }
}

/**
 * Fetch top losers from US market
 */
export async function getTopLosers(): Promise<MarketQuote[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await yahooFinance.screener({
      scrIds: "day_losers",
      count: 5,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result.quotes || []).slice(0, 5).map((quote: any) => ({
      symbol: quote.symbol,
      name: quote.shortName || quote.longName || quote.symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
    }));
  } catch (error) {
    console.error("Error fetching top losers:", error);
    throw error;
  }
}

/**
 * Fetch historical chart data for a symbol
 */
export async function getChartData(
  symbol: string,
  period: "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" = "1mo"
): Promise<ChartDataPoint[]> {
  try {
    const yahooSymbol = getYahooSymbol(symbol);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await yahooFinance.chart(yahooSymbol, {
      period1: getStartDate(period),
      period2: new Date(),
      interval: period === "1d" ? "5m" : period === "5d" ? "15m" : "1d",
    });

    if (!result.quotes || result.quotes.length === 0) {
      return [];
    }

    return result.quotes
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((q: any) => q.close !== null && q.close !== undefined)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((quote: any) => ({
        time: formatDate(new Date(quote.date), period),
        value: quote.close,
        volume: quote.volume,
      }));
  } catch (error) {
    console.error(`Error fetching chart data for ${symbol}:`, error);
    throw error;
  }
}

// Helper to calculate start date based on period
function getStartDate(period: string): Date {
  const now = new Date();
  switch (period) {
    case "1d":
      return new Date(now.setDate(now.getDate() - 1));
    case "5d":
      return new Date(now.setDate(now.getDate() - 5));
    case "1mo":
      return new Date(now.setMonth(now.getMonth() - 1));
    case "3mo":
      return new Date(now.setMonth(now.getMonth() - 3));
    case "6mo":
      return new Date(now.setMonth(now.getMonth() - 6));
    case "1y":
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return new Date(now.setMonth(now.getMonth() - 1));
  }
}

// Helper to format date based on period
function formatDate(date: Date, period: string): string {
  if (period === "1d" || period === "5d") {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Fetch trending stocks from Yahoo Finance
 * Uses the trending_tickers screener to get stocks with high interest
 */
export async function getTrendingStocks(count: number = 25): Promise<TrendingStock[]> {
  try {
    // Get trending tickers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const trendingResult: any = await yahooFinance.trendingSymbols("US", { count: count });

    const symbols = trendingResult.quotes?.map((q: { symbol: string }) => q.symbol) || [];

    if (symbols.length === 0) {
      return [];
    }

    // Get detailed quotes for each symbol
    const quotes = await yahooFinance.quote(symbols);
    const quotesArray = Array.isArray(quotes) ? quotes : [quotes];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return quotesArray.map((quote: any) => ({
      symbol: quote.symbol,
      name: quote.shortName || quote.longName || quote.symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      volume: quote.regularMarketVolume || 0,
      avgVolume: quote.averageDailyVolume3Month || quote.averageDailyVolume10Day || 0,
      marketCap: quote.marketCap || 0,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0,
      fiftyDayAverage: quote.fiftyDayAverage || 0,
      twoHundredDayAverage: quote.twoHundredDayAverage || 0,
      trailingPE: quote.trailingPE || null,
      forwardPE: quote.forwardPE || null,
      eps: quote.epsTrailingTwelveMonths || null,
      dividendYield: quote.dividendYield || null,
      beta: quote.beta || null,
      exchange: quote.exchange || '',
      quoteType: quote.quoteType || 'EQUITY',
    })).filter((stock: TrendingStock) => stock.price > 0);
  } catch (error) {
    console.error("Error fetching trending stocks:", error);
    throw error;
  }
}

/**
 * Fetch most active stocks by volume
 */
// S&P 500 Top 100 by market cap (representative sample for heatmap)
export const SP500_SYMBOLS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BRK-B", "UNH", "LLY",
  "JPM", "V", "XOM", "AVGO", "JNJ", "MA", "PG", "HD", "COST", "ABBV",
  "MRK", "CVX", "CRM", "KO", "PEP", "WMT", "BAC", "AMD", "TMO", "ACN",
  "ADBE", "NFLX", "MCD", "CSCO", "LIN", "ABT", "ORCL", "DHR", "INTC", "CMCSA",
  "DIS", "WFC", "VZ", "PM", "TXN", "PFE", "COP", "RTX", "INTU", "NEE",
  "BMY", "NKE", "UPS", "HON", "QCOM", "AMGN", "SPGI", "IBM", "T", "CAT",
  "LOW", "UNP", "GE", "BA", "MS", "AXP", "DE", "GS", "ELV", "BLK",
  "MDT", "ISRG", "SYK", "ADI", "GILD", "LMT", "CVS", "PLD", "SCHW", "MDLZ",
  "ADP", "VRTX", "REGN", "TMUS", "MO", "LRCX", "CI", "CB", "ZTS", "SO",
  "BDX", "NOW", "SLB", "C", "ETN", "EOG", "PANW", "BSX", "DUK", "MMC"
];

// NASDAQ-100 symbols
export const NASDAQ100_SYMBOLS = [
  "AAPL", "MSFT", "GOOGL", "GOOG", "AMZN", "NVDA", "META", "TSLA", "AVGO", "COST",
  "ASML", "ADBE", "PEP", "NFLX", "AZN", "AMD", "CSCO", "TMUS", "INTC", "CMCSA",
  "TXN", "INTU", "QCOM", "AMGN", "HON", "AMAT", "ISRG", "BKNG", "SBUX", "VRTX",
  "MDLZ", "GILD", "REGN", "ADI", "LRCX", "PANW", "ADP", "MU", "KLAC", "SNPS",
  "PYPL", "CDNS", "MELI", "CHTR", "ABNB", "MRVL", "CSX", "ORLY", "MAR", "NXPI",
  "PCAR", "FTNT", "WDAY", "CTAS", "CPRT", "MNST", "ROP", "PAYX", "KDP", "AEP",
  "ODFL", "MCHP", "ADSK", "KHC", "LULU", "FAST", "DXCM", "EA", "EXC", "IDXX",
  "VRSK", "BKR", "GEHC", "CTSH", "XEL", "FANG", "BIIB", "CSGP", "ILMN", "ON",
  "GFS", "TEAM", "ANSS", "ZS", "DLTR", "WBD", "CDW", "MDB", "TTWO", "DDOG",
  "CEG", "WBA", "MRNA", "LCID", "SIRI", "JD", "RIVN", "PDD", "ZM", "CRWD"
];

export interface HeatmapStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  sector: string;
}

/**
 * Fetch heatmap data for S&P 500 or NASDAQ-100
 */
export async function getHeatmapData(index: "sp500" | "nasdaq"): Promise<HeatmapStock[]> {
  try {
    const symbols = index === "sp500" ? SP500_SYMBOLS : NASDAQ100_SYMBOLS;

    // Fetch quotes in batches to avoid rate limiting
    const batchSize = 50;
    const allQuotes: HeatmapStock[] = [];

    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const quotes = await yahooFinance.quote(batch);
      const quotesArray = Array.isArray(quotes) ? quotes : [quotes];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedQuotes = quotesArray.map((quote: any) => ({
        symbol: quote.symbol,
        name: quote.shortName || quote.longName || quote.symbol,
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        marketCap: quote.marketCap || 0,
        sector: getSectorForSymbol(quote.symbol),
      })).filter((stock: HeatmapStock) => stock.price > 0 && stock.marketCap > 0);

      allQuotes.push(...mappedQuotes);
    }

    // Sort by market cap descending
    return allQuotes.sort((a, b) => b.marketCap - a.marketCap);
  } catch (error) {
    console.error(`Error fetching ${index} heatmap data:`, error);
    throw error;
  }
}

// Sector metadata with icons, colors, and descriptions
export interface SectorInfo {
  id: string;
  name: string;
  description: string;
  color: string; // Tailwind color class
  gradient: string; // Gradient for cards
  icon: string; // Lucide icon name
}

export const SECTORS: SectorInfo[] = [
  {
    id: "technology",
    name: "Technology",
    description: "Software, hardware, semiconductors, and IT services",
    color: "blue",
    gradient: "from-blue-500/20 via-blue-600/10 to-cyan-500/20",
    icon: "Cpu",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Pharmaceuticals, biotechnology, and medical devices",
    color: "emerald",
    gradient: "from-emerald-500/20 via-emerald-600/10 to-teal-500/20",
    icon: "Heart",
  },
  {
    id: "financial",
    name: "Financial",
    description: "Banks, insurance, asset management, and fintech",
    color: "amber",
    gradient: "from-amber-500/20 via-amber-600/10 to-yellow-500/20",
    icon: "Landmark",
  },
  {
    id: "consumer",
    name: "Consumer Discretionary",
    description: "Retail, automotive, entertainment, and luxury goods",
    color: "pink",
    gradient: "from-pink-500/20 via-pink-600/10 to-rose-500/20",
    icon: "ShoppingBag",
  },
  {
    id: "consumer-staples",
    name: "Consumer Staples",
    description: "Food, beverages, household products, and tobacco",
    color: "orange",
    gradient: "from-orange-500/20 via-orange-600/10 to-amber-500/20",
    icon: "Coffee",
  },
  {
    id: "industrial",
    name: "Industrial",
    description: "Aerospace, defense, machinery, and transportation",
    color: "slate",
    gradient: "from-slate-500/20 via-slate-600/10 to-zinc-500/20",
    icon: "Factory",
  },
  {
    id: "energy",
    name: "Energy",
    description: "Oil, gas, renewable energy, and utilities",
    color: "red",
    gradient: "from-red-500/20 via-red-600/10 to-orange-500/20",
    icon: "Flame",
  },
  {
    id: "utilities",
    name: "Utilities",
    description: "Electric, gas, and water utilities",
    color: "yellow",
    gradient: "from-yellow-500/20 via-yellow-600/10 to-lime-500/20",
    icon: "Zap",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    description: "REITs, property management, and development",
    color: "violet",
    gradient: "from-violet-500/20 via-violet-600/10 to-purple-500/20",
    icon: "Building2",
  },
  {
    id: "materials",
    name: "Materials",
    description: "Chemicals, metals, mining, and construction materials",
    color: "stone",
    gradient: "from-stone-500/20 via-stone-600/10 to-neutral-500/20",
    icon: "Gem",
  },
  {
    id: "communication",
    name: "Communication Services",
    description: "Telecom, media, entertainment, and social platforms",
    color: "indigo",
    gradient: "from-indigo-500/20 via-indigo-600/10 to-blue-500/20",
    icon: "Radio",
  },
];

// Map sector display name to sector ID
export const SECTOR_NAME_TO_ID: Record<string, string> = {
  "Technology": "technology",
  "Healthcare": "healthcare",
  "Financial": "financial",
  "Consumer": "consumer",
  "Consumer Staples": "consumer-staples",
  "Industrial": "industrial",
  "Energy": "energy",
  "Utilities": "utilities",
  "Real Estate": "real-estate",
  "Materials": "materials",
  "Communication": "communication",
  "Other": "other",
};

// Comprehensive sector mapping - 100+ stocks per major sector
const SECTOR_MAP: Record<string, string> = {
  // ============================================
  // TECHNOLOGY - 150+ stocks
  // ============================================
  // Mega-cap Tech
  "AAPL": "Technology", "MSFT": "Technology", "GOOGL": "Technology", "GOOG": "Technology",
  "META": "Technology", "NVDA": "Technology", "TSLA": "Technology",

  // Semiconductors
  "AVGO": "Technology", "AMD": "Technology", "INTC": "Technology", "QCOM": "Technology",
  "TXN": "Technology", "AMAT": "Technology", "MU": "Technology", "LRCX": "Technology",
  "ADI": "Technology", "KLAC": "Technology", "MRVL": "Technology", "NXPI": "Technology",
  "MCHP": "Technology", "ON": "Technology", "GFS": "Technology", "SWKS": "Technology",
  "QRVO": "Technology", "MPWR": "Technology", "ENTG": "Technology", "MKSI": "Technology",
  "CRUS": "Technology", "WOLF": "Technology", "SYNA": "Technology", "RMBS": "Technology",
  "SMTC": "Technology", "ACLS": "Technology", "FORM": "Technology", "POWI": "Technology",
  "DIOD": "Technology", "SLAB": "Technology", "ALGM": "Technology", "SITM": "Technology",
  "NVMI": "Technology", "CEVA": "Technology", "AMBA": "Technology", "AOSL": "Technology",
  "SGMO": "Technology", "TSM": "Technology", "ASML": "Technology", "SNPS": "Technology",
  "CDNS": "Technology", "ARM": "Technology",

  // Software - Enterprise
  "ORCL": "Technology", "CRM": "Technology", "SAP": "Technology", "ADBE": "Technology",
  "IBM": "Technology", "INTU": "Technology", "NOW": "Technology", "WDAY": "Technology",
  "ADSK": "Technology", "ANSS": "Technology", "TEAM": "Technology", "MDB": "Technology",
  "DDOG": "Technology", "SNOW": "Technology", "PLTR": "Technology", "NET": "Technology",
  "ZS": "Technology", "CRWD": "Technology", "PANW": "Technology", "FTNT": "Technology",
  "OKTA": "Technology", "SPLK": "Technology", "VEEV": "Technology", "BILL": "Technology",
  "HUBS": "Technology", "DOCU": "Technology", "ZM": "Technology", "TWLO": "Technology",
  "U": "Technology", "RBLX": "Technology", "APP": "Technology", "CFLT": "Technology",
  "PATH": "Technology", "SAMSARA": "Technology", "GTLB": "Technology", "ESTC": "Technology",
  "DT": "Technology", "SUMO": "Technology", "AI": "Technology", "ASAN": "Technology",
  "MNDY": "Technology", "DOCN": "Technology", "HCP": "Technology", "NCNO": "Technology",
  "APPF": "Technology", "JAMF": "Technology", "BRZE": "Technology", "ZI": "Technology",
  "AMPL": "Technology", "FROG": "Technology", "FRSH": "Technology",

  // Software - Consumer/Internet
  "UBER": "Technology", "LYFT": "Technology", "DASH": "Technology", "SNAP": "Technology",
  "PINS": "Technology", "SPOT": "Technology", "SQ": "Technology", "SHOP": "Technology",
  "ETSY": "Technology", "EBAY": "Technology", "MELI": "Technology", "SE": "Technology",
  "BABA": "Technology", "JD": "Technology", "PDD": "Technology", "BIDU": "Technology",
  "NTES": "Technology", "BILI": "Technology", "TME": "Technology", "COIN": "Technology",
  "HOOD": "Technology", "AFRM": "Technology", "UPST": "Technology", "SOFI": "Technology",
  "LC": "Technology", "NU": "Technology", "DUOL": "Technology", "ABNB": "Technology",
  "MTCH": "Technology", "BMBL": "Technology", "GRUB": "Technology", "YELP": "Technology",
  "IAC": "Technology", "ANGI": "Technology", "TRIP": "Technology", "EXPE": "Technology",
  "BKNG": "Technology", "TCOM": "Technology",

  // IT Services & Consulting
  "ACN": "Technology", "CSCO": "Technology", "HPQ": "Technology", "HPE": "Technology",
  "DELL": "Technology", "CTSH": "Technology", "IT": "Technology", "LDOS": "Technology",
  "SAIC": "Technology", "CACI": "Technology", "BAH": "Technology", "GRMN": "Technology",
  "EPAM": "Technology", "GLOB": "Technology", "EXLS": "Technology", "WIT": "Technology",
  "INFY": "Technology", "CDW": "Technology", "NSIT": "Technology", "SCSC": "Technology",

  // Hardware & Equipment
  "ANET": "Technology", "JNPR": "Technology", "FFIV": "Technology", "NTAP": "Technology",
  "PSTG": "Technology", "STX": "Technology", "WDC": "Technology", "SMCI": "Technology",
  "LOGI": "Technology", "CRSR": "Technology", "HEAR": "Technology", "KOSS": "Technology",
  "SONO": "Technology", "GPRO": "Technology", "FITB": "Technology", "ZBRA": "Technology",
  "KEYS": "Technology", "TER": "Technology", "COHR": "Technology", "VIAV": "Technology",

  // ============================================
  // HEALTHCARE - 120+ stocks
  // ============================================
  // Pharma - Large Cap
  "UNH": "Healthcare", "JNJ": "Healthcare", "LLY": "Healthcare", "ABBV": "Healthcare",
  "MRK": "Healthcare", "PFE": "Healthcare", "BMY": "Healthcare", "AMGN": "Healthcare",
  "GILD": "Healthcare", "VRTX": "Healthcare", "REGN": "Healthcare", "BIIB": "Healthcare",
  "AZN": "Healthcare", "GSK": "Healthcare", "NVO": "Healthcare", "SNY": "Healthcare",
  "NVS": "Healthcare", "TAK": "Healthcare", "VTRS": "Healthcare", "TEVA": "Healthcare",
  "ZTS": "Healthcare", "MRNA": "Healthcare",

  // Biotech
  "SGEN": "Healthcare", "ALNY": "Healthcare", "BMRN": "Healthcare", "INCY": "Healthcare",
  "EXEL": "Healthcare", "HZNP": "Healthcare", "UTHR": "Healthcare", "SRPT": "Healthcare",
  "RARE": "Healthcare", "IONS": "Healthcare", "NBIX": "Healthcare", "PTCT": "Healthcare",
  "TECH": "Healthcare", "ARWR": "Healthcare", "FOLD": "Healthcare", "ARGX": "Healthcare",
  "PCVX": "Healthcare", "KRTX": "Healthcare", "IMVT": "Healthcare", "RCUS": "Healthcare",
  "RVMD": "Healthcare", "KRYS": "Healthcare", "RYTM": "Healthcare", "VKTX": "Healthcare",
  "XENE": "Healthcare", "VERA": "Healthcare", "CYTK": "Healthcare", "CRNX": "Healthcare",
  "DAWN": "Healthcare", "APLS": "Healthcare", "PRTA": "Healthcare", "RCKT": "Healthcare",

  // Medical Devices
  "ABT": "Healthcare", "TMO": "Healthcare", "DHR": "Healthcare", "MDT": "Healthcare",
  "SYK": "Healthcare", "ISRG": "Healthcare", "BSX": "Healthcare", "BDX": "Healthcare",
  "EW": "Healthcare", "IDXX": "Healthcare", "DXCM": "Healthcare", "HOLX": "Healthcare",
  "BAX": "Healthcare", "COO": "Healthcare", "ALGN": "Healthcare", "TFX": "Healthcare",
  "WAT": "Healthcare", "MTD": "Healthcare", "PODD": "Healthcare", "ILMN": "Healthcare",
  "GEHC": "Healthcare", "RVTY": "Healthcare", "BIO": "Healthcare", "TECH": "Healthcare",
  "IQV": "Healthcare", "QGEN": "Healthcare", "NTRA": "Healthcare", "EXAS": "Healthcare",
  "GH": "Healthcare", "NVTA": "Healthcare", "TWST": "Healthcare", "PACB": "Healthcare",
  "NVCR": "Healthcare", "SWAV": "Healthcare", "AXNX": "Healthcare", "SHAK": "Healthcare",
  "INSP": "Healthcare", "PRCT": "Healthcare", "GMED": "Healthcare", "ATRC": "Healthcare",
  "LIVN": "Healthcare", "PEN": "Healthcare", "IRTC": "Healthcare",

  // Health Insurance & Services
  "CVS": "Healthcare", "CI": "Healthcare", "ELV": "Healthcare", "HUM": "Healthcare",
  "CNC": "Healthcare", "MOH": "Healthcare", "HCA": "Healthcare", "THC": "Healthcare",
  "UHS": "Healthcare", "DVA": "Healthcare", "ACHC": "Healthcare", "SGRY": "Healthcare",
  "OPCH": "Healthcare", "AMED": "Healthcare", "LHCG": "Healthcare", "ENSG": "Healthcare",
  "NHC": "Healthcare", "PNTG": "Healthcare", "CCRN": "Healthcare", "AMN": "Healthcare",
  "CHE": "Healthcare", "SHC": "Healthcare", "USPH": "Healthcare", "HIMS": "Healthcare",
  "DOCS": "Healthcare", "AMWL": "Healthcare", "TDOC": "Healthcare", "ONEM": "Healthcare",
  "OSCR": "Healthcare", "CLVR": "Healthcare", "GDRX": "Healthcare", "PHR": "Healthcare",

  // ============================================
  // FINANCIAL - 100+ stocks
  // ============================================
  // Banks - Large
  "JPM": "Financial", "BAC": "Financial", "WFC": "Financial", "C": "Financial",
  "GS": "Financial", "MS": "Financial", "USB": "Financial", "PNC": "Financial",
  "TFC": "Financial", "COF": "Financial", "BK": "Financial", "STT": "Financial",
  "SCHW": "Financial", "FITB": "Financial", "KEY": "Financial", "RF": "Financial",
  "CFG": "Financial", "MTB": "Financial", "HBAN": "Financial", "ZION": "Financial",
  "CMA": "Financial", "FHN": "Financial", "WBS": "Financial", "FRC": "Financial",
  "SIVB": "Financial", "PACW": "Financial", "WAL": "Financial", "EWBC": "Financial",

  // Regional Banks
  "FCNCA": "Financial", "NTRS": "Financial", "ALLY": "Financial", "SYF": "Financial",
  "DFS": "Financial", "NYCB": "Financial", "SNV": "Financial", "FNB": "Financial",
  "WTFC": "Financial", "PNFP": "Financial", "BOKF": "Financial", "ONB": "Financial",
  "GBCI": "Financial", "SBCF": "Financial", "TOWN": "Financial", "CATY": "Financial",
  "OZK": "Financial", "ABCB": "Financial", "FULT": "Financial", "UMPQ": "Financial",

  // Payment & Credit
  "V": "Financial", "MA": "Financial", "AXP": "Financial", "PYPL": "Financial",
  "SQ": "Financial", "FIS": "Financial", "FISV": "Financial", "GPN": "Financial",
  "FLT": "Financial", "WU": "Financial", "FOUR": "Financial", "PAYO": "Financial",
  "RPAY": "Financial", "RELY": "Financial", "ACIW": "Financial", "EVTC": "Financial",

  // Asset Management & Investment
  "BLK": "Financial", "SPGI": "Financial", "MCO": "Financial", "MSCI": "Financial",
  "ICE": "Financial", "CME": "Financial", "NDAQ": "Financial", "CBOE": "Financial",
  "TROW": "Financial", "IVZ": "Financial", "BEN": "Financial", "JHG": "Financial",
  "AMG": "Financial", "APAM": "Financial", "VCTR": "Financial", "AB": "Financial",
  "SEIC": "Financial", "EVR": "Financial", "PJT": "Financial", "MKTX": "Financial",
  "VIRT": "Financial", "COIN": "Financial", "HOOD": "Financial", "IBKR": "Financial",
  "LPLA": "Financial", "RJF": "Financial", "SF": "Financial", "HLNE": "Financial",

  // Insurance
  "BRK-B": "Financial", "BRK-A": "Financial", "CB": "Financial", "MMC": "Financial",
  "AON": "Financial", "AJG": "Financial", "WTW": "Financial", "CINF": "Financial",
  "TRV": "Financial", "PGR": "Financial", "ALL": "Financial", "MET": "Financial",
  "PRU": "Financial", "AIG": "Financial", "AFL": "Financial", "LNC": "Financial",
  "GL": "Financial", "UNM": "Financial", "VOYA": "Financial", "CNO": "Financial",
  "PFG": "Financial", "RGA": "Financial", "EQH": "Financial", "ATH": "Financial",
  "AEL": "Financial", "KNSL": "Financial", "RLI": "Financial", "WRB": "Financial",
  "HIG": "Financial", "L": "Financial", "AIZ": "Financial", "ORI": "Financial",
  "ERIE": "Financial", "KMPR": "Financial", "ACGL": "Financial", "SIGI": "Financial",

  // ============================================
  // CONSUMER DISCRETIONARY - 100+ stocks
  // ============================================
  // Retail - Broadline
  "AMZN": "Consumer", "WMT": "Consumer", "TGT": "Consumer", "COST": "Consumer",
  "HD": "Consumer", "LOW": "Consumer", "DG": "Consumer", "DLTR": "Consumer",
  "BJ": "Consumer", "FIVE": "Consumer", "OLLI": "Consumer", "BIG": "Consumer",

  // Retail - Specialty
  "TJX": "Consumer", "ROST": "Consumer", "BURL": "Consumer", "GPS": "Consumer",
  "ANF": "Consumer", "AEO": "Consumer", "URBN": "Consumer", "EXPR": "Consumer",
  "LULU": "Consumer", "FL": "Consumer", "HIBB": "Consumer", "SCVL": "Consumer",
  "DKS": "Consumer", "ASO": "Consumer", "BGFV": "Consumer", "PLCE": "Consumer",
  "CHS": "Consumer", "CHRS": "Consumer", "CATO": "Consumer", "RVLV": "Consumer",

  // Automotive
  "GM": "Consumer", "F": "Consumer", "STLA": "Consumer", "HMC": "Consumer",
  "TM": "Consumer", "RACE": "Consumer", "RIVN": "Consumer", "LCID": "Consumer",
  "FSR": "Consumer", "NIO": "Consumer", "LI": "Consumer", "XPEV": "Consumer",
  "VNE": "Consumer", "CVNA": "Consumer", "CPNG": "Consumer", "VROOM": "Consumer",
  "AN": "Consumer", "PAG": "Consumer", "LAD": "Consumer", "ABG": "Consumer",
  "GPI": "Consumer", "SAH": "Consumer", "SN": "Consumer", "CARS": "Consumer",
  "ALV": "Consumer", "BWA": "Consumer", "LEA": "Consumer", "APTV": "Consumer",
  "GNTX": "Consumer", "VC": "Consumer", "LKQ": "Consumer", "MTOR": "Consumer",

  // Restaurants & Dining
  "MCD": "Consumer", "SBUX": "Consumer", "CMG": "Consumer", "YUM": "Consumer",
  "DPZ": "Consumer", "QSR": "Consumer", "DRI": "Consumer", "TXRH": "Consumer",
  "EAT": "Consumer", "BLMN": "Consumer", "CAKE": "Consumer", "DIN": "Consumer",
  "BJRI": "Consumer", "CHUY": "Consumer", "WING": "Consumer", "SHAK": "Consumer",
  "BROS": "Consumer", "PTLO": "Consumer", "DNUT": "Consumer", "LOCO": "Consumer",
  "RUTH": "Consumer", "RRGB": "Consumer", "DENN": "Consumer", "JACK": "Consumer",
  "PZZA": "Consumer", "WEN": "Consumer", "ARCO": "Consumer", "PLAY": "Consumer",

  // Hotels & Travel
  "MAR": "Consumer", "HLT": "Consumer", "H": "Consumer", "IHG": "Consumer",
  "WH": "Consumer", "CHH": "Consumer", "STAY": "Consumer", "MGM": "Consumer",
  "WYNN": "Consumer", "LVS": "Consumer", "CZR": "Consumer", "PENN": "Consumer",
  "DKNG": "Consumer", "GDEN": "Consumer", "RRR": "Consumer", "BYD": "Consumer",
  "VAC": "Consumer", "TNL": "Consumer", "RCL": "Consumer", "CCL": "Consumer",
  "NCLH": "Consumer", "LUV": "Consumer", "DAL": "Consumer", "UAL": "Consumer",
  "AAL": "Consumer", "JBLU": "Consumer", "ALK": "Consumer", "SAVE": "Consumer",

  // Media & Entertainment
  "NKE": "Consumer", "LEVI": "Consumer", "HBI": "Consumer", "PVH": "Consumer",
  "RL": "Consumer", "TPR": "Consumer", "CPRI": "Consumer", "WWW": "Consumer",
  "VFC": "Consumer", "GOOS": "Consumer", "GIII": "Consumer", "CROX": "Consumer",
  "SKX": "Consumer", "DECK": "Consumer", "SHOO": "Consumer", "CAL": "Consumer",
  "OXM": "Consumer", "BOOT": "Consumer", "WOOF": "Consumer", "CHWY": "Consumer",
  "BARK": "Consumer", "ZG": "Consumer", "RDFN": "Consumer", "OPEN": "Consumer",
  "REAL": "Consumer", "COMP": "Consumer", "FVRR": "Consumer", "UPWK": "Consumer",

  // Gaming & Toys
  "EA": "Consumer", "TTWO": "Consumer", "ATVI": "Consumer", "ZNGA": "Consumer",
  "RBLX": "Consumer", "U": "Consumer", "DKNG": "Consumer", "PENN": "Consumer",
  "HAS": "Consumer", "MAT": "Consumer", "FNKO": "Consumer", "JAKK": "Consumer",
  "PLBY": "Consumer", "PLTK": "Consumer", "SKLZ": "Consumer",

  // ============================================
  // COMMUNICATION SERVICES - 60+ stocks
  // ============================================
  // Telecom
  "VZ": "Communication", "T": "Communication", "TMUS": "Communication",
  "LUMN": "Communication", "FYBR": "Communication", "USM": "Communication",
  "ATUS": "Communication", "CABO": "Communication", "SHEN": "Communication",
  "CNSL": "Communication", "LILA": "Communication", "LILAK": "Communication",
  "TDS": "Communication", "VOD": "Communication", "ORAN": "Communication",
  "TEF": "Communication", "TI": "Communication", "EEFT": "Communication",

  // Media & Entertainment
  "NFLX": "Communication", "DIS": "Communication", "CMCSA": "Communication",
  "WBD": "Communication", "PARA": "Communication", "PARAA": "Communication",
  "FOX": "Communication", "FOXA": "Communication", "VIAC": "Communication",
  "LYV": "Communication", "MSGS": "Communication", "MSG": "Communication",
  "SIRI": "Communication", "SPOT": "Communication", "IQ": "Communication",
  "TME": "Communication", "BILI": "Communication", "ROKU": "Communication",
  "FUBO": "Communication", "AMC": "Communication", "CNK": "Communication",
  "IMAX": "Communication", "LGF-A": "Communication", "LGF-B": "Communication",
  "EDR": "Communication", "WWE": "Communication", "LSXMA": "Communication",
  "LSXMB": "Communication", "LSXMK": "Communication", "DISCB": "Communication",

  // Internet Media
  "GOOGL": "Communication", "GOOG": "Communication", "META": "Communication",
  "SNAP": "Communication", "PINS": "Communication", "TWTR": "Communication",
  "MTCH": "Communication", "BMBL": "Communication", "IAC": "Communication",
  "ANGI": "Communication", "YELP": "Communication", "TRIP": "Communication",
  "ZG": "Communication", "Z": "Communication", "CHTR": "Communication",
  "LBRDK": "Communication", "LBRDA": "Communication", "FWONK": "Communication",

  // Advertising
  "OMC": "Communication", "IPG": "Communication", "WPP": "Communication",
  "PUBGY": "Communication", "TTD": "Communication", "MGNI": "Communication",
  "APPS": "Communication", "IAS": "Communication", "DV": "Communication",
  "CRTO": "Communication", "QNST": "Communication", "QUOT": "Communication",

  // ============================================
  // INDUSTRIAL - 100+ stocks
  // ============================================
  // Aerospace & Defense
  "BA": "Industrial", "LMT": "Industrial", "RTX": "Industrial", "NOC": "Industrial",
  "GD": "Industrial", "TXT": "Industrial", "HWM": "Industrial", "TDG": "Industrial",
  "HEI": "Industrial", "MOG-A": "Industrial", "ERJ": "Industrial", "SPR": "Industrial",
  "AXON": "Industrial", "LDOS": "Industrial", "SAIC": "Industrial", "CACI": "Industrial",
  "BAH": "Industrial", "PSN": "Industrial", "MRCY": "Industrial", "KTOS": "Industrial",
  "AVAV": "Industrial", "PLTR": "Industrial", "RGR": "Industrial", "SWBI": "Industrial",
  "ASGN": "Industrial", "HII": "Industrial", "LHX": "Industrial", "CW": "Industrial",

  // Industrial Conglomerates & Machinery
  "HON": "Industrial", "GE": "Industrial", "MMM": "Industrial", "ITW": "Industrial",
  "EMR": "Industrial", "ROK": "Industrial", "DOV": "Industrial", "PH": "Industrial",
  "IR": "Industrial", "XYL": "Industrial", "ROP": "Industrial", "AME": "Industrial",
  "IEX": "Industrial", "NDSN": "Industrial", "FTV": "Industrial", "GGG": "Industrial",
  "GNRC": "Industrial", "MIDD": "Industrial", "CFX": "Industrial", "RBC": "Industrial",
  "LECO": "Industrial", "GWW": "Industrial", "FAST": "Industrial", "SWK": "Industrial",
  "SNAP": "Industrial", "SNA": "Industrial", "TTC": "Industrial", "AGCO": "Industrial",

  // Construction & Engineering
  "CAT": "Industrial", "DE": "Industrial", "CNHI": "Industrial", "PCAR": "Industrial",
  "CMI": "Industrial", "OSK": "Industrial", "TEX": "Industrial", "MTW": "Industrial",
  "URI": "Industrial", "SITE": "Industrial", "BLDR": "Industrial", "MLM": "Industrial",
  "VMC": "Industrial", "EXP": "Industrial", "UFPI": "Industrial", "BLD": "Industrial",
  "MAS": "Industrial", "FBHS": "Industrial", "AWI": "Industrial", "TREX": "Industrial",
  "AZEK": "Industrial", "DOOR": "Industrial", "ROCK": "Industrial", "GVA": "Industrial",
  "ATRO": "Industrial", "ACM": "Industrial", "FLR": "Industrial", "J": "Industrial",
  "PWR": "Industrial", "EME": "Industrial", "MTZ": "Industrial", "DY": "Industrial",

  // Transportation - Rail & Trucking
  "UNP": "Industrial", "CSX": "Industrial", "NSC": "Industrial", "CP": "Industrial",
  "CNI": "Industrial", "KSU": "Industrial", "UPS": "Industrial", "FDX": "Industrial",
  "XPO": "Industrial", "JBHT": "Industrial", "ODFL": "Industrial", "WERN": "Industrial",
  "SAIA": "Industrial", "SNDR": "Industrial", "KNX": "Industrial", "ARCB": "Industrial",
  "LSTR": "Industrial", "HTLD": "Industrial", "MRTN": "Industrial", "HUBG": "Industrial",
  "EXPD": "Industrial", "CHRW": "Industrial", "ECHO": "Industrial", "GXO": "Industrial",
  "RXO": "Industrial", "FWRD": "Industrial", "MATX": "Industrial", "ZTO": "Industrial",

  // Airlines
  "DAL": "Industrial", "UAL": "Industrial", "AAL": "Industrial", "LUV": "Industrial",
  "ALK": "Industrial", "JBLU": "Industrial", "SAVE": "Industrial", "HA": "Industrial",
  "ALGT": "Industrial", "SKYW": "Industrial", "MESA": "Industrial", "RYAAY": "Industrial",

  // Other Industrial Services
  "WM": "Industrial", "RSG": "Industrial", "WCN": "Industrial", "CLH": "Industrial",
  "CTAS": "Industrial", "PAYX": "Industrial", "ADP": "Industrial", "RHI": "Industrial",
  "HSIC": "Industrial", "VRSK": "Industrial", "INFO": "Industrial", "DNB": "Industrial",
  "TRI": "Industrial", "G": "Industrial", "BR": "Industrial", "FIS": "Industrial",
  "ETN": "Industrial", "AOS": "Industrial", "LII": "Industrial", "WSO": "Industrial",

  // ============================================
  // ENERGY - 80+ stocks
  // ============================================
  // Oil & Gas - Integrated
  "XOM": "Energy", "CVX": "Energy", "COP": "Energy", "EOG": "Energy",
  "OXY": "Energy", "MPC": "Energy", "VLO": "Energy", "PSX": "Energy",
  "PBF": "Energy", "DK": "Energy", "HFC": "Energy", "PARR": "Energy",
  "DINO": "Energy", "CLMT": "Energy", "CVI": "Energy", "INT": "Energy",

  // Oil & Gas - Exploration & Production
  "FANG": "Energy", "DVN": "Energy", "APA": "Energy", "PXD": "Energy",
  "HES": "Energy", "MRO": "Energy", "CLR": "Energy", "MTDR": "Energy",
  "PR": "Energy", "CTRA": "Energy", "EQT": "Energy", "AR": "Energy",
  "RRC": "Energy", "SWN": "Energy", "CNX": "Energy", "CHK": "Energy",
  "MGY": "Energy", "SM": "Energy", "PDCE": "Energy", "CHRD": "Energy",
  "VTLE": "Energy", "CPE": "Energy", "ESTE": "Energy", "GPOR": "Energy",
  "TALO": "Energy", "CRK": "Energy", "REI": "Energy", "ROCC": "Energy",
  "SBOW": "Energy", "BATL": "Energy", "SD": "Energy", "WTI": "Energy",

  // Oilfield Services
  "SLB": "Energy", "HAL": "Energy", "BKR": "Energy", "NOV": "Energy",
  "FTI": "Energy", "CHX": "Energy", "HP": "Energy", "NBR": "Energy",
  "PTEN": "Energy", "WHD": "Energy", "LBRT": "Energy", "RES": "Energy",
  "OII": "Energy", "TDW": "Energy", "NE": "Energy", "RIG": "Energy",
  "VAL": "Energy", "DO": "Energy", "HLX": "Energy", "AROC": "Energy",
  "DTM": "Energy", "WTTR": "Energy", "NINE": "Energy", "ACDC": "Energy",

  // Midstream
  "KMI": "Energy", "WMB": "Energy", "OKE": "Energy", "EPD": "Energy",
  "ET": "Energy", "MPLX": "Energy", "PAA": "Energy", "TRGP": "Energy",
  "LNG": "Energy", "ENLC": "Energy", "DCP": "Energy", "CEQP": "Energy",
  "HESM": "Energy", "WES": "Energy", "NS": "Energy", "AM": "Energy",

  // ============================================
  // CONSUMER STAPLES - 70+ stocks
  // ============================================
  // Beverages
  "KO": "Consumer Staples", "PEP": "Consumer Staples", "MNST": "Consumer Staples",
  "KDP": "Consumer Staples", "STZ": "Consumer Staples", "BF-B": "Consumer Staples",
  "BF-A": "Consumer Staples", "TAP": "Consumer Staples", "SAM": "Consumer Staples",
  "FIZZ": "Consumer Staples", "CELH": "Consumer Staples", "NBEV": "Consumer Staples",
  "COKE": "Consumer Staples", "DEO": "Consumer Staples", "BUD": "Consumer Staples",

  // Food Products
  "MDLZ": "Consumer Staples", "GIS": "Consumer Staples", "K": "Consumer Staples",
  "KHC": "Consumer Staples", "CPB": "Consumer Staples", "SJM": "Consumer Staples",
  "CAG": "Consumer Staples", "HSY": "Consumer Staples", "MKC": "Consumer Staples",
  "HRL": "Consumer Staples", "TSN": "Consumer Staples", "PPC": "Consumer Staples",
  "BRFS": "Consumer Staples", "INGR": "Consumer Staples", "LANC": "Consumer Staples",
  "THS": "Consumer Staples", "BGS": "Consumer Staples", "LNDC": "Consumer Staples",
  "SFM": "Consumer Staples", "POST": "Consumer Staples", "SMPL": "Consumer Staples",
  "BYND": "Consumer Staples", "TTCF": "Consumer Staples", "NOMD": "Consumer Staples",

  // Household & Personal Products
  "PG": "Consumer Staples", "CL": "Consumer Staples", "KMB": "Consumer Staples",
  "CHD": "Consumer Staples", "CLX": "Consumer Staples", "SPB": "Consumer Staples",
  "COTY": "Consumer Staples", "ELF": "Consumer Staples", "EL": "Consumer Staples",
  "NWL": "Consumer Staples", "ENR": "Consumer Staples", "HLF": "Consumer Staples",
  "HELE": "Consumer Staples", "IPAR": "Consumer Staples", "REV": "Consumer Staples",
  "NU": "Consumer Staples", "SKIN": "Consumer Staples", "HNST": "Consumer Staples",

  // Tobacco
  "PM": "Consumer Staples", "MO": "Consumer Staples", "BTI": "Consumer Staples",
  "TPB": "Consumer Staples", "VGR": "Consumer Staples", "IMBBY": "Consumer Staples",

  // Food & Drug Retail
  "WMT": "Consumer Staples", "COST": "Consumer Staples", "KR": "Consumer Staples",
  "WBA": "Consumer Staples", "SYY": "Consumer Staples", "USFD": "Consumer Staples",
  "ACI": "Consumer Staples", "GO": "Consumer Staples", "UNFI": "Consumer Staples",
  "CHEF": "Consumer Staples", "PFGC": "Consumer Staples", "SPTN": "Consumer Staples",
  "SFM": "Consumer Staples", "IMKTA": "Consumer Staples", "VLGEA": "Consumer Staples",

  // ============================================
  // UTILITIES - 50+ stocks
  // ============================================
  // Electric Utilities
  "NEE": "Utilities", "DUK": "Utilities", "SO": "Utilities", "D": "Utilities",
  "AEP": "Utilities", "SRE": "Utilities", "XEL": "Utilities", "EXC": "Utilities",
  "WEC": "Utilities", "ED": "Utilities", "ES": "Utilities", "PPL": "Utilities",
  "EIX": "Utilities", "DTE": "Utilities", "FE": "Utilities", "ETR": "Utilities",
  "AEE": "Utilities", "CMS": "Utilities", "CNP": "Utilities", "EVRG": "Utilities",
  "ATO": "Utilities", "PNW": "Utilities", "NI": "Utilities", "OGE": "Utilities",
  "POR": "Utilities", "NWE": "Utilities", "AVA": "Utilities", "BKH": "Utilities",
  "IDA": "Utilities", "OTTR": "Utilities", "ALE": "Utilities", "PNM": "Utilities",
  "HE": "Utilities", "NWN": "Utilities", "CPK": "Utilities", "MGEE": "Utilities",

  // Clean Energy
  "CEG": "Utilities", "VST": "Utilities", "NRG": "Utilities", "CWEN": "Utilities",
  "AES": "Utilities", "ENPH": "Utilities", "SEDG": "Utilities", "RUN": "Utilities",
  "NOVA": "Utilities", "FSLR": "Utilities", "CSIQ": "Utilities", "JKS": "Utilities",
  "SPWR": "Utilities", "ARRY": "Utilities", "MAXN": "Utilities", "BE": "Utilities",
  "PLUG": "Utilities", "BLDP": "Utilities", "FCEL": "Utilities", "HYLN": "Utilities",
  "CLNE": "Utilities", "AMRC": "Utilities", "STEM": "Utilities", "ENVX": "Utilities",

  // Water & Multi-Utilities
  "AWK": "Utilities", "AWR": "Utilities", "WTRG": "Utilities", "CWT": "Utilities",
  "SJW": "Utilities", "YORW": "Utilities", "CWCO": "Utilities", "PEG": "Utilities",
  "NJR": "Utilities", "NFG": "Utilities", "OGS": "Utilities", "SWX": "Utilities",
  "UGI": "Utilities", "SR": "Utilities",

  // ============================================
  // REAL ESTATE - 60+ stocks
  // ============================================
  // Data Centers & Telecom
  "PLD": "Real Estate", "AMT": "Real Estate", "EQIX": "Real Estate", "CCI": "Real Estate",
  "DLR": "Real Estate", "SBAC": "Real Estate", "UNIT": "Real Estate", "QTS": "Real Estate",
  "CONE": "Real Estate", "CORZ": "Real Estate",

  // Industrial REITs
  "STAG": "Real Estate", "REXR": "Real Estate", "FR": "Real Estate", "EGP": "Real Estate",
  "TRNO": "Real Estate", "IIPR": "Real Estate", "GTY": "Real Estate", "PLYM": "Real Estate",

  // Residential REITs
  "AVB": "Real Estate", "EQR": "Real Estate", "ESS": "Real Estate", "MAA": "Real Estate",
  "UDR": "Real Estate", "CPT": "Real Estate", "AIV": "Real Estate", "ELME": "Real Estate",
  "IRT": "Real Estate", "NNN": "Real Estate", "NXRT": "Real Estate", "ELS": "Real Estate",
  "SUI": "Real Estate", "APLE": "Real Estate", "RHP": "Real Estate", "INVH": "Real Estate",
  "AMH": "Real Estate", "TREH": "Real Estate",

  // Retail REITs
  "SPG": "Real Estate", "O": "Real Estate", "VICI": "Real Estate", "REG": "Real Estate",
  "KIM": "Real Estate", "BRX": "Real Estate", "FRT": "Real Estate", "KRG": "Real Estate",
  "AKR": "Real Estate", "SITC": "Real Estate", "WRI": "Real Estate", "PECO": "Real Estate",
  "ADC": "Real Estate", "EPRT": "Real Estate", "STOR": "Real Estate", "SRC": "Real Estate",
  "NNN": "Real Estate", "NTST": "Real Estate", "FCPT": "Real Estate", "GOOD": "Real Estate",

  // Office & Healthcare REITs
  "WELL": "Real Estate", "VTR": "Real Estate", "OHI": "Real Estate", "HR": "Real Estate",
  "DOC": "Real Estate", "SBRA": "Real Estate", "LTC": "Real Estate", "NHI": "Real Estate",
  "CTRE": "Real Estate", "GMRE": "Real Estate", "BXP": "Real Estate", "VNO": "Real Estate",
  "SLG": "Real Estate", "ARE": "Real Estate", "HIW": "Real Estate", "CUZ": "Real Estate",
  "PDM": "Real Estate", "DEI": "Real Estate", "ESRT": "Real Estate", "OFC": "Real Estate",
  "KRC": "Real Estate", "JBGS": "Real Estate", "DEA": "Real Estate", "CLI": "Real Estate",

  // ============================================
  // MATERIALS - 60+ stocks
  // ============================================
  // Chemicals
  "LIN": "Materials", "APD": "Materials", "SHW": "Materials", "ECL": "Materials",
  "DD": "Materials", "DOW": "Materials", "PPG": "Materials", "LYB": "Materials",
  "NEM": "Materials", "FCX": "Materials", "CTVA": "Materials", "ALB": "Materials",
  "CF": "Materials", "NTR": "Materials", "MOS": "Materials", "FMC": "Materials",
  "IFF": "Materials", "EMN": "Materials", "CE": "Materials", "RPM": "Materials",
  "AVNT": "Materials", "ASH": "Materials", "ESI": "Materials", "HUN": "Materials",
  "OLN": "Materials", "WLK": "Materials", "CC": "Materials", "KRO": "Materials",
  "TROX": "Materials", "VNTR": "Materials", "MTX": "Materials", "NEU": "Materials",
  "CBT": "Materials", "HWKN": "Materials", "IOSP": "Materials", "KWR": "Materials",

  // Metals & Mining
  "NUE": "Materials", "STLD": "Materials", "CLF": "Materials", "X": "Materials",
  "AA": "Materials", "ATI": "Materials", "CMC": "Materials", "RS": "Materials",
  "ZEUS": "Materials", "CENX": "Materials", "KALU": "Materials", "HCC": "Materials",
  "AMR": "Materials", "ARCH": "Materials", "BTU": "Materials", "CEIX": "Materials",
  "ARLP": "Materials", "CONSOL": "Materials", "METC": "Materials", "NCR": "Materials",
  "SCCO": "Materials", "TECK": "Materials", "RIO": "Materials", "BHP": "Materials",
  "VALE": "Materials", "MP": "Materials", "LAC": "Materials", "LTHM": "Materials",
  "PLL": "Materials", "SQM": "Materials", "UUUU": "Materials", "CCJ": "Materials",
  "UEC": "Materials", "DNN": "Materials",

  // Construction Materials
  "VMC": "Materials", "MLM": "Materials", "EXP": "Materials", "CX": "Materials",
  "ITE": "Materials", "USLM": "Materials", "CITE": "Materials", "SUM": "Materials",

  // Paper & Packaging
  "IP": "Materials", "PKG": "Materials", "SEE": "Materials", "BERY": "Materials",
  "GPK": "Materials", "SON": "Materials", "OI": "Materials", "SLGN": "Materials",
  "CCK": "Materials", "BALL": "Materials", "ATR": "Materials", "AVY": "Materials",
  "BMS": "Materials", "CLW": "Materials", "MERC": "Materials", "KBH": "Materials",
};

function getSectorForSymbol(symbol: string): string {
  return SECTOR_MAP[symbol] || "Other";
}

export async function getMostActiveStocks(count: number = 10): Promise<TrendingStock[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await yahooFinance.screener({
      scrIds: "most_actives",
      count: count,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result.quotes || []).slice(0, count).map((quote: any) => ({
      symbol: quote.symbol,
      name: quote.shortName || quote.longName || quote.symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      volume: quote.regularMarketVolume || 0,
      avgVolume: quote.averageDailyVolume3Month || quote.averageDailyVolume10Day || 0,
      marketCap: quote.marketCap || 0,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0,
      fiftyDayAverage: quote.fiftyDayAverage || 0,
      twoHundredDayAverage: quote.twoHundredDayAverage || 0,
      trailingPE: quote.trailingPE || null,
      forwardPE: quote.forwardPE || null,
      eps: quote.epsTrailingTwelveMonths || null,
      dividendYield: quote.dividendYield || null,
      beta: quote.beta || null,
      exchange: quote.exchange || '',
      quoteType: quote.quoteType || 'EQUITY',
    }));
  } catch (error) {
    console.error("Error fetching most active stocks:", error);
    throw error;
  }
}

/**
 * Get all symbols for a given sector
 */
export function getSymbolsForSector(sectorId: string): string[] {
  // Map sector ID back to sector name
  const sectorIdToName: Record<string, string> = {
    "technology": "Technology",
    "healthcare": "Healthcare",
    "financial": "Financial",
    "consumer": "Consumer",
    "consumer-staples": "Consumer Staples",
    "industrial": "Industrial",
    "energy": "Energy",
    "utilities": "Utilities",
    "real-estate": "Real Estate",
    "materials": "Materials",
    "communication": "Communication",
  };

  const sectorName = sectorIdToName[sectorId];
  if (!sectorName) return [];

  return Object.entries(SECTOR_MAP)
    .filter(([, sector]) => sector === sectorName)
    .map(([symbol]) => symbol);
}

/**
 * Get all sectors with their stock counts
 */
export function getSectorCounts(): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const sector of Object.values(SECTOR_MAP)) {
    const sectorId = SECTOR_NAME_TO_ID[sector] || "other";
    counts[sectorId] = (counts[sectorId] || 0) + 1;
  }

  return counts;
}

export interface SectorStock extends HeatmapStock {
  volume: number;
  avgVolume: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  trailingPE: number | null;
}

/**
 * Fetch all stocks for a specific sector
 * Uses comprehensive hardcoded list with 700+ stocks across all sectors
 */
export async function getSectorStocks(sectorId: string): Promise<SectorStock[]> {
  const symbols = getSymbolsForSector(sectorId);
  if (symbols.length === 0) {
    console.error(`No symbols found for sector: ${sectorId}`);
    return [];
  }

  console.log(`Fetching ${symbols.length} stocks for sector ${sectorId}...`);

  const batchSize = 50;
  const allQuotes: SectorStock[] = [];

  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    try {
      const quotes = await yahooFinance.quote(batch);
      const quotesArray = Array.isArray(quotes) ? quotes : [quotes];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedQuotes = quotesArray.map((quote: any) => ({
        symbol: quote.symbol,
        name: quote.shortName || quote.longName || quote.symbol,
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        marketCap: quote.marketCap || 0,
        sector: getSectorForSymbol(quote.symbol),
        volume: quote.regularMarketVolume || 0,
        avgVolume: quote.averageDailyVolume3Month || 0,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0,
        trailingPE: quote.trailingPE || null,
      })).filter((stock: SectorStock) => stock.price > 0);

      allQuotes.push(...mappedQuotes);
    } catch (error) {
      console.error(`Error fetching batch for sector ${sectorId}:`, error);
      // Continue with other batches even if one fails
    }
  }

  console.log(`Successfully fetched ${allQuotes.length} stocks for sector ${sectorId}`);
  return allQuotes.sort((a, b) => b.marketCap - a.marketCap);
}

export interface SectorPerformance {
  sectorId: string;
  sectorInfo: SectorInfo;
  stockCount: number;
  avgChange: number;
  totalMarketCap: number;
  topGainer: { symbol: string; changePercent: number } | null;
  topLoser: { symbol: string; changePercent: number } | null;
  advancers: number;
  decliners: number;
}

/**
 * Get performance data for all sectors
 */
export async function getAllSectorsPerformance(): Promise<SectorPerformance[]> {
  try {
    // Get all unique symbols from SECTOR_MAP
    const allSymbols = [...new Set(Object.keys(SECTOR_MAP))];

    // Fetch all quotes
    const batchSize = 50;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allQuotes: any[] = [];

    for (let i = 0; i < allSymbols.length; i += batchSize) {
      const batch = allSymbols.slice(i, i + batchSize);
      const quotes = await yahooFinance.quote(batch);
      const quotesArray = Array.isArray(quotes) ? quotes : [quotes];
      allQuotes.push(...quotesArray);
    }

    // Group by sector and calculate performance
    const sectorData: Record<string, {
      stocks: { symbol: string; changePercent: number; marketCap: number }[];
    }> = {};

    for (const quote of allQuotes) {
      if (!quote || !quote.regularMarketPrice) continue;

      const sectorName = SECTOR_MAP[quote.symbol] || "Other";
      const sectorId = SECTOR_NAME_TO_ID[sectorName] || "other";

      if (!sectorData[sectorId]) {
        sectorData[sectorId] = { stocks: [] };
      }

      sectorData[sectorId].stocks.push({
        symbol: quote.symbol,
        changePercent: quote.regularMarketChangePercent || 0,
        marketCap: quote.marketCap || 0,
      });
    }

    // Calculate performance metrics for each sector
    const results: SectorPerformance[] = [];

    for (const sector of SECTORS) {
      const data = sectorData[sector.id];
      if (!data || data.stocks.length === 0) continue;

      const stocks = data.stocks;
      const avgChange = stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length;
      const totalMarketCap = stocks.reduce((sum, s) => sum + s.marketCap, 0);
      const advancers = stocks.filter(s => s.changePercent > 0).length;
      const decliners = stocks.filter(s => s.changePercent < 0).length;

      // Find top gainer and loser
      const sorted = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
      const topGainer = sorted[0] ? { symbol: sorted[0].symbol, changePercent: sorted[0].changePercent } : null;
      const topLoser = sorted[sorted.length - 1] ? { symbol: sorted[sorted.length - 1].symbol, changePercent: sorted[sorted.length - 1].changePercent } : null;

      results.push({
        sectorId: sector.id,
        sectorInfo: sector,
        stockCount: stocks.length,
        avgChange,
        totalMarketCap,
        topGainer,
        topLoser,
        advancers,
        decliners,
      });
    }

    // Sort by average change (best performing first)
    return results.sort((a, b) => b.avgChange - a.avgChange);
  } catch (error) {
    console.error("Error fetching sector performance:", error);
    throw error;
  }
}

export interface PaginatedSectorStocksResult {
  stocks: SectorStock[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Fetch paginated stocks for a specific sector (for lazy loading)
 */
export async function getSectorStocksPaginated(
  sectorId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedSectorStocksResult> {
  const symbols = getSymbolsForSector(sectorId);
  if (symbols.length === 0) {
    console.error(`No symbols found for sector: ${sectorId}`);
    return {
      stocks: [],
      page,
      limit,
      total: 0,
      totalPages: 0,
      hasMore: false,
    };
  }

  const total = symbols.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);

  // Get symbols for this page
  const pageSymbols = symbols.slice(startIndex, endIndex);

  if (pageSymbols.length === 0) {
    return {
      stocks: [],
      page,
      limit,
      total,
      totalPages,
      hasMore: false,
    };
  }

  console.log(`Fetching page ${page} (${pageSymbols.length} stocks) for sector ${sectorId}...`);

  try {
    const quotes = await yahooFinance.quote(pageSymbols);
    const quotesArray = Array.isArray(quotes) ? quotes : [quotes];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stocks = quotesArray.map((quote: any) => ({
      symbol: quote.symbol,
      name: quote.shortName || quote.longName || quote.symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      marketCap: quote.marketCap || 0,
      sector: getSectorForSymbol(quote.symbol),
      volume: quote.regularMarketVolume || 0,
      avgVolume: quote.averageDailyVolume3Month || 0,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0,
      trailingPE: quote.trailingPE || null,
    })).filter((stock: SectorStock) => stock.price > 0)
       .sort((a: SectorStock, b: SectorStock) => b.marketCap - a.marketCap);

    return {
      stocks,
      page,
      limit,
      total,
      totalPages,
      hasMore: endIndex < total,
    };
  } catch (error) {
    console.error(`Error fetching page ${page} for sector ${sectorId}:`, error);
    return {
      stocks: [],
      page,
      limit,
      total,
      totalPages,
      hasMore: endIndex < total,
    };
  }
}
