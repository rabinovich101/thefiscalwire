import { NextResponse } from "next/server";
import { getHeatmapData } from "@/lib/yahoo-finance";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Cache for 1 minute

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const index = searchParams.get("index") as "sp500" | "nasdaq" || "sp500";

    if (index !== "sp500" && index !== "nasdaq") {
      return NextResponse.json(
        { error: "Invalid index. Must be 'sp500' or 'nasdaq'" },
        { status: 400 }
      );
    }

    const data = await getHeatmapData(index);

    return NextResponse.json({
      index,
      stocks: data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    return NextResponse.json(
      { error: "Failed to fetch heatmap data" },
      { status: 500 }
    );
  }
}
