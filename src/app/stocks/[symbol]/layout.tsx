import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StockSidebar } from "@/components/stocks/StockSidebar";
import { StockMobileTabs } from "@/components/stocks/StockMobileTabs";
import { cn } from "@/lib/utils";
import { getStockData } from "@/lib/stock-data";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ symbol: string }>;
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

  // Dynamic description based on performance
  const changePercent = (stock.changePercent || 0) * 100;
  const absChange = Math.abs(changePercent);
  let trend = "trading";
  if (changePercent > 5) trend = "surging";
  else if (changePercent > 2) trend = "rising";
  else if (changePercent > 0) trend = "up";
  else if (changePercent > -2) trend = "slightly down";
  else if (changePercent > -5) trend = "falling";
  else if (changePercent <= -5) trend = "plunging";

  const nearHigh = stock.fiftyTwoWeekHigh && stock.price >= stock.fiftyTwoWeekHigh * 0.95;
  const nearLow = stock.fiftyTwoWeekLow && stock.price <= stock.fiftyTwoWeekLow * 1.05;
  let context = nearHigh ? ", near 52-week high" : nearLow ? ", near 52-week low" : "";

  const priceFormatted = stock.price?.toFixed(2) || "N/A";
  const description = `${stock.name} (${upperSymbol}) is ${trend} ${absChange.toFixed(2)}% at $${priceFormatted}${context}. Get real-time quotes, charts, news, and analysis.`;

  return {
    title: `${stock.name} (${upperSymbol}) Stock Price, Quote & News | The Fiscal Wire`,
    description,
    alternates: {
      canonical: `https://thefiscalwire.com/stocks/${upperSymbol}`,
    },
    openGraph: {
      title: `${upperSymbol} - $${priceFormatted} | The Fiscal Wire`,
      description,
      url: `https://thefiscalwire.com/stocks/${upperSymbol}`,
      siteName: "The Fiscal Wire",
      images: [`https://thefiscalwire.com/api/og/stock/${upperSymbol}`],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${upperSymbol} Stock - $${priceFormatted} (${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%)`,
      description,
      images: [`https://thefiscalwire.com/api/og/stock/${upperSymbol}`],
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

  // JSON-LD Schema for SEO
  const stockSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: `${stock.name} (${upperSymbol}) Stock Quote`,
    url: `https://thefiscalwire.com/stocks/${upperSymbol}`,
    description: `Real-time stock quote and analysis for ${stock.name}`,
    provider: {
      "@type": "Organization",
      name: stock.name,
      tickerSymbol: upperSymbol,
    },
    offers: {
      "@type": "Offer",
      price: stock.price,
      priceCurrency: "USD",
      priceValidUntil: new Date(Date.now() + 3600000).toISOString(),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://thefiscalwire.com" },
      { "@type": "ListItem", position: 2, name: "Stocks", item: "https://thefiscalwire.com/stocks" },
      { "@type": "ListItem", position: 3, name: upperSymbol },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${stock.name} (${upperSymbol}) Stock Price`,
    description: `Current price: $${stock.price?.toFixed(2)}`,
    url: `https://thefiscalwire.com/stocks/${upperSymbol}`,
    mainEntity: stockSchema,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* JSON-LD Schema Markup for SEO */}
      <Script
        id="stock-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(stockSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <Header />

      {/* Sticky Price Header Bar */}
      <div className="sticky top-14 sm:top-16 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="py-3 sm:py-4">
            {/* Stock Info */}
            <div className="flex flex-col gap-1.5 sm:gap-2 sm:flex-row sm:items-center sm:justify-between">
              {/* Left: Symbol, Name, Exchange */}
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <h1 className="text-lg sm:text-xl font-bold">{upperSymbol}</h1>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {stock.exchange}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-none">{stock.name}</p>
                </div>
              </div>

              {/* Right: Price and Change */}
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-xl sm:text-2xl font-bold tabular-nums">
                  {formatPrice(stock.price)}
                </span>
                <div
                  className={cn(
                    "flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md",
                    isPositive ? "bg-positive/10" : "bg-negative/10"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-positive" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-negative" />
                  )}
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-semibold tabular-nums",
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
      <div className="lg:hidden sticky top-[6rem] sm:top-[7rem] z-30 bg-background">
        <StockMobileTabs symbol={upperSymbol} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
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
