import { NextRequest } from "next/server";
import {
  getEarningsCalendar,
  getThisWeeksEarnings,
  type EarningsCalendarEntry,
} from "@/lib/alpha-vantage";
import { getEarningsEnhancedData, getExpectedMove, getHistoricalEarnings } from "@/lib/yahoo-finance";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Server-Sent Events endpoint for progressive earnings data loading
// Note: This endpoint receives symbols query param from client with the actual earnings list
// The client already has Yahoo+Alpha merged data from page.tsx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const horizon = (searchParams.get("horizon") || "3month") as "3month" | "6month" | "12month";
  const includeExpectedMove = searchParams.get("expectedMove") === "true";
  const symbolsParam = searchParams.get("symbols"); // Comma-separated symbols from client

  // Create a readable stream for SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let thisWeeksEarnings: EarningsCalendarEntry[];

        if (symbolsParam) {
          // Client passed specific symbol:date pairs to enhance (e.g., "AVGO:2025-12-11,AZO:2025-12-09")
          const pairs = symbolsParam.split(",").filter(s => s.trim());
          thisWeeksEarnings = pairs.map(pair => {
            const [symbol, date] = pair.split(":").map(s => s.trim());
            return {
              symbol,
              name: "",
              reportDate: date || "",
              fiscalDateEnding: "",
              estimate: null,
              currency: "USD",
              reportTime: "TBD" as const,
            };
          });
        } else {
          // Fallback: fetch from Alpha Vantage (won't have past dates)
          const allEarnings = await getEarningsCalendar(horizon);
          thisWeeksEarnings = getThisWeeksEarnings(allEarnings);
        }

        // Get today's date for determining past/future
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // When symbols are passed from client, use them in order (client already prioritized)
        // When falling back to Alpha Vantage, prioritize by date
        let earningsToProcess: EarningsCalendarEntry[];

        if (symbolsParam) {
          earningsToProcess = thisWeeksEarnings;
          console.log(`[Earnings Stream] Processing ${earningsToProcess.length} stocks from client`);
        } else {
          // Prioritize: Today -> Tomorrow -> Yesterday -> Future -> Past
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().split('T')[0];

          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          const todaysEarnings = thisWeeksEarnings.filter(e => e.reportDate === todayStr);
          const tomorrowsEarnings = thisWeeksEarnings.filter(e => e.reportDate === tomorrowStr);
          const yesterdaysEarnings = thisWeeksEarnings.filter(e => e.reportDate === yesterdayStr);
          const futureEarnings = thisWeeksEarnings
            .filter(e => e.reportDate > tomorrowStr)
            .sort((a, b) => a.reportDate.localeCompare(b.reportDate));
          const pastEarnings = thisWeeksEarnings
            .filter(e => e.reportDate < yesterdayStr)
            .sort((a, b) => b.reportDate.localeCompare(a.reportDate));

          earningsToProcess = [
            ...todaysEarnings,
            ...tomorrowsEarnings,
            ...yesterdaysEarnings,
            ...futureEarnings,
            ...pastEarnings
          ];
          console.log(`[Earnings Stream] Priority order: Today(${todaysEarnings.length}), Tomorrow(${tomorrowsEarnings.length}), Yesterday(${yesterdaysEarnings.length}), Future(${futureEarnings.length}), Past(${pastEarnings.length})`);
        }

        // Limit to first 100 for enhanced data
        const earningsToEnhance = earningsToProcess.slice(0, 100);

        console.log(`[Earnings Stream] Starting stream for ${earningsToEnhance.length} stocks`);

        // Process each stock one by one and stream the result
        for (let i = 0; i < earningsToEnhance.length; i++) {
          const earning = earningsToEnhance[i];

          try {
            // Fetch enhanced data for this single stock (includes corrected date from Yahoo)
            const enhancedData = await getEarningsEnhancedData(earning.symbol);

            // Build the update object
            const update: Partial<EarningsCalendarEntry> & { symbol: string } = {
              symbol: earning.symbol,
              reportTime: enhancedData.reportTime || 'TBD',
              marketCap: enhancedData.marketCap,
            };

            // Only use Yahoo's date if it's within 7 days of Alpha Vantage's date
            // (Yahoo shows NEXT earnings date after a company reports, which could be months away)
            if (enhancedData.earningsDate) {
              const alphaDate = new Date(earning.reportDate + 'T12:00:00');
              const yahooDate = new Date(enhancedData.earningsDate + 'T12:00:00');
              const diffDays = Math.abs((yahooDate.getTime() - alphaDate.getTime()) / (1000 * 60 * 60 * 24));

              if (diffDays <= 7) {
                // Yahoo date is close to Alpha Vantage - use it as correction
                update.correctedReportDate = enhancedData.earningsDate;
              }
              // If Yahoo date is far away (next quarter), keep Alpha Vantage's date
            }

            // Optionally fetch expected move data (for upcoming earnings)
            if (includeExpectedMove && earning.reportDate >= todayStr) {
              try {
                const expectedMoveData = await getExpectedMove(earning.symbol, earning.reportDate);
                if (expectedMoveData) {
                  update.stockPrice = expectedMoveData.stockPrice;
                  update.expectedMove = expectedMoveData.expectedMove;
                  update.expectedMovePercent = expectedMoveData.expectedMovePercent;
                  update.impliedVolatility = expectedMoveData.impliedVolatility;
                }
              } catch (err) {
                // Skip expected move for this stock if it fails
                console.error(`[Earnings Stream] Expected move error for ${earning.symbol}:`, err);
              }
            }

            // Only fetch historical data for stocks that have ALREADY reported (past dates)
            // Don't show for today/future - they haven't reported this quarter yet
            if (earning.reportDate < todayStr) {
              try {
                const historicalData = await getHistoricalEarnings(earning.symbol);
                if (historicalData.length > 0) {
                  // Sort by quarter (most recent first) and use the most recent data
                  const sortedHistorical = [...historicalData].sort((a, b) => {
                    const [aQ, aY] = [parseInt(a.quarter[0]), parseInt(a.quarter.slice(2))];
                    const [bQ, bY] = [parseInt(b.quarter[0]), parseInt(b.quarter.slice(2))];
                    if (aY !== bY) return bY - aY;
                    return bQ - aQ;
                  });
                  const mostRecent = sortedHistorical[0];

                  if (mostRecent && mostRecent.reportedEPS !== null) {
                    update.reportedEPS = mostRecent.reportedEPS;
                    update.surprise = mostRecent.surprise;
                    update.surprisePercent = mostRecent.surprisePercent;
                  }
                }
              } catch (err) {
                console.error(`[Earnings Stream] Historical data error for ${earning.symbol}:`, err);
              }
            }

            // Send the update as SSE event
            const data = `data: ${JSON.stringify(update)}\n\n`;
            controller.enqueue(encoder.encode(data));

            // Log progress every 10 stocks
            if ((i + 1) % 10 === 0) {
              console.log(`[Earnings Stream] Processed ${i + 1}/${earningsToEnhance.length} stocks`);
            }
          } catch (err) {
            console.error(`[Earnings Stream] Error processing ${earning.symbol}:`, err);
            // Continue with next stock even if one fails
          }
        }

        // Send completion event
        controller.enqueue(encoder.encode('data: {"done": true}\n\n'));
        controller.close();
      } catch (error) {
        console.error("[Earnings Stream] Stream error:", error);
        controller.enqueue(encoder.encode(`data: {"error": "Stream failed"}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
