import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export const dynamic = "force-dynamic";

interface AnalysisParams {
  params: Promise<{ symbol: string }>;
}

// Helper to format period labels like Yahoo Finance
function formatPeriodLabel(period: string | null, endDate: string | null): string {
  if (!period) return "—";

  // Convert period like "+1q" to "Current Qtr. (Jan 2026)"
  if (endDate) {
    const date = new Date(endDate);
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    if (period === "0q") return `Current Qtr. (${month} ${year})`;
    if (period === "+1q") return `Next Qtr. (${month} ${year})`;
    if (period === "0y") return `Current Year (${year})`;
    if (period === "+1y") return `Next Year (${year})`;
  }

  return period;
}

export async function GET(request: NextRequest, { params }: AnalysisParams) {
  try {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();

    const result = await yahooFinance.quoteSummary(upperSymbol, {
      modules: [
        "recommendationTrend",
        "earningsTrend",
        "earningsHistory",
        "upgradeDowngradeHistory",
        "financialData",
        "indexTrend",
        "incomeStatementHistoryQuarterly",
      ],
    });

    const recommendations = result.recommendationTrend?.trend || [];
    const earningsTrend = result.earningsTrend?.trend || [];
    const earningsHistory = result.earningsHistory?.history || [];
    const upgrades = result.upgradeDowngradeHistory?.history || [];
    const financial = result.financialData;
    const indexTrend = result.indexTrend;
    const incomeStatements = result.incomeStatementHistoryQuarterly?.incomeStatementHistory || [];

    // Helper to extract number value (yahoo-finance2 returns values directly)
    const getNum = (val: unknown): number | null => {
      if (typeof val === 'number') return val;
      if (val && typeof val === 'object' && 'raw' in val) return (val as { raw: number }).raw;
      return null;
    };

    // Process earnings trend for estimates tables (Yahoo Finance style)
    const processedEarningsTrend = earningsTrend.map((trend) => {
      const t = trend as Record<string, unknown>;
      const earningsEst = t.earningsEstimate as Record<string, unknown> | undefined;
      const revenueEst = t.revenueEstimate as Record<string, unknown> | undefined;
      const epsTrendData = t.epsTrend as Record<string, unknown> | undefined;
      const epsRevisionsData = t.epsRevisions as Record<string, unknown> | undefined;

      const period = (t.period as string) || null;
      const endDate = t.endDate ? new Date(t.endDate as Date).toISOString().split("T")[0] : null;

      return {
        period,
        periodLabel: formatPeriodLabel(period, endDate),
        endDate,
        growth: getNum(t.growth),
        // Earnings estimates
        earningsEstimate: {
          avg: getNum(earningsEst?.avg),
          low: getNum(earningsEst?.low),
          high: getNum(earningsEst?.high),
          numberOfAnalysts: getNum(earningsEst?.numberOfAnalysts),
          yearAgoEps: getNum(earningsEst?.yearAgoEps),
        },
        // Revenue estimates
        revenueEstimate: {
          avg: getNum(revenueEst?.avg),
          low: getNum(revenueEst?.low),
          high: getNum(revenueEst?.high),
          numberOfAnalysts: getNum(revenueEst?.numberOfAnalysts),
          yearAgoRevenue: getNum(revenueEst?.yearAgoRevenue),
          growth: getNum(revenueEst?.growth),
        },
        // EPS Trend
        epsTrend: {
          current: getNum(epsTrendData?.current),
          sevenDaysAgo: getNum(epsTrendData?.["7daysAgo"]),
          thirtyDaysAgo: getNum(epsTrendData?.["30daysAgo"]),
          sixtyDaysAgo: getNum(epsTrendData?.["60daysAgo"]),
          ninetyDaysAgo: getNum(epsTrendData?.["90daysAgo"]),
        },
        // EPS Revisions
        epsRevisions: {
          upLast7Days: getNum(epsRevisionsData?.upLast7days),
          upLast30Days: getNum(epsRevisionsData?.upLast30days),
          downLast7Days: getNum(epsRevisionsData?.downLast7days),
          downLast30Days: getNum(epsRevisionsData?.downLast30days),
        },
      };
    });

    // Build estimates tables like Yahoo Finance (4 columns: Current Qtr, Next Qtr, Current Year, Next Year)
    const quarterlyTrends = processedEarningsTrend.filter(t => t.period?.includes('q'));
    const yearlyTrends = processedEarningsTrend.filter(t => t.period?.includes('y'));

    // Sort properly: 0q, +1q for quarters and 0y, +1y for years
    quarterlyTrends.sort((a, b) => {
      const aNum = parseInt(a.period?.replace('q', '').replace('+', '') || '0');
      const bNum = parseInt(b.period?.replace('q', '').replace('+', '') || '0');
      return aNum - bNum;
    });
    yearlyTrends.sort((a, b) => {
      const aNum = parseInt(a.period?.replace('y', '').replace('+', '') || '0');
      const bNum = parseInt(b.period?.replace('y', '').replace('+', '') || '0');
      return aNum - bNum;
    });

    // Combine: [Current Qtr, Next Qtr, Current Year, Next Year]
    const estimateColumns = [
      quarterlyTrends[0] || null,
      quarterlyTrends[1] || null,
      yearlyTrends[0] || null,
      yearlyTrends[1] || null,
    ].filter(Boolean);

    // Process index trend for growth estimates comparison with S&P 500
    const indexEstimates = indexTrend?.estimates || [];
    const growthEstimates = {
      stock: {
        currentQtr: quarterlyTrends[0]?.growth ?? null,
        nextQtr: quarterlyTrends[1]?.growth ?? null,
        currentYear: yearlyTrends[0]?.growth ?? null,
        nextYear: yearlyTrends[1]?.growth ?? null,
      },
      index: {
        symbol: indexTrend?.symbol || "S&P 500",
        currentQtr: (indexEstimates[0] as { growth?: number })?.growth ?? null,
        nextQtr: (indexEstimates[1] as { growth?: number })?.growth ?? null,
        currentYear: (indexEstimates[2] as { growth?: number })?.growth ?? null,
        nextYear: (indexEstimates[3] as { growth?: number })?.growth ?? null,
      },
    };

    // Format quarter label like "Q1 FY25"
    const formatFiscalQuarter = (date: Date | string | null): string => {
      if (!date) return "—";
      const d = date instanceof Date ? date : new Date(date);
      if (isNaN(d.getTime())) return "—";
      const month = d.getMonth() + 1;
      const year = d.getFullYear().toString().slice(-2);
      // Determine fiscal quarter based on month
      let quarter = 1;
      if (month >= 2 && month <= 4) quarter = 1;
      else if (month >= 5 && month <= 7) quarter = 2;
      else if (month >= 8 && month <= 10) quarter = 3;
      else quarter = 4;
      return `Q${quarter} FY${year}`;
    };

    // Process chart data for Earnings Trends section (use earningsHistory for reliable dates)
    const earningsTrendsChart = earningsHistory.slice(0, 4).map((earning) => {
      const e = earning as Record<string, unknown>;
      const quarter = e.quarter instanceof Date ? e.quarter : null;
      return {
        quarter: formatFiscalQuarter(quarter),
        actual: typeof e.epsActual === 'number' ? e.epsActual : null,
        estimate: typeof e.epsEstimate === 'number' ? e.epsEstimate : null,
      };
    }); // Already in chronological order (oldest first)

    // Process quarterly revenue and net income for Revenue vs Earnings chart
    const revenueEarningsChart = incomeStatements.slice(0, 4).map((stmt) => {
      const s = stmt as unknown as Record<string, unknown>;
      const endDate = s.endDate instanceof Date ? s.endDate : null;
      return {
        quarter: formatFiscalQuarter(endDate),
        revenue: typeof s.totalRevenue === 'number' ? s.totalRevenue : null,
        netIncome: typeof s.netIncome === 'number' ? s.netIncome : null,
      };
    }).reverse(); // Reverse to show oldest first

    const analysisData = {
      symbol: upperSymbol,

      // Price targets
      targetHighPrice: financial?.targetHighPrice || null,
      targetLowPrice: financial?.targetLowPrice || null,
      targetMeanPrice: financial?.targetMeanPrice || null,
      targetMedianPrice: financial?.targetMedianPrice || null,
      numberOfAnalystOpinions: financial?.numberOfAnalystOpinions || null,
      recommendationKey: financial?.recommendationKey || null,
      recommendationMean: financial?.recommendationMean || null,

      // Recommendation trends
      recommendationTrend: recommendations.map((rec: {
        period?: string;
        strongBuy?: number;
        buy?: number;
        hold?: number;
        sell?: number;
        strongSell?: number;
      }) => ({
        period: rec.period || null,
        strongBuy: rec.strongBuy || 0,
        buy: rec.buy || 0,
        hold: rec.hold || 0,
        sell: rec.sell || 0,
        strongSell: rec.strongSell || 0,
      })),

      // Estimate columns for tables (Yahoo Finance style)
      estimateColumns,

      // Growth estimates comparison
      growthEstimates,

      // Chart data for Earnings Trends section
      earningsTrendsChart,
      revenueEarningsChart,

      // Earnings history (past 4 quarters like Yahoo)
      earningsHistory: earningsHistory.slice(0, 4).map((earning) => {
        const e = earning as Record<string, unknown>;
        const quarter = e.quarter instanceof Date ? e.quarter : null;
        return {
          epsActual: typeof e.epsActual === "number" ? e.epsActual : null,
          epsEstimate: typeof e.epsEstimate === "number" ? e.epsEstimate : null,
          epsDifference: typeof e.epsDifference === "number" ? e.epsDifference : null,
          surprisePercent: typeof e.surprisePercent === "number" ? e.surprisePercent : null,
          quarterDate: quarter ? quarter.toISOString().split("T")[0] : null,
          quarterLabel: quarter
            ? `${(quarter.getMonth() + 1).toString().padStart(2, '0')}/${quarter.getDate().toString().padStart(2, '0')}/${quarter.getFullYear()}`
            : null,
        };
      }),

      // Analyst upgrades/downgrades
      upgradeDowngradeHistory: upgrades.slice(0, 20).map((item) => {
        const i = item as Record<string, unknown>;
        return {
          firm: (i.firm as string) || null,
          toGrade: (i.toGrade as string) || null,
          fromGrade: (i.fromGrade as string) || null,
          action: (i.action as string) || null,
          date: i.epochGradeDate instanceof Date
            ? i.epochGradeDate.toISOString().split("T")[0]
            : null,
        };
      }),
    };

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analysis" },
      { status: 500 }
    );
  }
}
