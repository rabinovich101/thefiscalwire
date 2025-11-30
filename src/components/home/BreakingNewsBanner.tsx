"use client";

import Link from "next/link";
import { AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { breakingNews } from "@/data/mockData";

export function BreakingNewsBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!breakingNews.isActive || !isVisible) {
    return null;
  }

  return (
    <div className="relative bg-breaking/10 border-b border-breaking/20">
      <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={breakingNews.url}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            {/* Breaking Indicator */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-breaking opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-breaking"></span>
              </span>
              <span className="text-xs font-bold text-breaking uppercase tracking-wider">
                Breaking
              </span>
            </div>

            {/* Headline */}
            <p className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors">
              {breakingNews.headline}
            </p>
          </Link>

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss breaking news"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
