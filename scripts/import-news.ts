/**
 * Standalone News Import Script
 * Run with: npx ts-node scripts/import-news.ts
 * Or with Railway DB: DATABASE_URL="your-url" npx ts-node scripts/import-news.ts
 */

import { PrismaClient } from '@prisma/client';
import {
  fetchNewsFromNewsData,
  generateSlug,
  estimateReadTime,
  mapCategory,
  extractTickers,
  NewsDataArticle,
} from '../src/lib/newsdata';
import {
  rewriteArticleWithPerplexity,
  convertRewrittenToBlocks,
  delay,
} from '../src/lib/perplexity';

const prisma = new PrismaClient();

async function getAuthors() {
  const authors = await prisma.author.findMany({
    where: { name: { not: 'NewsData' } },
  });

  if (authors.length === 0) {
    throw new Error('No authors found in database. Please seed authors first.');
  }

  return authors;
}

function getAuthorForArticle(
  creator: string[] | null,
  allAuthors: { id: string; name: string }[]
): string {
  // If creator exists, try to find matching author in DB
  if (creator && creator.length > 0) {
    const creatorName = creator[0];
    const matchedAuthor = allAuthors.find(
      (a) => a.name.toLowerCase() === creatorName.toLowerCase()
    );
    if (matchedAuthor) {
      return matchedAuthor.id;
    }
  }

  // Pick a random author from DB
  const randomIndex = Math.floor(Math.random() * allAuthors.length);
  return allAuthors[randomIndex].id;
}

async function getCategoryId(categorySlug: string): Promise<string> {
  let category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
        slug: categorySlug,
        color: 'bg-blue-600',
      },
    });
  }

  return category.id;
}

async function getOrCreateTags(keywords: string[] | null): Promise<string[]> {
  if (!keywords || keywords.length === 0) {
    return [];
  }

  const limitedKeywords = keywords.slice(0, 5);
  const tagIds: string[] = [];

  for (const keyword of limitedKeywords) {
    const slug = keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    if (!slug) continue;

    let tag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (!tag) {
      tag = await prisma.tag.create({
        data: {
          name: keyword,
          slug,
        },
      });
    }

    tagIds.push(tag.id);
  }

  return tagIds;
}

async function articleExists(externalId: string): Promise<boolean> {
  const existing = await prisma.article.findUnique({
    where: { externalId },
    select: { id: true },
  });
  return !!existing;
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.article.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

async function importArticle(
  article: NewsDataArticle,
  authorId: string
): Promise<{ success: boolean; articleId?: string; error?: string; aiEnhanced?: boolean }> {
  try {
    if (await articleExists(article.article_id)) {
      return { success: false, error: 'Already imported' };
    }

    let title = article.title;
    let excerpt = article.description || article.title;
    let contentBlocks: object[];
    let metaDescription: string | null = null;
    let seoKeywords: string[] = [];
    let isAiEnhanced = false;
    let allTagKeywords = article.keywords || [];

    console.log(`[Import] Processing: "${article.title.substring(0, 60)}..."`);

    const rewritten = await rewriteArticleWithPerplexity(article.title, article.content);

    if (rewritten) {
      title = rewritten.rewrittenTitle;
      excerpt = rewritten.excerpt;
      contentBlocks = convertRewrittenToBlocks(rewritten.rewrittenContent);
      metaDescription = rewritten.metaDescription;
      seoKeywords = rewritten.seoKeywords;
      isAiEnhanced = true;
      allTagKeywords = [...new Set([...allTagKeywords, ...rewritten.suggestedTags])];
      console.log(`  ✓ AI-enhanced: "${title.substring(0, 60)}..."`);
    } else {
      console.log(`  → Using original content`);
      contentBlocks = [{ type: 'paragraph', content: article.description || article.title }];

      if (article.content) {
        const paragraphs = article.content.split(/\n\n+/);
        contentBlocks = paragraphs
          .map(p => p.trim())
          .filter(p => p.length > 0 && !p.toUpperCase().includes('ONLY AVAILABLE IN PAID PLANS'))
          .map(p => ({ type: 'paragraph', content: p }));
      }
    }

    const baseSlug = generateSlug(title);
    const slug = await ensureUniqueSlug(baseSlug);
    const categorySlug = mapCategory(article.category);
    const categoryId = await getCategoryId(categorySlug);
    const tagIds = await getOrCreateTags(allTagKeywords);
    const tickers = extractTickers(article.content, title);

    const newArticle = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content: contentBlocks,
        imageUrl: article.image_url || '/images/placeholder-news.jpg',
        publishedAt: new Date(article.pubDate),
        readTime: estimateReadTime(article.content),
        isFeatured: false,
        isBreaking: false,
        externalId: article.article_id,
        sourceUrl: article.link,
        relevantTickers: tickers,
        metaDescription,
        seoKeywords,
        isAiEnhanced,
        authorId,
        categoryId,
        tags: {
          connect: tagIds.map(id => ({ id })),
        },
      },
    });

    return { success: true, articleId: newArticle.id, aiEnhanced: isAiEnhanced };
  } catch (error) {
    console.error(`[Import] Failed:`, error);
    return { success: false, error: String(error) };
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('📰 News Import Script');
  console.log('='.repeat(60));
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log('');

  try {
    const authors = await getAuthors();
    console.log(`Found ${authors.length} authors for random assignment`);
    console.log('');

    console.log('Fetching news from NewsData.io...');
    const articles = await fetchNewsFromNewsData();
    console.log(`Found ${articles.length} articles`);
    console.log('');

    if (articles.length === 0) {
      console.log('No new articles to import.');
      return;
    }

    const results = {
      imported: 0,
      skipped: 0,
      errors: 0,
      aiEnhanced: 0,
    };

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const authorId = getAuthorForArticle(article.creator, authors);
      const authorName = authors.find(a => a.id === authorId)?.name || 'Unknown';
      console.log(`[${i + 1}/${articles.length}] (Author: ${authorName})`);

      const result = await importArticle(article, authorId);

      if (result.success) {
        results.imported++;
        if (result.aiEnhanced) results.aiEnhanced++;
      } else if (result.error === 'Already imported') {
        results.skipped++;
        console.log(`  ⏭ Skipped (duplicate)`);
      } else {
        results.errors++;
        console.log(`  ✗ Error: ${result.error}`);
      }

      // Delay between articles
      if (i < articles.length - 1 && result.success) {
        await delay(2000);
      }
    }

    console.log('');
    console.log('='.repeat(60));
    console.log('📊 Results:');
    console.log(`  Imported: ${results.imported} (${results.aiEnhanced} AI-enhanced)`);
    console.log(`  Skipped:  ${results.skipped}`);
    console.log(`  Errors:   ${results.errors}`);
    console.log('='.repeat(60));
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
