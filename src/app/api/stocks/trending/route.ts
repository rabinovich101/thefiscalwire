import { NextResponse } from "next/server";
import { getTrendingStocks, getMostActiveStocks, getTopGainers, getTopLosers } from "@/lib/yahoo-finance";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Fetch all data in parallel
    const [trending, mostActive, gainers, losers] = await Promise.all([
      getTrendingStocks(25).catch(() => []),
      getMostActiveStocks(10).catch(() => []),
      getTopGainers().catch(() => []),
      getTopLosers().catch(() => []),
    ]);

    return NextResponse.json({
      trending,
      mostActive,
      gainers,
      losers,
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
