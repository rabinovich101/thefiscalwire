"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const STOCK_TABS = [
  { id: "summary", label: "Summary", href: "" },
  { id: "news", label: "News", href: "/news" },
  { id: "chart", label: "Chart", href: "/chart" },
  { id: "short-interest", label: "Short Interest", href: "/short-interest" },
  { id: "statistics", label: "Statistics", href: "/statistics" },
  { id: "historical", label: "Historical Data", href: "/historical" },
  { id: "profile", label: "Profile", href: "/profile" },
  { id: "financials", label: "Financials", href: "/financials" },
  { id: "analysis", label: "Analysis", href: "/analysis" },
  { id: "options", label: "Options", href: "/options" },
  { id: "holders", label: "Holders", href: "/holders" },
];

interface StockMobileTabsProps {
  symbol: string;
}

export function StockMobileTabs({ symbol }: StockMobileTabsProps) {
  const pathname = usePathname();
  const baseUrl = `/stocks/${symbol}`;

  const isActiveTab = (tabHref: string) => {
    const fullPath = tabHref ? `${baseUrl}${tabHref}` : baseUrl;

    if (tabHref === "") {
      return pathname === baseUrl || pathname === `${baseUrl}/`;
    }

    return pathname.startsWith(fullPath);
  };

  return (
    <div className="overflow-x-auto scrollbar-hide border-b border-border bg-background">
      <div className="flex min-w-max px-4">
        {STOCK_TABS.map((tab) => {
          const isActive = isActiveTab(tab.href);
          const href = tab.href ? `${baseUrl}${tab.href}` : baseUrl;

          return (
            <Link
              key={tab.id}
              href={href}
              className={cn(
                "px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors",
                isActive
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
