import { NextRequest, NextResponse } from "next/server";
import { getTopGainers, getTopLosers } from "@/lib/yahoo-finance";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type"); // "gainers" or "losers"

    if (type === "gainers") {
      const gainers = await getTopGainers();
      return NextResponse.json(gainers, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    if (type === "losers") {
      const losers = await getTopLosers();
      return NextResponse.json(losers, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    // Fetch both if no type specified
    const [gainers, losers] = await Promise.all([
      getTopGainers(),
      getTopLosers(),
    ]);

    return NextResponse.json(
      { gainers, losers },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error in /api/market/movers:", error);
    return NextResponse.json(
      { error: "Failed to fetch market movers" },
      { status: 500 }
    );
  }
}
