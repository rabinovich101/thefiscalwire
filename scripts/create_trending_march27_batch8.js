const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

// 5 Trending Viral Articles - March 27, 2026 (Batch 8)
const articles = [
  {
    title: 'Google TurboQuant AI Breakthrough Crushes Memory Chip Stocks as Samsung and SK Hynix Plunge 6%',
    excerpt: 'Google Research unveiled TurboQuant, a revolutionary compression algorithm that reduces AI memory requirements by 6x, sending memory chip giants Samsung, SK Hynix, and Micron tumbling as investors fear the $180 billion AI hardware boom just hit a software-defined speed bump.',
    content: [
      {type:'paragraph',content:'Google Research dropped a bombshell on the semiconductor industry this week with the unveiling of TurboQuant, a groundbreaking compression algorithm that achieves at least a 6x reduction in key-value cache memory size for large language models — a development that could fundamentally reshape the economics of AI infrastructure and undercut the massive capital expenditure cycle that has powered chip stocks to record highs. The paper, which will be formally presented at ICLR 2026 in April, sent shockwaves through global memory markets on Thursday, with SK Hynix falling 6%, Samsung declining nearly 5%, and Micron extending its brutal losing streak.'},
      {type:'paragraph',content:'The technology works by compressing the KV cache — which stores past calculations so AI models don\'t need to rerun them — from the standard 16 bits per value down to just 3 bits, using a novel two-stage process. The first stage, called PolarQuant, converts data vectors from standard Cartesian coordinates into polar coordinates, separating each vector into a magnitude and angles. The second stage applies Google\'s QJL algorithm using just 1 additional bit to eliminate compression errors. The result is up to 8x faster inference with what Google claims is zero loss in accuracy — and critically, the technique is training-free and data-oblivious, meaning it can be applied immediately to existing models without costly retraining.'},
      {type:'heading',level:2,content:'The Pied Piper of AI'},
      {type:'paragraph',content:'The internet has been quick to draw parallels to the fictional "middle-out compression" from HBO\'s Silicon Valley, with TechCrunch dubbing TurboQuant the "Pied Piper" of AI. The comparison is apt — just as the show\'s fictional algorithm threatened to upend the entire technology stack, TurboQuant has the potential to dramatically reduce the amount of high-bandwidth memory (HBM) chips needed to run large AI models. This is particularly threatening to SK Hynix and Samsung, which together control approximately 95% of the HBM market and have been the biggest beneficiaries of the AI infrastructure buildout.'},
      {type:'paragraph',content:'Goldman Sachs semiconductor analyst Toshiya Hari noted in a research note that if TurboQuant\'s claims hold up in production environments, it could reduce HBM demand growth projections by 15-20% over the next two years — a significant headwind for an industry that has been pricing in near-limitless demand growth. However, Hari cautioned that "compression algorithms have historically underperformed lab benchmarks in real-world deployments," and that the overall growth in AI model sizes and inference demand may still outpace any efficiency gains.'},
      {type:'heading',level:2,content:'Winners and Losers'},
      {type:'paragraph',content:'While memory chip stocks bore the brunt of the selling, the TurboQuant announcement was arguably bullish for cloud computing companies and AI application developers. If AI models can run with 6x less memory, it means more models can be deployed on existing hardware, inference costs drop dramatically, and AI applications become more accessible to smaller companies. Alphabet shares actually rose 1.2% on the news, as investors recognized that Google\'s own cloud business stands to benefit from reduced infrastructure costs. Microsoft and Amazon also ticked higher as the market digested the implications for Azure and AWS. An official open-source release of TurboQuant is expected in Q2 2026, which could accelerate adoption and further pressure memory chip valuations as the market recalibrates its AI hardware demand forecasts.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['GOOGL', 'MU', 'NVDA', 'SSNLF', 'MSFT', 'AMZN'],
    seoKeywords: ['Google TurboQuant', 'AI memory compression', 'memory chip stocks crash', 'Samsung SK Hynix decline', 'Micron stock', 'AI hardware boom'],
    markets: 'us-markets',
    business: 'tech',
    isBreaking: true,
    tags: ['Google', 'artificial intelligence', 'semiconductors', 'memory chips', 'TurboQuant']
  },
  {
    title: 'Pentagon Weighs Sending 10,000 More Combat Troops to Middle East as Iran War Enters Critical Phase',
    excerpt: 'The Pentagon is developing military options for a "final blow" against Iran that could include ground forces and a massive bombing campaign, with the White House considering deploying at least 10,000 additional troops to join the 50,000 already stationed in the region.',
    content: [
      {type:'paragraph',content:'The Pentagon is considering sending at least 10,000 additional combat troops to the Middle East in the coming days as the United States military buildup against Iran enters its most aggressive phase yet, according to multiple defense officials familiar with the planning. The potential deployment — which would bring the total US force in the region to approximately 60,000 — comes as military planners develop options for what officials have described as a "final blow" that could include the deployment of ground forces inside Iranian territory and a massive aerial bombing campaign targeting the country\'s military and energy infrastructure.'},
      {type:'paragraph',content:'The 82nd Airborne Division has already received written orders to deploy between 2,000 and 3,000 paratroopers from its Immediate Response Force, which can mobilize worldwide within 18 hours. Combined with two Marine Expeditionary Units already moving toward the Persian Gulf, the deployment could bring 6,000 to 8,000 US ground troops into close proximity to Iran within the week. The additional 10,000 troops under consideration would significantly expand the military\'s options beyond air and naval operations.'},
      {type:'heading',level:2,content:'Market Impact: Defense Stocks Surge'},
      {type:'paragraph',content:'Defense stocks have been among the few bright spots in a brutal month for equities. Lockheed Martin has gained 12% since the conflict began on February 28, while Northrop Grumman is up 15% and RTX Corporation has risen 9%. The iShares U.S. Aerospace & Defense ETF (ITA) is outperforming the S&P 500 by more than 20 percentage points in March alone. Analysts at Jefferies raised their price targets on all major defense contractors this week, citing the "structural increase in defense spending that the Iran conflict has accelerated" and noting that the Pentagon\'s emergency supplemental budget request of $45 billion — submitted to Congress last week — signals a sustained commitment to military operations in the region.'},
      {type:'paragraph',content:'The flip side of the military buildup is its economic cost and market implications. Oil prices have already surged more than 35% since the conflict began, with Brent crude touching $108 per barrel this week. Every $10 increase in oil prices is estimated to shave approximately 0.3% off US GDP growth, meaning the conflict has already knocked roughly a full percentage point off economic growth projections for 2026. The S&P 500 has declined 8.3% since February 28, with consumer discretionary and transportation stocks bearing the heaviest losses.'},
      {type:'heading',level:2,content:'Diplomatic Window Narrowing'},
      {type:'paragraph',content:'The troop buildup creates a paradox for diplomacy. While President Trump extended his deadline for Iran to agree to peace terms by 10 days to April 6, the simultaneous military escalation signals that the administration is preparing for a scenario where talks fail. Iran formally rejected the US 15-point ceasefire proposal this week, countering with demands for security guarantees and sovereign control over the Strait of Hormuz — conditions the US has called non-starters. Pakistan, which is mediating between the two sides, has warned that the window for a negotiated settlement is "rapidly closing." For investors, the calculus is stark: a diplomatic resolution could trigger one of the biggest relief rallies in recent market history, while a military escalation could send oil above $130 and push the US economy into recession. The VIX, Wall Street\'s fear gauge, remains elevated at 24.5, reflecting this binary outcome.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1580752300992-559f8e9cc97a?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['LMT', 'NOC', 'RTX', 'GD', 'ITA', 'XLE'],
    seoKeywords: ['Pentagon troops Middle East', '82nd Airborne Iran', 'US military buildup Iran', 'defense stocks surge', 'Iran war escalation', 'Trump Iran military'],
    markets: 'us-markets',
    business: 'economy',
    isBreaking: true,
    tags: ['Iran war', 'Pentagon', 'military', 'defense stocks', 'Middle East']
  },
  {
    title: 'Trump Signature to Appear on US Dollar Bills in Historic First as Treasury Breaks 165-Year Tradition',
    excerpt: 'The US Treasury announced that President Trump\'s signature will replace the Treasurer\'s on all paper currency for the first time in 165 years, with the first $100 bills bearing Trump\'s name alongside Treasury Secretary Bessent set for production in June.',
    content: [
      {type:'paragraph',content:'In a move that has no precedent in American history, the US Department of the Treasury announced Thursday that President Donald Trump\'s signature will appear on all future US paper currency, replacing the Treasurer of the United States\' signature for the first time in 165 years. The decision, framed as a celebration of America\'s 250th anniversary, will see Trump\'s distinctive signature alongside that of Treasury Secretary Scott Bessent on bills ranging from $1 to $100, with the first production run of the redesigned $100 notes scheduled for June 2026.'},
      {type:'paragraph',content:'Treasury Secretary Bessent declared that "there is no more powerful way to recognize the historic achievements of our great country and President Donald J. Trump than US dollar bills bearing his name." The announcement immediately drew comparisons to currency practices in authoritarian regimes where sitting leaders\' images or signatures appear on banknotes, a criticism that Bessent dismissed as "partisan noise" during a press conference. The Bureau of Engraving and Printing confirmed that existing currency will remain legal tender and that the new designs will enter circulation through normal Federal Reserve distribution channels.'},
      {type:'heading',level:2,content:'Currency Markets React'},
      {type:'paragraph',content:'Foreign exchange markets showed a muted reaction to the announcement, with the US Dollar Index (DXY) actually ticking up 0.15% on the day as traders focused more on the Iran ceasefire deadline extension than on the symbolic currency change. However, currency strategists at Deutsche Bank noted in a research note that the move "introduces an uncomfortable precedent that could, over time, erode confidence in the institutional independence of US monetary policy" — a concern that carries weight given the dollar\'s status as the world\'s reserve currency. The greenback has already weakened 3.2% against a basket of major currencies in 2026, driven primarily by inflation concerns and geopolitical uncertainty, and any perception that the currency is being "politicized" could accelerate that trend.'},
      {type:'paragraph',content:'The numismatic and collectibles market responded with considerably more enthusiasm. Within hours of the announcement, pre-order listings for the first Trump-signed bills appeared on eBay and specialized currency dealer websites, with projected premiums of 200-500% above face value for uncirculated notes from the initial production run. Publicly traded collectibles platform Rally saw its stock rise 8% on speculation that the Trump bills could become one of the most sought-after currency collectibles in modern American history.'},
      {type:'heading',level:2,content:'Political and Economic Implications'},
      {type:'paragraph',content:'The signature change has broader implications beyond symbolism. The Treasurer\'s signature has appeared on US currency since 1861, and replacing it with the President\'s breaks a tradition that was deliberately designed to separate the nation\'s currency from any single political figure. Former Treasury officials from both parties expressed concern about the precedent, noting that the move could invite future presidents to make increasingly bold claims on the nation\'s financial instruments. For the markets, the primary concern is whether the move signals a broader willingness by the administration to blur the lines between political authority and financial institutions — a pattern that has historically been associated with currency weakness and capital flight in other countries. For now, however, the dollar\'s fundamental strength as the world\'s reserve currency and the safe-haven demand driven by the Iran conflict are providing a floor under the greenback.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['UUP', 'DXY', 'GLD', 'TLT', 'BTC-USD', 'SLV'],
    seoKeywords: ['Trump signature dollar bills', 'US currency Trump', 'Treasury dollar bills president', 'Trump paper currency', 'dollar bill signature change', 'Scott Bessent Treasury'],
    markets: 'us-markets',
    business: 'economy',
    isBreaking: true,
    tags: ['Trump', 'US dollar', 'Treasury', 'currency', 'monetary policy']
  },
  {
    title: 'Micron Stock Sinks 22% From All-Time High Despite Record Revenue as Google TurboQuant and AI Fears Collide',
    excerpt: 'Micron Technology has plunged 22% from its March 18 all-time high in just six trading days despite reporting record quarterly revenue, as Google\'s TurboQuant memory compression breakthrough and rising capital expenditure guidance create a perfect storm for the memory chip giant.',
    content: [
      {type:'paragraph',content:'Micron Technology shares extended their brutal slide on Thursday, falling another 5% and bringing the total decline from the stock\'s March 18 all-time high to a staggering 22% in just six trading days. The collapse is all the more remarkable given that Micron had just reported record fiscal second-quarter revenue, with sales nearly tripling year-over-year on the back of insatiable demand for high-bandwidth memory (HBM) chips used in AI data centers. Yet a confluence of negative catalysts — from Google\'s TurboQuant compression breakthrough to Micron\'s own capital expenditure guidance — has turned what should have been a triumphant earnings report into a cautionary tale about the fragility of the AI hardware trade.'},
      {type:'paragraph',content:'The earnings report itself was objectively strong. Revenue nearly tripled compared to the year-ago period, driven by HBM chip shipments that exceeded analyst expectations by 15%. Micron\'s HBM market share has expanded to approximately 25%, up from less than 5% a year ago, as the company has successfully ramped production of its latest-generation HBM3E chips for Nvidia\'s Blackwell GPU platform. The company also guided for continued revenue growth in the fiscal third quarter, projecting sales above consensus estimates.'},
      {type:'heading',level:2,content:'What Spooked the Market'},
      {type:'paragraph',content:'Three factors converged to trigger the selloff. First, Micron announced a large debt repurchase tender offer alongside the earnings, raising questions about management\'s confidence in the stock at current levels and the need for balance sheet restructuring. Second, and more concerning, the company significantly raised its capital expenditure guidance for fiscal 2026, signaling that maintaining its competitive position in HBM will require far more investment than previously anticipated. Higher capex means lower free cash flow and puts near-term profitability under pressure, even as long-term demand appears solid.'},
      {type:'paragraph',content:'The third and most damaging blow came from outside the company entirely. Google Research\'s TurboQuant paper, published on Tuesday, demonstrated a technique that reduces the key-value cache memory requirements of large language models by 6x — a development that threatens to undercut the demand growth projections that have justified Micron\'s premium valuation. If AI models can achieve comparable performance with dramatically less memory, the explosive HBM demand curve that Wall Street has been pricing into chip stocks may flatten significantly.'},
      {type:'heading',level:2,content:'Analysts Divided on the Bottom'},
      {type:'paragraph',content:'Wall Street is split on whether the selloff represents a buying opportunity or the beginning of a deeper correction. Bulls argue that the overall growth in AI model deployment will more than offset any efficiency gains from compression techniques, and that Micron\'s improving competitive position in HBM creates a long-term structural advantage. Raymond James maintained its outperform rating, noting that "compression algorithms have historically underperformed lab benchmarks in production, and actual HBM demand continues to outstrip supply." Bears counter that the combination of rising capex, potential demand destruction from TurboQuant, and the broader risk-off environment driven by the Iran conflict creates too many headwinds for a stock that was trading at 8x forward sales at its peak. The stock is now trading at roughly 6x forward sales — still expensive by historical standards for a cyclical semiconductor company, suggesting further downside if the AI narrative continues to deteriorate.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['MU', 'NVDA', 'GOOGL', 'SSNLF', 'AVGO', 'AMD'],
    seoKeywords: ['Micron stock crash', 'MU stock decline', 'Micron earnings revenue', 'memory chip stocks', 'Google TurboQuant Micron', 'HBM demand AI'],
    markets: 'us-markets',
    business: 'tech',
    isBreaking: false,
    tags: ['Micron', 'semiconductors', 'memory chips', 'AI hardware', 'earnings']
  },
  {
    title: 'Tech Stocks Have Lost Over $1 Trillion in Value in 2026 as AI Bubble Fears and Iran Crisis Create Perfect Storm',
    excerpt: 'Technology stocks have shed more than $1 trillion in market value year-to-date as the combination of the Iran war, Google\'s memory compression breakthrough, and the viral Citrini "Global Intelligence Crisis" report have transformed the AI narrative from growth miracle to existential threat.',
    content: [
      {type:'paragraph',content:'The technology sector has officially entered crisis mode, with more than $1 trillion in market value evaporated from US tech stocks since the start of 2026 as a toxic combination of geopolitical chaos, an AI paradigm shift, and a fundamental reassessment of the sector\'s growth narrative have triggered the worst stretch for technology shares since the 2022 bear market. The Nasdaq Composite has declined more than 10% from its January highs, officially entering correction territory, while the iShares Software ETF (IGV) sits at a 52-week low and the Philadelphia Semiconductor Index has given back six months of gains in just three weeks.'},
      {type:'paragraph',content:'The selloff has been remarkably broad-based, ensnaring companies across the entire technology spectrum. The "Magnificent Seven" mega-caps have collectively lost approximately $600 billion in market value, with Tesla down 28%, Apple declining 15%, and Meta falling 12% as the social media giant contends with both the market downturn and the landmark California jury verdict finding it liable for social media addiction harms. Even Nvidia, which briefly touched $1,000 per share in intraday trading before the correction, has pulled back significantly as investors question whether the AI infrastructure buildout can maintain its breakneck pace.'},
      {type:'heading',level:2,content:'Three Crises Converge'},
      {type:'paragraph',content:'The tech rout is being driven by three distinct but interconnected crises. The Iran conflict, which began with US air strikes on February 28, has sent oil prices surging 35% and created a risk-off environment that disproportionately punishes high-multiple growth stocks. The Federal Reserve\'s inability to cut rates amid rising inflation expectations — there is now only an 8% probability of a rate cut at the next meeting, down from 65% at the start of the year — has removed a key pillar of support for tech valuations. And the narrative around AI itself has shifted dramatically, with Google\'s TurboQuant compression breakthrough suggesting that AI hardware demand may be overstated, while the viral Citrini Research report warning of mass AI-driven job losses has introduced a new bear case: that AI could actually destroy more economic value than it creates.'},
      {type:'paragraph',content:'The Citrini report, titled "The 2028 Global Intelligence Crisis," has become the most-discussed research note in recent Wall Street history, amassing over 22 million views on X and sparking a $611 billion selloff across 164 technology stocks when it was published earlier this month. Its thesis — that AI agents will displace millions of white-collar workers faster than the economy can absorb them — has fundamentally changed the way investors think about AI, transforming it from a universal growth driver into a potential source of systemic risk.'},
      {type:'heading',level:2,content:'Where Do Tech Stocks Go From Here?'},
      {type:'paragraph',content:'The critical question for investors is whether the $1 trillion tech wipeout represents a healthy correction that creates buying opportunities, or the beginning of a longer bear market driven by a genuine reassessment of AI\'s economic impact. Historical precedent offers some comfort — the sector has recovered from every significant correction within 12-18 months — but the current environment is uniquely challenging because the headwinds are both cyclical (Iran, oil, rates) and structural (AI efficiency gains, workforce displacement fears). Morgan Stanley\'s chief US equity strategist noted that the tech sector is now trading at 25x forward earnings, down from 30x at the January peak but still well above the long-term average of 20x, suggesting that valuations have not yet fully reflected the deteriorating outlook. Until either the Iran crisis resolves or the AI narrative stabilizes, tech stocks are likely to remain in the penalty box.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&h=630&fit=crop&q=80',
    readTime: 6,
    relevantTickers: ['QQQ', 'IGV', 'SOXX', 'AAPL', 'TSLA', 'META'],
    seoKeywords: ['tech stocks $1 trillion loss', 'Nasdaq correction 2026', 'AI bubble burst', 'technology selloff', 'Citrini report AI crisis', 'tech stock crash March 2026'],
    markets: 'us-markets',
    business: 'tech',
    isBreaking: false,
    tags: ['technology', 'Nasdaq', 'AI bubble', 'stock market', 'correction']
  }
];

async function main() {
  console.log('=== Creating 5 Trending Articles - March 27, 2026 (Batch 8) ===\n');

  // Get authors
  const authors = await prisma.author.findMany({ take: 10 });
  if (authors.length === 0) {
    console.error('No authors found!');
    process.exit(1);
  }
  console.log(`Found ${authors.length} authors\n`);

  let created = 0;

  for (const article of articles) {
    const author = authors[Math.floor(Math.random() * authors.length)];
    const slug = generateSlug(article.title);

    // Check if slug already exists
    const existing = await prisma.article.findUnique({ where: { slug }, select: { id: true } });
    if (existing) {
      console.log(`SKIP (already exists): ${article.title.substring(0, 60)}...`);
      continue;
    }

    // Get or create categories
    let marketsCat = await prisma.category.findUnique({ where: { slug: article.markets } });
    if (!marketsCat) {
      marketsCat = await prisma.category.create({
        data: { name: article.markets.replace(/-/g, ' '), slug: article.markets, color: 'bg-blue-600' }
      });
    }

    let businessCat = await prisma.category.findUnique({ where: { slug: article.business } });
    if (!businessCat) {
      businessCat = await prisma.category.create({
        data: { name: article.business.replace(/-/g, ' '), slug: article.business, color: 'bg-green-600' }
      });
    }

    // Get or create tags
    const tagConnections = [];
    for (const tagName of (article.tags || []).slice(0, 5)) {
      const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      if (!tagSlug) continue;
      let tag = await prisma.tag.findUnique({ where: { slug: tagSlug } });
      if (!tag) {
        tag = await prisma.tag.create({ data: { name: tagName, slug: tagSlug } });
      }
      tagConnections.push({ id: tag.id });
    }

    // Create article
    const newArticle = await prisma.article.create({
      data: {
        title: article.title,
        slug,
        excerpt: article.excerpt,
        content: article.content,
        imageUrl: article.imageUrl,
        publishedAt: new Date(),
        readTime: article.readTime,
        isFeatured: false,
        isBreaking: article.isBreaking || false,
        relevantTickers: article.relevantTickers || [],
        seoKeywords: article.seoKeywords || [],
        isAiEnhanced: true,
        authorId: author.id,
        marketsCategoryId: marketsCat.id,
        businessCategoryId: businessCat.id,
        categories: {
          connect: [{ id: marketsCat.id }, { id: businessCat.id }]
        },
        tags: {
          connect: tagConnections
        }
      }
    });

    console.log(`CREATED: ${newArticle.title.substring(0, 60)}... (ID: ${newArticle.id})`);
    created++;
  }

  console.log(`\n=== Done! Created ${created} articles ===`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error('Error:', e);
    prisma.$disconnect();
    process.exit(1);
  });
