/**
 * Fiscal Wire (NewsFilter) API Service
 * Real-time financial news aggregation API
 * API Docs: https://api.thefiscalwire.com/docs
 */

// Types for Fiscal Wire API response
export interface FiscalWireArticle {
  id: number;
  source: string;
  source_url: string;
  title: string;
  summary: string | null;
  content: string | null;
  ai_summary: string | null;
  image_url: string | null;
  tickers: string[];
  category: string | null; // earnings, fda, ma, dividend, sec_filing
  sentiment_score: number | null;
  sentiment_label: string | null;
  published_at: string;
  created_at: string;
}

export interface FiscalWireResponse {
  items: FiscalWireArticle[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface FiscalWireFetchOptions {
  ticker?: string;
  source?: string;
  category?: string;
  after?: string; // ISO 8601 datetime
  before?: string; // ISO 8601 datetime
  page?: number;
  per_page?: number;
}

// Configuration
const FISCALWIRE_API_KEY = process.env.FISCALWIRE_API_KEY;
const FISCALWIRE_BASE_URL = 'https://api.thefiscalwire.com/api/v1/news';

/**
 * Map Fiscal Wire categories to our internal business categories
 */
export function mapFiscalWireCategory(category: string | null): string {
  if (!category) return 'finance';

  const categoryMap: Record<string, string> = {
    earnings: 'finance',
    fda: 'health-science',
    ma: 'finance', // Mergers & Acquisitions
    dividend: 'finance',
    sec_filing: 'finance',
  };

  return categoryMap[category.toLowerCase()] || 'finance';
}

/**
 * Map Fiscal Wire sentiment to our internal sentiment format
 */
export function mapSentiment(
  sentimentLabel: string | null,
  sentimentScore: number | null
): { sentiment: string; confidence: number } {
  if (!sentimentLabel) {
    return { sentiment: 'neutral', confidence: 0.5 };
  }

  const label = sentimentLabel.toLowerCase();

  // Map to our format: bullish, bearish, neutral
  let sentiment = 'neutral';
  if (label.includes('positive') || label.includes('bullish')) {
    sentiment = 'bullish';
  } else if (label.includes('negative') || label.includes('bearish')) {
    sentiment = 'bearish';
  }

  // Convert sentiment score to confidence (0-1)
  const confidence = sentimentScore !== null
    ? Math.abs(sentimentScore)
    : 0.5;

  return { sentiment, confidence };
}

/**
 * Determine markets category based on tickers and content
 */
export function determineMarketsCategory(
  tickers: string[],
  content: string | null
): string {
  const text = (content || '').toLowerCase();

  // Check for crypto
  const cryptoTickers = ['BTC', 'ETH', 'DOGE', 'SOL', 'XRP', 'ADA'];
  if (tickers.some(t => cryptoTickers.includes(t)) || text.includes('crypto') || text.includes('bitcoin')) {
    return 'crypto';
  }

  // Check for forex
  if (text.includes('forex') || text.includes('currency') || text.includes('exchange rate')) {
    return 'forex';
  }

  // Check for bonds
  if (text.includes('bond') || text.includes('treasury') || text.includes('yield')) {
    return 'bonds';
  }

  // Check for ETF
  if (text.includes('etf') || text.includes('fund')) {
    return 'etf';
  }

  // Default to US markets
  return 'us-markets';
}

/**
 * Fetch news from Fiscal Wire API
 */
export async function fetchNewsFromFiscalWire(
  options: FiscalWireFetchOptions = {}
): Promise<FiscalWireArticle[]> {
  if (!FISCALWIRE_API_KEY) {
    throw new Error('FISCALWIRE_API_KEY is not configured');
  }

  const params = new URLSearchParams();

  if (options.ticker) params.set('ticker', options.ticker);
  if (options.source) params.set('source', options.source);
  if (options.category) params.set('category', options.category);
  if (options.after) params.set('after', options.after);
  if (options.before) params.set('before', options.before);
  if (options.page) params.set('page', String(options.page));
  if (options.per_page) params.set('per_page', String(options.per_page));

  const url = `${FISCALWIRE_BASE_URL}?${params.toString()}`;

  console.log('[FiscalWire] Fetching news from:', url.replace(FISCALWIRE_API_KEY, '***'));

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': FISCALWIRE_API_KEY,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FiscalWire API error: ${response.status} - ${errorText}`);
  }

  const data: FiscalWireResponse = await response.json();

  console.log(`[FiscalWire] Fetched ${data.items?.length || 0} articles (total: ${data.total}, page: ${data.page}/${data.pages})`);

  // Filter out articles without required fields
  const validArticles = (data.items || []).filter(article => {
    if (!article.title) {
      console.log(`[FiscalWire] Skipping article without title: ${article.id}`);
      return false;
    }
    return true;
  });

  console.log(`[FiscalWire] ${validArticles.length} valid articles after filtering`);

  return validArticles;
}

/**
 * Fetch all pages of news from Fiscal Wire API
 */
export async function fetchAllNewsFromFiscalWire(
  options: Omit<FiscalWireFetchOptions, 'page'> = {},
  maxPages: number = 3
): Promise<FiscalWireArticle[]> {
  const allArticles: FiscalWireArticle[] = [];
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages && currentPage <= maxPages) {
    const articles = await fetchNewsFromFiscalWire({
      ...options,
      page: currentPage,
      per_page: options.per_page || 50,
    });

    allArticles.push(...articles);

    // Get total pages from first response
    if (currentPage === 1) {
      const response = await fetch(
        `${FISCALWIRE_BASE_URL}?page=1&per_page=${options.per_page || 50}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': FISCALWIRE_API_KEY!,
          },
        }
      );
      const data: FiscalWireResponse = await response.json();
      totalPages = data.pages;
    }

    currentPage++;
  }

  return allArticles;
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
 * Convert content to article block format
 */
export function convertToContentBlocks(
  content: string | null,
  aiSummary: string | null,
  summary: string | null
): object[] {
  const blocks: object[] = [];

  // Use AI summary as first paragraph if available
  if (aiSummary) {
    blocks.push({
      type: 'paragraph',
      content: aiSummary,
    });
  }

  // Add main content if available
  if (content) {
    const paragraphs = content.split(/\n\n+/);
    paragraphs.forEach((paragraph) => {
      const trimmed = paragraph.trim();
      if (trimmed.length > 0) {
        blocks.push({
          type: 'paragraph',
          content: trimmed,
        });
      }
    });
  } else if (summary && !aiSummary) {
    // Fallback to summary if no content and no AI summary
    blocks.push({
      type: 'paragraph',
      content: summary,
    });
  }

  // Ensure at least one block
  if (blocks.length === 0) {
    blocks.push({
      type: 'paragraph',
      content: summary || 'No content available.',
    });
  }

  return blocks;
}

/**
 * Determine business type from category
 */
export function determineBusinessType(category: string | null): string {
  if (!category) return 'news';

  const businessTypeMap: Record<string, string> = {
    earnings: 'earnings',
    fda: 'regulation',
    ma: 'merger',
    dividend: 'dividend',
    sec_filing: 'filing',
  };

  return businessTypeMap[category.toLowerCase()] || 'news';
}

/**
 * Normalize title for comparison (remove special chars, lowercase)
 */
export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim();
}

/**
 * Check if two titles are similar (for duplicate detection)
 * Returns true if titles are >80% similar
 */
export function areTitlesSimilar(title1: string, title2: string): boolean {
  const norm1 = normalizeTitle(title1);
  const norm2 = normalizeTitle(title2);

  // Exact match after normalization
  if (norm1 === norm2) return true;

  // Check if one contains the other (substring match)
  if (norm1.includes(norm2) || norm2.includes(norm1)) return true;

  // Calculate Jaccard similarity on words
  const words1 = new Set(norm1.split(' ').filter(w => w.length > 2));
  const words2 = new Set(norm2.split(' ').filter(w => w.length > 2));

  if (words1.size === 0 || words2.size === 0) return false;

  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);

  const similarity = intersection.size / union.size;
  return similarity > 0.6; // 60% word overlap threshold
}
