"use client";

import { useParams } from "next/navigation";
import { AdvancedStockChart, StockNews } from "@/components/stocks";

export default function ChartPage() {
  const params = useParams();
  const symbol = (params.symbol as string).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Full Advanced Chart */}
      <section className="bg-surface rounded-xl border border-border/50 p-6">
        <AdvancedStockChart symbol={symbol} className="min-h-[600px]" />
      </section>

      {/* News Section */}
      <section className="bg-surface rounded-xl border border-border/50 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent News: {symbol}</h2>
        <StockNews symbol={symbol} />
      </section>
    </div>
  );
}
