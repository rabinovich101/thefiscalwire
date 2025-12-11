// Yahoo Finance Earnings Calendar Scraper
// Scrapes earnings data from Yahoo Finance calendar pages

import { chromium, Browser } from 'playwright';
import type { EarningsCalendarEntry, EarningsReportTime } from './alpha-vantage';

// Cache for scraped data
interface CacheEntry {
  data: EarningsCalendarEntry[];
  expires: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * Scrape earnings for a specific date from Yahoo Finance
 */
export async function scrapeYahooEarnings(dateStr: string): Promise<EarningsCalendarEntry[]> {
  // Check cache
  const cached = cache.get(dateStr);
  if (cached && cached.expires > Date.now()) {
    console.log(`[Yahoo Scraper] Returning cached data for ${dateStr}`);
    return cached.data;
  }

  let browser: Browser | null = null;

  try {
    console.log(`[Yahoo Scraper] Scraping earnings for ${dateStr}...`);

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(`https://finance.yahoo.com/calendar/earnings?day=${dateStr}`, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Accept cookies if present
    try {
      const buttons = await page.locator('button').all();
      for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && (text.includes('לקבל') || text.includes('Accept') || text.includes('accept'))) {
          await btn.click();
          await page.waitForTimeout(1000);
          break;
        }
      }
    } catch (e) {
      // Ignore cookie errors
    }

    // Wait for table to load
    await page.waitForSelector('table', { timeout: 10000 }).catch(() => {});

    // Try to set rows per page to 100
    try {
      const rowsSelect = await page.locator('select').first();
      await rowsSelect.selectOption('100');
      await page.waitForTimeout(2000);
    } catch (e) {
      // Rows selector might not exist
    }

    // Get all earnings from all pages
    const allEarnings: EarningsCalendarEntry[] = [];
    let hasNextPage = true;
    let pageNum = 1;

    while (hasNextPage && pageNum <= 10) { // Max 10 pages
      // Extract earnings from current page
      const pageEarnings = await page.evaluate((reportDate: string) => {
        const rows = document.querySelectorAll('table tbody tr');
        const data: Array<{
          symbol: string;
          name: string;
          reportDate: string;
          fiscalDateEnding: string;
          estimate: number | null;
          currency: string;
          reportTime: string;
          reportedEPS: number | null;
          surprisePercent: number | null;
          marketCap: number | null;
        }> = [];

        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 5) {
            const symbolEl = cells[0]?.querySelector('a') || cells[0];
            const symbol = symbolEl?.textContent?.trim() || '';
            const company = cells[1]?.textContent?.trim() || '';
            const event = cells[2]?.textContent?.trim() || '';
            const time = cells[3]?.textContent?.trim() || '';
            const estimateText = cells[4]?.textContent?.trim() || '';

            // Parse estimate
            let estimate: number | null = null;
            if (estimateText && estimateText !== '-') {
              const parsed = parseFloat(estimateText);
              if (!isNaN(parsed)) {
                estimate = parsed;
              }
            }

            // Parse Reported EPS (column 5) - available for past earnings
            let reportedEPS: number | null = null;
            if (cells.length > 5) {
              const reportedText = cells[5]?.textContent?.trim() || '';
              if (reportedText && reportedText !== '-') {
                const parsed = parseFloat(reportedText);
                if (!isNaN(parsed)) {
                  reportedEPS = parsed;
                }
              }
            }

            // Parse Surprise % (column 6) - available for past earnings
            let surprisePercent: number | null = null;
            if (cells.length > 6) {
              const surpriseText = cells[6]?.textContent?.trim() || '';
              if (surpriseText && surpriseText !== '-') {
                // Remove + sign if present and parse
                const parsed = parseFloat(surpriseText.replace('+', ''));
                if (!isNaN(parsed)) {
                  surprisePercent = parsed;
                }
              }
            }

            // Parse Market Cap (column 7) - e.g., "56.45B", "720.2M"
            let marketCap: number | null = null;
            if (cells.length > 7) {
              const marketCapText = cells[7]?.textContent?.trim() || '';
              if (marketCapText && marketCapText !== '-') {
                const match = marketCapText.match(/([\d.]+)\s*([KMBT])?/i);
                if (match) {
                  let value = parseFloat(match[1]);
                  const suffix = (match[2] || '').toUpperCase();
                  if (suffix === 'T') value *= 1e12;
                  else if (suffix === 'B') value *= 1e9;
                  else if (suffix === 'M') value *= 1e6;
                  else if (suffix === 'K') value *= 1e3;
                  if (!isNaN(value)) {
                    marketCap = value;
                  }
                }
              }
            }

            // Parse report time
            let reportTime = 'TBD';
            if (time.includes('BMO') || time.includes('Before')) {
              reportTime = 'BMO';
            } else if (time.includes('AMC') || time.includes('After') || time.includes('TAS')) {
              reportTime = 'AMC';
            }

            // Extract fiscal quarter from event (e.g., "Q4 2025 Earnings")
            let fiscalDateEnding = '';
            const quarterMatch = event.match(/Q(\d)\s*(\d{4})/);
            if (quarterMatch) {
              const quarter = parseInt(quarterMatch[1]);
              const year = parseInt(quarterMatch[2]);
              // Approximate fiscal date ending
              const monthEnd = quarter * 3;
              fiscalDateEnding = `${year}-${String(monthEnd).padStart(2, '0')}-28`;
            }

            if (symbol && symbol.length <= 10 && !symbol.includes(' ')) {
              data.push({
                symbol,
                name: company,
                reportDate,
                fiscalDateEnding,
                estimate,
                currency: 'USD',
                reportTime,
                reportedEPS,
                surprisePercent,
                marketCap
              });
            }
          }
        });

        return data;
      }, dateStr);

      allEarnings.push(...pageEarnings.map(e => ({
        ...e,
        reportTime: e.reportTime as EarningsReportTime
      })));

      // Check for next page button
      try {
        const nextBtn = page.locator('button[aria-label="Goto next page"]');
        const isDisabled = await nextBtn.getAttribute('disabled').catch(() => 'true');

        if (isDisabled !== 'true' && isDisabled !== '' && pageEarnings.length > 0) {
          await nextBtn.click();
          await page.waitForTimeout(2000);
          pageNum++;
        } else {
          hasNextPage = false;
        }
      } catch (e) {
        hasNextPage = false;
      }
    }

    console.log(`[Yahoo Scraper] Found ${allEarnings.length} earnings for ${dateStr}`);

    // Cache results
    cache.set(dateStr, {
      data: allEarnings,
      expires: Date.now() + CACHE_TTL
    });

    return allEarnings;

  } catch (error) {
    console.error(`[Yahoo Scraper] Error scraping ${dateStr}:`, error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Get earnings for a date range from Yahoo Finance
 */
export async function getYahooEarningsForWeek(): Promise<EarningsCalendarEntry[]> {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);

  const allEarnings: EarningsCalendarEntry[] = [];

  // Scrape each day of the week
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    try {
      const dayEarnings = await scrapeYahooEarnings(dateStr);
      allEarnings.push(...dayEarnings);
    } catch (error) {
      console.error(`[Yahoo Scraper] Error for ${dateStr}:`, error);
    }
  }

  return allEarnings;
}

/**
 * Clear the cache
 */
export function clearYahooEarningsCache(): void {
  cache.clear();
}
