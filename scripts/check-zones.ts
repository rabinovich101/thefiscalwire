import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check US Markets page zones
  const usMarketsPage = await prisma.pageDefinition.findFirst({
    where: { slug: 'category-us-markets' },
    include: {
      zones: {
        select: {
          content: true,
          zoneDefinition: true
        }
      }
    }
  });

  console.log('=== US Markets Page Zones ===');
  if (usMarketsPage) {
    usMarketsPage.zones.forEach(z => {
      console.log('Zone:', z.zoneDefinition.name, '- slug:', z.zoneDefinition.slug);
      console.log('  Type:', z.zoneDefinition.zoneType);
      console.log('  Content:', z.content ? 'HAS CONTENT' : 'NO CONTENT');
    });
  }

  // Check if technology has a page definition
  const techPage = await prisma.pageDefinition.findFirst({
    where: { slug: 'category-technology' }
  });
  console.log('\nTechnology page exists:', techPage ? 'YES' : 'NO');

  // Check all category pages with zones
  const allPages = await prisma.pageDefinition.findMany({
    where: { pageType: 'CATEGORY' },
    include: {
      zones: {
        select: {
          content: true
        }
      },
      category: true
    }
  });

  console.log('\n=== All Category Pages ===');
  allPages.forEach(p => {
    const hasContent = p.zones.some(z => z.content !== null);
    console.log(p.category?.name || p.name, '- zones:', p.zones.length, '- has content:', hasContent);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
