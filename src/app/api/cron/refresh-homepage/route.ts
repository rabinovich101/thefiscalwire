import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const CRON_SECRET = process.env.CRON_SECRET;

/**
 * Refresh homepage zones with most recent articles
 * GET /api/cron/refresh-homepage
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const vercelCronHeader = request.headers.get('x-vercel-cron');

  const isAuthorized =
    vercelCronHeader === '1' ||
    authHeader === `Bearer ${CRON_SECRET}` ||
    (process.env.NODE_ENV === 'development' && !CRON_SECRET);

  if (!isAuthorized && CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('[Refresh Homepage] Starting...');

  try {
    // Fetch 18 most recent articles
    const recentArticles = await prisma.article.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 18,
      select: { id: true, slug: true, title: true }
    });

    if (recentArticles.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No articles found'
      }, { status: 404 });
    }

    const articleIds = recentArticles.map(a => a.id);

    // Zone configuration
    const zones = ["hero-featured", "article-grid", "trending-sidebar"];
    const zoneLimits: Record<string, number> = {
      "hero-featured": 4,
      "article-grid": 6,
      "trending-sidebar": 8
    };

    let articleIndex = 0;
    const results: string[] = [];

    for (const zoneSlug of zones) {
      const zone = await prisma.pageZone.findFirst({
        where: { zoneDefinition: { slug: zoneSlug } }
      });

      if (!zone) {
        results.push(`${zoneSlug}: not found`);
        continue;
      }

      // Clear existing placements
      await prisma.contentPlacement.deleteMany({
        where: { zoneId: zone.id }
      });

      // Add new placements
      const limit = zoneLimits[zoneSlug] || 4;
      let added = 0;
      for (let i = 0; i < limit && articleIndex < articleIds.length; i++) {
        await prisma.contentPlacement.create({
          data: {
            zoneId: zone.id,
            contentType: "ARTICLE",
            articleId: articleIds[articleIndex],
            position: i,
            isPinned: false,
          }
        });
        articleIndex++;
        added++;
      }
      results.push(`${zoneSlug}: ${added} articles`);
    }

    // Update breaking news
    const firstArticle = recentArticles[0];
    await prisma.breakingNews.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });
    await prisma.breakingNews.create({
      data: {
        isActive: true,
        headline: firstArticle.title,
        url: `/article/${firstArticle.slug}`
      }
    });

    console.log('[Refresh Homepage] Complete:', results);

    return NextResponse.json({
      success: true,
      message: 'Homepage refreshed',
      zones: results,
      breakingNews: firstArticle.title.substring(0, 50) + '...'
    });
  } catch (error) {
    console.error('[Refresh Homepage] Error:', error);
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}
