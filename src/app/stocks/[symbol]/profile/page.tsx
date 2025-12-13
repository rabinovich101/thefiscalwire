"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Building2, Users, Globe, Phone, MapPin, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyOfficer {
  name: string | null;
  title: string | null;
  age: number | null;
  totalPay: number | null;
}

interface ProfileData {
  symbol: string;
  address1: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  phone: string | null;
  website: string | null;
  industry: string | null;
  sector: string | null;
  longBusinessSummary: string | null;
  fullTimeEmployees: number | null;
  companyOfficers: CompanyOfficer[];
  overallRisk: number | null;
  auditRisk: number | null;
  boardRisk: number | null;
  compensationRisk: number | null;
  shareHolderRightsRisk: number | null;
}

export default function ProfilePage() {
  const params = useParams();
  const symbol = (params.symbol as string).toUpperCase();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/stocks/${symbol}/profile`);
        const data = await res.json();
        if (!data.error) {
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [symbol]);

  const formatCurrency = (value: number | null) => {
    if (!value) return "—";
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const getRiskColor = (risk: number | null) => {
    if (!risk) return "text-muted-foreground";
    if (risk <= 3) return "text-positive";
    if (risk <= 6) return "text-gold";
    return "text-negative";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        Company profile not available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Overview */}
      <section className="bg-surface rounded-xl border border-border/50 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Company Overview
        </h2>

        {profile.longBusinessSummary && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {profile.longBusinessSummary}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Contact Information</h3>
            <div className="space-y-2 text-sm">
              {(profile.address1 || profile.city) && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    {profile.address1 && <p>{profile.address1}</p>}
                    {profile.city && (
                      <p>
                        {profile.city}
                        {profile.state && `, ${profile.state}`}
                        {profile.zip && ` ${profile.zip}`}
                      </p>
                    )}
                    {profile.country && <p>{profile.country}</p>}
                  </div>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {new URL(profile.website).hostname}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Business Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Business Information</h3>
            <div className="space-y-2 text-sm">
              {profile.sector && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sector</span>
                  <span className="font-medium">{profile.sector}</span>
                </div>
              )}
              {profile.industry && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Industry</span>
                  <span className="font-medium">{profile.industry}</span>
                </div>
              )}
              {profile.fullTimeEmployees && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Full Time Employees</span>
                  <span className="font-medium flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {profile.fullTimeEmployees.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Key Executives */}
      {profile.companyOfficers && profile.companyOfficers.length > 0 && (
        <section className="bg-surface rounded-xl border border-border/50 p-6">
          <h2 className="text-lg font-semibold mb-4">Key Executives</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Title</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Age</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Total Pay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {profile.companyOfficers.slice(0, 10).map((officer, index) => (
                  <tr key={index} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2 font-medium">{officer.name || "—"}</td>
                    <td className="py-3 px-2 text-muted-foreground">{officer.title || "—"}</td>
                    <td className="py-3 px-2 text-right tabular-nums">{officer.age || "—"}</td>
                    <td className="py-3 px-2 text-right tabular-nums">{formatCurrency(officer.totalPay)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Governance Risk */}
      {profile.overallRisk && (
        <section className="bg-surface rounded-xl border border-border/50 p-6">
          <h2 className="text-lg font-semibold mb-4">Governance Risk</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Risk scores from 1-10 (1 = lowest risk, 10 = highest risk)
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <RiskCard label="Overall" value={profile.overallRisk} />
            <RiskCard label="Audit" value={profile.auditRisk} />
            <RiskCard label="Board" value={profile.boardRisk} />
            <RiskCard label="Compensation" value={profile.compensationRisk} />
            <RiskCard label="Shareholder Rights" value={profile.shareHolderRightsRisk} />
          </div>
        </section>
      )}
    </div>
  );
}

function RiskCard({ label, value }: { label: string; value: number | null }) {
  const getRiskColor = (risk: number | null) => {
    if (!risk) return "bg-muted";
    if (risk <= 3) return "bg-positive/20 text-positive";
    if (risk <= 6) return "bg-gold/20 text-gold";
    return "bg-negative/20 text-negative";
  };

  return (
    <div className="text-center p-4 bg-muted/30 rounded-lg">
      <div className={cn("text-2xl font-bold tabular-nums", getRiskColor(value))}>
        {value || "—"}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
