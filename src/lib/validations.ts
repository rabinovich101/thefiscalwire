import { z } from 'zod';

// ============================================================================
// Common schemas
// ============================================================================

export const paginationSchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  page: z.coerce.number().int().min(1).default(1),
});

export const idSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

// ============================================================================
// Search schemas
// ============================================================================

export const searchQuerySchema = z.object({
  q: z.string().min(2, 'Search query must be at least 2 characters').max(200),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const stockSearchSchema = z.object({
  q: z.string().min(1, 'Search query is required').max(50),
});

// ============================================================================
// Article schemas
// ============================================================================

export const articleQuerySchema = z.object({
  category: z.string().optional(),
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(8),
  // Analysis filters
  sector: z.string().optional(),
  stock: z.string().optional(),
  market: z.string().optional(),
  sentiment: z.enum(['positive', 'negative', 'neutral']).optional(),
  businessType: z.string().optional(),
});

export const articleCreateSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(500),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(1000),
  content: z.array(z.object({
    type: z.string(),
    content: z.string().optional(),
    level: z.number().optional(),
    symbol: z.string().optional(),
    items: z.array(z.string()).optional(),
    url: z.string().optional(),
    alt: z.string().optional(),
    caption: z.string().optional(),
  })),
  imageUrl: z.string().url('Invalid image URL').optional(),
  categoryId: z.string().uuid('Invalid category ID'),
  authorId: z.string().uuid('Invalid author ID'),
  isFeatured: z.boolean().default(false),
  isBreaking: z.boolean().default(false),
  relevantTickers: z.array(z.string()).optional(),
  metaDescription: z.string().max(500).optional(),
  seoKeywords: z.array(z.string()).optional(),
});

export const articleUpdateSchema = articleCreateSchema.partial();

// ============================================================================
// Category schemas
// ============================================================================

export const categoryCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  color: z.string().regex(/^bg-[a-z]+-\d{3}$/, 'Invalid color format (e.g., bg-blue-600)').optional(),
  description: z.string().max(500).optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

// ============================================================================
// Author schemas
// ============================================================================

export const authorCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  bio: z.string().max(1000).optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  email: z.string().email('Invalid email').optional(),
  twitter: z.string().max(100).optional(),
  linkedin: z.string().url('Invalid LinkedIn URL').optional(),
});

export const authorUpdateSchema = authorCreateSchema.partial();

// ============================================================================
// Auth schemas
// ============================================================================

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

// ============================================================================
// User profile schemas
// ============================================================================

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  image: z.string().url('Invalid image URL').optional(),
});

// ============================================================================
// Market/Stock schemas
// ============================================================================

export const stockSymbolSchema = z.object({
  symbol: z.string().min(1).max(10).toUpperCase(),
});

export const chartPeriodSchema = z.object({
  period: z.enum(['1d', '5d', '1mo', '3mo', '6mo', '1y']).default('1mo'),
});

export const marketQuotesSchema = z.object({
  symbols: z.string().transform(val => val.split(',')).pipe(
    z.array(z.string().min(1).max(10)).min(1).max(50)
  ),
});

// ============================================================================
// Page Builder schemas
// ============================================================================

export const pageCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  layoutId: z.string().uuid('Invalid layout ID').optional(),
  isActive: z.boolean().default(true),
});

export const pageUpdateSchema = pageCreateSchema.partial();

export const zoneCreateSchema = z.object({
  zoneDefinitionId: z.string().uuid('Invalid zone definition ID'),
  order: z.number().int().min(0).default(0),
});

export const placementCreateSchema = z.object({
  articleId: z.string().uuid('Invalid article ID').optional(),
  order: z.number().int().min(0),
  isPinned: z.boolean().default(false),
  expiresAt: z.string().datetime().optional(),
});

export const placementUpdateSchema = placementCreateSchema.partial();

export const reorderPlacementsSchema = z.object({
  placements: z.array(z.object({
    id: z.string().uuid('Invalid placement ID'),
    order: z.number().int().min(0),
  })),
});

// ============================================================================
// Cron import schemas
// ============================================================================

export const cronCategorySchema = z.object({
  category: z.string().min(1, 'Category is required'),
});

// ============================================================================
// Type exports
// ============================================================================

export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
export type ArticleQueryInput = z.infer<typeof articleQuerySchema>;
export type ArticleCreateInput = z.infer<typeof articleCreateSchema>;
export type ArticleUpdateInput = z.infer<typeof articleUpdateSchema>;
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
export type AuthorCreateInput = z.infer<typeof authorCreateSchema>;
export type AuthorUpdateInput = z.infer<typeof authorUpdateSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type StockSymbolInput = z.infer<typeof stockSymbolSchema>;
export type ChartPeriodInput = z.infer<typeof chartPeriodSchema>;
export type MarketQuotesInput = z.infer<typeof marketQuotesSchema>;
export type PageCreateInput = z.infer<typeof pageCreateSchema>;
export type PageUpdateInput = z.infer<typeof pageUpdateSchema>;
export type ZoneCreateInput = z.infer<typeof zoneCreateSchema>;
export type PlacementCreateInput = z.infer<typeof placementCreateSchema>;
export type PlacementUpdateInput = z.infer<typeof placementUpdateSchema>;
export type ReorderPlacementsInput = z.infer<typeof reorderPlacementsSchema>;

// ============================================================================
// Validation helpers
// ============================================================================

/** Safe parse result type */
type SafeParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: z.ZodError };

/**
 * Validate search params from NextRequest
 */
export function validateSearchParams<T extends z.ZodType>(
  searchParams: URLSearchParams,
  schema: T
): SafeParseResult<z.infer<T>> {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return schema.safeParse(params) as SafeParseResult<z.infer<T>>;
}

/**
 * Validate request body
 */
export async function validateBody<T extends z.ZodType>(
  request: Request,
  schema: T
): Promise<SafeParseResult<z.infer<T>>> {
  try {
    const body = await request.json();
    return schema.safeParse(body) as SafeParseResult<z.infer<T>>;
  } catch {
    return {
      success: false,
      error: new z.ZodError([{
        code: 'custom',
        message: 'Invalid JSON body',
        path: [],
      }]),
    };
  }
}

/**
 * Create a validation error response
 */
export function validationErrorResponse(error: z.ZodError): Response {
  // Zod v4 uses .issues instead of .errors
  const issues = error.issues || [];
  const formattedErrors = issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));

  return new Response(
    JSON.stringify({
      error: 'Validation failed',
      details: formattedErrors,
    }),
    {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
