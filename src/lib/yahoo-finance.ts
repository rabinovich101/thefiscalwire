import YahooFinance from "yahoo-finance2";

// Create singleton instance
const yahooFinance = new YahooFinance();

// ============================================================================
// Expected Move Types (for earnings)
// ============================================================================

export interface ExpectedMoveData {
  symbol: string;
  stockPrice: number;
  expectedMove: number;
  expectedMovePercent: number;
  atmStrike: number;
  atmCallPrice: number;
  atmPutPrice: number;
  impliedVolatility: number | null;
  expirationDate: string;
}

interface YahooOption {
  strike: number;
  lastPrice?: number;
  bid?: number;
  ask?: number;
  impliedVolatility?: number;
  inTheMoney?: boolean;
}

interface YahooOptionsChain {
  underlyingSymbol: string;
  expirationDates: Date[];
  strikes: number[];
  quote: {
    regularMarketPrice?: number;
  };
  options: Array<{
    expirationDate: Date;
    calls: YahooOption[];
    puts: YahooOption[];
  }>;
}

// ============================================================================
// Yahoo Finance API Types
// ============================================================================

/** Yahoo Finance quote data structure */
interface YahooQuote {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketVolume?: number;
  averageDailyVolume3Month?: number;
  averageDailyVolume10Day?: number;
  marketCap?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  fiftyDayAverage?: number;
  twoHundredDayAverage?: number;
  trailingPE?: number;
  forwardPE?: number;
  epsTrailingTwelveMonths?: number;
  dividendYield?: number;
  beta?: number;
  exchange?: string;
  quoteType?: string;
}

/** Yahoo Finance screener result */
interface YahooScreenerResult {
  quotes?: YahooQuote[];
}

/** Yahoo Finance chart data point */
interface YahooChartQuote {
  date: Date;
  close: number | null;
  volume?: number;
}

/** Yahoo Finance chart result */
interface YahooChartResult {
  quotes?: YahooChartQuote[];
}

/** Yahoo Finance trending result */
interface YahooTrendingResult {
  quotes?: Array<{ symbol: string }>;
}

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

    // Handle both single result and array, cast to our interface
    const quotesArray = (Array.isArray(results) ? results : [results]) as unknown as YahooQuote[];

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
    const result = await yahooFinance.screener({
      scrIds: "day_gainers",
      count: 5,
    }) as YahooScreenerResult;

    return (result.quotes || []).slice(0, 5).map((quote: YahooQuote) => ({
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
    const result = await yahooFinance.screener({
      scrIds: "day_losers",
      count: 5,
    }) as YahooScreenerResult;

    return (result.quotes || []).slice(0, 5).map((quote: YahooQuote) => ({
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

    const result = await yahooFinance.chart(yahooSymbol, {
      period1: getStartDate(period),
      period2: new Date(),
      interval: period === "1d" ? "5m" : period === "5d" ? "15m" : "1d",
    }) as YahooChartResult;

    if (!result.quotes || result.quotes.length === 0) {
      return [];
    }

    return result.quotes
      .filter((q: YahooChartQuote) => q.close !== null && q.close !== undefined)
      .map((quote: YahooChartQuote) => ({
        time: formatDate(new Date(quote.date), period),
        value: quote.close as number,
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
    const trendingResult = await yahooFinance.trendingSymbols("US", { count: count }) as YahooTrendingResult;

    const symbols = trendingResult.quotes?.map((q: { symbol: string }) => q.symbol) || [];

    if (symbols.length === 0) {
      return [];
    }

    // Get detailed quotes for each symbol
    const quotes = await yahooFinance.quote(symbols);
    const quotesArray = (Array.isArray(quotes) ? quotes : [quotes]) as unknown as YahooQuote[];

    return quotesArray.map((quote: YahooQuote) => ({
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
      const quotesArray = (Array.isArray(quotes) ? quotes : [quotes]) as unknown as YahooQuote[];

      const mappedQuotes = quotesArray.map((quote: YahooQuote) => ({
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
  nasdaqApiValue: string; // NASDAQ API sector filter value
}

export const SECTORS: SectorInfo[] = [
  {
    id: "technology",
    name: "Technology",
    description: "Software, hardware, semiconductors, and IT services",
    color: "blue",
    gradient: "from-blue-500/20 via-blue-600/10 to-cyan-500/20",
    icon: "Cpu",
    nasdaqApiValue: "technology",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Pharmaceuticals, biotechnology, and medical devices",
    color: "emerald",
    gradient: "from-emerald-500/20 via-emerald-600/10 to-teal-500/20",
    icon: "Heart",
    nasdaqApiValue: "health_care",
  },
  {
    id: "financial",
    name: "Financial",
    description: "Banks, insurance, asset management, and fintech",
    color: "amber",
    gradient: "from-amber-500/20 via-amber-600/10 to-yellow-500/20",
    icon: "Landmark",
    nasdaqApiValue: "finance",
  },
  {
    id: "consumer",
    name: "Consumer Discretionary",
    description: "Retail, automotive, entertainment, and luxury goods",
    color: "pink",
    gradient: "from-pink-500/20 via-pink-600/10 to-rose-500/20",
    icon: "ShoppingBag",
    nasdaqApiValue: "consumer_discretionary",
  },
  {
    id: "consumer-staples",
    name: "Consumer Staples",
    description: "Food, beverages, household products, and tobacco",
    color: "orange",
    gradient: "from-orange-500/20 via-orange-600/10 to-amber-500/20",
    icon: "Coffee",
    nasdaqApiValue: "consumer_staples",
  },
  {
    id: "industrial",
    name: "Industrial",
    description: "Aerospace, defense, machinery, and transportation",
    color: "slate",
    gradient: "from-slate-500/20 via-slate-600/10 to-zinc-500/20",
    icon: "Factory",
    nasdaqApiValue: "industrials",
  },
  {
    id: "energy",
    name: "Energy",
    description: "Oil, gas, renewable energy, and utilities",
    color: "red",
    gradient: "from-red-500/20 via-red-600/10 to-orange-500/20",
    icon: "Flame",
    nasdaqApiValue: "energy",
  },
  {
    id: "utilities",
    name: "Utilities",
    description: "Electric, gas, and water utilities",
    color: "yellow",
    gradient: "from-yellow-500/20 via-yellow-600/10 to-lime-500/20",
    icon: "Zap",
    nasdaqApiValue: "utilities",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    description: "REITs, property management, and development",
    color: "violet",
    gradient: "from-violet-500/20 via-violet-600/10 to-purple-500/20",
    icon: "Building2",
    nasdaqApiValue: "real_estate",
  },
  {
    id: "materials",
    name: "Materials",
    description: "Chemicals, metals, mining, and construction materials",
    color: "stone",
    gradient: "from-stone-500/20 via-stone-600/10 to-neutral-500/20",
    icon: "Gem",
    nasdaqApiValue: "basic_materials",
  },
  {
    id: "communication",
    name: "Communication Services",
    description: "Telecom, media, entertainment, and social platforms",
    color: "indigo",
    gradient: "from-indigo-500/20 via-indigo-600/10 to-blue-500/20",
    icon: "Radio",
    nasdaqApiValue: "telecommunications",
  },
];

// =============================================================================
// NASDAQ API Integration - 7,000+ stocks with sector data
// =============================================================================

interface NasdaqApiResponse {
  data: {
    table: {
      rows: NasdaqStockRow[];
    };
    totalrecords: number;
  };
}

interface NasdaqStockRow {
  symbol: string;
  name: string;
  lastsale: string;
  netchange: string;
  pctchange: string;
  marketCap: string;
  url: string;
}

/**
 * Fetch stocks from NASDAQ API for a specific sector
 * Supports pagination for large datasets
 */
export async function fetchNasdaqSectorStocks(
  sector: string,
  limit: number = 100,
  offset: number = 0
): Promise<{ stocks: NasdaqStockRow[]; total: number }> {
  try {
    const url = `https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=${limit}&offset=${offset}&sector=${sector}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`NASDAQ API error: ${response.status}`);
    }

    const data: NasdaqApiResponse = await response.json();
    return {
      stocks: data.data?.table?.rows || [],
      total: data.data?.totalrecords || 0,
    };
  } catch (error) {
    console.error(`Error fetching NASDAQ sector ${sector}:`, error);
    return { stocks: [], total: 0 };
  }
}

/**
 * Fetch all stocks from a sector (handles pagination automatically)
 * Returns all stock symbols for a given sector
 */
export async function fetchAllNasdaqSectorSymbols(sectorApiValue: string): Promise<string[]> {
  const symbols: string[] = [];
  const batchSize = 200;
  let offset = 0;
  let total = 0;

  do {
    const { stocks, total: totalRecords } = await fetchNasdaqSectorStocks(sectorApiValue, batchSize, offset);
    total = totalRecords;

    for (const stock of stocks) {
      symbols.push(stock.symbol);
    }

    offset += batchSize;
  } while (offset < total);

  return symbols;
}

/**
 * Get sector stock counts from NASDAQ API
 */
export async function getNasdaqSectorCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};

  for (const sector of SECTORS) {
    try {
      const { total } = await fetchNasdaqSectorStocks(sector.nasdaqApiValue, 1, 0);
      counts[sector.id] = total;
    } catch (error) {
      console.error(`Error getting count for sector ${sector.id}:`, error);
      counts[sector.id] = 0;
    }
  }

  return counts;
}

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

// Comprehensive sector mapping - deduped for heatmap use (NASDAQ API is primary source)
const SECTOR_MAP: Record<string, string> = {
  // Technology
  "AAPL": "Technology", "ABNB": "Technology", "ACLS": "Technology", "ACN": "Technology",
  "ADBE": "Technology", "ADI": "Technology", "ADSK": "Technology", "AFRM": "Technology",
  "AI": "Technology", "ALGM": "Technology", "AMAT": "Technology", "AMBA": "Technology",
  "AMD": "Technology", "AMPL": "Technology", "ANET": "Technology", "ANGI": "Technology",
  "ANSS": "Technology", "AOSL": "Technology", "APP": "Technology", "APPF": "Technology",
  "ARM": "Technology", "ASAN": "Technology", "ASML": "Technology", "AVGO": "Technology",
  "BABA": "Technology", "BAH": "Technology", "BIDU": "Technology", "BILI": "Technology",
  "BILL": "Technology", "BKNG": "Technology", "BMBL": "Technology", "BRZE": "Technology",
  "CACI": "Technology", "CDNS": "Technology", "CDW": "Technology", "CEVA": "Technology",
  "CFLT": "Technology", "COHR": "Technology", "COIN": "Technology", "CRM": "Technology",
  "CRSR": "Technology", "CRUS": "Technology", "CRWD": "Technology", "CSCO": "Technology",
  "CTSH": "Technology", "DASH": "Technology", "DDOG": "Technology", "DELL": "Technology",
  "DIOD": "Technology", "DOCN": "Technology", "DOCU": "Technology", "DT": "Technology",
  "DUOL": "Technology", "EBAY": "Technology", "ENTG": "Technology", "EPAM": "Technology",
  "ESTC": "Technology", "ETSY": "Technology", "EXLS": "Technology", "EXPE": "Technology",
  "FFIV": "Technology", "FITB": "Technology", "FORM": "Technology", "FROG": "Technology",
  "FRSH": "Technology", "FTNT": "Technology", "GFS": "Technology", "GLOB": "Technology",
  "GOOG": "Technology", "GOOGL": "Technology", "GPRO": "Technology", "GRMN": "Technology",
  "GRUB": "Technology", "GTLB": "Technology", "HCP": "Technology", "HEAR": "Technology",
  "HOOD": "Technology", "HPE": "Technology", "HPQ": "Technology", "HUBS": "Technology",
  "IAC": "Technology", "IBM": "Technology", "INFY": "Technology", "INTC": "Technology",
  "INTU": "Technology", "IT": "Technology", "JAMF": "Technology", "JD": "Technology",
  "JNPR": "Technology", "KEYS": "Technology", "KLAC": "Technology", "KOSS": "Technology",
  "LC": "Technology", "LDOS": "Technology", "LOGI": "Technology", "LRCX": "Technology",
  "LYFT": "Technology", "MCHP": "Technology", "MDB": "Technology", "MELI": "Technology",
  "META": "Technology", "MKSI": "Technology", "MNDY": "Technology", "MPWR": "Technology",
  "MRVL": "Technology", "MSFT": "Technology", "MTCH": "Technology", "MU": "Technology",
  "NCNO": "Technology", "NET": "Technology", "NOW": "Technology", "NSIT": "Technology",
  "NTAP": "Technology", "NTES": "Technology", "NU": "Technology", "NVDA": "Technology",
  "NVMI": "Technology", "NXPI": "Technology", "OKTA": "Technology", "ON": "Technology",
  "ORCL": "Technology", "PANW": "Technology", "PATH": "Technology", "PDD": "Technology",
  "PINS": "Technology", "PLTR": "Technology", "POWI": "Technology", "PSTG": "Technology",
  "QCOM": "Technology", "QRVO": "Technology", "RBLX": "Technology", "RMBS": "Technology",
  "SAIC": "Technology", "SAMSARA": "Technology", "SAP": "Technology", "SCSC": "Technology",
  "SE": "Technology", "SGMO": "Technology", "SHOP": "Technology", "SITM": "Technology",
  "SLAB": "Technology", "SMCI": "Technology", "SMTC": "Technology", "SNAP": "Technology",
  "SNOW": "Technology", "SNPS": "Technology", "SOFI": "Technology", "SONO": "Technology",
  "SPLK": "Technology", "SPOT": "Technology", "SQ": "Technology", "STX": "Technology",
  "SUMO": "Technology", "SWKS": "Technology", "SYNA": "Technology", "TCOM": "Technology",
  "TEAM": "Technology", "TER": "Technology", "TME": "Technology", "TRIP": "Technology",
  "TSLA": "Technology", "TSM": "Technology", "TWLO": "Technology", "TXN": "Technology",
  "U": "Technology", "UBER": "Technology", "UPST": "Technology", "VEEV": "Technology",
  "VIAV": "Technology", "WDAY": "Technology", "WDC": "Technology", "WIT": "Technology",
  "WOLF": "Technology", "YELP": "Technology", "ZBRA": "Technology", "ZI": "Technology",
  "ZM": "Technology", "ZS": "Technology",

  // Healthcare
  "ABBV": "Healthcare", "ABT": "Healthcare", "ACHC": "Healthcare", "ALGN": "Healthcare",
  "ALNY": "Healthcare", "AMED": "Healthcare", "AMGN": "Healthcare", "AMN": "Healthcare",
  "AMWL": "Healthcare", "APLS": "Healthcare", "ARGX": "Healthcare", "ARWR": "Healthcare",
  "ATRC": "Healthcare", "AXNX": "Healthcare", "AZN": "Healthcare", "BAX": "Healthcare",
  "BDX": "Healthcare", "BIIB": "Healthcare", "BIO": "Healthcare", "BMRN": "Healthcare",
  "BMY": "Healthcare", "BSX": "Healthcare", "CCRN": "Healthcare", "CHE": "Healthcare",
  "CI": "Healthcare", "CLVR": "Healthcare", "CNC": "Healthcare", "COO": "Healthcare",
  "CRNX": "Healthcare", "CVS": "Healthcare", "CYTK": "Healthcare", "DAWN": "Healthcare",
  "DHR": "Healthcare", "DOCS": "Healthcare", "DVA": "Healthcare", "DXCM": "Healthcare",
  "ELV": "Healthcare", "ENSG": "Healthcare", "EW": "Healthcare", "EXAS": "Healthcare",
  "EXEL": "Healthcare", "FOLD": "Healthcare", "GDRX": "Healthcare", "GEHC": "Healthcare",
  "GH": "Healthcare", "GILD": "Healthcare", "GMED": "Healthcare", "GSK": "Healthcare",
  "HCA": "Healthcare", "HIMS": "Healthcare", "HOLX": "Healthcare", "HUM": "Healthcare",
  "HZNP": "Healthcare", "IDXX": "Healthcare", "ILMN": "Healthcare", "IMVT": "Healthcare",
  "INCY": "Healthcare", "INSP": "Healthcare", "IONS": "Healthcare", "IQV": "Healthcare",
  "IRTC": "Healthcare", "ISRG": "Healthcare", "JNJ": "Healthcare", "KRTX": "Healthcare",
  "KRYS": "Healthcare", "LHCG": "Healthcare", "LIVN": "Healthcare", "LLY": "Healthcare",
  "MDT": "Healthcare", "MOH": "Healthcare", "MRK": "Healthcare", "MRNA": "Healthcare",
  "MTD": "Healthcare", "NBIX": "Healthcare", "NHC": "Healthcare", "NTRA": "Healthcare",
  "NVCR": "Healthcare", "NVO": "Healthcare", "NVS": "Healthcare", "NVTA": "Healthcare",
  "ONEM": "Healthcare", "OPCH": "Healthcare", "OSCR": "Healthcare", "PACB": "Healthcare",
  "PCVX": "Healthcare", "PEN": "Healthcare", "PFE": "Healthcare", "PHR": "Healthcare",
  "PNTG": "Healthcare", "PODD": "Healthcare", "PRCT": "Healthcare", "PRTA": "Healthcare",
  "PTCT": "Healthcare", "QGEN": "Healthcare", "RARE": "Healthcare", "RCKT": "Healthcare",
  "RCUS": "Healthcare", "REGN": "Healthcare", "RVMD": "Healthcare", "RVTY": "Healthcare",
  "RYTM": "Healthcare", "SGEN": "Healthcare", "SGRY": "Healthcare", "SHAK": "Healthcare",
  "SHC": "Healthcare", "SNY": "Healthcare", "SRPT": "Healthcare", "SWAV": "Healthcare",
  "SYK": "Healthcare", "TAK": "Healthcare", "TDOC": "Healthcare", "TECH": "Healthcare",
  "TEVA": "Healthcare", "TFX": "Healthcare", "THC": "Healthcare", "TMO": "Healthcare",
  "TWST": "Healthcare", "UHS": "Healthcare", "UNH": "Healthcare", "USPH": "Healthcare",
  "UTHR": "Healthcare", "VERA": "Healthcare", "VKTX": "Healthcare", "VRTX": "Healthcare",
  "VTRS": "Healthcare", "WAT": "Healthcare", "XENE": "Healthcare", "ZTS": "Healthcare",

  // Financial
  "AB": "Financial", "ABCB": "Financial", "ACGL": "Financial", "ACIW": "Financial",
  "AEL": "Financial", "AFL": "Financial", "AIG": "Financial", "AIZ": "Financial",
  "AJG": "Financial", "ALL": "Financial", "ALLY": "Financial", "AMG": "Financial",
  "AON": "Financial", "APAM": "Financial", "ATH": "Financial", "AXP": "Financial",
  "BAC": "Financial", "BEN": "Financial", "BK": "Financial", "BLK": "Financial",
  "BOKF": "Financial", "BRK-A": "Financial", "BRK-B": "Financial", "C": "Financial",
  "CATY": "Financial", "CB": "Financial", "CBOE": "Financial", "CFG": "Financial",
  "CINF": "Financial", "CMA": "Financial", "CME": "Financial", "CNO": "Financial",
  "COF": "Financial", "DFS": "Financial", "EQH": "Financial", "ERIE": "Financial",
  "EVR": "Financial", "EVTC": "Financial", "EWBC": "Financial", "FCNCA": "Financial",
  "FHN": "Financial", "FIS": "Financial", "FISV": "Financial", "FLT": "Financial",
  "FNB": "Financial", "FOUR": "Financial", "FRC": "Financial", "FULT": "Financial",
  "GBCI": "Financial", "GL": "Financial", "GPN": "Financial", "GS": "Financial",
  "HBAN": "Financial", "HIG": "Financial", "HLNE": "Financial", "IBKR": "Financial",
  "ICE": "Financial", "IVZ": "Financial", "JHG": "Financial", "JPM": "Financial",
  "KEY": "Financial", "KMPR": "Financial", "KNSL": "Financial", "L": "Financial",
  "LNC": "Financial", "LPLA": "Financial", "MA": "Financial", "MCO": "Financial",
  "MET": "Financial", "MKTX": "Financial", "MMC": "Financial", "MS": "Financial",
  "MSCI": "Financial", "MTB": "Financial", "NDAQ": "Financial", "NTRS": "Financial",
  "NYCB": "Financial", "ONB": "Financial", "ORI": "Financial", "OZK": "Financial",
  "PACW": "Financial", "PAYO": "Financial", "PFG": "Financial", "PGR": "Financial",
  "PJT": "Financial", "PNC": "Financial", "PNFP": "Financial", "PRU": "Financial",
  "PYPL": "Financial", "RELY": "Financial", "RF": "Financial", "RGA": "Financial",
  "RJF": "Financial", "RLI": "Financial", "RPAY": "Financial", "SBCF": "Financial",
  "SCHW": "Financial", "SEIC": "Financial", "SF": "Financial", "SIGI": "Financial",
  "SIVB": "Financial", "SNV": "Financial", "SPGI": "Financial", "STT": "Financial",
  "SYF": "Financial", "TFC": "Financial", "TOWN": "Financial", "TROW": "Financial",
  "TRV": "Financial", "UMPQ": "Financial", "UNM": "Financial", "USB": "Financial",
  "V": "Financial", "VCTR": "Financial", "VIRT": "Financial", "VOYA": "Financial",
  "WAL": "Financial", "WBS": "Financial", "WFC": "Financial", "WRB": "Financial",
  "WTFC": "Financial", "WTW": "Financial", "WU": "Financial", "ZION": "Financial",

  // Consumer
  "AAL": "Consumer", "ABG": "Consumer", "AEO": "Consumer", "ALK": "Consumer",
  "ALV": "Consumer", "AMZN": "Consumer", "AN": "Consumer", "ANF": "Consumer",
  "APTV": "Consumer", "ARCO": "Consumer", "ASO": "Consumer", "ATVI": "Consumer",
  "BARK": "Consumer", "BGFV": "Consumer", "BIG": "Consumer", "BJ": "Consumer",
  "BJRI": "Consumer", "BLMN": "Consumer", "BOOT": "Consumer", "BROS": "Consumer",
  "BURL": "Consumer", "BWA": "Consumer", "BYD": "Consumer", "CAKE": "Consumer",
  "CAL": "Consumer", "CARS": "Consumer", "CATO": "Consumer", "CCL": "Consumer",
  "CHH": "Consumer", "CHRS": "Consumer", "CHS": "Consumer", "CHUY": "Consumer",
  "CHWY": "Consumer", "CMG": "Consumer", "COMP": "Consumer", "COST": "Consumer",
  "CPNG": "Consumer", "CPRI": "Consumer", "CROX": "Consumer", "CVNA": "Consumer",
  "CZR": "Consumer", "DAL": "Consumer", "DECK": "Consumer", "DENN": "Consumer",
  "DG": "Consumer", "DIN": "Consumer", "DKNG": "Consumer", "DKS": "Consumer",
  "DLTR": "Consumer", "DNUT": "Consumer", "DPZ": "Consumer", "DRI": "Consumer",
  "EA": "Consumer", "EAT": "Consumer", "EXPR": "Consumer", "F": "Consumer",
  "FIVE": "Consumer", "FL": "Consumer", "FNKO": "Consumer", "FSR": "Consumer",
  "FVRR": "Consumer", "GDEN": "Consumer", "GIII": "Consumer", "GM": "Consumer",
  "GNTX": "Consumer", "GOOS": "Consumer", "GPI": "Consumer", "GPS": "Consumer",
  "H": "Consumer", "HAS": "Consumer", "HBI": "Consumer", "HD": "Consumer",
  "HIBB": "Consumer", "HLT": "Consumer", "HMC": "Consumer", "IHG": "Consumer",
  "JACK": "Consumer", "JAKK": "Consumer", "JBLU": "Consumer", "LAD": "Consumer",
  "LCID": "Consumer", "LEA": "Consumer", "LEVI": "Consumer", "LI": "Consumer",
  "LKQ": "Consumer", "LOCO": "Consumer", "LOW": "Consumer", "LULU": "Consumer",
  "LUV": "Consumer", "LVS": "Consumer", "MAR": "Consumer", "MAT": "Consumer",
  "MCD": "Consumer", "MGM": "Consumer", "MTOR": "Consumer", "NCLH": "Consumer",
  "NIO": "Consumer", "NKE": "Consumer", "OLLI": "Consumer", "OPEN": "Consumer",
  "OXM": "Consumer", "PAG": "Consumer", "PENN": "Consumer", "PLAY": "Consumer",
  "PLBY": "Consumer", "PLCE": "Consumer", "PLTK": "Consumer", "PTLO": "Consumer",
  "PVH": "Consumer", "PZZA": "Consumer", "QSR": "Consumer", "RACE": "Consumer",
  "RCL": "Consumer", "RDFN": "Consumer", "REAL": "Consumer", "RIVN": "Consumer",
  "RL": "Consumer", "ROST": "Consumer", "RRGB": "Consumer", "RRR": "Consumer",
  "RUTH": "Consumer", "RVLV": "Consumer", "SAH": "Consumer", "SAVE": "Consumer",
  "SBUX": "Consumer", "SCVL": "Consumer", "SHOO": "Consumer", "SKLZ": "Consumer",
  "SKX": "Consumer", "SN": "Consumer", "STAY": "Consumer", "STLA": "Consumer",
  "TGT": "Consumer", "TJX": "Consumer", "TM": "Consumer", "TNL": "Consumer",
  "TPR": "Consumer", "TTWO": "Consumer", "TXRH": "Consumer", "UAL": "Consumer",
  "UPWK": "Consumer", "URBN": "Consumer", "VAC": "Consumer", "VC": "Consumer",
  "VFC": "Consumer", "VNE": "Consumer", "VROOM": "Consumer", "WEN": "Consumer",
  "WH": "Consumer", "WING": "Consumer", "WMT": "Consumer", "WOOF": "Consumer",
  "WWW": "Consumer", "WYNN": "Consumer", "XPEV": "Consumer", "YUM": "Consumer",
  "ZG": "Consumer", "ZNGA": "Consumer",

  // Consumer Staples
  "ACI": "Consumer Staples", "BF-A": "Consumer Staples", "BF-B": "Consumer Staples", "BGS": "Consumer Staples",
  "BRFS": "Consumer Staples", "BTI": "Consumer Staples", "BUD": "Consumer Staples", "BYND": "Consumer Staples",
  "CAG": "Consumer Staples", "CELH": "Consumer Staples", "CHD": "Consumer Staples", "CHEF": "Consumer Staples",
  "CL": "Consumer Staples", "CLX": "Consumer Staples", "COKE": "Consumer Staples", "COTY": "Consumer Staples",
  "CPB": "Consumer Staples", "DEO": "Consumer Staples", "EL": "Consumer Staples", "ELF": "Consumer Staples",
  "ENR": "Consumer Staples", "FIZZ": "Consumer Staples", "GIS": "Consumer Staples", "GO": "Consumer Staples",
  "HELE": "Consumer Staples", "HLF": "Consumer Staples", "HNST": "Consumer Staples", "HRL": "Consumer Staples",
  "HSY": "Consumer Staples", "IMBBY": "Consumer Staples", "IMKTA": "Consumer Staples", "INGR": "Consumer Staples",
  "IPAR": "Consumer Staples", "K": "Consumer Staples", "KDP": "Consumer Staples", "KHC": "Consumer Staples",
  "KMB": "Consumer Staples", "KO": "Consumer Staples", "KR": "Consumer Staples", "LANC": "Consumer Staples",
  "LNDC": "Consumer Staples", "MDLZ": "Consumer Staples", "MKC": "Consumer Staples", "MNST": "Consumer Staples",
  "MO": "Consumer Staples", "NBEV": "Consumer Staples", "NOMD": "Consumer Staples", "NWL": "Consumer Staples",
  "PEP": "Consumer Staples", "PFGC": "Consumer Staples", "PG": "Consumer Staples", "PM": "Consumer Staples",
  "POST": "Consumer Staples", "PPC": "Consumer Staples", "REV": "Consumer Staples", "SAM": "Consumer Staples",
  "SFM": "Consumer Staples", "SJM": "Consumer Staples", "SKIN": "Consumer Staples", "SMPL": "Consumer Staples",
  "SPB": "Consumer Staples", "SPTN": "Consumer Staples", "STZ": "Consumer Staples", "SYY": "Consumer Staples",
  "TAP": "Consumer Staples", "THS": "Consumer Staples", "TPB": "Consumer Staples", "TSN": "Consumer Staples",
  "TTCF": "Consumer Staples", "UNFI": "Consumer Staples", "USFD": "Consumer Staples", "VGR": "Consumer Staples",
  "VLGEA": "Consumer Staples", "WBA": "Consumer Staples",

  // Industrial
  "ACM": "Industrial", "ADP": "Industrial", "AGCO": "Industrial", "ALGT": "Industrial",
  "AME": "Industrial", "AOS": "Industrial", "ARCB": "Industrial", "ASGN": "Industrial",
  "ATRO": "Industrial", "AVAV": "Industrial", "AWI": "Industrial", "AXON": "Industrial",
  "AZEK": "Industrial", "BA": "Industrial", "BLD": "Industrial", "BLDR": "Industrial",
  "BR": "Industrial", "CAT": "Industrial", "CFX": "Industrial", "CHRW": "Industrial",
  "CLH": "Industrial", "CMI": "Industrial", "CNHI": "Industrial", "CNI": "Industrial",
  "CP": "Industrial", "CSX": "Industrial", "CTAS": "Industrial", "CW": "Industrial",
  "DE": "Industrial", "DNB": "Industrial", "DOOR": "Industrial", "DOV": "Industrial",
  "DY": "Industrial", "ECHO": "Industrial", "EME": "Industrial", "EMR": "Industrial",
  "ERJ": "Industrial", "ETN": "Industrial", "EXP": "Industrial", "EXPD": "Industrial",
  "FAST": "Industrial", "FBHS": "Industrial", "FDX": "Industrial", "FLR": "Industrial",
  "FTV": "Industrial", "FWRD": "Industrial", "G": "Industrial", "GD": "Industrial",
  "GE": "Industrial", "GGG": "Industrial", "GNRC": "Industrial", "GVA": "Industrial",
  "GWW": "Industrial", "GXO": "Industrial", "HA": "Industrial", "HEI": "Industrial",
  "HII": "Industrial", "HON": "Industrial", "HSIC": "Industrial", "HTLD": "Industrial",
  "HUBG": "Industrial", "HWM": "Industrial", "IEX": "Industrial", "INFO": "Industrial",
  "IR": "Industrial", "ITW": "Industrial", "J": "Industrial", "JBHT": "Industrial",
  "KNX": "Industrial", "KSU": "Industrial", "KTOS": "Industrial", "LECO": "Industrial",
  "LHX": "Industrial", "LII": "Industrial", "LMT": "Industrial", "LSTR": "Industrial",
  "MAS": "Industrial", "MATX": "Industrial", "MESA": "Industrial", "MIDD": "Industrial",
  "MLM": "Industrial", "MMM": "Industrial", "MOG-A": "Industrial", "MRCY": "Industrial",
  "MRTN": "Industrial", "MTW": "Industrial", "MTZ": "Industrial", "NDSN": "Industrial",
  "NOC": "Industrial", "NSC": "Industrial", "ODFL": "Industrial", "OSK": "Industrial",
  "PAYX": "Industrial", "PCAR": "Industrial", "PH": "Industrial", "PSN": "Industrial",
  "PWR": "Industrial", "RBC": "Industrial", "RGR": "Industrial", "RHI": "Industrial",
  "ROCK": "Industrial", "ROK": "Industrial", "ROP": "Industrial", "RSG": "Industrial",
  "RTX": "Industrial", "RXO": "Industrial", "RYAAY": "Industrial", "SAIA": "Industrial",
  "SITE": "Industrial", "SKYW": "Industrial", "SNA": "Industrial", "SNDR": "Industrial",
  "SPR": "Industrial", "SWBI": "Industrial", "SWK": "Industrial", "TDG": "Industrial",
  "TEX": "Industrial", "TREX": "Industrial", "TRI": "Industrial", "TTC": "Industrial",
  "TXT": "Industrial", "UFPI": "Industrial", "UNP": "Industrial", "UPS": "Industrial",
  "URI": "Industrial", "VMC": "Industrial", "VRSK": "Industrial", "WCN": "Industrial",
  "WERN": "Industrial", "WM": "Industrial", "WSO": "Industrial", "XPO": "Industrial",
  "XYL": "Industrial", "ZTO": "Industrial",

  // Energy
  "ACDC": "Energy", "AM": "Energy", "APA": "Energy", "AR": "Energy",
  "AROC": "Energy", "BATL": "Energy", "BKR": "Energy", "CEQP": "Energy",
  "CHK": "Energy", "CHRD": "Energy", "CHX": "Energy", "CLMT": "Energy",
  "CLR": "Energy", "CNX": "Energy", "COP": "Energy", "CPE": "Energy",
  "CRK": "Energy", "CTRA": "Energy", "CVI": "Energy", "CVX": "Energy",
  "DCP": "Energy", "DINO": "Energy", "DK": "Energy", "DO": "Energy",
  "DTM": "Energy", "DVN": "Energy", "ENLC": "Energy", "EOG": "Energy",
  "EPD": "Energy", "EQT": "Energy", "ESTE": "Energy", "ET": "Energy",
  "FANG": "Energy", "FTI": "Energy", "GPOR": "Energy", "HAL": "Energy",
  "HES": "Energy", "HESM": "Energy", "HFC": "Energy", "HLX": "Energy",
  "HP": "Energy", "INT": "Energy", "KMI": "Energy", "LBRT": "Energy",
  "LNG": "Energy", "MGY": "Energy", "MPC": "Energy", "MPLX": "Energy",
  "MRO": "Energy", "MTDR": "Energy", "NBR": "Energy", "NE": "Energy",
  "NINE": "Energy", "NOV": "Energy", "NS": "Energy", "OII": "Energy",
  "OKE": "Energy", "OXY": "Energy", "PAA": "Energy", "PARR": "Energy",
  "PBF": "Energy", "PDCE": "Energy", "PR": "Energy", "PSX": "Energy",
  "PTEN": "Energy", "PXD": "Energy", "REI": "Energy", "RES": "Energy",
  "RIG": "Energy", "ROCC": "Energy", "RRC": "Energy", "SBOW": "Energy",
  "SD": "Energy", "SLB": "Energy", "SM": "Energy", "SWN": "Energy",
  "TALO": "Energy", "TDW": "Energy", "TRGP": "Energy", "VAL": "Energy",
  "VLO": "Energy", "VTLE": "Energy", "WES": "Energy", "WHD": "Energy",
  "WMB": "Energy", "WTI": "Energy", "WTTR": "Energy", "XOM": "Energy",

  // Utilities
  "AEE": "Utilities", "AEP": "Utilities", "AES": "Utilities", "ALE": "Utilities",
  "AMRC": "Utilities", "ARRY": "Utilities", "ATO": "Utilities", "AVA": "Utilities",
  "AWK": "Utilities", "AWR": "Utilities", "BE": "Utilities", "BKH": "Utilities",
  "BLDP": "Utilities", "CEG": "Utilities", "CLNE": "Utilities", "CMS": "Utilities",
  "CNP": "Utilities", "CPK": "Utilities", "CSIQ": "Utilities", "CWCO": "Utilities",
  "CWEN": "Utilities", "CWT": "Utilities", "D": "Utilities", "DTE": "Utilities",
  "DUK": "Utilities", "ED": "Utilities", "EIX": "Utilities", "ENPH": "Utilities",
  "ENVX": "Utilities", "ES": "Utilities", "ETR": "Utilities", "EVRG": "Utilities",
  "EXC": "Utilities", "FCEL": "Utilities", "FE": "Utilities", "FSLR": "Utilities",
  "HE": "Utilities", "HYLN": "Utilities", "IDA": "Utilities", "JKS": "Utilities",
  "MAXN": "Utilities", "MGEE": "Utilities", "NEE": "Utilities", "NFG": "Utilities",
  "NI": "Utilities", "NJR": "Utilities", "NOVA": "Utilities", "NRG": "Utilities",
  "NWE": "Utilities", "NWN": "Utilities", "OGE": "Utilities", "OGS": "Utilities",
  "OTTR": "Utilities", "PEG": "Utilities", "PLUG": "Utilities", "PNM": "Utilities",
  "PNW": "Utilities", "POR": "Utilities", "PPL": "Utilities", "RUN": "Utilities",
  "SEDG": "Utilities", "SJW": "Utilities", "SO": "Utilities", "SPWR": "Utilities",
  "SR": "Utilities", "SRE": "Utilities", "STEM": "Utilities", "SWX": "Utilities",
  "UGI": "Utilities", "VST": "Utilities", "WEC": "Utilities", "WTRG": "Utilities",
  "XEL": "Utilities", "YORW": "Utilities",

  // Real Estate
  "ADC": "Real Estate", "AIV": "Real Estate", "AKR": "Real Estate", "AMH": "Real Estate",
  "AMT": "Real Estate", "APLE": "Real Estate", "ARE": "Real Estate", "AVB": "Real Estate",
  "BRX": "Real Estate", "BXP": "Real Estate", "CCI": "Real Estate", "CLI": "Real Estate",
  "CONE": "Real Estate", "CORZ": "Real Estate", "CPT": "Real Estate", "CTRE": "Real Estate",
  "CUZ": "Real Estate", "DEA": "Real Estate", "DEI": "Real Estate", "DLR": "Real Estate",
  "DOC": "Real Estate", "EGP": "Real Estate", "ELME": "Real Estate", "ELS": "Real Estate",
  "EPRT": "Real Estate", "EQIX": "Real Estate", "EQR": "Real Estate", "ESRT": "Real Estate",
  "ESS": "Real Estate", "FCPT": "Real Estate", "FR": "Real Estate", "FRT": "Real Estate",
  "GMRE": "Real Estate", "GOOD": "Real Estate", "GTY": "Real Estate", "HIW": "Real Estate",
  "HR": "Real Estate", "IIPR": "Real Estate", "INVH": "Real Estate", "IRT": "Real Estate",
  "JBGS": "Real Estate", "KIM": "Real Estate", "KRC": "Real Estate", "KRG": "Real Estate",
  "LTC": "Real Estate", "MAA": "Real Estate", "NHI": "Real Estate", "NNN": "Real Estate",
  "NTST": "Real Estate", "NXRT": "Real Estate", "O": "Real Estate", "OFC": "Real Estate",
  "OHI": "Real Estate", "PDM": "Real Estate", "PECO": "Real Estate", "PLD": "Real Estate",
  "PLYM": "Real Estate", "QTS": "Real Estate", "REG": "Real Estate", "REXR": "Real Estate",
  "RHP": "Real Estate", "SBAC": "Real Estate", "SBRA": "Real Estate", "SITC": "Real Estate",
  "SLG": "Real Estate", "SPG": "Real Estate", "SRC": "Real Estate", "STAG": "Real Estate",
  "STOR": "Real Estate", "SUI": "Real Estate", "TREH": "Real Estate", "TRNO": "Real Estate",
  "UDR": "Real Estate", "UNIT": "Real Estate", "VICI": "Real Estate", "VNO": "Real Estate",
  "VTR": "Real Estate", "WELL": "Real Estate", "WRI": "Real Estate",

  // Materials
  "AA": "Materials", "ALB": "Materials", "AMR": "Materials", "APD": "Materials",
  "ARCH": "Materials", "ARLP": "Materials", "ASH": "Materials", "ATI": "Materials",
  "ATR": "Materials", "AVNT": "Materials", "AVY": "Materials", "BALL": "Materials",
  "BERY": "Materials", "BHP": "Materials", "BMS": "Materials", "BTU": "Materials",
  "CBT": "Materials", "CC": "Materials", "CCJ": "Materials", "CCK": "Materials",
  "CE": "Materials", "CEIX": "Materials", "CENX": "Materials", "CF": "Materials",
  "CITE": "Materials", "CLF": "Materials", "CLW": "Materials", "CMC": "Materials",
  "CONSOL": "Materials", "CTVA": "Materials", "CX": "Materials", "DD": "Materials",
  "DNN": "Materials", "DOW": "Materials", "ECL": "Materials", "EMN": "Materials",
  "ESI": "Materials", "FCX": "Materials", "FMC": "Materials", "GPK": "Materials",
  "HCC": "Materials", "HUN": "Materials", "HWKN": "Materials", "IFF": "Materials",
  "IOSP": "Materials", "IP": "Materials", "ITE": "Materials", "KALU": "Materials",
  "KBH": "Materials", "KRO": "Materials", "KWR": "Materials", "LAC": "Materials",
  "LIN": "Materials", "LTHM": "Materials", "LYB": "Materials", "MERC": "Materials",
  "METC": "Materials", "MOS": "Materials", "MP": "Materials", "MTX": "Materials",
  "NCR": "Materials", "NEM": "Materials", "NEU": "Materials", "NTR": "Materials",
  "NUE": "Materials", "OI": "Materials", "OLN": "Materials", "PKG": "Materials",
  "PLL": "Materials", "PPG": "Materials", "RIO": "Materials", "RPM": "Materials",
  "RS": "Materials", "SCCO": "Materials", "SEE": "Materials", "SHW": "Materials",
  "SLGN": "Materials", "SON": "Materials", "SQM": "Materials", "STLD": "Materials",
  "SUM": "Materials", "TECK": "Materials", "TROX": "Materials", "UEC": "Materials",
  "USLM": "Materials", "UUUU": "Materials", "VALE": "Materials", "VNTR": "Materials",
  "WLK": "Materials", "X": "Materials", "ZEUS": "Materials",

  // Communication
  "AMC": "Communication", "APPS": "Communication", "ATUS": "Communication", "CABO": "Communication",
  "CHTR": "Communication", "CMCSA": "Communication", "CNK": "Communication", "CNSL": "Communication",
  "CRTO": "Communication", "DIS": "Communication", "DISCB": "Communication", "DV": "Communication",
  "EDR": "Communication", "EEFT": "Communication", "FOX": "Communication", "FOXA": "Communication",
  "FUBO": "Communication", "FWONK": "Communication", "FYBR": "Communication", "IAS": "Communication",
  "IMAX": "Communication", "IPG": "Communication", "IQ": "Communication", "LBRDA": "Communication",
  "LBRDK": "Communication", "LGF-A": "Communication", "LGF-B": "Communication", "LILA": "Communication",
  "LILAK": "Communication", "LSXMA": "Communication", "LSXMB": "Communication", "LSXMK": "Communication",
  "LUMN": "Communication", "LYV": "Communication", "MGNI": "Communication", "MSG": "Communication",
  "MSGS": "Communication", "NFLX": "Communication", "OMC": "Communication", "ORAN": "Communication",
  "PARA": "Communication", "PARAA": "Communication", "PUBGY": "Communication", "QNST": "Communication",
  "QUOT": "Communication", "ROKU": "Communication", "SHEN": "Communication", "SIRI": "Communication",
  "T": "Communication", "TDS": "Communication", "TEF": "Communication", "TI": "Communication",
  "TMUS": "Communication", "TTD": "Communication", "TWTR": "Communication", "USM": "Communication",
  "VIAC": "Communication", "VOD": "Communication", "VZ": "Communication", "WBD": "Communication",
  "WPP": "Communication", "WWE": "Communication", "Z": "Communication"
};

function getSectorForSymbol(symbol: string): string {
  return SECTOR_MAP[symbol] || "Other";
}

export async function getMostActiveStocks(count: number = 10): Promise<TrendingStock[]> {
  try {
    const result = await yahooFinance.screener({
      scrIds: "most_actives",
      count: count,
    }) as YahooScreenerResult;

    return (result.quotes || []).slice(0, count).map((quote: YahooQuote) => ({
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
 * Get all symbols for a given sector (from hardcoded list - fallback only)
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
 * Get sector info by ID
 */
export function getSectorInfoById(sectorId: string): SectorInfo | undefined {
  return SECTORS.find(s => s.id === sectorId);
}

/**
 * Get all sectors with their stock counts (uses NASDAQ API)
 */
export async function getSectorCountsFromNasdaq(): Promise<Record<string, number>> {
  return getNasdaqSectorCounts();
}

/**
 * Get all sectors with their stock counts (from hardcoded list - fallback)
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
 * Fetch all stocks for a specific sector using NASDAQ API
 * Returns 100-1500+ stocks depending on sector (7,000+ total across all sectors)
 */
export async function getSectorStocks(sectorId: string): Promise<SectorStock[]> {
  const sectorInfo = getSectorInfoById(sectorId);
  if (!sectorInfo) {
    console.error(`Unknown sector: ${sectorId}`);
    return [];
  }

  console.log(`Fetching stocks from NASDAQ API for sector ${sectorId}...`);

  // Get all symbols from NASDAQ for this sector
  const symbols = await fetchAllNasdaqSectorSymbols(sectorInfo.nasdaqApiValue);

  if (symbols.length === 0) {
    console.error(`No symbols found from NASDAQ for sector: ${sectorId}`);
    return [];
  }

  console.log(`Found ${symbols.length} symbols from NASDAQ for sector ${sectorId}`);

  // Fetch detailed quotes from Yahoo Finance in batches
  const batchSize = 50;
  const allQuotes: SectorStock[] = [];

  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    try {
      const quotes = await yahooFinance.quote(batch);
      const quotesArray = (Array.isArray(quotes) ? quotes : [quotes]) as unknown as YahooQuote[];

      const mappedQuotes = quotesArray.map((quote: YahooQuote) => ({
        symbol: quote.symbol,
        name: quote.shortName || quote.longName || quote.symbol,
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        marketCap: quote.marketCap || 0,
        sector: sectorInfo.name,
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
 * Get performance data for all sectors using NASDAQ API
 * Fetches top 50 stocks per sector for performance calculation (faster than fetching all 7000+)
 */
export async function getAllSectorsPerformance(): Promise<SectorPerformance[]> {
  try {
    const results: SectorPerformance[] = [];

    // Process each sector
    for (const sector of SECTORS) {
      try {
        // Get top 50 stocks from NASDAQ API for this sector (by market cap - NASDAQ returns them sorted)
        const { stocks: nasdaqStocks, total } = await fetchNasdaqSectorStocks(sector.nasdaqApiValue, 50, 0);

        if (nasdaqStocks.length === 0) continue;

        // Get symbols
        const symbols = nasdaqStocks.map(s => s.symbol);

        // Fetch detailed quotes from Yahoo Finance
        const quotes = await yahooFinance.quote(symbols);
        const quotesArray = (Array.isArray(quotes) ? quotes : [quotes]) as unknown as YahooQuote[];

        const validQuotes = quotesArray.filter((q: YahooQuote) => q && q.regularMarketPrice);

        if (validQuotes.length === 0) continue;

        // Calculate metrics
        const stocks = validQuotes.map((q: YahooQuote) => ({
          symbol: q.symbol,
          changePercent: q.regularMarketChangePercent || 0,
          marketCap: q.marketCap || 0,
        }));

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
          stockCount: total, // Use total from NASDAQ API (actual count)
          avgChange,
          totalMarketCap,
          topGainer,
          topLoser,
          advancers,
          decliners,
        });
      } catch (error) {
        console.error(`Error fetching performance for sector ${sector.id}:`, error);
        // Continue with other sectors
      }
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
 * Fetch paginated stocks for a specific sector using NASDAQ API (for lazy loading)
 * Supports 7,000+ stocks across all sectors
 */
export async function getSectorStocksPaginated(
  sectorId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedSectorStocksResult> {
  const sectorInfo = getSectorInfoById(sectorId);
  if (!sectorInfo) {
    console.error(`Unknown sector: ${sectorId}`);
    return {
      stocks: [],
      page,
      limit,
      total: 0,
      totalPages: 0,
      hasMore: false,
    };
  }

  // Calculate offset for NASDAQ API pagination
  const offset = (page - 1) * limit;

  console.log(`Fetching page ${page} from NASDAQ API for sector ${sectorId} (offset: ${offset}, limit: ${limit})...`);

  try {
    // Fetch from NASDAQ API with pagination
    const { stocks: nasdaqStocks, total } = await fetchNasdaqSectorStocks(
      sectorInfo.nasdaqApiValue,
      limit,
      offset
    );

    if (nasdaqStocks.length === 0) {
      return {
        stocks: [],
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: false,
      };
    }

    // Get symbols for this page
    const symbols = nasdaqStocks.map(s => s.symbol);

    // Fetch detailed quotes from Yahoo Finance
    const quotes = await yahooFinance.quote(symbols);
    const quotesArray = (Array.isArray(quotes) ? quotes : [quotes]) as unknown as YahooQuote[];

    const stocks = quotesArray.map((quote: YahooQuote) => ({
      symbol: quote.symbol,
      name: quote.shortName || quote.longName || quote.symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      marketCap: quote.marketCap || 0,
      sector: sectorInfo.name,
      volume: quote.regularMarketVolume || 0,
      avgVolume: quote.averageDailyVolume3Month || 0,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0,
      trailingPE: quote.trailingPE || null,
    })).filter((stock: SectorStock) => stock.price > 0)
       .sort((a: SectorStock, b: SectorStock) => b.marketCap - a.marketCap);

    const totalPages = Math.ceil(total / limit);

    return {
      stocks,
      page,
      limit,
      total,
      totalPages,
      hasMore: offset + limit < total,
    };
  } catch (error) {
    console.error(`Error fetching page ${page} for sector ${sectorId}:`, error);
    return {
      stocks: [],
      page,
      limit,
      total: 0,
      totalPages: 0,
      hasMore: false,
    };
  }
}

// ============================================================================
// Expected Move Calculation for Earnings
// ============================================================================

/**
 * Cache for expected move data to reduce API calls
 */
const expectedMoveCache = new Map<string, { data: ExpectedMoveData; expires: number }>();
const EXPECTED_MOVE_CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Get expected move for a stock before earnings
 * Calculates expected move using ATM straddle price from options chain
 *
 * @param symbol - Stock ticker symbol
 * @param earningsDate - Expected earnings date (optional, uses nearest expiration if not provided)
 * @returns Expected move data or null if options unavailable
 */
export async function getExpectedMove(
  symbol: string,
  earningsDate?: string
): Promise<ExpectedMoveData | null> {
  // Check cache first
  const cacheKey = `expected_move_${symbol}`;
  const cached = expectedMoveCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  try {
    // Fetch options chain from Yahoo Finance
    const optionsData = await yahooFinance.options(symbol) as YahooOptionsChain;

    if (!optionsData || !optionsData.options || optionsData.options.length === 0) {
      console.log(`[Expected Move] No options data available for ${symbol}`);
      return null;
    }

    const stockPrice = optionsData.quote?.regularMarketPrice;
    if (!stockPrice) {
      console.log(`[Expected Move] No stock price available for ${symbol}`);
      return null;
    }

    // Find the appropriate expiration date
    // If earnings date provided, find expiration closest to but after earnings
    // Otherwise use the nearest weekly expiration
    let targetExpiration = optionsData.options[0];

    if (earningsDate && optionsData.expirationDates.length > 0) {
      const earningsTimestamp = new Date(earningsDate).getTime();

      // Find expiration closest to but after earnings date
      for (const option of optionsData.options) {
        const expirationTime = option.expirationDate instanceof Date
          ? option.expirationDate.getTime()
          : new Date(option.expirationDate).getTime();
        if (expirationTime >= earningsTimestamp) {
          targetExpiration = option;
          break;
        }
      }
    }

    if (!targetExpiration.calls || !targetExpiration.puts ||
        targetExpiration.calls.length === 0 || targetExpiration.puts.length === 0) {
      console.log(`[Expected Move] No calls/puts available for ${symbol}`);
      return null;
    }

    // Find ATM strike (closest to current stock price)
    const strikes = targetExpiration.calls.map(c => c.strike);
    const atmStrike = strikes.reduce((prev, curr) =>
      Math.abs(curr - stockPrice) < Math.abs(prev - stockPrice) ? curr : prev
    );

    // Find ATM call and put
    const atmCall = targetExpiration.calls.find(c => c.strike === atmStrike);
    const atmPut = targetExpiration.puts.find(p => p.strike === atmStrike);

    if (!atmCall || !atmPut) {
      console.log(`[Expected Move] Could not find ATM options for ${symbol} at strike ${atmStrike}`);
      return null;
    }

    // Use mid price (average of bid/ask) or last price
    const callPrice = atmCall.bid && atmCall.ask
      ? (atmCall.bid + atmCall.ask) / 2
      : atmCall.lastPrice || 0;

    const putPrice = atmPut.bid && atmPut.ask
      ? (atmPut.bid + atmPut.ask) / 2
      : atmPut.lastPrice || 0;

    if (callPrice === 0 && putPrice === 0) {
      console.log(`[Expected Move] No price data for ATM options for ${symbol}`);
      return null;
    }

    // Calculate expected move (straddle price)
    const expectedMove = callPrice + putPrice;
    const expectedMovePercent = (expectedMove / stockPrice) * 100;

    // Get implied volatility (average of call and put IV)
    const callIV = atmCall.impliedVolatility || 0;
    const putIV = atmPut.impliedVolatility || 0;
    const avgIV = callIV > 0 && putIV > 0 ? (callIV + putIV) / 2 : callIV || putIV || null;

    // Get expiration date as ISO string
    const expirationDateObj = targetExpiration.expirationDate instanceof Date
      ? targetExpiration.expirationDate
      : new Date(targetExpiration.expirationDate);

    const result: ExpectedMoveData = {
      symbol,
      stockPrice,
      expectedMove,
      expectedMovePercent,
      atmStrike,
      atmCallPrice: callPrice,
      atmPutPrice: putPrice,
      impliedVolatility: avgIV,
      expirationDate: expirationDateObj.toISOString().split('T')[0],
    };

    // Cache the result
    expectedMoveCache.set(cacheKey, {
      data: result,
      expires: Date.now() + EXPECTED_MOVE_CACHE_TTL,
    });

    console.log(`[Expected Move] ${symbol}: ±$${expectedMove.toFixed(2)} (±${expectedMovePercent.toFixed(1)}%)`);
    return result;
  } catch (error) {
    console.error(`[Expected Move] Error fetching options for ${symbol}:`, error);
    return null;
  }
}

/**
 * Get expected move for multiple symbols in batch
 * Processes in parallel with rate limiting
 *
 * @param symbols - Array of stock ticker symbols
 * @param earningsDates - Map of symbol to earnings date
 * @returns Map of symbol to expected move data
 */
export async function getExpectedMoveBatch(
  symbols: string[],
  earningsDates?: Map<string, string>
): Promise<Map<string, ExpectedMoveData>> {
  const results = new Map<string, ExpectedMoveData>();

  // Process in batches of 5 to avoid rate limiting
  const batchSize = 5;

  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);

    const promises = batch.map(async (symbol) => {
      const earningsDate = earningsDates?.get(symbol);
      const result = await getExpectedMove(symbol, earningsDate);
      if (result) {
        results.set(symbol, result);
      }
    });

    await Promise.all(promises);

    // Small delay between batches to avoid rate limiting
    if (i + batchSize < symbols.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}

// ============================================================================
// Earnings Report Timing (BMO/AMC)
// ============================================================================

export type EarningsReportTime = 'BMO' | 'AMC' | 'TBD';

interface YahooCalendarEvents {
  earnings?: {
    earningsDate?: Date[];
    earningsCallDate?: Date[];
    isEarningsDateEstimate?: boolean;
    earningsAverage?: number;
    earningsLow?: number;
    earningsHigh?: number;
  };
}

interface YahooQuoteSummaryResult {
  calendarEvents?: YahooCalendarEvents;
}

/**
 * Determine earnings report time (BMO/AMC) from Yahoo Finance earningsDate
 * Based on UTC hour:
 * - BMO (Before Market Open): UTC hour 10-14 (5-9 AM EST)
 * - AMC (After Market Close): UTC hour 20-23 (4-7 PM EST)
 */
function getReportTimeFromDate(date: Date): EarningsReportTime {
  const hours = date.getUTCHours();

  if (hours >= 20 && hours <= 23) {
    return 'AMC';
  } else if (hours >= 10 && hours <= 14) {
    return 'BMO';
  }
  return 'TBD';
}

/**
 * Cache for earnings timing data
 */
const earningsTimingCache = new Map<string, { data: EarningsReportTime; expires: number }>();
const EARNINGS_TIMING_CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

/**
 * Get earnings report timing (BMO/AMC) for a single symbol
 * @param symbol - Stock ticker symbol
 * @returns Report timing or 'TBD' if unknown
 */
export async function getEarningsReportTime(symbol: string): Promise<EarningsReportTime> {
  // Check cache first
  const cached = earningsTimingCache.get(symbol);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  try {
    const result = await yahooFinance.quoteSummary(symbol, {
      modules: ['calendarEvents']
    }) as YahooQuoteSummaryResult;

    const earningsDate = result.calendarEvents?.earnings?.earningsDate?.[0];

    if (!earningsDate) {
      return 'TBD';
    }

    const reportTime = getReportTimeFromDate(new Date(earningsDate));

    // Cache the result
    earningsTimingCache.set(symbol, {
      data: reportTime,
      expires: Date.now() + EARNINGS_TIMING_CACHE_TTL,
    });

    return reportTime;
  } catch (error) {
    console.error(`[Yahoo Finance] Error fetching earnings timing for ${symbol}:`, error);
    return 'TBD';
  }
}

/**
 * Get earnings report timing for multiple symbols in batch
 * @param symbols - Array of stock ticker symbols
 * @returns Map of symbol to report timing
 */
export async function getEarningsReportTimeBatch(
  symbols: string[]
): Promise<Map<string, EarningsReportTime>> {
  const results = new Map<string, EarningsReportTime>();

  // Process in batches to avoid rate limiting
  const batchSize = 10;

  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);

    const promises = batch.map(async (symbol) => {
      const reportTime = await getEarningsReportTime(symbol);
      results.set(symbol, reportTime);
    });

    await Promise.all(promises);

    // Small delay between batches
    if (i + batchSize < symbols.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return results;
}

// ============================================================================
// Historical Earnings Data (Reported EPS, Surprise)
// ============================================================================

export interface HistoricalEarningsData {
  reportedEPS: number | null;
  estimatedEPS: number | null;
  surprise: number | null;
  surprisePercent: number | null;
  quarter: string; // e.g., "1Q2025"
}

/**
 * Cache for historical earnings data
 */
const historicalEarningsCache = new Map<string, { data: HistoricalEarningsData[]; expires: number }>();
const HISTORICAL_EARNINGS_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get historical quarterly earnings data for a symbol from Yahoo Finance
 * Returns reported EPS, estimates, and surprise percentage
 */
export async function getHistoricalEarnings(symbol: string): Promise<HistoricalEarningsData[]> {
  // Check cache first
  const cached = historicalEarningsCache.get(symbol);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  try {
    const result = await yahooFinance.quoteSummary(symbol, {
      modules: ['earnings']
    }) as { earnings?: { earningsChart?: { quarterly?: Array<{ date: string; actual: number; estimate: number; surprisePct?: string }> } } };

    const quarterlyData = result.earnings?.earningsChart?.quarterly || [];

    const earnings: HistoricalEarningsData[] = quarterlyData.map(q => {
      const actual = typeof q.actual === 'number' ? q.actual : null;
      const estimate = typeof q.estimate === 'number' ? q.estimate : null;
      const surprise = actual !== null && estimate !== null ? actual - estimate : null;
      const surprisePercent = q.surprisePct ? parseFloat(q.surprisePct) : null;

      return {
        reportedEPS: actual,
        estimatedEPS: estimate,
        surprise,
        surprisePercent,
        quarter: q.date || '',
      };
    });

    // Cache the result
    historicalEarningsCache.set(symbol, {
      data: earnings,
      expires: Date.now() + HISTORICAL_EARNINGS_CACHE_TTL,
    });

    return earnings;
  } catch (error) {
    console.error(`[Yahoo Finance] Error fetching historical earnings for ${symbol}:`, error);
    return [];
  }
}

/**
 * Convert quarter string (e.g., "1Q2025") to approximate date range
 * Returns the end date of the fiscal quarter
 */
function quarterToDate(quarter: string): Date | null {
  // Parse format like "1Q2025", "2Q2024", etc.
  const match = quarter.match(/(\d)Q(\d{4})/);
  if (!match) return null;

  const q = parseInt(match[1]);
  const year = parseInt(match[2]);

  // Approximate end month for each quarter (fiscal quarters can vary by company)
  // Most companies: Q1=Mar, Q2=Jun, Q3=Sep, Q4=Dec
  const endMonths = [2, 5, 8, 11]; // March, June, September, December (0-indexed)
  const month = endMonths[q - 1];

  if (month === undefined) return null;

  // Return the last day of the quarter's end month
  return new Date(year, month + 1, 0);
}

/**
 * Get historical earnings data for a batch of earnings entries from Yahoo Finance
 * For each past earnings entry, matches with the most recent quarter data from Yahoo Finance
 *
 * This replaces Alpha Vantage's getHistoricalEarningsDataBatch
 */
export async function getHistoricalEarningsDataBatch(
  earnings: Array<{ symbol: string; reportDate: string }>
): Promise<Map<string, { reportedEPS: number | null; surprise: number | null; surprisePercent: number | null }>> {
  const results = new Map<string, { reportedEPS: number | null; surprise: number | null; surprisePercent: number | null }>();

  // Only process past earnings
  const today = new Date().toISOString().split('T')[0];
  const pastEarnings = earnings.filter(e => e.reportDate < today);

  if (pastEarnings.length === 0) {
    return results;
  }

  // Get unique symbols
  const uniqueSymbols = [...new Set(pastEarnings.map(e => e.symbol))];

  console.log(`[Yahoo Finance] Fetching historical earnings for ${uniqueSymbols.length} symbols`);

  // Process in batches
  const batchSize = 10;

  for (let i = 0; i < uniqueSymbols.length; i += batchSize) {
    const batch = uniqueSymbols.slice(i, i + batchSize);

    const promises = batch.map(async (symbol) => {
      try {
        const historicalData = await getHistoricalEarnings(symbol);

        if (historicalData.length === 0) return;

        // Find earnings entries for this symbol
        const earningsForSymbol = pastEarnings.filter(e => e.symbol === symbol);

        // Sort historical data by quarter (most recent first)
        // Quarter format is like "3Q2025", "2Q2025", etc.
        const sortedHistorical = [...historicalData].sort((a, b) => {
          const [aQ, aY] = [parseInt(a.quarter[0]), parseInt(a.quarter.slice(2))];
          const [bQ, bY] = [parseInt(b.quarter[0]), parseInt(b.quarter.slice(2))];
          if (aY !== bY) return bY - aY; // Sort by year descending
          return bQ - aQ; // Sort by quarter descending
        });

        for (const earning of earningsForSymbol) {
          // Use the most recent quarter data available (Yahoo returns last 4 quarters)
          // The most recent quarter with data should match the most recent earnings report
          const mostRecent = sortedHistorical[0];

          if (mostRecent && mostRecent.reportedEPS !== null) {
            results.set(`${symbol}_${earning.reportDate}`, {
              reportedEPS: mostRecent.reportedEPS,
              surprise: mostRecent.surprise,
              surprisePercent: mostRecent.surprisePercent,
            });
          }
        }
      } catch (error) {
        console.error(`[Yahoo Finance] Error fetching historical earnings for ${symbol}:`, error);
      }
    });

    await Promise.all(promises);

    // Rate limiting delay between batches
    if (i + batchSize < uniqueSymbols.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  console.log(`[Yahoo Finance] Found historical data for ${results.size} earnings entries`);
  return results;
}

// ============================================================================
// Earnings Enhanced Data (Report Time + Market Cap)
// ============================================================================

export interface EarningsEnhancedData {
  reportTime: EarningsReportTime;
  marketCap?: number;
}

/**
 * Get enhanced earnings data (report timing + market cap) for a single symbol
 */
export async function getEarningsEnhancedData(symbol: string): Promise<EarningsEnhancedData> {
  try {
    const result = await yahooFinance.quoteSummary(symbol, {
      modules: ['calendarEvents', 'price']
    }) as YahooQuoteSummaryResult & { price?: { marketCap?: number } };

    const earningsDate = result.calendarEvents?.earnings?.earningsDate?.[0];
    const marketCap = result.price?.marketCap;

    let reportTime: EarningsReportTime = 'TBD';
    if (earningsDate) {
      reportTime = getReportTimeFromDate(new Date(earningsDate));
    }

    return {
      reportTime,
      marketCap: marketCap || undefined
    };
  } catch (error) {
    console.error(`[Yahoo Finance] Error fetching enhanced data for ${symbol}:`, error);
    return { reportTime: 'TBD' };
  }
}

/**
 * Get enhanced earnings data for multiple symbols in batch
 * @param symbols - Array of stock ticker symbols
 * @returns Map of symbol to enhanced data
 */
export async function getEarningsEnhancedDataBatch(
  symbols: string[]
): Promise<Map<string, EarningsEnhancedData>> {
  const results = new Map<string, EarningsEnhancedData>();

  // Process in batches to avoid rate limiting
  const batchSize = 10;

  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);

    const promises = batch.map(async (symbol) => {
      const data = await getEarningsEnhancedData(symbol);
      results.set(symbol, data);
    });

    await Promise.all(promises);

    // Small delay between batches
    if (i + batchSize < symbols.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return results;
}
