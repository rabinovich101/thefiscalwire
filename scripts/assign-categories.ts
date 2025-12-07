import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Keywords to detect market type
// IMPORTANT: Use slugs from seed.ts (19 categories)
const marketKeywords: Record<string, string[]> = {
  'us-markets': ['NYSE', 'NASDAQ', 'DOW', 'S&P', 'Wall Street', 'Fed', 'Federal Reserve', 'US ', 'U.S.', 'American', 'Wedbush', 'Goldman', 'JPMorgan', 'Motley Fool', 'MSTR', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'Tesla', 'Microsoft', 'Google', 'Apple', 'Amazon', 'Nvidia', 'OpenAI', 'Unity Software', 'Allstate', 'MicroStrategy', 'Evercore', 'D-Wave', 'Fulgent', 'DiamondRock', 'Hoyne'],
  'europe-markets': ['LON:', 'LSE', 'FTSE', 'DAX', 'CAC', 'UK ', 'British', 'London', 'German', 'French', 'European', 'Europe', 'Brexit', 'ECB', 'Tullow Oil'],
  'asia-markets': ['Nikkei', 'Shanghai', 'Hong Kong', 'HSI', 'TSE', 'Japanese', 'Chinese', 'China', 'Japan', 'Korea', 'Asian', 'Asia', 'Singapore', 'ASX'],
  'crypto': ['Bitcoin', 'BTC', 'Ethereum', 'ETH', 'Crypto', 'Blockchain', 'DeFi', 'NFT', 'Altcoin', 'Satoshi'],
  'forex': ['Currency', 'Forex', 'FX', 'Dollar', 'Euro', 'Yen', 'Pound', 'Exchange Rate'],
  'bonds': ['Bond', 'Treasury', 'Yield', 'Fixed Income', 'Corporate Bond', 'Government Bond'],
  'etf': ['ETF', 'Exchange Traded Fund', 'Index Fund', 'Vanguard', 'iShares', 'SPDR'],
};

// Keywords to detect business sector
// IMPORTANT: Use slugs from seed.ts (19 categories)
const businessKeywords: Record<string, string[]> = {
  'tech': ['AI', 'Artificial Intelligence', 'Software', 'Tech', 'Cloud', 'SaaS', 'Semiconductor', 'Chip', 'Data', 'Quantum', 'Computing', 'Digital', 'Code', 'App', 'Platform', 'Nvidia', 'Google', 'Microsoft', 'OpenAI', 'Apple', 'Meta', 'Unity', 'D-Wave', 'Gemini'],
  'finance': ['Bank', 'Banking', 'Financial', 'Insurance', 'Investment', 'Dividend', 'Stock', 'Analyst', 'IPO', 'Merger', 'Acquisition', 'Securities', 'Mutual', 'Capital', 'Hedge', 'Private Equity', 'Royal Bank', 'Hoyne Bancorp', 'Allstate'],
  'health-science': ['Health', 'Medical', 'Pharma', 'Biotech', 'Drug', 'FDA', 'Clinical', 'Hospital', 'Patient', 'Fulgent Genetics', 'Science', 'Research'],
  'economy': ['Economy', 'Economic', 'GDP', 'Inflation', 'Unemployment', 'Jobs Report', 'Labor', 'Recession', 'Growth'],
  'real-estate': ['Real Estate', 'Property', 'REIT', 'Housing', 'Mortgage', 'Hotel', 'Hospitality', 'DiamondRock'],
  'consumption': ['Consumer', 'Retail', 'E-commerce', 'Shopping', 'Brand', 'Restaurant', 'Food', 'Beverage', 'George Weston', 'Spending'],
  'industrial': ['Industrial', 'Manufacturing', 'Shipping', 'Logistics', 'Aerospace', 'Construction', 'Additive', '6K Additive', 'Globus Maritime', 'Jayud'],
  'transportation': ['Transport', 'Airline', 'Aviation', 'Shipping', 'Trucking', 'Rail', 'Logistics'],
  'media': ['Media', 'Entertainment', 'Streaming', 'TV', 'Movie', 'Music', 'News', 'Publishing'],
  'sports': ['Sports', 'NFL', 'NBA', 'MLB', 'Soccer', 'Football', 'Basketball', 'Olympics'],
  'politics': ['Politics', 'Election', 'Congress', 'Senate', 'President', 'Policy', 'Government', 'Regulation'],
  'opinion': ['Opinion', 'Analysis', 'Commentary', 'Editorial', 'Perspective'],
};

function detectCategories(text: string): { markets: string[]; business: string[] } {
  const textUpper = text.toUpperCase();
  const markets: string[] = [];
  const business: string[] = [];

  // Check market keywords
  for (const [slug, keywords] of Object.entries(marketKeywords)) {
    for (const keyword of keywords) {
      if (textUpper.includes(keyword.toUpperCase())) {
        if (!markets.includes(slug)) markets.push(slug);
        break;
      }
    }
  }

  // Check business keywords
  for (const [slug, keywords] of Object.entries(businessKeywords)) {
    for (const keyword of keywords) {
      if (textUpper.includes(keyword.toUpperCase())) {
        if (!business.includes(slug)) business.push(slug);
        break;
      }
    }
  }

  // Default to US Markets if no market detected
  if (markets.length === 0) markets.push('us-markets');

  // Default to Finance if no business detected
  if (business.length === 0) business.push('finance');

  return { markets, business };
}

async function main() {
  // Get all categories by slug
  const categories = await prisma.category.findMany();
  const catBySlug: Record<string, typeof categories[0]> = {};
  categories.forEach(c => catBySlug[c.slug] = c);

  // Get all articles
  const articles = await prisma.article.findMany({
    select: { id: true, title: true, excerpt: true }
  });

  console.log(`Processing ${articles.length} articles...`);

  let processed = 0;
  for (const article of articles) {
    const text = `${article.title} ${article.excerpt || ''}`;
    const { markets, business } = detectCategories(text);

    // Get category IDs
    const categoryIds: { id: string }[] = [];
    for (const slug of markets) {
      if (catBySlug[slug]) categoryIds.push({ id: catBySlug[slug].id });
    }
    for (const slug of business) {
      if (catBySlug[slug]) categoryIds.push({ id: catBySlug[slug].id });
    }

    // Connect categories to article
    await prisma.article.update({
      where: { id: article.id },
      data: {
        categories: {
          set: categoryIds
        }
      }
    });

    processed++;
    if (processed % 20 === 0) {
      console.log(`Processed ${processed}/${articles.length}`);
    }
  }

  console.log(`\nCompleted! Processed ${processed} articles.`);

  // Show stats
  console.log('\n=== Category Stats ===');
  for (const cat of categories) {
    const count = await prisma.article.count({
      where: { categories: { some: { id: cat.id } } }
    });
    if (count > 0) {
      console.log(`${cat.name}: ${count} articles`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
