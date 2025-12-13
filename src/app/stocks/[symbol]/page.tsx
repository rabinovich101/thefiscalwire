import { notFound } from "next/navigation";
import { StockChartSection, StockStatistics, StockNews } from "@/components/stocks";
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

      {/* Key Statistics Grid - Yahoo Finance Style */}
      <section className="bg-surface rounded-xl border border-border/50 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem label="Previous Close" value={formatPrice(stock.previousClose)} />
          <StatItem label="Open" value={formatPrice(stock.open)} />
          <StatItem label="Bid" value={stock.bid ? `${formatPrice(stock.bid)} x ${stock.bidSize || '—'}` : '—'} />
          <StatItem label="Ask" value={stock.ask ? `${formatPrice(stock.ask)} x ${stock.askSize || '—'}` : '—'} />
          <StatItem label="Day's Range" value={`${formatPrice(stock.dayLow)} - ${formatPrice(stock.dayHigh)}`} />
          <StatItem label="52 Week Range" value={`${formatPrice(stock.fiftyTwoWeekLow)} - ${formatPrice(stock.fiftyTwoWeekHigh)}`} />
          <StatItem label="Volume" value={formatNumber(stock.volume)} />
          <StatItem label="Avg. Volume" value={formatNumber(stock.avgVolume)} />
          <StatItem label="Market Cap" value={formatLargeNumber(stock.marketCap)} />
          <StatItem label="Beta (5Y)" value={stock.beta?.toFixed(2) || '—'} />
          <StatItem label="PE Ratio (TTM)" value={stock.trailingPE?.toFixed(2) || '—'} />
          <StatItem label="EPS (TTM)" value={stock.eps ? formatPrice(stock.eps) : '—'} />
          <StatItem label="Earnings Date" value={formatDate(stock.earningsDate)} />
          <StatItem label="Dividend & Yield" value={formatDividend(stock.dividendRate, stock.dividendYield)} />
          <StatItem label="Ex-Dividend Date" value={formatDate(stock.exDividendDate)} />
          <StatItem label="1Y Target Est" value={stock.targetMeanPrice ? formatPrice(stock.targetMeanPrice) : '—'} />
        </div>
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

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  );
}

function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null) return '—';
  return `$${price.toFixed(2)}`;
}

function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return '—';
  return num.toLocaleString();
}

function formatLargeNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return '—';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

function formatDate(date: string | Date | undefined | null): string {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDividend(rate: number | undefined | null, yieldVal: number | undefined | null): string {
  if (!rate) return '—';
  // dividendYield from Yahoo Finance is already a decimal (e.g., 0.0037 for 0.37%)
  const yieldPercent = yieldVal ? (yieldVal * 100).toFixed(2) : '0.00';
  return `$${rate.toFixed(2)} (${yieldPercent}%)`;
}
