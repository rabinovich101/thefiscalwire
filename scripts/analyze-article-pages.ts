import prisma from '../src/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

async function analyzeArticleReceivers() {
  const categories = await prisma.category.findMany({
    select: { name: true, slug: true },
    orderBy: { name: 'asc' }
  });

  console.log('=== ANALYZING PAGES THAT CAN RECEIVE ARTICLES ===\n');

  // Check dedicated page files in /app folder
  const appDir = './src/app';
  const dedicatedPages: { slug: string; path: string; queriesCategory: string | null }[] = [];

  for (const cat of categories) {
    const possiblePaths = [
      path.join(appDir, cat.slug, 'page.tsx'),
      path.join(appDir, cat.slug.replace(/-/g, ''), 'page.tsx'),
    ];

    for (const pagePath of possiblePaths) {
      if (fs.existsSync(pagePath)) {
        const content = fs.readFileSync(pagePath, 'utf-8');
        // Find what category it queries
        const match = content.match(/getArticlesByCategory\(['"]([^'"]+)['"]/);
        dedicatedPages.push({
          slug: cat.slug,
          path: pagePath,
          queriesCategory: match ? match[1] : null
        });
      }
    }
  }

  console.log('DEDICATED CATEGORY PAGES (hardcoded routes):');
  console.table(dedicatedPages);

  // Check for mismatches
  console.log('\n=== MISMATCHES (page queries different category than its slug) ===');
  const mismatches = dedicatedPages.filter(p => p.queriesCategory && p.queriesCategory !== p.slug);
  if (mismatches.length > 0) {
    console.table(mismatches);
  } else {
    console.log('  No mismatches found');
  }

  // Show dynamic route
  console.log('\n=== DYNAMIC CATEGORY ROUTE ===');
  console.log('  /category/[slug] -> getArticlesByCategory(slug)');
  console.log('  This route correctly uses the URL slug to query articles\n');

  // Check page definitions that can receive articles
  console.log('=== PAGE BUILDER PAGES THAT CAN RECEIVE ARTICLES ===');
  const pageDefinitions = await prisma.pageDefinition.findMany({
    where: {
      OR: [
        { slug: { startsWith: 'category-' } },
        { slug: { in: categories.map(c => c.slug) } }
      ]
    },
    select: { name: true, slug: true, isActive: true },
    orderBy: { name: 'asc' }
  });
  console.table(pageDefinitions);

  // Final summary
  console.log('\n=== SUMMARY ===');
  console.log(`Total categories: ${categories.length}`);
  console.log(`Dedicated page files: ${dedicatedPages.length}`);
  console.log(`Page builder definitions: ${pageDefinitions.length}`);
  console.log(`Mismatches found: ${mismatches.length}`);

  await prisma.$disconnect();
}

analyzeArticleReceivers().catch(console.error);
