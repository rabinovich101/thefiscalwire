"use client";

import { useState, useEffect, Fragment } from "react";
import { useParams } from "next/navigation";
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type StatementType = "income" | "balance" | "cashflow";
type PeriodType = "annual" | "quarterly";

interface FinancialStatement {
  endDate?: string;
  [key: string]: unknown;
}

interface FinancialsData {
  incomeStatementHistory: FinancialStatement[];
  incomeStatementHistoryQuarterly: FinancialStatement[];
  balanceSheetHistory: FinancialStatement[];
  balanceSheetHistoryQuarterly: FinancialStatement[];
  cashflowStatementHistory: FinancialStatement[];
  cashflowStatementHistoryQuarterly: FinancialStatement[];
}

interface FinancialItem {
  key: string;
  label: string;
  expandable?: boolean;
  children?: FinancialItem[];
}

// Income Statement items matching Yahoo Finance structure exactly
const INCOME_STATEMENT_ITEMS: FinancialItem[] = [
  {
    key: "totalRevenue",
    label: "Total Revenue",
    expandable: true,
    children: [
      { key: "operatingRevenue", label: "Operating Revenue" },
    ]
  },
  { key: "costOfRevenue", label: "Cost of Revenue" },
  { key: "grossProfit", label: "Gross Profit" },
  {
    key: "operatingExpense",
    label: "Operating Expense",
    expandable: true,
    children: [
      { key: "researchAndDevelopment", label: "Research & Development" },
      { key: "sellingGeneralAndAdministration", label: "Selling General & Administrative" },
    ]
  },
  { key: "operatingIncome", label: "Operating Income" },
  {
    key: "netNonOperatingInterestIncomeExpense",
    label: "Net Non Operating Interest Income Expense",
    expandable: true,
    children: [
      { key: "interestIncome", label: "Interest Income" },
      { key: "interestExpense", label: "Interest Expense" },
    ]
  },
  {
    key: "otherIncomeExpense",
    label: "Other Income Expense",
    expandable: true,
    children: [
      { key: "otherNonOperatingIncomeExpenses", label: "Other Non Operating Income Expenses" },
    ]
  },
  { key: "pretaxIncome", label: "Pretax Income" },
  { key: "taxProvision", label: "Tax Provision" },
  {
    key: "netIncomeCommonStockholders",
    label: "Net Income Common Stockholders",
    expandable: true,
    children: [
      { key: "netIncomeContinuousOperations", label: "Net Income from Continuing Operations" },
    ]
  },
  { key: "dilutedNIAvailtoComStockholders", label: "Diluted NI Available to Com Stockholders" },
  { key: "basicEPS", label: "Basic EPS" },
  { key: "dilutedEPS", label: "Diluted EPS" },
  { key: "basicAverageShares", label: "Basic Average Shares" },
  { key: "dilutedAverageShares", label: "Diluted Average Shares" },
  { key: "totalOperatingIncomeAsReported", label: "Total Operating Income as Reported" },
  { key: "totalExpenses", label: "Total Expenses" },
  { key: "netIncomeFromContinuingAndDiscontinuedOperation", label: "Net Income from Continuing & Discontinued Operation" },
  { key: "normalizedIncome", label: "Normalized Income" },
  { key: "interestIncome", label: "Interest Income" },
  { key: "interestExpense", label: "Interest Expense" },
  { key: "netInterestIncome", label: "Net Interest Income" },
  { key: "eBIT", label: "EBIT" },
  { key: "eBITDA", label: "EBITDA" },
  { key: "reconciledCostOfRevenue", label: "Reconciled Cost of Revenue" },
  { key: "reconciledDepreciation", label: "Reconciled Depreciation" },
  { key: "netIncomeContinuousOperations", label: "Net Income from Continuing Operation Net Minority Interest" },
  { key: "totalUnusualItemsExcludingGoodwill", label: "Total Unusual Items Excluding Goodwill" },
  { key: "totalUnusualItems", label: "Total Unusual Items" },
  { key: "normalizedEBITDA", label: "Normalized EBITDA" },
  { key: "taxRateForCalcs", label: "Tax Rate for Calcs" },
  { key: "taxEffectOfUnusualItems", label: "Tax Effect of Unusual Items" },
];

// Balance Sheet items matching Yahoo Finance structure
const BALANCE_SHEET_ITEMS: FinancialItem[] = [
  {
    key: "totalAssets",
    label: "Total Assets",
    expandable: true,
    children: [
      { key: "totalCurrentAssets", label: "Total Current Assets" },
      { key: "totalNonCurrentAssets", label: "Total Non Current Assets" },
    ]
  },
  {
    key: "totalCurrentAssets",
    label: "Current Assets",
    expandable: true,
    children: [
      { key: "cashAndCashEquivalents", label: "Cash And Cash Equivalents" },
      { key: "otherShortTermInvestments", label: "Other Short Term Investments" },
      { key: "receivables", label: "Receivables" },
      { key: "inventory", label: "Inventory" },
    ]
  },
  {
    key: "totalNonCurrentAssets",
    label: "Total Non Current Assets",
    expandable: true,
    children: [
      { key: "netPPE", label: "Net PPE" },
      { key: "goodwill", label: "Goodwill" },
      { key: "otherIntangibleAssets", label: "Other Intangible Assets" },
      { key: "investmentsAndAdvances", label: "Investments And Advances" },
    ]
  },
  {
    key: "totalLiabilitiesNetMinorityInterest",
    label: "Total Liabilities Net Minority Interest",
    expandable: true,
    children: [
      { key: "totalCurrentLiabilities", label: "Total Current Liabilities" },
      { key: "totalNonCurrentLiabilitiesNetMinorityInterest", label: "Total Non Current Liabilities Net Minority Interest" },
    ]
  },
  {
    key: "totalCurrentLiabilities",
    label: "Current Liabilities",
    expandable: true,
    children: [
      { key: "payablesAndAccruedExpenses", label: "Payables And Accrued Expenses" },
      { key: "currentDebt", label: "Current Debt" },
      { key: "currentDeferredRevenue", label: "Current Deferred Revenue" },
    ]
  },
  {
    key: "totalNonCurrentLiabilitiesNetMinorityInterest",
    label: "Total Non Current Liabilities Net Minority Interest",
    expandable: true,
    children: [
      { key: "longTermDebt", label: "Long Term Debt" },
    ]
  },
  {
    key: "totalEquityGrossMinorityInterest",
    label: "Total Equity Gross Minority Interest",
    expandable: true,
    children: [
      { key: "stockholdersEquity", label: "Stockholders Equity" },
      { key: "commonStock", label: "Common Stock" },
      { key: "retainedEarnings", label: "Retained Earnings" },
    ]
  },
  { key: "totalCapitalization", label: "Total Capitalization" },
  { key: "commonStockEquity", label: "Common Stock Equity" },
  { key: "netTangibleAssets", label: "Net Tangible Assets" },
  { key: "workingCapital", label: "Working Capital" },
  { key: "investedCapital", label: "Invested Capital" },
  { key: "tangibleBookValue", label: "Tangible Book Value" },
  { key: "totalDebt", label: "Total Debt" },
  { key: "netDebt", label: "Net Debt" },
  { key: "shareIssued", label: "Share Issued" },
  { key: "ordinarySharesNumber", label: "Ordinary Shares Number" },
];

// Cash Flow items matching Yahoo Finance structure
const CASHFLOW_ITEMS: FinancialItem[] = [
  {
    key: "operatingCashFlow",
    label: "Operating Cash Flow",
    expandable: true,
    children: [
      { key: "netIncomeFromContinuingOperations", label: "Net Income from Continuing Operations" },
      { key: "depreciationAndAmortization", label: "Depreciation And Amortization" },
      { key: "deferredTax", label: "Deferred Tax" },
      { key: "stockBasedCompensation", label: "Stock Based Compensation" },
      { key: "changeInReceivables", label: "Change In Receivables" },
      { key: "changeInInventory", label: "Change In Inventory" },
    ]
  },
  {
    key: "investingCashFlow",
    label: "Investing Cash Flow",
    expandable: true,
    children: [
      { key: "capitalExpenditure", label: "Capital Expenditure" },
      { key: "netBusinessPurchaseAndSale", label: "Net Business Purchase And Sale" },
      { key: "netInvestmentPurchaseAndSale", label: "Net Investment Purchase And Sale" },
    ]
  },
  {
    key: "financingCashFlow",
    label: "Financing Cash Flow",
    expandable: true,
    children: [
      { key: "netIssuancePaymentsOfDebt", label: "Net Issuance Payments Of Debt" },
      { key: "netCommonStockIssuance", label: "Net Common Stock Issuance" },
      { key: "cashDividendsPaid", label: "Cash Dividends Paid" },
      { key: "commonStockPayments", label: "Common Stock Payments" },
    ]
  },
  { key: "changesInCash", label: "Changes In Cash" },
  { key: "beginningCashPosition", label: "Beginning Cash Position" },
  { key: "endCashPosition", label: "End Cash Position" },
  { key: "netIncome", label: "Net Income" },
  { key: "depreciationAndAmortization", label: "Depreciation Amortization Depletion" },
  { key: "capitalExpenditure", label: "Capital Expenditure" },
  { key: "issuanceOfCapitalStock", label: "Issuance of Capital Stock" },
  { key: "issuanceOfDebt", label: "Issuance of Debt" },
  { key: "repaymentOfDebt", label: "Repayment of Debt" },
  { key: "repurchaseOfCapitalStock", label: "Repurchase of Capital Stock" },
  { key: "freeCashFlow", label: "Free Cash Flow" },
];

export default function FinancialsPage() {
  const params = useParams();
  const symbol = (params.symbol as string).toUpperCase();

  const [data, setData] = useState<FinancialsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statementType, setStatementType] = useState<StatementType>("income");
  const [period, setPeriod] = useState<PeriodType>("annual");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/stocks/${symbol}/financials`);
        const json = await res.json();
        if (!json.error) {
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch financials:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  const formatValue = (value: unknown, isEPS = false, isShares = false): string => {
    if (value === null || value === undefined) return "—";
    const num = Number(value);
    if (isNaN(num)) return "—";

    // For EPS, show as-is with 2 decimals
    if (isEPS) {
      return num.toFixed(2);
    }

    // For tax rate, show as percentage
    if (num > 0 && num < 1) {
      return (num * 100).toFixed(0) + "%";
    }

    // Format as thousands (matching Yahoo's "All numbers in thousands")
    const inThousands = num / 1000;
    return inThousands.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getStatements = (): FinancialStatement[] => {
    if (!data) return [];

    switch (statementType) {
      case "income":
        return period === "annual"
          ? data.incomeStatementHistory || []
          : data.incomeStatementHistoryQuarterly || [];
      case "balance":
        return period === "annual"
          ? data.balanceSheetHistory || []
          : data.balanceSheetHistoryQuarterly || [];
      case "cashflow":
        return period === "annual"
          ? data.cashflowStatementHistory || []
          : data.cashflowStatementHistoryQuarterly || [];
      default:
        return [];
    }
  };

  const getItems = (): FinancialItem[] => {
    switch (statementType) {
      case "income":
        return INCOME_STATEMENT_ITEMS;
      case "balance":
        return BALANCE_SHEET_ITEMS;
      case "cashflow":
        return CASHFLOW_ITEMS;
      default:
        return [];
    }
  };

  const toggleRow = (key: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleAllRows = () => {
    const items = getItems();
    const expandableKeys = items.filter((item) => item.expandable).map((item) => item.key);

    if (allExpanded) {
      setExpandedRows(new Set());
    } else {
      setExpandedRows(new Set(expandableKeys));
    }
    setAllExpanded(!allExpanded);
  };

  // Calculate TTM (Trailing Twelve Months) - sum of last 4 quarters or use annual if quarterly not available
  const calculateTTM = (key: string): unknown => {
    if (!data) return null;

    let quarterlyData: FinancialStatement[] = [];
    switch (statementType) {
      case "income":
        quarterlyData = data.incomeStatementHistoryQuarterly || [];
        break;
      case "balance":
        // For balance sheet, TTM doesn't apply - use most recent
        return data.balanceSheetHistory?.[0]?.[key];
      case "cashflow":
        quarterlyData = data.cashflowStatementHistoryQuarterly || [];
        break;
    }

    if (quarterlyData.length >= 4) {
      const last4Quarters = quarterlyData.slice(0, 4);
      const values = last4Quarters.map((q) => Number(q[key]) || 0);
      const sum = values.reduce((a, b) => a + b, 0);
      return sum || null;
    }

    // Fallback to most recent annual
    const annualData = statementType === "income"
      ? data.incomeStatementHistory
      : data.cashflowStatementHistory;
    return annualData?.[0]?.[key];
  };

  const statements = getStatements();
  const items = getItems();

  // Limit to 4 periods + TTM like Yahoo Finance
  const displayStatements = statements.slice(0, 4);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const renderRow = (item: FinancialItem, isChild = false, parentKey = "") => {
    const isExpanded = expandedRows.has(item.key);
    const isEPS = item.key.toLowerCase().includes("eps");
    const isShares = item.key.toLowerCase().includes("shares") || item.key.toLowerCase().includes("shareissued");
    const hasChildren = item.expandable && item.children && item.children.length > 0;
    const uniqueKey = parentKey ? `${parentKey}-${item.key}` : item.key;

    return (
      <Fragment key={uniqueKey}>
        <tr
          className={cn(
            "hover:bg-muted/30 transition-colors border-b border-border/30",
            isChild && "bg-muted/5"
          )}
        >
          <td
            className={cn(
              "py-2.5 px-3 sticky left-0 bg-surface",
              isChild ? "pl-8" : "font-medium"
            )}
          >
            <div className="flex items-center gap-1">
              {hasChildren && (
                <button
                  onClick={() => toggleRow(item.key)}
                  className="p-0.5 hover:bg-muted rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              )}
              {!hasChildren && !isChild && <span className="w-5" />}
              <span className={cn(isChild && "text-muted-foreground")}>{item.label}</span>
            </div>
          </td>
          {/* TTM Column */}
          <td className="py-2.5 px-3 text-right tabular-nums whitespace-nowrap">
            {formatValue(calculateTTM(item.key), isEPS, isShares)}
          </td>
          {/* Period Columns */}
          {displayStatements.map((stmt, idx) => (
            <td key={idx} className="py-2.5 px-3 text-right tabular-nums whitespace-nowrap">
              {formatValue(stmt[item.key], isEPS, isShares)}
            </td>
          ))}
        </tr>
        {/* Render children if expanded */}
        {hasChildren && isExpanded && item.children?.map((child) => renderRow(child, true, item.key))}
      </Fragment>
    );
  };

  return (
    <div className="space-y-6">
      <section className="bg-surface rounded-xl border border-border/50 overflow-hidden">
        {/* Header Navigation - matching Yahoo Finance */}
        <div className="border-b border-border/50">
          <nav className="flex">
            {[
              { value: "income", label: "Income Statement" },
              { value: "balance", label: "Balance Sheet" },
              { value: "cashflow", label: "Cash Flow" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setStatementType(tab.value as StatementType);
                  setExpandedRows(new Set());
                  setAllExpanded(false);
                }}
                className={cn(
                  "px-4 py-3 text-sm font-medium transition-colors relative",
                  statementType === tab.value
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {statementType === tab.value && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sub-header with currency info and controls */}
        <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-border/30 bg-muted/20">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Currency in USD</span>
            <span>All numbers in thousands</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Period Toggle */}
            <div className="flex rounded-md border border-border overflow-hidden">
              {[
                { value: "annual", label: "Annual" },
                { value: "quarterly", label: "Quarterly" },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value as PeriodType)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors",
                    period === p.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Expand All Button */}
            <button
              onClick={toggleAllRows}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {allExpanded ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
              {allExpanded ? "Collapse All" : "Expand All"}
            </button>
          </div>
        </div>

        {/* Financial Table */}
        {displayStatements.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No financial data available
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-2.5 px-3 font-medium text-muted-foreground sticky left-0 bg-muted/30 min-w-[280px]">
                    Breakdown
                  </th>
                  <th className="text-right py-2.5 px-3 font-medium text-muted-foreground whitespace-nowrap min-w-[100px]">
                    TTM
                  </th>
                  {displayStatements.map((stmt, idx) => (
                    <th key={idx} className="text-right py-2.5 px-3 font-medium text-muted-foreground whitespace-nowrap min-w-[100px]">
                      {formatDate(stmt.endDate as string)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => renderRow(item))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
