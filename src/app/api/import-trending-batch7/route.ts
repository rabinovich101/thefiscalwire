import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
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

// 5 Trending Financial News Articles - March 27, 2026 (Batch 7 - Late Night)
const ARTICLES: ArticleInput[] = [
  {
    title: 'Stocks Rally as Trump Extends Iran Deadline to April 6 While Oil Drops Below $100 on Hopes of Diplomatic Breakthrough',
    excerpt: 'US stock futures surged Friday morning after President Trump extended his ultimatum against Iran by 10 days to April 6, sending oil prices tumbling below $100 per barrel for the first time in two weeks as traders bet on a diplomatic resolution to the month-long conflict that has roiled global markets.',
    content: [
      {type:'paragraph',content:'US stock futures climbed sharply early Friday as investors digested the news that President Donald Trump has extended his deadline to strike Iran\'s energy infrastructure by 10 days to April 6, providing a rare reprieve in a conflict that has driven the worst month for global equities since 2022. Dow Jones Industrial Average futures gained 159 points, or about 0.34%, while S&P 500 futures and Nasdaq 100 futures each climbed approximately 0.4%, signaling a positive open after Thursday\'s brutal selloff that saw the Dow plunge 606 points.'},
      {type:'paragraph',content:'The rally was fueled primarily by a dramatic move in crude oil markets. Brent crude fell below $100 per barrel for the first time since mid-March, dropping as much as 4.2% to $97.80 before stabilizing around $99.50. West Texas Intermediate similarly retreated to $91.40, a welcome decline from the $108 peak reached earlier this week when fears of an imminent US strike on Iran\'s power grid sent energy markets into panic. The oil decline came after Trump claimed Iran had allowed 10 oil tankers through the Strait of Hormuz as a "goodwill gesture" and called it a sign that Tehran is "real and solid" about reaching a deal.'},
      {type:'heading',level:2,content:'Relief Rally or Dead Cat Bounce?'},
      {type:'paragraph',content:'Not everyone on Wall Street is convinced the rally has legs. Goldman Sachs strategists warned clients that the 10-day extension merely "delays the resolution without changing the fundamental dynamics," noting that Iran\'s five-point counteroffer — which demands sovereign control over the Strait of Hormuz — remains a non-starter for the US and its Gulf allies. The bank maintained its recession probability estimate at 35% and kept its year-end S&P 500 target under review pending the outcome of negotiations. Morgan Stanley struck a similarly cautious tone, advising clients to use any rally as an opportunity to reduce exposure to cyclical sectors.'},
      {type:'paragraph',content:'The broader market context remains deeply challenging. The S&P 500 has fallen 8.3% since the first US air strikes against Iran on February 28, with the Nasdaq Composite officially entering correction territory after declining more than 10% from its January highs. The CBOE Volatility Index (VIX) remains elevated at 24.5, well above the long-term average of 17, reflecting persistent uncertainty about the conflict\'s trajectory. Treasury yields have also been volatile, with the 10-year yield swinging between 4.15% and 4.45% this week as traders weigh the competing forces of flight-to-safety demand and inflation expectations.'},
      {type:'heading',level:2,content:'Sector Winners and Losers'},
      {type:'paragraph',content:'The overnight futures move suggested a rotation out of the defensive trade that has dominated March. Energy stocks, which have been the clear winners since the conflict began with the S&P 500 Energy sector outperforming by over 25 percentage points, gave back some gains in pre-market trading as oil retreated. Conversely, beaten-down sectors including airlines, consumer discretionary, and transportation showed the strongest pre-market gains, with United Airlines up 3.2% and Delta Air Lines rising 2.8%. Tech stocks also benefited, with mega-cap names including Apple, Microsoft, and Nvidia all trading higher as the risk-on mood returned. However, analysts cautioned that the fundamental headwinds facing the market — elevated inflation, higher-for-longer interest rates, and geopolitical uncertainty — have not changed, and that any sustained recovery would require a genuine resolution to the Iran crisis rather than merely a deadline extension.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['SPY', 'QQQ', 'DIA', 'XLE', 'USO', 'VIX'],
    seoKeywords: ['stocks rally Iran deadline', 'Trump Iran April 6', 'oil below $100', 'stock market rally March 2026', 'Iran peace talks', 'market recovery'],
    markets: 'us-markets',
    business: 'economy',
    isBreaking: true,
    tags: ['stock market', 'Iran conflict', 'oil prices', 'Trump', 'Wall Street']
  },
  {
    title: 'MARA Holdings Dumps 15,133 Bitcoin Worth $1.1 Billion to Slash Debt by 30% in Largest Corporate BTC Sale Ever',
    excerpt: 'Bitcoin mining giant MARA Holdings sold over 15,000 bitcoin for $1.1 billion between March 4-25 to fund the repurchase of $1 billion in convertible notes, slashing its total debt by 30% in a bold strategic pivot that sent shares surging 10% while rattling crypto markets.',
    content: [
      {type:'paragraph',content:'MARA Holdings, the largest publicly traded bitcoin mining company, executed the biggest corporate bitcoin sale in history this week, liquidating 15,133 BTC for approximately $1.1 billion to fund an aggressive debt reduction strategy that will slash its convertible note obligations by nearly a third. The sale, conducted between March 4 and March 25, represents a dramatic strategic pivot for a company that had been one of the most prominent corporate bitcoin accumulators, and sent shockwaves through both cryptocurrency and traditional equity markets.'},
      {type:'paragraph',content:'The proceeds are being used to repurchase $1.0 billion in aggregate principal amount of the company\'s 0.00% Convertible Senior Notes due 2030 and 2031. Specifically, MARA agreed to buy back approximately $367.5 million of the 2030 Notes for $322.9 million in cash and roughly $633.4 million of the 2031 Notes for $589.9 million — capturing approximately $88.1 million in value through cash savings at an approximate 9% discount to face value. After the repurchase, MARA\'s total convertible note indebtedness will decline from $3.3 billion to $2.3 billion.'},
      {type:'heading',level:2,content:'Stock Surges on Deleveraging Play'},
      {type:'paragraph',content:'Investors cheered the news, sending MARA shares up 10% on Thursday as the market interpreted the move as a sign of financial discipline from a company that had previously been criticized for its aggressive bitcoin accumulation strategy funded by cheap convertible debt. The deleveraging removes a significant overhang from the stock — the 0% coupon convertible notes had been a source of concern among analysts who worried about the dilution risk if MARA\'s stock price rose above the conversion thresholds, or conversely, the refinancing risk if bitcoin prices declined and the company couldn\'t roll the debt.'},
      {type:'paragraph',content:'The transaction also highlights a growing divergence in corporate bitcoin strategy. While MicroStrategy\'s Michael Saylor continues to advocate for unlimited bitcoin accumulation funded by debt and equity issuance, MARA\'s CEO Fred Thiel appears to be charting a more conservative course — monetizing bitcoin holdings at favorable prices to strengthen the balance sheet during a period of macro uncertainty. The Iran conflict and resulting oil shock have created significant headwinds for risk assets including bitcoin, which has fallen from its February high of $82,000 to below $69,000, making the timing of MARA\'s sale look prescient in hindsight.'},
      {type:'heading',level:2,content:'Impact on Bitcoin Markets'},
      {type:'paragraph',content:'The sale of 15,133 BTC over a three-week period represents a substantial supply overhang that likely contributed to bitcoin\'s recent weakness. At current prices, the liquidation amounted to roughly 0.08% of bitcoin\'s total circulating supply — a meaningful amount given the relatively thin liquidity in spot bitcoin markets. On-chain analysts noted that MARA had been steadily moving bitcoin from cold storage to exchange wallets throughout March, a pattern that had triggered speculation about a potential sale. Bitcoin slipped below $69,000 on Thursday as the broader crypto market continued to struggle under the weight of geopolitical uncertainty and risk-off sentiment, with the total cryptocurrency market capitalization declining to $2.4 trillion from a February peak of $3.1 trillion.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['MARA', 'MSTR', 'COIN', 'RIOT', 'CLSK', 'IBIT'],
    seoKeywords: ['MARA bitcoin sale', 'MARA Holdings debt buyback', 'bitcoin sell $1 billion', 'MARA stock surge', 'corporate bitcoin sale', 'crypto market March 2026'],
    markets: 'us-markets',
    business: 'finance',
    isBreaking: true,
    tags: ['bitcoin', 'MARA Holdings', 'cryptocurrency', 'debt reduction', 'mining']
  },
  {
    title: 'Newsmax Stock Jumps 11% After Crushing Q4 Earnings With $52M Revenue Beat and Guides to $216M for 2026',
    excerpt: 'Conservative media company Newsmax posted blowout fourth-quarter results with revenue of $52.2 million that crushed the $44 million consensus estimate, while guiding to $212-$216 million in 2026 revenue driven by affiliate fee expansion and premium content investments.',
    content: [
      {type:'paragraph',content:'Newsmax shares surged 11% in after-hours trading Thursday after the conservative cable news network delivered fourth-quarter earnings that significantly exceeded Wall Street expectations, posting revenue of $52.2 million for the three months ended December 31, 2025 — a 9.6% year-over-year increase that blew past the FactSet consensus estimate of $44 million by an 18.6% margin. The beat was driven by a 12.6% jump in broadcasting revenues to $42.5 million, powered by affiliate fee rate increases and expanded distribution agreements with major cable and satellite providers.'},
      {type:'paragraph',content:'For the full fiscal year 2025, Newsmax reported total revenue of $189.3 million, representing 10.7% growth, though the company posted a wider net loss driven by legal settlements and investments in content and technology infrastructure. The company reported a negative net margin of 55.99% and a negative return on equity of 255.61%, metrics that reflect the heavy investment phase the company is navigating as it scales operations to compete with larger rivals Fox News and CNN in the cable news landscape.'},
      {type:'heading',level:2,content:'2026 Guidance Signals Confidence'},
      {type:'paragraph',content:'Perhaps more significant than the Q4 beat was the company\'s forward guidance. Newsmax projected 2026 revenue of $212 million to $216 million, representing approximately 13% growth at the midpoint — a number that management characterized as "structural and not cyclical." CEO Christopher Ruddy emphasized during the earnings call that the growth is being driven by fundamental business improvements rather than one-time political advertising tailwinds, noting that the company does not anticipate political advertising being a meaningful contributor to the 2026 outlook despite the heightened political environment.'},
      {type:'paragraph',content:'The primary growth engine is affiliate fee expansion, where Newsmax is seeing success in renegotiating rate increases with distributors and securing new distribution channels. The company has been aggressively investing in premium content — including expanded primetime programming and documentary specials — designed to justify higher per-subscriber fees. Digital monetization is another key pillar, with the company rolling out new subscription tiers on its streaming platform and expanding its digital advertising capabilities.'},
      {type:'heading',level:2,content:'Stock Performance and Analyst Reaction'},
      {type:'paragraph',content:'The after-hours surge brought renewed attention to Newsmax\'s stock, which has been volatile since the company\'s IPO. The 11% jump represents a significant vote of confidence from investors who have been skeptical about the company\'s path to profitability given its negative margins. Several analysts noted that the revenue beat and strong guidance could catalyze a re-rating of the stock, with the affiliate fee growth trajectory particularly encouraging as it represents recurring, high-margin revenue that provides visibility into future earnings. The company\'s ability to grow revenue at 13% while reducing its reliance on cyclical advertising dollars addresses one of the key bear arguments — that Newsmax\'s revenue would fluctuate dramatically between election and non-election years. If the company can demonstrate consistent affiliate-driven growth, it could narrow the valuation gap with peers in the media sector.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['NMAX', 'FOX', 'FOXA', 'WBD', 'PARA', 'DIS'],
    seoKeywords: ['Newsmax earnings Q4', 'NMAX stock earnings beat', 'Newsmax revenue $52 million', 'Newsmax 2026 guidance', 'media stock earnings', 'Newsmax stock jump'],
    markets: 'us-markets',
    business: 'media',
    isBreaking: false,
    tags: ['Newsmax', 'earnings', 'media', 'cable news', 'stock market']
  },
  {
    title: 'Goldman Sachs Declares M&A Supercycle as Investment Banking Fees Surge 41% With Global Deal Volume Approaching $5 Trillion',
    excerpt: 'Goldman Sachs CEO David Solomon declared a "dealmaking renaissance" as the bank reported a 41% surge in advisory revenues with global M&A deal values projected to approach $5 trillion in 2026, driven by AI infrastructure buildout, energy deals, and a significantly softer regulatory environment.',
    content: [
      {type:'paragraph',content:'Goldman Sachs has officially declared the arrival of an M&A supercycle, with CEO David Solomon telling investors this week that 2026 is shaping up to be a record-breaking year for global dealmaking as AI infrastructure buildout, energy transition investments, and a dramatically softened regulatory environment converge to create a "strategic renaissance" on Wall Street. The call comes as Goldman reported a staggering 41% increase in advisory revenues in the fourth quarter of 2025 alone, with total investment banking fees up 21% for the full year.'},
      {type:'paragraph',content:'The numbers support the bullish thesis. Global deal values are projected to approach $5 trillion in 2026 — levels not seen since the frenzied dealmaking peaks of 2021 — with Goldman projecting a 15% increase in US M&A activity alone. Morgan Stanley has seen equally impressive momentum, reporting a 47% climb in investment banking revenue as the firm rides the same wave of corporate consolidation and strategic repositioning. Analysts now project Goldman Sachs earnings per share of $57.70 to $58.64 for 2026, which would represent a new record and validate the firm\'s strategic pivot back toward its investment banking roots under Solomon\'s leadership.'},
      {type:'heading',level:2,content:'AI and Energy Drive the Megadeal Wave'},
      {type:'paragraph',content:'What makes this M&A cycle different from previous booms is its composition. Rather than the financial engineering-driven deals of previous eras, the 2026 surge is characterized by what Solomon called "strategic necessity" — companies are buying to survive in an economy increasingly dominated by AI and constrained by the physical limitations of the electrical grid. The largest deal categories are AI infrastructure (data centers, GPU clusters, fiber networks), energy (oil and gas consolidation accelerated by the Iran conflict, plus renewable energy assets), and healthcare (biotechs pursuing strategic mergers to fund AI-driven drug discovery pipelines).'},
      {type:'paragraph',content:'Goldman\'s own deal pipeline reflects this shift. The firm is advising on several multi-billion-dollar transactions involving data center operators, semiconductor companies, and energy infrastructure providers. Private equity sponsors, sitting on over $2.5 trillion in dry powder, are also driving activity as they seek to deploy capital before fund expiration deadlines. The softer regulatory environment under the current administration has removed a significant bottleneck — antitrust reviews that previously took 12-18 months are now being completed in 6-8 months, making large-scale consolidation far more feasible.'},
      {type:'heading',level:2,content:'Wall Street Bonus Pool Hits Record $49.2 Billion'},
      {type:'paragraph',content:'The dealmaking boom has translated directly into record compensation for Wall Street professionals. The total bonus pool for 2025 surged to a record $49.2 billion, with the average annual bonus rising 6% to $246,900 according to the New York State Comptroller. The record payouts reflect not just the M&A surge but also strong performance across trading desks, which benefited from elevated volatility driven by geopolitical uncertainty and the AI-related market selloff in late February. However, the outlook for 2026 bonuses is already darkening despite the deal boom — the Iran conflict and its associated market volatility have created significant mark-to-market losses across bank trading books, and the prospect of a recession could crimp deal activity in the second half of the year if corporate confidence deteriorates.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&q=80',
    readTime: 6,
    relevantTickers: ['GS', 'MS', 'JPM', 'EVR', 'LAZ', 'PJT'],
    seoKeywords: ['Goldman Sachs M&A supercycle', 'investment banking surge 2026', 'Wall Street dealmaking', 'M&A $5 trillion', 'Goldman advisory fees', 'Morgan Stanley investment banking'],
    markets: 'us-markets',
    business: 'finance',
    isBreaking: false,
    tags: ['Goldman Sachs', 'Morgan Stanley', 'mergers and acquisitions', 'investment banking', 'Wall Street']
  },
  {
    title: 'Trump Taps Zuckerberg, Jensen Huang, and Larry Ellison for New AI Technology Council as White House Shapes Industry Policy',
    excerpt: 'President Trump announced the formation of a 24-member Technology Council co-chaired by AI czar David Sacks, recruiting Meta\'s Mark Zuckerberg, Nvidia\'s Jensen Huang, and Oracle\'s Larry Ellison to advise on artificial intelligence policy amid growing fears of AI-driven job displacement.',
    content: [
      {type:'paragraph',content:'President Donald Trump is assembling what may be the most powerful technology advisory body in US government history, appointing Meta CEO Mark Zuckerberg, Nvidia CEO Jensen Huang, and Oracle founder Larry Ellison to a newly formed Technology Council that will shape the administration\'s artificial intelligence policy at a moment when the technology is simultaneously transforming the economy and terrifying Wall Street. The 24-member council will be co-chaired by David Sacks, the venture capitalist and PayPal veteran who serves as Trump\'s AI and crypto policy czar, and will focus on developing a national framework for AI regulation, deployment, and workforce transition.'},
      {type:'paragraph',content:'The announcement comes at a particularly charged moment for the AI industry. Just weeks ago, a viral report from Citrini Research titled "The 2028 Global Intelligence Crisis" painted a dystopian scenario of mass white-collar layoffs and economic collapse driven by AI agents, sparking a massive selloff across technology stocks and pushing the iShares Software ETF (IGV) to a 52-week low. The report, which has amassed over 22 million views on X, warned of a "human intelligence displacement spiral" and forced a national conversation about whether the pace of AI advancement is outstripping society\'s ability to adapt.'},
      {type:'heading',level:2,content:'Tech Titans as Policy Architects'},
      {type:'paragraph',content:'The selection of council members reveals the administration\'s priorities. Zuckerberg brings Meta\'s perspective as the company deploys AI agents across its platforms serving 3.5 billion users, while simultaneously dealing with the fallout from a landmark court verdict finding Meta liable for harm caused by addictive platform design. Huang represents the infrastructure layer — Nvidia\'s GPUs power the vast majority of AI training and inference workloads, and his insight into the capacity buildout is critical for understanding where the technology is heading. Ellison, whose Oracle is rapidly becoming one of the largest cloud infrastructure providers for AI workloads, adds enterprise and government sector expertise.'},
      {type:'paragraph',content:'Other reported members include leaders from Alphabet, Amazon, Apple, Microsoft, and several prominent AI startups. The council\'s mandate is deliberately broad — spanning everything from export controls on AI chips to the development of national AI safety standards and the creation of workforce retraining programs. Notably absent from the membership list are representatives from organized labor, academia, or civil society groups, a gap that critics have seized on as evidence that the council will prioritize industry interests over worker protections.'},
      {type:'heading',level:2,content:'Market Implications'},
      {type:'paragraph',content:'The formation of the Technology Council sent mixed signals to investors. On one hand, the council\'s existence suggests the administration is taking AI governance seriously, which could provide the regulatory clarity that companies need to invest with confidence. On the other hand, the Citrini report\'s warnings about AI-driven job displacement have fundamentally shifted market sentiment — the idea that AI could be a net negative for the economy rather than a productivity miracle has gained mainstream traction for the first time, and no amount of advisory council formation can put that genie back in the bottle. Tech stocks showed muted reactions to the announcement, with investors instead focused on the Iran deadline extension and its implications for oil prices and the broader economic outlook. The council\'s first public meeting is expected in April, where it will deliver preliminary recommendations on AI safety standards, export controls, and workforce impact mitigation.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop&q=80',
    readTime: 6,
    relevantTickers: ['META', 'NVDA', 'ORCL', 'GOOGL', 'MSFT', 'AMZN'],
    seoKeywords: ['Trump AI Technology Council', 'Zuckerberg Jensen Huang Ellison', 'AI policy White House', 'David Sacks AI czar', 'AI regulation 2026', 'Citrini report AI'],
    markets: 'us-markets',
    business: 'tech',
    isBreaking: true,
    tags: ['artificial intelligence', 'Trump', 'technology policy', 'Big Tech', 'regulation']
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
      message: 'Trending articles import complete - March 27 Batch 7 (Late Night)',
      results,
      created: results.filter(r => r.status === 'created').length,
      skipped: results.filter(r => r.status.includes('skipped')).length,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
