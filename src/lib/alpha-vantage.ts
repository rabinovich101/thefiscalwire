// Alpha Vantage API client for earnings calendar data
// API Documentation: https://www.alphavantage.co/documentation/

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

// ============================================================================
// Types
// ============================================================================

export type EarningsReportTime = 'BMO' | 'AMC' | 'TBD';

export interface EarningsCalendarEntry {
  symbol: string;
  name: string;
  reportDate: string; // YYYY-MM-DD (from Alpha Vantage, may be inaccurate)
  fiscalDateEnding: string;
  estimate: number | null;
  currency: string;
  // Report timing (Before Market Open, After Market Close, or To Be Determined)
  reportTime?: EarningsReportTime;
  // Corrected report date from Yahoo Finance (more accurate than Alpha Vantage)
  correctedReportDate?: string;
  // Expected move data (optional, populated from options)
  stockPrice?: number;
  expectedMove?: number;
  expectedMovePercent?: number;
  impliedVolatility?: number | null;
  // Market cap (optional, populated from Yahoo Finance)
  marketCap?: number;
  // Historical data (for past earnings - populated from company earnings)
  reportedEPS?: number | null;
  surprise?: number | null;
  surprisePercent?: number | null;
}

export interface EarningsHistorical {
  fiscalDateEnding: string;
  reportedDate: string;
  reportedEPS: number | null;
  estimatedEPS: number | null;
  surprise: number | null;
  surprisePercentage: number | null;
}

export interface CompanyEarnings {
  symbol: string;
  annualEarnings: Array<{
    fiscalDateEnding: string;
    reportedEPS: number | null;
  }>;
  quarterlyEarnings: EarningsHistorical[];
}

// ============================================================================
// Cache Implementation (24-hour TTL for rate limit management)
// ============================================================================

interface CacheEntry<T> {
  data: T;
  expires: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    expires: Date.now() + CACHE_TTL,
  });
}

// ============================================================================
// CSV Parsing
// ============================================================================

function parseCSV(csv: string): string[][] {
  const lines = csv.trim().split("\n");
  return lines.map((line) => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  });
}

function parseEarningsCalendarCSV(csv: string): EarningsCalendarEntry[] {
  const rows = parseCSV(csv);
  if (rows.length < 2) return [];

  // Skip header row
  return rows.slice(1).map((row) => ({
    symbol: row[0] || "",
    name: row[1] || "",
    reportDate: row[2] || "",
    fiscalDateEnding: row[3] || "",
    estimate: row[4] ? parseFloat(row[4]) : null,
    currency: row[5] || "USD",
  })).filter(entry => entry.symbol && entry.reportDate);
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Fetch earnings calendar for upcoming earnings reports
 * @param horizon - Time horizon: "3month" (default), "6month", or "12month"
 */
export async function getEarningsCalendar(
  horizon: "3month" | "6month" | "12month" = "3month"
): Promise<EarningsCalendarEntry[]> {
  const cacheKey = `earnings_calendar_${horizon}`;
  const cached = getCachedData<EarningsCalendarEntry[]>(cacheKey);
  if (cached) {
    console.log("[Alpha Vantage] Returning cached earnings calendar");
    return cached;
  }

  if (!ALPHA_VANTAGE_API_KEY) {
    console.error("[Alpha Vantage] API key not configured");
    return [];
  }

  try {
    const url = `${BASE_URL}?function=EARNINGS_CALENDAR&horizon=${horizon}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    console.log("[Alpha Vantage] Fetching earnings calendar...");

    const response = await fetch(url, {
      next: { revalidate: 86400 }, // 24 hour cache at CDN level
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csv = await response.text();

    // Check for API error messages
    if (csv.includes("Thank you for using Alpha Vantage") || csv.includes("premium")) {
      console.warn("[Alpha Vantage] Rate limit or premium feature warning");
      return [];
    }

    const earnings = parseEarningsCalendarCSV(csv);
    console.log(`[Alpha Vantage] Parsed ${earnings.length} earnings entries`);

    setCachedData(cacheKey, earnings);
    return earnings;
  } catch (error) {
    console.error("[Alpha Vantage] Error fetching earnings calendar:", error);
    return [];
  }
}

/**
 * Fetch historical earnings data for a specific company
 * @param symbol - Stock ticker symbol
 */
export async function getCompanyEarnings(
  symbol: string
): Promise<CompanyEarnings | null> {
  const cacheKey = `company_earnings_${symbol}`;
  const cached = getCachedData<CompanyEarnings>(cacheKey);
  if (cached) {
    console.log(`[Alpha Vantage] Returning cached earnings for ${symbol}`);
    return cached;
  }

  if (!ALPHA_VANTAGE_API_KEY) {
    console.error("[Alpha Vantage] API key not configured");
    return null;
  }

  try {
    const url = `${BASE_URL}?function=EARNINGS&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    console.log(`[Alpha Vantage] Fetching earnings for ${symbol}...`);

    const response = await fetch(url, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check for API error
    if (data["Error Message"] || data["Note"]) {
      console.warn(`[Alpha Vantage] API message: ${data["Error Message"] || data["Note"]}`);
      return null;
    }

    // Helper to parse numeric values that might be "None" string from Alpha Vantage
    const parseNumeric = (val: string | undefined): number | null => {
      if (!val || val === "None" || val === "none" || val === "") return null;
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    };

    const earnings: CompanyEarnings = {
      symbol,
      annualEarnings: (data.annualEarnings || []).map((e: Record<string, string>) => ({
        fiscalDateEnding: e.fiscalDateEnding || "",
        reportedEPS: parseNumeric(e.reportedEPS),
      })),
      quarterlyEarnings: (data.quarterlyEarnings || []).map((e: Record<string, string>) => ({
        fiscalDateEnding: e.fiscalDateEnding || "",
        reportedDate: e.reportedDate || "",
        reportedEPS: parseNumeric(e.reportedEPS),
        estimatedEPS: parseNumeric(e.estimatedEPS),
        surprise: parseNumeric(e.surprise),
        surprisePercentage: parseNumeric(e.surprisePercentage),
      })),
    };

    setCachedData(cacheKey, earnings);
    return earnings;
  } catch (error) {
    console.error(`[Alpha Vantage] Error fetching earnings for ${symbol}:`, error);
    return null;
  }
}

/**
 * Get earnings for a specific date range
 */
export function filterEarningsByDateRange(
  earnings: EarningsCalendarEntry[],
  startDate: Date,
  endDate: Date
): EarningsCalendarEntry[] {
  return earnings.filter((e) => {
    const date = new Date(e.reportDate);
    return date >= startDate && date <= endDate;
  });
}

/**
 * Get earnings grouped by date
 */
export function groupEarningsByDate(
  earnings: EarningsCalendarEntry[]
): Map<string, EarningsCalendarEntry[]> {
  const grouped = new Map<string, EarningsCalendarEntry[]>();

  for (const entry of earnings) {
    const existing = grouped.get(entry.reportDate) || [];
    existing.push(entry);
    grouped.set(entry.reportDate, existing);
  }

  return grouped;
}

/**
 * Get today's earnings
 */
export function getTodaysEarnings(
  earnings: EarningsCalendarEntry[]
): EarningsCalendarEntry[] {
  const today = new Date().toISOString().split("T")[0];
  return earnings.filter((e) => e.reportDate === today);
}

/**
 * Get this week's earnings
 */
export function getThisWeeksEarnings(
  earnings: EarningsCalendarEntry[]
): EarningsCalendarEntry[] {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return filterEarningsByDateRange(earnings, startOfWeek, endOfWeek);
}

/**
 * Get next week's earnings
 */
export function getNextWeeksEarnings(
  earnings: EarningsCalendarEntry[]
): EarningsCalendarEntry[] {
  const today = new Date();
  const startOfNextWeek = new Date(today);
  startOfNextWeek.setDate(today.getDate() - today.getDay() + 7);
  startOfNextWeek.setHours(0, 0, 0, 0);

  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
  endOfNextWeek.setHours(23, 59, 59, 999);

  return filterEarningsByDateRange(earnings, startOfNextWeek, endOfNextWeek);
}

/**
 * Fetch historical earnings data for a batch of symbols and match by reportDate
 * Used to enrich past earnings with reported EPS and surprise data
 */
export async function getHistoricalEarningsDataBatch(
  earnings: EarningsCalendarEntry[]
): Promise<Map<string, { reportedEPS: number | null; surprise: number | null; surprisePercent: number | null }>> {
  const results = new Map<string, { reportedEPS: number | null; surprise: number | null; surprisePercent: number | null }>();

  // Only process past earnings
  const today = new Date().toISOString().split('T')[0];
  const pastEarnings = earnings.filter(e => e.reportDate < today);

  if (pastEarnings.length === 0) {
    return results;
  }

  // Get unique symbols
  const uniqueSymbols = [...new Set(pastEarnings.map(e => e.symbol))];

  console.log(`[Alpha Vantage] Fetching historical earnings for ${uniqueSymbols.length} symbols`);

  // Fetch company earnings for each symbol (in parallel, with rate limiting)
  const batchSize = 5;

  for (let i = 0; i < uniqueSymbols.length; i += batchSize) {
    const batch = uniqueSymbols.slice(i, i + batchSize);

    const promises = batch.map(async (symbol) => {
      try {
        const companyEarnings = await getCompanyEarnings(symbol);

        if (companyEarnings?.quarterlyEarnings) {
          // Find the matching quarterly earnings by reportedDate
          const earningsForSymbol = pastEarnings.filter(e => e.symbol === symbol);

          for (const earning of earningsForSymbol) {
            // Look for a match in quarterly earnings
            // Try exact match first, then fuzzy match within 5 days (earnings dates can vary slightly)
            let match = companyEarnings.quarterlyEarnings.find(q => q.reportedDate === earning.reportDate);

            if (!match) {
              // Try to find a match within 5 days of the report date
              const reportDateObj = new Date(earning.reportDate);
              match = companyEarnings.quarterlyEarnings.find(q => {
                const histDateObj = new Date(q.reportedDate);
                const diffDays = Math.abs((reportDateObj.getTime() - histDateObj.getTime()) / (1000 * 60 * 60 * 24));
                return diffDays <= 5;
              });
            }

            if (match && match.reportedEPS !== null) {
              results.set(`${symbol}_${earning.reportDate}`, {
                reportedEPS: match.reportedEPS,
                surprise: match.surprise,
                surprisePercent: match.surprisePercentage,
              });
            }
          }
        }
      } catch (error) {
        console.error(`[Alpha Vantage] Error fetching historical earnings for ${symbol}:`, error);
      }
    });

    await Promise.all(promises);

    // Rate limiting delay between batches
    if (i + batchSize < uniqueSymbols.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  console.log(`[Alpha Vantage] Found historical data for ${results.size} earnings entries`);
  return results;
}
