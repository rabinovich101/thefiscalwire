import { NextRequest, NextResponse } from "next/server";
import { searchStocks } from "@/data/stockSymbols";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.length < 1) {
      return NextResponse.json({ results: [] });
    }

    // Use local stock database for instant autocomplete
    const stocks = searchStocks(query);

    return NextResponse.json(
      { results: stocks },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Stock search error:", error);
    return NextResponse.json(
      { error: "Failed to search stocks", results: [] },
      { status: 500 }
    );
  }
}
