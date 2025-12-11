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
import { getExpectedMoveBatch } from "@/lib/yahoo-finance";

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

    // Fetch expected move data if requested
    // Only fetch for first 50 stocks to avoid rate limiting
    if (includeExpectedMove && filteredEarnings.length > 0) {
      const symbolsToFetch = filteredEarnings.slice(0, 50).map(e => e.symbol);
      const earningsDatesMap = new Map<string, string>();
      filteredEarnings.forEach(e => earningsDatesMap.set(e.symbol, e.reportDate));

      console.log(`[Earnings API] Fetching expected move for ${symbolsToFetch.length} stocks`);
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
