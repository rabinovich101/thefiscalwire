import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export const dynamic = "force-dynamic";

interface NewsParams {
  params: Promise<{ symbol: string }>;
}

export async function GET(request: NextRequest, { params }: NewsParams) {
  try {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();

    // Search for news related to the stock
    const results = await yahooFinance.search(upperSymbol, {
      quotesCount: 0,
      newsCount: 10,
    });

    const news = (results.news || []).map((item) => ({
      uuid: item.uuid,
      title: item.title,
      publisher: item.publisher,
      link: item.link,
      publishedAt: item.providerPublishTime,
      thumbnail: item.thumbnail?.resolutions?.[0]?.url || null,
      relatedTickers: item.relatedTickers || [],
    }));

    return NextResponse.json(
      { news, symbol: upperSymbol },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Stock news error:", error);
    return NextResponse.json(
      { error: "Failed to fetch news", news: [] },
      { status: 500 }
    );
  }
}
