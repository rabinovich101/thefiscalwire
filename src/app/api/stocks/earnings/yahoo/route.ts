import { NextRequest, NextResponse } from "next/server";
import { scrapeYahooEarnings, getYahooEarningsForWeek } from "@/lib/yahoo-earnings-scraper";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60 seconds for scraping

/**
 * GET /api/stocks/earnings/yahoo
 * Scrapes earnings calendar from Yahoo Finance
 * Query params:
 *   - date: specific date (YYYY-MM-DD)
 *   - week: if "true", scrape entire week
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const week = searchParams.get("week");

  try {
    if (week === "true") {
      console.log("[Yahoo API] Scraping week earnings...");
      const earnings = await getYahooEarningsForWeek();
      return NextResponse.json({
        success: true,
        count: earnings.length,
        earnings
      });
    }

    if (date) {
      console.log(`[Yahoo API] Scraping earnings for ${date}...`);
      const earnings = await scrapeYahooEarnings(date);
      return NextResponse.json({
        success: true,
        date,
        count: earnings.length,
        earnings
      });
    }

    // Default: today's earnings
    const today = new Date().toISOString().split('T')[0];
    console.log(`[Yahoo API] Scraping today's earnings (${today})...`);
    const earnings = await scrapeYahooEarnings(today);
    return NextResponse.json({
      success: true,
      date: today,
      count: earnings.length,
      earnings
    });

  } catch (error) {
    console.error("[Yahoo API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to scrape earnings" },
      { status: 500 }
    );
  }
}
