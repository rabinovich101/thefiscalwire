const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Placing all 30 newest articles on homepage...\n');

  // Get the 30 newest articles
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 30,
    select: { id: true, title: true, publishedAt: true, marketsCategoryId: true, businessCategoryId: true }
  });

  console.log(`Found ${articles.length} articles to place:`);
  articles.forEach((a, i) => console.log(`  ${i+1}. ${a.title.substring(0, 60)}...`));

  // Get homepage and its zones
  const homepage = await prisma.pageDefinition.findFirst({
    where: { pageType: 'HOMEPAGE' },
    include: {
      zones: {
        where: { isEnabled: true },
        include: { zoneDefinition: true }
      }
    }
  });

  if (!homepage) {
    console.error('No homepage found');
    return;
  }

  const heroZone = homepage.zones.find(z => z.zoneDefinition.zoneType === 'HERO_FEATURED');
  const gridZone = homepage.zones.find(z => z.zoneDefinition.zoneType === 'ARTICLE_GRID');
  const trendingZone = homepage.zones.find(z => z.zoneDefinition.zoneType === 'TRENDING_SIDEBAR');

  if (!heroZone || !gridZone || !trendingZone) {
    console.error('Missing zones:', { hero: !!heroZone, grid: !!gridZone, trending: !!trendingZone });
    return;
  }

  // Step 1: Clear ALL existing placements from homepage zones
  console.log('\nClearing old placements from homepage zones...');
  for (const zone of [heroZone, gridZone, trendingZone]) {
    const deleted = await prisma.contentPlacement.deleteMany({
      where: { zoneId: zone.id }
    });
    console.log(`  Deleted ${deleted.count} placements from ${zone.zoneDefinition.name}`);
  }

  // Step 2: Update maxItems for zones
  console.log('\nUpdating zone maxItems...');
  await prisma.zoneDefinition.update({
    where: { id: heroZone.zoneDefinitionId },
    data: { maxItems: 5 }
  });
  await prisma.zoneDefinition.update({
    where: { id: gridZone.zoneDefinitionId },
    data: { maxItems: 10 }
  });
  await prisma.zoneDefinition.update({
    where: { id: trendingZone.zoneDefinitionId },
    data: { maxItems: 15 }
  });
  console.log('  Hero: 5, Grid: 10, Trending: 15');

  // Articles are ordered newest first (index 0 = newest)
  // Hero: top 5 (newest)
  // Grid: next 10 (articles 5-14)
  // Trending: top 15 from all 30

  // Step 3: Place top 5 in Hero Featured
  console.log('\nPlacing top 5 in Hero Featured...');
  for (let i = 0; i < 5 && i < articles.length; i++) {
    await prisma.contentPlacement.create({
      data: {
        zoneId: heroZone.id,
        contentType: 'ARTICLE',
        articleId: articles[i].id,
        position: i,
        isPinned: false,
      }
    });
    console.log(`  pos ${i}: ${articles[i].title.substring(0, 50)}...`);
  }

  // Step 4: Place next 10 in Article Grid
  console.log('\nPlacing next 10 in Article Grid...');
  for (let i = 5; i < 15 && i < articles.length; i++) {
    await prisma.contentPlacement.create({
      data: {
        zoneId: gridZone.id,
        contentType: 'ARTICLE',
        articleId: articles[i].id,
        position: i - 5,
        isPinned: false,
      }
    });
    console.log(`  pos ${i-5}: ${articles[i].title.substring(0, 50)}...`);
  }

  // Step 5: Place top 15 in Trending Sidebar
  console.log('\nPlacing top 15 in Trending Sidebar...');
  const trendingCount = Math.min(15, articles.length);
  for (let i = 0; i < trendingCount; i++) {
    await prisma.contentPlacement.create({
      data: {
        zoneId: trendingZone.id,
        contentType: 'ARTICLE',
        articleId: articles[i].id,
        position: i,
        isPinned: false,
      }
    });
    console.log(`  pos ${i}: ${articles[i].title.substring(0, 50)}...`);
  }

  console.log(`\nDone! ${articles.length} articles placed on homepage.`);
  console.log('  Hero: 5 newest articles');
  console.log('  Top Stories Grid: next 10 articles');
  console.log('  Trending Sidebar: top 15 articles');
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error('Error:', e);
    prisma.$disconnect();
  });
