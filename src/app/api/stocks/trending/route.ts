import { NextRequest, NextResponse } from "next/server";
import {
  getTrendingStocks,
  getMostActiveStocks,
  getTopGainers,
  getTopLosers,
  getTopGainersDirect,
  getTopLosersDirect,
  getMostActiveDirect,
  type TrendingStock,
  type MarketQuote,
} from "@/lib/yahoo-finance";
import { rateLimitMiddleware } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function padToTrending(q: MarketQuote): TrendingStock {
  return {
    symbol: q.symbol,
    name: q.name,
    price: q.price,
    change: q.change,
    changePercent: q.changePercent,
    volume: 0,
    avgVolume: 0,
    marketCap: 0,
    fiftyTwoWeekHigh: 0,
    fiftyTwoWeekLow: 0,
    fiftyDayAverage: 0,
    twoHundredDayAverage: 0,
    trailingPE: null,
    forwardPE: null,
    eps: null,
    dividendYield: null,
    beta: null,
    exchange: "",
    quoteType: "EQUITY",
  };
}

export async function GET(request: NextRequest) {
  const rateLimitResponse = rateLimitMiddleware(request, "market");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const [trending, mostActive, gainers, losers] = await Promise.all([
      getTrendingStocks(25).catch((): TrendingStock[] => []),
      getMostActiveStocks(10).catch((): TrendingStock[] => []),
      getTopGainers().catch((): MarketQuote[] => []),
      getTopLosers().catch((): MarketQuote[] => []),
    ]);

    // If Yahoo screener paths failed (returning empty), pull a single Nasdaq-derived
    // active list and reuse it for both trending and mostActive slots.
    let finalTrending: TrendingStock[] = trending;
    let finalMostActive: TrendingStock[] = mostActive;
    if (trending.length === 0 || mostActive.length === 0) {
      const direct = (await getMostActiveDirect(25)).map(padToTrending);
      if (trending.length === 0) finalTrending = direct;
      if (mostActive.length === 0) finalMostActive = direct.slice(0, 10);
    }

    const finalGainers = gainers.length > 0 ? gainers : await getTopGainersDirect();
    const finalLosers = losers.length > 0 ? losers : await getTopLosersDirect();

    return NextResponse.json({
      trending: finalTrending,
      mostActive: finalMostActive,
      gainers: finalGainers,
      losers: finalLosers,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching trending stocks:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending stocks" },
      { status: 500 }
    );
  }
}
