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

// 5 Trending Financial News Articles - March 27, 2026
const articles = [
  {
    title: 'OECD Warns Iran War Will Push US Inflation to 4.2% in 2026, Sharply Above Fed Target',
    excerpt: 'The OECD dramatically raised its US inflation forecast from 2.6% to 4.2% for 2026, citing surging energy costs from the Iran conflict that have sent oil prices up 55% since hostilities began.',
    content: [
      {type:'paragraph',content:'The Organization for Economic Cooperation and Development delivered a stark warning on Wednesday, projecting that U.S. inflation will surge to 4.2% in 2026 — nearly double its previous December forecast of 2.6% — as the ongoing war with Iran continues to disrupt global energy markets and push commodity prices sharply higher. The revised outlook represents one of the most dramatic upward revisions in OECD forecasting history and underscores how rapidly the geopolitical landscape has reshaped the economic trajectory.'},
      {type:'paragraph',content:'The Paris-based organization cited the disruption in energy markets as the primary driver, noting that Brent crude oil prices have surged roughly 55% from levels just before U.S. strikes on Iran began, with futures recently settling at $108.01 per barrel. West Texas Intermediate crude climbed to $94.48, levels not seen since the 2022 energy crisis. The OECD warned that "inflation pressures will persist for longer" and that its projections could worsen further if the Strait of Hormuz remains disrupted for a prolonged period.'},
      {type:'heading',level:2,content:'Global Impact Spreads Beyond US Borders'},
      {type:'paragraph',content:'The inflation shock is not limited to the United States. The OECD predicted that the average inflation rate across G20 countries would rise to 4% in 2026, up sharply from its December projection of 2.8%. European economies face particularly acute pressure given their higher dependence on Middle Eastern energy supplies, while emerging markets with large energy import bills are seeing currency depreciation compound the inflationary impact.'},
      {type:'paragraph',content:'The Federal Reserve now faces an agonizing policy dilemma. With inflation running well above the 2% target and energy costs showing no signs of moderating, rate cuts that markets had hoped for appear increasingly unlikely. At the same time, the economy is showing clear signs of deceleration, with Q4 2025 GDP revised down to just 0.7% annualized growth. The specter of stagflation — persistent inflation combined with economic stagnation — looms large over monetary policy decisions.'},
      {type:'heading',level:2,content:'Silver Lining for 2027'},
      {type:'paragraph',content:'The OECD report did offer some medium-term optimism, projecting U.S. inflation will fall sharply to 1.7% in 2027 as energy market disruptions ease and the base effects of the current price surge wash through the data. However, that projection assumes a relatively swift resolution to the Iran conflict and a normalization of global shipping routes — outcomes that remain far from certain given the current trajectory of hostilities.'},
      {type:'paragraph',content:'Markets have responded by pricing in a prolonged period of elevated interest rates, with fed funds futures now reflecting no rate cuts until at least the fourth quarter of 2026. Treasury yields have climbed across the curve, with the 10-year note hovering near 4.8%, while the dollar has strengthened against most major currencies as investors seek the relative safety of U.S. government debt despite the deteriorating inflation outlook.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['SPY', 'TLT', 'USO', 'DXY', 'GLD'],
    seoKeywords: ['OECD inflation forecast', 'Iran war economic impact', 'US inflation 2026', 'oil prices', 'Federal Reserve', 'stagflation'],
    markets: 'us-markets',
    business: 'economy',
    isBreaking: true,
    tags: ['inflation', 'OECD', 'Iran war', 'oil prices', 'Federal Reserve']
  },
  {
    title: 'SpaceX Prepares Historic $1.75 Trillion IPO Filing, Poised to Become Largest Public Offering Ever',
    excerpt: 'SpaceX is preparing a confidential IPO filing with the SEC that could value the company at over $1.75 trillion, with Bank of America, Goldman Sachs, JPMorgan, and Morgan Stanley tapped for senior roles.',
    content: [
      {type:'paragraph',content:'SpaceX is on the verge of making market history as the Elon Musk-led aerospace company prepares to submit its draft IPO registration to the U.S. Securities and Exchange Commission, potentially as soon as this week. The offering could seek a valuation exceeding $1.75 trillion, which would make it the largest initial public offering in history by a wide margin, dwarfing Saudi Aramco\'s $29.4 billion IPO in 2019 and eclipsing the combined value of most publicly traded aerospace companies.'},
      {type:'paragraph',content:'The company has assembled a heavyweight roster of investment banks to manage the offering, tapping Bank of America Corp., Goldman Sachs Group Inc., JPMorgan Chase & Co., and Morgan Stanley for senior underwriting roles. In a memo to employees, SpaceX leadership indicated the IPO proceeds would fund an "insane flight rate" for its developmental Starship rocket, artificial intelligence data centers in space, and a base on the Moon — ambitions that have captured the imagination of both retail and institutional investors.'},
      {type:'heading',level:2,content:'Ripple Effects Across Space-Linked Stocks'},
      {type:'paragraph',content:'The mere prospect of a SpaceX IPO has already sent shockwaves through the market. Satellite communications provider EchoStar Corp. saw its shares surge as much as 10% after The Information reported the filing could come this week. EchoStar holds approximately a 3% stake in SpaceX, acquired through phased transactions involving wireless spectrum sales worth $8.5 billion in cash and $11 billion in SpaceX stock. The rally highlights how investors are scrambling for any publicly traded vehicle that offers indirect exposure to SpaceX.'},
      {type:'paragraph',content:'Other space-adjacent stocks have also rallied on the news, with companies across the satellite, launch services, and space infrastructure sectors seeing elevated trading volumes. Analysts note that a successful SpaceX IPO could catalyze a broader rerating of the entire space economy, similar to how Tesla\'s market success in 2020 sparked a wave of EV-related IPOs and SPAC deals.'},
      {type:'heading',level:2,content:'Valuation Debate Intensifies'},
      {type:'paragraph',content:'Not everyone is convinced the $1.75 trillion valuation is justified. Skeptics point to the capital-intensive nature of space operations, regulatory risks, and the company\'s heavy dependence on government contracts. However, bulls argue that SpaceX\'s Starlink satellite internet division alone could justify a significant portion of the valuation, with the service now boasting over 5 million subscribers globally and generating recurring revenue that resembles a high-growth telecom business.'},
      {type:'paragraph',content:'The timing of the IPO adds another layer of complexity. With equity markets under pressure from the Iran conflict and recession fears, SpaceX would need to navigate choppy waters to achieve its target valuation. However, some bankers argue that the offering could actually benefit from the current environment, as investors hungry for growth stories may flock to what could be the defining IPO of the decade. The filing, once submitted, would trigger a quiet period before a potential roadshow later this year.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['SATS', 'BA', 'LMT', 'RKLB', 'LUNR'],
    seoKeywords: ['SpaceX IPO', 'SpaceX valuation', 'Elon Musk', 'EchoStar', 'space stocks', 'IPO 2026'],
    markets: 'us-markets',
    business: 'tech',
    isBreaking: true,
    tags: ['SpaceX', 'IPO', 'Elon Musk', 'EchoStar', 'space economy']
  },
  {
    title: 'Arm Holdings Explodes 16% After Unveiling AGI CPU, Its First-Ever In-House Chip',
    excerpt: 'Arm Holdings surged 16.4% after revealing its first proprietary chip — the AGI CPU — targeting AI data centers, with Meta as its first major customer and a $15 billion revenue target by 2031.',
    content: [
      {type:'paragraph',content:'Arm Holdings delivered a seismic shift in the semiconductor industry this week, with shares surging 16.4% on Wednesday in the stock\'s most explosive single-day gain since its 2023 IPO. The catalyst: the company\'s unveiling of the "Arm AGI CPU," its first-ever proprietary chip designed specifically for artificial intelligence inference and training workloads in data centers. The announcement marks a fundamental transformation of Arm\'s business model, as the company pivots from a pure intellectual property licensor to a direct manufacturer and seller of branded silicon.'},
      {type:'paragraph',content:'CEO Rene Haas laid out an ambitious roadmap at the company\'s event in San Francisco, projecting that the AGI CPU alone would generate $15 billion in annual revenue by 2031, with total company revenue reaching $25 billion and earnings per share of $9. To put those numbers in context, Arm generated approximately $4 billion in annual revenue in 2025, meaning the new chip business alone would represent nearly four times the company\'s current total revenue base.'},
      {type:'heading',level:2,content:'Meta Signs On as Anchor Customer'},
      {type:'paragraph',content:'In a major vote of confidence, Meta Platforms was revealed as the first major customer for the Arm AGI CPU. The partnership underscores the growing appetite among hyperscale data center operators for alternatives to traditional x86 server chips from Intel and AMD, particularly for AI-specific workloads where power efficiency is paramount. Arm claims the new processor offers a 40% improvement in performance-per-watt compared to current-generation server offerings — a metric that translates directly to lower operating costs for cloud infrastructure providers.'},
      {type:'paragraph',content:'The strategic pivot has not been without controversy. By entering the chip manufacturing business, Arm risks alienating its existing licensees — companies like Qualcomm, MediaTek, and Samsung that pay royalties to use Arm\'s architecture in their own chip designs. Analysts describe the move as abandoning Arm\'s longstanding "Switzerland" status in the semiconductor ecosystem. However, proponents argue the AI data center market is large enough to accommodate both Arm\'s licensing business and its new direct sales channel.'},
      {type:'heading',level:2,content:'Semiconductor Sector Sees Divergent Fortunes'},
      {type:'paragraph',content:'Arm\'s surge came against a backdrop of broad weakness in the semiconductor sector, with the Philadelphia Semiconductor Index declining more than 12% from its February highs. The divergence highlights how investors are increasingly differentiating between companies with clear AI growth catalysts and those facing cyclical headwinds. AMD fell 6.35% and Intel declined 3.2% on the same day Arm rallied, as both companies now face a potentially formidable new competitor in the data center market.'},
      {type:'paragraph',content:'Wall Street responded with a flurry of price target increases, with several analysts raising their targets above $200. The stock has now recovered roughly half the losses it sustained during the broader tech selloff that began in late February. Trading volume on the day of the announcement exceeded five times the 30-day average, reflecting the magnitude of investor interest in what many are calling a paradigm shift in the semiconductor industry.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['ARM', 'META', 'NVDA', 'AMD', 'INTC', 'QCOM'],
    seoKeywords: ['Arm Holdings', 'AGI CPU', 'AI chip', 'data center', 'semiconductors', 'Meta'],
    markets: 'us-markets',
    business: 'tech',
    isBreaking: false,
    tags: ['ARM Holdings', 'AGI CPU', 'artificial intelligence', 'semiconductors', 'Meta']
  },
  {
    title: 'S&P 500 Hits Four-Month Low as Oil Surges Past $108, Nasdaq Officially Enters Correction',
    excerpt: 'The S&P 500 fell 1.74% to a four-month low while the Nasdaq Composite dropped 2.38% into correction territory as Iran peace talk hopes collapsed and crude oil surged to $108 per barrel.',
    content: [
      {type:'paragraph',content:'U.S. equities suffered another punishing session on Thursday as hopes for an imminent U.S.-Iran ceasefire evaporated, sending crude oil prices surging and triggering a broad-based selloff that pushed the S&P 500 to its lowest level in four months. The benchmark index fell 1.74% to close at 6,477.16, while the Dow Jones Industrial Average shed 469 points, or 1.01%, to finish at 45,960.11. The technology-heavy Nasdaq Composite bore the brunt of the selling, plunging 2.38% to 21,408.08 — officially entering correction territory at more than 10% below its recent highs.'},
      {type:'paragraph',content:'The catalyst for the renewed selling was President Trump\'s indication that he would not commit to a ceasefire agreement with Iran, dashing hopes that had briefly lifted markets earlier in the week when reports emerged that Pakistan had delivered a 15-point U.S. peace plan to Tehran. Iran\'s subsequent statement that it had "no intention of holding direct talks with the United States" sealed the bearish sentiment. Brent crude futures jumped 5.66% to settle at $108.01 per barrel, while West Texas Intermediate climbed 4.61% to $94.48.'},
      {type:'heading',level:2,content:'Tech Megacaps Lead the Selloff'},
      {type:'paragraph',content:'The technology sector was ground zero for the risk-off trade, with several megacap names posting significant losses. Meta Platforms fell 7%, Advanced Micro Devices declined 6.35%, and Micron Technology dropped 5.49%. Nvidia slipped 2.82% to $173.65, while Alphabet lost 2.72% to close at $283.02. The tech selloff reflected a broader rotation out of high-multiple growth stocks as investors recalibrated valuations in light of potentially higher-for-longer interest rates driven by energy-fueled inflation.'},
      {type:'heading',level:2,content:'Labor Market Sends Mixed Signals'},
      {type:'paragraph',content:'The economic data provided a mixed picture. Initial unemployment claims rose to a seasonally adjusted 210,000 for the week ended March 21, up 5,000 from the prior period. However, continuing claims declined by 32,000 to 1.82 million — the lowest level since May 2024 — suggesting the labor market remains resilient even as other economic indicators deteriorate. Economists cautioned that the labor market typically lags broader economic shifts and may not fully reflect the impact of surging energy costs on business hiring decisions.'},
      {type:'paragraph',content:'Investors have responded to the mounting uncertainty by dramatically increasing their cash positions. Money market fund assets surged by $38.68 billion in a single week to reach a record $7.86 trillion, reflecting a risk-off mindset not seen since the early days of the pandemic. Gold rallied to new highs while defensive sectors including utilities and consumer staples outperformed. Market strategists warned that the S&P 500 is now on track to finish the first quarter in negative territory, a relatively uncommon occurrence that has historically signaled continued volatility ahead.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop&q=80',
    readTime: 4,
    relevantTickers: ['SPY', 'QQQ', 'META', 'AMD', 'MU', 'NVDA', 'GOOGL'],
    seoKeywords: ['S&P 500', 'stock market selloff', 'Nasdaq correction', 'oil prices', 'Iran war', 'market crash'],
    markets: 'us-markets',
    business: 'finance',
    isBreaking: false,
    tags: ['stock market', 'S&P 500', 'Nasdaq', 'oil prices', 'market correction']
  },
  {
    title: 'US GDP Revised Down to 0.7% as Consumer Sentiment Plunges to Recessionary Lows',
    excerpt: 'The Bureau of Economic Analysis revised Q4 2025 GDP sharply lower to 0.7% annualized growth, while consumer sentiment surveys show recessionary readings not seen since the 2008 financial crisis.',
    content: [
      {type:'paragraph',content:'The U.S. economy is flashing increasingly urgent warning signals as the Bureau of Economic Analysis revised fourth-quarter 2025 GDP growth sharply lower to just 0.7% at an annualized rate — down from the initial estimate of 1.4% — reflecting weaker-than-expected consumer spending, exports, and government outlays. The revision paints a picture of an economy that was already losing momentum before the Iran conflict sent energy prices surging, raising the probability that the current quarter could see near-zero or even negative growth.'},
      {type:'paragraph',content:'Full-year 2025 GDP growth came in at just 2.1%, the weakest annual pace since the pandemic year of 2020 and, excluding that outlier, the slowest expansion since 2016. The deceleration was broad-based, with consumer spending — which accounts for roughly 70% of economic output — growing at its slowest rate in two years during the fourth quarter. Business investment also softened, with companies pulling back on capital expenditures amid trade policy uncertainty and rising input costs.'},
      {type:'heading',level:2,content:'Consumer Confidence in Freefall'},
      {type:'paragraph',content:'Perhaps more alarming than the backward-looking GDP data is the dramatic deterioration in forward-looking consumer sentiment indicators. The University of Michigan\'s consumer sentiment index for current economic conditions hit an all-time low in its most recent reading, with the Iran war delivering a significant blow to household confidence. A March survey by consumer finance site NerdWallet found that 65% of respondents now expect a recession within the next 12 months, up 6 percentage points from February.'},
      {type:'paragraph',content:'Major retailers are already sounding the alarm. Both Walmart and Target have warned of what executives are calling a "hiring recession," noting that while affluent consumers continue to spend on discretionary items, middle-income and lower-income households are pulling back sharply. The divergence between high-end and mass-market retail performance has widened to levels not seen since the 2008 financial crisis, suggesting the economic pain is being felt most acutely by the consumers who can least afford it.'},
      {type:'heading',level:2,content:'Wall Street Raises Recession Odds'},
      {type:'paragraph',content:'The mounting evidence of economic deterioration has prompted a wave of recession probability upgrades on Wall Street. Mark Zandi, chief economist at Moody\'s Analytics, stated that "recession risks are uncomfortably high and on the rise," reflecting a growing consensus among economists that the combination of elevated energy costs, declining consumer confidence, and tightening financial conditions could tip the economy into contraction.'},
      {type:'paragraph',content:'The third and final estimate of Q4 2025 GDP, along with the University of Michigan\'s final March consumer sentiment reading, are due Friday and could further darken the economic outlook. Fed Chair Jerome Powell faces an increasingly impossible balancing act: inflation running at levels that argue against rate cuts, while growth indicators scream for monetary stimulus. Treasury markets have reflected this tension, with the yield curve oscillating between inversion and steepening as traders struggle to price competing economic scenarios.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['SPY', 'TLT', 'WMT', 'TGT', 'XLP'],
    seoKeywords: ['GDP growth', 'consumer sentiment', 'recession', 'US economy', 'consumer spending', 'stagflation'],
    markets: 'us-markets',
    business: 'economy',
    isBreaking: false,
    tags: ['GDP', 'consumer sentiment', 'recession', 'US economy', 'economic slowdown']
  }
];

async function main() {
  console.log('=== Creating 5 Trending Articles - March 27, 2026 ===\n');

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
