import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export const dynamic = "force-dynamic";

// In-memory cache to reduce API calls and avoid rate limiting
const newsCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 60 seconds

// Last known good data as fallback when Yahoo Finance fails
const lastKnownNewsData = new Map<string, unknown>();

function getCached(key: string) {
  const cached = newsCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCache(key: string, data: unknown) {
  newsCache.set(key, { data, timestamp: Date.now() });
  // Also save as last known good data for this symbol
  lastKnownNewsData.set(key, data);
}

interface NewsParams {
  params: Promise<{ symbol: string }>;
}

export async function GET(request: NextRequest, { params }: NewsParams) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  // Check cache first
  const cached = getCached(upperSymbol);
  if (cached) {
    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        "X-Cache": "HIT",
      },
    });
  }

  try {
    // Search for news related to the stock
    const results = await yahooFinance.search(upperSymbol, {
      quotesCount: 0,
      newsCount: 10,
    });

    const news = (results.news || []).map((item) => ({
      uuid: item.uuid,
      title: item.title,
      publisher: item.publisher,
      link: item.link,
      publishedAt: item.providerPublishTime,
      thumbnail: item.thumbnail?.resolutions?.[0]?.url || null,
      relatedTickers: item.relatedTickers || [],
    }));

    const responseData = { news, symbol: upperSymbol };

    // Cache the successful result
    setCache(upperSymbol, responseData);

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Stock news error:", error);

    // Return last known good data if available
    const lastKnown = lastKnownNewsData.get(upperSymbol);
    if (lastKnown) {
      console.log(`Returning last known news data for ${upperSymbol}`);
      return NextResponse.json(lastKnown, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          "X-Cache": "STALE",
        },
      });
    }

    // Return empty fallback data instead of 500 error
    console.log(`Returning fallback news data for ${upperSymbol}`);
    return NextResponse.json(
      { news: [], symbol: upperSymbol, fallback: true },
      {
        headers: {
          "Cache-Control": "no-cache",
          "X-Cache": "FALLBACK",
        },
      }
    );
  }
}
