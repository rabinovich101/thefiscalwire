"use client";

import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Cpu,
  Heart,
  Landmark,
  ShoppingBag,
  Coffee,
  Factory,
  Flame,
  Zap,
  Building2,
  Gem,
  Radio,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SectorPerformance } from "@/lib/yahoo-finance";

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu,
  Heart,
  Landmark,
  ShoppingBag,
  Coffee,
  Factory,
  Flame,
  Zap,
  Building2,
  Gem,
  Radio,
};

// Color configurations for each sector
const colorConfig: Record<string, {
  iconBg: string;
  iconColor: string;
  border: string;
  hoverBorder: string;
  glow: string;
}> = {
  blue: {
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    border: "border-blue-500/20",
    hoverBorder: "hover:border-blue-500/40",
    glow: "group-hover:shadow-blue-500/10",
  },
  emerald: {
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    border: "border-emerald-500/20",
    hoverBorder: "hover:border-emerald-500/40",
    glow: "group-hover:shadow-emerald-500/10",
  },
  amber: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    border: "border-amber-500/20",
    hoverBorder: "hover:border-amber-500/40",
    glow: "group-hover:shadow-amber-500/10",
  },
  pink: {
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-500",
    border: "border-pink-500/20",
    hoverBorder: "hover:border-pink-500/40",
    glow: "group-hover:shadow-pink-500/10",
  },
  orange: {
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
    border: "border-orange-500/20",
    hoverBorder: "hover:border-orange-500/40",
    glow: "group-hover:shadow-orange-500/10",
  },
  slate: {
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-400",
    border: "border-slate-500/20",
    hoverBorder: "hover:border-slate-500/40",
    glow: "group-hover:shadow-slate-500/10",
  },
  red: {
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
    border: "border-red-500/20",
    hoverBorder: "hover:border-red-500/40",
    glow: "group-hover:shadow-red-500/10",
  },
  yellow: {
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-500",
    border: "border-yellow-500/20",
    hoverBorder: "hover:border-yellow-500/40",
    glow: "group-hover:shadow-yellow-500/10",
  },
  violet: {
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    border: "border-violet-500/20",
    hoverBorder: "hover:border-violet-500/40",
    glow: "group-hover:shadow-violet-500/10",
  },
  stone: {
    iconBg: "bg-stone-500/10",
    iconColor: "text-stone-400",
    border: "border-stone-500/20",
    hoverBorder: "hover:border-stone-500/40",
    glow: "group-hover:shadow-stone-500/10",
  },
  indigo: {
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
    border: "border-indigo-500/20",
    hoverBorder: "hover:border-indigo-500/40",
    glow: "group-hover:shadow-indigo-500/10",
  },
};

interface SectorCardProps {
  sector: SectorPerformance;
  rank?: number;
}

export function SectorCard({ sector, rank }: SectorCardProps) {
  const IconComponent = iconMap[sector.sectorInfo.icon] || Cpu;
  const colors = colorConfig[sector.sectorInfo.color] || colorConfig.blue;
  const isPositive = sector.avgChange >= 0;

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(0)}B`;
    return `$${(value / 1e6).toFixed(0)}M`;
  };

  return (
    <Link
      href={`/stocks/sectors/${sector.sectorId}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border bg-surface/50 backdrop-blur-sm p-6",
        "transition-all duration-300 ease-out",
        "hover:bg-surface hover:shadow-xl hover:-translate-y-1",
        colors.border,
        colors.hoverBorder,
        colors.glow
      )}
    >
      {/* Gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          "bg-gradient-to-br",
          sector.sectorInfo.gradient
        )}
      />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-xl transition-transform duration-300 group-hover:scale-110",
                colors.iconBg
              )}
            >
              <IconComponent className={cn("w-6 h-6", colors.iconColor)} />
            </div>

            {/* Rank badge (if provided) */}
            {rank && (
              <div className="absolute -top-2 -right-2 flex items-center justify-center w-7 h-7 rounded-full bg-muted text-xs font-bold text-muted-foreground">
                #{rank}
              </div>
            )}
          </div>

          {/* Performance badge */}
          <div
            className={cn(
              "flex items-center gap-1 px-2.5 py-1.5 rounded-full text-sm font-semibold transition-transform duration-300 group-hover:scale-105",
              isPositive
                ? "bg-positive/10 text-positive"
                : "bg-negative/10 text-negative"
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="tabular-nums">
              {isPositive ? "+" : ""}
              {sector.avgChange.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
            {sector.sectorInfo.name}
            <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {sector.sectorInfo.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-muted/30 rounded-lg px-3 py-2">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
              Stocks
            </div>
            <div className="text-lg font-bold tabular-nums">
              {sector.stockCount}
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg px-3 py-2">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
              Market Cap
            </div>
            <div className="text-lg font-bold tabular-nums">
              {formatMarketCap(sector.totalMarketCap)}
            </div>
          </div>
        </div>

        {/* Advancers / Decliners Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-positive" />
              {sector.advancers} advancing
            </span>
            <span className="flex items-center gap-1">
              {sector.decliners} declining
              <span className="w-2 h-2 rounded-full bg-negative" />
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden flex">
            <div
              className="h-full bg-positive transition-all duration-500"
              style={{
                width: `${(sector.advancers / sector.stockCount) * 100}%`,
              }}
            />
            <div
              className="h-full bg-negative transition-all duration-500"
              style={{
                width: `${(sector.decliners / sector.stockCount) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Top Performers */}
        <div className="mt-4 pt-4 border-t border-border/50 flex justify-between text-xs">
          {sector.topGainer && (
            <div>
              <span className="text-muted-foreground">Top: </span>
              <span className="font-medium text-positive">
                {sector.topGainer.symbol} +{sector.topGainer.changePercent.toFixed(1)}%
              </span>
            </div>
          )}
          {sector.topLoser && sector.topLoser.changePercent < 0 && (
            <div>
              <span className="text-muted-foreground">Worst: </span>
              <span className="font-medium text-negative">
                {sector.topLoser.symbol} {sector.topLoser.changePercent.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// Compact variant for sidebar or smaller spaces
export function SectorCardCompact({ sector }: { sector: SectorPerformance }) {
  const IconComponent = iconMap[sector.sectorInfo.icon] || Cpu;
  const colors = colorConfig[sector.sectorInfo.color] || colorConfig.blue;
  const isPositive = sector.avgChange >= 0;

  return (
    <Link
      href={`/stocks/sectors/${sector.sectorId}`}
      className={cn(
        "group flex items-center gap-3 p-3 rounded-xl border bg-surface/50 transition-all duration-200",
        "hover:bg-surface hover:border-border",
        colors.border
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg",
          colors.iconBg
        )}
      >
        <IconComponent className={cn("w-5 h-5", colors.iconColor)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-foreground truncate">
          {sector.sectorInfo.name}
        </div>
        <div className="text-xs text-muted-foreground">
          {sector.stockCount} stocks
        </div>
      </div>

      <div
        className={cn(
          "text-sm font-semibold tabular-nums",
          isPositive ? "text-positive" : "text-negative"
        )}
      >
        {isPositive ? "+" : ""}
        {sector.avgChange.toFixed(2)}%
      </div>
    </Link>
  );
}
