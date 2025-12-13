import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export const dynamic = "force-dynamic";

interface HoldersParams {
  params: Promise<{ symbol: string }>;
}

export async function GET(request: NextRequest, { params }: HoldersParams) {
  try {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();

    const result = await yahooFinance.quoteSummary(upperSymbol, {
      modules: [
        "institutionOwnership",
        "fundOwnership",
        "insiderHolders",
        "insiderTransactions",
        "majorHoldersBreakdown",
      ],
    });

    const formatHolder = (holder: unknown) => {
      const h = holder as Record<string, unknown>;
      return {
        organization: (h.organization as string) || null,
        reportDate: h.reportDate instanceof Date
          ? h.reportDate.toISOString().split("T")[0]
          : null,
        pctHeld: typeof h.pctHeld === "number" ? h.pctHeld : null,
        position: typeof h.position === "number" ? h.position : null,
        value: typeof h.value === "number" ? h.value : null,
        pctChange: typeof h.pctChange === "number" ? h.pctChange : null,
      };
    };

    const formatInsider = (insider: unknown) => {
      const i = insider as Record<string, unknown>;
      return {
        name: (i.name as string) || null,
        relation: (i.relation as string) || null,
        transactionDescription: (i.transactionDescription as string) || null,
        latestTransDate: i.latestTransDate instanceof Date
          ? i.latestTransDate.toISOString().split("T")[0]
          : null,
        positionDirect: typeof i.positionDirect === "number" ? i.positionDirect : null,
      };
    };

    const formatTransaction = (trans: unknown) => {
      const t = trans as Record<string, unknown>;
      return {
        filerName: (t.filerName as string) || null,
        filerRelation: (t.filerRelation as string) || null,
        transactionText: (t.transactionText as string) || null,
        moneyText: (t.moneyText as string) || null,
        ownership: (t.ownership as string) || null,
        startDate: t.startDate instanceof Date
          ? t.startDate.toISOString().split("T")[0]
          : null,
        value: typeof t.value === "number" ? t.value : null,
        shares: typeof t.shares === "number" ? t.shares : null,
      };
    };

    const breakdown = result.majorHoldersBreakdown;

    const holdersData = {
      symbol: upperSymbol,

      // Major holders breakdown
      majorHoldersBreakdown: breakdown
        ? {
            insidersPercentHeld: breakdown.insidersPercentHeld || null,
            institutionsPercentHeld: breakdown.institutionsPercentHeld || null,
            institutionsFloatPercentHeld: breakdown.institutionsFloatPercentHeld || null,
            institutionsCount: breakdown.institutionsCount || null,
          }
        : null,

      // Top institutional holders
      institutionOwnership: (result.institutionOwnership?.ownershipList || [])
        .slice(0, 15)
        .map(formatHolder),

      // Top fund holders
      fundOwnership: (result.fundOwnership?.ownershipList || [])
        .slice(0, 15)
        .map(formatHolder),

      // Insider holders
      insiderHolders: (result.insiderHolders?.holders || [])
        .slice(0, 15)
        .map(formatInsider),

      // Recent insider transactions
      insiderTransactions: (result.insiderTransactions?.transactions || [])
        .slice(0, 20)
        .map(formatTransaction),
    };

    return NextResponse.json(holdersData);
  } catch (error) {
    console.error("Holders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch holders" },
      { status: 500 }
    );
  }
}
