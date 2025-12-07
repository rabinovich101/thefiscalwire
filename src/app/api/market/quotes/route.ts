import { NextRequest, NextResponse } from "next/server";
import { getQuotes, getMarketIndices } from "@/lib/yahoo-finance";
import { rateLimitMiddleware } from "@/lib/rate-limit";
import { validateSearchParams, marketQuotesSchema, validationErrorResponse } from "@/lib/validations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = rateLimitMiddleware(request, 'market');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const searchParams = request.nextUrl.searchParams;
    const symbolsParam = searchParams.get("symbols");

    let quotes;
    if (symbolsParam) {
      // Validate symbols if provided
      const validation = validateSearchParams(searchParams, marketQuotesSchema);
      if (!validation.success) {
        return validationErrorResponse(validation.error);
      }
      quotes = await getQuotes(validation.data.symbols);
    } else {
      // Fetch default market indices
      quotes = await getMarketIndices();
    }

    return NextResponse.json(quotes, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error in /api/market/quotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}
