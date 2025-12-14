import { notFound } from "next/navigation";
import { StockChartSection, StockStatistics, StockNews, StockStatsTable } from "@/components/stocks";
import { Globe, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ symbol: string }>;
}

async function getStockData(symbol: string) {
  try {
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl && process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else if (!baseUrl && process.env.RAILWAY_PUBLIC_DOMAIN) {
      baseUrl = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
    } else if (!baseUrl) {
      baseUrl = "http://localhost:3000";
    }

    const res = await fetch(`${baseUrl}/api/stocks/${symbol}/quote`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch stock data:", error);
    return null;
  }
}

export default async function StockSummaryPage({ params }: PageProps) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  const stock = await getStockData(upperSymbol);

  if (!stock || stock.error) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <section className="bg-surface rounded-xl border border-border/50 p-6">
        <StockChartSection symbol={upperSymbol} />
      </section>

      {/* Key Statistics */}
      <section className="bg-surface rounded-xl border border-border/50 overflow-hidden">
        <StockStatsTable stock={stock} />
      </section>

      {/* Company Overview */}
      {stock.description && (
        <section className="bg-surface rounded-xl border border-border/50 p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold">
              {stock.name} Overview
              {stock.sector && (
                <span className="text-muted-foreground font-normal text-sm ml-2">
                  — {stock.industry} / {stock.sector}
                </span>
              )}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {stock.description}
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            {stock.employees && (
              <div>
                <span className="text-muted-foreground">Full Time Employees:</span>{" "}
                <span className="font-medium">{stock.employees.toLocaleString()}</span>
              </div>
            )}
            {stock.website && (
              <a
                href={stock.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <Globe className="h-4 w-4" />
                {new URL(stock.website).hostname}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </section>
      )}

      {/* News Section */}
      <section className="bg-surface rounded-xl border border-border/50 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent News: {upperSymbol}</h2>
        <StockNews symbol={upperSymbol} />
      </section>
    </div>
  );
}
