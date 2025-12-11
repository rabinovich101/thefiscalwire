import { NextResponse } from "next/server";
import {
  getEarningsCalendar,
  getCompanyEarnings,
  getTodaysEarnings,
  getThisWeeksEarnings,
  getNextWeeksEarnings,
  groupEarningsByDate,
  type EarningsCalendarEntry,
} from "@/lib/alpha-vantage";
import {
  getExpectedMoveBatch,
  getEarningsEnhancedDataBatch,
  getHistoricalEarningsDataBatch,
} from "@/lib/yahoo-finance";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // 24 hours

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const filter = searchParams.get("filter"); // today, thisWeek, nextWeek, all
    const horizon = (searchParams.get("horizon") || "3month") as "3month" | "6month" | "12month";
    const includeExpectedMove = searchParams.get("expectedMove") === "true";

    // If symbol is provided, get historical earnings for that company
    if (symbol) {
      const earnings = await getCompanyEarnings(symbol);
      if (!earnings) {
        return NextResponse.json(
          { error: "Could not fetch earnings data" },
          { status: 404 }
        );
      }
      return NextResponse.json(earnings);
    }

    // Otherwise, get the earnings calendar
    const allEarnings = await getEarningsCalendar(horizon);

    let filteredEarnings: EarningsCalendarEntry[] = allEarnings;

    switch (filter) {
      case "today":
        filteredEarnings = getTodaysEarnings(allEarnings);
        break;
      case "thisWeek":
        filteredEarnings = getThisWeeksEarnings(allEarnings);
        break;
      case "nextWeek":
        filteredEarnings = getNextWeeksEarnings(allEarnings);
        break;
      default:
        // Return all earnings (sorted by date)
        filteredEarnings = allEarnings.sort((a, b) =>
          a.reportDate.localeCompare(b.reportDate)
        );
    }

    // Fetch enhanced data (report timing + market cap) for earnings
    // Prioritize today and upcoming earnings
    const today = new Date().toISOString().split('T')[0];
    if (filteredEarnings.length > 0) {
      // Prioritize upcoming earnings (today + future) over past
      const upcomingForEnhanced = filteredEarnings.filter(e => e.reportDate >= today);
      const pastForEnhanced = filteredEarnings.filter(e => e.reportDate < today);
      const prioritizedForEnhanced = [...upcomingForEnhanced, ...pastForEnhanced];

      const symbolsForEnhanced = prioritizedForEnhanced.slice(0, 100).map(e => e.symbol);
      console.log(`[Earnings API] Fetching enhanced data for ${symbolsForEnhanced.length} stocks (${upcomingForEnhanced.length} upcoming)`);

      const enhancedData = await getEarningsEnhancedDataBatch(symbolsForEnhanced);

      // Merge enhanced data into earnings
      filteredEarnings = filteredEarnings.map(earning => {
        const data = enhancedData.get(earning.symbol);
        return {
          ...earning,
          reportTime: data?.reportTime || 'TBD',
          marketCap: data?.marketCap,
        };
      });

      console.log(`[Earnings API] Added enhanced data for ${enhancedData.size} stocks`);
    }

    // Fetch expected move data if requested
    // Prioritize today and upcoming earnings (expected move only relevant before reporting)
    if (includeExpectedMove && filteredEarnings.length > 0) {
      // Separate earnings into upcoming (today+future) and past
      const upcomingEarnings = filteredEarnings.filter(e => e.reportDate >= today);
      const pastEarnings = filteredEarnings.filter(e => e.reportDate < today);

      // Prioritize upcoming earnings, then fill with past if room
      const prioritizedEarnings = [...upcomingEarnings, ...pastEarnings];
      const symbolsToFetch = prioritizedEarnings.slice(0, 50).map(e => e.symbol);

      const earningsDatesMap = new Map<string, string>();
      filteredEarnings.forEach(e => earningsDatesMap.set(e.symbol, e.reportDate));

      console.log(`[Earnings API] Fetching expected move for ${symbolsToFetch.length} stocks (${upcomingEarnings.length} upcoming, ${pastEarnings.length} past)`);
      const expectedMoveData = await getExpectedMoveBatch(symbolsToFetch, earningsDatesMap);

      // Merge expected move data into earnings
      filteredEarnings = filteredEarnings.map(earning => {
        const moveData = expectedMoveData.get(earning.symbol);
        if (moveData) {
          return {
            ...earning,
            stockPrice: moveData.stockPrice,
            expectedMove: moveData.expectedMove,
            expectedMovePercent: moveData.expectedMovePercent,
            impliedVolatility: moveData.impliedVolatility,
          };
        }
        return earning;
      });

      console.log(`[Earnings API] Added expected move data for ${expectedMoveData.size} stocks`);
    }

    // Fetch historical earnings data (reported EPS + surprise) for past earnings using Yahoo Finance
    const pastEarnings = filteredEarnings.filter(e => e.reportDate < today);
    if (pastEarnings.length > 0) {
      console.log(`[Earnings API] Fetching historical earnings data from Yahoo Finance for ${pastEarnings.length} past earnings`);
      const historicalData = await getHistoricalEarningsDataBatch(pastEarnings);

      // Merge historical data into earnings
      filteredEarnings = filteredEarnings.map(earning => {
        const key = `${earning.symbol}_${earning.reportDate}`;
        const histData = historicalData.get(key);
        if (histData) {
          return {
            ...earning,
            reportedEPS: histData.reportedEPS,
            surprise: histData.surprise,
            surprisePercent: histData.surprisePercent,
          };
        }
        return earning;
      });

      console.log(`[Earnings API] Added historical data for ${historicalData.size} past earnings`);
    }

    // Group by date for calendar view
    const grouped = groupEarningsByDate(filteredEarnings);
    const groupedObj: Record<string, EarningsCalendarEntry[]> = {};
    grouped.forEach((entries, date) => {
      groupedObj[date] = entries;
    });

    return NextResponse.json({
      earnings: filteredEarnings,
      grouped: groupedObj,
      total: filteredEarnings.length,
      filter: filter || "all",
      horizon,
    });
  } catch (error) {
    console.error("[API] Error in earnings route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
