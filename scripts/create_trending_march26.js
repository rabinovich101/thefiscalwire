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

// 5 Trending Financial News Articles - March 26, 2026
const articles = [
  {
    title: 'S&P 500 Drops to Four-Month Low as Oil Prices Surge on US-Iran Standoff',
    excerpt: 'The S&P 500 hit a four-month low as crude oil surged past $108 on US-Iran tensions, with the Nasdaq entering correction territory.',
    content: [
      {type:'paragraph',content:'The S&P 500 fell 1.72% on Thursday to close at 6,478.41, marking its lowest level since late November 2025, as escalating tensions between the United States and Iran sent crude oil prices surging and rattled investor confidence across global markets. The broad-based selloff hit technology stocks particularly hard, with the Nasdaq Composite tumbling 2.38% to end at 21,408.08, officially entering correction territory at more than 10% below its recent highs.'},
      {type:'paragraph',content:'The Dow Jones Industrial Average shed 470 points, or 1.01%, to finish the session at 45,959.43. The selling intensified after President Donald Trump indicated he would not commit to a ceasefire agreement with Iran, dashing hopes that had briefly lifted markets earlier in the week. Brent crude futures jumped 5.66% to settle at $108.01 per barrel, while West Texas Intermediate climbed 4.61% to $94.48, adding to fears that persistently high energy costs could tip the economy into a stagflationary environment.'},
      {type:'heading',level:2,content:'Tech Megacaps Hit Hard'},
      {type:'paragraph',content:'Technology megacaps bore the brunt of the selling pressure, with Meta Platforms falling 7%, Advanced Micro Devices declining 6.35%, and Micron Technology dropping 5.49%. Nvidia slipped 2.82% to $173.65, while Alphabet lost 2.72% to close at $283.02. Microsoft managed a comparatively modest decline of 0.69%, ending at $368.49. The tech-heavy selloff reflected a broader rotation out of risk assets as investors grappled with the prospect of higher input costs and tighter financial conditions.'},
      {type:'paragraph',content:'The labor market provided a mixed picture, with initial unemployment claims rising to a seasonally adjusted 210,000 for the week ended March 21, while continuing claims declined by 32,000 to 1.82 million - the lowest level since May 2024. Economists noted the divergence suggests the employment picture remains resilient for now but could deteriorate if energy-driven inflation forces the Federal Reserve to maintain or tighten monetary policy.'},
      {type:'paragraph',content:'Market strategists warned that the combination of geopolitical uncertainty and rising energy costs could extend the current downturn. The S&P 500 is now on track to finish the first quarter in negative territory, a relatively uncommon occurrence that historically has signaled continued volatility in the months ahead. Investors have been moving into cash at a record pace, with money market fund assets reaching $7.86 trillion after inflows of $38.68 billion in the most recent week.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop&q=80',
    readTime: 4,
    relevantTickers: ['SPY', 'QQQ', 'META', 'AMD', 'MU', 'NVDA', 'GOOGL', 'MSFT'],
    seoKeywords: ['S&P 500', 'stock market crash', 'oil prices', 'US Iran tensions', 'Nasdaq correction', 'market selloff'],
    markets: 'us-markets',
    business: 'economy',
    isBreaking: true,
    tags: ['stock market', 'oil prices', 'US-Iran', 'S&P 500', 'market selloff']
  },
  {
    title: 'Wall Street Recession Fears Mount as Economic Cracks Appear Beneath the Surface',
    excerpt: 'Major banks are raising recession probability estimates as surging oil prices, deteriorating consumer confidence, and stagflation fears converge.',
    content: [
      {type:'paragraph',content:'Recession probability models on Wall Street are flashing their most alarming signals in months as a combination of surging energy prices, geopolitical instability, and deteriorating consumer confidence converges to paint an increasingly uncertain economic outlook. Several major banks have revised their recession odds upward this week, with some now placing the probability of a U.S. downturn within the next 12 months at its highest level since the banking stress of early 2023.'},
      {type:'paragraph',content:'The primary catalyst for the shifting sentiment has been the rapid surge in crude oil prices, which have climbed from roughly $75 per barrel in January to above $100 in recent sessions. Goldman Sachs has sharply revised its 2026 oil price forecast, now projecting Brent crude will average $85 per barrel this year - up from an earlier estimate of $77. The revision reflects what analysts describe as a fundamental shift from short-term, conflict-driven price spikes to genuine constraints on global supply.'},
      {type:'heading',level:2,content:'Consumer Confidence Declining'},
      {type:'paragraph',content:'Consumer-facing indicators are also showing signs of strain. Retail sales data for February came in below expectations, and consumer confidence surveys have declined for three consecutive months. The combination of high energy costs eating into household budgets and uncertainty around trade policy has created what economists call a "confidence gap" between hard economic data and sentiment measures.'},
      {type:'paragraph',content:'The Federal Reserve faces an increasingly difficult balancing act. With inflation pressures reignited by energy costs, the central bank may find itself unable to cut rates even as growth slows - the textbook definition of stagflation. Treasury yields have reflected this uncertainty, with the 2-year/10-year spread fluctuating as markets try to price in competing scenarios of rate cuts for growth support versus rate holds to combat inflation.'},
      {type:'heading',level:2,content:'Labor Market Still Resilient'},
      {type:'paragraph',content:'Despite the growing anxiety, some economists note that the labor market remains a pillar of strength. Continuing unemployment claims recently fell to their lowest level since May 2024, and the unemployment rate continues to hover near historic lows. Corporate earnings have also broadly exceeded expectations, suggesting that while risks are mounting, the economy still has meaningful buffers against a sharp downturn.'},
      {type:'paragraph',content:'Investors have responded by dramatically shifting their portfolios toward defensive positioning. Money market fund assets surged by $38.68 billion in a single week to reach a record $7.86 trillion, reflecting a risk-off mindset not seen since the early days of the pandemic. Gold has also rallied, while defensive sectors like utilities and consumer staples have outperformed the broader market over the past month.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['SPY', 'TLT', 'GLD', 'XLU'],
    seoKeywords: ['recession fears', 'Wall Street', 'stagflation', 'Federal Reserve', 'oil prices', 'economy'],
    markets: 'us-markets',
    business: 'economy',
    isBreaking: false,
    tags: ['recession', 'Wall Street', 'economy', 'stagflation', 'Federal Reserve']
  },
  {
    title: 'Arm Holdings Soars 16% After Launching Next-Generation AI Data Center Chip',
    excerpt: 'Arm Holdings jumped 16.4% after unveiling a new AI data center chip that offers 40% better performance-per-watt than current offerings.',
    content: [
      {type:'paragraph',content:'Arm Holdings saw its shares surge 16.4% on Thursday, making it one of the strongest performers in an otherwise dismal trading session, after the chip architecture company unveiled its latest AI-optimized data center processor. The new chip represents Arm\'s most aggressive push yet into the high-performance computing market, directly challenging Intel and AMD\'s traditional dominance in server-grade silicon.'},
      {type:'paragraph',content:'The new processor, designed specifically for AI inference and training workloads, offers what Arm claims is a 40% improvement in performance-per-watt compared to current-generation offerings. This efficiency advantage is particularly significant for hyperscale data center operators like Amazon Web Services, Microsoft Azure, and Google Cloud, where energy costs represent a major portion of operating expenses. Several major cloud providers have reportedly already committed to evaluating the new architecture for deployment.'},
      {type:'heading',level:2,content:'Expanding Beyond Mobile'},
      {type:'paragraph',content:'The launch comes at a crucial time for Arm, which has been working to expand its revenue base beyond mobile device licensing into higher-margin server and AI markets. The company\'s royalty revenue from data center applications has been growing at triple-digit rates, though it still represents a relatively small portion of overall revenue compared to mobile. Analysts view the new chip as a potential inflection point that could accelerate this transition.'},
      {type:'paragraph',content:'Wall Street analysts responded enthusiastically, with several upgrading their price targets. The chip\'s architecture is designed to work seamlessly with Nvidia\'s GPU accelerators, a strategic decision that positions Arm as a complementary rather than competitive force in the AI infrastructure ecosystem. This approach mirrors the successful partnership model that has already gained traction in cloud computing environments.'},
      {type:'heading',level:2,content:'Semiconductor Sector Under Pressure'},
      {type:'paragraph',content:'The broader semiconductor sector has faced significant headwinds in recent weeks, with the Philadelphia Semiconductor Index declining more than 12% from its February highs amid concerns about the impact of geopolitical tensions on global supply chains. Arm\'s strong performance against this backdrop underscores the continued investor appetite for companies that can demonstrate clear competitive advantages in the AI hardware space. The stock has now recovered roughly half the losses it sustained during the broader tech selloff that began in late February.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop&q=80',
    readTime: 4,
    relevantTickers: ['ARM', 'NVDA', 'AMD', 'INTC', 'AMZN', 'MSFT', 'GOOGL'],
    seoKeywords: ['Arm Holdings', 'AI chip', 'data center', 'semiconductors', 'artificial intelligence', 'chip design'],
    markets: 'us-markets',
    business: 'tech',
    isBreaking: false,
    tags: ['ARM Holdings', 'AI chips', 'semiconductors', 'data center', 'artificial intelligence']
  },
  {
    title: 'Coca-Cola CEO James Quincey Steps Down Citing AI-Driven Business Transformation',
    excerpt: 'Coca-Cola CEO James Quincey announced his departure, saying a huge new shift in AI technology requires completely new transformation.',
    content: [
      {type:'paragraph',content:'Coca-Cola announced Thursday that longtime CEO James Quincey will step down from his position, marking the end of an era for the beverage giant. In a statement that surprised many on Wall Street, Quincey cited a "huge new shift" in technology - particularly artificial intelligence - as the driving force behind the leadership transition, saying the company needs "completely new transformation" to navigate the rapidly evolving business landscape.'},
      {type:'paragraph',content:'Quincey, who has served as CEO since 2017, oversaw a period of significant strategic shifts at Coca-Cola, including the company\'s aggressive expansion into non-carbonated beverages, its digital transformation initiatives, and its response to changing consumer health preferences. Under his leadership, Coca-Cola\'s market capitalization grew substantially, and the company successfully navigated both the pandemic disruptions and subsequent supply chain challenges.'},
      {type:'heading',level:2,content:'AI Reshaping Consumer Goods'},
      {type:'paragraph',content:'The departure signals a growing recognition among traditional consumer goods companies that artificial intelligence is poised to fundamentally reshape their operations, from supply chain optimization and demand forecasting to personalized marketing and product development. Industry analysts noted that Coca-Cola\'s AI investments have already yielded significant results, including the AI-assisted creation of new flavors and more efficient distribution networks.'},
      {type:'paragraph',content:'Coca-Cola shares traded lower in the broader market selloff but outperformed the Dow Jones Industrial Average, suggesting investors view the planned transition constructively. The company said it would announce a succession plan in the coming weeks. Several analysts pointed to the company\'s Chief Technology Officer and the head of its North American operations as leading internal candidates, while acknowledging that the board may look externally for a leader with deeper technology expertise.'},
      {type:'paragraph',content:'The announcement adds to a growing trend of CEO departures at major corporations that explicitly reference AI as a catalyst for change. Over the past year, several Fortune 500 companies have refreshed their leadership teams with executives who have stronger backgrounds in technology and data science, reflecting a broader shift in what boards consider essential CEO qualifications in the age of artificial intelligence.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=1200&h=630&fit=crop&q=80',
    readTime: 4,
    relevantTickers: ['KO', 'PEP'],
    seoKeywords: ['Coca-Cola', 'CEO departure', 'James Quincey', 'AI transformation', 'corporate leadership', 'consumer goods'],
    markets: 'us-markets',
    business: 'finance',
    isBreaking: false,
    tags: ['Coca-Cola', 'CEO departure', 'artificial intelligence', 'corporate leadership']
  },
  {
    title: 'Record Cash Pile: Money Market Fund Assets Hit $7.86 Trillion as Investors Flee Risk',
    excerpt: 'Money market fund assets surged to a record $7.86 trillion as investors flee equities amid geopolitical tensions and recession fears.',
    content: [
      {type:'paragraph',content:'Investors poured a staggering $38.68 billion into money market funds during the week ended March 18, pushing total assets to a new record of $7.86 trillion, according to data from the Investment Company Institute. The surge represents the largest weekly inflow since early January and underscores the depth of risk aversion sweeping through financial markets as geopolitical tensions, soaring energy prices, and recession fears converge.'},
      {type:'paragraph',content:'The flight to cash comes as the S&P 500 endures its worst stretch since the September 2025 correction, with the benchmark index falling to a four-month low amid persistent selling pressure. Both institutional and retail investors have been reducing equity exposure, with Bank of America\'s latest fund manager survey showing cash allocations at their highest level in over a year. The pattern mirrors the risk-off behavior seen during previous periods of elevated uncertainty.'},
      {type:'heading',level:2,content:'Attractive Yields Drive Cash Flows'},
      {type:'paragraph',content:'Money market funds remain attractive despite the Federal Reserve holding interest rates steady, as yields on prime money market funds continue to offer returns above 4.5% - competitive with longer-duration fixed income investments but without the interest rate risk. This yield advantage has made cash-equivalent instruments an increasingly popular parking spot for investors who want to preserve capital while maintaining the optionality to redeploy into equities if conditions improve.'},
      {type:'heading',level:2,content:'Contrarian Bullish Signal?'},
      {type:'paragraph',content:'Some strategists view the record cash buildup as a contrarian bullish signal, arguing that the enormous pool of sidelined capital represents potential buying power that could fuel a sharp market rebound once uncertainty dissipates. Historically, periods of extreme cash accumulation have preceded some of the market\'s strongest rallies, as the "wall of worry" eventually gives way to fear of missing out.'},
      {type:'paragraph',content:'However, other market veterans caution that the rush to safety reflects genuine structural concerns about the economic outlook rather than mere sentiment-driven positioning. The combination of oil prices hovering near $100 per barrel, sticky inflation readings, and growing geopolitical risks suggests the current environment may warrant sustained defensive positioning rather than aggressive dip-buying.'},
      {type:'paragraph',content:'The cash accumulation trend has been global in nature, with European and Asian investors similarly increasing their holdings of short-term government securities and money market instruments. Central bank watchers note that the shift has implications for monetary policy transmission, as record money market assets could dampen the stimulative effect of any future rate cuts by absorbing liquidity that might otherwise flow into productive investments.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['SPY', 'BIL', 'SHV'],
    seoKeywords: ['money market funds', 'cash allocation', 'investor sentiment', 'risk aversion', 'market volatility', 'recession'],
    markets: 'us-markets',
    business: 'finance',
    isBreaking: false,
    tags: ['money market funds', 'investor sentiment', 'risk aversion', 'cash allocation']
  }
];

async function main() {
  console.log('=== Creating 5 Trending Articles - March 26, 2026 ===\n');

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
