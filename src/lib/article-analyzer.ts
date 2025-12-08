/**
 * Article Analyzer Service
 * Uses Perplexity AI to analyze articles and extract structured metadata
 * about markets, sectors, stocks, competitors, and business context
 */

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const MODEL = 'sonar';

// Valid sectors (aligned with yahoo-finance.ts)
export const VALID_SECTORS = [
  'technology',
  'healthcare',
  'financial',
  'consumer-discretionary',
  'consumer-staples',
  'industrial',
  'energy',
  'utilities',
  'real-estate',
  'materials',
  'communication-services',
] as const;

export const VALID_MARKETS = [
  'US',
  'Europe',
  'Asia',
  'Global',
  'Crypto',
  'Forex',
  'Commodities',
] as const;

export const VALID_BUSINESS_TYPES = [
  'earnings',
  'merger',
  'acquisition',
  'ipo',
  'regulation',
  'product_launch',
  'lawsuit',
  'bankruptcy',
  'leadership_change',
  'market_analysis',
  'economic_data',
  'policy',
  'other',
] as const;

export const VALID_SENTIMENTS = ['bullish', 'bearish', 'neutral'] as const;
export const VALID_IMPACT_LEVELS = ['high', 'medium', 'low'] as const;

// Valid category slugs for the site
export const VALID_CATEGORIES = [
  'us-markets',
  'europe-markets',
  'asia-markets',
  'forex',
  'crypto',
  'bonds',
  'etf',
  'economy',
  'finance',
  'health-science',
  'real-estate',
  'media',
  'transportation',
  'industrial',
  'sports',
  'tech',
  'politics',
  'consumption',
  'opinion',
] as const;

export interface ArticleAnalysisResult {
  // Markets
  markets: string[];

  // Sectors
  primarySector: string | null;
  secondarySectors: string[];

  // Sub-sectors/Industries
  subSectors: string[];
  industries: string[];

  // Stocks
  primaryStock: string | null;
  mentionedStocks: string[];
  competitors: Record<string, string[]>;

  // Business context
  businessType: string | null;
  sentiment: string | null;
  impactLevel: string | null;

  // Categories (for site navigation) - legacy
  suggestedCategories: string[];  // e.g., ["us-markets", "tech", "consumption"]

  // Dual category system (new)
  suggestedMarketsCategory: string;  // One from: us-markets, europe-markets, asia-markets, forex, crypto, bonds, etf
  suggestedBusinessCategory: string;  // One from: economy, finance, tech, politics, health-science, real-estate, media, transportation, industrial, sports, consumption, opinion

  // Confidence
  confidence: number;
}

interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityResponse {
  id: string;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const ANALYSIS_SYSTEM_PROMPT = `You are a financial news analyst AI. Your task is to analyze financial news articles and extract structured metadata.

You MUST respond with valid JSON only, no other text.

VALID SECTORS (use these exact IDs):
- technology
- healthcare
- financial
- consumer-discretionary
- consumer-staples
- industrial
- energy
- utilities
- real-estate
- materials
- communication-services

VALID MARKETS:
- US (for US stock markets, companies)
- Europe (for European markets)
- Asia (for Asian markets)
- Global (affects multiple regions)
- Crypto (cryptocurrency related)
- Forex (currency markets)
- Commodities (oil, gold, etc.)

VALID BUSINESS TYPES:
- earnings (quarterly/annual reports)
- merger (company mergers)
- acquisition (company acquisitions)
- ipo (initial public offerings)
- regulation (government regulations)
- product_launch (new products/services)
- lawsuit (legal issues)
- bankruptcy (financial troubles)
- leadership_change (CEO/executive changes)
- market_analysis (general market commentary)
- economic_data (GDP, jobs, inflation data)
- policy (central bank, government policy)
- other (doesn't fit above)

VALID SENTIMENTS:
- bullish (positive outlook)
- bearish (negative outlook)
- neutral (balanced/informational)

VALID IMPACT LEVELS:
- high (market-moving news)
- medium (notable but not major)
- low (minor/routine news)

MARKETS CATEGORIES (pick exactly ONE):
- us-markets (US stock market news)
- europe-markets (European markets)
- asia-markets (Asian markets)
- forex (currency/forex)
- crypto (cryptocurrency)
- bonds (fixed income)
- etf (ETFs)

BUSINESS CATEGORIES (pick exactly ONE):
- economy (macroeconomic news)
- finance (banking, financial services)
- health-science (healthcare, biotech, pharma)
- real-estate (property, housing)
- media (entertainment, streaming)
- transportation (airlines, logistics)
- industrial (manufacturing)
- sports (sports business)
- tech (technology, AI, semiconductors)
- politics (political news affecting markets)
- consumption (retail, consumer spending)
- opinion (analysis, commentary)

For stock symbols, use standard ticker format (e.g., AAPL, MSFT, NVDA, GOOGL).
For competitors, identify the main competitors of each mentioned stock.
IMPORTANT: Every article MUST have exactly ONE markets category AND exactly ONE business category.`;

/**
 * Analyze an article using Perplexity AI
 */
export async function analyzeArticleWithAI(
  title: string,
  content: string
): Promise<ArticleAnalysisResult | null> {
  if (!PERPLEXITY_API_KEY) {
    console.error('[ArticleAnalyzer] Perplexity API key not configured');
    return null;
  }

  const userPrompt = `Analyze this financial news article and extract structured metadata:

TITLE: ${title}

CONTENT:
${content || 'No content available - analyze based on title'}

Respond with ONLY this JSON structure:
{
  "markets": ["US"],
  "primarySector": "technology",
  "secondarySectors": [],
  "subSectors": ["semiconductors"],
  "industries": ["artificial intelligence"],
  "primaryStock": "NVDA",
  "mentionedStocks": ["NVDA", "AMD"],
  "competitors": {
    "NVDA": ["AMD", "INTC"]
  },
  "businessType": "earnings",
  "sentiment": "bullish",
  "impactLevel": "high",
  "suggestedCategories": ["us-markets", "tech"],
  "suggestedMarketsCategory": "us-markets",
  "suggestedBusinessCategory": "tech",
  "confidence": 0.85
}

RULES:
1. Use ONLY valid sector IDs from the list
2. Use ONLY valid market values from the list
3. Stock symbols should be uppercase ticker symbols
4. If no stocks mentioned, set primaryStock to null and mentionedStocks to []
5. If sector is unclear, set primarySector to null
6. Confidence should be 0.0-1.0 based on how certain you are
7. Always identify competitors for mentioned stocks when known
8. suggestedMarketsCategory: pick exactly ONE from MARKETS CATEGORIES
9. suggestedBusinessCategory: pick exactly ONE from BUSINESS CATEGORIES`;

  const messages: PerplexityMessage[] = [
    { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
  ];

  try {
    console.log(`[ArticleAnalyzer] Analyzing: "${title.substring(0, 50)}..."`);

    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 2000,
        temperature: 0.3, // Lower temperature for more consistent structured output
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ArticleAnalyzer] API error: ${response.status} - ${errorText}`);
      return null;
    }

    const data: PerplexityResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      console.error('[ArticleAnalyzer] No response choices received');
      return null;
    }

    const responseContent = data.choices[0].message.content;
    console.log(`[ArticleAnalyzer] Received response (${data.usage?.total_tokens || 0} tokens)`);

    // Parse and validate the response
    const result = parseAnalysisResponse(responseContent);

    if (!result) {
      console.error('[ArticleAnalyzer] Failed to parse response');
      return null;
    }

    console.log(`[ArticleAnalyzer] Analysis complete - Sector: ${result.primarySector}, Stocks: ${result.mentionedStocks.join(', ')}`);
    return result;
  } catch (error) {
    console.error('[ArticleAnalyzer] Error:', error);
    return null;
  }
}

/**
 * Parse and validate the analysis response
 */
function parseAnalysisResponse(content: string): ArticleAnalysisResult | null {
  try {
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[ArticleAnalyzer] No JSON found in response');
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Markets categories for validation
    const MARKETS_CATEGORIES = ['us-markets', 'europe-markets', 'asia-markets', 'forex', 'crypto', 'bonds', 'etf'];
    const BUSINESS_CATEGORIES = ['economy', 'finance', 'health-science', 'real-estate', 'media', 'transportation', 'industrial', 'sports', 'tech', 'politics', 'consumption', 'opinion'];

    // Validate and normalize the response
    const suggestedCategories = validateArray(parsed.suggestedCategories, VALID_CATEGORIES as unknown as string[]);

    // Get dual categories - use explicit values or infer from suggestedCategories
    let suggestedMarketsCategory = parsed.suggestedMarketsCategory;
    if (!suggestedMarketsCategory || !MARKETS_CATEGORIES.includes(suggestedMarketsCategory)) {
      // Try to infer from suggestedCategories
      suggestedMarketsCategory = suggestedCategories.find(cat => MARKETS_CATEGORIES.includes(cat)) || 'us-markets';
    }

    let suggestedBusinessCategory = parsed.suggestedBusinessCategory;
    if (!suggestedBusinessCategory || !BUSINESS_CATEGORIES.includes(suggestedBusinessCategory)) {
      // Try to infer from suggestedCategories
      suggestedBusinessCategory = suggestedCategories.find(cat => BUSINESS_CATEGORIES.includes(cat)) || 'economy';
    }

    const result: ArticleAnalysisResult = {
      markets: validateArray(parsed.markets, VALID_MARKETS as unknown as string[]),
      primarySector: validateSector(parsed.primarySector),
      secondarySectors: validateArray(parsed.secondarySectors, VALID_SECTORS as unknown as string[]),
      subSectors: ensureStringArray(parsed.subSectors),
      industries: ensureStringArray(parsed.industries),
      primaryStock: validateStock(parsed.primaryStock),
      mentionedStocks: ensureStockArray(parsed.mentionedStocks),
      competitors: validateCompetitors(parsed.competitors),
      businessType: validateOption(parsed.businessType, VALID_BUSINESS_TYPES as unknown as string[]),
      sentiment: validateOption(parsed.sentiment, VALID_SENTIMENTS as unknown as string[]),
      impactLevel: validateOption(parsed.impactLevel, VALID_IMPACT_LEVELS as unknown as string[]),
      suggestedCategories,
      suggestedMarketsCategory,
      suggestedBusinessCategory,
      confidence: validateConfidence(parsed.confidence),
    };

    return result;
  } catch (error) {
    console.error('[ArticleAnalyzer] JSON parse error:', error);
    console.error('[ArticleAnalyzer] Raw content:', content.substring(0, 500));
    return null;
  }
}

/**
 * Validation helpers
 */
function validateArray(arr: unknown, validOptions: string[]): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.filter((item): item is string =>
    typeof item === 'string' && validOptions.includes(item)
  );
}

function validateSector(sector: unknown): string | null {
  if (typeof sector !== 'string') return null;
  const validSectors: string[] = [...VALID_SECTORS];
  return validSectors.includes(sector) ? sector : null;
}

function validateOption(option: unknown, validOptions: string[]): string | null {
  if (typeof option !== 'string') return null;
  return validOptions.includes(option) ? option : null;
}

function validateStock(stock: unknown): string | null {
  if (typeof stock !== 'string') return null;
  // Basic ticker validation: uppercase letters, 1-5 characters
  const cleaned = stock.toUpperCase().trim();
  return /^[A-Z]{1,5}$/.test(cleaned) ? cleaned : null;
}

function ensureStringArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.filter((item): item is string => typeof item === 'string');
}

function ensureStockArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((item): item is string => typeof item === 'string')
    .map(s => s.toUpperCase().trim())
    .filter(s => /^[A-Z]{1,5}$/.test(s));
}

function validateCompetitors(competitors: unknown): Record<string, string[]> {
  if (typeof competitors !== 'object' || competitors === null) return {};

  const result: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(competitors)) {
    const validKey = validateStock(key);
    if (validKey && Array.isArray(value)) {
      const validCompetitors = ensureStockArray(value);
      if (validCompetitors.length > 0) {
        result[validKey] = validCompetitors;
      }
    }
  }

  return result;
}

function validateConfidence(confidence: unknown): number {
  if (typeof confidence === 'number') {
    return Math.max(0, Math.min(1, confidence));
  }
  return 0.5; // Default confidence
}
