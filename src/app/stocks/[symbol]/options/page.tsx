"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Strategy = "all" | "calls" | "puts";
type Moneyness = "all" | "near" | "itm" | "otm";

interface OptionSide {
  last: number | null;
  change: number | null;
  bid: number | null;
  ask: number | null;
  volume: number | null;
  openInterest: number | null;
  inTheMoney: boolean;
}

interface OptionRow {
  expiryDate: string;
  expiryDateShort: string;
  expiryGroupHeader: string;
  strike: number;
  call: OptionSide;
  put: OptionSide;
}

interface ExpirationMonth {
  label: string;
  value: string;
  fromdate: string;
}

interface FilterOption {
  label: string;
  value: string;
}

interface OptionsData {
  symbol: string;
  expirationMonths: ExpirationMonth[];
  expirationDates: string[];
  lastTradeInfo: string;
  quote: {
    price: number | null;
    change: number | null;
    changePercent: number | null;
  } | null;
  options: OptionRow[];
  groupedOptions: Record<string, OptionRow[]>;
  exchangeOptions: FilterOption[];
  typeOptions: FilterOption[];
}

export default function OptionsPage() {
  const params = useParams();
  const symbol = (params.symbol as string).toUpperCase();

  const [data, setData] = useState<OptionsData | null>(null);
  const [expirationMonths, setExpirationMonths] = useState<ExpirationMonth[]>([]);
  const [exchangeOptions, setExchangeOptions] = useState<FilterOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFromDate, setSelectedFromDate] = useState<string>("");
  const [selectedExchange, setSelectedExchange] = useState<string>("");
  const [strategy, setStrategy] = useState<Strategy>("all");
  const [moneyness, setMoneyness] = useState<Moneyness>("near");

  // Initial fetch to get expiration months list and filter options
  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/stocks/${symbol}/options`);
        const json = await res.json();
        if (!json.error) {
          setData(json);
          setExpirationMonths(json.expirationMonths || []);
          setExchangeOptions(json.exchangeOptions || []);
          if (json.expirationMonths?.[0]?.fromdate) {
            setSelectedFromDate(json.expirationMonths[0].fromdate);
          }
          // Set default selected exchange from first option
          if (json.exchangeOptions?.[0]?.value) {
            setSelectedExchange(json.exchangeOptions[0].value);
          }
        }
      } catch (error) {
        console.error("Failed to fetch options:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitial();
  }, [symbol]);

  // Fetch options when filters change
  useEffect(() => {
    if (!selectedFromDate || expirationMonths.length === 0) return;

    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        let url = `/api/stocks/${symbol}/options?fromdate=${selectedFromDate}`;
        if (selectedExchange) {
          url += `&excode=${selectedExchange}`;
        }
        const res = await fetch(url);
        const json = await res.json();
        if (!json.error) {
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch options:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [symbol, selectedFromDate, selectedExchange, expirationMonths.length]);

  // Group options by expiry date
  const groupedByExpiry = useMemo(() => {
    const groups: Record<string, OptionRow[]> = {};
    for (const opt of data?.options || []) {
      if (!groups[opt.expiryDate]) {
        groups[opt.expiryDate] = [];
      }
      groups[opt.expiryDate].push(opt);
    }
    return groups;
  }, [data?.options]);

  // Filter by moneyness
  const filteredGroupedByExpiry = useMemo(() => {
    if (moneyness === "all") return groupedByExpiry;

    const quotePrice = data?.quote?.price;
    if (!quotePrice) return groupedByExpiry;

    const filtered: Record<string, OptionRow[]> = {};

    for (const [date, rows] of Object.entries(groupedByExpiry)) {
      const filteredRows = rows.filter(row => {
        if (moneyness === "near") {
          // Near the money: within 10% of current price
          const pctDiff = Math.abs(row.strike - quotePrice) / quotePrice;
          return pctDiff <= 0.10;
        } else if (moneyness === "itm") {
          // In the money: call strike < price, put strike > price
          return row.call.inTheMoney || row.put.inTheMoney;
        } else if (moneyness === "otm") {
          // Out of the money
          return !row.call.inTheMoney && !row.put.inTheMoney;
        }
        return true;
      });

      if (filteredRows.length > 0) {
        filtered[date] = filteredRows;
      }
    }

    return filtered;
  }, [groupedByExpiry, moneyness, data?.quote?.price]);

  // Format price - NO commas, just number with 2 decimals
  const formatPrice = (value: number | null) => {
    if (value === null) return "--";
    return value.toFixed(2);
  };

  // Format number - NO commas
  const formatNumber = (value: number | null) => {
    if (value === null) return "--";
    return String(value);
  };

  // Render change cell with arrow
  const renderChange = (value: number | null) => {
    if (value === null) return <span className="text-muted-foreground">--</span>;
    const isPositive = value >= 0;
    const sign = isPositive ? "+" : "";
    return (
      <span className={cn(isPositive ? "text-positive" : "text-negative")}>
        {sign}{value.toFixed(2)}{isPositive ? "▲" : "▼"}
      </span>
    );
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

  const expiryDates = Object.keys(filteredGroupedByExpiry).sort();

  // Calculate column counts for spanning
  const callsColSpan = 7; // Exp Date, Last, Change, Bid, Ask, Volume, Open Int
  const putsColSpan = 6;  // Last, Change, Bid, Ask, Volume, Open Int
  const totalColSpan = strategy === "all" ? callsColSpan + 1 + putsColSpan : (strategy === "calls" ? callsColSpan + 1 : 1 + putsColSpan);

  return (
    <div className="p-4">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-1">{symbol} / Option Chain</div>

      {/* Title */}
      <h1 className="text-xl font-semibold mb-4">{symbol} Option Chain</h1>

      {/* Filter Controls - 5 Dropdowns */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        {/* 1. Expiration Dates */}
        <div>
          <div className="text-xs text-muted-foreground mb-1">Expiration Dates</div>
          <div className="relative">
            <select
              value={selectedFromDate}
              onChange={(e) => setSelectedFromDate(e.target.value)}
              className="appearance-none bg-surface border border-border rounded px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              {expirationMonths.map((month) => (
                <option key={month.fromdate} value={month.fromdate}>
                  {month.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* 2. Option (Exchange) */}
        <div>
          <div className="text-xs text-muted-foreground mb-1">Option</div>
          <div className="relative">
            <select
              value={selectedExchange}
              onChange={(e) => setSelectedExchange(e.target.value)}
              className="appearance-none bg-surface border border-border rounded px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              {exchangeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* 3. Strategy */}
        <div>
          <div className="text-xs text-muted-foreground mb-1">Strategy</div>
          <div className="relative">
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as Strategy)}
              className="appearance-none bg-surface border border-border rounded px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              <option value="all">Calls & Puts</option>
              <option value="calls">Calls Only</option>
              <option value="puts">Puts Only</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* 4. Moneyness */}
        <div>
          <div className="text-xs text-muted-foreground mb-1">Moneyness</div>
          <div className="relative">
            <select
              value={moneyness}
              onChange={(e) => setMoneyness(e.target.value as Moneyness)}
              className="appearance-none bg-surface border border-border rounded px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              <option value="near">Near the Money</option>
              <option value="itm">In the Money</option>
              <option value="otm">Out of the Money</option>
              <option value="all">All</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Options Table - BORDERLESS Design */}
      {expiryDates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No options available for this period
        </div>
      ) : (
        <div className="overflow-x-auto text-[13px]">
          <table className="w-full">
            {/* Calls / Puts header row */}
            <thead>
              <tr className="border-b border-border">
                {(strategy === "all" || strategy === "calls") && (
                  <th colSpan={callsColSpan} className="text-left font-medium py-2 px-1">
                    Calls
                  </th>
                )}
                <th className="py-2 px-1"></th>
                {(strategy === "all" || strategy === "puts") && (
                  <th colSpan={putsColSpan} className="text-left font-medium py-2 px-1">
                    Puts
                  </th>
                )}
              </tr>
              {/* Column headers */}
              <tr className="border-b border-border text-xs text-muted-foreground">
                {(strategy === "all" || strategy === "calls") && (
                  <>
                    <th className="text-left font-normal py-1.5 px-1">Exp. Date</th>
                    <th className="text-right font-normal py-1.5 px-1">Last</th>
                    <th className="text-right font-normal py-1.5 px-1">Change</th>
                    <th className="text-right font-normal py-1.5 px-1">Bid</th>
                    <th className="text-right font-normal py-1.5 px-1">Ask</th>
                    <th className="text-right font-normal py-1.5 px-1">Volume</th>
                    <th className="text-right font-normal py-1.5 px-1">Open Int.</th>
                  </>
                )}
                <th className="text-center font-normal py-1.5 px-2">Strike</th>
                {(strategy === "all" || strategy === "puts") && (
                  <>
                    <th className="text-right font-normal py-1.5 px-1">Last</th>
                    <th className="text-right font-normal py-1.5 px-1">Change</th>
                    <th className="text-right font-normal py-1.5 px-1">Bid</th>
                    <th className="text-right font-normal py-1.5 px-1">Ask</th>
                    <th className="text-right font-normal py-1.5 px-1">Volume</th>
                    <th className="text-right font-normal py-1.5 px-1">Open Int.</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {expiryDates.map((expiryDate) => {
                const rows = filteredGroupedByExpiry[expiryDate];
                const groupHeader = rows[0]?.expiryGroupHeader || expiryDate;

                return (
                  <React.Fragment key={expiryDate}>
                    {/* Expiration Group Header */}
                    <tr className="border-b border-border">
                      <td
                        colSpan={totalColSpan}
                        className="py-2 px-1 font-medium text-sm"
                      >
                        {groupHeader}
                      </td>
                    </tr>
                    {/* Data rows */}
                    {rows.map((option, idx) => (
                      <tr
                        key={`${expiryDate}-${option.strike}-${idx}`}
                        className="hover:bg-surface-hover cursor-pointer"
                      >
                        {/* Calls data */}
                        {(strategy === "all" || strategy === "calls") && (
                          <>
                            <td className={cn(
                              "py-1 px-1 text-left tabular-nums",
                              option.call.inTheMoney && "bg-blue-500/10"
                            )}>
                              {option.expiryDateShort}
                            </td>
                            <td className={cn(
                              "py-1 px-1 text-right tabular-nums",
                              option.call.inTheMoney && "bg-blue-500/10"
                            )}>
                              {formatPrice(option.call.last)}
                            </td>
                            <td className={cn(
                              "py-1 px-1 text-right tabular-nums",
                              option.call.inTheMoney && "bg-blue-500/10"
                            )}>
                              {renderChange(option.call.change)}
                            </td>
                            <td className={cn(
                              "py-1 px-1 text-right tabular-nums",
                              option.call.inTheMoney && "bg-blue-500/10"
                            )}>
                              {formatPrice(option.call.bid)}
                            </td>
                            <td className={cn(
                              "py-1 px-1 text-right tabular-nums",
                              option.call.inTheMoney && "bg-blue-500/10"
                            )}>
                              {formatPrice(option.call.ask)}
                            </td>
                            <td className={cn(
                              "py-1 px-1 text-right tabular-nums",
                              option.call.inTheMoney && "bg-blue-500/10"
                            )}>
                              {formatNumber(option.call.volume)}
                            </td>
                            <td className={cn(
                              "py-1 px-1 text-right tabular-nums",
                              option.call.inTheMoney && "bg-blue-500/10"
                            )}>
                              {formatNumber(option.call.openInterest)}
                            </td>
                          </>
                        )}
                        {/* Strike */}
                        <td className="py-1 px-2 text-center tabular-nums">
                          <Link
                            href={`/stocks/${symbol}/options/${option.strike}`}
                            className="text-[#0891b2] hover:underline font-medium"
                          >
                            {option.strike.toFixed(2)}
                          </Link>
                        </td>
                        {/* Puts data */}
                        {(strategy === "all" || strategy === "puts") && (
                          <>
                            <td className={cn(
                              "py-1 px-1 text-right tabular-nums",
                              option.put.inTheMoney && "bg-pink-500/10"
                            )}>
                              {formatPrice(option.put.last)}
                            </td>
                            <td className={cn(
                              "py-1 px-1 text-right tabular-nums",
                              option.put.inTheMoney && "bg-pink-500/10"
                            )}>
                              {renderChange(option.put.change)}
                            </td>
                            <td className={cn(
                              "py-1 px-1 text-right tabular-nums",
                              option.put.inTheMoney && "bg-pink-500/10"
                            )}>
                              {formatPrice(option.put.bid)}
                            </td>
                            <td className={cn(
                              "py-1 px-1 text-right tabular-nums",
                              option.put.inTheMoney && "bg-pink-500/10"
                            )}>
                              {formatPrice(option.put.ask)}
                            </td>
                            <td className={cn(
                              "py-1 px-1 text-right tabular-nums",
                              option.put.inTheMoney && "bg-pink-500/10"
                            )}>
                              {formatNumber(option.put.volume)}
                            </td>
                            <td className={cn(
                              "py-1 px-1 text-right tabular-nums",
                              option.put.inTheMoney && "bg-pink-500/10"
                            )}>
                              {formatNumber(option.put.openInterest)}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer info */}
      {data.lastTradeInfo && (
        <p className="mt-4 text-sm text-muted-foreground">
          {data.lastTradeInfo}
        </p>
      )}
    </div>
  );
}
