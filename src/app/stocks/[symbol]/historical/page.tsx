"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoricalDataPoint {
  date: string;
  open: string | null;
  high: string | null;
  low: string | null;
  close: string | null;
  adjClose: string | null;
  volume: number | null;
}

const PERIODS = [
  { value: "5d", label: "5 Days" },
  { value: "1mo", label: "1 Month" },
  { value: "3mo", label: "3 Months" },
  { value: "6mo", label: "6 Months" },
  { value: "1y", label: "1 Year" },
  { value: "2y", label: "2 Years" },
  { value: "5y", label: "5 Years" },
  { value: "max", label: "Max" },
];

export default function HistoricalPage() {
  const params = useParams();
  const symbol = (params.symbol as string).toUpperCase();

  const [data, setData] = useState<HistoricalDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("1mo");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/stocks/${symbol}/historical?period=${period}`);
        const json = await res.json();
        setData(json.data || []);
      } catch (error) {
        console.error("Failed to fetch historical data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol, period]);

  const downloadCSV = () => {
    const headers = ["Date", "Open", "High", "Low", "Close", "Adj Close", "Volume"];
    const rows = data.map((d) =>
      [d.date, d.open, d.high, d.low, d.close, d.adjClose, d.volume].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${symbol}_historical_${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatVolume = (vol: number | null) => {
    if (!vol) return "—";
    if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`;
    if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`;
    if (vol >= 1e3) return `${(vol / 1e3).toFixed(2)}K`;
    return vol.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <section className="bg-surface rounded-xl border border-border/50 p-6">
        {/* Header with controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold">Historical Data: {symbol}</h2>
          <div className="flex items-center gap-3">
            {/* Period Selector */}
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            {/* Download Button */}
            <button
              onClick={downloadCSV}
              disabled={isLoading || data.length === 0}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              Download CSV
            </button>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No historical data available
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Open</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">High</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Low</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Close</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Adj Close</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {data.map((row, index) => (
                  <tr
                    key={row.date}
                    className={cn(
                      "hover:bg-muted/30 transition-colors",
                      index % 2 === 0 && "bg-muted/10"
                    )}
                  >
                    <td className="py-3 px-2 font-medium">{row.date}</td>
                    <td className="py-3 px-2 text-right tabular-nums">{row.open || "—"}</td>
                    <td className="py-3 px-2 text-right tabular-nums">{row.high || "—"}</td>
                    <td className="py-3 px-2 text-right tabular-nums">{row.low || "—"}</td>
                    <td className="py-3 px-2 text-right tabular-nums font-medium">{row.close || "—"}</td>
                    <td className="py-3 px-2 text-right tabular-nums">{row.adjClose || "—"}</td>
                    <td className="py-3 px-2 text-right tabular-nums">{formatVolume(row.volume)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          * Adjusted close price adjusted for splits and dividend distributions.
        </p>
      </section>
    </div>
  );
}
