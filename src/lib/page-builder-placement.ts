import prisma from "@/lib/prisma";

// Zone types that display articles
const ARTICLE_ZONE_TYPES = [
  "ARTICLE_GRID",
  "ARTICLE_LIST",
  "HERO_FEATURED",
  "HERO_SECONDARY",
  "TRENDING_SIDEBAR",
];

/**
 * Automatically adds a new article to the TOP of ALL article zones for:
 * 1. Homepage
 * 2. The article's Markets category page
 * 3. The article's Business category page
 *
 * Articles are added at position 0 (top), and existing placements are shifted down.
 * Articles remain unpinned so they can be manually reordered later.
 */
export async function addArticleToPageBuilderZones(
  articleId: string,
  marketsCategoryId: string,
  businessCategoryId: string
): Promise<void> {
  try {
    // Find all relevant pages:
    // 1. Homepage (pageType: HOMEPAGE)
    // 2. Markets category page (categoryId matches marketsCategoryId)
    // 3. Business category page (categoryId matches businessCategoryId)
    const pages = await prisma.pageDefinition.findMany({
      where: {
        isActive: true,
        OR: [
          { pageType: "HOMEPAGE" },
          { pageType: "CATEGORY", categoryId: marketsCategoryId },
          { pageType: "CATEGORY", categoryId: businessCategoryId },
        ],
      },
      include: {
        zones: {
          where: { isEnabled: true },
          include: {
            zoneDefinition: {
              select: { zoneType: true, name: true },
            },
          },
        },
      },
    });

    if (pages.length === 0) {
      console.log("[PageBuilder] No active pages found for article placement");
      return;
    }

    for (const page of pages) {
      // Find ALL zones that display articles on this page
      const articleZones = page.zones.filter((zone) =>
        ARTICLE_ZONE_TYPES.includes(zone.zoneDefinition.zoneType)
      );

      if (articleZones.length === 0) {
        console.log(`[PageBuilder] No article zones found for page: ${page.name}`);
        continue;
      }

      // Add article to each zone on this page
      for (const zone of articleZones) {
        // Check if article is already placed in this zone
        const existingPlacement = await prisma.contentPlacement.findFirst({
          where: {
            zoneId: zone.id,
            articleId: articleId,
          },
        });

        if (existingPlacement) {
          console.log(`[PageBuilder] Article already in ${zone.zoneDefinition.name} on ${page.name}`);
          continue;
        }

        // Shift all existing placements down (increment position by 1)
        // Use two-phase update to avoid unique constraint violations:
        // Phase 1: Add large offset to move all positions out of conflict range
        // Phase 2: Subtract offset minus 1 to get final positions
        const TEMP_OFFSET = 10000;
        await prisma.$executeRaw`
          UPDATE "ContentPlacement"
          SET position = position + ${TEMP_OFFSET}
          WHERE "zoneId" = ${zone.id}
          AND position >= 0
        `;
        await prisma.$executeRaw`
          UPDATE "ContentPlacement"
          SET position = position - ${TEMP_OFFSET - 1}
          WHERE "zoneId" = ${zone.id}
          AND position >= ${TEMP_OFFSET}
        `;

        // Create new placement at position 0 (top)
        await prisma.contentPlacement.create({
          data: {
            zoneId: zone.id,
            contentType: "ARTICLE",
            articleId: articleId,
            position: 0,
            isPinned: false, // Unpinned so user can reorder later
          },
        });

        console.log(`[PageBuilder] Added article to ${zone.zoneDefinition.name} on ${page.name}`);
      }
    }
  } catch (error) {
    // Log error but don't fail the article creation
    console.error("[PageBuilder] Failed to add article to zones:", error);
  }
}
