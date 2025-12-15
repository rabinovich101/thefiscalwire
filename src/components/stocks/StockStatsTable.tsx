'use client';

import React from 'react';

interface StockData {
  // Basic
  symbol: string;
  exchange?: string;

  // Price
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume: number;

  // Valuation
  marketCap: number;
  enterpriseValue?: number;
  trailingPE?: number | null;
  forwardPE?: number | null;
  pegRatio?: number | null;
  priceToBook?: number | null;
  priceToSales?: number | null;
  enterpriseToRevenue?: number | null;
  enterpriseToEbitda?: number | null;

  // EPS
  eps?: number | null;
  forwardEps?: number | null;
  earningsQuarterlyGrowth?: number | null;
  revenueGrowth?: number | null;

  // Shares
  sharesOutstanding?: number | null;
  floatShares?: number | null;
  sharesShort?: number | null;
  shortRatio?: number | null;
  shortPercentFloat?: number | null;

  // Ownership
  heldPercentInsiders?: number | null;
  heldPercentInstitutions?: number | null;

  // Profitability
  profitMargin?: number | null;
  operatingMargin?: number | null;
  returnOnAssets?: number | null;
  returnOnEquity?: number | null;

  // Balance Sheet
  totalCash?: number | null;
  totalDebt?: number | null;
  debtToEquity?: number | null;
  currentRatio?: number | null;
  bookValue?: number | null;
  totalCashPerShare?: number | null;
  freeCashflow?: number | null;

  // Dividend
  dividendRate?: number | null;
  dividendYield?: number | null;
  payoutRatio?: number | null;

  // Technical
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  fiftyDayAverage?: number;
  twoHundredDayAverage?: number;
  beta?: number | null;
  fiftyTwoWeekChange?: number | null;

  // Analyst
  targetMeanPrice?: number | null;
  numberOfAnalystOpinions?: number | null;
  recommendationKey?: string | null;

  // Calendar
  earningsDate?: string | null;
  employees?: number | null;
}

interface StockStatsTableProps {
  stock: StockData;
}

type FormatType = 'price' | 'number' | 'largeNumber' | 'percent' | 'ratio' | 'date' | 'string';

interface MetricCell {
  label: string;
  value: string | number | null | undefined;
  format?: FormatType;
  colorize?: boolean;
  key?: string;
}

// Format functions
function formatPrice(val: number | null | undefined): string {
  if (val === null || val === undefined) return '-';
  return `$${val.toFixed(2)}`;
}

function formatNumber(val: number | null | undefined): string {
  if (val === null || val === undefined) return '-';
  return val.toLocaleString();
}

function formatLargeNumber(val: number | null | undefined): string {
  if (val === null || val === undefined) return '-';
  if (val >= 1e12) return `${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`;
  if (val >= 1e3) return `${(val / 1e3).toFixed(2)}K`;
  return val.toLocaleString();
}

function formatPercent(val: number | null | undefined, isDecimal: boolean = true): string {
  if (val === null || val === undefined) return '-';
  const pct = isDecimal ? val * 100 : val;
  return `${pct >= 0 ? '' : ''}${pct.toFixed(2)}%`;
}

function formatRatio(val: number | null | undefined): string {
  if (val === null || val === undefined) return '-';
  return val.toFixed(2);
}

function formatDate(val: string | null | undefined): string {
  if (!val) return '-';
  const d = new Date(val);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatValue(val: string | number | null | undefined, format?: FormatType): string {
  if (val === null || val === undefined) return '-';

  // Handle date format for string inputs (ISO dates)
  if (format === 'date') {
    return formatDate(String(val));
  }

  if (typeof val === 'string') return val || '-';

  switch (format) {
    case 'price': return formatPrice(val);
    case 'number': return formatNumber(val);
    case 'largeNumber': return formatLargeNumber(val);
    case 'percent': return formatPercent(val);
    case 'ratio': return formatRatio(val);
    default: return String(val);
  }
}

function getValueColor(val: number | string | null | undefined, colorize?: boolean): string {
  if (!colorize || val === null || val === undefined) return '';
  const numVal = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(numVal)) return '';
  if (numVal > 0) return 'text-positive';
  if (numVal < 0) return 'text-negative';
  return '';
}

export function StockStatsTable({ stock }: StockStatsTableProps) {
  // Calculate derived values (as decimals, formatPercent will multiply by 100)
  // Note: We don't have 20-day SMA from API, only 50-day and 200-day
  const sma50Pct = stock.fiftyDayAverage && stock.price
    ? (stock.price - stock.fiftyDayAverage) / stock.fiftyDayAverage
    : null;
  const sma200Pct = stock.twoHundredDayAverage && stock.price
    ? (stock.price - stock.twoHundredDayAverage) / stock.twoHundredDayAverage
    : null;
  const high52Pct = stock.fiftyTwoWeekHigh && stock.price
    ? (stock.price - stock.fiftyTwoWeekHigh) / stock.fiftyTwoWeekHigh
    : null;
  const low52Pct = stock.fiftyTwoWeekLow && stock.price
    ? (stock.price - stock.fiftyTwoWeekLow) / stock.fiftyTwoWeekLow
    : null;
  const relVolume = stock.avgVolume && stock.volume
    ? stock.volume / stock.avgVolume
    : null;

  // Get index from exchange
  const getIndex = (exchange?: string) => {
    if (!exchange) return '-';
    if (exchange.includes('NASDAQ') || exchange.includes('NMS')) return 'NASDAQ';
    if (exchange.includes('NYSE')) return 'NYSE';
    if (exchange.includes('AMEX')) return 'AMEX';
    return exchange;
  };

  // Define all rows (3 metric cells per row)
  const rows: MetricCell[][] = [
    // Row 1
    [
      { label: 'Index', value: getIndex(stock.exchange) },
      { label: 'P/E', value: stock.trailingPE, format: 'ratio' },
      { label: 'EPS (ttm)', value: stock.eps, format: 'ratio' },
      { label: 'Insider Own', value: stock.heldPercentInsiders, format: 'percent' },
      { label: 'Shs Outstand', value: stock.sharesOutstanding, format: 'largeNumber' },
      { label: 'Perf Week', value: null, colorize: true }, // Not available from API
    ],
    // Row 2
    [
      { label: 'Market Cap', value: stock.marketCap, format: 'largeNumber' },
      { label: 'Forward P/E', value: stock.forwardPE, format: 'ratio' },
      { label: 'EPS next Y', value: stock.forwardEps, format: 'ratio' },
      { label: 'Inst Own', value: stock.heldPercentInstitutions, format: 'percent' },
      { label: 'Shs Float', value: stock.floatShares, format: 'largeNumber' },
      { label: 'Perf Month', value: null, colorize: true }, // Not available from API
    ],
    // Row 3
    [
      { label: 'Income', value: stock.profitMargin && stock.marketCap ? stock.marketCap * stock.profitMargin : null, format: 'largeNumber' },
      { label: 'PEG', value: stock.pegRatio, format: 'ratio' },
      { label: 'EPS this Y', value: stock.earningsQuarterlyGrowth, format: 'percent', colorize: true },
      { label: 'Short Float', value: stock.shortPercentFloat, format: 'percent' },
      { label: 'Short Ratio', value: stock.shortRatio, format: 'ratio' },
      { label: 'Perf Quart', value: null, colorize: true }, // Not available from API
    ],
    // Row 4
    [
      { label: 'Sales', value: stock.priceToSales && stock.marketCap ? stock.marketCap / stock.priceToSales : null, format: 'largeNumber' },
      { label: 'P/S', value: stock.priceToSales, format: 'ratio' },
      { label: 'EPS next Y%', value: null, format: 'percent', colorize: true }, // Not available
      { label: 'ROA', value: stock.returnOnAssets, format: 'percent', colorize: true },
      { label: '52W High', value: stock.fiftyTwoWeekHigh ? `${formatPrice(stock.fiftyTwoWeekHigh)} ${high52Pct !== null ? formatPercent(high52Pct, true) : ''}` : '-', colorize: true },
      { label: 'Perf Half Y', value: null, colorize: true }, // Not available from API
    ],
    // Row 5
    [
      { label: 'Book/sh', value: stock.bookValue, format: 'ratio' },
      { label: 'P/B', value: stock.priceToBook, format: 'ratio' },
      { label: 'EPS next 5Y', value: null, format: 'percent' }, // Not available
      { label: 'ROE', value: stock.returnOnEquity, format: 'percent', colorize: true },
      { label: '52W Low', value: stock.fiftyTwoWeekLow ? `${formatPrice(stock.fiftyTwoWeekLow)} ${low52Pct !== null ? formatPercent(low52Pct, true) : ''}` : '-', colorize: true },
      { label: 'Perf Year', value: stock.fiftyTwoWeekChange, format: 'percent', colorize: true },
    ],
    // Row 6
    [
      { label: 'Cash/sh', value: stock.totalCashPerShare, format: 'ratio' },
      { label: 'P/FCF', value: stock.freeCashflow && stock.marketCap ? stock.marketCap / stock.freeCashflow : null, format: 'ratio' },
      { label: 'EPS past 5Y', value: null, format: 'percent' }, // Not available
      { label: 'Gross Margin', value: null, format: 'percent', colorize: true }, // Not in API
      { label: 'Volatility', value: null }, // Not available
      { label: 'Beta', value: stock.beta, format: 'ratio' },
    ],
    // Row 7
    [
      { label: 'Dividend', value: stock.dividendRate, format: 'price' },
      { label: 'EV/EBITDA', value: stock.enterpriseToEbitda, format: 'ratio' },
      { label: 'Sales past 5Y', value: null, format: 'percent' }, // Not available
      { label: 'Oper. Margin', value: stock.operatingMargin, format: 'percent', colorize: true },
      { label: 'ATR', value: null }, // Not available
      { label: 'Target Price', value: stock.targetMeanPrice, format: 'price' },
    ],
    // Row 8
    [
      { label: 'Dividend %', value: stock.dividendYield, format: 'percent' },
      { label: 'EV/Sales', value: stock.enterpriseToRevenue, format: 'ratio' },
      { label: 'Sales Q/Q', value: stock.revenueGrowth, format: 'percent', colorize: true },
      { label: 'Profit Margin', value: stock.profitMargin, format: 'percent', colorize: true },
      { label: 'RSI (14)', value: null }, // Not available
      { label: 'Avg Volume', value: stock.avgVolume, format: 'largeNumber' },
    ],
    // Row 9
    [
      { label: 'Employees', value: stock.employees, format: 'number' },
      { label: 'Quick Ratio', value: null, format: 'ratio' }, // Not in API
      { label: 'EPS Q/Q', value: stock.earningsQuarterlyGrowth, format: 'percent', colorize: true },
      { label: 'SMA20', value: null, format: 'percent', colorize: true }, // 20-day SMA not available from API
      { label: 'Rel Volume', value: relVolume, format: 'ratio' },
      { label: 'Prev Close', value: stock.previousClose, format: 'price' },
    ],
    // Row 10
    [
      { label: 'Payout', value: stock.payoutRatio, format: 'percent' },
      { label: 'Current Ratio', value: stock.currentRatio, format: 'ratio' },
      { label: 'Earnings', value: stock.earningsDate, format: 'date' },
      { label: 'SMA50', value: sma50Pct, format: 'percent', colorize: true },
      { label: 'Volume', value: stock.volume, format: 'largeNumber' },
      { label: 'Price', value: stock.price, format: 'price' },
    ],
    // Row 11
    [
      { label: 'Recom', value: stock.recommendationKey || '-' },
      { label: 'Debt/Eq', value: stock.debtToEquity ? stock.debtToEquity / 100 : null, format: 'ratio' },
      { label: 'Analysts', value: stock.numberOfAnalystOpinions, format: 'number' },
      { label: 'SMA200', value: sma200Pct, format: 'percent', colorize: true },
      { label: '', value: '' },
      { label: 'Change', value: stock.changePercent, format: 'percent', colorize: true },
    ],
  ];

  return (
    <div className="overflow-x-auto">
      <table
        className="w-full text-xs border-collapse bg-surface"
        aria-label={`Financial statistics for ${stock.symbol}`}
      >
        <caption className="sr-only">
          Key financial metrics and statistics for {stock.symbol} stock including valuation ratios, earnings data, ownership breakdown, and technical indicators.
        </caption>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border/30">
              {row.map((cell, cellIndex) => (
                <React.Fragment key={cellIndex}>
                  <td className="py-1.5 px-2 text-muted-foreground whitespace-nowrap border-r border-border/30">
                    {cell.label}
                  </td>
                  <td
                    className={`py-1.5 px-2 whitespace-nowrap font-medium tabular-nums ${
                      cellIndex < 2 ? 'border-r border-border/30' : ''
                    } ${getValueColor(
                      typeof cell.value === 'string' && cell.value.includes('%')
                        ? parseFloat(cell.value)
                        : cell.value,
                      cell.colorize
                    ) || 'text-foreground'}`}
                  >
                    {typeof cell.value === 'string' && (cell.value.includes('$') || cell.value.includes('%'))
                      ? cell.value
                      : formatValue(cell.value, cell.format)}
                  </td>
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
