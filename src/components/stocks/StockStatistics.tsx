"use client";

import { cn } from "@/lib/utils";

interface StockStatisticsProps {
  stock: {
    // Price & Volume
    previousClose: number;
    open: number;
    dayHigh: number;
    dayLow: number;
    volume: number;
    avgVolume: number;

    // 52 Week
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
    fiftyDayAverage: number;
    twoHundredDayAverage: number;

    // Valuation
    marketCap: number;
    trailingPE: number | null;
    forwardPE: number | null;
    pegRatio: number | null;
    priceToBook: number | null;
    priceToSales: number | null;

    // Per Share
    eps: number | null;
    forwardEps: number | null;
    bookValue: number | null;

    // Dividend
    dividendRate: number | null;
    dividendYield: number | null;

    // Financials
    profitMargin: number | null;
    operatingMargin: number | null;
    returnOnEquity: number | null;
    returnOnAssets: number | null;
    revenue: number | null;
    ebitda: number | null;

    // Balance Sheet
    totalCash: number | null;
    totalDebt: number | null;
    debtToEquity: number | null;
    currentRatio: number | null;

    // Shares
    sharesOutstanding: number | null;
    floatShares: number | null;
    sharesShort: number | null;
    shortRatio: number | null;

    // Risk
    beta: number | null;

    // Current price for calculations
    price: number;
  };
  currency?: string;
}

export function StockStatistics({ stock, currency = "USD" }: StockStatisticsProps) {
  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatLargeCurrency = (value: number | null) => {
    if (value === null || value === undefined) return "—";
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  const formatNumber = (value: number | null, decimals = 2) => {
    if (value === null || value === undefined) return "—";
    return value.toFixed(decimals);
  };

  const formatLargeNumber = (value: number | null) => {
    if (value === null || value === undefined) return "—";
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toFixed(0);
  };

  const formatPercent = (value: number | null) => {
    if (value === null || value === undefined) return "—";
    return `${(value * 100).toFixed(2)}%`;
  };

  // Calculate 52-week range position
  const rangePosition = stock.fiftyTwoWeekHigh && stock.fiftyTwoWeekLow
    ? ((stock.price - stock.fiftyTwoWeekLow) / (stock.fiftyTwoWeekHigh - stock.fiftyTwoWeekLow)) * 100
    : 50;

  return (
    <div className="space-y-8">
      {/* Trading Data */}
      <StatSection title="Trading Data">
        <StatRow label="Previous Close" value={formatCurrency(stock.previousClose)} />
        <StatRow label="Open" value={formatCurrency(stock.open)} />
        <StatRow
          label="Day Range"
          value={`${formatCurrency(stock.dayLow)} - ${formatCurrency(stock.dayHigh)}`}
        />
        <StatRow label="Volume" value={formatLargeNumber(stock.volume)} />
        <StatRow label="Avg. Volume" value={formatLargeNumber(stock.avgVolume)} />
      </StatSection>

      {/* 52-Week Range Visual */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">52-Week Range</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatCurrency(stock.fiftyTwoWeekLow)}</span>
            <span>{formatCurrency(stock.fiftyTwoWeekHigh)}</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-negative via-gold to-positive rounded-full"
              style={{ width: "100%" }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-foreground rounded-full border-2 border-background shadow-md"
              style={{ left: `calc(${Math.min(100, Math.max(0, rangePosition))}% - 6px)` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Current: {formatCurrency(stock.price)}
          </p>
        </div>
      </div>

      {/* Valuation Metrics */}
      <StatSection title="Valuation">
        <StatRow label="Market Cap" value={formatLargeCurrency(stock.marketCap)} highlight />
        <StatRow label="P/E Ratio (TTM)" value={formatNumber(stock.trailingPE)} />
        <StatRow label="Forward P/E" value={formatNumber(stock.forwardPE)} />
        <StatRow label="PEG Ratio" value={formatNumber(stock.pegRatio)} />
        <StatRow label="Price/Book" value={formatNumber(stock.priceToBook)} />
        <StatRow label="Price/Sales" value={formatNumber(stock.priceToSales)} />
      </StatSection>

      {/* Per Share Data */}
      <StatSection title="Per Share Data">
        <StatRow label="EPS (TTM)" value={formatCurrency(stock.eps)} />
        <StatRow label="Forward EPS" value={formatCurrency(stock.forwardEps)} />
        <StatRow label="Book Value" value={formatCurrency(stock.bookValue)} />
      </StatSection>

      {/* Dividend */}
      {(stock.dividendRate || stock.dividendYield) && (
        <StatSection title="Dividend">
          <StatRow label="Dividend Rate" value={formatCurrency(stock.dividendRate)} />
          <StatRow label="Dividend Yield" value={formatPercent(stock.dividendYield)} highlight />
        </StatSection>
      )}

      {/* Profitability */}
      <StatSection title="Profitability">
        <StatRow label="Profit Margin" value={formatPercent(stock.profitMargin)} />
        <StatRow label="Operating Margin" value={formatPercent(stock.operatingMargin)} />
        <StatRow label="Return on Equity" value={formatPercent(stock.returnOnEquity)} />
        <StatRow label="Return on Assets" value={formatPercent(stock.returnOnAssets)} />
      </StatSection>

      {/* Income Statement */}
      <StatSection title="Financials">
        <StatRow label="Revenue (TTM)" value={formatLargeCurrency(stock.revenue)} />
        <StatRow label="EBITDA" value={formatLargeCurrency(stock.ebitda)} />
      </StatSection>

      {/* Balance Sheet */}
      <StatSection title="Balance Sheet">
        <StatRow label="Total Cash" value={formatLargeCurrency(stock.totalCash)} />
        <StatRow label="Total Debt" value={formatLargeCurrency(stock.totalDebt)} />
        <StatRow label="Debt/Equity" value={formatNumber(stock.debtToEquity)} />
        <StatRow label="Current Ratio" value={formatNumber(stock.currentRatio)} />
      </StatSection>

      {/* Share Statistics */}
      <StatSection title="Share Statistics">
        <StatRow label="Shares Outstanding" value={formatLargeNumber(stock.sharesOutstanding)} />
        <StatRow label="Float" value={formatLargeNumber(stock.floatShares)} />
        <StatRow label="Shares Short" value={formatLargeNumber(stock.sharesShort)} />
        <StatRow label="Short Ratio" value={formatNumber(stock.shortRatio)} />
      </StatSection>

      {/* Risk Metrics */}
      <StatSection title="Risk Metrics">
        <StatRow
          label="Beta (5Y Monthly)"
          value={formatNumber(stock.beta)}
          tooltip="Beta measures volatility relative to the market. >1 = more volatile, <1 = less volatile"
        />
      </StatSection>

      {/* Moving Averages */}
      <StatSection title="Moving Averages">
        <StatRow
          label="50-Day MA"
          value={formatCurrency(stock.fiftyDayAverage)}
          status={stock.price > stock.fiftyDayAverage ? "positive" : "negative"}
        />
        <StatRow
          label="200-Day MA"
          value={formatCurrency(stock.twoHundredDayAverage)}
          status={stock.price > stock.twoHundredDayAverage ? "positive" : "negative"}
        />
      </StatSection>
    </div>
  );
}

// Section Component
function StatSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-0 divide-y divide-border/50">{children}</div>
    </div>
  );
}

// Row Component
function StatRow({
  label,
  value,
  highlight = false,
  status,
  tooltip,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  status?: "positive" | "negative";
  tooltip?: string;
}) {
  return (
    <div className="flex justify-between items-center py-2.5 group">
      <span
        className={cn(
          "text-sm text-muted-foreground",
          tooltip && "cursor-help underline decoration-dotted"
        )}
        title={tooltip}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-sm font-medium tabular-nums",
          highlight && "text-primary font-semibold",
          status === "positive" && "text-positive",
          status === "negative" && "text-negative",
          !highlight && !status && "text-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
}
