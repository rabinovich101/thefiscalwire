import { notFound } from "next/navigation";
import { StockChartSection, StockStatistics, StockNews, StockStatsTable } from "@/components/stocks";
import { Globe, ExternalLink } from "lucide-react";
import { getStockData } from "@/lib/stock-data";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ symbol: string }>;
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
      <section
        className="bg-surface rounded-xl border border-border/50 p-6"
        aria-labelledby="chart-section-heading"
      >
        <h2 id="chart-section-heading" className="sr-only">
          {upperSymbol} Price Chart
        </h2>
        <StockChartSection symbol={upperSymbol} />
      </section>

      {/* Key Statistics */}
      <section
        className="bg-surface rounded-xl border border-border/50 overflow-hidden"
        aria-labelledby="stats-section-heading"
      >
        <h2 id="stats-section-heading" className="sr-only">
          {upperSymbol} Key Statistics
        </h2>
        <StockStatsTable stock={stock} />
      </section>

      {/* Company Overview */}
      {stock.description && (
        <section
          className="bg-surface rounded-xl border border-border/50 p-6"
          aria-labelledby="overview-section-heading"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 id="overview-section-heading" className="text-lg font-semibold">
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
      <section
        className="bg-surface rounded-xl border border-border/50 p-6"
        aria-labelledby="news-section-heading"
      >
        <h2 id="news-section-heading" className="text-lg font-semibold mb-4">
          Recent News: {upperSymbol}
        </h2>
        <StockNews symbol={upperSymbol} />
      </section>
    </div>
  );
}
