import { NextRequest, NextResponse } from "next/server";
import { getChartData } from "@/lib/yahoo-finance";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Period = "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y";

const validPeriods: Period[] = ["1d", "5d", "1mo", "3mo", "6mo", "1y"];

export async function GET(request: NextRequest) {
  try {
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

    const chartData = await getChartData(symbol, period);

    return NextResponse.json(chartData, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error in /api/market/chart:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
