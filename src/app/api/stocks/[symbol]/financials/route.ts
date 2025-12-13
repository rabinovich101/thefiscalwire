import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface FinancialsParams {
  params: Promise<{ symbol: string }>;
}

interface YahooTimeSeriesResult {
  timeseries?: {
    result?: Array<{
      meta?: {
        symbol?: string[];
        type?: string[];
      };
      timestamp?: number[];
      [key: string]: unknown;
    }>;
  };
}

interface FinancialDataPoint {
  reportedValue?: { raw?: number; fmt?: string };
  asOfDate?: string;
  periodType?: string;
}

export async function GET(request: NextRequest, { params }: FinancialsParams) {
  try {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();

    // Fetch from Yahoo Finance's fundamentals timeseries API
    const period1 = Math.floor(Date.now() / 1000) - 5 * 365 * 24 * 60 * 60; // 5 years ago
    const period2 = Math.floor(Date.now() / 1000);

    // Define the financial metrics we want - matching Yahoo Finance's display
    const incomeMetrics = [
      "annualTotalRevenue",
      "annualCostOfRevenue",
      "annualGrossProfit",
      "annualOperatingExpense",
      "annualOperatingIncome",
      "annualNetNonOperatingInterestIncomeExpense",
      "annualOtherIncomeExpense",
      "annualPretaxIncome",
      "annualTaxProvision",
      "annualNetIncome",
      "annualNetIncomeCommonStockholders",
      "annualDilutedNIAvailtoComStockholders",
      "annualBasicEPS",
      "annualDilutedEPS",
      "annualBasicAverageShares",
      "annualDilutedAverageShares",
      "annualTotalOperatingIncomeAsReported",
      "annualTotalExpenses",
      "annualNetIncomeFromContinuingAndDiscontinuedOperation",
      "annualNormalizedIncome",
      "annualInterestIncome",
      "annualInterestExpense",
      "annualNetInterestIncome",
      "annualEBIT",
      "annualEBITDA",
      "annualReconciledCostOfRevenue",
      "annualReconciledDepreciation",
      "annualNetIncomeContinuousOperations",
      "annualTotalUnusualItemsExcludingGoodwill",
      "annualTotalUnusualItems",
      "annualNormalizedEBITDA",
      "annualTaxRateForCalcs",
      "annualTaxEffectOfUnusualItems",
      "annualResearchAndDevelopment",
      "annualSellingGeneralAndAdministration",
      // Quarterly variants
      "quarterlyTotalRevenue",
      "quarterlyCostOfRevenue",
      "quarterlyGrossProfit",
      "quarterlyOperatingExpense",
      "quarterlyOperatingIncome",
      "quarterlyNetNonOperatingInterestIncomeExpense",
      "quarterlyOtherIncomeExpense",
      "quarterlyPretaxIncome",
      "quarterlyTaxProvision",
      "quarterlyNetIncome",
      "quarterlyNetIncomeCommonStockholders",
      "quarterlyDilutedNIAvailtoComStockholders",
      "quarterlyBasicEPS",
      "quarterlyDilutedEPS",
      "quarterlyBasicAverageShares",
      "quarterlyDilutedAverageShares",
      "quarterlyEBIT",
      "quarterlyEBITDA",
    ];

    const balanceMetrics = [
      "annualTotalAssets",
      "annualTotalCurrentAssets",
      "annualCashAndCashEquivalents",
      "annualOtherShortTermInvestments",
      "annualReceivables",
      "annualInventory",
      "annualTotalNonCurrentAssets",
      "annualNetPPE",
      "annualGoodwill",
      "annualOtherIntangibleAssets",
      "annualInvestmentsAndAdvances",
      "annualTotalLiabilitiesNetMinorityInterest",
      "annualTotalCurrentLiabilities",
      "annualPayablesAndAccruedExpenses",
      "annualCurrentDebt",
      "annualCurrentDeferredRevenue",
      "annualTotalNonCurrentLiabilitiesNetMinorityInterest",
      "annualLongTermDebt",
      "annualTotalEquityGrossMinorityInterest",
      "annualStockholdersEquity",
      "annualCommonStock",
      "annualRetainedEarnings",
      "annualTotalCapitalization",
      "annualCommonStockEquity",
      "annualNetTangibleAssets",
      "annualWorkingCapital",
      "annualInvestedCapital",
      "annualTangibleBookValue",
      "annualTotalDebt",
      "annualNetDebt",
      "annualShareIssued",
      "annualOrdinarySharesNumber",
      // Quarterly variants
      "quarterlyTotalAssets",
      "quarterlyTotalCurrentAssets",
      "quarterlyCashAndCashEquivalents",
      "quarterlyTotalLiabilitiesNetMinorityInterest",
      "quarterlyTotalCurrentLiabilities",
      "quarterlyLongTermDebt",
      "quarterlyTotalEquityGrossMinorityInterest",
      "quarterlyTotalDebt",
      "quarterlyNetDebt",
    ];

    const cashflowMetrics = [
      "annualOperatingCashFlow",
      "annualNetIncomeFromContinuingOperations",
      "annualDepreciationAndAmortization",
      "annualDeferredTax",
      "annualStockBasedCompensation",
      "annualChangeInReceivables",
      "annualChangeInInventory",
      "annualInvestingCashFlow",
      "annualCapitalExpenditure",
      "annualNetBusinessPurchaseAndSale",
      "annualNetInvestmentPurchaseAndSale",
      "annualFinancingCashFlow",
      "annualNetIssuancePaymentsOfDebt",
      "annualNetCommonStockIssuance",
      "annualCashDividendsPaid",
      "annualCommonStockPayments",
      "annualChangesInCash",
      "annualBeginningCashPosition",
      "annualEndCashPosition",
      "annualFreeCashFlow",
      "annualRepurchaseOfCapitalStock",
      "annualIssuanceOfCapitalStock",
      "annualIssuanceOfDebt",
      "annualRepaymentOfDebt",
      // Quarterly variants
      "quarterlyOperatingCashFlow",
      "quarterlyInvestingCashFlow",
      "quarterlyFinancingCashFlow",
      "quarterlyCapitalExpenditure",
      "quarterlyChangesInCash",
      "quarterlyFreeCashFlow",
    ];

    const allMetrics = [...incomeMetrics, ...balanceMetrics, ...cashflowMetrics];

    const url = `https://query2.finance.yahoo.com/ws/fundamentals-timeseries/v1/finance/timeseries/${upperSymbol}?type=${allMetrics.join(",")}&period1=${period1}&period2=${period2}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data: YahooTimeSeriesResult = await response.json();

    // Process the timeseries data into our format
    const processTimeSeries = (prefix: "annual" | "quarterly") => {
      const statements: Record<string, unknown>[] = [];
      const dateMap = new Map<string, Record<string, unknown>>();

      if (data.timeseries?.result) {
        for (const series of data.timeseries.result) {
          const metricKeys = Object.keys(series).filter(
            (k) => k.startsWith(prefix) && Array.isArray(series[k])
          );

          for (const metricKey of metricKeys) {
            const cleanKey = metricKey.replace(prefix, "");
            // Convert first char to lowercase
            const fieldKey = cleanKey.charAt(0).toLowerCase() + cleanKey.slice(1);
            const values = series[metricKey] as FinancialDataPoint[];

            if (Array.isArray(values)) {
              for (const dataPoint of values) {
                if (dataPoint?.asOfDate && dataPoint?.reportedValue?.raw !== undefined) {
                  const date = dataPoint.asOfDate;
                  if (!dateMap.has(date)) {
                    dateMap.set(date, { endDate: date });
                  }
                  const entry = dateMap.get(date)!;
                  entry[fieldKey] = dataPoint.reportedValue.raw;
                }
              }
            }
          }
        }
      }

      // Convert map to sorted array (newest first)
      const sortedDates = Array.from(dateMap.keys()).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      );

      for (const date of sortedDates) {
        statements.push(dateMap.get(date)!);
      }

      return statements;
    };

    const financials = {
      symbol: upperSymbol,
      incomeStatementHistory: processTimeSeries("annual"),
      incomeStatementHistoryQuarterly: processTimeSeries("quarterly"),
      balanceSheetHistory: processTimeSeries("annual"),
      balanceSheetHistoryQuarterly: processTimeSeries("quarterly"),
      cashflowStatementHistory: processTimeSeries("annual"),
      cashflowStatementHistoryQuarterly: processTimeSeries("quarterly"),
    };

    return NextResponse.json(financials);
  } catch (error) {
    console.error("Financials error:", error);
    return NextResponse.json(
      { error: "Failed to fetch financials" },
      { status: 500 }
    );
  }
}
