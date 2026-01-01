import { NextRequest, NextResponse } from "next/server";
import { getQuotes, getMarketIndices } from "@/lib/yahoo-finance";
import { rateLimitMiddleware } from "@/lib/rate-limit";
import { validateSearchParams, marketQuotesSchema, validationErrorResponse } from "@/lib/validations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// In-memory cache to reduce API calls and avoid rate limiting
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 60 seconds

// Last known good data as fallback when all APIs fail
let lastKnownGoodData: unknown = null;

// Static fallback data when Yahoo Finance is rate-limited and no cache exists
// Format matches MarketTicker component expectations: name, price, change, changePercent
const STATIC_FALLBACK_DATA = [
  { symbol: "^GSPC", name: "S&P 500", price: 5950.25, change: 12.50, changePercent: 0.21 },
  { symbol: "^IXIC", name: "NASDAQ", price: 19250.75, change: 45.30, changePercent: 0.24 },
  { symbol: "^DJI", name: "Dow Jones", price: 42500.00, change: 125.00, changePercent: 0.29 },
  { symbol: "^RUT", name: "Russell 2000", price: 2050.50, change: -5.25, changePercent: -0.26 },
  { symbol: "BTC-USD", name: "Bitcoin", price: 94500.00, change: 1250.00, changePercent: 1.34 },
  { symbol: "ETH-USD", name: "Ethereum", price: 3450.00, change: 45.00, changePercent: 1.32 },
  { symbol: "GC=F", name: "Gold", price: 2650.50, change: 8.25, changePercent: 0.31 },
  { symbol: "CL=F", name: "Crude Oil", price: 71.25, change: -0.45, changePercent: -0.63 },
];

function getCached(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() });
  // Also save as last known good data
  lastKnownGoodData = data;
}

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = rateLimitMiddleware(request, 'market');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const searchParams = request.nextUrl.searchParams;
    const symbolsParam = searchParams.get("symbols");
    const cacheKey = symbolsParam || "default-indices";

    // Check cache first
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Cache": "HIT",
        },
      });
    }

    let quotes;
    if (symbolsParam) {
      // Validate symbols if provided
      const validation = validateSearchParams(searchParams, marketQuotesSchema);
      if (!validation.success) {
        return validationErrorResponse(validation.error);
      }
      quotes = await getQuotes(validation.data.symbols);
    } else {
      // Fetch default market indices
      quotes = await getMarketIndices();
    }

    // Cache the result
    setCache(cacheKey, quotes);

    return NextResponse.json(quotes, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Error in /api/market/quotes:", error);

    // Return last known good data if available
    if (lastKnownGoodData) {
      console.log("Returning last known good market data");
      return NextResponse.json(lastKnownGoodData, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Cache": "STALE",
        },
      });
    }

    // Return static fallback data when all else fails
    console.log("Returning static fallback market data");
    return NextResponse.json(STATIC_FALLBACK_DATA, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Cache": "STATIC-FALLBACK",
      },
    });
  }
}
