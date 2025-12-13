import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface ShortInterestRow {
  settlementDate: string;
  interest: string;
  avgDailyShareVolume: string;
  daysToCover: number;
}

interface NasdaqResponse {
  data: {
    symbol: string;
    shortInterestTable: {
      headers: {
        settlementDate: string;
        interest: string;
        avgDailyShareVolume: string;
        daysToCover: string;
      };
      rows: ShortInterestRow[];
    };
  };
  message: string | null;
  status: {
    rCode: number;
    bCodeMessage: string | null;
    developerMessage: string | null;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  try {
    const response = await fetch(
      `https://api.nasdaq.com/api/quote/${upperSymbol}/short-interest?assetclass=stocks`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch short interest data" },
        { status: response.status }
      );
    }

    const data: NasdaqResponse = await response.json();

    if (!data.data?.shortInterestTable?.rows) {
      return NextResponse.json(
        { error: "No short interest data available" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      symbol: upperSymbol,
      headers: data.data.shortInterestTable.headers,
      rows: data.data.shortInterestTable.rows,
    });
  } catch (error) {
    console.error("Error fetching short interest:", error);
    return NextResponse.json(
      { error: "Failed to fetch short interest data" },
      { status: 500 }
    );
  }
}
