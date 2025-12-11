import { NextRequest } from "next/server";
import {
  getEarningsCalendar,
  getThisWeeksEarnings,
  type EarningsCalendarEntry,
} from "@/lib/alpha-vantage";
import { getEarningsEnhancedData, getExpectedMove } from "@/lib/yahoo-finance";

export const dynamic = "force-dynamic";

// Server-Sent Events endpoint for progressive earnings data loading
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const horizon = (searchParams.get("horizon") || "3month") as "3month" | "6month" | "12month";
  const includeExpectedMove = searchParams.get("expectedMove") === "true";

  // Create a readable stream for SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Get earnings calendar
        const allEarnings = await getEarningsCalendar(horizon);
        const thisWeeksEarnings = getThisWeeksEarnings(allEarnings);

        // Get today's date for prioritization
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Calculate dates for prioritization
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // Prioritize: Today -> Tomorrow -> Yesterday -> Future -> Past
        const todaysEarnings = thisWeeksEarnings.filter(e => e.reportDate === todayStr);
        const tomorrowsEarnings = thisWeeksEarnings.filter(e => e.reportDate === tomorrowStr);
        const yesterdaysEarnings = thisWeeksEarnings.filter(e => e.reportDate === yesterdayStr);
        const futureEarnings = thisWeeksEarnings
          .filter(e => e.reportDate > tomorrowStr)
          .sort((a, b) => a.reportDate.localeCompare(b.reportDate));
        const pastEarnings = thisWeeksEarnings
          .filter(e => e.reportDate < yesterdayStr)
          .sort((a, b) => b.reportDate.localeCompare(a.reportDate)); // Most recent past first

        const prioritizedEarnings = [
          ...todaysEarnings,
          ...tomorrowsEarnings,
          ...yesterdaysEarnings,
          ...futureEarnings,
          ...pastEarnings
        ];

        console.log(`[Earnings Stream] Priority order: Today(${todaysEarnings.length}), Tomorrow(${tomorrowsEarnings.length}), Yesterday(${yesterdaysEarnings.length}), Future(${futureEarnings.length}), Past(${pastEarnings.length})`);

        // Limit to first 100 for enhanced data
        const earningsToEnhance = prioritizedEarnings.slice(0, 100);

        console.log(`[Earnings Stream] Starting stream for ${earningsToEnhance.length} stocks`);

        // Process each stock one by one and stream the result
        for (let i = 0; i < earningsToEnhance.length; i++) {
          const earning = earningsToEnhance[i];

          try {
            // Fetch enhanced data for this single stock
            const enhancedData = await getEarningsEnhancedData(earning.symbol);

            // Build the update object
            const update: Partial<EarningsCalendarEntry> & { symbol: string } = {
              symbol: earning.symbol,
              reportTime: enhancedData.reportTime || 'TBD',
              marketCap: enhancedData.marketCap,
            };

            // Optionally fetch expected move data
            if (includeExpectedMove) {
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
