import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimitMiddleware } from "@/lib/rate-limit";
import { validateSearchParams, searchQuerySchema, validationErrorResponse } from "@/lib/validations";

export async function GET(request: NextRequest) {
  // Apply rate limiting for public search endpoint
  const rateLimitResponse = rateLimitMiddleware(request, 'public');
  if (rateLimitResponse) return rateLimitResponse;

  // Validate input
  const validation = validateSearchParams(request.nextUrl.searchParams, searchQuerySchema);
  if (!validation.success) {
    return validationErrorResponse(validation.error);
  }

  const { q: query, limit } = validation.data;

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ articles: [] });
  }

  try {
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        imageUrl: true,
        publishedAt: true,
        readTime: true,
        category: {
          select: {
            name: true,
            slug: true,
            color: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: Math.min(limit, 50), // Cap at 50 results
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search articles" },
      { status: 500 }
    );
  }
}
