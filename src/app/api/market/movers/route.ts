import { NextRequest, NextResponse } from "next/server";
import {
  getTopGainers,
  getTopLosers,
  getTopGainersDirect,
  getTopLosersDirect,
  type MarketQuote,
} from "@/lib/yahoo-finance";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// In-memory cache to reduce API calls and avoid rate limiting
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 60 seconds

// Last known good data as fallback
let lastKnownGoodData: { gainers?: MarketQuote[]; losers?: MarketQuote[] } = {};

// Static fallback data when both Yahoo Finance and Nasdaq are down
// Format matches MarketMovers component expectations: name, price, change, changePercent
const STATIC_FALLBACK_GAINERS: MarketQuote[] = [
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 140.50, change: 5.25, changePercent: 3.88 },
  { symbol: "TSLA", name: "Tesla, Inc.", price: 425.00, change: 12.50, changePercent: 3.03 },
  { symbol: "AMD", name: "Advanced Micro Devices", price: 125.75, change: 3.25, changePercent: 2.65 },
  { symbol: "META", name: "Meta Platforms, Inc.", price: 605.00, change: 14.50, changePercent: 2.46 },
  { symbol: "AAPL", name: "Apple Inc.", price: 248.50, change: 4.75, changePercent: 1.95 },
];

const STATIC_FALLBACK_LOSERS: MarketQuote[] = [
  { symbol: "INTC", name: "Intel Corporation", price: 20.25, change: -0.85, changePercent: -4.03 },
  { symbol: "BA", name: "The Boeing Company", price: 175.50, change: -5.25, changePercent: -2.90 },
  { symbol: "DIS", name: "The Walt Disney Company", price: 112.75, change: -2.50, changePercent: -2.17 },
  { symbol: "NKE", name: "NIKE, Inc.", price: 76.25, change: -1.45, changePercent: -1.87 },
  { symbol: "PFE", name: "Pfizer Inc.", price: 26.50, change: -0.45, changePercent: -1.67 },
];

type MoverSource = "yahoo" | "direct";

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

// Try Yahoo screener first, fall back to Nasdaq-derived direct path. Empty result counts as failure.
async function fetchGainersWithFallback(): Promise<{ data: MarketQuote[]; source: MoverSource }> {
  try {
    const data = await getTopGainers();
    if (data.length > 0) return { data, source: "yahoo" };
    console.warn("[/api/market/movers] Yahoo getTopGainers returned empty, trying direct path");
  } catch (error) {
    console.error("[/api/market/movers] Yahoo getTopGainers failed:", error instanceof Error ? error.message : String(error));
  }
  const direct = await getTopGainersDirect();
  return { data: direct, source: "direct" };
}

async function fetchLosersWithFallback(): Promise<{ data: MarketQuote[]; source: MoverSource }> {
  try {
    const data = await getTopLosers();
    if (data.length > 0) return { data, source: "yahoo" };
    console.warn("[/api/market/movers] Yahoo getTopLosers returned empty, trying direct path");
  } catch (error) {
    console.error("[/api/market/movers] Yahoo getTopLosers failed:", error instanceof Error ? error.message : String(error));
  }
  const direct = await getTopLosersDirect();
  return { data: direct, source: "direct" };
}

const NO_CACHE_HEADERS = { "Cache-Control": "no-cache, no-store, must-revalidate" };

function staleOrStatic(kind: "gainers" | "losers" | "all"): NextResponse {
  if (kind === "all" && (lastKnownGoodData.gainers || lastKnownGoodData.losers)) {
    return NextResponse.json(lastKnownGoodData, { headers: { ...NO_CACHE_HEADERS, "X-Cache": "STALE" } });
  }
  if (kind === "gainers" && lastKnownGoodData.gainers) {
    return NextResponse.json(lastKnownGoodData.gainers, { headers: { ...NO_CACHE_HEADERS, "X-Cache": "STALE" } });
  }
  if (kind === "losers" && lastKnownGoodData.losers) {
    return NextResponse.json(lastKnownGoodData.losers, { headers: { ...NO_CACHE_HEADERS, "X-Cache": "STALE" } });
  }
  if (kind === "all") {
    return NextResponse.json(
      { gainers: STATIC_FALLBACK_GAINERS, losers: STATIC_FALLBACK_LOSERS },
      { headers: { ...NO_CACHE_HEADERS, "X-Cache": "STATIC-FALLBACK" } }
    );
  }
  return NextResponse.json(
    kind === "gainers" ? STATIC_FALLBACK_GAINERS : STATIC_FALLBACK_LOSERS,
    { headers: { ...NO_CACHE_HEADERS, "X-Cache": "STATIC-FALLBACK" } }
  );
}

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type");

    if (type === "gainers") {
      const cached = getCached("gainers");
      if (cached) {
        return NextResponse.json(cached, { headers: { ...NO_CACHE_HEADERS, "X-Cache": "HIT" } });
      }
      const { data, source } = await fetchGainersWithFallback();
      if (data.length === 0) return staleOrStatic("gainers");
      setCache("gainers", data);
      lastKnownGoodData.gainers = data;
      const xCache = source === "yahoo" ? "MISS" : "DIRECT-API";
      return NextResponse.json(data, { headers: { ...NO_CACHE_HEADERS, "X-Cache": xCache } });
    }

    if (type === "losers") {
      const cached = getCached("losers");
      if (cached) {
        return NextResponse.json(cached, { headers: { ...NO_CACHE_HEADERS, "X-Cache": "HIT" } });
      }
      const { data, source } = await fetchLosersWithFallback();
      if (data.length === 0) return staleOrStatic("losers");
      setCache("losers", data);
      lastKnownGoodData.losers = data;
      const xCache = source === "yahoo" ? "MISS" : "DIRECT-API";
      return NextResponse.json(data, { headers: { ...NO_CACHE_HEADERS, "X-Cache": xCache } });
    }

    // Combined: both gainers and losers
    const cached = getCached("all");
    if (cached) {
      return NextResponse.json(cached, { headers: { ...NO_CACHE_HEADERS, "X-Cache": "HIT" } });
    }

    const [gainersResult, losersResult] = await Promise.all([
      fetchGainersWithFallback(),
      fetchLosersWithFallback(),
    ]);

    if (gainersResult.data.length === 0 && losersResult.data.length === 0) {
      return staleOrStatic("all");
    }

    const result = { gainers: gainersResult.data, losers: losersResult.data };
    setCache("all", result);
    setCache("gainers", gainersResult.data);
    setCache("losers", losersResult.data);
    lastKnownGoodData = result;

    // If either path used direct, surface that to clients
    const usedDirect = gainersResult.source === "direct" || losersResult.source === "direct";
    return NextResponse.json(result, {
      headers: { ...NO_CACHE_HEADERS, "X-Cache": usedDirect ? "DIRECT-API" : "MISS" },
    });
  } catch (error) {
    console.error("Error in /api/market/movers:", error);
    return staleOrStatic("all");
  }
}
