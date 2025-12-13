import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export const dynamic = "force-dynamic";

interface ValuationHistoryParams {
  params: Promise<{ symbol: string }>;
}

// Get the last day of each completed quarter for the past 5 quarters
function getQuarterEndDates(): Date[] {
  const dates: Date[] = [];
  const now = new Date();

  // Start from the PREVIOUS quarter (most recently completed), not current quarter
  let year = now.getFullYear();
  let quarter = Math.floor(now.getMonth() / 3) - 1; // Previous quarter (0-3)

  // If we're in Q1 (Jan-Mar), previous quarter is Q4 of last year
  if (quarter < 0) {
    quarter = 3;
    year--;
  }

  for (let i = 0; i < 5; i++) {
    // Quarter end months: 2=Mar (Q1 end), 5=Jun (Q2 end), 8=Sep (Q3 end), 11=Dec (Q4 end)
    const quarterEndMonth = (quarter + 1) * 3 - 1; // 2, 5, 8, 11 (Mar, Jun, Sep, Dec)
    const lastDayOfMonth = new Date(year, quarterEndMonth + 1, 0).getDate();
    const quarterEndDate = new Date(year, quarterEndMonth, lastDayOfMonth);

    // Only add if the date is in the past
    if (quarterEndDate < now) {
      dates.push(quarterEndDate);
    }

    // Move to previous quarter
    quarter--;
    if (quarter < 0) {
      quarter = 3;
      year--;
    }
  }

  return dates;
}

export async function GET(request: NextRequest, { params }: ValuationHistoryParams) {
  try {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();

    // Get current financial data
    const summaryResult = await yahooFinance.quoteSummary(upperSymbol, {
      modules: ["price", "defaultKeyStatistics", "financialData", "summaryDetail"],
    });

    const price = summaryResult.price;
    const keyStats = summaryResult.defaultKeyStatistics;
    const financial = summaryResult.financialData;
    const summary = summaryResult.summaryDetail;

    // Get current values that we'll use for calculations
    const sharesOutstanding = keyStats?.sharesOutstanding || 0;
    const totalDebt = financial?.totalDebt || 0;
    const totalCash = financial?.totalCash || 0;
    const trailingEps = keyStats?.trailingEps || 0;
    const forwardEps = keyStats?.forwardEps || 0;
    const revenue = financial?.totalRevenue || 0;
    const ebitda = financial?.ebitda || 0;
    const bookValue = keyStats?.bookValue || 0;

    // Get historical prices for quarter ends
    const quarterDates = getQuarterEndDates();
    const oldestDate = quarterDates[quarterDates.length - 1];

    // Fetch historical data
    const chartResult = await yahooFinance.chart(upperSymbol, {
      period1: new Date(oldestDate.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days before oldest date
      period2: new Date(),
      interval: "1d",
    });

    const quotes = chartResult.quotes || [];

    // Find prices closest to each quarter end date
    const historicalData = quarterDates.map((targetDate) => {
      const targetTime = targetDate.getTime();

      // Find the quote closest to this date (within 7 days)
      let closestQuote = null;
      let closestDiff = Infinity;

      for (const quote of quotes) {
        if (!quote.date || !quote.close) continue;
        const quoteTime = new Date(quote.date).getTime();
        const diff = Math.abs(quoteTime - targetTime);

        // Only consider quotes within 7 days of target
        if (diff < 7 * 24 * 60 * 60 * 1000 && diff < closestDiff) {
          closestDiff = diff;
          closestQuote = quote;
        }
      }

      if (!closestQuote || !closestQuote.close) {
        return {
          date: targetDate.toISOString().split("T")[0],
          label: `${targetDate.getMonth() + 1}/${targetDate.getDate()}/${targetDate.getFullYear()}`,
          marketCap: null,
          enterpriseValue: null,
          trailingPE: null,
          forwardPE: null,
          pegRatio: null,
          priceToSales: null,
          priceToBook: null,
          evToRevenue: null,
          evToEbitda: null,
        };
      }

      const historicalPrice = closestQuote.close;
      const historicalMarketCap = historicalPrice * sharesOutstanding;
      const historicalEV = historicalMarketCap + totalDebt - totalCash;

      return {
        date: targetDate.toISOString().split("T")[0],
        label: `${targetDate.getMonth() + 1}/${targetDate.getDate()}/${targetDate.getFullYear()}`,
        marketCap: historicalMarketCap,
        enterpriseValue: historicalEV,
        trailingPE: trailingEps ? historicalPrice / trailingEps : null,
        forwardPE: forwardEps ? historicalPrice / forwardEps : null,
        pegRatio: null, // Can't calculate historical PEG
        priceToSales: revenue && sharesOutstanding ? (historicalPrice * sharesOutstanding) / revenue : null,
        priceToBook: bookValue ? historicalPrice / bookValue : null,
        evToRevenue: revenue ? historicalEV / revenue : null,
        evToEbitda: ebitda ? historicalEV / ebitda : null,
      };
    });

    // Current values
    const currentPrice = price?.regularMarketPrice || 0;
    const currentMarketCap = price?.marketCap || currentPrice * sharesOutstanding;
    const currentEV = currentMarketCap + totalDebt - totalCash;

    const currentData = {
      date: new Date().toISOString().split("T")[0],
      label: "Current",
      marketCap: currentMarketCap,
      enterpriseValue: currentEV,
      trailingPE: summary?.trailingPE || (trailingEps ? currentPrice / trailingEps : null),
      forwardPE: summary?.forwardPE || (forwardEps ? currentPrice / forwardEps : null),
      pegRatio: keyStats?.pegRatio || null,
      priceToSales: summary?.priceToSalesTrailing12Months || (revenue ? currentMarketCap / revenue : null),
      priceToBook: keyStats?.priceToBook || (bookValue ? currentPrice / bookValue : null),
      evToRevenue: revenue ? currentEV / revenue : null,
      evToEbitda: ebitda ? currentEV / ebitda : null,
    };

    return NextResponse.json({
      symbol: upperSymbol,
      current: currentData,
      historical: historicalData,
    });
  } catch (error) {
    console.error("Valuation history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch valuation history" },
      { status: 500 }
    );
  }
}
