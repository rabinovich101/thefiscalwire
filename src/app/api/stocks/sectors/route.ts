import { NextResponse } from "next/server";
import { getAllSectorsPerformance } from "@/lib/yahoo-finance";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Cache for 1 minute

export async function GET() {
  try {
    const sectors = await getAllSectorsPerformance();

    return NextResponse.json({
      success: true,
      data: sectors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching sectors:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch sector data",
      },
      { status: 500 }
    );
  }
}
