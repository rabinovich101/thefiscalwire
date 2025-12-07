import { NextRequest, NextResponse } from "next/server";
import { searchStocks } from "@/data/stockSymbols";
import { rateLimitMiddleware } from "@/lib/rate-limit";
import { validateSearchParams, stockSearchSchema, validationErrorResponse } from "@/lib/validations";

export const dynamic = "force-dynamic";

interface YahooSearchResult {
  symbol: string;
  shortname?: string;
  longname?: string;
  exchDisp?: string;
  typeDisp?: string;
  quoteType?: string;
}

interface YahooSearchResponse {
  quotes?: YahooSearchResult[];
}

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = rateLimitMiddleware(request, 'market');
  if (rateLimitResponse) return rateLimitResponse;

  // Validate input
  const validation = validateSearchParams(request.nextUrl.searchParams, stockSearchSchema);
  if (!validation.success) {
    return validationErrorResponse(validation.error);
  }

  const { q: query } = validation.data;

  try {

    // Try Yahoo Finance search API first for comprehensive results
    try {
      const yahooUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=20&newsCount=0&listsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query`;

      const response = await fetch(yahooUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      });

      if (response.ok) {
        const data: YahooSearchResponse = await response.json();

        if (data.quotes && data.quotes.length > 0) {
          const results = data.quotes
            .filter((quote) => {
              // Filter to stocks and ETFs only (exclude crypto, futures, etc.)
              const quoteType = quote.quoteType?.toUpperCase();
              return quoteType === "EQUITY" || quoteType === "ETF" || quoteType === "INDEX";
            })
            .map((quote) => ({
              symbol: quote.symbol,
              name: quote.longname || quote.shortname || quote.symbol,
              exchange: quote.exchDisp || "Unknown",
              type: mapQuoteType(quote.quoteType),
            }));

          if (results.length > 0) {
            return NextResponse.json(
              { results },
              {
                headers: {
                  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
                },
              }
            );
          }
        }
      }
    } catch (yahooError) {
      console.warn("Yahoo Finance search failed, falling back to local:", yahooError);
    }

    // Fallback to local stock database if Yahoo fails
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

function mapQuoteType(quoteType?: string): "EQUITY" | "ETF" | "INDEX" {
  switch (quoteType?.toUpperCase()) {
    case "ETF":
      return "ETF";
    case "INDEX":
      return "INDEX";
    default:
      return "EQUITY";
  }
}
