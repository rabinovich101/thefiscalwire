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
  // Greeks and IV
  iv: number | null;
  delta: number | null;
  gamma: number | null;
  theta: number | null;
  vega: number | null;
  rho: number | null;
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
  // Use money=all to get all expiration dates
  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/stocks/${symbol}/options?money=all`);
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
        let url = `/api/stocks/${symbol}/options?fromdate=${selectedFromDate}&money=${moneyness}`;
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
  }, [symbol, selectedFromDate, selectedExchange, moneyness, expirationMonths.length]);

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

  // Moneyness filtering is now handled by the API via the money parameter
  // Just use groupedByExpiry directly
  const filteredGroupedByExpiry = groupedByExpiry;

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

  // Format IV as percentage (e.g., 45.2%)
  const formatIV = (value: number | null) => {
    if (value === null) return "--";
    return (value * 100).toFixed(1) + "%";
  };

  // Format Delta (4 decimal places)
  const formatDelta = (value: number | null) => {
    if (value === null) return "--";
    return value.toFixed(4);
  };

  // Format Gamma (4 decimal places)
  const formatGamma = (value: number | null) => {
    if (value === null) return "--";
    return value.toFixed(4);
  };

  // Format Theta (2 decimal places)
  const formatTheta = (value: number | null) => {
    if (value === null) return "--";
    return value.toFixed(2);
  };

  // Format Vega (2 decimal places)
  const formatVega = (value: number | null) => {
    if (value === null) return "--";
    return value.toFixed(2);
  };

  // Format Rho (2 decimal places)
  const formatRho = (value: number | null) => {
    if (value === null) return "--";
    return value.toFixed(2);
  };

  // Format ROI % (mid price / stock price * 100, fallback to last price if bid/ask unavailable)
  const formatROI = (bid: number | null, ask: number | null, last: number | null) => {
    const stockPrice = data?.quote?.price;
    if (!stockPrice) return "--";

    // Try mid price first (bid + ask), fallback to last price
    let optionPrice: number | null = null;
    if (bid !== null && ask !== null) {
      optionPrice = (bid + ask) / 2;
    } else if (last !== null) {
      optionPrice = last;
    }

    if (optionPrice === null) return "--";
    const roi = (optionPrice / stockPrice) * 100;
    return roi.toFixed(1) + "%";
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

  // Column count for each table (Strike + 13 data columns including ROI %)
  const tableColSpan = 14;

  // Render table for Calls or Puts
  const renderOptionsTable = (type: "calls" | "puts") => {
    const isCall = type === "calls";
    const bgColor = isCall ? "bg-blue-500/10" : "bg-pink-500/10";
    const title = isCall ? "Calls" : "Puts";

    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="text-left font-normal py-1.5 px-2">Strike</th>
              <th className="text-right font-normal py-1.5 px-1">Last</th>
              <th className="text-right font-normal py-1.5 px-1">Change</th>
              <th className="text-right font-normal py-1.5 px-1">Bid</th>
              <th className="text-right font-normal py-1.5 px-1">Ask</th>
              <th className="text-right font-normal py-1.5 px-1">ROI %</th>
              <th className="text-right font-normal py-1.5 px-1">Volume</th>
              <th className="text-right font-normal py-1.5 px-1">Open Int.</th>
              <th className="text-right font-normal py-1.5 px-1">IV</th>
              <th className="text-right font-normal py-1.5 px-1">Delta</th>
              <th className="text-right font-normal py-1.5 px-1">Gamma</th>
              <th className="text-right font-normal py-1.5 px-1">Theta</th>
              <th className="text-right font-normal py-1.5 px-1">Vega</th>
              <th className="text-right font-normal py-1.5 px-1">Rho</th>
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
                      colSpan={tableColSpan}
                      className="py-2 px-1 font-medium text-sm"
                    >
                      {groupHeader}
                    </td>
                  </tr>
                  {/* Data rows */}
                  {rows.map((option, idx) => {
                    const side = isCall ? option.call : option.put;
                    return (
                      <tr
                        key={`${expiryDate}-${option.strike}-${idx}`}
                        className="hover:bg-surface-hover cursor-pointer"
                      >
                        {/* Strike */}
                        <td className="py-1 px-2 text-left tabular-nums">
                          <Link
                            href={`/stocks/${symbol}/options/${option.strike}`}
                            className="text-[#0891b2] hover:underline font-medium"
                          >
                            {option.strike.toFixed(2)}
                          </Link>
                        </td>
                        {/* Last */}
                        <td className={cn(
                          "py-1 px-1 text-right tabular-nums",
                          side.inTheMoney && bgColor
                        )}>
                          {formatPrice(side.last)}
                        </td>
                        {/* Change */}
                        <td className={cn(
                          "py-1 px-1 text-right tabular-nums",
                          side.inTheMoney && bgColor
                        )}>
                          {renderChange(side.change)}
                        </td>
                        {/* Bid */}
                        <td className={cn(
                          "py-1 px-1 text-right tabular-nums",
                          side.inTheMoney && bgColor
                        )}>
                          {formatPrice(side.bid)}
                        </td>
                        {/* Ask */}
                        <td className={cn(
                          "py-1 px-1 text-right tabular-nums",
                          side.inTheMoney && bgColor
                        )}>
                          {formatPrice(side.ask)}
                        </td>
                        {/* ROI % */}
                        <td className={cn(
                          "py-1 px-1 text-right tabular-nums",
                          side.inTheMoney && bgColor
                        )}>
                          {formatROI(side.bid, side.ask, side.last)}
                        </td>
                        {/* Volume */}
                        <td className={cn(
                          "py-1 px-1 text-right tabular-nums",
                          side.inTheMoney && bgColor
                        )}>
                          {formatNumber(side.volume)}
                        </td>
                        {/* Open Interest */}
                        <td className={cn(
                          "py-1 px-1 text-right tabular-nums",
                          side.inTheMoney && bgColor
                        )}>
                          {formatNumber(side.openInterest)}
                        </td>
                        {/* IV */}
                        <td className={cn(
                          "py-1 px-1 text-right tabular-nums",
                          side.inTheMoney && bgColor
                        )}>
                          {formatIV(side.iv)}
                        </td>
                        {/* Delta */}
                        <td className={cn(
                          "py-1 px-1 text-right tabular-nums",
                          side.inTheMoney && bgColor
                        )}>
                          {formatDelta(side.delta)}
                        </td>
                        {/* Gamma */}
                        <td className={cn(
                          "py-1 px-1 text-right tabular-nums",
                          side.inTheMoney && bgColor
                        )}>
                          {formatGamma(side.gamma)}
                        </td>
                        {/* Theta */}
                        <td className={cn(
                          "py-1 px-1 text-right tabular-nums",
                          side.inTheMoney && bgColor
                        )}>
                          {formatTheta(side.theta)}
                        </td>
                        {/* Vega */}
                        <td className={cn(
                          "py-1 px-1 text-right tabular-nums",
                          side.inTheMoney && bgColor
                        )}>
                          {formatVega(side.vega)}
                        </td>
                        {/* Rho */}
                        <td className={cn(
                          "py-1 px-1 text-right tabular-nums",
                          side.inTheMoney && bgColor
                        )}>
                          {formatRho(side.rho)}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-4">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-1">{symbol} / Option Chain</div>

      {/* Title */}
      <h1 className="text-xl font-semibold mb-4">{symbol} Option Chain</h1>

      {/* Filter Controls - 4 Dropdowns */}
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

      {/* Options Tables - Two Separate Tables */}
      {expiryDates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No options available for this period
        </div>
      ) : (
        <div className="text-[13px]">
          {/* Calls Table */}
          {(strategy === "all" || strategy === "calls") && renderOptionsTable("calls")}

          {/* Puts Table */}
          {(strategy === "all" || strategy === "puts") && renderOptionsTable("puts")}
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
