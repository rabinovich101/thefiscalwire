import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

// Simple in-memory cache to reduce API calls
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 60 seconds

// Finviz cache for scraped statistics
const finvizCache = new Map<string, { data: Record<string, unknown>; timestamp: number }>();
const FINVIZ_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Nasdaq API fallback when Yahoo Finance is rate limited
async function fetchFromNasdaq(symbol: string) {
  const res = await fetch(
    `https://api.nasdaq.com/api/quote/${symbol}/info?assetclass=stocks`,
    { headers: { "User-Agent": "Mozilla/5.0 (compatible; FiscalWire/1.0)" } }
  );

  if (!res.ok) {
    throw new Error(`Nasdaq API returned ${res.status}`);
  }

  const data = await res.json();
  if (!data.data?.primaryData) {
    throw new Error("No data from Nasdaq API");
  }

  const pd = data.data.primaryData;
  const ks = data.data.keyStats || {};

  // Parse price values (remove $ and commas)
  const parsePrice = (val: string | null) => {
    if (!val) return 0;
    return parseFloat(val.replace(/[$,]/g, '')) || 0;
  };

  // Parse 52-week range
  let fiftyTwoWeekLow = 0, fiftyTwoWeekHigh = 0;
  if (ks.fiftyTwoWeekHighLow?.value) {
    const [low, high] = ks.fiftyTwoWeekHighLow.value.split(' - ').map(parsePrice);
    fiftyTwoWeekLow = low;
    fiftyTwoWeekHigh = high;
  }

  // Parse day range
  let dayLow = 0, dayHigh = 0;
  if (ks.dayrange?.value) {
    const [low, high] = ks.dayrange.value.split(' - ').map(parsePrice);
    dayLow = low;
    dayHigh = high;
  }

  const price = parsePrice(pd.lastSalePrice);
  const change = parseFloat(pd.netChange) || 0;
  const changePercent = parseFloat((pd.percentageChange || "0").replace('%', '')) / 100;

  return {
    symbol: symbol.toUpperCase(),
    name: data.data.companyName || symbol,
    exchange: data.data.exchange || "NASDAQ",
    currency: "USD",
    type: data.data.stockType || "EQUITY",
    price,
    previousClose: price - change,
    open: dayLow || price,
    dayHigh: dayHigh || price,
    dayLow: dayLow || price,
    change,
    changePercent,
    volume: parseInt((pd.volume || "0").replace(/,/g, '')) || 0,
    avgVolume: 0,
    avgVolume10Day: 0,
    bid: parsePrice(pd.bidPrice),
    ask: parsePrice(pd.askPrice),
    bidSize: parseInt(pd.bidSize) || null,
    askSize: parseInt(pd.askSize) || null,
    fiftyTwoWeekHigh,
    fiftyTwoWeekLow,
    fiftyDayAverage: 0,
    twoHundredDayAverage: 0,
    marketCap: 0,
    enterpriseValue: 0,
    // Most fields unavailable from Nasdaq basic API - set to null
    trailingPE: null, forwardPE: null, pegRatio: null, priceToBook: null, priceToSales: null,
    eps: null, forwardEps: null, bookValue: null,
    dividendRate: null, dividendYield: null, exDividendDate: null, payoutRatio: null,
    revenue: null, revenuePerShare: null, grossProfit: null, ebitda: null, netIncome: null,
    profitMargin: null, operatingMargin: null, returnOnEquity: null, returnOnAssets: null,
    totalCash: null, totalDebt: null, debtToEquity: null, currentRatio: null,
    sharesOutstanding: null, impliedSharesOutstanding: null, floatShares: null,
    sharesShort: null, shortRatio: null, shortPercentFloat: null, shortPercentSharesOut: null,
    sharesShortPriorMonth: null, heldPercentInsiders: null, heldPercentInstitutions: null,
    beta: null, fiftyTwoWeekChange: null, sandP52WeekChange: null,
    enterpriseToRevenue: null, enterpriseToEbitda: null,
    earningsQuarterlyGrowth: null, revenueGrowth: null,
    operatingCashflow: null, freeCashflow: null, totalCashPerShare: null,
    lastFiscalYearEnd: null, mostRecentQuarter: null,
    trailingAnnualDividendRate: null, trailingAnnualDividendYield: null,
    fiveYearAvgDividendYield: null, dividendDate: null,
    lastSplitFactor: null, lastSplitDate: null,
    targetMeanPrice: null, targetHighPrice: null, targetLowPrice: null,
    numberOfAnalystOpinions: null, recommendationKey: null, earningsDate: null,
    sector: null, industry: null, website: null, description: null, employees: null, headquarters: null,
    marketState: data.data.marketStatus === "Open" ? "REGULAR" : "CLOSED",
    preMarketPrice: null, preMarketChange: null, preMarketChangePercent: null,
    postMarketPrice: null, postMarketChange: null, postMarketChangePercent: null,
    regularMarketTime: null,
    _source: "nasdaq", // Mark data source for debugging
  };
}

// Finviz scraping for detailed statistics when Yahoo fails
async function fetchStatsFromFinviz(symbol: string): Promise<Record<string, unknown>> {
  // Check cache first
  const cached = finvizCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < FINVIZ_CACHE_TTL) {
    return cached.data;
  }

  const res = await fetch(`https://finviz.com/quote.ashx?t=${symbol}&ty=c&ta=1&p=d`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
  });

  if (!res.ok) {
    throw new Error(`Finviz returned ${res.status}`);
  }

  const html = await res.text();

  // Parse values from the Finviz snapshot table
  const parseValue = (label: string): string | null => {
    // Match pattern handles optional span inside b tag:
    // <td>Label</td><td><b>Value</b></td>  OR
    // <td>Label</td><td><b><span>Value</span></b></td>
    const regex = new RegExp(
      `<td[^>]*>${label}</td>\\s*<td[^>]*><b[^>]*>(?:<span[^>]*>)?([^<]+)(?:</span>)?</b></td>`,
      'i'
    );
    const match = html.match(regex);
    return match ? match[1].trim() : null;
  };

  const parseNumber = (val: string | null): number | null => {
    if (!val || val === '-') return null;
    const cleaned = val.replace(/[$,%]/g, '').replace(/[KMB]/g, (m) => {
      return m === 'K' ? 'e3' : m === 'M' ? 'e6' : 'e9';
    });
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  };

  const parsePercent = (val: string | null): number | null => {
    if (!val || val === '-') return null;
    const num = parseFloat(val.replace('%', ''));
    return isNaN(num) ? null : num / 100;
  };

  const parseBigNumber = (val: string | null): number | null => {
    if (!val || val === '-') return null;
    const multipliers: Record<string, number> = { 'K': 1e3, 'M': 1e6, 'B': 1e9, 'T': 1e12 };
    const match = val.match(/^([\d.]+)([KMBT])?$/);
    if (!match) return null;
    const num = parseFloat(match[1]);
    const mult = match[2] ? multipliers[match[2]] : 1;
    return isNaN(num) ? null : num * mult;
  };

  const data: Record<string, unknown> = {
    // Valuation
    marketCap: parseBigNumber(parseValue('Market Cap')),
    trailingPE: parseNumber(parseValue('P/E')),
    forwardPE: parseNumber(parseValue('Forward P/E')),
    pegRatio: parseNumber(parseValue('PEG')),
    priceToSales: parseNumber(parseValue('P/S')),
    priceToBook: parseNumber(parseValue('P/B')),
    // Per Share
    eps: parseNumber(parseValue('EPS \\(ttm\\)')),
    bookValue: parseNumber(parseValue('Book/sh')),
    // Dividend
    dividendYield: parsePercent(parseValue('Dividend %')),
    dividendRate: parseNumber(parseValue('Dividend')),
    payoutRatio: parsePercent(parseValue('Payout')),
    // Profitability
    profitMargin: parsePercent(parseValue('Profit Margin')),
    operatingMargin: parsePercent(parseValue('Oper\\. Margin')),
    grossMargin: parsePercent(parseValue('Gross Margin')),
    returnOnEquity: parsePercent(parseValue('ROE')),
    returnOnAssets: parsePercent(parseValue('ROA')),
    // Growth
    epsGrowthThisYear: parsePercent(parseValue('EPS this Y')),
    epsGrowthNextYear: parsePercent(parseValue('EPS next Y')),
    epsGrowthPast5Y: parsePercent(parseValue('EPS past 5Y')),
    epsGrowthNext5Y: parsePercent(parseValue('EPS next 5Y')),
    salesGrowthPast5Y: parsePercent(parseValue('Sales past 5Y')),
    revenueGrowth: parsePercent(parseValue('Sales Q/Q')),
    earningsQuarterlyGrowth: parsePercent(parseValue('EPS Q/Q')),
    // Balance Sheet
    currentRatio: parseNumber(parseValue('Current Ratio')),
    quickRatio: parseNumber(parseValue('Quick Ratio')),
    debtToEquity: parseNumber(parseValue('Debt/Eq')),
    totalDebt: parseBigNumber(parseValue('LT Debt/Eq')),
    // Shares & Short Interest
    sharesOutstanding: parseBigNumber(parseValue('Shs Outstand')),
    floatShares: parseBigNumber(parseValue('Shs Float')),
    shortPercentFloat: parsePercent(parseValue('Short Float')),
    shortRatio: parseNumber(parseValue('Short Ratio')),
    heldPercentInsiders: parsePercent(parseValue('Insider Own')),
    heldPercentInstitutions: parsePercent(parseValue('Inst Own')),
    // Technical
    beta: parseNumber(parseValue('Beta')),
    fiftyDayAverage: parseNumber(parseValue('SMA50')),
    twoHundredDayAverage: parseNumber(parseValue('SMA200')),
    atr: parseNumber(parseValue('ATR')),
    volatilityWeek: parsePercent(parseValue('Volatility')?.split(' ')[0] || null),
    volatilityMonth: parsePercent(parseValue('Volatility')?.split(' ')[1] || null),
    rsi: parseNumber(parseValue('RSI \\(14\\)')),
    // Performance
    perfWeek: parsePercent(parseValue('Perf Week')),
    perfMonth: parsePercent(parseValue('Perf Month')),
    perfQuarter: parsePercent(parseValue('Perf Quarter')),
    perfHalfYear: parsePercent(parseValue('Perf Half Y')),
    perfYear: parsePercent(parseValue('Perf Year')),
    perfYTD: parsePercent(parseValue('Perf YTD')),
    // Target
    targetMeanPrice: parseNumber(parseValue('Target Price')),
    recommendationKey: parseValue('Recom'),
    numberOfAnalystOpinions: parseNumber(parseValue('Analysts')),
    // Other
    avgVolume: parseBigNumber(parseValue('Avg Volume')),
    employees: parseNumber(parseValue('Employees')),
    // Industry info from page title or sector field
    sector: parseValue('Sector'),
    industry: parseValue('Industry'),
    _source: "finviz",
  };

  // Cache the result
  finvizCache.set(symbol, { data, timestamp: Date.now() });

  return data;
}

function getCached(symbol: string) {
  const cached = cache.get(symbol);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCache(symbol: string, data: unknown) {
  cache.set(symbol, { data, timestamp: Date.now() });
  // Clean old entries if cache gets too large
  if (cache.size > 100) {
    const oldest = [...cache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp);
    for (let i = 0; i < 50; i++) {
      cache.delete(oldest[i][0]);
    }
  }
}

export const dynamic = "force-dynamic";

interface QuoteParams {
  params: Promise<{ symbol: string }>;
}

export async function GET(request: NextRequest, { params }: QuoteParams) {
  try {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();

    // Special debug endpoint - return server IP
    if (upperSymbol === "DEBUG-IP") {
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        return NextResponse.json({ serverIP: ipData.ip, timestamp: new Date().toISOString() });
      } catch {
        return NextResponse.json({ error: "Failed to get IP" }, { status: 500 });
      }
    }

    // Check cache first
    const cached = getCached(upperSymbol);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Cache": "HIT",
        },
      });
    }

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

    // Cache the result
    setCache(upperSymbol, stockData);

    return NextResponse.json(stockData, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Cache": "MISS",
      },
    });
  } catch (yahooError) {
    console.error("Yahoo Finance error, trying Nasdaq + Finviz fallback:", yahooError);

    // Try Nasdaq API + Finviz scraping as fallback
    try {
      const { symbol } = await params;
      const upperSymbol = symbol.toUpperCase();

      // Fetch from both sources in parallel
      const [nasdaqData, finvizStats] = await Promise.all([
        fetchFromNasdaq(upperSymbol),
        fetchStatsFromFinviz(upperSymbol).catch((e) => {
          console.error("Finviz scraping failed:", e);
          return {} as Record<string, unknown>; // Return empty object if Finviz fails
        }),
      ]);

      // Merge data: Nasdaq provides price, Finviz provides detailed stats
      // Only use Finviz values if Nasdaq doesn't have them (non-null)
      const mergedData = {
        ...nasdaqData,
        // Override null values from Nasdaq with Finviz data
        marketCap: nasdaqData.marketCap || finvizStats.marketCap || 0,
        trailingPE: nasdaqData.trailingPE ?? finvizStats.trailingPE ?? null,
        forwardPE: nasdaqData.forwardPE ?? finvizStats.forwardPE ?? null,
        pegRatio: nasdaqData.pegRatio ?? finvizStats.pegRatio ?? null,
        priceToSales: nasdaqData.priceToSales ?? finvizStats.priceToSales ?? null,
        priceToBook: nasdaqData.priceToBook ?? finvizStats.priceToBook ?? null,
        eps: nasdaqData.eps ?? finvizStats.eps ?? null,
        bookValue: nasdaqData.bookValue ?? finvizStats.bookValue ?? null,
        dividendRate: nasdaqData.dividendRate ?? finvizStats.dividendRate ?? null,
        dividendYield: nasdaqData.dividendYield ?? finvizStats.dividendYield ?? null,
        payoutRatio: nasdaqData.payoutRatio ?? finvizStats.payoutRatio ?? null,
        profitMargin: nasdaqData.profitMargin ?? finvizStats.profitMargin ?? null,
        operatingMargin: nasdaqData.operatingMargin ?? finvizStats.operatingMargin ?? null,
        returnOnEquity: nasdaqData.returnOnEquity ?? finvizStats.returnOnEquity ?? null,
        returnOnAssets: nasdaqData.returnOnAssets ?? finvizStats.returnOnAssets ?? null,
        currentRatio: nasdaqData.currentRatio ?? finvizStats.currentRatio ?? null,
        debtToEquity: nasdaqData.debtToEquity ?? finvizStats.debtToEquity ?? null,
        sharesOutstanding: nasdaqData.sharesOutstanding ?? finvizStats.sharesOutstanding ?? null,
        floatShares: nasdaqData.floatShares ?? finvizStats.floatShares ?? null,
        shortPercentFloat: nasdaqData.shortPercentFloat ?? finvizStats.shortPercentFloat ?? null,
        shortRatio: nasdaqData.shortRatio ?? finvizStats.shortRatio ?? null,
        heldPercentInsiders: nasdaqData.heldPercentInsiders ?? finvizStats.heldPercentInsiders ?? null,
        heldPercentInstitutions: nasdaqData.heldPercentInstitutions ?? finvizStats.heldPercentInstitutions ?? null,
        beta: nasdaqData.beta ?? finvizStats.beta ?? null,
        fiftyDayAverage: nasdaqData.fiftyDayAverage || finvizStats.fiftyDayAverage || 0,
        twoHundredDayAverage: nasdaqData.twoHundredDayAverage || finvizStats.twoHundredDayAverage || 0,
        avgVolume: nasdaqData.avgVolume || finvizStats.avgVolume || 0,
        targetMeanPrice: nasdaqData.targetMeanPrice ?? finvizStats.targetMeanPrice ?? null,
        recommendationKey: nasdaqData.recommendationKey ?? finvizStats.recommendationKey ?? null,
        numberOfAnalystOpinions: nasdaqData.numberOfAnalystOpinions ?? finvizStats.numberOfAnalystOpinions ?? null,
        revenueGrowth: nasdaqData.revenueGrowth ?? finvizStats.revenueGrowth ?? null,
        earningsQuarterlyGrowth: nasdaqData.earningsQuarterlyGrowth ?? finvizStats.earningsQuarterlyGrowth ?? null,
        employees: nasdaqData.employees ?? finvizStats.employees ?? null,
        sector: nasdaqData.sector ?? finvizStats.sector ?? null,
        industry: nasdaqData.industry ?? finvizStats.industry ?? null,
        _source: finvizStats._source ? "nasdaq+finviz" : "nasdaq",
      };

      // Cache the merged result
      setCache(upperSymbol, mergedData);

      return NextResponse.json(mergedData, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Source": mergedData._source as string,
        },
      });
    } catch (nasdaqError) {
      console.error("Nasdaq fallback also failed:", nasdaqError);
      return NextResponse.json(
        { error: "Failed to fetch stock data from all sources" },
        { status: 500 }
      );
    }
  }
}
