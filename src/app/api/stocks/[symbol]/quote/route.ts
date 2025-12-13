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
        "calendarEvents",
      ],
    });

    const price = result.price;
    const summary = result.summaryDetail;
    const keyStats = result.defaultKeyStatistics;
    const financial = result.financialData;
    const profile = result.summaryProfile;
    const calendar = result.calendarEvents;

    // Calculate Enterprise Value correctly: Market Cap + Total Debt - Total Cash
    const marketCap = price?.marketCap || summary?.marketCap || 0;
    const totalDebt = financial?.totalDebt || 0;
    const totalCash = financial?.totalCash || 0;
    const calculatedEnterpriseValue = marketCap + totalDebt - totalCash;

    // Use calculated EV if it differs significantly from API value (API value is sometimes wrong)
    const apiEnterpriseValue = keyStats?.enterpriseValue || 0;
    // If API EV is less than 10% of market cap, it's likely wrong - use calculated value
    const enterpriseValue = apiEnterpriseValue < marketCap * 0.5 ? calculatedEnterpriseValue : apiEnterpriseValue;

    // Recalculate EV ratios with corrected Enterprise Value
    const revenue = financial?.totalRevenue || null;
    const ebitda = financial?.ebitda || null;
    const calculatedEvToRevenue = revenue && enterpriseValue ? enterpriseValue / revenue : null;
    const calculatedEvToEbitda = ebitda && enterpriseValue ? enterpriseValue / ebitda : null;

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

      // Bid/Ask
      bid: summary?.bid || null,
      ask: summary?.ask || null,
      bidSize: summary?.bidSize || null,
      askSize: summary?.askSize || null,

      // 52 Week Range
      fiftyTwoWeekHigh: summary?.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: summary?.fiftyTwoWeekLow || 0,
      fiftyDayAverage: summary?.fiftyDayAverage || 0,
      twoHundredDayAverage: summary?.twoHundredDayAverage || 0,

      // Market Cap & Valuation
      marketCap: marketCap,
      enterpriseValue: enterpriseValue,

      // Ratios
      trailingPE: summary?.trailingPE || keyStats?.trailingPE || null,
      forwardPE: summary?.forwardPE || keyStats?.forwardPE || null,
      pegRatio: keyStats?.pegRatio || null,
      priceToBook: keyStats?.priceToBook || null,
      priceToSales: summary?.priceToSalesTrailing12Months || keyStats?.priceToSalesTrailing12Months || null,

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
      revenue: revenue,
      revenuePerShare: financial?.revenuePerShare || null,
      grossProfit: financial?.grossProfits || null,
      ebitda: ebitda,
      // Use keyStats.netIncomeToCommon as primary source (financialData often doesn't have it)
      netIncome: (keyStats as Record<string, unknown>)?.netIncomeToCommon as number || financial?.netIncomeToCommon || null,
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
      impliedSharesOutstanding: (keyStats as Record<string, unknown>)?.impliedSharesOutstanding as number || keyStats?.sharesOutstanding || null,
      floatShares: keyStats?.floatShares || null,
      sharesShort: keyStats?.sharesShort || null,
      shortRatio: keyStats?.shortRatio || null,
      shortPercentFloat: keyStats?.shortPercentOfFloat || null,
      shortPercentSharesOut: keyStats?.sharesPercentSharesOut || null,
      sharesShortPriorMonth: typeof keyStats?.sharesShortPriorMonth === "number" ? keyStats.sharesShortPriorMonth : null,
      heldPercentInsiders: keyStats?.heldPercentInsiders || null,
      heldPercentInstitutions: keyStats?.heldPercentInstitutions || null,

      // Beta
      beta: keyStats?.beta || summary?.beta || null,

      // 52-Week Change
      fiftyTwoWeekChange: keyStats?.["52WeekChange"] || null,
      sandP52WeekChange: keyStats?.SandP52WeekChange || null,

      // Enterprise Value Ratios (use calculated values for accuracy)
      enterpriseToRevenue: calculatedEvToRevenue,
      enterpriseToEbitda: calculatedEvToEbitda,

      // Quarterly Growth
      earningsQuarterlyGrowth: keyStats?.earningsQuarterlyGrowth || null,
      revenueGrowth: financial?.revenueGrowth || null,

      // Cash Flow
      operatingCashflow: financial?.operatingCashflow || null,
      freeCashflow: financial?.freeCashflow || null,
      totalCashPerShare: financial?.totalCashPerShare || null,

      // Fiscal Year Info
      lastFiscalYearEnd: keyStats?.lastFiscalYearEnd
        ? (keyStats.lastFiscalYearEnd instanceof Date
            ? keyStats.lastFiscalYearEnd.toISOString()
            : typeof keyStats.lastFiscalYearEnd === "number"
              ? new Date(keyStats.lastFiscalYearEnd * 1000).toISOString()
              : null)
        : null,
      mostRecentQuarter: keyStats?.mostRecentQuarter
        ? (keyStats.mostRecentQuarter instanceof Date
            ? keyStats.mostRecentQuarter.toISOString()
            : typeof keyStats.mostRecentQuarter === "number"
              ? new Date(keyStats.mostRecentQuarter * 1000).toISOString()
              : null)
        : null,

      // Dividend Details
      trailingAnnualDividendRate: summary?.trailingAnnualDividendRate || null,
      trailingAnnualDividendYield: summary?.trailingAnnualDividendYield || null,
      fiveYearAvgDividendYield: summary?.fiveYearAvgDividendYield || null,
      dividendDate: calendar?.dividendDate || null,

      // Stock Splits
      lastSplitFactor: keyStats?.lastSplitFactor || null,
      lastSplitDate: keyStats?.lastSplitDate
        ? new Date(keyStats.lastSplitDate * 1000).toISOString()
        : null,

      // Analyst Targets
      targetMeanPrice: financial?.targetMeanPrice || null,
      targetHighPrice: financial?.targetHighPrice || null,
      targetLowPrice: financial?.targetLowPrice || null,
      numberOfAnalystOpinions: financial?.numberOfAnalystOpinions || null,
      recommendationKey: financial?.recommendationKey || null,

      // Earnings Date
      earningsDate: calendar?.earnings?.earningsDate?.[0] || null,

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
