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
