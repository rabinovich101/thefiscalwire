import { NextResponse } from "next/server";
import { getSectorStocksPaginated, getSymbolsForSector, SECTORS } from "@/lib/yahoo-finance";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sector: string }> }
) {
  try {
    const { sector: sectorId } = await params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);

    // Validate sector exists
    const sectorInfo = SECTORS.find((s) => s.id === sectorId);
    if (!sectorInfo) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid sector",
        },
        { status: 404 }
      );
    }

    // Get paginated stocks
    const result = await getSectorStocksPaginated(sectorId, page, limit);

    return NextResponse.json({
      success: true,
      data: {
        sector: sectorInfo,
        stocks: result.stocks,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
          hasMore: result.hasMore,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching sector stocks:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch sector stocks",
      },
      { status: 500 }
    );
  }
}
