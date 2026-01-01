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

    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}
