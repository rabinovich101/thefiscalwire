import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export const dynamic = "force-dynamic";

interface ProfileParams {
  params: Promise<{ symbol: string }>;
}

export async function GET(request: NextRequest, { params }: ProfileParams) {
  try {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();

    const result = await yahooFinance.quoteSummary(upperSymbol, {
      modules: ["assetProfile", "summaryProfile"],
    });

    const profile = result.assetProfile || result.summaryProfile;

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const profileData = {
      symbol: upperSymbol,
      address1: profile.address1 || null,
      address2: profile.address2 || null,
      city: profile.city || null,
      state: profile.state || null,
      zip: profile.zip || null,
      country: profile.country || null,
      phone: profile.phone || null,
      fax: profile.fax || null,
      website: profile.website || null,
      industry: profile.industry || null,
      industryKey: profile.industryKey || null,
      industryDisp: profile.industryDisp || null,
      sector: profile.sector || null,
      sectorKey: profile.sectorKey || null,
      sectorDisp: profile.sectorDisp || null,
      longBusinessSummary: profile.longBusinessSummary || null,
      fullTimeEmployees: profile.fullTimeEmployees || null,
      companyOfficers: (profile.companyOfficers || []).map((officer: unknown) => {
        const o = officer as Record<string, unknown>;
        return {
          name: (o.name as string) || null,
          title: (o.title as string) || null,
          age: typeof o.age === "number" ? o.age : null,
          yearBorn: typeof o.yearBorn === "number" ? o.yearBorn : null,
          fiscalYear: typeof o.fiscalYear === "number" ? o.fiscalYear : null,
          totalPay: typeof o.totalPay === "number" ? o.totalPay : null,
          exercisedValue: typeof o.exercisedValue === "number" ? o.exercisedValue : null,
          unexercisedValue: typeof o.unexercisedValue === "number" ? o.unexercisedValue : null,
        };
      }),
      auditRisk: profile.auditRisk || null,
      boardRisk: profile.boardRisk || null,
      compensationRisk: profile.compensationRisk || null,
      shareHolderRightsRisk: profile.shareHolderRightsRisk || null,
      overallRisk: profile.overallRisk || null,
      governanceEpochDate: profile.governanceEpochDate || null,
      compensationAsOfEpochDate: profile.compensationAsOfEpochDate || null,
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
