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
// Format matches MarketMovers component expectations: name, price, change, changePercent
const STATIC_FALLBACK_GAINERS = [
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 140.50, change: 5.25, changePercent: 3.88 },
  { symbol: "TSLA", name: "Tesla, Inc.", price: 425.00, change: 12.50, changePercent: 3.03 },
  { symbol: "AMD", name: "Advanced Micro Devices", price: 125.75, change: 3.25, changePercent: 2.65 },
  { symbol: "META", name: "Meta Platforms, Inc.", price: 605.00, change: 14.50, changePercent: 2.46 },
  { symbol: "AAPL", name: "Apple Inc.", price: 248.50, change: 4.75, changePercent: 1.95 },
];

const STATIC_FALLBACK_LOSERS = [
  { symbol: "INTC", name: "Intel Corporation", price: 20.25, change: -0.85, changePercent: -4.03 },
  { symbol: "BA", name: "The Boeing Company", price: 175.50, change: -5.25, changePercent: -2.90 },
  { symbol: "DIS", name: "The Walt Disney Company", price: 112.75, change: -2.50, changePercent: -2.17 },
  { symbol: "NKE", name: "NIKE, Inc.", price: 76.25, change: -1.45, changePercent: -1.87 },
  { symbol: "PFE", name: "Pfizer Inc.", price: 26.50, change: -0.45, changePercent: -1.67 },
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
