import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addArticleToPageBuilderZones } from '@/lib/page-builder-placement';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CRON_SECRET = process.env.CRON_SECRET;

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

interface ContentBlock {
  type: string;
  content?: string;
  level?: number;
}

interface ArticleInput {
  title: string;
  excerpt: string;
  content: ContentBlock[];
  imageUrl: string;
  readTime: number;
  relevantTickers: string[];
  seoKeywords: string[];
  markets: string;
  business: string;
  isBreaking: boolean;
  tags: string[];
}

// 5 Trending Financial News Articles - March 26, 2026 (Batch 2 - Evening)
const ARTICLES: ArticleInput[] = [
  {
    title: 'Gold Rebounds Over $160 in Single Session, Snapping Nine-Day Losing Streak',
    excerpt: 'Gold futures surged 3.6% to close near $4,560 as dollar weakness, falling Treasury yields, and a 15-point peace proposal lifted safe-haven demand.',
    content: [
      {type:'paragraph',content:'Gold staged its most dramatic one-day recovery in months on Thursday, with April futures surging 3.6% to settle near $4,560 per ounce after snapping a punishing nine-day losing streak that had wiped more than $400 off the price of the precious metal. The rebound was fueled by a combination of dollar weakness, falling Treasury yields, and renewed optimism around a 15-point peace proposal that lifted hopes the oil-driven inflation spiral might finally be contained.'},
      {type:'paragraph',content:'The $160-plus single-session gain marked one of the largest daily moves in gold this year and caught many traders off guard after the extended selloff had pushed gold well below its all-time high of $5,595 reached in late January. International spot gold was trading at approximately $4,521 per ounce during the session, gaining over 2.7% as safe-haven demand re-emerged amid a weaker U.S. dollar.'},
      {type:'heading',level:2,content:'Central Bank Buying Remains a Pillar'},
      {type:'paragraph',content:'Despite the recent volatility, structural demand drivers for gold remain firmly in place. Central bank purchases continue at record levels, with China, India, and several emerging market central banks adding to reserves at a pace not seen in decades. Mine production growth remains flat at just 1-2% annually, creating what analysts describe as a scarcity loop that supports prices even during periods of speculative selling.'},
      {type:'heading',level:2,content:'Peace Talks Shift Sentiment'},
      {type:'paragraph',content:'The catalyst for Thursday\'s sharp reversal was a 15-point peace proposal related to the ongoing US-Iran conflict that briefly lifted risk sentiment across markets. While skepticism remains about whether a ceasefire will materialize, the mere possibility of de-escalation was enough to trigger a wave of short covering in the gold market.'},
      {type:'paragraph',content:'Gold has now gained more than 25% since early 2025, driven by persistent inflation, geopolitical instability, and the Federal Reserve\'s reluctance to cut rates aggressively. Analysts at Goldman Sachs maintain their year-end target of $5,000 per ounce, arguing that the current pullback from January highs represents a buying opportunity rather than a trend reversal.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&h=630&fit=crop&q=80',
    readTime: 4,
    relevantTickers: ['GLD', 'GDX', 'NEM', 'GOLD', 'AEM'],
    seoKeywords: ['gold price', 'gold rebound', 'precious metals', 'safe haven', 'gold futures'],
    markets: 'commodities',
    business: 'economy',
    isBreaking: true,
    tags: ['gold', 'precious metals', 'safe haven', 'commodities', 'inflation']
  },
  {
    title: 'Olaplex Shares Surge 51% After Henkel Agrees to $1.4 Billion Buyout',
    excerpt: 'German consumer goods giant Henkel will acquire Olaplex at $2.06 per share, a 55% premium, ending a turbulent chapter for the hair care company.',
    content: [
      {type:'paragraph',content:'Olaplex Holdings saw its shares explode 51% higher on Thursday after German consumer goods conglomerate Henkel AG agreed to acquire the hair care company for approximately $1.4 billion in an all-cash transaction. Under the terms of the deal, Henkel will pay $2.06 per share, representing a premium of roughly 55% over Olaplex\'s closing price on Wednesday.'},
      {type:'paragraph',content:'The acquisition marks the end of a turbulent chapter for Olaplex, which has seen its stock lose nearly 95% of its value since its initial public offering in 2021, when shares debuted at $25. The company faced a series of headwinds including a lawsuit alleging hair loss from its products, increased competition in the prestige hair care space, and broader consumer spending pullbacks in the beauty category.'},
      {type:'heading',level:2,content:'Strategic Fit for Henkel'},
      {type:'paragraph',content:'For Henkel, the acquisition represents a strategic push to strengthen its position in the premium hair care segment. The German company, which already operates well-known brands including Schwarzkopf and Syoss, said the deal will allow it to further invest in its haircare segments and expand Olaplex\'s global distribution reach.'},
      {type:'paragraph',content:'The transaction, which was unanimously approved by Olaplex\'s Board of Directors, is expected to close in the second half of 2026, subject to regulatory approvals and other customary closing conditions. Olaplex shareholders will receive $2.06 per share in cash upon completion.'},
      {type:'heading',level:2,content:'M&A Activity Picking Up'},
      {type:'paragraph',content:'The Henkel-Olaplex deal is the latest in a series of consumer goods acquisitions that have accelerated in 2026, as larger companies with strong balance sheets look to scoop up distressed brands at attractive valuations. The deal also signals confidence in the long-term growth potential of the prestige beauty market, even as near-term consumer spending patterns remain uncertain amid broader economic headwinds.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&h=630&fit=crop&q=80',
    readTime: 4,
    relevantTickers: ['OLPX', 'EL', 'COTY', 'PG'],
    seoKeywords: ['Olaplex', 'Henkel acquisition', 'M&A', 'hair care', 'consumer goods'],
    markets: 'us-markets',
    business: 'finance',
    isBreaking: false,
    tags: ['Olaplex', 'Henkel', 'acquisition', 'consumer goods', 'M&A']
  },
  {
    title: 'The AI Scare Trade: Software Stocks Lose $611 Billion as Wall Street Prices in Human Displacement',
    excerpt: 'A viral Citrini Research report warning of a "human intelligence displacement spiral" has triggered the largest software selloff in years, with IBM dropping 13%.',
    content: [
      {type:'paragraph',content:'The financial world is grappling with what analysts are calling the "AI Scare Trade" — a dramatic market phenomenon that has erased more than $611 billion in market value from software and services stocks in just one week. The selloff was ignited by a viral research report from Citrini Research warning of a "human intelligence displacement spiral," which argued that advanced AI agents are now capable of replacing entire categories of knowledge work previously thought to be immune to automation.'},
      {type:'paragraph',content:'IBM suffered its worst single-day decline in 25 years, plummeting 13% after Anthropic published a blog post claiming its AI could modernize COBOL — the legacy programming language that still powers IBM mainframe systems across banking, insurance, and government. The implication that AI could automate the maintenance of these mission-critical systems struck at the heart of IBM\'s enterprise consulting business.'},
      {type:'heading',level:2,content:'SaaS Stocks in the Crosshairs'},
      {type:'paragraph',content:'The carnage extended well beyond IBM. Salesforce shares dropped more than 30% from recent highs after Amazon Web Services announced new AI tools capable of automating functions across sales, business development, and technical operations. ServiceNow, SAP, and other enterprise software names saw steep declines as investors rushed to reprice the sector for a world where AI agents can perform tasks that previously required licensed software subscriptions.'},
      {type:'paragraph',content:'Nassim Nicholas Taleb, the author of "The Black Swan," added fuel to the fire by publicly endorsing the thesis that AI agents represent a structural threat to the software industry\'s subscription-based business model. His comments went viral on social media, amplifying the panic selling.'},
      {type:'heading',level:2,content:'Contrarian View: Opportunity or Trap?'},
      {type:'paragraph',content:'Not everyone agrees with the bearish thesis. Some veteran investors argue the selloff is almost entirely speculative, with markets pricing in hypothetical futures rather than current business deterioration. IBM\'s mainframe business, for example, remains deeply embedded in regulated industries where replacement cycles are measured in decades, not quarters.'},
      {type:'paragraph',content:'Fortune reported that Wall Street may be overestimating AI\'s near-term impact on SaaS, noting that history shows technology transitions typically expand markets rather than destroy them. Nevertheless, the AI scare trade has become the dominant narrative on Wall Street, and traders are showing no signs of easing the pressure on affected stocks.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['IBM', 'CRM', 'NOW', 'SAP', 'MSFT', 'AMZN'],
    seoKeywords: ['AI scare trade', 'software selloff', 'IBM crash', 'Salesforce', 'artificial intelligence disruption'],
    markets: 'us-markets',
    business: 'tech',
    isBreaking: false,
    tags: ['AI disruption', 'software stocks', 'IBM', 'Salesforce', 'AI scare trade']
  },
  {
    title: 'German Business Confidence Crashes to Lowest Since Ukraine Invasion as Iran War Shatters Recovery',
    excerpt: 'The German Ifo business expectations index plunged from 90.2 to 86.0, the steepest drop since Russia invaded Ukraine, as the Iran conflict derails Europe\'s recovery.',
    content: [
      {type:'paragraph',content:'Germany\'s closely watched Ifo business climate index delivered a devastating blow to European economic optimism on Thursday, with the expectations component crashing from 90.2 to 86.0 — the steepest monthly decline since Russia\'s invasion of Ukraine in February 2022. The headline business climate index fell to 86.4 from 88.4, confirming that the ongoing US-Iran conflict has shattered Germany\'s fragile economic recovery.'},
      {type:'paragraph',content:'The data sent shockwaves through European markets, although the broader STOXX 600 managed to rally 1.41% on optimism around the 15-point peace proposal. The DAX surged 1.78%, the FTSE 100 gained 1.42% to reclaim the 10,100 level, and France\'s CAC 40 advanced 1.51%, suggesting investors are looking past near-term economic damage toward a potential resolution of the conflict.'},
      {type:'heading',level:2,content:'Energy Costs Cripple German Industry'},
      {type:'paragraph',content:'Germany\'s manufacturing sector, already struggling with structural challenges including high energy costs and competition from Chinese manufacturers, has been particularly hard hit by the surge in oil prices above $100 per barrel. Industrial production has contracted for three consecutive months, and export orders have fallen to their lowest level since the post-pandemic recovery period.'},
      {type:'paragraph',content:'The European Central Bank faces an increasingly difficult policy environment. While the ECB had been expected to continue its rate-cutting cycle to support growth, the energy-driven inflation surge has complicated the outlook. Eurozone inflation accelerated to 2.8% in the latest reading, pushing further above the ECB\'s 2% target and narrowing the central bank\'s room to maneuver.'},
      {type:'heading',level:2,content:'European Equities Defy Economic Gloom'},
      {type:'paragraph',content:'Despite the grim economic data, European equity markets have shown surprising resilience. Investors appear to be betting that the peace proposal will gain traction, potentially bringing oil prices back down and relieving the pressure on European industry. However, economists caution that even a swift resolution to the conflict would leave lasting scars on business confidence and investment plans.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1467226632440-65f0b4957563?w=1200&h=630&fit=crop&q=80',
    readTime: 4,
    relevantTickers: ['EWG', 'FEZ', 'VGK', 'EWU'],
    seoKeywords: ['German economy', 'Ifo index', 'European markets', 'Iran war', 'ECB'],
    markets: 'europe',
    business: 'economy',
    isBreaking: false,
    tags: ['Germany', 'European economy', 'Ifo index', 'ECB', 'Iran war']
  },
  {
    title: 'US Import Prices Surge at Fastest Pace in Four Years as 65% of Consumers Now Expect Recession',
    excerpt: 'Import prices jumped 1.3% in February, double expectations, while a consumer survey shows recession expectations hitting their highest level since 2023.',
    content: [
      {type:'paragraph',content:'Pipeline inflation pressures are broadening well beyond energy, according to the latest government data showing U.S. import prices surged 1.3% in February — double the consensus estimate and the largest monthly increase in nearly four years. The data confirms what many economists have feared: that the oil price shock triggered by the US-Iran conflict is now filtering through to a wider range of goods and services.'},
      {type:'paragraph',content:'Adding to the gloomy outlook, a consumer sentiment survey released Thursday showed that 65% of respondents now expect a recession within the next 12 months, up 6 percentage points from the previous month and the highest reading since the banking stress of early 2023. The combination of rising prices and deteriorating confidence has raised the specter of stagflation — a toxic mix of stagnant growth and persistent inflation.'},
      {type:'heading',level:2,content:'Fed Trapped Between Inflation and Growth'},
      {type:'paragraph',content:'The Federal Reserve finds itself in an increasingly impossible position. With inflation pressures reignited by soaring energy and import costs, the central bank cannot justify cutting interest rates even as economic growth shows clear signs of slowing. Fed Chair Jerome Powell has signaled a wait-and-see approach, but markets are growing impatient with the lack of policy clarity.'},
      {type:'paragraph',content:'Treasury yields fell on Thursday despite the hot inflation data, as investors prioritized recession fears over inflation concerns. The 10-year yield dropped to 4.18%, while the 2-year yield fell to 3.95%, further inverting the yield curve — a traditional recession indicator that has now been inverted for a record stretch.'},
      {type:'heading',level:2,content:'Consumers Pulling Back'},
      {type:'paragraph',content:'Retail sales data for February came in below expectations, and credit card delinquency rates have climbed to their highest level since 2019. The combination of high energy costs eating into household budgets, uncertainty around trade policy, and elevated interest rates has created what economists describe as a confidence gap between hard economic data and sentiment measures.'},
      {type:'paragraph',content:'Money market fund assets continue to swell, reaching a record $7.86 trillion after inflows of $38.68 billion in the most recent week. The historic rush to cash underscores the depth of risk aversion gripping both institutional and retail investors as the first quarter of 2026 draws to a close.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['TLT', 'SHY', 'SPY', 'BIL', 'TIP'],
    seoKeywords: ['import prices', 'recession fears', 'consumer confidence', 'stagflation', 'Federal Reserve'],
    markets: 'us-markets',
    business: 'economy',
    isBreaking: false,
    tags: ['inflation', 'recession', 'consumer confidence', 'Federal Reserve', 'stagflation']
  }
];

async function getCategoryId(slug: string): Promise<string> {
  let category = await prisma.category.findUnique({ where: { slug } });
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
        slug,
        color: 'bg-blue-600',
      },
    });
  }
  return category.id;
}

async function getOrCreateTag(name: string): Promise<string | null> {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  if (!slug) return null;
  let tag = await prisma.tag.findUnique({ where: { slug } });
  if (!tag) {
    tag = await prisma.tag.create({ data: { name, slug } });
  }
  return tag.id;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${CRON_SECRET}` && CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get authors
    const authors = await prisma.author.findMany({ take: 10 });
    if (authors.length === 0) {
      return NextResponse.json({ error: 'No authors found' }, { status: 500 });
    }

    const results: { title: string; status: string; id?: string }[] = [];

    for (const article of ARTICLES) {
      const slug = generateSlug(article.title);

      // Check if exists
      const existing = await prisma.article.findUnique({ where: { slug }, select: { id: true } });
      if (existing) {
        results.push({ title: article.title, status: 'skipped (exists)', id: existing.id });
        continue;
      }

      const author = authors[Math.floor(Math.random() * authors.length)];
      const marketsCategoryId = await getCategoryId(article.markets);
      const businessCategoryId = await getCategoryId(article.business);

      // Tags
      const tagConnections: { id: string }[] = [];
      for (const tagName of article.tags.slice(0, 5)) {
        const tagId = await getOrCreateTag(tagName);
        if (tagId) tagConnections.push({ id: tagId });
      }

      const newArticle = await prisma.article.create({
        data: {
          title: article.title,
          slug,
          excerpt: article.excerpt,
          content: article.content as unknown as any,
          imageUrl: article.imageUrl,
          publishedAt: new Date(),
          readTime: article.readTime,
          isFeatured: false,
          isBreaking: article.isBreaking,
          relevantTickers: article.relevantTickers,
          seoKeywords: article.seoKeywords,
          isAiEnhanced: true,
          authorId: author.id,
          marketsCategoryId,
          businessCategoryId,
          categories: {
            connect: [{ id: marketsCategoryId }, { id: businessCategoryId }],
          },
          tags: {
            connect: tagConnections,
          },
        },
      });

      // Add to page builder zones
      try {
        await addArticleToPageBuilderZones(newArticle.id, marketsCategoryId, businessCategoryId);
      } catch (e) {
        console.error('Zone placement error:', e);
      }

      results.push({ title: article.title, status: 'created', id: newArticle.id });
    }

    return NextResponse.json({
      success: true,
      message: 'Trending articles batch 2 import complete - March 26 evening',
      results,
      created: results.filter(r => r.status === 'created').length,
      skipped: results.filter(r => r.status.includes('skipped')).length,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
