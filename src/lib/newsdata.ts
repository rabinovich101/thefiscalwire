/**
 * NewsData.io API Service
 * Fetches news articles related to US stocks, investing, Wall Street, and politics
 */

// Types for NewsData.io API response
export interface NewsDataArticle {
  article_id: string;
  title: string;
  link: string;
  keywords: string[] | null;
  creator: string[] | null;
  video_url: string | null;
  description: string | null;
  content: string | null;
  pubDate: string;
  pubDateTZ: string;
  image_url: string | null;
  source_id: string;
  source_url: string;
  source_icon: string | null;
  source_priority: number;
  country: string[];
  category: string[];
  language: string;
  ai_tag: string | null;
  sentiment: string | null;
  sentiment_stats: string | null;
  ai_region: string | null;
  ai_org: string | null;
  duplicate: boolean;
}

export interface NewsDataResponse {
  status: string;
  totalResults: number;
  results: NewsDataArticle[];
  nextPage: string | null;
}

// Configuration
const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY;
const NEWSDATA_BASE_URL = 'https://newsdata.io/api/1/latest';

// Search query for financial news
const SEARCH_QUERY = 'stocks OR investing OR "wall street" OR trading OR market';

/**
 * Fetch news from NewsData.io API
 */
export async function fetchNewsFromNewsData(): Promise<NewsDataArticle[]> {
  if (!NEWSDATA_API_KEY) {
    throw new Error('NEWSDATA_API_KEY is not configured');
  }

  const params = new URLSearchParams({
    apikey: NEWSDATA_API_KEY,
    country: 'us',
    category: 'business,politics,technology',
    language: 'en',
    q: SEARCH_QUERY,
  });

  const url = `${NEWSDATA_BASE_URL}?${params.toString()}`;

  console.log('[NewsData] Fetching news from:', url.replace(NEWSDATA_API_KEY, '***'));

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NewsData API error: ${response.status} - ${errorText}`);
  }

  const data: NewsDataResponse = await response.json();

  if (data.status !== 'success') {
    throw new Error(`NewsData API returned status: ${data.status}`);
  }

  console.log(`[NewsData] Fetched ${data.results?.length || 0} articles (total: ${data.totalResults})`);

  // Filter out duplicates and articles without required fields
  const validArticles = (data.results || []).filter(article => {
    if (article.duplicate) {
      console.log(`[NewsData] Skipping duplicate: ${article.article_id}`);
      return false;
    }
    if (!article.title || !article.description) {
      console.log(`[NewsData] Skipping article without title/description: ${article.article_id}`);
      return false;
    }
    return true;
  });

  console.log(`[NewsData] ${validArticles.length} valid articles after filtering`);

  return validArticles;
}

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .substring(0, 100); // Limit length
}

/**
 * Estimate read time based on content length
 */
export function estimateReadTime(content: string | null): number {
  if (!content) return 3; // Default 3 minutes
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Convert plain text content to article block format
 */
export function convertToContentBlocks(content: string | null, description: string | null): object[] {
  const blocks: object[] = [];

  // Use description as first paragraph if no content
  if (!content && description) {
    blocks.push({
      type: 'paragraph',
      content: description,
    });
    return blocks;
  }

  // Split content into paragraphs
  const paragraphs = (content || description || '').split(/\n\n+/);

  paragraphs.forEach((paragraph) => {
    const trimmed = paragraph.trim();
    if (trimmed.length > 0) {
      blocks.push({
        type: 'paragraph',
        content: trimmed,
      });
    }
  });

  // Ensure at least one block
  if (blocks.length === 0 && description) {
    blocks.push({
      type: 'paragraph',
      content: description,
    });
  }

  return blocks;
}

/**
 * Map NewsData category to our category slugs
 */
export function mapCategory(categories: string[]): string {
  // Priority mapping
  const categoryMap: Record<string, string> = {
    business: 'markets',
    politics: 'economy',
    technology: 'tech',
    world: 'economy',
    top: 'markets',
  };

  for (const cat of categories) {
    const mapped = categoryMap[cat.toLowerCase()];
    if (mapped) return mapped;
  }

  return 'markets'; // Default
}

/**
 * Extract stock tickers from content
 */
export function extractTickers(content: string | null, title: string): string[] {
  const text = `${title} ${content || ''}`;

  // Common ticker patterns: $AAPL, AAPL, etc.
  const tickerPattern = /\$?([A-Z]{1,5})(?:\s|$|,|\.|')/g;
  const matches = text.match(tickerPattern) || [];

  // Clean and deduplicate
  const tickers = [...new Set(
    matches
      .map(m => m.replace(/[$\s,.']/g, ''))
      .filter(t => t.length >= 2 && t.length <= 5)
  )];

  // Filter out common words that look like tickers
  const commonWords = ['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'HAS', 'HIS', 'HOW', 'ITS', 'MAY', 'NEW', 'NOW', 'OLD', 'SEE', 'WAY', 'WHO', 'BOY', 'DID', 'GET', 'HIM', 'LET', 'PUT', 'SAY', 'SHE', 'TOO', 'USE'];

  return tickers.filter(t => !commonWords.includes(t)).slice(0, 10);
}

/**
 * Fetch news by specific category and search query
 */
export async function fetchNewsByCategory(
  targetCategory: 'crypto' | 'economy' | 'opinion',
  searchQuery: string
): Promise<NewsDataArticle[]> {
  if (!NEWSDATA_API_KEY) {
    throw new Error('NEWSDATA_API_KEY is not configured');
  }

  // Map our categories to NewsData categories
  const categoryMap: Record<string, string> = {
    crypto: 'business', // crypto news often falls under business
    economy: 'politics,business',
    opinion: 'politics,business',
  };

  const params = new URLSearchParams({
    apikey: NEWSDATA_API_KEY,
    language: 'en',
    q: searchQuery,
  });

  // Add category if mapped
  if (categoryMap[targetCategory]) {
    params.set('category', categoryMap[targetCategory]);
  }

  const url = `${NEWSDATA_BASE_URL}?${params.toString()}`;

  console.log(`[NewsData] Fetching ${targetCategory} news:`, url.replace(NEWSDATA_API_KEY, '***'));

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NewsData API error: ${response.status} - ${errorText}`);
  }

  const data: NewsDataResponse = await response.json();

  if (data.status !== 'success') {
    throw new Error(`NewsData API returned status: ${data.status}`);
  }

  console.log(`[NewsData] Fetched ${data.results?.length || 0} ${targetCategory} articles`);

  // Filter out duplicates and articles without required fields
  const validArticles = (data.results || []).filter(article => {
    if (article.duplicate) return false;
    if (!article.title || !article.description) return false;
    return true;
  });

  return validArticles;
}

/**
 * Force map to specific category (override default mapping)
 */
export function forceMapCategory(targetCategory: string): string {
  return targetCategory;
}
