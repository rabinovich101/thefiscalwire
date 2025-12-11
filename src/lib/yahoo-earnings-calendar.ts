// Yahoo Finance Earnings Calendar - Direct HTTP Fetcher
// Based on https://github.com/wenboyu2/yahoo-earnings-calendar
// No browser needed - uses direct HTTP requests

import type { EarningsCalendarEntry, EarningsReportTime } from './alpha-vantage';

// Cache for fetched data
interface CacheEntry {
  data: EarningsCalendarEntry[];
  expires: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Rate limiting
const RATE_LIMIT = 2000; // requests per hour
const DELAY_MS = Math.ceil((60 * 60 * 1000) / RATE_LIMIT); // ~1.8 seconds
let lastRequestTime = 0;

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < DELAY_MS) {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS - timeSinceLastRequest));
  }

  lastRequestTime = Date.now();

  return fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
  });
}

// Extract JSON data from Yahoo Finance HTML page
function extractDataFromHtml(html: string): Record<string, unknown> | null {
  try {
    // Look for the JSON data embedded in the page
    const patterns = [
      /root\.App\.main\s*=\s*(\{[\s\S]*?\});/,
      /<script[^>]*>window\.__PRELOADED_STATE__\s*=\s*(\{[\s\S]*?\})<\/script>/,
      /data-reactid="[^"]*"[^>]*>(\{"[^<]*)<\/script>/,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        try {
          return JSON.parse(match[1]);
        } catch {
          continue;
        }
      }
    }

    // Try to find ScreenerResultsStore data directly
    const storeMatch = html.match(/"ScreenerResultsStore":\s*(\{[^}]+(?:\{[^}]*\}[^}]*)*\})/);
    if (storeMatch) {
      try {
        const storeData = JSON.parse(storeMatch[1]);
        return { context: { dispatcher: { stores: { ScreenerResultsStore: storeData } } } };
      } catch {
        // Continue to next method
      }
    }

    return null;
  } catch (error) {
    console.error('[Yahoo Calendar] Error extracting data from HTML:', error);
    return null;
  }
}

// Parse earnings data from Yahoo's JSON structure
function parseEarningsData(data: Record<string, unknown>, dateStr: string): EarningsCalendarEntry[] {
  const earnings: EarningsCalendarEntry[] = [];

  try {
    // Navigate to the earnings data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stores = (data as any)?.context?.dispatcher?.stores;
    if (!stores) {
      console.log('[Yahoo Calendar] No stores found in data');
      return earnings;
    }

    const screenerResults = stores?.ScreenerResultsStore?.results?.rows;
    if (!screenerResults || !Array.isArray(screenerResults)) {
      console.log('[Yahoo Calendar] No screener results found');
      return earnings;
    }

    for (const row of screenerResults) {
      try {
        const symbol = row.ticker || row.symbol || '';
        if (!symbol || symbol.length > 10 || symbol.includes(' ')) continue;

        const companyName = row.companyshortname || row.companyName || row.shortName || '';

        // Parse EPS estimate
        let estimate: number | null = null;
        if (row.epsestimate !== undefined && row.epsestimate !== null && row.epsestimate !== '-') {
          const parsed = parseFloat(row.epsestimate);
          if (!isNaN(parsed)) estimate = parsed;
        }

        // Parse reported EPS
        let reportedEPS: number | null = null;
        if (row.epsactual !== undefined && row.epsactual !== null && row.epsactual !== '-') {
          const parsed = parseFloat(row.epsactual);
          if (!isNaN(parsed)) reportedEPS = parsed;
        }

        // Parse surprise
        let surprise: number | null = null;
        if (row.epssurprisepct !== undefined && row.epssurprisepct !== null && row.epssurprisepct !== '-') {
          const parsed = parseFloat(row.epssurprisepct);
          if (!isNaN(parsed)) surprise = parsed;
        }

        // Parse report time (BMO = Before Market Open, AMC = After Market Close)
        let reportTime: EarningsReportTime = 'TBD';
        const callTime = row.startdatetimetype || row.callTime || '';
        if (callTime.includes('BMO') || callTime.includes('Before') || callTime.includes('pre')) {
          reportTime = 'BMO';
        } else if (callTime.includes('AMC') || callTime.includes('After') || callTime.includes('post')) {
          reportTime = 'AMC';
        } else if (callTime.includes('TNS') || callTime.includes('TAS')) {
          reportTime = 'TBD';
        }

        // Parse fiscal date from quarter info
        let fiscalDateEnding = '';
        const fiscalQuarter = row.fiscalQuarter || '';
        const quarterMatch = fiscalQuarter.match(/Q(\d)\s*(\d{4})/);
        if (quarterMatch) {
          const quarter = parseInt(quarterMatch[1]);
          const year = parseInt(quarterMatch[2]);
          const monthEnd = quarter * 3;
          fiscalDateEnding = `${year}-${String(monthEnd).padStart(2, '0')}-28`;
        }

        const entry: EarningsCalendarEntry = {
          symbol,
          name: companyName,
          reportDate: dateStr,
          fiscalDateEnding,
          estimate,
          currency: 'USD',
          reportTime,
        };

        // Add reported EPS if available
        if (reportedEPS !== null) {
          entry.reportedEPS = reportedEPS;
        }
        if (surprise !== null) {
          entry.surprisePercent = surprise;
        }

        earnings.push(entry);
      } catch (err) {
        // Skip malformed entries
        continue;
      }
    }
  } catch (error) {
    console.error('[Yahoo Calendar] Error parsing earnings data:', error);
  }

  return earnings;
}

/**
 * Fetch earnings for a specific date from Yahoo Finance
 * Uses direct HTTP requests - no browser needed
 */
export async function fetchYahooEarningsForDate(dateStr: string): Promise<EarningsCalendarEntry[]> {
  // Check cache
  const cached = cache.get(dateStr);
  if (cached && cached.expires > Date.now()) {
    console.log(`[Yahoo Calendar] Returning cached data for ${dateStr}`);
    return cached.data;
  }

  try {
    console.log(`[Yahoo Calendar] Fetching earnings for ${dateStr}...`);

    const url = `https://finance.yahoo.com/calendar/earnings?day=${dateStr}`;
    const response = await rateLimitedFetch(url);

    if (!response.ok) {
      console.error(`[Yahoo Calendar] HTTP error: ${response.status}`);
      return [];
    }

    const html = await response.text();
    const data = extractDataFromHtml(html);

    if (!data) {
      console.log(`[Yahoo Calendar] Could not extract data from page for ${dateStr}`);
      return [];
    }

    const earnings = parseEarningsData(data, dateStr);
    console.log(`[Yahoo Calendar] Found ${earnings.length} earnings for ${dateStr}`);

    // Cache results
    cache.set(dateStr, {
      data: earnings,
      expires: Date.now() + CACHE_TTL,
    });

    return earnings;
  } catch (error) {
    console.error(`[Yahoo Calendar] Error fetching ${dateStr}:`, error);
    return [];
  }
}

/**
 * Fetch earnings for a date range
 */
export async function fetchYahooEarningsForDateRange(
  startDate: string,
  endDate: string
): Promise<EarningsCalendarEntry[]> {
  const allEarnings: EarningsCalendarEntry[] = [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const earnings = await fetchYahooEarningsForDate(dateStr);
    allEarnings.push(...earnings);
  }

  return allEarnings;
}

/**
 * Fetch earnings for the current week (including 2 days before)
 */
export async function fetchYahooEarningsForWeek(): Promise<EarningsCalendarEntry[]> {
  const today = new Date();

  // 2 days before
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 2);

  // End of week (Saturday)
  const endDate = new Date(today);
  const dayOfWeek = today.getDay();
  endDate.setDate(today.getDate() + (6 - dayOfWeek));

  return fetchYahooEarningsForDateRange(
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  );
}

/**
 * Clear the cache
 */
export function clearYahooEarningsCache(): void {
  cache.clear();
}
