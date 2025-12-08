/**
 * Category Page Mismatch Detection Tests
 *
 * This test suite verifies that dedicated category pages query for the correct
 * category slugs that exist in the database.
 *
 * ISSUE FIXED:
 * The following pages were fixed to use correct category slugs:
 * 1. /consumption now queries 'consumption' (was 'consumer')
 * 2. /crypto now queries 'crypto' (was 'crypto-markets')
 * 3. /health-science now queries 'health-science' (was 'healthcare')
 * 4. /tech now queries 'tech' (was 'technology')
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

// Database category slugs (as defined in seed.ts)
const DATABASE_CATEGORY_SLUGS = [
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
] as const

type ValidCategorySlug = (typeof DATABASE_CATEGORY_SLUGS)[number]

// Expected page to slug mappings (what they SHOULD be)
interface PageSlugMapping {
  pagePath: string
  pageUrl: string
  expectedSlug: ValidCategorySlug
  actualSlugQueried: string
  isMismatched: boolean
}

// Helper to read page file and extract the category slug being queried
function extractCategorySlugFromPage(pageContent: string): string | null {
  // Look for getCategoryArticlesWithPlacements("slug") pattern (newer)
  // or getArticlesByCategory("slug") pattern (older)
  const newMatch = pageContent.match(/getCategoryArticlesWithPlacements\s*\(\s*["']([^"']+)["']/);
  if (newMatch) return newMatch[1];

  const oldMatch = pageContent.match(/getArticlesByCategory\s*\(\s*["']([^"']+)["']/);
  return oldMatch ? oldMatch[1] : null;
}

// Helper to check if a slug exists in database
function isValidDatabaseSlug(slug: string): boolean {
  return DATABASE_CATEGORY_SLUGS.includes(slug as ValidCategorySlug);
}

describe('Category Page Mismatch Detection', () => {
  // __dirname is src/__tests__/lib, so we need 3 levels up to get to project root
  const projectRoot = path.resolve(__dirname, '../../..');
  const appDir = path.join(projectRoot, 'src/app');

  describe('Database Category Slugs Validation', () => {
    it('should have all expected category slugs in the database list', () => {
      // These are the categories created in seed.ts
      expect(DATABASE_CATEGORY_SLUGS).toContain('crypto');
      expect(DATABASE_CATEGORY_SLUGS).toContain('consumption');
      expect(DATABASE_CATEGORY_SLUGS).toContain('health-science');
      expect(DATABASE_CATEGORY_SLUGS).toContain('tech');
    });

    it('should NOT have misnamed slugs in the database list', () => {
      // These are the WRONG slugs that pages are currently using
      expect(DATABASE_CATEGORY_SLUGS).not.toContain('crypto-markets');
      expect(DATABASE_CATEGORY_SLUGS).not.toContain('consumer');
      expect(DATABASE_CATEGORY_SLUGS).not.toContain('healthcare');
      expect(DATABASE_CATEGORY_SLUGS).not.toContain('technology');
    });
  });

  describe('Consumption Page (/consumption)', () => {
    const pageFile = path.join(appDir, 'consumption/page.tsx');

    it('should query for "consumption" category slug', () => {
      const content = fs.readFileSync(pageFile, 'utf-8');
      const queriedSlug = extractCategorySlugFromPage(content);
      expect(queriedSlug).toBe('consumption');
    });

    it('slug "consumer" does NOT exist in database', () => {
      expect(isValidDatabaseSlug('consumer')).toBe(false);
    });

    it('slug "consumption" EXISTS in database', () => {
      expect(isValidDatabaseSlug('consumption')).toBe(true);
    });
  });

  describe('Crypto Page (/crypto)', () => {
    const pageFile = path.join(appDir, 'crypto/page.tsx');

    it('should query for "crypto" category slug', () => {
      const content = fs.readFileSync(pageFile, 'utf-8');
      const queriedSlug = extractCategorySlugFromPage(content);
      expect(queriedSlug).toBe('crypto');
    });

    it('slug "crypto-markets" does NOT exist in database', () => {
      expect(isValidDatabaseSlug('crypto-markets')).toBe(false);
    });

    it('slug "crypto" EXISTS in database', () => {
      expect(isValidDatabaseSlug('crypto')).toBe(true);
    });
  });

  describe('Health & Science Page (/health-science)', () => {
    const pageFile = path.join(appDir, 'health-science/page.tsx');

    it('should query for "health-science" category slug', () => {
      const content = fs.readFileSync(pageFile, 'utf-8');
      const queriedSlug = extractCategorySlugFromPage(content);
      expect(queriedSlug).toBe('health-science');
    });

    it('slug "healthcare" does NOT exist in database', () => {
      expect(isValidDatabaseSlug('healthcare')).toBe(false);
    });

    it('slug "health-science" EXISTS in database', () => {
      expect(isValidDatabaseSlug('health-science')).toBe(true);
    });
  });

  describe('Tech Page (/tech)', () => {
    const pageFile = path.join(appDir, 'tech/page.tsx');

    it('should query for "tech" category slug', () => {
      const content = fs.readFileSync(pageFile, 'utf-8');
      const queriedSlug = extractCategorySlugFromPage(content);
      expect(queriedSlug).toBe('tech');
    });

    it('slug "technology" does NOT exist in database', () => {
      expect(isValidDatabaseSlug('technology')).toBe(false);
    });

    it('slug "tech" EXISTS in database', () => {
      expect(isValidDatabaseSlug('tech')).toBe(true);
    });
  });

  describe('All Dedicated Category Pages Consistency Check', () => {
    // List of all dedicated category pages in the app
    const dedicatedCategoryPages = [
      { folder: 'consumption', expectedSlug: 'consumption' },
      { folder: 'crypto', expectedSlug: 'crypto' },
      { folder: 'economy', expectedSlug: 'economy' },
      { folder: 'health-science', expectedSlug: 'health-science' },
      { folder: 'industrial', expectedSlug: 'industrial' },
      { folder: 'opinion', expectedSlug: 'opinion' },
      { folder: 'politics', expectedSlug: 'politics' },
      { folder: 'real-estate', expectedSlug: 'real-estate' },
      { folder: 'sports', expectedSlug: 'sports' },
      { folder: 'tech', expectedSlug: 'tech' },
      { folder: 'transportation', expectedSlug: 'transportation' },
    ];

    it.each(dedicatedCategoryPages)(
      'page folder "$folder" should query for slug "$expectedSlug"',
      ({ folder, expectedSlug }) => {
        const pageFile = path.join(appDir, folder, 'page.tsx');

        if (!fs.existsSync(pageFile)) {
          // Skip if page doesn't exist
          return;
        }

        const content = fs.readFileSync(pageFile, 'utf-8');
        const queriedSlug = extractCategorySlugFromPage(content);

        expect(queriedSlug).toBe(expectedSlug);
      }
    );

    it('should find all mismatched pages', () => {
      const mismatches: Array<{ folder: string; expected: string; actual: string | null }> = [];

      for (const { folder, expectedSlug } of dedicatedCategoryPages) {
        const pageFile = path.join(appDir, folder, 'page.tsx');

        if (!fs.existsSync(pageFile)) {
          continue;
        }

        const content = fs.readFileSync(pageFile, 'utf-8');
        const queriedSlug = extractCategorySlugFromPage(content);

        if (queriedSlug !== expectedSlug) {
          mismatches.push({
            folder,
            expected: expectedSlug,
            actual: queriedSlug,
          });
        }
      }

      // Document any remaining mismatches
      console.log('Detected mismatches:', JSON.stringify(mismatches, null, 2));

      // After fixes, we expect 0 mismatches
      expect(mismatches).toHaveLength(0);
    });
  });

  describe('Dynamic Category Route (/category/[slug])', () => {
    const dynamicPageFile = path.join(appDir, 'category/[slug]/page.tsx');

    it('dynamic route should exist', () => {
      expect(fs.existsSync(dynamicPageFile)).toBe(true);
    });

    it('dynamic route should use the slug parameter directly', () => {
      const content = fs.readFileSync(dynamicPageFile, 'utf-8');

      // The dynamic route should call getCategoryArticlesWithPlacements or getArticlesByCategory with the slug from params
      // Look for pattern: getCategoryArticlesWithPlacements(slug, or getArticlesByCategory(slug,
      const usesNewFunction = content.includes('getCategoryArticlesWithPlacements(slug');
      const usesOldFunction = content.includes('getArticlesByCategory(slug');

      expect(usesNewFunction || usesOldFunction).toBe(true);
    });

    it('dynamic route should call getCategoryBySlug with the slug parameter', () => {
      const content = fs.readFileSync(dynamicPageFile, 'utf-8');

      // Should use getCategoryBySlug(slug) to validate the category exists
      const usesCategoryLookup = content.includes('getCategoryBySlug(slug)');

      expect(usesCategoryLookup).toBe(true);
    });
  });

  describe('LoadMoreArticles Component Consistency', () => {
    it('consumption page passes consistent category to LoadMoreArticles', () => {
      const pageFile = path.join(appDir, 'consumption/page.tsx');
      const content = fs.readFileSync(pageFile, 'utf-8');

      // Extract both the query slug and the LoadMoreArticles category prop
      const querySlug = extractCategorySlugFromPage(content);

      // Look for category="X" in LoadMoreArticles
      const loadMoreMatch = content.match(/LoadMoreArticles[\s\S]*?category=["']([^"']+)["']/);
      const loadMoreCategory = loadMoreMatch ? loadMoreMatch[1] : null;

      // Both should match (though both are currently wrong)
      expect(querySlug).toBe(loadMoreCategory);
    });

    it('crypto page passes consistent category to LoadMoreArticles', () => {
      const pageFile = path.join(appDir, 'crypto/page.tsx');
      const content = fs.readFileSync(pageFile, 'utf-8');

      const querySlug = extractCategorySlugFromPage(content);
      const loadMoreMatch = content.match(/LoadMoreArticles[\s\S]*?category=["']([^"']+)["']/);
      const loadMoreCategory = loadMoreMatch ? loadMoreMatch[1] : null;

      expect(querySlug).toBe(loadMoreCategory);
    });

    it('health-science page passes consistent category to LoadMoreArticles', () => {
      const pageFile = path.join(appDir, 'health-science/page.tsx');
      const content = fs.readFileSync(pageFile, 'utf-8');

      const querySlug = extractCategorySlugFromPage(content);
      const loadMoreMatch = content.match(/LoadMoreArticles[\s\S]*?category=["']([^"']+)["']/);
      const loadMoreCategory = loadMoreMatch ? loadMoreMatch[1] : null;

      expect(querySlug).toBe(loadMoreCategory);
    });

    it('tech page passes consistent category to LoadMoreArticles', () => {
      const pageFile = path.join(appDir, 'tech/page.tsx');
      const content = fs.readFileSync(pageFile, 'utf-8');

      const querySlug = extractCategorySlugFromPage(content);
      const loadMoreMatch = content.match(/LoadMoreArticles[\s\S]*?category=["']([^"']+)["']/);
      const loadMoreCategory = loadMoreMatch ? loadMoreMatch[1] : null;

      expect(querySlug).toBe(loadMoreCategory);
    });
  });

  describe('Data Layer Function Validation', () => {
    it('categoryColors map should have entry for "consumption" not "consumer"', () => {
      // Read data.ts to check categoryColors
      const dataFile = path.join(projectRoot, 'src/lib/data.ts');
      const content = fs.readFileSync(dataFile, 'utf-8');

      expect(content).toContain("'consumption':");
      expect(content).not.toContain("'consumer':");
    });

    it('categoryColors map should have entry for "crypto" not "crypto-markets"', () => {
      const dataFile = path.join(projectRoot, 'src/lib/data.ts');
      const content = fs.readFileSync(dataFile, 'utf-8');

      expect(content).toContain("'crypto':");
      // Note: crypto-markets might exist for a different purpose, but primary should be crypto
    });

    it('categoryColors map should have entry for "health-science" not "healthcare"', () => {
      const dataFile = path.join(projectRoot, 'src/lib/data.ts');
      const content = fs.readFileSync(dataFile, 'utf-8');

      expect(content).toContain("'health-science':");
      expect(content).not.toContain("'healthcare':");
    });

    it('categoryColors map should have entry for "tech" not "technology"', () => {
      const dataFile = path.join(projectRoot, 'src/lib/data.ts');
      const content = fs.readFileSync(dataFile, 'utf-8');

      expect(content).toContain("'tech':");
      expect(content).not.toContain("'technology':");
    });
  });
});

describe('getArticlesByCategory Function Behavior', () => {
  // Mock prisma for unit testing the data layer behavior
  vi.mock('@/lib/prisma', () => ({
    default: {
      article: {
        findMany: vi.fn(),
        count: vi.fn(),
      },
      category: {
        findUnique: vi.fn(),
      },
    },
  }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Query Structure Validation', () => {
    it('should query using PRIMARY category relation for correct badge display', async () => {
      // Read data.ts and verify the query structure
      const projectRoot = path.resolve(__dirname, '../../..');
      const dataFile = path.join(projectRoot, 'src/lib/data.ts');
      const content = fs.readFileSync(dataFile, 'utf-8');

      // The query should use: category: { slug: categorySlug }
      // This ensures articles displayed on category pages show the correct category badge
      expect(content).toContain('category: { slug: categorySlug }');
    });

    it('getArticleCountByCategory should use PRIMARY category for accurate count', async () => {
      const projectRoot = path.resolve(__dirname, '../../..');
      const dataFile = path.join(projectRoot, 'src/lib/data.ts');
      const content = fs.readFileSync(dataFile, 'utf-8');

      // Find the getArticleCountByCategory function and verify it uses PRIMARY category
      const functionMatch = content.match(/getArticleCountByCategory[\s\S]*?return prisma\.article\.count\(\{[\s\S]*?\}\)/);

      expect(functionMatch).not.toBeNull();
      if (functionMatch) {
        // Should use primary category relation, not many-to-many
        expect(functionMatch[0]).toContain('category:');
        expect(functionMatch[0]).not.toContain('categories:');
      }
    });
  });
});

describe('Impact Analysis', () => {
  it('should document which pages will show 0 articles due to mismatch', () => {
    const impactedPages = [
      {
        url: '/consumption',
        queriedSlug: 'consumer',
        correctSlug: 'consumption',
        impact: 'Shows 0 articles because "consumer" category does not exist',
      },
      {
        url: '/crypto',
        queriedSlug: 'crypto-markets',
        correctSlug: 'crypto',
        impact: 'Shows 0 articles because "crypto-markets" category does not exist',
      },
      {
        url: '/health-science',
        queriedSlug: 'healthcare',
        correctSlug: 'health-science',
        impact: 'Shows 0 articles because "healthcare" category does not exist',
      },
      {
        url: '/tech',
        queriedSlug: 'technology',
        correctSlug: 'tech',
        impact: 'Shows 0 articles because "technology" category does not exist',
      },
    ];

    console.log('\n========================================');
    console.log('CATEGORY PAGE MISMATCH IMPACT ANALYSIS');
    console.log('========================================\n');

    for (const page of impactedPages) {
      console.log(`Page: ${page.url}`);
      console.log(`  Queries for: "${page.queriedSlug}"`);
      console.log(`  Should query: "${page.correctSlug}"`);
      console.log(`  Impact: ${page.impact}`);
      console.log('');
    }

    console.log('RECOMMENDED FIX:');
    console.log('Update each page to use the correct category slug:');
    console.log('  /consumption: consumer -> consumption');
    console.log('  /crypto: crypto-markets -> crypto');
    console.log('  /health-science: healthcare -> health-science');
    console.log('  /tech: technology -> tech');
    console.log('========================================\n');

    expect(impactedPages).toHaveLength(4);
  });
});
