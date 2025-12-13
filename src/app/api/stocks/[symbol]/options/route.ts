import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface OptionsParams {
  params: Promise<{ symbol: string }>;
}

interface NasdaqOptionRow {
  expirygroup?: string;
  expiryDate?: string | null;
  c_Last?: string | null;
  c_Change?: string | null;
  c_Bid?: string | null;
  c_Ask?: string | null;
  c_Volume?: string | null;
  c_Openinterest?: string | null;
  c_colour?: boolean;
  strike?: string | null;
  p_Last?: string | null;
  p_Change?: string | null;
  p_Bid?: string | null;
  p_Ask?: string | null;
  p_Volume?: string | null;
  p_Openinterest?: string | null;
  p_colour?: boolean;
  drillDownURL?: string | null;
}

interface NasdaqOptionsResponse {
  data?: {
    totalRecord?: number;
    lastTrade?: string;
    table?: {
      rows?: NasdaqOptionRow[];
    };
    filterlist?: {
      fromdate?: {
        filter?: Array<{
          label: string;
          value: string;
        }>;
      };
      excode?: {
        filter?: Array<{
          label: string;
          value: string;
        }>;
      };
      type?: {
        filter?: Array<{
          label: string;
          value: string;
        }>;
      };
    };
  };
  status?: {
    rCode?: number;
  };
}

function parseNumber(value: string | null | undefined): number | null {
  if (!value || value === "--" || value === "") return null;
  const num = parseFloat(value.replace(/,/g, ""));
  return isNaN(num) ? null : num;
}

// Returns both full date (YYYY-MM-DD) and short format (Dec 19)
function parseExpiryDates(expiryDate: string | null | undefined): { full: string | null; short: string | null } {
  if (!expiryDate) return { full: null, short: null };
  // Format from Nasdaq: "Dec 19"
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  try {
    // Try parsing with current year first
    let date = new Date(`${expiryDate}, ${currentYear}`);
    // If the date is in the past, use next year
    if (date < new Date()) {
      date = new Date(`${expiryDate}, ${nextYear}`);
    }
    // Format as YYYY-MM-DD without timezone conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return {
      full: `${year}-${month}-${day}`,
      short: expiryDate // Keep original short format "Dec 19"
    };
  } catch {
    return { full: null, short: expiryDate };
  }
}

// Format full expiration date for grouping headers (e.g., "December 19, 2025")
function formatExpiryGroupHeader(dateStr: string): string {
  try {
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return dateStr;
  }
}

export async function GET(request: NextRequest, { params }: OptionsParams) {
  try {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();

    const { searchParams } = new URL(request.url);
    const fromDateParam = searchParams.get("fromdate"); // Format: "2026-01-02" for specific date
    const excodeParam = searchParams.get("excode"); // e.g., "oprac" (Composite)
    const typeParam = searchParams.get("type"); // e.g., "all", "week", "stad"

    // Build Nasdaq API URL
    let apiUrl = `https://api.nasdaq.com/api/quote/${upperSymbol}/option-chain?assetclass=stocks&limit=1000`;
    if (fromDateParam) {
      apiUrl += `&fromdate=${fromDateParam}`;
    }
    if (excodeParam) {
      apiUrl += `&excode=${excodeParam}`;
    }
    if (typeParam) {
      apiUrl += `&type=${typeParam}`;
    }

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Nasdaq API returned ${response.status}`);
    }

    const data: NasdaqOptionsResponse = await response.json();

    if (data.status?.rCode !== 200) {
      throw new Error("Nasdaq API error");
    }

    const rows = data.data?.table?.rows || [];

    // Extract all individual expiration dates from the filter list
    const expirationMonths: Array<{ label: string; value: string; fromdate: string }> = [];
    const filterDates = data.data?.filterlist?.fromdate?.filter || [];

    for (const filter of filterDates) {
      if (filter.value && filter.value !== "all") {
        // Split pipe-separated dates: "2025-12-19|2025-12-26|..."
        const dates = filter.value.split("|");
        for (const dateStr of dates) {
          if (dateStr && !expirationMonths.find(d => d.fromdate === dateStr)) {
            // Format: "19 DEC 2025 (Weekly)" or "20 DEC 2025 (Monthly)" from "2025-12-19"
            const date = new Date(dateStr + "T12:00:00");
            const day = date.getDate().toString().padStart(2, "0");
            const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
            const year = date.getFullYear();

            // Determine if Monthly (3rd Friday) or Weekly
            const dayOfMonth = date.getDate();
            const dayOfWeek = date.getDay(); // 0=Sun, 5=Fri
            const isThirdFriday = dayOfWeek === 5 && dayOfMonth >= 15 && dayOfMonth <= 21;
            const typeLabel = isThirdFriday ? "(Monthly)" : "(Weekly)";

            const label = `${day} ${month} ${year} ${typeLabel}`;

            expirationMonths.push({
              label,
              value: dateStr,
              fromdate: dateStr
            });
          }
        }
      }
    }

    // Sort by date
    expirationMonths.sort((a, b) => a.fromdate.localeCompare(b.fromdate));

    // Parse rows into combined option chain data
    interface OptionSide {
      last: number | null;
      change: number | null;
      bid: number | null;
      ask: number | null;
      volume: number | null;
      openInterest: number | null;
      inTheMoney: boolean;
    }

    interface OptionRow {
      expiryDate: string;
      expiryDateShort: string;
      expiryGroupHeader: string;
      strike: number;
      call: OptionSide;
      put: OptionSide;
    }

    const optionRows: OptionRow[] = [];
    let currentExpiryGroup = "";

    for (const row of rows) {
      // Check if this is an expiry group header
      if (row.expirygroup && row.strike === null) {
        currentExpiryGroup = row.expirygroup;
        continue;
      }

      // Skip rows without strike price
      if (!row.strike) continue;

      const strike = parseNumber(row.strike);
      if (strike === null) continue;

      const expiryDates = parseExpiryDates(row.expiryDate);
      const expiryDate = expiryDates.full || "";
      const expiryDateShort = expiryDates.short || "";

      const optionRow: OptionRow = {
        expiryDate,
        expiryDateShort,
        expiryGroupHeader: currentExpiryGroup || formatExpiryGroupHeader(expiryDate),
        strike,
        call: {
          last: parseNumber(row.c_Last),
          change: parseNumber(row.c_Change),
          bid: parseNumber(row.c_Bid),
          ask: parseNumber(row.c_Ask),
          volume: parseNumber(row.c_Volume),
          openInterest: parseNumber(row.c_Openinterest),
          inTheMoney: row.c_colour === true,
        },
        put: {
          last: parseNumber(row.p_Last),
          change: parseNumber(row.p_Change),
          bid: parseNumber(row.p_Bid),
          ask: parseNumber(row.p_Ask),
          volume: parseNumber(row.p_Volume),
          openInterest: parseNumber(row.p_Openinterest),
          inTheMoney: row.p_colour === true,
        },
      };

      optionRows.push(optionRow);
    }

    // Group rows by expiration date for the frontend
    const groupedOptions: Record<string, OptionRow[]> = {};
    for (const row of optionRows) {
      const key = row.expiryDate;
      if (!groupedOptions[key]) {
        groupedOptions[key] = [];
      }
      groupedOptions[key].push(row);
    }

    // Get unique expiration dates (sorted)
    const expirationDates = Object.keys(groupedOptions).sort();

    // Extract price from lastTrade string like "LAST TRADE: $356.43 (AS OF DEC 13, 2025)"
    let quotePrice: number | null = null;
    let lastTradeInfo = "";
    const lastTrade = data.data?.lastTrade;
    if (lastTrade) {
      lastTradeInfo = lastTrade;
      const priceMatch = lastTrade.match(/\$([0-9,.]+)/);
      if (priceMatch) {
        quotePrice = parseNumber(priceMatch[1]);
      }
    }

    // Parse exchange options (Option dropdown)
    const exchangeOptions = (data.data?.filterlist?.excode?.filter || []).map(f => ({
      label: f.label,
      value: f.value
    }));

    // Parse type options (Type dropdown)
    const typeOptions = (data.data?.filterlist?.type?.filter || []).map(f => ({
      label: f.label,
      value: f.value
    }));

    const optionsData = {
      symbol: upperSymbol,
      expirationMonths,
      expirationDates,
      lastTradeInfo,
      quote: {
        price: quotePrice,
        change: null,
        changePercent: null,
      },
      options: optionRows,
      groupedOptions,
      exchangeOptions,
      typeOptions,
    };

    return NextResponse.json(optionsData);
  } catch (error) {
    console.error("Options error:", error);
    return NextResponse.json(
      { error: "Failed to fetch options", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
