/**
 * Backfill script to connect existing articles to their categories
 * via the many-to-many relation.
 *
 * Run with: npx ts-node scripts/backfill-categories.ts
 * Or with Railway DB: DATABASE_URL="your-url" npx ts-node scripts/backfill-categories.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('='.repeat(60));
  console.log('Backfilling Article-Category Many-to-Many Relations');
  console.log('='.repeat(60));
  console.log('');

  // Get all articles with their primary category
  const articles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      categoryId: true,
      categories: {
        select: { id: true },
      },
    },
  });

  console.log(`Found ${articles.length} articles to process`);
  console.log('');

  let updated = 0;
  let skipped = 0;

  for (const article of articles) {
    // Check if the primary category is already connected
    const alreadyConnected = article.categories.some(c => c.id === article.categoryId);

    if (alreadyConnected) {
      skipped++;
      continue;
    }

    // Connect the primary category to the many-to-many relation
    await prisma.article.update({
      where: { id: article.id },
      data: {
        categories: {
          connect: { id: article.categoryId },
        },
      },
    });

    updated++;
    console.log(`[${updated}] Connected: "${article.title.substring(0, 50)}..."`);
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('Results:');
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped (already connected): ${skipped}`);
  console.log('='.repeat(60));
}

main()
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
