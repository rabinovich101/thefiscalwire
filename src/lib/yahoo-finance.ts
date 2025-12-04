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

// Sector mapping for common stocks
const SECTOR_MAP: Record<string, string> = {
  // Technology
  "AAPL": "Technology", "MSFT": "Technology", "GOOGL": "Technology", "GOOG": "Technology",
  "META": "Technology", "NVDA": "Technology", "AVGO": "Technology", "CSCO": "Technology",
  "ORCL": "Technology", "ADBE": "Technology", "CRM": "Technology", "INTC": "Technology",
  "AMD": "Technology", "TXN": "Technology", "QCOM": "Technology", "IBM": "Technology",
  "AMAT": "Technology", "MU": "Technology", "LRCX": "Technology", "ADI": "Technology",
  "KLAC": "Technology", "SNPS": "Technology", "CDNS": "Technology", "MRVL": "Technology",
  "NXPI": "Technology", "MCHP": "Technology", "ON": "Technology", "GFS": "Technology",
  "INTU": "Technology", "NOW": "Technology", "PANW": "Technology", "FTNT": "Technology",
  "WDAY": "Technology", "ADSK": "Technology", "ANSS": "Technology", "ZS": "Technology",
  "TEAM": "Technology", "MDB": "Technology", "DDOG": "Technology", "CRWD": "Technology",

  // Consumer Discretionary
  "AMZN": "Consumer", "TSLA": "Technology", "HD": "Consumer", "MCD": "Consumer",
  "NKE": "Consumer", "LOW": "Consumer", "SBUX": "Consumer", "BKNG": "Consumer",
  "ORLY": "Consumer", "MAR": "Consumer", "ABNB": "Consumer", "LULU": "Consumer",
  "CPRT": "Consumer", "ROST": "Consumer", "EBAY": "Consumer", "DLTR": "Consumer",
  "TTWO": "Consumer", "EA": "Consumer", "CMG": "Consumer", "DPZ": "Consumer",

  // Communication Services
  "NFLX": "Communication", "DIS": "Communication", "CMCSA": "Communication",
  "VZ": "Communication", "T": "Communication", "TMUS": "Communication",
  "CHTR": "Communication", "WBD": "Communication", "SIRI": "Communication",

  // Healthcare
  "UNH": "Healthcare", "LLY": "Healthcare", "JNJ": "Healthcare", "ABBV": "Healthcare",
  "MRK": "Healthcare", "PFE": "Healthcare", "TMO": "Healthcare", "ABT": "Healthcare",
  "DHR": "Healthcare", "BMY": "Healthcare", "AMGN": "Healthcare", "GILD": "Healthcare",
  "ISRG": "Healthcare", "SYK": "Healthcare", "MDT": "Healthcare", "VRTX": "Healthcare",
  "REGN": "Healthcare", "CVS": "Healthcare", "CI": "Healthcare", "ELV": "Healthcare",
  "ZTS": "Healthcare", "BDX": "Healthcare", "BSX": "Healthcare", "DXCM": "Healthcare",
  "IDXX": "Healthcare", "BIIB": "Healthcare", "ILMN": "Healthcare", "MRNA": "Healthcare",
  "AZN": "Healthcare", "GEHC": "Healthcare",

  // Financials
  "JPM": "Financial", "V": "Financial", "MA": "Financial", "BAC": "Financial",
  "WFC": "Financial", "SPGI": "Financial", "MS": "Financial", "GS": "Financial",
  "AXP": "Financial", "BLK": "Financial", "SCHW": "Financial", "C": "Financial",
  "CB": "Financial", "MMC": "Financial", "PYPL": "Financial",

  // Energy
  "XOM": "Energy", "CVX": "Energy", "COP": "Energy", "SLB": "Energy",
  "EOG": "Energy", "FANG": "Energy", "BKR": "Energy",

  // Industrials
  "UNP": "Industrial", "HON": "Industrial", "RTX": "Industrial", "CAT": "Industrial",
  "GE": "Industrial", "BA": "Industrial", "DE": "Industrial", "LMT": "Industrial",
  "UPS": "Industrial", "ETN": "Industrial", "CSX": "Industrial", "PCAR": "Industrial",
  "CTAS": "Industrial", "PAYX": "Industrial", "ODFL": "Industrial", "FAST": "Industrial",
  "VRSK": "Industrial", "ROP": "Industrial", "CDW": "Industrial",

  // Consumer Staples
  "PG": "Consumer Staples", "COST": "Consumer Staples", "KO": "Consumer Staples",
  "PEP": "Consumer Staples", "WMT": "Consumer Staples", "PM": "Consumer Staples",
  "MDLZ": "Consumer Staples", "MO": "Consumer Staples", "KDP": "Consumer Staples",
  "KHC": "Consumer Staples", "MNST": "Consumer Staples", "WBA": "Consumer Staples",

  // Utilities
  "NEE": "Utilities", "SO": "Utilities", "DUK": "Utilities", "AEP": "Utilities",
  "EXC": "Utilities", "XEL": "Utilities", "CEG": "Utilities",

  // Real Estate
  "PLD": "Real Estate", "AMT": "Real Estate", "EQIX": "Real Estate",

  // Materials
  "LIN": "Materials", "APD": "Materials", "ECL": "Materials",
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
