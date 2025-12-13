"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type OptionType = "calls" | "puts";

interface OptionContract {
  contractSymbol: string | null;
  strike: number | null;
  lastPrice: number | null;
  change: number | null;
  percentChange: number | null;
  volume: number | null;
  openInterest: number | null;
  bid: number | null;
  ask: number | null;
  impliedVolatility: number | null;
  inTheMoney: boolean;
}

interface OptionsData {
  expirationDates: string[];
  strikes: number[];
  quote: {
    price: number | null;
    change: number | null;
    changePercent: number | null;
  } | null;
  calls: OptionContract[];
  puts: OptionContract[];
}

export default function OptionsPage() {
  const params = useParams();
  const symbol = (params.symbol as string).toUpperCase();

  const [data, setData] = useState<OptionsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [optionType, setOptionType] = useState<OptionType>("calls");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const url = selectedDate
          ? `/api/stocks/${symbol}/options?date=${selectedDate}`
          : `/api/stocks/${symbol}/options`;
        const res = await fetch(url);
        const json = await res.json();
        if (!json.error) {
          setData(json);
          if (!selectedDate && json.expirationDates?.[0]) {
            setSelectedDate(json.expirationDates[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch options:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol, selectedDate]);

  const formatPrice = (value: number | null) => {
    if (value === null) return "—";
    return value.toFixed(2);
  };

  const formatPercent = (value: number | null) => {
    if (value === null) return "—";
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const formatIV = (value: number | null) => {
    if (value === null) return "—";
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatNumber = (value: number | null) => {
    if (value === null) return "—";
    return value.toLocaleString();
  };

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        Options data not available
      </div>
    );
  }

  const options = optionType === "calls" ? data.calls : data.puts;

  return (
    <div className="space-y-6">
      <section className="bg-surface rounded-xl border border-border/50 p-6">
        {/* Header with controls */}
        <div className="flex flex-col gap-4 mb-6">
          <h2 className="text-lg font-semibold">Options Chain: {symbol}</h2>

          <div className="flex flex-wrap items-center gap-4">
            {/* Expiration Date Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Expiration:</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {data.expirationDates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </option>
                ))}
              </select>
            </div>

            {/* Option Type Toggle */}
            <div className="flex rounded-lg bg-muted/50 p-1">
              {[
                { value: "calls", label: "Calls" },
                { value: "puts", label: "Puts" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setOptionType(type.value as OptionType)}
                  className={cn(
                    "px-4 py-1.5 text-sm rounded-md transition-colors",
                    optionType === type.value
                      ? type.value === "calls"
                        ? "bg-positive/20 text-positive font-medium"
                        : "bg-negative/20 text-negative font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Options Table */}
        {options.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No {optionType} available for this expiration date
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Strike</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Last</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Change</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">% Change</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Bid</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Ask</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Volume</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Open Int.</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">IV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {options.map((option, idx) => {
                  const isPositive = (option.change || 0) >= 0;
                  return (
                    <tr
                      key={option.contractSymbol || idx}
                      className={cn(
                        "hover:bg-muted/30 transition-colors",
                        option.inTheMoney && "bg-primary/5"
                      )}
                    >
                      <td className={cn(
                        "py-3 px-2 text-right font-medium tabular-nums",
                        option.inTheMoney && "text-primary"
                      )}>
                        {formatPrice(option.strike)}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums font-medium">
                        {formatPrice(option.lastPrice)}
                      </td>
                      <td className={cn(
                        "py-3 px-2 text-right tabular-nums",
                        isPositive ? "text-positive" : "text-negative"
                      )}>
                        {formatPrice(option.change)}
                      </td>
                      <td className={cn(
                        "py-3 px-2 text-right tabular-nums",
                        isPositive ? "text-positive" : "text-negative"
                      )}>
                        {formatPercent(option.percentChange)}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums">
                        {formatPrice(option.bid)}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums">
                        {formatPrice(option.ask)}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums">
                        {formatNumber(option.volume)}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums">
                        {formatNumber(option.openInterest)}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums">
                        {formatIV(option.impliedVolatility)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          * ITM (In The Money) options are highlighted. IV = Implied Volatility.
        </p>
      </section>
    </div>
  );
}
