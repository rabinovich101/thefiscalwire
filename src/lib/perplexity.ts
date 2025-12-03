/**
 * Perplexity AI Service
 * Researches topics and rewrites articles with SEO optimization
 */

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

// Use the Sonar model with web search capability
const MODEL = 'sonar';

export interface RewrittenArticle {
  rewrittenTitle: string;
  rewrittenContent: string;
  excerpt: string;
  metaDescription: string;
  seoKeywords: string[];
  suggestedTags: string[];
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

const SYSTEM_PROMPT = `You are a professional financial journalist and SEO expert for "The Fiscal Wire", a premium financial news platform. Your task is to research and rewrite articles to be more intelligent, comprehensive, and SEO-optimized.

IMPORTANT INSTRUCTIONS:
1. Research the topic thoroughly using your web search capability
2. Write original, professional content - NOT a copy of the original
3. Use a professional, authoritative tone suitable for financial news
4. Include relevant facts, data, and context from your research
5. Optimize for SEO by naturally including relevant keywords
6. Structure the article with clear paragraphs

You MUST respond with valid JSON in this exact format:
{
  "rewrittenTitle": "An SEO-optimized, engaging headline",
  "rewrittenContent": "The full article content as a single string with \\n\\n for paragraph breaks. Write 4-6 substantial paragraphs.",
  "excerpt": "A compelling 1-2 sentence summary for preview cards (max 200 chars)",
  "metaDescription": "SEO meta description (max 160 chars)",
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "suggestedTags": ["tag1", "tag2", "tag3"]
}

ONLY output the JSON object, no other text.`;

/**
 * Rewrite an article using Perplexity AI with web search
 */
export async function rewriteArticleWithPerplexity(
  title: string,
  originalContent: string | null
): Promise<RewrittenArticle | null> {
  if (!PERPLEXITY_API_KEY) {
    console.error('[Perplexity] API key not configured');
    return null;
  }

  const userPrompt = `Research and rewrite this financial news article:

TITLE: ${title}

ORIGINAL CONTENT:
${originalContent || 'No content provided - research based on the title'}

Instructions:
- Research this topic to get the latest information and context
- Write a comprehensive, original article (not a summary)
- Include relevant market data, company info, or economic context
- Make it engaging and informative for investors and traders
- Ensure SEO optimization with relevant financial keywords

Respond with ONLY the JSON object as specified.`;

  const messages: PerplexityMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
  ];

  try {
    console.log(`[Perplexity] Rewriting article: "${title.substring(0, 50)}..."`);

    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Perplexity] API error: ${response.status} - ${errorText}`);
      return null;
    }

    const data: PerplexityResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      console.error('[Perplexity] No response choices received');
      return null;
    }

    const content = data.choices[0].message.content;
    console.log(`[Perplexity] Received response (${data.usage?.total_tokens || 0} tokens)`);

    // Parse the JSON response
    const result = parsePerplexityResponse(content);

    if (!result) {
      console.error('[Perplexity] Failed to parse response');
      return null;
    }

    console.log(`[Perplexity] Successfully rewrote: "${result.rewrittenTitle.substring(0, 50)}..."`);
    return result;
  } catch (error) {
    console.error('[Perplexity] Error:', error);
    return null;
  }
}

/**
 * Parse the JSON response from Perplexity
 */
function parsePerplexityResponse(content: string): RewrittenArticle | null {
  try {
    // Try to extract JSON from the response (in case there's extra text)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[Perplexity] No JSON found in response');
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!parsed.rewrittenTitle || !parsed.rewrittenContent) {
      console.error('[Perplexity] Missing required fields in response');
      return null;
    }

    return {
      rewrittenTitle: parsed.rewrittenTitle,
      rewrittenContent: parsed.rewrittenContent,
      excerpt: parsed.excerpt || parsed.rewrittenContent.substring(0, 200),
      metaDescription: parsed.metaDescription || parsed.excerpt || '',
      seoKeywords: Array.isArray(parsed.seoKeywords) ? parsed.seoKeywords : [],
      suggestedTags: Array.isArray(parsed.suggestedTags) ? parsed.suggestedTags : [],
    };
  } catch (error) {
    console.error('[Perplexity] JSON parse error:', error);
    console.error('[Perplexity] Raw content:', content.substring(0, 500));
    return null;
  }
}

/**
 * Convert rewritten content to article content blocks
 */
export function convertRewrittenToBlocks(content: string): object[] {
  const blocks: object[] = [];
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

  return blocks;
}

/**
 * Add delay between API calls to avoid rate limiting
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
