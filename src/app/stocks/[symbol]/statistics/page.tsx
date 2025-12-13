import { notFound } from "next/navigation";
import { StockStatistics } from "@/components/stocks";

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

export default async function StatisticsPage({ params }: PageProps) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  const stock = await getStockData(upperSymbol);

  if (!stock || stock.error) {
    notFound();
  }

  // Add symbol to stock for historical data fetching
  const stockWithSymbol = { ...stock, symbol: upperSymbol };

  return (
    <div className="space-y-6">
      <section className="bg-surface rounded-xl border border-border/50 p-6">
        <h2 className="text-lg font-semibold mb-6">Key Statistics - {upperSymbol}</h2>
        <StockStatistics stock={stockWithSymbol} currency={stock.currency} />
      </section>
    </div>
  );
}
