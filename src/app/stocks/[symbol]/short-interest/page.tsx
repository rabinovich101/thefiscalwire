"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Info, TrendingDown, Loader2 } from "lucide-react";

interface ShortInterestRow {
  settlementDate: string;
  interest: string;
  avgDailyShareVolume: string;
  daysToCover: number;
}

interface ShortInterestData {
  symbol: string;
  headers: {
    settlementDate: string;
    interest: string;
    avgDailyShareVolume: string;
    daysToCover: string;
  };
  rows: ShortInterestRow[];
}

export default function ShortInterestPage() {
  const params = useParams();
  const symbol = (params.symbol as string).toUpperCase();
  const [data, setData] = useState<ShortInterestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShortInterest() {
      try {
        setLoading(true);
        const response = await fetch(`/api/stocks/${symbol}/short-interest`);
        if (!response.ok) {
          throw new Error("Failed to fetch short interest data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchShortInterest();
  }, [symbol]);

  if (loading) {
    return (
      <div className="space-y-6">
        <section className="bg-surface rounded-xl border border-border/50 p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </section>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <section className="bg-surface rounded-xl border border-border/50 p-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
              <TrendingDown className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Short Interest</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Short interest data is not available for {symbol} at this time.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Table Section */}
      <section className="bg-surface rounded-xl border border-border/50 p-6">
        <h2 className="text-lg font-semibold mb-6">Short Interest - {symbol}</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Settlement Date
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Short Interest
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Avg. Daily Volume
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Days to Cover
                </th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, index) => (
                <tr
                  key={row.settlementDate}
                  className={`border-b border-border/30 ${
                    index % 2 === 0 ? "bg-muted/20" : ""
                  } hover:bg-muted/40 transition-colors`}
                >
                  <td className="py-3 px-4 text-sm">{row.settlementDate}</td>
                  <td className="py-3 px-4 text-sm text-right font-mono">
                    {row.interest}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-mono">
                    {row.avgDailyShareVolume}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-mono">
                    {row.daysToCover.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-surface rounded-xl border border-border/50 p-6">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">About Short Interest</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Short Interest</strong> represents the total number of shares that have been
              sold short but have not yet been covered or closed out. It indicates how many investors
              are betting against the stock.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              <strong>Days to Cover</strong> (also known as short interest ratio) is calculated by
              dividing the short interest by the average daily trading volume. It indicates how many
              days it would take for all short sellers to cover their positions. A higher number
              may indicate potential for a short squeeze.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
