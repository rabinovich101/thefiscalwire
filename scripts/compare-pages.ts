import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get all pages from page builder
  const pages = await prisma.pageDefinition.findMany({
    select: { id: true, name: true, slug: true, pageType: true, isActive: true },
    orderBy: { name: 'asc' }
  });

  console.log('=== Pages in Page Builder (PageDefinition) ===');
  console.log('Total:', pages.length);
  pages.forEach(p => console.log(`- ${p.name} (slug: ${p.slug}, type: ${p.pageType}, active: ${p.isActive})`));

  // Get categories (which might need pages)
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true }
  });

  console.log('\n=== Categories in Database ===');
  console.log('Total:', categories.length);
  categories.forEach(c => console.log(`- ${c.name} (slug: ${c.slug})`));
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); prisma.$disconnect(); });
