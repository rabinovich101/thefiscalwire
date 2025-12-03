import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { ActivityType, ActivityStatus } from '@prisma/client';

export async function GET(request: Request) {
  // Check admin authorization
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);

    // Parse query parameters
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const type = url.searchParams.get('type') as ActivityType | null;
    const status = url.searchParams.get('status') as ActivityStatus | null;
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // Build where clause
    const where: {
      type?: ActivityType;
      status?: ActivityStatus;
      createdAt?: { gte?: Date; lte?: Date };
    } = {};

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // Add one day to include the end date fully
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        where.createdAt.lte = end;
      }
    }

    // Get total count for pagination
    const total = await prisma.activityLog.count({ where });

    // Fetch logs with pagination
    const logs = await prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get stats for the dashboard
    const stats = await getActivityStats();

    return NextResponse.json({
      success: true,
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    console.error('[ActivityLogs] Failed to fetch logs:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// Get activity statistics
async function getActivityStats() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  // Today's stats
  const todayStats = await prisma.activityLog.groupBy({
    by: ['type'],
    where: { createdAt: { gte: today } },
    _count: { id: true },
    _sum: { count: true },
  });

  // Week's stats
  const weekStats = await prisma.activityLog.groupBy({
    by: ['type'],
    where: { createdAt: { gte: weekAgo } },
    _count: { id: true },
    _sum: { count: true },
  });

  // Error count today
  const errorsToday = await prisma.activityLog.count({
    where: {
      status: 'ERROR',
      createdAt: { gte: today },
    },
  });

  // Total imports today
  const importsToday = todayStats.find(s => s.type === 'IMPORT');
  const perplexityToday = todayStats.find(s => s.type === 'PERPLEXITY_API');
  const newsApiToday = todayStats.find(s => s.type === 'NEWS_API');

  return {
    today: {
      imports: importsToday?._sum.count || 0,
      perplexityCalls: perplexityToday?._sum.count || 0,
      newsApiCalls: newsApiToday?._count.id || 0,
      errors: errorsToday,
    },
    week: {
      imports: weekStats.find(s => s.type === 'IMPORT')?._sum.count || 0,
      perplexityCalls: weekStats.find(s => s.type === 'PERPLEXITY_API')?._sum.count || 0,
      newsApiCalls: weekStats.find(s => s.type === 'NEWS_API')?._count.id || 0,
    },
  };
}
