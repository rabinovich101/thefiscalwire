import { NextResponse } from "next/server";
import {
  HeatmapIndex,
  fetchIndexSymbols,
  fetchAllNasdaqPrices,
  fetchSectorMapping,
  getSectorIdForSymbol,
  getIndustryIdForSymbol,
  NasdaqStock,
  fetchETFPrices,
  fetchCryptoPrices,
  fetchPeriodChangeData,
} from "@/lib/stock-lists";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Cache for 1 minute

export interface HeatmapStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  sector: string;
  sectorId: string;
  industryId: string;
  value: number; // The metric value for the selected data type
}

// Valid index values
const VALID_INDICES: HeatmapIndex[] = [
  "sp500", "dji", "ndx", "rut", "etf", "crypto"
];

// Parse Nasdaq price string to number
function parsePrice(priceStr: string): number {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace(/[$,]/g, '')) || 0;
}

// Parse Nasdaq percent string to number
function parsePercent(pctStr: string): number {
  if (!pctStr) return 0;
  return parseFloat(pctStr.replace(/[%,]/g, '')) || 0;
}

// Parse Nasdaq market cap string to number
function parseMarketCap(mcStr: string): number {
  if (!mcStr) return 0;
  return parseInt(mcStr.replace(/,/g, '')) || 0;
}

// Convert Nasdaq stock to HeatmapStock using sector mapping
function convertNasdaqToHeatmapStock(
  nasdaq: NasdaqStock,
  sectorMap: Map<string, string>
): HeatmapStock {
  const changePercent = parsePercent(nasdaq.pctchange);

  // First try static mapping (has industry detail), then dynamic sector mapping
  let sectorId = getSectorIdForSymbol(nasdaq.symbol);
  if (sectorId === "other") {
    // Fall back to dynamic Nasdaq sector mapping
    sectorId = sectorMap.get(nasdaq.symbol) || "other";
  }

  return {
    symbol: nasdaq.symbol,
    name: nasdaq.name,
    price: parsePrice(nasdaq.lastsale),
    change: parseFloat(nasdaq.netchange) || 0,
    changePercent,
    marketCap: parseMarketCap(nasdaq.marketCap),
    sector: sectorId,
    sectorId: sectorId,
    industryId: getIndustryIdForSymbol(nasdaq.symbol),
    value: changePercent, // Daily change for heatmap coloring
  };
}

// Fetch heatmap data using Nasdaq API (FAST - ~1 second for any index)
async function fetchHeatmapData(
  index: HeatmapIndex,
  dataType: string = "d1"
): Promise<HeatmapStock[]> {
  // Special handling for ETFs - with sector categories
  if (index === "etf") {
    const etfPrices = await fetchETFPrices();
    return Array.from(etfPrices.values()).map((etf) => ({
      symbol: etf.symbol,
      name: etf.name,
      price: etf.price,
      change: etf.change,
      changePercent: etf.changePercent,
      marketCap: etf.price * 1000000, // Use price as proxy for sizing
      sector: etf.sector,
      sectorId: etf.sector.toLowerCase().replace(/\s+/g, '-'),
      industryId: etf.industry.toLowerCase().replace(/\s+/g, '-'),
      value: etf.changePercent,
    }));
  }

  // Special handling for Crypto
  if (index === "crypto") {
    const cryptoPrices = await fetchCryptoPrices();
    return Array.from(cryptoPrices.values()).map((crypto) => ({
      symbol: crypto.symbol,
      name: crypto.name,
      price: crypto.price,
      change: 0,
      changePercent: crypto.changePercent,
      marketCap: crypto.price * 1000000, // Use price as proxy for sizing
      sector: "Crypto",
      sectorId: "crypto",
      industryId: "crypto",
      value: crypto.changePercent,
    }));
  }

  // Stock indices - fetch data in parallel for speed
  const [symbols, priceMap, sectorMap] = await Promise.all([
    fetchIndexSymbols(index),
    fetchAllNasdaqPrices(),
    fetchSectorMapping(),
  ]);

  // For non-daily periods, fetch period-specific change data
  const periodType = dataType as 'd1' | 'w1' | 'm1';
  const periodChangeMap = await fetchPeriodChangeData(symbols, periodType);

  // Map symbols to heatmap data
  const stocks: HeatmapStock[] = [];
  for (const symbol of symbols) {
    const nasdaqStock = priceMap.get(symbol);
    if (nasdaqStock) {
      const stock = convertNasdaqToHeatmapStock(nasdaqStock, sectorMap);
      // Only include stocks with valid market cap
      if (stock.marketCap > 0) {
        // Use period-specific change for value if available, otherwise use daily change
        const periodChange = periodChangeMap.get(symbol);
        if (periodChange !== undefined) {
          stock.value = periodChange;
        }
        stocks.push(stock);
      }
    }
  }

  // Sort by market cap descending
  return stocks.sort((a, b) => b.marketCap - a.marketCap);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const indexParam = searchParams.get("index") || "sp500";
    const dataType = searchParams.get("dataType") || "d1";

    // Validate index
    const index = indexParam as HeatmapIndex;
    if (!VALID_INDICES.includes(index)) {
      return NextResponse.json(
        { error: `Invalid index. Must be one of: ${VALID_INDICES.join(", ")}` },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    const stocks = await fetchHeatmapData(index, dataType);
    const elapsed = Date.now() - startTime;

    console.log(`Heatmap ${index}: ${stocks.length} stocks loaded in ${elapsed}ms`);

    return NextResponse.json({
      index,
      dataType,
      stocks,
      count: stocks.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    return NextResponse.json(
      { error: "Failed to fetch heatmap data" },
      { status: 500 }
    );
  }
}
