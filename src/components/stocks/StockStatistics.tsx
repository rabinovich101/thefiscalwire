"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ValuationHistoryItem {
  date: string;
  label: string;
  marketCap: number | null;
  enterpriseValue: number | null;
  trailingPE: number | null;
  forwardPE: number | null;
  pegRatio: number | null;
  priceToSales: number | null;
  priceToBook: number | null;
  evToRevenue: number | null;
  evToEbitda: number | null;
}

interface StockStatisticsProps {
  stock: {
    // Price & Volume
    previousClose: number;
    open: number;
    dayHigh: number;
    dayLow: number;
    volume: number;
    avgVolume: number;
    avgVolume10Day?: number;

    // 52 Week
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
    fiftyDayAverage: number;
    twoHundredDayAverage: number;
    fiftyTwoWeekChange?: number | null;
    sandP52WeekChange?: number | null;

    // Valuation
    marketCap: number;
    enterpriseValue?: number;
    trailingPE: number | null;
    forwardPE: number | null;
    pegRatio: number | null;
    priceToBook: number | null;
    priceToSales: number | null;
    enterpriseToRevenue?: number | null;
    enterpriseToEbitda?: number | null;

    // Per Share
    eps: number | null;
    forwardEps: number | null;
    bookValue: number | null;
    revenuePerShare?: number | null;
    totalCashPerShare?: number | null;

    // Dividend
    dividendRate: number | null;
    dividendYield: number | null;
    payoutRatio?: number | null;
    exDividendDate?: string | Date | null;
    dividendDate?: string | Date | null;
    trailingAnnualDividendRate?: number | null;
    trailingAnnualDividendYield?: number | null;
    fiveYearAvgDividendYield?: number | null;

    // Stock Splits
    lastSplitFactor?: string | null;
    lastSplitDate?: string | Date | null;

    // Profitability
    profitMargin: number | null;
    operatingMargin: number | null;
    returnOnEquity: number | null;
    returnOnAssets: number | null;

    // Financials
    revenue: number | null;
    ebitda: number | null;
    grossProfit?: number | null;
    netIncome?: number | null;
    revenueGrowth?: number | null;
    earningsQuarterlyGrowth?: number | null;

    // Cash Flow
    operatingCashflow?: number | null;
    freeCashflow?: number | null;

    // Balance Sheet
    totalCash: number | null;
    totalDebt: number | null;
    debtToEquity: number | null;
    currentRatio: number | null;

    // Shares
    sharesOutstanding: number | null;
    impliedSharesOutstanding?: number | null;
    floatShares: number | null;
    sharesShort: number | null;
    shortRatio: number | null;
    shortPercentFloat?: number | null;
    shortPercentSharesOut?: number | null;
    sharesShortPriorMonth?: number | null;
    heldPercentInsiders?: number | null;
    heldPercentInstitutions?: number | null;

    // Fiscal Year
    lastFiscalYearEnd?: string | Date | null;
    mostRecentQuarter?: string | Date | null;

    // Risk
    beta: number | null;

    // Current price for calculations
    price: number;

    // Symbol for fetching historical data
    symbol?: string;
  };
  currency?: string;
}

export function StockStatistics({ stock, currency = "USD" }: StockStatisticsProps) {
  const [valuationHistory, setValuationHistory] = useState<ValuationHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (stock.symbol) {
      setIsLoadingHistory(true);
      fetch(`/api/stocks/${stock.symbol}/valuation-history`)
        .then((res) => res.json())
        .then((data) => {
          if (data.historical) {
            setValuationHistory(data.historical);
          }
        })
        .catch((err) => console.error("Failed to fetch valuation history:", err))
        .finally(() => setIsLoadingHistory(false));
    }
  }, [stock.symbol]);

  const formatLargeCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "—";
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    return value.toLocaleString();
  };

  const formatNumber = (value: number | null | undefined, decimals = 2) => {
    if (value === null || value === undefined) return "—";
    return value.toFixed(decimals);
  };

  const formatLargeNumber = (value: number | string | Date | null | undefined) => {
    if (value === null || value === undefined) return "—";
    if (typeof value !== "number" || isNaN(value)) return "—";
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toFixed(0);
  };

  const formatPercent = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "—";
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatDate = (value: string | Date | null | undefined) => {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
  };

  // Get column headers for valuation table
  const valuationColumns = [
    { key: "current", label: "Current" },
    ...valuationHistory.map((h) => ({ key: h.date, label: h.label })),
  ];

  return (
    <div className="space-y-8">
      {/* Valuation Measures - Premium Table Design */}
      <section className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
          <h3 className="text-lg font-bold tracking-tight">Valuation Measures</h3>
          {isLoadingHistory && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-3 w-3 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <span>Loading history...</span>
            </div>
          )}
        </div>

        {/* Table Container with subtle shadow and rounded corners */}
        <div className="relative rounded-xl border border-border/60 bg-gradient-to-b from-background to-muted/20 overflow-hidden shadow-sm">
          {/* Scroll indicator gradient on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background/80 to-transparent pointer-events-none z-10 opacity-0 lg:opacity-0" />

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="bg-muted/40 border-b border-border/60">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground/80 sticky left-0 bg-muted/40 backdrop-blur-sm z-20 min-w-[180px]">
                    <span className="text-xs uppercase tracking-wider">Metric</span>
                  </th>
                  {valuationColumns.map((col, idx) => (
                    <th
                      key={col.key}
                      className={cn(
                        "text-right py-3 px-4 font-semibold whitespace-nowrap transition-colors min-w-[100px]",
                        idx === 0
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-l border-r border-blue-500/20"
                          : "text-muted-foreground/70"
                      )}
                    >
                      <span className={cn(
                        "text-xs uppercase tracking-wider",
                        idx === 0 && "font-bold"
                      )}>
                        {col.label}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <ValuationRowMulti
                  label="Market Cap"
                  current={formatLargeCurrency(stock.marketCap)}
                  historical={valuationHistory.map((h) => formatLargeCurrency(h.marketCap))}
                  isFirst
                />
                <ValuationRowMulti
                  label="Enterprise Value"
                  current={formatLargeCurrency(stock.enterpriseValue)}
                  historical={valuationHistory.map((h) => formatLargeCurrency(h.enterpriseValue))}
                />
                <ValuationRowMulti
                  label="Trailing P/E"
                  current={formatNumber(stock.trailingPE)}
                  historical={valuationHistory.map((h) => formatNumber(h.trailingPE))}
                />
                <ValuationRowMulti
                  label="Forward P/E"
                  current={formatNumber(stock.forwardPE)}
                  historical={valuationHistory.map((h) => formatNumber(h.forwardPE))}
                />
                <ValuationRowMulti
                  label="PEG Ratio (5yr expected)"
                  current={formatNumber(stock.pegRatio)}
                  historical={valuationHistory.map((h) => formatNumber(h.pegRatio))}
                />
                <ValuationRowMulti
                  label="Price/Sales"
                  current={formatNumber(stock.priceToSales)}
                  historical={valuationHistory.map((h) => formatNumber(h.priceToSales))}
                />
                <ValuationRowMulti
                  label="Price/Book"
                  current={formatNumber(stock.priceToBook)}
                  historical={valuationHistory.map((h) => formatNumber(h.priceToBook))}
                />
                <ValuationRowMulti
                  label="EV/Revenue"
                  current={formatNumber(stock.enterpriseToRevenue)}
                  historical={valuationHistory.map((h) => formatNumber(h.evToRevenue))}
                />
                <ValuationRowMulti
                  label="EV/EBITDA"
                  current={formatNumber(stock.enterpriseToEbitda)}
                  historical={valuationHistory.map((h) => formatNumber(h.evToEbitda))}
                  isLast
                />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Two Column Layout - Financial Highlights | Trading Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Financial Highlights */}
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full" />
            <h3 className="text-lg font-bold tracking-tight">Financial Highlights</h3>
          </div>

          <div className="rounded-xl border border-border/60 bg-gradient-to-b from-background to-muted/10 overflow-hidden shadow-sm divide-y divide-border/40">
            {/* Fiscal Year */}
            <StatSection title="Fiscal Year" icon="calendar">
              <StatRow label="Fiscal Year Ends" value={formatDate(stock.lastFiscalYearEnd)} />
              <StatRow label="Most Recent Quarter (mrq)" value={formatDate(stock.mostRecentQuarter)} isLast />
            </StatSection>

            {/* Profitability */}
            <StatSection title="Profitability" icon="chart">
              <StatRow label="Profit Margin" value={formatPercent(stock.profitMargin)} />
              <StatRow label="Operating Margin (ttm)" value={formatPercent(stock.operatingMargin)} isLast />
            </StatSection>

            {/* Management Effectiveness */}
            <StatSection title="Management Effectiveness" icon="award">
              <StatRow label="Return on Assets (ttm)" value={formatPercent(stock.returnOnAssets)} />
              <StatRow label="Return on Equity (ttm)" value={formatPercent(stock.returnOnEquity)} isLast />
            </StatSection>

            {/* Income Statement */}
            <StatSection title="Income Statement" icon="dollar">
              <StatRow label="Revenue (ttm)" value={formatLargeCurrency(stock.revenue)} />
              <StatRow label="Revenue Per Share (ttm)" value={formatNumber(stock.revenuePerShare)} />
              <StatRow label="Quarterly Revenue Growth (yoy)" value={formatPercent(stock.revenueGrowth)} status={stock.revenueGrowth && stock.revenueGrowth > 0 ? "positive" : stock.revenueGrowth && stock.revenueGrowth < 0 ? "negative" : undefined} />
              <StatRow label="Gross Profit (ttm)" value={formatLargeCurrency(stock.grossProfit)} />
              <StatRow label="EBITDA" value={formatLargeCurrency(stock.ebitda)} />
              <StatRow label="Net Income Avi to Common (ttm)" value={formatLargeCurrency(stock.netIncome)} />
              <StatRow label="Diluted EPS (ttm)" value={formatNumber(stock.eps)} />
              <StatRow label="Quarterly Earnings Growth (yoy)" value={formatPercent(stock.earningsQuarterlyGrowth)} status={stock.earningsQuarterlyGrowth && stock.earningsQuarterlyGrowth > 0 ? "positive" : stock.earningsQuarterlyGrowth && stock.earningsQuarterlyGrowth < 0 ? "negative" : undefined} isLast />
            </StatSection>

            {/* Balance Sheet */}
            <StatSection title="Balance Sheet" icon="layers">
              <StatRow label="Total Cash (mrq)" value={formatLargeCurrency(stock.totalCash)} />
              <StatRow label="Total Cash Per Share (mrq)" value={formatNumber(stock.totalCashPerShare)} />
              <StatRow label="Total Debt (mrq)" value={formatLargeCurrency(stock.totalDebt)} />
              <StatRow label="Total Debt/Equity (mrq)" value={formatNumber(stock.debtToEquity)} />
              <StatRow label="Current Ratio (mrq)" value={formatNumber(stock.currentRatio)} />
              <StatRow label="Book Value Per Share (mrq)" value={formatNumber(stock.bookValue)} isLast />
            </StatSection>

            {/* Cash Flow Statement */}
            <StatSection title="Cash Flow Statement" icon="flow">
              <StatRow label="Operating Cash Flow (ttm)" value={formatLargeCurrency(stock.operatingCashflow)} />
              <StatRow label="Levered Free Cash Flow (ttm)" value={formatLargeCurrency(stock.freeCashflow)} isLast />
            </StatSection>
          </div>
        </div>

        {/* Right Column - Trading Information */}
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1 bg-gradient-to-b from-orange-500 to-amber-600 rounded-full" />
            <h3 className="text-lg font-bold tracking-tight">Trading Information</h3>
          </div>

          <div className="rounded-xl border border-border/60 bg-gradient-to-b from-background to-muted/10 overflow-hidden shadow-sm divide-y divide-border/40">
            {/* Stock Price History */}
            <StatSection title="Stock Price History" icon="trending">
              <StatRow label="Beta (5Y Monthly)" value={formatNumber(stock.beta)} />
              <StatRow
                label="52 Week Change"
                value={formatPercent(stock.fiftyTwoWeekChange)}
                status={stock.fiftyTwoWeekChange && stock.fiftyTwoWeekChange > 0 ? "positive" : stock.fiftyTwoWeekChange && stock.fiftyTwoWeekChange < 0 ? "negative" : undefined}
              />
              <StatRow
                label="S&P500 52-Week Change"
                value={formatPercent(stock.sandP52WeekChange)}
                status={stock.sandP52WeekChange && stock.sandP52WeekChange > 0 ? "positive" : stock.sandP52WeekChange && stock.sandP52WeekChange < 0 ? "negative" : undefined}
              />
              <StatRow label="52 Week High" value={formatNumber(stock.fiftyTwoWeekHigh)} />
              <StatRow label="52 Week Low" value={formatNumber(stock.fiftyTwoWeekLow)} />
              <StatRow label="50-Day Moving Average" value={formatNumber(stock.fiftyDayAverage)} />
              <StatRow label="200-Day Moving Average" value={formatNumber(stock.twoHundredDayAverage)} isLast />
            </StatSection>

            {/* Share Statistics */}
            <StatSection title="Share Statistics" icon="shares">
              <StatRow label="Avg Vol (3 month)" value={formatLargeNumber(stock.avgVolume)} />
              <StatRow label="Avg Vol (10 day)" value={formatLargeNumber(stock.avgVolume10Day)} />
              <StatRow label="Shares Outstanding" value={formatLargeNumber(stock.sharesOutstanding)} />
              <StatRow label="Implied Shares Outstanding" value={formatLargeNumber(stock.impliedSharesOutstanding || stock.sharesOutstanding)} />
              <StatRow label="Float" value={formatLargeNumber(stock.floatShares)} />
              <StatRow label="% Held by Insiders" value={formatPercent(stock.heldPercentInsiders)} />
              <StatRow label="% Held by Institutions" value={formatPercent(stock.heldPercentInstitutions)} />
              <StatRow label="Shares Short" value={formatLargeNumber(stock.sharesShort)} />
              <StatRow label="Short Ratio" value={formatNumber(stock.shortRatio)} />
              <StatRow label="Short % of Float" value={formatPercent(stock.shortPercentFloat)} />
              <StatRow label="Short % of Shares Outstanding" value={formatPercent(stock.shortPercentSharesOut)} />
              <StatRow label="Shares Short (prior month)" value={formatLargeNumber(stock.sharesShortPriorMonth)} isLast />
            </StatSection>

            {/* Dividends & Splits */}
            <StatSection title="Dividends & Splits" icon="split">
              <StatRow label="Forward Annual Dividend Rate" value={formatNumber(stock.dividendRate)} />
              <StatRow label="Forward Annual Dividend Yield" value={formatPercent(stock.dividendYield)} />
              <StatRow label="Trailing Annual Dividend Rate" value={formatNumber(stock.trailingAnnualDividendRate)} />
              <StatRow label="Trailing Annual Dividend Yield" value={formatPercent(stock.trailingAnnualDividendYield)} />
              <StatRow label="5 Year Average Dividend Yield" value={stock.fiveYearAvgDividendYield ? `${stock.fiveYearAvgDividendYield.toFixed(2)}` : "—"} />
              <StatRow label="Payout Ratio" value={formatPercent(stock.payoutRatio)} />
              <StatRow label="Dividend Date" value={formatDate(stock.dividendDate)} />
              <StatRow label="Ex-Dividend Date" value={formatDate(stock.exDividendDate)} />
              <StatRow label="Last Split Factor" value={stock.lastSplitFactor || "—"} />
              <StatRow label="Last Split Date" value={formatDate(stock.lastSplitDate)} isLast />
            </StatSection>
          </div>
        </div>
      </div>
    </div>
  );
}

// Valuation Table Row (multi-column for historical data) - Premium Design
function ValuationRowMulti({
  label,
  current,
  historical,
  isFirst,
  isLast,
}: {
  label: string;
  current: string;
  historical: string[];
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <tr className={cn(
      "group transition-colors duration-150",
      "hover:bg-muted/50",
      !isLast && "border-b border-border/30"
    )}>
      <td className={cn(
        "py-3.5 px-4 font-medium text-foreground/90 sticky left-0 z-10",
        "bg-background/95 backdrop-blur-sm",
        "group-hover:bg-muted/50 transition-colors duration-150",
        "border-r border-border/20",
        isFirst && "rounded-tl-lg",
        isLast && "rounded-bl-lg"
      )}>
        {label}
      </td>
      <td className={cn(
        "py-3.5 px-4 text-right font-bold tabular-nums",
        "bg-blue-500/5 border-l border-r border-blue-500/10",
        "text-foreground",
        "group-hover:bg-blue-500/10 transition-colors duration-150"
      )}>
        {current}
      </td>
      {historical.map((value, idx) => (
        <td
          key={idx}
          className={cn(
            "py-3.5 px-4 text-right font-medium tabular-nums",
            "text-muted-foreground/80",
            "group-hover:text-muted-foreground transition-colors duration-150",
            idx === historical.length - 1 && isLast && "rounded-br-lg"
          )}
        >
          {value}
        </td>
      ))}
    </tr>
  );
}

// Section Component - Premium Design
function StatSection({
  title,
  icon,
  children
}: {
  title: string;
  icon?: "calendar" | "chart" | "award" | "dollar" | "layers" | "flow" | "trending" | "shares" | "split";
  children: React.ReactNode;
}) {
  const iconMap = {
    calendar: "📅",
    chart: "📊",
    award: "🏆",
    dollar: "💰",
    layers: "📑",
    flow: "💸",
    trending: "📈",
    shares: "📋",
    split: "✂️",
  };

  return (
    <div className="py-4 px-5">
      <div className="flex items-center gap-2 mb-3">
        {icon && <span className="text-sm opacity-70">{iconMap[icon]}</span>}
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">{title}</h4>
      </div>
      <div className="space-y-0">{children}</div>
    </div>
  );
}

// Row Component - Premium Design
function StatRow({
  label,
  value,
  status,
  isLast,
}: {
  label: string;
  value: string;
  status?: "positive" | "negative";
  isLast?: boolean;
}) {
  return (
    <div className={cn(
      "flex items-center justify-between py-2.5 px-1 group transition-colors duration-150 rounded-lg -mx-1",
      "hover:bg-muted/40",
      !isLast && "border-b border-border/20"
    )}>
      <span className="text-sm text-muted-foreground group-hover:text-muted-foreground/90 transition-colors">
        {label}
      </span>
      <span
        className={cn(
          "text-sm font-semibold tabular-nums transition-colors",
          status === "positive" && "text-emerald-500 dark:text-emerald-400",
          status === "negative" && "text-red-500 dark:text-red-400",
          !status && "text-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
}
