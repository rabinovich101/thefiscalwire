import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Re-sorts all article placements in ARTICLE_GRID and ARTICLE_LIST zones
 * by article publish date (newest first).
 */
async function resortPlacementsByDate() {
  console.log("Starting placement re-sort by publish date...\n");

  // Find all zones that display articles (all zone types that have article placements)
  const zones = await prisma.pageZone.findMany({
    where: {
      isEnabled: true,
      zoneDefinition: {
        zoneType: {
          in: ["ARTICLE_GRID", "ARTICLE_LIST", "HERO_FEATURED", "HERO_SECONDARY", "TRENDING_SIDEBAR"],
        },
      },
    },
    include: {
      page: {
        select: { name: true, slug: true },
      },
      zoneDefinition: {
        select: { name: true, zoneType: true },
      },
      placements: {
        where: {
          contentType: "ARTICLE",
          articleId: { not: null },
        },
        include: {
          article: {
            select: {
              id: true,
              title: true,
              publishedAt: true,
            },
          },
        },
      },
    },
  });

  console.log(`Found ${zones.length} article zones to process\n`);

  let totalUpdated = 0;

  for (const zone of zones) {
    if (zone.placements.length === 0) {
      console.log(`[${zone.page.name}] ${zone.zoneDefinition.name}: No placements, skipping`);
      continue;
    }

    console.log(`[${zone.page.name}] ${zone.zoneDefinition.name}: ${zone.placements.length} placements`);

    // Sort placements by article publishedAt (newest first)
    const sortedPlacements = [...zone.placements].sort((a, b) => {
      const dateA = a.article?.publishedAt || new Date(0);
      const dateB = b.article?.publishedAt || new Date(0);
      return dateB.getTime() - dateA.getTime(); // Descending (newest first)
    });

    // Phase 1: Set all positions to negative temporary values to avoid unique constraint conflicts
    for (let i = 0; i < sortedPlacements.length; i++) {
      const placement = sortedPlacements[i];
      await prisma.contentPlacement.update({
        where: { id: placement.id },
        data: { position: -(i + 1000) }, // Use large negative to avoid any conflicts
      });
    }

    // Phase 2: Set final positions (newest = 0)
    for (let i = 0; i < sortedPlacements.length; i++) {
      const placement = sortedPlacements[i];
      const newPosition = i;

      await prisma.contentPlacement.update({
        where: { id: placement.id },
        data: { position: newPosition },
      });

      if (placement.position !== newPosition) {
        totalUpdated++;
        console.log(`  - Position ${placement.position} -> ${newPosition}: "${placement.article?.title?.substring(0, 50)}..."`);
      }
    }
  }

  console.log(`\nDone! Updated ${totalUpdated} placement positions.`);
}

resortPlacementsByDate()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
