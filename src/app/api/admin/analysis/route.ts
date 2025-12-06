import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Force dynamic
export const dynamic = 'force-dynamic';

// Check if user is admin
async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

// GET - List all analyses with filtering
export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const sector = searchParams.get('sector');
    const stock = searchParams.get('stock');
    const sentiment = searchParams.get('sentiment');
    const businessType = searchParams.get('businessType');
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause
    const where: any = {};

    if (sector) {
      where.primarySector = sector;
    }
    if (stock) {
      where.mentionedStocks = { has: stock.toUpperCase() };
    }
    if (sentiment) {
      where.sentiment = sentiment;
    }
    if (businessType) {
      where.businessType = businessType;
    }

    const [analyses, total] = await Promise.all([
      prisma.articleAnalysis.findMany({
        where,
        include: {
          article: {
            select: {
              id: true,
              title: true,
              slug: true,
              publishedAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.articleAnalysis.count({ where }),
    ]);

    return NextResponse.json({
      analyses,
      pagination: {
        offset,
        limit,
        total,
        hasMore: offset + analyses.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching analyses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
}

// POST - Trigger re-analysis of an article
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { articleId } = body;

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // Get the article
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { analysis: true },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Import the analyzer
    const { analyzeArticleWithAI } = await import('@/lib/article-analyzer');

    // Get article content as string
    const contentBlocks = article.content as any[];
    const contentText = contentBlocks
      .filter((block: any) => block.type === 'paragraph')
      .map((block: any) => block.content)
      .join('\n\n');

    // Run analysis
    const analysisResult = await analyzeArticleWithAI(article.title, contentText);

    if (!analysisResult) {
      return NextResponse.json(
        { error: 'Analysis failed' },
        { status: 500 }
      );
    }

    // Update or create analysis
    const updatedAnalysis = await prisma.articleAnalysis.upsert({
      where: { articleId: article.id },
      create: {
        articleId: article.id,
        markets: analysisResult.markets,
        primarySector: analysisResult.primarySector,
        secondarySectors: analysisResult.secondarySectors,
        subSectors: analysisResult.subSectors,
        industries: analysisResult.industries,
        primaryStock: analysisResult.primaryStock,
        mentionedStocks: analysisResult.mentionedStocks,
        competitors: analysisResult.competitors,
        businessType: analysisResult.businessType,
        sentiment: analysisResult.sentiment,
        impactLevel: analysisResult.impactLevel,
        aiModel: 'sonar',
        confidence: analysisResult.confidence,
        rawResponse: analysisResult as object,
      },
      update: {
        markets: analysisResult.markets,
        primarySector: analysisResult.primarySector,
        secondarySectors: analysisResult.secondarySectors,
        subSectors: analysisResult.subSectors,
        industries: analysisResult.industries,
        primaryStock: analysisResult.primaryStock,
        mentionedStocks: analysisResult.mentionedStocks,
        competitors: analysisResult.competitors,
        businessType: analysisResult.businessType,
        sentiment: analysisResult.sentiment,
        impactLevel: analysisResult.impactLevel,
        confidence: analysisResult.confidence,
        rawResponse: analysisResult as object,
      },
    });

    // Also update article's relevantTickers
    if (analysisResult.mentionedStocks.length > 0) {
      await prisma.article.update({
        where: { id: article.id },
        data: { relevantTickers: analysisResult.mentionedStocks },
      });
    }

    return NextResponse.json({
      success: true,
      analysis: updatedAnalysis,
    });
  } catch (error) {
    console.error('Error re-analyzing article:', error);
    return NextResponse.json(
      { error: 'Failed to re-analyze article' },
      { status: 500 }
    );
  }
}
