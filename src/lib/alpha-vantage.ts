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
  reportDate: string; // YYYY-MM-DD
  fiscalDateEnding: string;
  estimate: number | null;
  currency: string;
  // Report timing (Before Market Open, After Market Close, or To Be Determined)
  reportTime?: EarningsReportTime;
  // Expected move data (optional, populated from options)
  stockPrice?: number;
  expectedMove?: number;
  expectedMovePercent?: number;
  impliedVolatility?: number | null;
  // Market cap (optional, populated from Yahoo Finance)
  marketCap?: number;
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

    const earnings: CompanyEarnings = {
      symbol,
      annualEarnings: (data.annualEarnings || []).map((e: Record<string, string>) => ({
        fiscalDateEnding: e.fiscalDateEnding || "",
        reportedEPS: e.reportedEPS ? parseFloat(e.reportedEPS) : null,
      })),
      quarterlyEarnings: (data.quarterlyEarnings || []).map((e: Record<string, string>) => ({
        fiscalDateEnding: e.fiscalDateEnding || "",
        reportedDate: e.reportedDate || "",
        reportedEPS: e.reportedEPS ? parseFloat(e.reportedEPS) : null,
        estimatedEPS: e.estimatedEPS ? parseFloat(e.estimatedEPS) : null,
        surprise: e.surprise ? parseFloat(e.surprise) : null,
        surprisePercentage: e.surprisePercentage ? parseFloat(e.surprisePercentage) : null,
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
