/**
 * Article Image Selection Utility
 *
 * Selects relevant images for articles based on their category, type, and sentiment.
 * Uses curated Unsplash images stored in /public/images/articles/
 */

// Image library mapped by category/type
const ARTICLE_IMAGES: Record<string, string[]> = {
  // Business types
  earnings: ['/images/articles/earnings-1.jpg', '/images/articles/earnings-2.jpg'],
  merger: ['/images/articles/merger-1.jpg', '/images/articles/merger-2.jpg'],
  dividend: ['/images/articles/dividend-1.jpg', '/images/articles/dividend-2.jpg'],
  filing: ['/images/articles/finance-1.jpg', '/images/articles/finance-2.jpg'],

  // FiscalWire categories
  fda: ['/images/articles/fda-1.jpg', '/images/articles/fda-2.jpg'],
  ma: ['/images/articles/merger-1.jpg', '/images/articles/merger-2.jpg'],
  sec_filing: ['/images/articles/finance-1.jpg', '/images/articles/finance-2.jpg'],

  // Markets categories
  crypto: ['/images/articles/crypto-1.jpg', '/images/articles/crypto-2.jpg'],
  'us-markets': ['/images/articles/earnings-1.jpg', '/images/articles/finance-1.jpg'],
  forex: ['/images/articles/finance-1.jpg', '/images/articles/finance-2.jpg'],
  bonds: ['/images/articles/dividend-1.jpg', '/images/articles/dividend-2.jpg'],
  etf: ['/images/articles/earnings-1.jpg', '/images/articles/earnings-2.jpg'],

  // Business categories
  'health-science': ['/images/articles/fda-1.jpg', '/images/articles/fda-2.jpg'],
  tech: ['/images/articles/tech-1.jpg', '/images/articles/tech-2.jpg'],
  finance: ['/images/articles/finance-1.jpg', '/images/articles/finance-2.jpg'],
  economy: ['/images/articles/earnings-1.jpg', '/images/articles/finance-1.jpg'],

  // Sentiment-based
  bullish: ['/images/articles/bullish-1.jpg'],
  bearish: ['/images/articles/bearish-1.jpg'],

  // Default fallback
  default: ['/images/articles/default.jpg'],
};

export interface ArticleImageParams {
  category?: string;
  businessType?: string;
  marketsCategory?: string;
  sentiment?: string;
  tickers?: string[];
  articleId?: string;
}

/**
 * Select an appropriate image for an article based on its attributes
 *
 * Priority order:
 * 1. businessType (earnings, merger, dividend, filing)
 * 2. category (fda, ma, sec_filing)
 * 3. marketsCategory (crypto, forex, bonds, etf, us-markets)
 * 4. sentiment (bullish, bearish) - only if not neutral
 * 5. default
 */
export function selectArticleImage(params: ArticleImageParams): string {
  const { category, businessType, marketsCategory, sentiment, articleId } = params;

  // Try each key in priority order
  const keysToTry = [
    businessType,
    category,
    marketsCategory,
    sentiment !== 'neutral' ? sentiment : undefined,
  ].filter(Boolean) as string[];

  for (const key of keysToTry) {
    const images = ARTICLE_IMAGES[key.toLowerCase()];
    if (images && images.length > 0) {
      // Use articleId hash if available for consistent selection, otherwise random
      const index = articleId
        ? Math.abs(hashString(articleId)) % images.length
        : Math.floor(Math.random() * images.length);
      return images[index];
    }
  }

  // Fallback to default
  const defaultImages = ARTICLE_IMAGES.default;
  return defaultImages[0];
}

/**
 * Simple string hash function for consistent image selection
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
}
