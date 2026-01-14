/**
 * Article Duplicate Detection Utility
 *
 * Checks if an article already exists in the database to prevent duplicates.
 */

import prisma from "@/lib/prisma";
import { areTitlesSimilar, generateSlug } from "./fiscalwire";

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  reason?: string;
  existingArticle?: {
    id: string;
    slug: string;
    title: string;
    publishedAt: Date;
  };
}

/**
 * Check if an article with similar content already exists
 *
 * Checks for:
 * 1. Exact slug match
 * 2. Exact externalId match (for imported articles)
 * 3. Similar title (60%+ word overlap)
 */
export async function checkForDuplicateArticle(
  title: string,
  options?: {
    externalId?: string;
    slug?: string;
    daysToCheck?: number; // Only check articles from last N days
  }
): Promise<DuplicateCheckResult> {
  const { externalId, slug, daysToCheck = 7 } = options || {};

  // Calculate date cutoff
  const dateCutoff = new Date();
  dateCutoff.setDate(dateCutoff.getDate() - daysToCheck);

  // 1. Check by externalId (exact match)
  if (externalId) {
    const existingByExternalId = await prisma.article.findUnique({
      where: { externalId },
      select: { id: true, slug: true, title: true, publishedAt: true },
    });

    if (existingByExternalId) {
      return {
        isDuplicate: true,
        reason: `Article with externalId "${externalId}" already exists`,
        existingArticle: existingByExternalId,
      };
    }
  }

  // 2. Check by slug (exact match)
  const articleSlug = slug || generateSlug(title);
  const existingBySlug = await prisma.article.findUnique({
    where: { slug: articleSlug },
    select: { id: true, slug: true, title: true, publishedAt: true },
  });

  if (existingBySlug) {
    return {
      isDuplicate: true,
      reason: `Article with slug "${articleSlug}" already exists`,
      existingArticle: existingBySlug,
    };
  }

  // 3. Check for similar titles in recent articles
  const recentArticles = await prisma.article.findMany({
    where: {
      publishedAt: { gte: dateCutoff },
    },
    select: { id: true, slug: true, title: true, publishedAt: true },
    orderBy: { publishedAt: "desc" },
    take: 500, // Check last 500 recent articles
  });

  for (const article of recentArticles) {
    if (areTitlesSimilar(title, article.title)) {
      return {
        isDuplicate: true,
        reason: `Similar article already exists: "${article.title}"`,
        existingArticle: article,
      };
    }
  }

  // No duplicate found
  return { isDuplicate: false };
}

/**
 * Filter out duplicate topics from a list of news items
 *
 * @param items Array of items with title property
 * @param daysToCheck Number of days to look back for duplicates
 * @returns Filtered array with duplicates removed
 */
export async function filterDuplicateTopics<T extends { title: string }>(
  items: T[],
  daysToCheck: number = 7
): Promise<{ item: T; isDuplicate: boolean; reason?: string }[]> {
  const results: { item: T; isDuplicate: boolean; reason?: string }[] = [];

  for (const item of items) {
    const check = await checkForDuplicateArticle(item.title, { daysToCheck });
    results.push({
      item,
      isDuplicate: check.isDuplicate,
      reason: check.reason,
    });
  }

  return results;
}
