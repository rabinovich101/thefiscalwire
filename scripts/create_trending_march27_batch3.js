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

// 5 Trending Financial News Articles - March 27, 2026 (Batch 3)
const articles = [
  {
    title: 'Meta and Alphabet Found Liable in Landmark Social Media Addiction Trial, Ordered to Pay $6 Million',
    excerpt: 'A Los Angeles jury found Meta and Google negligent in a historic ruling on youth social media addiction, awarding $6 million in damages and opening the door to thousands of similar lawsuits nationwide.',
    content: [
      {type:'paragraph',content:'A Los Angeles County jury delivered a verdict that could reshape the technology industry on Wednesday, finding both Meta Platforms and Alphabet\'s Google liable for damages in a landmark civil trial over youth social media addiction. The jury awarded $3 million in compensatory damages and an additional $3 million in punitive damages to the plaintiff, with Meta responsible for 70% of the total judgment. While the dollar amount is relatively modest, legal experts say the precedent it sets could expose both companies to billions in potential liability from thousands of similar cases pending across the country.'},
      {type:'paragraph',content:'The plaintiff, identified in court documents only by her initials KGM, is a 20-year-old woman who testified that her early exposure to Instagram and YouTube beginning at age 11 triggered a devastating addiction to social media that exacerbated depression and suicidal thoughts throughout her teenage years. Her legal team presented internal Meta documents in which CEO Mark Zuckerberg and other executives discussed strategies to attract and retain younger users, including one particularly damaging memo that stated: "If we wanna win big with teens, we must bring them in as tweens."'},
      {type:'heading',level:2,content:'Internal Documents Prove Devastating for Tech Giants'},
      {type:'paragraph',content:'The trial, which lasted several weeks in California Superior Court, hinged on whether Meta and Google designed their platforms in ways they knew were addictive and harmful to minors. Plaintiff attorneys presented a trove of internal communications showing that both companies were aware of the mental health risks their products posed to young users but prioritized engagement metrics and advertising revenue over safety. Google\'s internal research allegedly showed that YouTube\'s autoplay algorithm was specifically designed to maximize watch time, with engineers acknowledging the feature was particularly effective at keeping younger users on the platform.'},
      {type:'paragraph',content:'Both Meta and Google have vowed to appeal the verdict. A Meta spokesperson stated that the company "disagrees with the verdict and plans to challenge it," while Google called the ruling "inconsistent with the evidence presented at trial." However, plaintiff attorneys and legal scholars noted that the jury\'s willingness to find the companies negligent — rather than protected by Section 230 of the Communications Decency Act — represents a fundamental shift in how courts view platform liability for algorithmic design choices.'},
      {type:'heading',level:2,content:'Wall Street Braces for Wave of Litigation'},
      {type:'paragraph',content:'The financial implications extend far beyond this single case. Meta shares fell 7% on the day of the verdict, while Alphabet declined 2.7%, collectively erasing more than $120 billion in market capitalization. Analysts estimate that more than 4,000 similar lawsuits are pending in state and federal courts across the country, many of them consolidated in multidistrict litigation. If the verdict in this bellwether trial is upheld on appeal, settlement costs could run into the tens of billions of dollars — a prospect that has prompted several analysts to lower their price targets for both stocks.'},
      {type:'paragraph',content:'The ruling also has significant regulatory implications. Congressional leaders from both parties cited the verdict as evidence that federal legislation on children\'s online safety is urgently needed. The Kids Online Safety Act, which has stalled in Congress for years, could see renewed momentum as lawmakers point to the jury\'s findings as proof that self-regulation by technology companies has failed. For investors, the verdict adds yet another layer of uncertainty to an already volatile technology sector grappling with geopolitical tensions and rising interest rates.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['META', 'GOOGL', 'SNAP', 'PINS', 'RDDT'],
    seoKeywords: ['Meta lawsuit', 'social media addiction', 'Alphabet Google liable', 'youth mental health', 'tech regulation', 'Section 230'],
    markets: 'us-markets',
    business: 'tech',
    isBreaking: true,
    tags: ['Meta', 'Alphabet', 'social media addiction', 'tech regulation', 'lawsuit']
  },
  {
    title: 'Warner Bros Discovery Sets April Vote on Historic $111 Billion Paramount Skydance Merger',
    excerpt: 'Warner Bros Discovery will ask shareholders to approve its $111 billion merger with Paramount Skydance on April 23, creating the largest media company in history as the entertainment industry consolidation wave accelerates.',
    content: [
      {type:'paragraph',content:'Warner Bros Discovery has officially scheduled a special shareholder meeting for April 23, 2026, to vote on its transformative $111 billion merger with Paramount Skydance Corporation, setting the stage for what would be the largest media transaction in history. Under the terms of the deal, Paramount will pay WBD shareholders $31 per share in cash, representing a significant premium to where the stock was trading before merger discussions became public. The combined entity would control an unparalleled portfolio of entertainment assets spanning film studios, streaming platforms, cable networks, and sports broadcasting rights.'},
      {type:'paragraph',content:'The WBD board of directors has unanimously recommended that shareholders vote in favor of the transaction, which was unveiled late last month after Warner terminated a previous agreement to sell its studio and streaming assets to Netflix. The pivot from a Netflix deal to the Paramount merger represents a dramatic strategic shift for CEO David Zaslav, who reportedly concluded that remaining independent in an era of hyper-consolidation was no longer viable. The combined company would bring together Warner\'s HBO, CNN, and DC Entertainment with Paramount\'s CBS, Showtime, and Paramount Pictures.'},
      {type:'heading',level:2,content:'Regulatory Hurdles Remain the Key Risk'},
      {type:'paragraph',content:'While the shareholder vote is expected to pass given the premium being offered, regulatory approval represents the more significant hurdle. The Department of Justice\'s antitrust division is currently reviewing the transaction, and the agency\'s top antitrust official stated publicly that the DOJ will "absolutely not" fast-track the approval process for political reasons. The combined entity would control approximately 35% of the U.S. scripted television market and own three of the six major Hollywood studios, raising concerns about market concentration in content production and distribution.'},
      {type:'paragraph',content:'If the transaction does not close by September 30, 2026, WBD shareholders will receive a "ticking fee" of $0.25 per share for each additional quarter, providing some downside protection against extended regulatory delays. Paramount has indicated it expects the deal to close in the third quarter of 2026, though antitrust experts have suggested the review could extend well into early 2027 given the scope of the combined entity\'s market position.'},
      {type:'heading',level:2,content:'Entertainment Industry Transformation Accelerates'},
      {type:'paragraph',content:'The Paramount-WBD merger caps a remarkable period of consolidation in the entertainment industry that has fundamentally reshaped the competitive landscape. The deal follows Disney\'s acquisition of additional streaming content libraries and Amazon\'s continued expansion of its entertainment empire through Prime Video. For investors, the key question is whether the combined Paramount-WBD entity can generate sufficient cost synergies — estimated at $4 billion annually — to justify the premium while simultaneously competing for subscribers in an increasingly crowded streaming market.'},
      {type:'paragraph',content:'WBD shares rose 3.2% on the announcement of the vote date, while Paramount stock traded largely flat as the deal price had already been priced in. Media sector ETFs saw modest gains as investors positioned for potential further consolidation among smaller players who may now find themselves at a competitive disadvantage. The April 23 vote will be closely watched not just for its outcome but as a barometer of shareholder sentiment toward the ongoing wave of mega-mergers reshaping American industry.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['WBD', 'PARA', 'DIS', 'NFLX', 'AMZN', 'CMCSA'],
    seoKeywords: ['Warner Bros Discovery', 'Paramount merger', 'media consolidation', 'WBD shareholder vote', 'entertainment industry', 'streaming wars'],
    markets: 'us-markets',
    business: 'media',
    isBreaking: false,
    tags: ['Warner Bros Discovery', 'Paramount', 'merger', 'media industry', 'streaming']
  },
  {
    title: 'Bitcoin Crashes Below $69,000 as $14 Billion Options Expiry Collides With Iran War Escalation',
    excerpt: 'Bitcoin plunged below $69,000 as a record $14 billion options expiry coincided with Iran rejecting the US peace plan, pushing the crypto market down 20% year-to-date with the Fear & Greed Index at extreme fear levels.',
    content: [
      {type:'paragraph',content:'Bitcoin fell sharply below the psychologically critical $70,000 level on Thursday, dropping 2.5% to $69,036 as the world\'s largest cryptocurrency faced a perfect storm of bearish catalysts. The selloff was amplified by an enormous $14.16 billion Bitcoin options expiry on Friday — the largest quarterly expiry in crypto history — while Iran\'s rejection of a 15-point U.S. peace proposal crushed hopes for a near-term ceasefire and sent risk assets tumbling across the board. The broader cryptocurrency market shed 2.5% to reach a total valuation of $2.36 trillion.'},
      {type:'paragraph',content:'The max pain level for Friday\'s options expiry sits at $75,000, roughly 8% above current prices, creating significant incentive for large market participants to keep prices suppressed heading into the settlement. Open interest in Bitcoin futures has surged to record levels, with leveraged positions on both sides of the trade creating conditions for violent price swings. Traders reported that liquidation cascades had already wiped out more than $500 million in long positions over the past 48 hours as the price sliced through key support levels.'},
      {type:'heading',level:2,content:'Year-to-Date Decline Reaches 20%'},
      {type:'paragraph',content:'Bitcoin has now fallen approximately 20% in 2026, making it one of the worst-performing major asset classes this year. The Crypto Fear & Greed Index has plunged to 27, firmly in "extreme fear" territory and its lowest reading since the FTX collapse in late 2022. The decline has been driven by a combination of factors: surging oil prices that have reignited inflation fears, the Federal Reserve\'s increasingly hawkish stance, and growing regulatory uncertainty around the stalled Clarity Act in Congress.'},
      {type:'paragraph',content:'The Clarity Act, which seeks to establish a comprehensive regulatory framework for digital assets, contains a controversial provision that would prohibit yield generation on stablecoins — effectively making them less attractive as an investment vehicle. The provision has drawn fierce opposition from the crypto industry and has contributed to capital outflows from stablecoin protocols that had been a major source of liquidity in the ecosystem. Combined with the macro headwinds, the regulatory overhang has created a toxic environment for crypto prices.'},
      {type:'heading',level:2,content:'Ethereum and Altcoins Fare Even Worse'},
      {type:'paragraph',content:'The pain has been even more acute in altcoin markets. Ethereum fell 3.8% to $1,842, while XRP declined 4.1% as the broader altcoin market experienced a sharper risk-off rotation than Bitcoin itself. The ETH/BTC ratio has fallen to multi-year lows, reflecting a classic flight-to-quality pattern within the crypto ecosystem where investors reduce exposure to higher-beta assets during periods of stress. Solana, which had been one of the best performers of 2025, has now given back more than half of last year\'s gains.'},
      {type:'paragraph',content:'Despite the gloom, some analysts see a potential silver lining in the washout. Bitcoin\'s Relative Strength Index has reached oversold territory on the weekly chart for the first time since the 2022 bear market bottom, a technical signal that has historically preceded significant rallies. However, with the Iran conflict showing no signs of resolution and the Fed unlikely to provide monetary stimulus anytime soon, the path of least resistance for crypto appears to remain lower in the near term. Institutional investors have been notably absent from the buy side, with Bitcoin ETF flows turning negative for three consecutive weeks.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['MSTR', 'COIN', 'MARA', 'RIOT', 'IBIT'],
    seoKeywords: ['Bitcoin crash', 'crypto options expiry', 'Bitcoin price', 'cryptocurrency market', 'Iran war crypto', 'Bitcoin 2026'],
    markets: 'crypto',
    business: 'finance',
    isBreaking: true,
    tags: ['Bitcoin', 'cryptocurrency', 'options expiry', 'crypto crash', 'Iran war']
  },
  {
    title: 'Iran Rejects US 15-Point Peace Plan as Oil Surges to $108, Trump Extends Ceasefire Deadline',
    excerpt: 'Iran officially rejected the US 15-point peace proposal delivered through Pakistan, stating it has "no intention of holding direct talks" as Brent crude surged 5.7% to $108 per barrel and Trump extended his ceasefire deadline.',
    content: [
      {type:'paragraph',content:'The prospects for a swift resolution to the U.S.-Iran conflict dimmed dramatically on Thursday after Iranian state media reported that Tehran had formally rejected a 15-point peace proposal that Pakistan had delivered on behalf of the United States. Iran\'s foreign ministry spokesman stated unequivocally that the country has "no intention of holding direct talks with the United States," shattering the fragile optimism that had briefly lifted markets earlier in the week. President Trump responded by extending his previously stated ceasefire deadline while insisting that "neither the spike in oil prices nor the slump in the stock market" were as severe as he had anticipated.'},
      {type:'paragraph',content:'Energy markets reacted violently to the diplomatic collapse. Brent crude futures surged 5.66% to settle at $108.01 per barrel, while West Texas Intermediate climbed 4.61% to $94.48 — both reaching levels not seen since the 2022 energy crisis triggered by Russia\'s invasion of Ukraine. The rally in crude pushed gasoline futures to their highest levels since the summer of 2022, raising the specter of $5-per-gallon pump prices across much of the United States as the peak driving season approaches.'},
      {type:'heading',level:2,content:'Strait of Hormuz Disruption Threatens Global Supply'},
      {type:'paragraph',content:'The most critical concern for energy markets remains the potential for sustained disruption to oil shipments through the Strait of Hormuz, through which approximately 20% of global crude oil supply passes daily. While Iran has not formally threatened to close the waterway, naval skirmishes in the Persian Gulf have intensified in recent weeks, and insurance rates for tankers transiting the strait have skyrocketed. Energy analysts at Goldman Sachs warned that a prolonged blockade could send Brent crude above $150 per barrel, a level that would almost certainly trigger a global recession.'},
      {type:'paragraph',content:'The conflict, now in its 28th day, has already had cascading effects across the global economy. The OECD this week raised its U.S. inflation forecast from 2.6% to 4.2% for 2026, while consumer confidence surveys have plunged to recessionary levels. Defense stocks have been among the few beneficiaries, with Lockheed Martin, Raytheon, and Northrop Grumman all trading near all-time highs as markets price in an extended military engagement.'},
      {type:'heading',level:2,content:'Diplomatic Channels Narrow'},
      {type:'paragraph',content:'With direct negotiations off the table, the diplomatic path forward has narrowed considerably. Pakistan, which had been serving as an intermediary, expressed disappointment at Iran\'s rejection but indicated it would continue to "facilitate communication" between the parties. China and Russia, both of which have significant energy relationships with Iran, have called for restraint but stopped short of applying meaningful pressure on Tehran to engage in negotiations. The United Nations Security Council remains deadlocked on any resolution addressing the conflict.'},
      {type:'paragraph',content:'For investors, the prolonged conflict creates a particularly challenging environment. Energy stocks and defense contractors continue to outperform, while virtually every other sector faces headwinds from higher input costs and deteriorating consumer sentiment. Safe-haven assets including gold, which hit fresh all-time highs above $3,100 per ounce, and U.S. Treasury bonds continue to attract capital. Market strategists increasingly warn that a resolution to the conflict is now a prerequisite for any sustained equity market recovery, and the timeline for such a resolution appears to be lengthening with each passing day.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1474314170901-f351b68f544f?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['USO', 'XLE', 'LMT', 'RTX', 'NOC', 'GLD'],
    seoKeywords: ['Iran peace plan rejected', 'oil prices surge', 'Brent crude $108', 'Iran war', 'Trump ceasefire', 'Strait of Hormuz'],
    markets: 'commodities',
    business: 'economy',
    isBreaking: true,
    tags: ['Iran war', 'oil prices', 'Trump', 'ceasefire', 'geopolitics']
  },
  {
    title: 'Fed Rate Cut Hopes Evaporate as Markets Price In Only 8% Chance of Easing in 2026',
    excerpt: 'Federal funds futures now show just an 8% probability of a rate cut this year as oil-fueled inflation and a resilient labor market force the Fed into an extended hold, with some traders even pricing a 14% chance of a rate hike.',
    content: [
      {type:'paragraph',content:'The Federal Reserve\'s path forward has become one of the most debated topics on Wall Street as oil-driven inflation collides with slowing economic growth, creating a policy dilemma that has effectively paralyzed the central bank. Fed funds futures now reflect just an 8% probability of a rate cut in 2026 — down from over 80% at the start of the year — while an increasingly vocal minority of traders are pricing in a 14% chance of at least one rate hike. The dramatic repricing reflects a fundamental reassessment of the economic outlook that has upended investment strategies built on the assumption of monetary easing.'},
      {type:'paragraph',content:'At its March meeting, the Federal Open Market Committee held the federal funds rate steady at 4.25%-4.50% for the sixth consecutive meeting, while the updated Summary of Economic Projections showed a median forecast of just one rate cut in 2026 — a far cry from the three cuts officials had projected as recently as September 2025. Fed Chair Jerome Powell acknowledged the "extraordinary uncertainty" created by the Iran conflict and its impact on energy prices but stopped short of providing any guidance on the timing of future policy moves.'},
      {type:'heading',level:2,content:'Inflation Running Hot Across Multiple Metrics'},
      {type:'paragraph',content:'The data supporting the Fed\'s cautious stance has been unambiguous. Headline PCE inflation remains at 2.8% with core PCE at 3.0%, both well above the Fed\'s 2% longer-run target. The OECD\'s revised forecast of 4.2% all-items inflation for 2026 suggests the worst may be yet to come as energy cost increases filter through to goods and services prices with a lag. Shelter inflation, which had been gradually moderating, has shown signs of reaccelerating as higher energy costs push up construction and maintenance expenses.'},
      {type:'paragraph',content:'What makes the Fed\'s position particularly agonizing is that the economic data outside of inflation is deteriorating rapidly. Q4 2025 GDP was revised down to just 0.7% annualized growth, consumer sentiment has plunged to recessionary lows, and job creation has stalled — the economy added just 116,000 jobs for all of 2025, with payrolls outside healthcare-related fields declining by more than half a million over the past year. The classic definition of stagflation — high inflation combined with stagnant growth — appears to be materializing in real time.'},
      {type:'heading',level:2,content:'Bond Market Sends Conflicting Signals'},
      {type:'paragraph',content:'The bond market has reflected the policy uncertainty through extreme volatility. The 10-year Treasury yield has oscillated between 4.5% and 4.9% over the past month, with traders struggling to price competing scenarios of persistent inflation versus economic recession. The yield curve has flattened dramatically, with the 2-year/10-year spread hovering near zero as front-end rates remain anchored by Fed policy while long-end rates are pulled lower by recession fears and higher by inflation expectations simultaneously.'},
      {type:'paragraph',content:'The incoming Fed Chair Kevin Warsh, who is expected to be confirmed in the coming months, represents another wild card for monetary policy. Warsh has historically favored a more hawkish approach and has publicly questioned the Fed\'s tolerance for above-target inflation. Some market participants worry that a Warsh-led Fed could actually raise rates in response to the energy-driven inflation shock, a move that would likely tip the economy into outright recession but one that Warsh\'s academic writings suggest he might consider if inflation expectations become unanchored. For now, the Fed is locked in a hold pattern, waiting for clarity that the geopolitical situation seems unlikely to provide anytime soon.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['TLT', 'IEF', 'SHY', 'SPY', 'GLD', 'DXY'],
    seoKeywords: ['Fed rate cut', 'Federal Reserve 2026', 'interest rates', 'inflation', 'Kevin Warsh', 'stagflation', 'monetary policy'],
    markets: 'us-markets',
    business: 'economy',
    isBreaking: false,
    tags: ['Federal Reserve', 'interest rates', 'inflation', 'stagflation', 'monetary policy']
  }
];

async function main() {
  console.log('=== Creating 5 Trending Articles - March 27, 2026 (Batch 3) ===\n');

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
