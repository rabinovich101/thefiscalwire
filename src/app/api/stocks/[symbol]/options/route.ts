import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import {
  calculateCallGreeks,
  calculatePutGreeks,
  calculateDaysToExpiry,
  daysToYears,
  getRiskFreeRate,
  GreeksResult,
} from "@/lib/black-scholes";

export const dynamic = "force-dynamic";

// Create Yahoo Finance singleton
const yahooFinance = new YahooFinance();

// Cache for Yahoo options data (5 minutes)
const yahooOptionsCache = new Map<string, { data: Map<string, { callIV: number | null; putIV: number | null }>; expires: number }>();
const YAHOO_CACHE_TTL = 5 * 60 * 1000;

// Cache for stock data (dividend yield)
const stockDataCache = new Map<string, { price: number; dividendYield: number; expires: number }>();
const STOCK_CACHE_TTL = 5 * 60 * 1000;

interface YahooOption {
  strike: number;
  impliedVolatility?: number;
}

interface YahooOptionsChain {
  options?: Array<{
    calls?: YahooOption[];
    puts?: YahooOption[];
  }>;
}

/**
 * Fetch IV data from Yahoo Finance for all options
 * Returns a map keyed by strike price
 */
async function fetchYahooOptionsIV(symbol: string): Promise<Map<string, { callIV: number | null; putIV: number | null }>> {
  const cacheKey = `yahoo_options_${symbol}`;
  const cached = yahooOptionsCache.get(cacheKey);

  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  try {
    const optionsData = await yahooFinance.options(symbol) as YahooOptionsChain;
    const ivMap = new Map<string, { callIV: number | null; putIV: number | null }>();

    for (const expiration of optionsData.options || []) {
      for (const call of expiration.calls || []) {
        const key = String(call.strike);
        const existing = ivMap.get(key) || { callIV: null, putIV: null };
        existing.callIV = call.impliedVolatility ?? null;
        ivMap.set(key, existing);
      }
      for (const put of expiration.puts || []) {
        const key = String(put.strike);
        const existing = ivMap.get(key) || { callIV: null, putIV: null };
        existing.putIV = put.impliedVolatility ?? null;
        ivMap.set(key, existing);
      }
    }

    yahooOptionsCache.set(cacheKey, { data: ivMap, expires: Date.now() + YAHOO_CACHE_TTL });
    return ivMap;
  } catch (error) {
    console.error(`Failed to fetch Yahoo options for ${symbol}:`, error);
    return new Map();
  }
}

/**
 * Fetch stock price and dividend yield from Yahoo Finance
 */
async function fetchStockData(symbol: string): Promise<{ price: number; dividendYield: number }> {
  const cached = stockDataCache.get(symbol);
  if (cached && cached.expires > Date.now()) {
    return { price: cached.price, dividendYield: cached.dividendYield };
  }

  try {
    const quote = await yahooFinance.quote(symbol) as { regularMarketPrice?: number; dividendYield?: number };
    const result = {
      price: quote.regularMarketPrice || 0,
      dividendYield: (quote.dividendYield || 0) / 100, // Convert percentage to decimal
    };
    stockDataCache.set(symbol, { ...result, expires: Date.now() + STOCK_CACHE_TTL });
    return result;
  } catch (error) {
    console.error(`Failed to fetch stock data for ${symbol}:`, error);
    return { price: 0, dividendYield: 0 };
  }
}

interface OptionsParams {
  params: Promise<{ symbol: string }>;
}

interface NasdaqOptionRow {
  expirygroup?: string;
  expiryDate?: string | null;
  c_Last?: string | null;
  c_Change?: string | null;
  c_Bid?: string | null;
  c_Ask?: string | null;
  c_Volume?: string | null;
  c_Openinterest?: string | null;
  c_colour?: boolean;
  strike?: string | null;
  p_Last?: string | null;
  p_Change?: string | null;
  p_Bid?: string | null;
  p_Ask?: string | null;
  p_Volume?: string | null;
  p_Openinterest?: string | null;
  p_colour?: boolean;
  drillDownURL?: string | null;
}

interface NasdaqOptionsResponse {
  data?: {
    totalRecord?: number;
    lastTrade?: string;
    table?: {
      rows?: NasdaqOptionRow[];
    };
    filterlist?: {
      fromdate?: {
        filter?: Array<{
          label: string;
          value: string;
        }>;
      };
      excode?: {
        filter?: Array<{
          label: string;
          value: string;
        }>;
      };
      type?: {
        filter?: Array<{
          label: string;
          value: string;
        }>;
      };
    };
  };
  status?: {
    rCode?: number;
  };
}

function parseNumber(value: string | null | undefined): number | null {
  if (!value || value === "--" || value === "") return null;
  const num = parseFloat(value.replace(/,/g, ""));
  return isNaN(num) ? null : num;
}

// Returns both full date (YYYY-MM-DD) and short format (Dec 19)
function parseExpiryDates(expiryDate: string | null | undefined): { full: string | null; short: string | null } {
  if (!expiryDate) return { full: null, short: null };
  // Format from Nasdaq: "Dec 19"
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  try {
    // Try parsing with current year first
    let date = new Date(`${expiryDate}, ${currentYear}`);
    // If the date is in the past, use next year
    if (date < new Date()) {
      date = new Date(`${expiryDate}, ${nextYear}`);
    }
    // Format as YYYY-MM-DD without timezone conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return {
      full: `${year}-${month}-${day}`,
      short: expiryDate // Keep original short format "Dec 19"
    };
  } catch {
    return { full: null, short: expiryDate };
  }
}

// Format full expiration date for grouping headers (e.g., "December 19, 2025")
function formatExpiryGroupHeader(dateStr: string): string {
  try {
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return dateStr;
  }
}

export async function GET(request: NextRequest, { params }: OptionsParams) {
  try {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();

    const { searchParams } = new URL(request.url);
    const fromDateParam = searchParams.get("fromdate"); // Format: "2026-01-02" for specific date
    const excodeParam = searchParams.get("excode"); // e.g., "oprac" (Composite)
    const typeParam = searchParams.get("type"); // e.g., "all", "week", "stad"

    // Build Nasdaq API URL
    // Use fromdate=all for initial load to get all available expiration dates
    // Otherwise use the specific date requested
    let apiUrl = `https://api.nasdaq.com/api/quote/${upperSymbol}/option-chain?assetclass=stocks&limit=5000`;
    if (fromDateParam) {
      apiUrl += `&fromdate=${fromDateParam}`;
    } else {
      // Request all dates for initial load to extract all unique expiration dates
      apiUrl += `&fromdate=all`;
    }
    if (excodeParam) {
      apiUrl += `&excode=${excodeParam}`;
    }
    if (typeParam) {
      apiUrl += `&type=${typeParam}`;
    }

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Nasdaq API returned ${response.status}`);
    }

    const data: NasdaqOptionsResponse = await response.json();

    if (data.status?.rCode !== 200) {
      throw new Error("Nasdaq API error");
    }

    const rows = data.data?.table?.rows || [];

    // Extract all individual expiration dates from the expirygroup headers in rows
    // NOT from the filter list (which only gives month-level ranges)
    const expirationMonths: Array<{ label: string; value: string; fromdate: string }> = [];
    const uniqueDates = new Set<string>();

    for (const row of rows) {
      // Check if this is an expiry group header (has expirygroup but no strike)
      if (row.expirygroup && row.strike === null) {
        // expirygroup format: "December 26, 2025"
        try {
          const date = new Date(row.expirygroup);
          if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const formatted = `${year}-${month}-${day}`;
            uniqueDates.add(formatted);
          }
        } catch {
          // Skip invalid dates
        }
      }
    }

    // Build expirationMonths from unique dates
    for (const dateStr of Array.from(uniqueDates).sort()) {
      const date = new Date(dateStr + "T12:00:00");
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
      const year = date.getFullYear();

      // Determine if Monthly (3rd Friday) or Weekly
      const dayOfMonth = date.getDate();
      const dayOfWeek = date.getDay(); // 0=Sun, 5=Fri
      const isThirdFriday = dayOfWeek === 5 && dayOfMonth >= 15 && dayOfMonth <= 21;
      const typeLabel = isThirdFriday ? "(Monthly)" : "(Weekly)";

      const label = `${day} ${month} ${year} ${typeLabel}`;

      expirationMonths.push({
        label,
        value: dateStr,
        fromdate: dateStr
      });
    }

    // Already sorted from the Set iteration above, but ensure correct order
    expirationMonths.sort((a, b) => a.fromdate.localeCompare(b.fromdate));

    // Fetch Yahoo IV data and stock data in parallel
    const [yahooIVMap, stockData] = await Promise.all([
      fetchYahooOptionsIV(upperSymbol),
      fetchStockData(upperSymbol),
    ]);

    const riskFreeRate = getRiskFreeRate();

    // Parse rows into combined option chain data
    interface OptionSide {
      last: number | null;
      change: number | null;
      bid: number | null;
      ask: number | null;
      volume: number | null;
      openInterest: number | null;
      inTheMoney: boolean;
      // Greeks and IV
      iv: number | null;
      delta: number | null;
      gamma: number | null;
      theta: number | null;
      vega: number | null;
      rho: number | null;
    }

    interface OptionRow {
      expiryDate: string;
      expiryDateShort: string;
      expiryGroupHeader: string;
      strike: number;
      call: OptionSide;
      put: OptionSide;
    }

    const optionRows: OptionRow[] = [];
    let currentExpiryGroup = "";

    for (const row of rows) {
      // Check if this is an expiry group header
      if (row.expirygroup && row.strike === null) {
        currentExpiryGroup = row.expirygroup;
        continue;
      }

      // Skip rows without strike price
      if (!row.strike) continue;

      const strike = parseNumber(row.strike);
      if (strike === null) continue;

      const expiryDates = parseExpiryDates(row.expiryDate);
      const expiryDate = expiryDates.full || "";
      const expiryDateShort = expiryDates.short || "";

      // Get IV from Yahoo (keyed by strike)
      const ivData = yahooIVMap.get(String(strike)) || { callIV: null, putIV: null };

      // Calculate time to expiry
      const daysToExpiry = calculateDaysToExpiry(expiryDate);
      const timeToExpiry = daysToYears(daysToExpiry);

      // Calculate Call Greeks
      let callGreeks: GreeksResult | null = null;
      if (ivData.callIV && stockData.price > 0 && timeToExpiry > 0) {
        callGreeks = calculateCallGreeks({
          stockPrice: stockData.price,
          strikePrice: strike,
          timeToExpiry,
          riskFreeRate,
          volatility: ivData.callIV,
          dividendYield: stockData.dividendYield,
        });
      }

      // Calculate Put Greeks
      let putGreeks: GreeksResult | null = null;
      if (ivData.putIV && stockData.price > 0 && timeToExpiry > 0) {
        putGreeks = calculatePutGreeks({
          stockPrice: stockData.price,
          strikePrice: strike,
          timeToExpiry,
          riskFreeRate,
          volatility: ivData.putIV,
          dividendYield: stockData.dividendYield,
        });
      }

      const optionRow: OptionRow = {
        expiryDate,
        expiryDateShort,
        expiryGroupHeader: currentExpiryGroup || formatExpiryGroupHeader(expiryDate),
        strike,
        call: {
          last: parseNumber(row.c_Last),
          change: parseNumber(row.c_Change),
          bid: parseNumber(row.c_Bid),
          ask: parseNumber(row.c_Ask),
          volume: parseNumber(row.c_Volume),
          openInterest: parseNumber(row.c_Openinterest),
          inTheMoney: row.c_colour === true,
          iv: ivData.callIV,
          delta: callGreeks?.delta ?? null,
          gamma: callGreeks?.gamma ?? null,
          theta: callGreeks?.theta ?? null,
          vega: callGreeks?.vega ?? null,
          rho: callGreeks?.rho ?? null,
        },
        put: {
          last: parseNumber(row.p_Last),
          change: parseNumber(row.p_Change),
          bid: parseNumber(row.p_Bid),
          ask: parseNumber(row.p_Ask),
          volume: parseNumber(row.p_Volume),
          openInterest: parseNumber(row.p_Openinterest),
          inTheMoney: row.p_colour === true,
          iv: ivData.putIV,
          delta: putGreeks?.delta ?? null,
          gamma: putGreeks?.gamma ?? null,
          theta: putGreeks?.theta ?? null,
          vega: putGreeks?.vega ?? null,
          rho: putGreeks?.rho ?? null,
        },
      };

      optionRows.push(optionRow);
    }

    // Group rows by expiration date for the frontend
    const groupedOptions: Record<string, OptionRow[]> = {};
    for (const row of optionRows) {
      const key = row.expiryDate;
      if (!groupedOptions[key]) {
        groupedOptions[key] = [];
      }
      groupedOptions[key].push(row);
    }

    // Get unique expiration dates (sorted)
    const expirationDates = Object.keys(groupedOptions).sort();

    // Extract price from lastTrade string like "LAST TRADE: $356.43 (AS OF DEC 13, 2025)"
    let quotePrice: number | null = null;
    let lastTradeInfo = "";
    const lastTrade = data.data?.lastTrade;
    if (lastTrade) {
      lastTradeInfo = lastTrade;
      const priceMatch = lastTrade.match(/\$([0-9,.]+)/);
      if (priceMatch) {
        quotePrice = parseNumber(priceMatch[1]);
      }
    }

    // Parse exchange options (Option dropdown)
    const exchangeOptions = (data.data?.filterlist?.excode?.filter || []).map(f => ({
      label: f.label,
      value: f.value
    }));

    // Parse type options (Type dropdown)
    const typeOptions = (data.data?.filterlist?.type?.filter || []).map(f => ({
      label: f.label,
      value: f.value
    }));

    const optionsData = {
      symbol: upperSymbol,
      expirationMonths,
      expirationDates,
      lastTradeInfo,
      quote: {
        price: quotePrice,
        change: null,
        changePercent: null,
      },
      options: optionRows,
      groupedOptions,
      exchangeOptions,
      typeOptions,
    };

    return NextResponse.json(optionsData);
  } catch (error) {
    console.error("Options error:", error);
    return NextResponse.json(
      { error: "Failed to fetch options", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
