import { NextRequest, NextResponse } from "next/server";
import { getQuotes, getMarketIndices } from "@/lib/yahoo-finance";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbolsParam = searchParams.get("symbols");

    let quotes;
    if (symbolsParam) {
      // Fetch specific symbols
      const symbols = symbolsParam.split(",").map((s) => s.trim());
      quotes = await getQuotes(symbols);
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
