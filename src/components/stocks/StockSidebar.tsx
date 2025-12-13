"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const STOCK_TABS = [
  { id: "summary", label: "Summary", href: "" },
  { id: "news", label: "News", href: "/news" },
  { id: "chart", label: "Chart", href: "/chart" },
  { id: "conversations", label: "Conversations", href: "/conversations" },
  { id: "statistics", label: "Statistics", href: "/statistics" },
  { id: "historical", label: "Historical Data", href: "/historical" },
  { id: "profile", label: "Profile", href: "/profile" },
  { id: "financials", label: "Financials", href: "/financials" },
  { id: "analysis", label: "Analysis", href: "/analysis" },
  { id: "options", label: "Options", href: "/options" },
  { id: "holders", label: "Holders", href: "/holders" },
];

interface StockSidebarProps {
  symbol: string;
}

export function StockSidebar({ symbol }: StockSidebarProps) {
  const pathname = usePathname();
  const baseUrl = `/stocks/${symbol}`;

  const isActiveTab = (tabHref: string) => {
    const fullPath = tabHref ? `${baseUrl}${tabHref}` : baseUrl;

    // For summary tab (empty href), check if we're exactly on the base URL
    if (tabHref === "") {
      return pathname === baseUrl || pathname === `${baseUrl}/`;
    }

    // For other tabs, check if the pathname starts with the tab's full path
    return pathname.startsWith(fullPath);
  };

  return (
    <nav className="space-y-1" aria-label="Stock navigation">
      {STOCK_TABS.map((tab) => {
        const isActive = isActiveTab(tab.href);
        const href = tab.href ? `${baseUrl}${tab.href}` : baseUrl;

        return (
          <Link
            key={tab.id}
            href={href}
            className={cn(
              "block px-3 py-2 text-sm rounded-md transition-colors",
              isActive
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
