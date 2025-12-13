import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export const dynamic = "force-dynamic";

interface OptionsParams {
  params: Promise<{ symbol: string }>;
}

export async function GET(request: NextRequest, { params }: OptionsParams) {
  try {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    const result = await yahooFinance.options(upperSymbol, {
      date: date ? new Date(date) : undefined,
    });

    // Format option data
    const formatOption = (option: {
      contractSymbol?: string;
      strike?: number;
      currency?: string;
      lastPrice?: number;
      change?: number;
      percentChange?: number;
      volume?: number;
      openInterest?: number;
      bid?: number;
      ask?: number;
      impliedVolatility?: number;
      inTheMoney?: boolean;
      expiration?: Date;
    }) => ({
      contractSymbol: option.contractSymbol || null,
      strike: option.strike || null,
      currency: option.currency || "USD",
      lastPrice: option.lastPrice || null,
      change: option.change || null,
      percentChange: option.percentChange || null,
      volume: option.volume || null,
      openInterest: option.openInterest || null,
      bid: option.bid || null,
      ask: option.ask || null,
      impliedVolatility: option.impliedVolatility || null,
      inTheMoney: option.inTheMoney || false,
      expiration: option.expiration
        ? new Date(option.expiration).toISOString().split("T")[0]
        : null,
    });

    const optionsData = {
      symbol: upperSymbol,
      expirationDates: (result.expirationDates || []).map((d: Date) =>
        new Date(d).toISOString().split("T")[0]
      ),
      strikes: result.strikes || [],
      quote: result.quote
        ? {
            price: result.quote.regularMarketPrice || null,
            change: result.quote.regularMarketChange || null,
            changePercent: result.quote.regularMarketChangePercent || null,
          }
        : null,
      calls: (result.options?.[0]?.calls || []).map(formatOption),
      puts: (result.options?.[0]?.puts || []).map(formatOption),
    };

    return NextResponse.json(optionsData);
  } catch (error) {
    console.error("Options error:", error);
    return NextResponse.json(
      { error: "Failed to fetch options" },
      { status: 500 }
    );
  }
}
