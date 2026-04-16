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

// 5 Trending Viral News Articles - March 27, 2026 (Batch 2 - Evening Update)
const articles = [
  {
    title: 'Trump Extends Iran Deadline to April 6, Markets Whipsaw as Oil Tops $108 per Barrel',
    excerpt: 'President Trump extended his pledge to refrain from striking Iranian energy sites by 10 days to April 6, while Iran denied direct negotiations are taking place, sending oil past $108 and stocks sharply lower.',
    content: [
      {type:'paragraph',content:'President Donald Trump announced Thursday that he would extend the deadline for Iran to reopen the Strait of Hormuz by 10 days to Monday, April 6, at 8 P.M. Eastern Time, saying the extension came "as per Iranian Government request." The announcement provided brief relief to energy markets before conflicting signals from Tehran reignited uncertainty, with Brent crude futures settling at $108.01 per barrel after jumping 5.66% on the session.'},
      {type:'paragraph',content:'The extension means the U.S. will refrain from striking Iranian power plants and energy infrastructure for at least another week and a half, giving diplomats additional time to negotiate a ceasefire in the month-old conflict. However, Iran\'s Foreign Minister Abbas Araghchi flatly denied that any direct negotiations are taking place, stating that an exchange of messages through mediators "does not mean negotiations with the U.S." The contradictory statements from Washington and Tehran left markets unable to find a stable footing.'},
      {type:'heading',level:2,content:'Markets Caught in Geopolitical Crossfire'},
      {type:'paragraph',content:'The S&P 500 fell 1.74% to 6,477.16, its lowest close in four months, while the Nasdaq Composite plunged 2.38% to officially enter correction territory at more than 10% below its recent highs. The Dow Jones Industrial Average shed 469 points. Asian markets followed suit overnight, with Japan\'s Nikkei falling 1.8% and Hong Kong\'s Hang Seng declining 2.1% in early Friday trading. The VIX volatility index surged above 25, its highest level since the conflict began.'},
      {type:'paragraph',content:'Southeast Asian nations are emerging as some of the hardest-hit casualties of the Strait of Hormuz disruption, with several countries almost entirely dependent on Middle Eastern energy imports now scrambling to secure alternative supplies. Analysts at Goldman Sachs warned that if the strait remains closed through April, global GDP growth could be reduced by 0.5 percentage points, with emerging markets bearing the brunt of the economic damage. The energy crisis has also accelerated nuclear energy interest across the region.'},
      {type:'heading',level:2,content:'Investors Flee to Safety'},
      {type:'paragraph',content:'Money market fund assets surged by $38.68 billion in a single week to a record $7.86 trillion, the largest weekly inflow since the banking crisis of March 2023. Gold rallied to new all-time highs above $3,100 per ounce as investors sought traditional safe-haven assets. Treasury yields initially rose on inflation fears before declining as recession concerns took hold, with the 10-year note settling at 4.32%. The dollar index strengthened against most major currencies except the Japanese yen, which benefited from its own safe-haven status.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['SPY', 'QQQ', 'USO', 'GLD', 'TLT', 'VIX'],
    seoKeywords: ['Iran deadline extension', 'Trump Iran ceasefire', 'oil prices', 'Strait of Hormuz', 'stock market selloff', 'safe haven'],
    markets: 'us-markets',
    business: 'economy',
    isBreaking: true,
    tags: ['Iran war', 'oil prices', 'Trump', 'stock market', 'geopolitics']
  },
  {
    title: 'Trump Imposes 25% Tariff on All Imported Vehicles, Automakers Face $35 Billion Cost Surge',
    excerpt: 'President Trump signed a 25% tariff on all imported automobiles and auto parts, a move that has already cost the industry $35 billion and could add hundreds of dollars to the price of every new car sold in America.',
    content: [
      {type:'paragraph',content:'President Trump signed an executive order Wednesday imposing a sweeping 25% tariff on all vehicles and automobile parts imported into the United States, declaring from the Oval Office that the measure would "continue to spur growth like you haven\'t seen before." The announcement sent shockwaves through the global automotive industry, with shares of major automakers tumbling as analysts scrambled to calculate the impact on profit margins and consumer prices.'},
      {type:'paragraph',content:'The tariff impact has been staggering in scale. According to industry data compiled by Automotive News, Trump administration trade policies have already cost automakers at least $35.4 billion since taking effect. Toyota is expected to bear the heaviest burden, with an estimated $9.1 billion in tariff costs for fiscal year 2026 alone, while the Detroit Big Three collectively absorbed approximately $6.5 billion in tariff-related expenses during 2025.'},
      {type:'heading',level:2,content:'Consumer Prices Set to Rise'},
      {type:'paragraph',content:'Industry analysts estimate the tariffs will add an average of $580 per vehicle for domestically produced cars that rely on imported components, and significantly more for fully imported vehicles. The cost increase comes at a particularly painful time for consumers already grappling with elevated insurance premiums, higher financing rates, and the broader inflationary impact of surging energy prices from the Iran conflict. New vehicle affordability has deteriorated to its worst level in decades.'},
      {type:'paragraph',content:'The tariff announcement is part of a broader protectionist trade agenda that includes a raft of additional tariffs scheduled for April 2, including 25% duties on imports from Mexico and Canada. Since many automakers have supply chains spanning North America under the USMCA trade agreement, the tariffs effectively penalize companies that built cross-border manufacturing networks in response to previous trade policies.'},
      {type:'heading',level:2,content:'Stock Market Fallout'},
      {type:'paragraph',content:'General Motors shares sank 3.2% on the announcement, while Stellantis, parent of Chrysler, Dodge, Jeep, and Ram, dropped 3.5%. Even Tesla, which manufactures primarily in the U.S., fell nearly 6% and is now down 33% year-to-date as investors worry about the broader economic impact of escalating trade wars. Ford declined 4.1%, with analysts noting that its heavy reliance on Mexican manufacturing for several popular models makes it particularly vulnerable to the new tariff regime.'},
      {type:'paragraph',content:'The world\'s largest business association issued a sharp rebuke of the tariffs, warning they would harm rather than help American competitiveness. European and Asian automakers have signaled they may accelerate plans to shift production to the United States, though such moves would take years to implement. In the meantime, dealers are warning that inventory prices will rise and consumer demand could soften further, potentially pushing the already-struggling auto sector into a deeper downturn.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['GM', 'F', 'STLA', 'TSLA', 'TM', 'HMC'],
    seoKeywords: ['Trump auto tariffs', '25% vehicle tariff', 'automaker costs', 'car prices', 'trade war', 'auto industry'],
    markets: 'us-markets',
    business: 'economy',
    isBreaking: true,
    tags: ['tariffs', 'auto industry', 'Trump', 'trade war', 'automakers']
  },
  {
    title: 'David Sacks Steps Down as Trump AI and Crypto Czar, Zuckerberg and Huang Join New Tech Council',
    excerpt: 'Venture capitalist David Sacks has ended his role as Trump\'s AI and crypto policy czar after exhausting his 130-day term, as the president forms a new technology council featuring Mark Zuckerberg, Jensen Huang, and Larry Ellison.',
    content: [
      {type:'paragraph',content:'Venture capitalist David Sacks has officially stepped aside from his role as President Trump\'s artificial intelligence and cryptocurrency policy czar, having reached the 130-day limit for special government employees. Sacks, a PayPal co-founder and managing partner at Craft Ventures, helped shape the administration\'s early approach to AI regulation and digital asset policy during a turbulent period that saw both industries undergo significant transformation.'},
      {type:'paragraph',content:'In his place, Trump is assembling a broader technology advisory structure with a new technology council expected to include up to 24 members drawn from the upper echelons of Silicon Valley and the broader tech industry. The council will be co-chaired by Sacks himself in an advisory capacity, with Meta CEO Mark Zuckerberg, Nvidia CEO Jensen Huang, and Oracle co-founder Larry Ellison among the marquee names tapped for membership. The council\'s mandate will focus on AI policy, semiconductor strategy, and maintaining U.S. technological competitiveness.'},
      {type:'heading',level:2,content:'Crypto Policy at a Crossroads'},
      {type:'paragraph',content:'Sacks\' departure comes at a critical juncture for the cryptocurrency industry. SEC Chair Paul Atkins has signaled that the agency\'s long-awaited tokenization innovation exemption could arrive within weeks, potentially opening the door for traditional financial institutions to issue and trade tokenized securities on blockchain networks. The regulatory clarity has been eagerly anticipated by an industry that spent years battling the SEC under previous leadership.'},
      {type:'paragraph',content:'The crypto market itself has been under pressure, with Bitcoin dropping below $70,000 and Ethereum falling toward $2,000 amid the broader risk-off sentiment driven by the Iran conflict and rising oil prices. Despite the price decline, institutional adoption continues to accelerate, with Visa joining Canton as a Super Validator and Europe\'s largest asset manager Amundi launching a $100 million tokenized fund on Ethereum and Stellar.'},
      {type:'heading',level:2,content:'AI Policy Takes Center Stage'},
      {type:'paragraph',content:'The formation of the technology council reflects the growing importance of AI policy in the administration\'s agenda. With AI companies consuming an ever-larger share of energy resources and capital expenditure budgets, the intersection of AI development, energy policy, and national security has become a top priority. The council is expected to advise on export controls for advanced chips, AI safety frameworks, and strategies to ensure American companies maintain their lead over Chinese competitors in the global AI race.'},
      {type:'paragraph',content:'Market reaction to the transition was muted, with investors viewing the technology council as a continuation of the administration\'s generally pro-innovation stance. Nvidia shares ticked higher on the news of Huang\'s appointment, while Meta was essentially flat. Industry observers noted that the council\'s composition heavily favors large technology incumbents, raising questions about whether the interests of smaller startups and open-source developers will be adequately represented in policy discussions.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['NVDA', 'META', 'ORCL', 'COIN', 'MSTR'],
    seoKeywords: ['David Sacks', 'Trump tech council', 'AI czar', 'crypto regulation', 'Zuckerberg', 'Jensen Huang', 'SEC tokenization'],
    markets: 'us-markets',
    business: 'tech',
    isBreaking: false,
    tags: ['David Sacks', 'AI policy', 'cryptocurrency', 'tech council', 'Trump']
  },
  {
    title: 'Bitcoin Plunges Below $70,000 as Risk-Off Wave Hits Crypto, AI Disruption Fears Mount',
    excerpt: 'Bitcoin dropped below $70,000 for the first time since November as surging oil prices, equity market weakness, and growing fears that AI could compress software margins triggered a broad crypto selloff.',
    content: [
      {type:'paragraph',content:'Bitcoin fell below $70,000 on Thursday for the first time since November 2025, extending a punishing decline that has erased more than $400 billion from the total cryptocurrency market capitalization in the past two weeks. The world\'s largest cryptocurrency traded as low as $68,450 before recovering slightly to $69,200, while Ethereum dropped to $1,980, its lowest level in four months. The selloff was driven by a toxic combination of rising oil prices, declining equity markets, and an emerging narrative that artificial intelligence could fundamentally disrupt the software industry.'},
      {type:'paragraph',content:'The correlation between crypto and traditional risk assets has tightened considerably since the Iran conflict began, with Bitcoin increasingly trading as a leveraged bet on broader market sentiment rather than the digital gold narrative its proponents have long promoted. The Nasdaq Composite\'s entry into correction territory on Thursday accelerated crypto selling, as traders who had used Bitcoin as a high-beta play on tech stocks rushed to reduce exposure.'},
      {type:'heading',level:2,content:'AI Disruption Narrative Weighs on Tech and Crypto'},
      {type:'paragraph',content:'An emerging concern weighing on both crypto and technology stocks is the fear that AI could compress profit margins across the $10 trillion-plus global software sector. The thesis, gaining traction among hedge fund managers and venture capitalists, holds that AI agents capable of writing and deploying code will dramatically reduce the cost of software development, potentially undermining the high margins that have made software companies Wall Street darlings for the past decade.'},
      {type:'paragraph',content:'The implications for crypto are indirect but significant. Much of the speculative capital that flowed into digital assets during the 2024-2025 bull run came from technology sector profits and venture capital gains. If AI truly compresses software margins, the pool of speculative capital available for crypto investment could shrink meaningfully. Additionally, several prominent crypto projects focused on AI and crypto integration have seen their tokens decline sharply as investors question whether the AI narrative is more threat than opportunity for the digital asset ecosystem.'},
      {type:'heading',level:2,content:'Institutional Adoption Continues Despite Price Weakness'},
      {type:'paragraph',content:'Despite the price decline, institutional infrastructure continues to build. Visa\'s decision to join Canton as a Super Validator marks the payments giant\'s first direct participation in blockchain governance, while Amundi launched a $100 million tokenized fund on Ethereum and Stellar networks. These moves suggest that large financial institutions view the current price weakness as a temporary setback rather than a fundamental challenge to the crypto thesis.'},
      {type:'paragraph',content:'Technical analysts are watching the $67,000 level as critical support for Bitcoin, noting that a break below that level could trigger a cascade of liquidations across leveraged positions. Crypto derivatives data shows approximately $3.2 billion in long positions at risk of liquidation between $65,000 and $68,000. On the other hand, whales and long-term holders have been accumulating during the dip, with on-chain data showing the largest single-day transfer of Bitcoin to cold storage wallets since July 2025.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['COIN', 'MSTR', 'MARA', 'RIOT', 'NVDA'],
    seoKeywords: ['Bitcoin price', 'crypto selloff', 'Bitcoin below 70000', 'AI disruption', 'Ethereum', 'crypto market crash'],
    markets: 'crypto',
    business: 'tech',
    isBreaking: false,
    tags: ['Bitcoin', 'cryptocurrency', 'Ethereum', 'AI disruption', 'crypto market']
  },
  {
    title: 'IOC Mandates Genetic Testing for Women Athletes Ahead of 2028 LA Olympics, Sparking Global Debate',
    excerpt: 'The International Olympic Committee announced a sweeping new policy requiring all athletes competing in women\'s events to undergo genetic testing starting at the 2028 Los Angeles Games, igniting fierce debate across sports and politics.',
    content: [
      {type:'paragraph',content:'The International Olympic Committee dropped a bombshell policy announcement Thursday that is set to reshape the landscape of international women\'s sports: beginning with the 2028 Summer Olympics in Los Angeles, all athletes who wish to compete in women\'s events will be required to undergo genetic testing. The decision, which has been under deliberation for over two years following controversies at the 2024 Paris Games, represents the most significant change to Olympic eligibility criteria in decades.'},
      {type:'paragraph',content:'The new policy establishes a standardized genetic screening protocol that will test for chromosomal composition and specific genetic markers related to testosterone production. Athletes who do not meet the established criteria will be offered the option to compete in men\'s events or a newly created open category that the IOC plans to pilot at the LA Games. The IOC emphasized that the testing will be conducted confidentially and that results will not be made public.'},
      {type:'heading',level:2,content:'Reaction Swift and Divided'},
      {type:'paragraph',content:'The response to the announcement was immediate and sharply divided along predictable lines. Women\'s rights organizations and several prominent female athletes praised the decision as a necessary step to protect fair competition. Multiple national Olympic committees, including those from the UK, Australia, and Japan, signaled their support for the new testing protocols.'},
      {type:'paragraph',content:'Critics, however, condemned the policy as discriminatory and scientifically questionable. LGBTQ+ advocacy groups argued that genetic testing oversimplifies the complex relationship between biology and athletic performance, noting that natural genetic variation among women is far wider than the policy acknowledges. Several European human rights organizations have already signaled they may challenge the policy in the Court of Arbitration for Sport.'},
      {type:'heading',level:2,content:'Financial and Broadcast Implications'},
      {type:'paragraph',content:'The decision carries significant financial implications for the Olympic movement. Broadcasting rights for the 2028 Los Angeles Games, already valued at over $12 billion globally, could see adjustments as networks assess the impact on viewership and advertising. Some analysts believe the policy could actually boost ratings by removing a source of controversy that had dampened enthusiasm for women\'s events, while others worry it could alienate younger viewers who tend to hold more progressive views on gender issues.'},
      {type:'paragraph',content:'The 2028 LA Olympics are already shaping up to be the most commercially significant Games in history, with the organizing committee projecting revenues exceeding $7 billion. Major sponsors including Coca-Cola, Samsung, and Toyota have declined to comment publicly on the genetic testing policy, though industry sources indicate private discussions are ongoing about how to position brands around the potentially polarizing issue. The IOC has scheduled a full press conference for next week to detail the testing protocols and address questions from the media and athlete representatives.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-bd45ba8c28c7?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['DIS', 'CMCSA', 'KO', 'TM', 'GOOGL'],
    seoKeywords: ['IOC genetic testing', '2028 Olympics', 'women athletes', 'LA Olympics', 'Olympic eligibility', 'gender testing'],
    markets: 'global-markets',
    business: 'economy',
    isBreaking: false,
    tags: ['Olympics', 'IOC', 'genetic testing', '2028 LA Games', 'sports policy']
  }
];

async function main() {
  console.log('=== Creating 5 Trending Articles - March 27, 2026 (Batch 2) ===\n');

  const authors = await prisma.author.findMany({ take: 10 });
  if (authors.length === 0) {
    console.error('No authors found!');
    process.exit(1);
  }
  console.log('Found ' + authors.length + ' authors\n');

  let created = 0;
  const createdIds = [];

  for (const article of articles) {
    const author = authors[Math.floor(Math.random() * authors.length)];
    const slug = generateSlug(article.title);

    const existing = await prisma.article.findUnique({ where: { slug }, select: { id: true } });
    if (existing) {
      console.log('SKIP (already exists): ' + article.title.substring(0, 60) + '...');
      continue;
    }

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

    if (article.isBreaking) {
      await prisma.article.updateMany({ where: { isBreaking: true }, data: { isBreaking: false } });
      await prisma.breakingNews.updateMany({ where: { isActive: true }, data: { isActive: false } });
    }

    const newArticle = await prisma.article.create({
      data: {
        title: article.title,
        slug,
        excerpt: article.excerpt,
        content: article.content,
        imageUrl: article.imageUrl,
        publishedAt: new Date(),
        readTime: article.readTime,
        isFeatured: created < 3,
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

    if (article.isBreaking) {
      await prisma.breakingNews.create({
        data: {
          isActive: true,
          headline: article.title,
          url: '/article/' + slug,
        },
      });
    }

    createdIds.push(newArticle.id);
    console.log('CREATED: ' + newArticle.title.substring(0, 60) + '... (ID: ' + newArticle.id + ')');
    created++;
  }

  console.log('\n=== Done! Created ' + created + ' articles ===');
  console.log('Article IDs: ' + createdIds.join(', '));
}

main()
  .then(function() { return prisma.$disconnect(); })
  .catch(function(e) {
    console.error('Error:', e);
    prisma.$disconnect();
    process.exit(1);
  });
