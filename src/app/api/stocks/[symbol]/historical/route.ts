import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export const dynamic = "force-dynamic";

interface HistoricalParams {
  params: Promise<{ symbol: string }>;
}

export async function GET(request: NextRequest, { params }: HistoricalParams) {
  try {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "1mo";
    const interval = searchParams.get("interval") || "1d";

    // Calculate date range based on period
    const now = new Date();
    let period1: Date;

    switch (period) {
      case "5d":
        period1 = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
        break;
      case "1mo":
        period1 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "3mo":
        period1 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "6mo":
        period1 = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        period1 = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case "2y":
        period1 = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
        break;
      case "5y":
        period1 = new Date(now.getTime() - 1825 * 24 * 60 * 60 * 1000);
        break;
      case "max":
        period1 = new Date("1970-01-01");
        break;
      default:
        period1 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const result = await yahooFinance.chart(upperSymbol, {
      period1,
      period2: now,
      interval: interval as "1d" | "1wk" | "1mo",
    });

    const quotes = result.quotes || [];

    // Format the data
    const historicalData = quotes.map((quote) => ({
      date: quote.date ? new Date(quote.date).toISOString().split("T")[0] : "",
      open: quote.open?.toFixed(2) || null,
      high: quote.high?.toFixed(2) || null,
      low: quote.low?.toFixed(2) || null,
      close: quote.close?.toFixed(2) || null,
      adjClose: quote.adjclose?.toFixed(2) || null,
      volume: quote.volume || null,
    })).filter(q => q.date);

    return NextResponse.json({
      symbol: upperSymbol,
      period,
      interval,
      data: historicalData.reverse(), // Most recent first
    });
  } catch (error) {
    console.error("Historical data error:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical data" },
      { status: 500 }
    );
  }
}
