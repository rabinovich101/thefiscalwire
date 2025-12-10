import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EarningsPageClient } from "./EarningsPageClient";
import {
  getEarningsCalendar,
  getTodaysEarnings,
  getThisWeeksEarnings,
  groupEarningsByDate,
} from "@/lib/alpha-vantage";
import { getMarketIndices } from "@/lib/yahoo-finance";
import { Calendar, TrendingUp, TrendingDown, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Earnings Calendar | The Fiscal Wire",
  description:
    "Track upcoming earnings reports and company results. View earnings dates, EPS estimates, and historical performance for stocks.",
};

export const dynamic = "force-dynamic";

export default async function EarningsPage() {
  const [allEarnings, indices] = await Promise.all([
    getEarningsCalendar("3month").catch(() => []),
    getMarketIndices().catch(() => []),
  ]);

  const todaysEarnings = getTodaysEarnings(allEarnings);
  const thisWeeksEarnings = getThisWeeksEarnings(allEarnings);
  const groupedByDate = groupEarningsByDate(allEarnings);

  // Calculate stats
  const totalUpcoming = allEarnings.length;
  const todayCount = todaysEarnings.length;
  const thisWeekCount = thisWeeksEarnings.length;

  // Get unique dates with earnings
  const datesWithEarnings = Array.from(groupedByDate.keys()).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 border-b border-border/50 overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium border border-gold/20">
                <Calendar className="h-4 w-4" />
                Earnings Calendar
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Upcoming{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-500 to-orange-500">
                  Earnings
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Track company earnings reports, EPS estimates, and historical
                performance. Stay ahead of market-moving announcements.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground tabular-nums">
                    {totalUpcoming}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Upcoming
                  </div>
                </div>
                <div className="w-px h-12 bg-border/50 hidden sm:block" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold tabular-nums">
                    {todayCount}
                  </div>
                  <div className="text-sm text-muted-foreground">Today</div>
                </div>
                <div className="w-px h-12 bg-border/50 hidden sm:block" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary tabular-nums">
                    {thisWeekCount}
                  </div>
                  <div className="text-sm text-muted-foreground">This Week</div>
                </div>
                <div className="w-px h-12 bg-border/50 hidden sm:block" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground tabular-nums">
                    {datesWithEarnings}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Report Days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Market Indices Ticker */}
        {indices.length > 0 && (
          <section className="w-full border-b border-border/40 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative h-12 overflow-hidden">
                {/* Market Status Indicator */}
                <div className="absolute left-0 top-0 z-10 flex h-full items-center bg-surface px-4 border-r border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-positive"></span>
                    </span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                </div>

                {/* Scrolling Ticker */}
                <div className="flex h-full items-center animate-ticker pl-24">
                  {[...indices, ...indices].map((index, i) => (
                    <div
                      key={`${index.symbol}-${i}`}
                      className="flex items-center gap-3 px-4 border-r border-border/40 last:border-r-0"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-muted-foreground">
                          {index.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold tabular-nums text-foreground">
                            {index.price.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          <div
                            className={`flex items-center gap-0.5 ${
                              index.changePercent >= 0
                                ? "text-positive"
                                : "text-negative"
                            }`}
                          >
                            {index.changePercent >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            <span className="text-xs font-medium tabular-nums">
                              {index.changePercent >= 0 ? "+" : ""}
                              {index.changePercent.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gradient Fade Right */}
                <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-surface to-transparent pointer-events-none" />
              </div>
            </div>
          </section>
        )}

        {/* Main Content - Client Component for Interactivity */}
        <EarningsPageClient
          allEarnings={allEarnings}
          todaysEarnings={todaysEarnings}
          thisWeeksEarnings={thisWeeksEarnings}
        />
      </main>

      <Footer />
    </div>
  );
}
