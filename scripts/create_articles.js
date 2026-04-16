const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Article 1: Defense Contract
const article1 = {
  slug: 'defense-logistics-agency-awards-asrc-federal-2-3-billion-chemical-oil-supply-chain',
  title: 'Defense Logistics Agency Awards ASRC Federal $2.3 Billion Contract to Manage Chemical and Oil Supply Chain',
  excerpt: 'Pentagon taps Alaska Native corporation subsidiary for critical defense infrastructure management in multi-year logistics deal.',
  content: [
    {type:'paragraph',content:'The Defense Logistics Agency has awarded ASRC Federal a contract valued at up to $2.3 billion to oversee the military\'s chemical and oil supply chain operations, marking one of the largest logistics awards of the fiscal year. The multi-year agreement positions the Alaska Native corporation subsidiary as a key partner in maintaining the Pentagon\'s operational readiness.'},
    {type:'paragraph',content:'Under the terms of the contract, ASRC Federal will manage the procurement, storage, and distribution of chemicals, oils, and lubricants essential to military operations across all service branches. The scope encompasses everything from aviation fuels to specialized industrial chemicals used in weapons systems maintenance.'},
    {type:'heading',level:2,content:'Strategic Importance'},
    {type:'paragraph',content:'The award comes as the Department of Defense continues to modernize its supply chain infrastructure amid concerns about logistics vulnerabilities exposed during recent geopolitical tensions. Defense analysts note that reliable access to critical materials has become increasingly important as the military prepares for potential near-peer conflicts.'},
    {type:'paragraph',content:'"Supply chain resilience is a cornerstone of military readiness," said defense industry analysts. "This contract reflects the Pentagon\'s commitment to ensuring uninterrupted access to essential materials regardless of global market conditions."'},
    {type:'heading',level:2,content:'ASRC Federal Profile'},
    {type:'paragraph',content:'ASRC Federal, a subsidiary of Arctic Slope Regional Corporation, has established itself as a significant government contractor with expertise in logistics, engineering, and IT services. The company has previously secured substantial contracts with various federal agencies, building a track record in mission-critical support services.'},
    {type:'heading',level:2,content:'Market Implications'},
    {type:'paragraph',content:'The defense logistics sector has seen increased activity as the Pentagon prioritizes supply chain security. Publicly traded defense contractors with logistics exposure, including those in the S&P Aerospace & Defense index, may benefit from the broader trend toward increased government spending on supply chain infrastructure.'},
    {type:'paragraph',content:'The contract includes options that could extend the engagement over multiple years, providing ASRC Federal with a stable revenue stream and reinforcing its position in the competitive government services market.'}
  ],
  imageUrl: '/images/articles/finance-1.jpg',
  readTime: 4,
  relevantTickers: [],
  metaDescription: 'Defense Logistics Agency awards ASRC Federal $2.3 billion contract for military chemical and oil supply chain management.',
  seoKeywords: ['Defense Logistics Agency', 'ASRC Federal', 'defense contract', 'military supply chain', 'Pentagon logistics']
};

// Article 2: Visa Stablecoin
const article2 = {
  slug: 'visa-crypto-chief-stablecoin-settlement-volumes-growing-2026',
  title: 'Visa Crypto Chief Sees Stablecoin Settlement as Key Growth Driver, Volumes Rising',
  excerpt: 'Payments giant doubles down on blockchain strategy as digital dollar transactions gain momentum in cross-border commerce.',
  content: [
    {type:'paragraph',content:'Visa\'s head of cryptocurrency operations expressed confidence in stablecoin settlement as a major growth catalyst, citing increasing transaction volumes and expanding merchant adoption. The payments giant has been steadily building its blockchain infrastructure as digital assets mature into mainstream financial tools.'},
    {type:'paragraph',content:'The bullish outlook comes as stablecoins—digital tokens pegged to fiat currencies like the U.S. dollar—have emerged as a practical bridge between traditional finance and the cryptocurrency ecosystem. Unlike volatile cryptocurrencies, stablecoins offer the speed and efficiency of blockchain transactions without the price fluctuation risks that have deterred many businesses.'},
    {type:'heading',level:2,content:'Strategic Vision'},
    {type:'paragraph',content:'Visa (NYSE: V) has positioned itself at the intersection of traditional payments and blockchain technology, enabling settlement in USDC and other regulated stablecoins. The company\'s crypto strategy focuses on leveraging existing merchant relationships while offering new capabilities that reduce friction in cross-border transactions.'},
    {type:'paragraph',content:'"We\'re seeing real utility in stablecoin settlement, particularly for international payments where speed and cost efficiency matter," industry observers note. "Visa\'s network effects give it a significant advantage in scaling these solutions."'},
    {type:'heading',level:2,content:'Regulatory Landscape'},
    {type:'paragraph',content:'The timing aligns with evolving regulatory clarity around stablecoins in major markets. U.S. lawmakers have advanced legislation to establish a framework for stablecoin issuers, potentially unlocking broader institutional adoption. European regulations under MiCA have similarly provided guardrails that major financial institutions require before committing resources.'},
    {type:'heading',level:2,content:'Competitive Dynamics'},
    {type:'paragraph',content:'Visa\'s crypto push intensifies competition with Mastercard (NYSE: MA) and emerging fintech players in the digital payments space. The race to capture stablecoin transaction fees could reshape payment economics, particularly in remittances and B2B cross-border commerce where traditional correspondent banking remains costly and slow.'},
    {type:'paragraph',content:'Shares of Visa have performed steadily this year, with analysts citing the company\'s diversified revenue streams and strategic positioning in emerging payment technologies as key strengths.'}
  ],
  imageUrl: '/images/articles/crypto-1.jpg',
  readTime: 4,
  relevantTickers: ['V', 'MA'],
  metaDescription: 'Visa cryptocurrency executive highlights stablecoin settlement growth as digital dollar transactions expand in cross-border payments.',
  seoKeywords: ['Visa', 'stablecoin', 'cryptocurrency', 'USDC', 'cross-border payments', 'blockchain']
};

// Article 3: Energy Sector Technical Analysis
const article3 = {
  slug: 'energy-sector-technical-breakout-charts-signal-move-higher-2026',
  title: 'Energy Sector Poised for Technical Breakout as Charts Signal Major Move Higher',
  excerpt: 'Technical analysts identify bullish patterns across oil and gas stocks, suggesting sector rotation may accelerate.',
  content: [
    {type:'paragraph',content:'Technical analysis of the energy sector reveals bullish chart patterns that suggest a significant move higher may be brewing, according to market strategists. The sector, which has lagged broader market gains in recent months, is showing signs of accumulation that historically precede major rallies.'},
    {type:'paragraph',content:'Key indicators including relative strength, moving average convergence, and volume patterns point to improving momentum across oil and gas equities. The Energy Select Sector SPDR Fund (XLE), a widely tracked benchmark, has been consolidating near technical support levels that analysts view as a launching pad for the next leg higher.'},
    {type:'heading',level:2,content:'Technical Setup'},
    {type:'paragraph',content:'Chart patterns across major energy names show a series of higher lows, a classic technical formation that indicates buyers are becoming more aggressive. The sector\'s relative performance versus the S&P 500 has begun to inflect upward after months of underperformance, potentially signaling the start of sector rotation.'},
    {type:'paragraph',content:'"The energy sector is setting up for what could be a multi-month rally," technical analysts observe. "We\'re seeing the kind of base-building pattern that preceded the 2021-2022 energy bull market."'},
    {type:'heading',level:2,content:'Fundamental Backdrop'},
    {type:'paragraph',content:'The technical picture aligns with fundamental factors including disciplined capital allocation by major producers, steady global demand growth, and geopolitical risks that support crude prices. OPEC+ production management has helped stabilize oil markets, while natural gas has found a floor following last year\'s inventory normalization.'},
    {type:'paragraph',content:'Major integrated oil companies including Exxon Mobil (NYSE: XOM) and Chevron (NYSE: CVX) trade at modest valuations relative to historical averages, offering potential upside if commodity prices strengthen.'},
    {type:'heading',level:2,content:'Investment Considerations'},
    {type:'paragraph',content:'Energy stocks also offer attractive dividend yields that appeal to income-focused investors, providing a margin of safety while waiting for potential capital appreciation. The sector\'s cash generation capabilities remain robust, supporting shareholder returns through dividends and buybacks.'},
    {type:'paragraph',content:'Market participants watching for sector leadership changes may find energy an attractive rotation candidate as growth stocks face valuation headwinds and investors seek exposure to tangible asset businesses with pricing power.'}
  ],
  imageUrl: '/images/articles/earnings-1.jpg',
  readTime: 4,
  relevantTickers: ['XLE', 'XOM', 'CVX'],
  metaDescription: 'Technical analysis suggests energy sector stocks may be poised for significant upside as chart patterns signal bullish momentum.',
  seoKeywords: ['energy sector', 'technical analysis', 'XLE', 'oil stocks', 'Exxon', 'Chevron', 'sector rotation']
};

async function createArticles() {
  // Get categories and author
  const usMarkets = await prisma.category.findFirst({where:{slug:'us-markets'}});
  const crypto = await prisma.category.findFirst({where:{slug:'crypto'}});
  const industrial = await prisma.category.findFirst({where:{slug:'industrial'}});
  const tech = await prisma.category.findFirst({where:{slug:'tech'}});
  const finance = await prisma.category.findFirst({where:{slug:'finance'}});
  const author = await prisma.author.findFirst();

  if (!author || !usMarkets || !crypto || !industrial || !tech || !finance) {
    console.log('Missing required data');
    return [];
  }

  const articles = [
    {...article1, authorId: author.id, marketsCategoryId: usMarkets.id, businessCategoryId: industrial.id, isAiEnhanced: true},
    {...article2, authorId: author.id, marketsCategoryId: crypto.id, businessCategoryId: tech.id, isAiEnhanced: true},
    {...article3, authorId: author.id, marketsCategoryId: usMarkets.id, businessCategoryId: industrial.id, isAiEnhanced: true}
  ];

  const created = [];
  for (const articleData of articles) {
    // Check if already exists
    const existing = await prisma.article.findUnique({where:{slug:articleData.slug}});
    if (existing) {
      console.log('SKIP (exists):', articleData.title.substring(0,50));
      continue;
    }

    const article = await prisma.article.create({data: articleData});
    console.log('CREATED:', article.title.substring(0,50));
    created.push(article);
  }

  return created;
}

createArticles()
  .then(articles => console.log('\nCreated', articles.length, 'articles'))
  .catch(e => console.error('Error:', e))
  .finally(() => prisma.$disconnect());
