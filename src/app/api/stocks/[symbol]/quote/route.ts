import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export const dynamic = "force-dynamic";

interface QuoteParams {
  params: Promise<{ symbol: string }>;
}

export async function GET(request: NextRequest, { params }: QuoteParams) {
  try {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();

    // Fetch comprehensive stock data using quoteSummary
    const result = await yahooFinance.quoteSummary(upperSymbol, {
      modules: [
        "price",
        "summaryDetail",
        "defaultKeyStatistics",
        "financialData",
        "summaryProfile",
      ],
    });

    const price = result.price;
    const summary = result.summaryDetail;
    const keyStats = result.defaultKeyStatistics;
    const financial = result.financialData;
    const profile = result.summaryProfile;

    // Format the response with all the data we need
    const stockData = {
      // Basic Info
      symbol: price?.symbol || upperSymbol,
      name: price?.longName || price?.shortName || upperSymbol,
      exchange: price?.exchangeName || "",
      currency: price?.currency || "USD",
      type: price?.quoteType || "EQUITY",

      // Price Data
      price: price?.regularMarketPrice || 0,
      previousClose: price?.regularMarketPreviousClose || summary?.previousClose || 0,
      open: price?.regularMarketOpen || summary?.open || 0,
      dayHigh: price?.regularMarketDayHigh || summary?.dayHigh || 0,
      dayLow: price?.regularMarketDayLow || summary?.dayLow || 0,
      change: price?.regularMarketChange || 0,
      changePercent: price?.regularMarketChangePercent || 0,

      // Volume
      volume: price?.regularMarketVolume || summary?.volume || 0,
      avgVolume: summary?.averageVolume || 0,
      avgVolume10Day: summary?.averageVolume10days || 0,

      // 52 Week Range
      fiftyTwoWeekHigh: summary?.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: summary?.fiftyTwoWeekLow || 0,
      fiftyDayAverage: summary?.fiftyDayAverage || 0,
      twoHundredDayAverage: summary?.twoHundredDayAverage || 0,

      // Market Cap & Valuation
      marketCap: price?.marketCap || summary?.marketCap || 0,
      enterpriseValue: keyStats?.enterpriseValue || 0,

      // Ratios
      trailingPE: summary?.trailingPE || keyStats?.trailingPE || null,
      forwardPE: summary?.forwardPE || keyStats?.forwardPE || null,
      pegRatio: keyStats?.pegRatio || null,
      priceToBook: keyStats?.priceToBook || null,
      priceToSales: keyStats?.priceToSalesTrailing12Months || null,

      // Per Share Data
      eps: keyStats?.trailingEps || null,
      forwardEps: keyStats?.forwardEps || null,
      bookValue: keyStats?.bookValue || null,

      // Dividend
      dividendRate: summary?.dividendRate || null,
      dividendYield: summary?.dividendYield || null,
      exDividendDate: summary?.exDividendDate || null,
      payoutRatio: summary?.payoutRatio || null,

      // Financials
      revenue: financial?.totalRevenue || null,
      revenuePerShare: financial?.revenuePerShare || null,
      grossProfit: financial?.grossProfits || null,
      ebitda: financial?.ebitda || null,
      netIncome: financial?.netIncomeToCommon || null,
      profitMargin: financial?.profitMargins || null,
      operatingMargin: financial?.operatingMargins || null,
      returnOnEquity: financial?.returnOnEquity || null,
      returnOnAssets: financial?.returnOnAssets || null,

      // Balance Sheet
      totalCash: financial?.totalCash || null,
      totalDebt: financial?.totalDebt || null,
      debtToEquity: financial?.debtToEquity || null,
      currentRatio: financial?.currentRatio || null,

      // Shares
      sharesOutstanding: keyStats?.sharesOutstanding || null,
      floatShares: keyStats?.floatShares || null,
      sharesShort: keyStats?.sharesShort || null,
      shortRatio: keyStats?.shortRatio || null,
      shortPercentFloat: keyStats?.shortPercentOfFloat || null,

      // Beta
      beta: keyStats?.beta || summary?.beta || null,

      // Company Profile
      sector: profile?.sector || null,
      industry: profile?.industry || null,
      website: profile?.website || null,
      description: profile?.longBusinessSummary || null,
      employees: profile?.fullTimeEmployees || null,
      headquarters: profile?.city && profile?.country
        ? `${profile.city}, ${profile.country}`
        : null,

      // Market State
      marketState: price?.marketState || "CLOSED",
      preMarketPrice: price?.preMarketPrice || null,
      preMarketChange: price?.preMarketChange || null,
      preMarketChangePercent: price?.preMarketChangePercent || null,
      postMarketPrice: price?.postMarketPrice || null,
      postMarketChange: price?.postMarketChange || null,
      postMarketChangePercent: price?.postMarketChangePercent || null,

      // Timestamps
      regularMarketTime: price?.regularMarketTime || null,
    };

    return NextResponse.json(stockData, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Stock quote error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}
