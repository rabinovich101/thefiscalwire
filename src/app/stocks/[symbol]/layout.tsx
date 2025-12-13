import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StockSidebar } from "@/components/stocks/StockSidebar";
import { StockMobileTabs } from "@/components/stocks/StockMobileTabs";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ symbol: string }>;
}

async function getStockData(symbol: string) {
  try {
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl && process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else if (!baseUrl && process.env.RAILWAY_PUBLIC_DOMAIN) {
      baseUrl = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
    } else if (!baseUrl) {
      baseUrl = "http://localhost:3000";
    }

    const res = await fetch(`${baseUrl}/api/stocks/${symbol}/quote`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch stock data:", error);
    return null;
  }
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  const stock = await getStockData(upperSymbol);

  if (!stock) {
    return {
      title: `${upperSymbol} | Stock Not Found`,
    };
  }

  const priceFormatted = stock.price?.toFixed(2) || "N/A";
  const changeFormatted =
    stock.change >= 0
      ? `+${stock.change?.toFixed(2)}`
      : stock.change?.toFixed(2);

  return {
    title: `${stock.name} (${upperSymbol}) Stock Price, Quote & News | The Fiscal Wire`,
    description: `Get the latest ${stock.name} (${upperSymbol}) stock price, news, and financial data. Current price: $${priceFormatted} (${changeFormatted})`,
    openGraph: {
      title: `${upperSymbol} - $${priceFormatted} | The Fiscal Wire`,
      description: `${stock.name} stock quote and analysis`,
    },
  };
}

export default async function StockLayout({ children, params }: LayoutProps) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  const stock = await getStockData(upperSymbol);

  if (!stock || stock.error) {
    notFound();
  }

  const isPositive = stock.change >= 0;
  const formatPrice = (price: number) => `$${price?.toFixed(2) || "0.00"}`;
  const formatChange = (change: number, percent: number) => {
    const sign = change >= 0 ? "+" : "";
    // percent from Yahoo Finance is a decimal (e.g., -0.0027 for -0.27%)
    const percentDisplay = percent ? (percent * 100).toFixed(2) : "0.00";
    return `${sign}${change?.toFixed(2) || "0.00"} (${sign}${percentDisplay}%)`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Sticky Price Header Bar */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            {/* Stock Info */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              {/* Left: Symbol, Name, Exchange */}
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <h1 className="text-xl font-bold">{upperSymbol}</h1>
                    <span className="text-sm text-muted-foreground">
                      {stock.exchange}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                </div>
              </div>

              {/* Right: Price and Change */}
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold tabular-nums">
                  {formatPrice(stock.price)}
                </span>
                <div
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-md",
                    isPositive ? "bg-positive/10" : "bg-negative/10"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 text-positive" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-negative" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      isPositive ? "text-positive" : "text-negative"
                    )}
                  >
                    {formatChange(stock.change, stock.changePercent)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tabs - Only visible on mobile/tablet */}
      <div className="lg:hidden sticky top-[7.5rem] z-30 bg-background">
        <StockMobileTabs symbol={upperSymbol} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-8">
            {/* Left Sidebar - Desktop only */}
            <aside className="hidden lg:block w-48 flex-shrink-0">
              <div className="sticky top-[9rem]">
                <StockSidebar symbol={upperSymbol} />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
