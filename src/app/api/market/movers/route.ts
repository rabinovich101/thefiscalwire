import { NextRequest, NextResponse } from "next/server";
import { getTopGainers, getTopLosers } from "@/lib/yahoo-finance";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// In-memory cache to reduce API calls and avoid rate limiting
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 60 seconds

// Last known good data as fallback
let lastKnownGoodData: { gainers?: unknown; losers?: unknown } = {};

// Static fallback data when Yahoo Finance is rate-limited
const STATIC_FALLBACK_GAINERS = [
  { symbol: "NVDA", shortName: "NVIDIA Corporation", regularMarketPrice: 140.50, regularMarketChange: 5.25, regularMarketChangePercent: 3.88 },
  { symbol: "TSLA", shortName: "Tesla, Inc.", regularMarketPrice: 425.00, regularMarketChange: 12.50, regularMarketChangePercent: 3.03 },
  { symbol: "AMD", shortName: "Advanced Micro Devices", regularMarketPrice: 125.75, regularMarketChange: 3.25, regularMarketChangePercent: 2.65 },
  { symbol: "META", shortName: "Meta Platforms, Inc.", regularMarketPrice: 605.00, regularMarketChange: 14.50, regularMarketChangePercent: 2.46 },
  { symbol: "AAPL", shortName: "Apple Inc.", regularMarketPrice: 248.50, regularMarketChange: 4.75, regularMarketChangePercent: 1.95 },
];

const STATIC_FALLBACK_LOSERS = [
  { symbol: "INTC", shortName: "Intel Corporation", regularMarketPrice: 20.25, regularMarketChange: -0.85, regularMarketChangePercent: -4.03 },
  { symbol: "BA", shortName: "The Boeing Company", regularMarketPrice: 175.50, regularMarketChange: -5.25, regularMarketChangePercent: -2.90 },
  { symbol: "DIS", shortName: "The Walt Disney Company", regularMarketPrice: 112.75, regularMarketChange: -2.50, regularMarketChangePercent: -2.17 },
  { symbol: "NKE", shortName: "NIKE, Inc.", regularMarketPrice: 76.25, regularMarketChange: -1.45, regularMarketChangePercent: -1.87 },
  { symbol: "PFE", shortName: "Pfizer Inc.", regularMarketPrice: 26.50, regularMarketChange: -0.45, regularMarketChangePercent: -1.67 },
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
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type"); // "gainers" or "losers"

    if (type === "gainers") {
      // Check cache first
      const cached = getCached("gainers");
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "X-Cache": "HIT",
          },
        });
      }

      const gainers = await getTopGainers();
      setCache("gainers", gainers);
      lastKnownGoodData.gainers = gainers;

      return NextResponse.json(gainers, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Cache": "MISS",
        },
      });
    }

    if (type === "losers") {
      // Check cache first
      const cached = getCached("losers");
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "X-Cache": "HIT",
          },
        });
      }

      const losers = await getTopLosers();
      setCache("losers", losers);
      lastKnownGoodData.losers = losers;

      return NextResponse.json(losers, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Cache": "MISS",
        },
      });
    }

    // Check cache for combined data
    const cached = getCached("all");
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Cache": "HIT",
        },
      });
    }

    // Fetch both if no type specified
    const [gainers, losers] = await Promise.all([
      getTopGainers(),
      getTopLosers(),
    ]);

    const result = { gainers, losers };
    setCache("all", result);
    setCache("gainers", gainers);
    setCache("losers", losers);
    lastKnownGoodData = { gainers, losers };

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Error in /api/market/movers:", error);

    // Return last known good data if available
    if (lastKnownGoodData.gainers || lastKnownGoodData.losers) {
      console.log("Returning last known good movers data");
      return NextResponse.json(lastKnownGoodData, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Cache": "STALE",
        },
      });
    }

    // Return static fallback data when all else fails
    console.log("Returning static fallback movers data");
    return NextResponse.json({
      gainers: STATIC_FALLBACK_GAINERS,
      losers: STATIC_FALLBACK_LOSERS,
    }, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Cache": "STATIC-FALLBACK",
      },
    });
  }
}
