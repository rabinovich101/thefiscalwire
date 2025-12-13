"use client";

import { useParams } from "next/navigation";
import { StockNews } from "@/components/stocks";

export default function NewsPage() {
  const params = useParams();
  const symbol = (params.symbol as string).toUpperCase();

  return (
    <div className="space-y-6">
      <section className="bg-surface rounded-xl border border-border/50 p-6">
        <h2 className="text-lg font-semibold mb-4">Latest News: {symbol}</h2>
        <StockNews symbol={symbol} limit={20} />
      </section>
    </div>
  );
}
