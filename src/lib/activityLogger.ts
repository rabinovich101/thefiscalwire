import prisma from './prisma';
import { ActivityType, ActivityStatus, Prisma } from '@prisma/client';

// Types for logging details
interface ImportDetails {
  source: string;
  category?: string;
  imported: number;
  skipped: number;
  errors: number;
  aiEnhanced: number;
  articles?: Array<{ title: string; status: string }>;
}

interface PerplexityDetails {
  articleTitle?: string;
  tokensUsed?: number;
  model: string;
  success: boolean;
}

interface NewsApiDetails {
  endpoint: string;
  query?: string;
  resultsCount: number;
  filteredCount: number;
}

interface ErrorDetails {
  source: string;
  operation: string;
  stack?: string;
}

// Generic log activity function
export async function logActivity({
  type,
  action,
  details,
  count,
  status,
  errorMessage,
}: {
  type: ActivityType;
  action: string;
  details?: Prisma.InputJsonValue;
  count?: number;
  status: ActivityStatus;
  errorMessage?: string;
}) {
  try {
    return await prisma.activityLog.create({
      data: {
        type,
        action,
        details: details ?? Prisma.JsonNull,
        count,
        status,
        errorMessage,
      },
    });
  } catch (error) {
    console.error('[ActivityLogger] Failed to log activity:', error);
    return null;
  }
}

// Log article import completion
export async function logImport(details: ImportDetails) {
  const status = details.errors > 0 ? 'WARNING' : 'SUCCESS';
  const action = `Imported ${details.imported} articles from ${details.source}`;

  return logActivity({
    type: 'IMPORT',
    action,
    details: JSON.parse(JSON.stringify(details)),
    count: details.imported,
    status: status as ActivityStatus,
    errorMessage: details.errors > 0 ? `${details.errors} articles failed to import` : undefined,
  });
}

// Log Perplexity API usage
export async function logPerplexityUsage(details: PerplexityDetails) {
  const action = details.success
    ? `Rewrote article: ${details.articleTitle?.substring(0, 50)}...`
    : `Failed to rewrite article: ${details.articleTitle?.substring(0, 50)}...`;

  return logActivity({
    type: 'PERPLEXITY_API',
    action,
    details: JSON.parse(JSON.stringify(details)),
    count: 1,
    status: details.success ? 'SUCCESS' : 'ERROR',
    errorMessage: details.success ? undefined : 'Perplexity API call failed',
  });
}

// Log NewsData.io API usage
export async function logNewsApiUsage(details: NewsApiDetails) {
  const action = `Fetched ${details.resultsCount} articles from NewsData.io (${details.filteredCount} relevant)`;

  return logActivity({
    type: 'NEWS_API',
    action,
    details: JSON.parse(JSON.stringify(details)),
    count: details.resultsCount,
    status: 'SUCCESS',
  });
}

// Log errors
export async function logError(details: ErrorDetails, errorMessage: string) {
  const action = `Error in ${details.source}: ${details.operation}`;

  return logActivity({
    type: 'ERROR',
    action,
    details: JSON.parse(JSON.stringify(details)),
    status: 'ERROR',
    errorMessage,
  });
}

// Log system events
export async function logSystemEvent(action: string, details?: Prisma.InputJsonValue) {
  return logActivity({
    type: 'SYSTEM',
    action,
    details,
    status: 'INFO',
  });
}

// Batch log for Perplexity API calls (summary at end of import)
export async function logPerplexityBatch({
  totalCalls,
  successfulCalls,
  failedCalls,
}: {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
}) {
  const status = failedCalls > 0 ? 'WARNING' : 'SUCCESS';
  const action = `Perplexity API batch: ${successfulCalls}/${totalCalls} successful rewrites`;

  return logActivity({
    type: 'PERPLEXITY_API',
    action,
    details: { totalCalls, successfulCalls, failedCalls },
    count: totalCalls,
    status: status as ActivityStatus,
    errorMessage: failedCalls > 0 ? `${failedCalls} API calls failed` : undefined,
  });
}
