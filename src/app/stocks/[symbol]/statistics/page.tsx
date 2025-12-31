import { notFound } from "next/navigation";
import { StockStatistics } from "@/components/stocks";
import { getStockData } from "@/lib/stock-data";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ symbol: string }>;
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
