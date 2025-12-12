import { NextResponse } from "next/server";
import type { EarningsCalendarEntry } from "@/lib/alpha-vantage";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1 hour

// NASDAQ API headers to mimic browser requests
const NASDAQ_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Origin": "https://www.nasdaq.com",
  "Referer": "https://www.nasdaq.com/market-activity/earnings",
};

interface NasdaqEarningsRow {
  symbol: string;
  name: string;
  time: string;
  eps: string;
  epsForecast: string;
  surprise: string;
  marketCap: string;
  fiscalQuarterEnding: string;
  noOfEsts: string;
}

interface NasdaqEarningsResponse {
  data: {
    asOf: string;
    headers: Record<string, string>;
    rows: NasdaqEarningsRow[];
  };
  message: string | null;
  status: {
    rCode: number;
    bCodeMessage: string | null;
    developerMessage: string | null;
  };
}

// Parse EPS string like "$4.07" or "($0.27)" to number
function parseEPS(epsStr: string): number | null {
  if (!epsStr || epsStr === "N/A" || epsStr === "") return null;
  // Remove $ and parentheses, handle negative
  const isNegative = epsStr.includes("(");
  const cleanStr = epsStr.replace(/[$(),]/g, "").trim();
  const value = parseFloat(cleanStr);
  if (isNaN(value)) return null;
  return isNegative ? -value : value;
}

// Parse market cap string like "$143,634,218,000" to number
function parseMarketCap(mcStr: string): number | undefined {
  if (!mcStr || mcStr === "N/A" || mcStr === "") return undefined;
  const cleanStr = mcStr.replace(/[$,]/g, "").trim();
  const value = parseFloat(cleanStr);
  return isNaN(value) ? undefined : value;
}

// Parse surprise percentage string like "7.96" or "-42.86" to number
function parseSurprise(surpriseStr: string): number | null {
  if (!surpriseStr || surpriseStr === "N/A" || surpriseStr === "") return null;
  const value = parseFloat(surpriseStr);
  return isNaN(value) ? null : value;
}

// Map NASDAQ time field to our report time format
function mapReportTime(time: string): "BMO" | "AMC" | "TBD" {
  if (!time || time === "time-not-supplied") return "TBD";
  const lower = time.toLowerCase();
  if (lower.includes("before") || lower.includes("bmo") || lower.includes("pre")) return "BMO";
  if (lower.includes("after") || lower.includes("amc") || lower.includes("post")) return "AMC";
  return "TBD";
}

// Fetch earnings from NASDAQ API for a specific date
async function fetchNasdaqEarnings(date: string): Promise<EarningsCalendarEntry[]> {
  const url = `https://api.nasdaq.com/api/calendar/earnings?date=${date}`;

  try {
    console.log(`[NASDAQ API] Fetching earnings for ${date}`);
    const response = await fetch(url, {
      headers: NASDAQ_HEADERS,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`[NASDAQ API] HTTP error: ${response.status}`);
      return [];
    }

    const data: NasdaqEarningsResponse = await response.json();

    if (data.status.rCode !== 200 || !data.data?.rows) {
      console.error(`[NASDAQ API] Invalid response:`, data.status);
      return [];
    }

    console.log(`[NASDAQ API] Found ${data.data.rows.length} earnings for ${date}`);

    return data.data.rows.map((row): EarningsCalendarEntry => {
      const reportedEPS = parseEPS(row.eps);
      const estimate = parseEPS(row.epsForecast);
      let surprisePercent = parseSurprise(row.surprise);

      // Calculate surprise amount if we have both reported and estimate
      let surprise: number | null = null;
      if (reportedEPS !== null && estimate !== null) {
        surprise = reportedEPS - estimate;
        // Calculate surprise percentage if NASDAQ didn't provide it
        if (surprisePercent === null && estimate !== 0) {
          surprisePercent = ((reportedEPS - estimate) / Math.abs(estimate)) * 100;
          // Round to 2 decimal places
          surprisePercent = Math.round(surprisePercent * 100) / 100;
        }
      }

      return {
        symbol: row.symbol,
        name: row.name || row.symbol,
        reportDate: date,
        fiscalDateEnding: row.fiscalQuarterEnding || "",
        estimate,
        currency: "USD",
        reportTime: mapReportTime(row.time),
        marketCap: parseMarketCap(row.marketCap),
        reportedEPS,
        surprise,
        surprisePercent,
      };
    });
  } catch (error) {
    console.error(`[NASDAQ API] Error fetching ${date}:`, error);
    return [];
  }
}

// Get array of dates from startDate to endDate
function getDateRange(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date"); // Single date: YYYY-MM-DD
    const daysBack = parseInt(searchParams.get("daysBack") || "2", 10);
    const daysForward = parseInt(searchParams.get("daysForward") || "14", 10);

    // If single date is provided, fetch just that date
    if (date) {
      const earnings = await fetchNasdaqEarnings(date);
      return NextResponse.json({
        success: true,
        earnings,
        dates: [date],
        total: earnings.length,
      });
    }

    // Otherwise, fetch date range (past daysBack to future daysForward)
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysBack);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + daysForward);

    const dates = getDateRange(startDate, endDate);
    console.log(`[NASDAQ API] Fetching earnings for ${dates.length} dates (${dates[0]} to ${dates[dates.length - 1]})`);

    // Fetch all dates in parallel (with batching to avoid rate limits)
    const batchSize = 5;
    const allEarnings: EarningsCalendarEntry[] = [];

    for (let i = 0; i < dates.length; i += batchSize) {
      const batch = dates.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(d => fetchNasdaqEarnings(d))
      );
      batchResults.forEach(earnings => allEarnings.push(...earnings));

      // Small delay between batches to be nice to the API
      if (i + batchSize < dates.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Sort by date, then by market cap (descending)
    allEarnings.sort((a, b) => {
      const dateCompare = a.reportDate.localeCompare(b.reportDate);
      if (dateCompare !== 0) return dateCompare;
      // Sort by market cap within same date (highest first)
      const mcA = a.marketCap || 0;
      const mcB = b.marketCap || 0;
      return mcB - mcA;
    });

    // Group by date
    const grouped: Record<string, EarningsCalendarEntry[]> = {};
    allEarnings.forEach(e => {
      if (!grouped[e.reportDate]) {
        grouped[e.reportDate] = [];
      }
      grouped[e.reportDate].push(e);
    });

    return NextResponse.json({
      success: true,
      earnings: allEarnings,
      grouped,
      dates,
      total: allEarnings.length,
      daysBack,
      daysForward,
    });
  } catch (error) {
    console.error("[NASDAQ API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch NASDAQ earnings" },
      { status: 500 }
    );
  }
}
