import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

// Force dynamic generation to avoid build-time database connection issues
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://thefiscalwire.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/stocks`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stocks/earnings`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/stocks/trending`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/stocks/gainers`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/stocks/losers`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/stocks/heatmap`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.7,
    },
  ];

  // Popular stock pages (S&P 500 major components)
  const popularStocks = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "BRK-B", "JPM", "V",
    "JNJ", "UNH", "XOM", "PG", "MA", "HD", "CVX", "ABBV", "MRK", "COST",
    "PEP", "KO", "AVGO", "LLY", "WMT", "ADBE", "CRM", "CSCO", "NFLX", "AMD",
    "INTC", "QCOM", "ORCL", "IBM", "DIS", "NKE", "MCD", "BA", "CAT", "GE",
  ];

  const stockPages: MetadataRoute.Sitemap = popularStocks.map((symbol) => ({
    url: `${baseUrl}/stocks/${symbol}`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  // Sector pages
  const sectors = [
    "technology", "healthcare", "financial", "consumer-cyclical",
    "communication-services", "industrials", "consumer-defensive",
    "energy", "basic-materials", "real-estate", "utilities",
  ];

  const sectorPages: MetadataRoute.Sitemap = sectors.map((sector) => ({
    url: `${baseUrl}/stocks/sectors/${sector}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.6,
  }));

  // Try to fetch articles and categories from database
  let articlePages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];

  try {
    const articles = await prisma.article.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
      take: 1000,
    });

    articlePages = articles.map((article) => ({
      url: `${baseUrl}/article/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const categories = await prisma.category.findMany({
      select: { slug: true },
    });

    categoryPages = categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Sitemap: Database connection failed, using static pages only:", error);
  }

  return [...staticPages, ...articlePages, ...categoryPages, ...stockPages, ...sectorPages];
}
