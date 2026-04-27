import { NextRequest, NextResponse } from "next/server";
import { getChartData, getChartDataDirect } from "@/lib/yahoo-finance";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Period = "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y";

const validPeriods: Period[] = ["1d", "5d", "1mo", "3mo", "6mo", "1y"];

const NO_CACHE_HEADERS = { "Cache-Control": "no-cache, no-store, must-revalidate" };

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get("symbol");
  const periodParam = searchParams.get("period") || "1mo";

  if (!symbol) {
    return NextResponse.json(
      { error: "Symbol parameter is required" },
      { status: 400 }
    );
  }

  // Validate period
  const period = validPeriods.includes(periodParam as Period)
    ? (periodParam as Period)
    : "1mo";

  // Try Yahoo library first; on throw or empty result, fall back to direct v8 chart API.
  let chartData = await getChartData(symbol, period).catch((err) => {
    console.error(`[/api/market/chart] Yahoo lib failed for ${symbol}/${period}:`, err instanceof Error ? err.message : err);
    return [];
  });

  let source = "yahoo";
  if (chartData.length === 0) {
    chartData = await getChartDataDirect(symbol, period);
    source = "direct";
  }

  return NextResponse.json(chartData, {
    headers: { ...NO_CACHE_HEADERS, "X-Source": source },
  });
}
