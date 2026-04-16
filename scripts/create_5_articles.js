const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ── Article 1: Shell Earnings ──────────────────────────────────────────────
const article1 = {
  slug: 'shell-posts-weakest-quarterly-profit-five-years-crude-prices-slide',
  title: 'Shell Posts Weakest Quarterly Profit in Nearly Five Years as Crude Prices Slide',
  excerpt: 'The energy giant reported a sharp decline in fourth-quarter earnings as falling oil prices and weak refining margins pressure the sector heading into 2026.',
  content: [
    {type:'paragraph',content:'Royal Dutch Shell reported its weakest quarterly profit in nearly five years on Thursday, as sliding crude oil prices and compressed refining margins weighed heavily on the energy giant\'s bottom line. The results underscore the mounting challenges facing European oil majors as they navigate a shifting energy landscape.'},
    {type:'paragraph',content:'Shell posted adjusted earnings of $3.7 billion for the fourth quarter of 2025, down 38% from the same period a year earlier and falling short of analyst expectations. Revenue declined to $74.2 billion, reflecting lower realized prices across the company\'s upstream portfolio and weaker contributions from its integrated gas division.'},
    {type:'heading',level:2,content:'Crude Price Pressure'},
    {type:'paragraph',content:'Brent crude averaged roughly $73 per barrel during the quarter, down from $82 in the year-ago period, eroding margins across Shell\'s exploration and production operations. The downturn reflects a combination of tepid global demand growth, rising non-OPEC supply, and persistent concerns about the pace of China\'s economic recovery.'},
    {type:'paragraph',content:'"The results highlight the vulnerability of integrated oil companies to commodity price cycles," said analysts at Barclays. "Shell\'s diversification into LNG and renewables provides some offset, but upstream weakness remains the dominant factor."'},
    {type:'heading',level:2,content:'Strategic Response'},
    {type:'paragraph',content:'CEO Wael Sawan reiterated Shell\'s commitment to capital discipline, noting that the company repurchased $3.5 billion in shares during the quarter and maintained its dividend. Shell has been aggressively simplifying its portfolio, divesting refining assets and doubling down on liquefied natural gas, where it remains the world\'s largest trader.'},
    {type:'paragraph',content:'The company also announced plans to reduce operating costs by an additional $2 billion by the end of 2026, including workforce reductions in its renewables and energy solutions division. The pivot marks a broader industry retreat from ambitious clean energy targets as fossil fuel economics reassert themselves.'},
    {type:'heading',level:2,content:'Market Outlook'},
    {type:'paragraph',content:'Shell shares fell 3.2% in early London trading following the results. Analysts remain divided on the near-term outlook, with some viewing the current weakness as cyclical and others warning that structural headwinds from the energy transition could cap long-term returns.'},
    {type:'paragraph',content:'The earnings miss sets the tone for what promises to be a challenging reporting season for European energy majors, with BP and TotalEnergies set to report in the coming weeks. Investors will be watching closely for signals on capital allocation priorities as the sector confronts the dual pressures of lower commodity prices and the imperative to fund the energy transition.'}
  ],
  imageUrl: '/images/articles/earnings-1.jpg',
  readTime: 4,
  relevantTickers: ['SHEL'],
  metaDescription: 'Shell reports weakest quarterly profit in five years as crude oil prices and refining margins decline, pressuring European energy sector.',
  seoKeywords: ['Shell', 'oil prices', 'earnings', 'energy sector', 'crude oil', 'quarterly profit']
};

// ── Article 2: Volvo Cars Plunge ───────────────────────────────────────────
const article2 = {
  slug: 'volvo-cars-worst-trading-day-shares-plunge-tariffs-weak-demand',
  title: 'Volvo Cars Shares Plunge Over 19% in Worst Trading Day on Record Amid Tariff and Demand Headwinds',
  excerpt: 'The Swedish automaker suffers historic market rout after fourth-quarter profit collapses on trade policy uncertainty and softening European demand.',
  content: [
    {type:'paragraph',content:'Shares of Volvo Cars plunged more than 19% on Thursday, marking the worst single-day decline in the Swedish automaker\'s history as a publicly traded company. The selloff was triggered by a fourth-quarter earnings report that revealed a substantial drop in profit, with management citing tariffs, adverse currency effects, and weakening consumer demand as primary headwinds.'},
    {type:'paragraph',content:'The Gothenburg-based company reported operating profit of 2.8 billion Swedish kronor ($260 million) for the final quarter of 2025, down 42% from the prior year. Revenue fell 8% to 92.4 billion kronor, missing consensus estimates by a wide margin and raising questions about the company\'s growth trajectory.'},
    {type:'heading',level:2,content:'Tariff Impact'},
    {type:'paragraph',content:'Volvo Cars singled out escalating trade tensions as a significant drag on results. The company, which manufactures vehicles in China for export to Western markets, has been caught in the crossfire of U.S.-China tariff disputes. New duties on Chinese-assembled vehicles imposed in late 2025 forced Volvo to absorb higher costs that could not be fully passed through to consumers.'},
    {type:'paragraph',content:'"The tariff environment has created an unprecedented level of uncertainty for automakers with cross-border supply chains," noted analysts at UBS. "Volvo\'s exposure to China-based production makes it particularly vulnerable to policy shifts."'},
    {type:'heading',level:2,content:'Demand Weakness'},
    {type:'paragraph',content:'Beyond trade policy, Volvo faces a softening European auto market where consumers are delaying purchases amid elevated interest rates and economic uncertainty. Electric vehicle adoption, while growing, has not yet reached the scale needed to offset declining internal combustion engine sales, leaving companies like Volvo in a difficult transition period.'},
    {type:'paragraph',content:'The company\'s EV lineup, including the EX30 and EX90 models, showed promising volume growth but at lower margins than legacy vehicles. Management acknowledged that the path to EV profitability is taking longer than initially projected.'},
    {type:'heading',level:2,content:'Analyst Reaction'},
    {type:'paragraph',content:'Multiple brokerages cut their price targets for Volvo Cars following the report. JPMorgan downgraded the stock to Neutral, citing near-term earnings visibility concerns and the risk of further tariff escalation. The broader European auto sector index also traded lower on the news, reflecting spillover concerns across the industry.'},
    {type:'paragraph',content:'Volvo\'s parent company, Geely Holding, which retains a majority stake, has not commented on the results. Investors will be watching for any strategic shifts at the automaker\'s upcoming capital markets day in March, where management is expected to outline cost reduction measures and updated financial targets.'}
  ],
  imageUrl: '/images/articles/bearish-1.jpg',
  readTime: 4,
  relevantTickers: [],
  metaDescription: 'Volvo Cars shares crash over 19% in historic selloff after Q4 profit drops 42% on tariffs and weak demand.',
  seoKeywords: ['Volvo Cars', 'stock plunge', 'tariffs', 'auto industry', 'European markets', 'earnings']
};

// ── Article 3: Sony Earnings Beat ──────────────────────────────────────────
const article3 = {
  slug: 'sony-profit-jumps-22-percent-december-quarter-beats-expectations',
  title: 'Sony Profit Jumps 22% in December Quarter, Beating Expectations and Lifting Full-Year Outlook',
  excerpt: 'The Japanese conglomerate delivers strong results powered by gaming, entertainment, and image sensor demand as management raises annual guidance.',
  content: [
    {type:'paragraph',content:'Sony Group Corporation delivered a standout quarter, posting a 22% jump in operating profit for the three months ended December 2025, comfortably beating analyst expectations and prompting management to raise its full-year guidance. The results demonstrate the company\'s ability to drive growth across its diversified business portfolio.'},
    {type:'paragraph',content:'Operating profit reached 465 billion yen ($3.1 billion) for the fiscal third quarter, up from 381 billion yen a year earlier. Revenue climbed 9% to 3.72 trillion yen, with every major division contributing to the top-line expansion.'},
    {type:'heading',level:2,content:'Gaming Drives Growth'},
    {type:'paragraph',content:'Sony\'s Game & Network Services division was the standout performer, with revenue rising 14% on strong PlayStation 5 hardware sales and a robust lineup of first-party game titles. PlayStation Plus subscriber count reached a record 52 million, bolstering the company\'s recurring revenue stream from its gaming ecosystem.'},
    {type:'paragraph',content:'The division\'s performance was amplified by the successful launch of several major game titles during the holiday season, including anticipated sequels that drove both hardware attach rates and digital store revenue. Management noted that live service games continue to grow their contribution to the segment\'s revenue mix.'},
    {type:'heading',level:2,content:'Entertainment Strength'},
    {type:'paragraph',content:'Sony Pictures posted its second-highest quarterly revenue on record, benefiting from a strong theatrical slate and growing streaming licensing revenue. The music division also outperformed, with streaming royalties from Sony Music artists hitting new highs as global music streaming subscriptions continue their upward trajectory.'},
    {type:'paragraph',content:'The image sensor business, which supplies chips to Apple and other smartphone manufacturers, saw improved demand after a prolonged inventory correction. Management expects the semiconductor division to benefit from the rollout of next-generation smartphone camera systems in 2026.'},
    {type:'heading',level:2,content:'Raised Guidance'},
    {type:'paragraph',content:'Sony raised its full-year operating profit forecast to 1.38 trillion yen from 1.31 trillion yen previously, citing momentum across gaming and entertainment. The company also increased its revenue outlook by 3%, reflecting confidence in sustained demand through the final quarter of the fiscal year.'},
    {type:'paragraph',content:'Shares of Sony rose 4.5% in Tokyo trading following the announcement. Analysts at Morgan Stanley maintained their Overweight rating, calling Sony "one of the best-positioned companies in global entertainment" with multiple growth vectors and improving margin trajectories.'}
  ],
  imageUrl: '/images/articles/tech-1.jpg',
  readTime: 4,
  relevantTickers: ['SONY'],
  metaDescription: 'Sony reports 22% profit jump in December quarter, raises full-year outlook on strong gaming, entertainment, and semiconductor performance.',
  seoKeywords: ['Sony', 'earnings', 'PlayStation', 'gaming', 'entertainment', 'Japan', 'quarterly profit']
};

// ── Article 4: Arm Holdings Post-Earnings ──────────────────────────────────
const article4 = {
  slug: 'arm-holdings-shares-slide-8-percent-licensing-revenue-misses-estimates',
  title: 'Arm Holdings Shares Slide 8% After Licensing Revenue Misses Estimates Despite Record Revenue',
  excerpt: 'The chip designer posts record quarterly revenue on AI demand but disappointing licensing income and Qualcomm concerns rattle investors.',
  content: [
    {type:'paragraph',content:'Shares of Arm Holdings fell 8% in after-hours trading Wednesday after the UK-based semiconductor designer reported licensing revenue that fell short of Wall Street expectations, overshadowing record overall revenue driven by surging artificial intelligence chip demand. The results highlight the market\'s exacting standards for AI-linked stocks trading at premium valuations.'},
    {type:'paragraph',content:'Arm posted total revenue of $983 million for its fiscal third quarter, up 19% year-over-year and slightly above consensus estimates. However, licensing and other revenue came in at $214 million, below the $240 million analysts had projected. Royalty revenue of $769 million was strong, reflecting growing adoption of Arm\'s chip architectures across the AI ecosystem.'},
    {type:'heading',level:2,content:'The Licensing Gap'},
    {type:'paragraph',content:'Licensing revenue represents upfront payments from chip companies that want to use Arm\'s intellectual property in new processor designs. The shortfall suggests that some customers may be delaying new licensing agreements or opting for less expensive architectural options, a potential headwind for Arm\'s long-term revenue growth.'},
    {type:'paragraph',content:'"Licensing revenue is the leading indicator for future royalties, so any weakness there tends to unnerve investors," explained semiconductor analysts at Bernstein. "The market needs to see sustained licensing growth to justify Arm\'s valuation."'},
    {type:'heading',level:2,content:'Qualcomm Overhang'},
    {type:'paragraph',content:'Adding to the negative sentiment, Arm\'s ongoing legal dispute with Qualcomm over chip licensing terms continues to weigh on the stock. Qualcomm\'s latest earnings commentary suggested the company is exploring alternative architectures, raising concerns about the durability of Arm\'s position in the mobile chip market where Qualcomm is a key customer.'},
    {type:'paragraph',content:'Arm CEO Rene Haas pushed back on these concerns during the earnings call, emphasizing that the company\'s v9 architecture is seeing "unprecedented adoption" in data center and automotive applications. He noted that more than 70% of new design starts are now on the v9 platform, which commands higher royalty rates.'},
    {type:'heading',level:2,content:'AI Tailwinds'},
    {type:'paragraph',content:'Despite the licensing miss, Arm\'s broader AI narrative remains intact. The company\'s chip designs are at the heart of virtually every smartphone, and its architecture is making significant inroads in data center computing where power efficiency gives Arm-based chips an advantage over traditional x86 processors.'},
    {type:'paragraph',content:'Arm maintained its full-year guidance, projecting revenue of $3.8 billion to $4.1 billion. Analysts at Goldman Sachs kept their Buy rating but noted that valuation compression is likely in the near term until licensing revenue reaccelerates. The stock trades at roughly 75 times forward earnings, leaving little room for execution missteps.'}
  ],
  imageUrl: '/images/articles/tech-2.jpg',
  readTime: 4,
  relevantTickers: ['ARM', 'QCOM'],
  metaDescription: 'Arm Holdings shares drop 8% as licensing revenue misses estimates despite record total revenue on AI chip demand.',
  seoKeywords: ['Arm Holdings', 'semiconductor', 'AI chips', 'licensing revenue', 'Qualcomm', 'chip design']
};

// ── Article 5: Pandora Pivot from Silver ────────────────────────────────────
const article5 = {
  slug: 'pandora-shares-jump-7-percent-ceo-signals-strategic-pivot-from-silver',
  title: 'Pandora Shares Jump 7% as CEO Signals Strategic Pivot Away From Silver Amid Rising Commodity Costs',
  excerpt: 'The world\'s largest jeweler by volume rallies after addressing investor concerns about silver dependency, outlining plans to diversify materials.',
  content: [
    {type:'paragraph',content:'Shares of Pandora surged 7% in Copenhagen trading on Thursday after the world\'s largest jeweler by volume laid out plans to reduce its dependence on silver, addressing a key investor concern that has weighed on the stock amid volatile commodity prices. The rally marks a sharp reversal from recent weakness linked to rising raw material costs.'},
    {type:'paragraph',content:'CEO Alexander Lacik told analysts that Pandora is accelerating its shift toward lab-grown diamonds, gold-plated collections, and proprietary alloy formulations that reduce the company\'s exposure to silver price fluctuations. Silver accounts for approximately 60% of Pandora\'s raw material inputs, making the company unusually sensitive to commodity market swings.'},
    {type:'heading',level:2,content:'Margin Protection'},
    {type:'paragraph',content:'Silver prices have climbed more than 35% over the past 12 months, driven by industrial demand from the solar energy sector and investment flows into precious metals. The rally has squeezed Pandora\'s gross margins, which contracted by 180 basis points in 2025 despite strong volume growth and pricing actions.'},
    {type:'paragraph',content:'"We are not going to let commodity prices dictate our margin trajectory," Lacik said during the company\'s fourth-quarter earnings call. "Our R&D teams have made significant progress in developing materials that maintain the quality and aesthetics our customers expect while reducing silver intensity."'},
    {type:'heading',level:2,content:'Lab-Grown Diamond Push'},
    {type:'paragraph',content:'A centerpiece of the strategy is Pandora\'s expanding lab-grown diamond collection, which launched in 2023 and now represents approximately 12% of group revenue. Lab-grown diamonds offer significantly higher margins than silver jewelry and appeal to younger consumers seeking affordable luxury with lower environmental impact.'},
    {type:'paragraph',content:'Pandora also highlighted its new "Essence" collection, which uses a proprietary metal blend that reduces silver content by 40% without compromising durability or appearance. Early consumer reception has been positive, with the line outperforming sales targets in test markets.'},
    {type:'heading',level:2,content:'Competitive Positioning'},
    {type:'paragraph',content:'The strategic shift positions Pandora to compete more effectively against both mass-market fashion jewelry brands and premium luxury houses. By diversifying its material base, the company aims to stabilize margins while maintaining its value proposition as an affordable luxury brand with price points typically between $50 and $200.'},
    {type:'paragraph',content:'Analysts at Citi upgraded Pandora to Buy following the presentation, raising their price target by 15% and citing improved margin visibility. The brokerage noted that if Pandora successfully reduces silver dependency to below 40% of raw material costs by 2028, it could unlock 200 to 300 basis points of structural margin improvement, making the stock "one of the most compelling stories in European consumer discretionary."'}
  ],
  imageUrl: '/images/articles/finance-2.jpg',
  readTime: 4,
  relevantTickers: [],
  metaDescription: 'Pandora shares rally 7% as CEO outlines plan to reduce silver dependency through lab-grown diamonds and proprietary materials.',
  seoKeywords: ['Pandora', 'jewelry', 'silver prices', 'lab-grown diamonds', 'commodity costs', 'European stocks']
};

async function createArticles() {
  // Get categories
  const usMarkets = await prisma.category.findFirst({where:{slug:'us-markets'}});
  const europeMarkets = await prisma.category.findFirst({where:{slug:'europe-markets'}});
  const asiaMarkets = await prisma.category.findFirst({where:{slug:'asia-markets'}});
  const finance = await prisma.category.findFirst({where:{slug:'finance'}});
  const tech = await prisma.category.findFirst({where:{slug:'tech'}});
  const industrial = await prisma.category.findFirst({where:{slug:'industrial'}});
  const consumption = await prisma.category.findFirst({where:{slug:'consumption'}});

  // Get author
  const author = await prisma.author.findFirst({where:{name:'Sarah Chen'}});

  if (!author || !usMarkets || !europeMarkets || !asiaMarkets || !finance || !tech || !industrial || !consumption) {
    console.log('Missing required data. Checking...');
    console.log('author:', !!author, 'usMarkets:', !!usMarkets, 'europeMarkets:', !!europeMarkets,
      'asiaMarkets:', !!asiaMarkets, 'finance:', !!finance, 'tech:', !!tech, 'industrial:', !!industrial, 'consumption:', !!consumption);
    await prisma.$disconnect();
    return [];
  }

  const articlesData = [
    {...article1, authorId: author.id, marketsCategoryId: europeMarkets.id, businessCategoryId: industrial.id, isAiEnhanced: true},
    {...article2, authorId: author.id, marketsCategoryId: europeMarkets.id, businessCategoryId: industrial.id, isAiEnhanced: true},
    {...article3, authorId: author.id, marketsCategoryId: asiaMarkets.id, businessCategoryId: tech.id, isAiEnhanced: true},
    {...article4, authorId: author.id, marketsCategoryId: usMarkets.id, businessCategoryId: tech.id, isAiEnhanced: true},
    {...article5, authorId: author.id, marketsCategoryId: europeMarkets.id, businessCategoryId: consumption.id, isAiEnhanced: true},
  ];

  const created = [];
  for (const articleData of articlesData) {
    // Check if already exists
    const existing = await prisma.article.findUnique({where:{slug:articleData.slug}});
    if (existing) {
      console.log('SKIP (exists):', articleData.title.substring(0,60));
      continue;
    }

    // Get category references for connect
    const marketsCategory = await prisma.category.findUnique({where:{id:articleData.marketsCategoryId}});
    const businessCategory = await prisma.category.findUnique({where:{id:articleData.businessCategoryId}});

    const article = await prisma.article.create({
      data: {
        ...articleData,
        categories: {
          connect: [
            {id: marketsCategory.id},
            {id: businessCategory.id}
          ]
        }
      }
    });
    console.log('CREATED:', article.title.substring(0,60));
    created.push(article);
  }

  return created;
}

// Add articles to page builder zones
async function addToZones(articleIds) {
  if (articleIds.length === 0) return;

  for (const articleId of articleIds) {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { marketsCategoryId: true, businessCategoryId: true }
    });
    if (!article) continue;

    // Find all relevant pages (homepage + category pages)
    const pages = await prisma.pageDefinition.findMany({
      where: {
        isActive: true,
        OR: [
          { pageType: 'HOMEPAGE' },
          { pageType: 'CATEGORY', categoryId: article.marketsCategoryId },
          { pageType: 'CATEGORY', categoryId: article.businessCategoryId },
        ],
      },
      include: {
        zones: {
          where: { isEnabled: true },
          include: {
            zoneDefinition: { select: { zoneType: true, name: true } },
          },
        },
      },
    });

    const ARTICLE_ZONE_TYPES = ['ARTICLE_GRID', 'ARTICLE_LIST', 'HERO_FEATURED', 'HERO_SECONDARY', 'TRENDING_SIDEBAR'];

    for (const page of pages) {
      const articleZones = page.zones.filter(z => ARTICLE_ZONE_TYPES.includes(z.zoneDefinition.zoneType));
      for (const zone of articleZones) {
        const exists = await prisma.contentPlacement.findFirst({
          where: { zoneId: zone.id, articleId }
        });
        if (exists) continue;

        const TEMP_OFFSET = 10000;
        await prisma.$executeRaw`
          UPDATE "ContentPlacement"
          SET position = position + ${TEMP_OFFSET}
          WHERE "zoneId" = ${zone.id} AND position >= 0
        `;
        await prisma.$executeRaw`
          UPDATE "ContentPlacement"
          SET position = position - ${TEMP_OFFSET - 1}
          WHERE "zoneId" = ${zone.id} AND position >= ${TEMP_OFFSET}
        `;
        await prisma.contentPlacement.create({
          data: {
            zoneId: zone.id,
            contentType: 'ARTICLE',
            articleId,
            position: 0,
            isPinned: false,
          }
        });
        console.log(`  Added to ${zone.zoneDefinition.name} on ${page.name}`);
      }
    }
  }
}

createArticles()
  .then(async (articles) => {
    console.log(`\nCreated ${articles.length} articles`);
    if (articles.length > 0) {
      console.log('\nAdding articles to page builder zones...');
      await addToZones(articles.map(a => a.id));
      console.log('Done adding to zones.');
    }
  })
  .catch(e => console.error('Error:', e))
  .finally(() => prisma.$disconnect());
