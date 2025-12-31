import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export interface StockData {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  type: string;
  price: number;
  previousClose: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume: number;
  avgVolume10Day: number;
  bid: number | null;
  ask: number | null;
  bidSize: number | null;
  askSize: number | null;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  fiftyDayAverage: number;
  twoHundredDayAverage: number;
  marketCap: number;
  enterpriseValue: number;
  trailingPE: number | null;
  forwardPE: number | null;
  pegRatio: number | null;
  priceToBook: number | null;
  priceToSales: number | null;
  eps: number | null;
  forwardEps: number | null;
  bookValue: number | null;
  dividendRate: number | null;
  dividendYield: number | null;
  exDividendDate: string | null;
  payoutRatio: number | null;
  revenue: number | null;
  revenuePerShare: number | null;
  grossProfit: number | null;
  ebitda: number | null;
  netIncome: number | null;
  profitMargin: number | null;
  operatingMargin: number | null;
  returnOnEquity: number | null;
  returnOnAssets: number | null;
  totalCash: number | null;
  totalDebt: number | null;
  debtToEquity: number | null;
  currentRatio: number | null;
  sharesOutstanding: number | null;
  impliedSharesOutstanding: number | null;
  floatShares: number | null;
  sharesShort: number | null;
  shortRatio: number | null;
  shortPercentFloat: number | null;
  shortPercentSharesOut: number | null;
  sharesShortPriorMonth: number | null;
  heldPercentInsiders: number | null;
  heldPercentInstitutions: number | null;
  beta: number | null;
  fiftyTwoWeekChange: number | null;
  sandP52WeekChange: number | null;
  enterpriseToRevenue: number | null;
  enterpriseToEbitda: number | null;
  earningsQuarterlyGrowth: number | null;
  revenueGrowth: number | null;
  operatingCashflow: number | null;
  freeCashflow: number | null;
  totalCashPerShare: number | null;
  lastFiscalYearEnd: string | null;
  mostRecentQuarter: string | null;
  trailingAnnualDividendRate: number | null;
  trailingAnnualDividendYield: number | null;
  fiveYearAvgDividendYield: number | null;
  dividendDate: string | null;
  lastSplitFactor: string | null;
  lastSplitDate: string | null;
  targetMeanPrice: number | null;
  targetHighPrice: number | null;
  targetLowPrice: number | null;
  numberOfAnalystOpinions: number | null;
  recommendationKey: string | null;
  earningsDate: string | null;
  sector: string | null;
  industry: string | null;
  website: string | null;
  description: string | null;
  employees: number | null;
  headquarters: string | null;
  marketState: string;
  preMarketPrice: number | null;
  preMarketChange: number | null;
  preMarketChangePercent: number | null;
  postMarketPrice: number | null;
  postMarketChange: number | null;
  postMarketChangePercent: number | null;
  regularMarketTime: Date | null;
  error?: string;
}

// Helper to safely extract number values from Yahoo Finance (which can return {} for some fields)
function toNumber(value: unknown): number | null {
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }
  return null;
}

function toNumberOrDefault(value: unknown, defaultValue: number): number {
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }
  return defaultValue;
}

/**
 * Fetches comprehensive stock data directly from Yahoo Finance
 * This is used by server components to avoid HTTP round-trips through API routes
 */
export async function getStockData(symbol: string): Promise<StockData | null> {
  try {
    const upperSymbol = symbol.toUpperCase();

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

    // Use calculated EV if API value is wrong
    const apiEnterpriseValue = keyStats?.enterpriseValue || 0;
    const enterpriseValue = apiEnterpriseValue < marketCap * 0.5 ? calculatedEnterpriseValue : apiEnterpriseValue;

    // Recalculate EV ratios with corrected Enterprise Value
    const revenue = financial?.totalRevenue || null;
    const ebitda = financial?.ebitda || null;
    const calculatedEvToRevenue = revenue && enterpriseValue ? enterpriseValue / revenue : null;
    const calculatedEvToEbitda = ebitda && enterpriseValue ? enterpriseValue / ebitda : null;

    return {
      symbol: price?.symbol || upperSymbol,
      name: price?.longName || price?.shortName || upperSymbol,
      exchange: price?.exchangeName || "",
      currency: price?.currency || "USD",
      type: price?.quoteType || "EQUITY",
      price: price?.regularMarketPrice || 0,
      previousClose: price?.regularMarketPreviousClose || summary?.previousClose || 0,
      open: price?.regularMarketOpen || summary?.open || 0,
      dayHigh: price?.regularMarketDayHigh || summary?.dayHigh || 0,
      dayLow: price?.regularMarketDayLow || summary?.dayLow || 0,
      change: price?.regularMarketChange || 0,
      changePercent: price?.regularMarketChangePercent || 0,
      volume: price?.regularMarketVolume || summary?.volume || 0,
      avgVolume: summary?.averageVolume || 0,
      avgVolume10Day: summary?.averageVolume10days || 0,
      bid: toNumber(summary?.bid),
      ask: toNumber(summary?.ask),
      bidSize: toNumber(summary?.bidSize),
      askSize: toNumber(summary?.askSize),
      fiftyTwoWeekHigh: toNumberOrDefault(summary?.fiftyTwoWeekHigh, 0),
      fiftyTwoWeekLow: toNumberOrDefault(summary?.fiftyTwoWeekLow, 0),
      fiftyDayAverage: toNumberOrDefault(summary?.fiftyDayAverage, 0),
      twoHundredDayAverage: toNumberOrDefault(summary?.twoHundredDayAverage, 0),
      marketCap: marketCap,
      enterpriseValue: enterpriseValue,
      trailingPE: toNumber(summary?.trailingPE) ?? toNumber(keyStats?.trailingPE),
      forwardPE: toNumber(summary?.forwardPE) ?? toNumber(keyStats?.forwardPE),
      pegRatio: toNumber(keyStats?.pegRatio),
      priceToBook: toNumber(keyStats?.priceToBook),
      priceToSales: toNumber(summary?.priceToSalesTrailing12Months) ?? toNumber(keyStats?.priceToSalesTrailing12Months),
      eps: toNumber(keyStats?.trailingEps),
      forwardEps: toNumber(keyStats?.forwardEps),
      bookValue: toNumber(keyStats?.bookValue),
      dividendRate: toNumber(summary?.dividendRate),
      dividendYield: toNumber(summary?.dividendYield),
      exDividendDate: summary?.exDividendDate instanceof Date ? summary.exDividendDate.toISOString() : null,
      payoutRatio: toNumber(summary?.payoutRatio),
      revenue: revenue,
      revenuePerShare: toNumber(financial?.revenuePerShare),
      grossProfit: toNumber(financial?.grossProfits),
      ebitda: ebitda,
      netIncome: toNumber((keyStats as Record<string, unknown>)?.netIncomeToCommon) ?? toNumber(financial?.netIncomeToCommon),
      profitMargin: toNumber(financial?.profitMargins),
      operatingMargin: toNumber(financial?.operatingMargins),
      returnOnEquity: toNumber(financial?.returnOnEquity),
      returnOnAssets: toNumber(financial?.returnOnAssets),
      totalCash: toNumber(financial?.totalCash),
      totalDebt: toNumber(financial?.totalDebt),
      debtToEquity: toNumber(financial?.debtToEquity),
      currentRatio: toNumber(financial?.currentRatio),
      sharesOutstanding: toNumber(keyStats?.sharesOutstanding),
      impliedSharesOutstanding: toNumber((keyStats as Record<string, unknown>)?.impliedSharesOutstanding) ?? toNumber(keyStats?.sharesOutstanding),
      floatShares: toNumber(keyStats?.floatShares),
      sharesShort: toNumber(keyStats?.sharesShort),
      shortRatio: toNumber(keyStats?.shortRatio),
      shortPercentFloat: toNumber(keyStats?.shortPercentOfFloat),
      shortPercentSharesOut: toNumber(keyStats?.sharesPercentSharesOut),
      sharesShortPriorMonth: toNumber(keyStats?.sharesShortPriorMonth),
      heldPercentInsiders: toNumber(keyStats?.heldPercentInsiders),
      heldPercentInstitutions: toNumber(keyStats?.heldPercentInstitutions),
      beta: toNumber(keyStats?.beta) ?? toNumber(summary?.beta),
      fiftyTwoWeekChange: toNumber(keyStats?.["52WeekChange"]),
      sandP52WeekChange: toNumber(keyStats?.SandP52WeekChange),
      enterpriseToRevenue: calculatedEvToRevenue,
      enterpriseToEbitda: calculatedEvToEbitda,
      earningsQuarterlyGrowth: toNumber(keyStats?.earningsQuarterlyGrowth),
      revenueGrowth: toNumber(financial?.revenueGrowth),
      operatingCashflow: toNumber(financial?.operatingCashflow),
      freeCashflow: toNumber(financial?.freeCashflow),
      totalCashPerShare: toNumber(financial?.totalCashPerShare),
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
      trailingAnnualDividendRate: toNumber(summary?.trailingAnnualDividendRate),
      trailingAnnualDividendYield: toNumber(summary?.trailingAnnualDividendYield),
      fiveYearAvgDividendYield: toNumber(summary?.fiveYearAvgDividendYield),
      dividendDate: calendar?.dividendDate instanceof Date ? calendar.dividendDate.toISOString() : null,
      lastSplitFactor: keyStats?.lastSplitFactor || null,
      lastSplitDate: keyStats?.lastSplitDate
        ? new Date(keyStats.lastSplitDate * 1000).toISOString()
        : null,
      targetMeanPrice: toNumber(financial?.targetMeanPrice),
      targetHighPrice: toNumber(financial?.targetHighPrice),
      targetLowPrice: toNumber(financial?.targetLowPrice),
      numberOfAnalystOpinions: toNumber(financial?.numberOfAnalystOpinions),
      recommendationKey: financial?.recommendationKey || null,
      earningsDate: calendar?.earnings?.earningsDate?.[0] instanceof Date ? calendar.earnings.earningsDate[0].toISOString() : null,
      sector: profile?.sector || null,
      industry: profile?.industry || null,
      website: profile?.website || null,
      description: profile?.longBusinessSummary || null,
      employees: toNumber(profile?.fullTimeEmployees),
      headquarters: profile?.city && profile?.country
        ? `${profile.city}, ${profile.country}`
        : null,
      marketState: price?.marketState || "CLOSED",
      preMarketPrice: toNumber(price?.preMarketPrice),
      preMarketChange: toNumber(price?.preMarketChange),
      preMarketChangePercent: toNumber(price?.preMarketChangePercent),
      postMarketPrice: toNumber(price?.postMarketPrice),
      postMarketChange: toNumber(price?.postMarketChange),
      postMarketChangePercent: toNumber(price?.postMarketChangePercent),
      regularMarketTime: price?.regularMarketTime || null,
    };
  } catch (error) {
    console.error("Failed to fetch stock data:", error);
    return null;
  }
}
