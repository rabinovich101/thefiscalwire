import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export const dynamic = "force-dynamic";

// In-memory cache to reduce API calls and avoid rate limiting
const chartCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 60 seconds

// Last known good data as fallback when Yahoo Finance fails
const lastKnownChartData = new Map<string, unknown>();

function getCached(key: string) {
  const cached = chartCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCache(key: string, data: unknown, symbol: string) {
  chartCache.set(key, { data, timestamp: Date.now() });
  // Also save as last known good data for this symbol
  lastKnownChartData.set(symbol, data);
}

type Period = "1d" | "5d" | "1mo" | "6mo" | "ytd" | "1y" | "5y" | "max";
type Interval = "1m" | "5m" | "15m" | "30m" | "1h" | "1d" | "1wk" | "1mo";

interface ChartParams {
  params: Promise<{ symbol: string }>;
}

function getPeriodConfig(period: Period): { startDate: Date; interval: Interval } {
  const now = new Date();

  switch (period) {
    case "1d":
      const dayStart = new Date(now);
      // Look back 3 days to capture last trading day (handles weekends/holidays)
      dayStart.setDate(dayStart.getDate() - 3);
      return { startDate: dayStart, interval: "5m" };

    case "5d":
      const fiveDays = new Date(now);
      fiveDays.setDate(fiveDays.getDate() - 5);
      return { startDate: fiveDays, interval: "15m" };

    case "1mo":
      const oneMonth = new Date(now);
      oneMonth.setMonth(oneMonth.getMonth() - 1);
      return { startDate: oneMonth, interval: "1h" };

    case "6mo":
      const sixMonths = new Date(now);
      sixMonths.setMonth(sixMonths.getMonth() - 6);
      return { startDate: sixMonths, interval: "1d" };

    case "ytd":
      const ytd = new Date(now.getFullYear(), 0, 1);
      return { startDate: ytd, interval: "1d" };

    case "1y":
      const oneYear = new Date(now);
      oneYear.setFullYear(oneYear.getFullYear() - 1);
      return { startDate: oneYear, interval: "1d" };

    case "5y":
      const fiveYears = new Date(now);
      fiveYears.setFullYear(fiveYears.getFullYear() - 5);
      return { startDate: fiveYears, interval: "1wk" };

    case "max":
      const maxDate = new Date(1970, 0, 1);
      return { startDate: maxDate, interval: "1mo" };

    default:
      const defaultMonth = new Date(now);
      defaultMonth.setMonth(defaultMonth.getMonth() - 1);
      return { startDate: defaultMonth, interval: "1d" };
  }
}

function formatChartDate(date: Date, period: Period): string {
  if (period === "1d" || period === "5d") {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  if (period === "1mo" || period === "6mo" || period === "ytd") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

export async function GET(request: NextRequest, { params }: ChartParams) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  const searchParams = request.nextUrl.searchParams;
  const period = (searchParams.get("period") || "1mo") as Period;
  const customInterval = searchParams.get("interval") as Interval | null;

  const { startDate, interval: defaultInterval } = getPeriodConfig(period);
  const interval = customInterval || defaultInterval;

  const cacheKey = `${upperSymbol}-${period}-${interval}`;

  // Check cache first
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        "X-Cache": "HIT",
      },
    });
  }

  try {
    const result = await yahooFinance.chart(upperSymbol, {
      period1: startDate,
      period2: new Date(),
      interval: interval,
    });

    if (!result.quotes || result.quotes.length === 0) {
      return NextResponse.json({ data: [], symbol: upperSymbol, period });
    }

    // Get the first valid close price for calculating change
    const firstValidQuote = result.quotes.find(
      (q) => q.close !== null && q.close !== undefined
    );
    const firstPrice = firstValidQuote?.close || 0;

    const chartData = result.quotes
      .filter((q) => q.close !== null && q.close !== undefined)
      .map((quote) => ({
        time: formatChartDate(new Date(quote.date), period),
        timestamp: new Date(quote.date).getTime(),
        price: quote.close as number,
        open: quote.open,
        high: quote.high,
        low: quote.low,
        volume: quote.volume,
      }));

    // Calculate price change over the period
    const lastPrice = chartData[chartData.length - 1]?.price || 0;
    const priceChange = lastPrice - firstPrice;
    const percentChange = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;

    // Get high/low safely
    const prices = chartData.map((d) => d.price);
    const high = prices.length > 0 ? Math.max(...prices) : 0;
    const low = prices.length > 0 ? Math.min(...prices) : 0;

    const responseData = {
      symbol: upperSymbol,
      period,
      data: chartData,
      summary: {
        firstPrice,
        lastPrice,
        priceChange,
        percentChange,
        high,
        low,
      },
    };

    // Cache the successful result
    setCache(cacheKey, responseData, upperSymbol);

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control":
          period === "1d"
            ? "no-cache"
            : "public, s-maxage=300, stale-while-revalidate=600",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Stock chart error:", error);

    // Return last known good data if available
    const lastKnown = lastKnownChartData.get(upperSymbol);
    if (lastKnown) {
      console.log(`Returning last known chart data for ${upperSymbol}`);
      return NextResponse.json(lastKnown, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          "X-Cache": "STALE",
        },
      });
    }

    // Return empty fallback data instead of 500 error
    console.log(`Returning fallback chart data for ${upperSymbol}`);
    return NextResponse.json(
      {
        symbol: upperSymbol,
        period,
        data: [],
        summary: {
          firstPrice: 0,
          lastPrice: 0,
          priceChange: 0,
          percentChange: 0,
          high: 0,
          low: 0,
        },
        fallback: true,
      },
      {
        headers: {
          "Cache-Control": "no-cache",
          "X-Cache": "FALLBACK",
        },
      }
    );
  }
}
