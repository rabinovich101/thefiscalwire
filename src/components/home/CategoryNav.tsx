"use client";

import Link from "next/link";
import { TrendingUp, Cpu, Bitcoin, Building2, Wallet, MessageSquare } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const categories = [
  { name: "Markets", slug: "markets", icon: TrendingUp, color: "bg-blue-600" },
  { name: "Tech", slug: "tech", icon: Cpu, color: "bg-purple-600" },
  { name: "Crypto", slug: "crypto", icon: Bitcoin, color: "bg-orange-500" },
  { name: "Economy", slug: "economy", icon: Building2, color: "bg-green-600" },
  { name: "Personal Finance", slug: "personal-finance", icon: Wallet, color: "bg-teal-600" },
  { name: "Opinion", slug: "opinion", icon: MessageSquare, color: "bg-gray-600" },
];

export function CategoryNav() {
  return (
    <section className="border-y border-border/40 bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollArea className="w-full">
          <div className="flex items-center gap-2 py-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.slug}
                  href={`/${category.slug}`}
                  className="group flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border/40 hover:border-primary/50 hover:bg-surface-hover transition-all shrink-0"
                >
                  <div className={`p-1.5 rounded-full ${category.color}`}>
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>
    </section>
  );
}
