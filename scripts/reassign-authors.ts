/**
 * Script to reassign all articles from "NewsData" author to random authors
 * Run with: DATABASE_URL="your-url" npx ts-node scripts/reassign-authors.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Reassigning article authors...\n');

  // Get the NewsData author
  const newsDataAuthor = await prisma.author.findFirst({
    where: { name: 'NewsData' },
  });

  if (!newsDataAuthor) {
    console.log('No "NewsData" author found. Nothing to reassign.');
    return;
  }

  // Get all other authors
  const authors = await prisma.author.findMany({
    where: { name: { not: 'NewsData' } },
  });

  if (authors.length === 0) {
    console.log('No other authors found in database. Please seed authors first.');
    return;
  }

  console.log(`Found ${authors.length} authors to randomly assign:`);
  authors.forEach(a => console.log(`  - ${a.name}`));
  console.log('');

  // Get all articles assigned to NewsData
  const articles = await prisma.article.findMany({
    where: { authorId: newsDataAuthor.id },
    select: { id: true, title: true },
  });

  console.log(`Found ${articles.length} articles assigned to "NewsData"\n`);

  if (articles.length === 0) {
    console.log('No articles to reassign.');
    return;
  }

  // Reassign each article to a random author
  let updated = 0;
  for (const article of articles) {
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];

    await prisma.article.update({
      where: { id: article.id },
      data: { authorId: randomAuthor.id },
    });

    updated++;
    console.log(`[${updated}/${articles.length}] "${article.title.substring(0, 50)}..." -> ${randomAuthor.name}`);
  }

  console.log(`\nDone! Reassigned ${updated} articles to random authors.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
