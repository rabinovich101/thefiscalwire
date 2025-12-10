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

export const dynamic = "force-dynamic";
export const revalidate = 86400; // 24 hours

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const filter = searchParams.get("filter"); // today, thisWeek, nextWeek, all
    const horizon = (searchParams.get("horizon") || "3month") as "3month" | "6month" | "12month";

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
