const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import the helper function from TypeScript file
async function addArticleToPageBuilderZones(articleId, marketsCategoryId, businessCategoryId) {
  const ARTICLE_ZONE_TYPES = [
    "ARTICLE_GRID",
    "ARTICLE_LIST",
    "HERO_FEATURED",
    "HERO_SECONDARY",
    "TRENDING_SIDEBAR",
  ];

  try {
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
      const articleZones = page.zones.filter((zone) =>
        ARTICLE_ZONE_TYPES.includes(zone.zoneDefinition.zoneType)
      );

      if (articleZones.length === 0) {
        console.log(`[PageBuilder] No article zones found for page: ${page.name}`);
        continue;
      }

      for (const zone of articleZones) {
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

        await prisma.contentPlacement.create({
          data: {
            zoneId: zone.id,
            contentType: "ARTICLE",
            articleId: articleId,
            position: 0,
            isPinned: false,
          },
        });

        console.log(`[PageBuilder] Added article to ${zone.zoneDefinition.name} on ${page.name}`);
      }
    }
  } catch (error) {
    console.error("[PageBuilder] Failed to add article to zones:", error);
  }
}

async function main() {
  console.log('🚀 Adding latest articles to homepage zones...\n');

  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 30,
    include: {
      marketsCategory: true,
      businessCategory: true
    }
  });

  console.log(`Found ${articles.length} recent articles to add to zones\n`);

  for (const article of articles) {
    console.log(`📰 Processing: ${article.title.substring(0, 60)}...`);

    try {
      await addArticleToPageBuilderZones(
        article.id,
        article.marketsCategoryId,
        article.businessCategoryId
      );
      console.log(`   ✅ Added to zones\n`);
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}\n`);
    }
  }

  console.log('✨ Done! All articles added to homepage zones');
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error('Error:', e);
    prisma.$disconnect();
  });
