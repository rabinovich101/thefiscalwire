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

// 5 Trending Viral Articles - March 27, 2026 (Batch 4 - Afternoon Edition)
const articles = [
  {
    title: 'SK Hynix Preparing US Listing as Nvidia Supplier Eyes ADR Filing in Second Half of 2026',
    excerpt: 'South Korean memory giant SK Hynix confirmed plans to list shares in the United States via American Depositary Receipts, with CEO Kwak Noh-Jung revealing the company has already filed with the SEC as demand for AI memory chips reaches unprecedented levels.',
    content: [
      {type:'paragraph',content:'South Korean semiconductor powerhouse SK Hynix, one of the world\'s largest memory chip manufacturers and a critical supplier to Nvidia, announced on Wednesday that it is preparing to list its shares on a US exchange in the second half of 2026. CEO Kwak Noh-Jung made the disclosure at a shareholders meeting, confirming that the company has already filed for an American Depositary Receipt (ADR) listing with the US Securities and Exchange Commission. The move would give American investors direct access to one of the most important companies in the global AI supply chain.'},
      {type:'paragraph',content:'SK Hynix has been a primary beneficiary of the artificial intelligence revolution, supplying High Bandwidth Memory (HBM) chips that are essential components in Nvidia\'s data center GPUs. The company\'s HBM3E chips are used in Nvidia\'s H200 and next-generation Blackwell processors, and demand has far outstripped supply for the past two years. SK Hynix reported record revenue of $66.2 billion in fiscal 2025, with operating profits surging 400% year-over-year as AI-related memory sales accounted for more than 40% of total revenue.'},
      {type:'heading',level:2,content:'Strategic Rationale Behind the US Listing'},
      {type:'paragraph',content:'The ADR listing serves multiple strategic purposes for SK Hynix. First, it provides access to the world\'s deepest capital markets at a time when the company needs to fund massive capacity expansions to meet AI demand. SK Hynix has committed to investing $75 billion over the next five years in new fabrication facilities, including a $15 billion advanced packaging plant in Indiana that received preliminary CHIPS Act funding approval. A US listing would also raise the company\'s profile among institutional investors who currently cannot easily invest in Korean-listed stocks due to regulatory and operational barriers.'},
      {type:'paragraph',content:'The announcement sent SK Hynix shares surging 8.3% on the Korea Exchange, pushing its market capitalization above $120 billion. Analysts at Morgan Stanley raised their price target, noting that a US listing could result in a valuation premium similar to what Taiwan Semiconductor Manufacturing Company (TSMC) commands through its ADR program. TSMC\'s US-listed shares trade at a roughly 15% premium to their Taiwan-listed equivalents, reflecting the liquidity and accessibility benefits of a US listing.'},
      {type:'heading',level:2,content:'Implications for the Semiconductor Supply Chain'},
      {type:'paragraph',content:'The US listing comes at a pivotal moment for the global semiconductor industry. The CHIPS and Science Act has catalyzed a wave of investment in domestic chip manufacturing, and a US-listed SK Hynix would be well-positioned to participate in future government incentive programs. The company\'s Indiana facility, which will produce advanced HBM chips for AI applications, is expected to create over 3,000 high-paying jobs and begin production in 2028.'},
      {type:'paragraph',content:'For investors in the AI ecosystem, SK Hynix\'s US listing would provide another avenue to gain exposure to the insatiable demand for AI infrastructure. The company sits at a critical chokepoint in the supply chain — without HBM chips, the most advanced AI training and inference systems simply cannot function. With Samsung Electronics also reportedly considering a US listing for its semiconductor division, the trend of Asian chip giants seeking US capital market access appears to be accelerating. Nvidia shares rose 2.1% on the news, as analysts noted that a better-capitalized SK Hynix would help alleviate supply constraints that have been a persistent headwind for Nvidia\'s growth.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['NVDA', 'TSM', 'MU', 'INTC', 'AMD', 'AVGO'],
    seoKeywords: ['SK Hynix US listing', 'SK Hynix ADR', 'HBM memory chips', 'Nvidia supplier', 'semiconductor IPO', 'AI chips'],
    markets: 'global-markets',
    business: 'tech',
    isBreaking: true,
    tags: ['SK Hynix', 'semiconductors', 'US listing', 'Nvidia', 'AI chips']
  },
  {
    title: 'AMD and Intel Hike CPU Prices as Server Chip Supply Crunch Worsens, Wait Times Stretch to 6 Months',
    excerpt: 'Both AMD and Intel have notified clients of significant CPU price increases effective March and April, as a worsening supply shortage for server and PC processors extends delivery lead times to six months and threatens to slow enterprise AI deployments.',
    content: [
      {type:'paragraph',content:'Advanced Micro Devices and Intel have both informed major customers that they will raise prices on central processing units starting in March and April respectively, according to a report by Nikkei Asia that sent both stocks higher on Wednesday. The price hikes arrive as a severe supply crunch is affecting wait times for CPUs used in servers and personal computers, with some enterprise customers reporting delivery lead times stretching to six months — the longest since the post-pandemic chip shortage of 2021-2022.'},
      {type:'paragraph',content:'AMD\'s price increases are expected to range from 10% to 25% across its EPYC server processor lineup, with the largest increases affecting the newest Zen 5-based Turin chips that have been in extremely high demand from hyperscale cloud providers and enterprise data centers. Intel\'s increases are more modest at 5% to 15% but apply broadly across both its Xeon server line and its Core Ultra client processors. Both companies cited rising manufacturing costs, increased demand driven by AI workloads, and supply chain disruptions related to the Iran conflict as factors driving the increases.'},
      {type:'heading',level:2,content:'AI Demand Creating Unexpected CPU Bottleneck'},
      {type:'paragraph',content:'While much of the semiconductor industry\'s focus has been on GPU shortages driven by AI training demand, the CPU market is now experiencing its own AI-driven supply crisis. Modern AI data centers require not just GPUs but also powerful CPUs to handle data preprocessing, model serving, networking, and orchestration tasks. A typical AI server rack contains multiple high-end CPUs alongside GPU accelerators, and the explosion in AI infrastructure buildout has created competing demand for CPU capacity that was already constrained.'},
      {type:'paragraph',content:'The supply situation has been further complicated by the Iran conflict\'s impact on semiconductor-grade neon gas supplies. Iran produces approximately 12% of the world\'s neon used in chip lithography, and disruptions to this supply have cascaded through the manufacturing chain. While leading-edge foundries like TSMC had diversified their neon sources after the Russia-Ukraine conflict, legacy fabs that produce many CPU components still rely on a more concentrated supply base.'},
      {type:'heading',level:2,content:'Market Impact and Enterprise Spending Implications'},
      {type:'paragraph',content:'AMD shares rose 4.2% on the news while Intel gained 3.1%, as investors viewed the price increases as evidence of strong demand and improving pricing power for both companies. For AMD in particular, the ability to raise prices on its server chips represents a significant competitive milestone — the company has historically competed primarily on value rather than commanding premium pricing. Analysts at Bernstein estimated that the price increases could add $2 billion to AMD\'s annual server revenue if volumes hold steady.'},
      {type:'paragraph',content:'However, enterprise IT buyers and cloud service providers are less enthusiastic about the price hikes. Several major cloud operators have reportedly begun exploring alternative architectures, including ARM-based processors from Ampere Computing and custom chips from Amazon Web Services, to reduce their dependence on the x86 duopoly. The price increases also threaten to slow the broader enterprise digital transformation and AI adoption wave, as companies face rising costs for the compute infrastructure needed to deploy AI applications at scale. For CIOs already contending with budget pressures from the broader economic slowdown, the CPU price hikes add yet another challenge to an already difficult planning environment.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['AMD', 'INTC', 'TSM', 'NVDA', 'AMZN', 'MSFT'],
    seoKeywords: ['AMD price increase', 'Intel CPU price hike', 'server chip shortage', 'CPU supply crunch', 'semiconductor shortage 2026', 'AI infrastructure'],
    markets: 'us-markets',
    business: 'tech',
    isBreaking: false,
    tags: ['AMD', 'Intel', 'CPU shortage', 'semiconductors', 'price increase']
  },
  {
    title: 'Recession Odds Surge on Wall Street as Economists Warn of Cracks Beneath the Surface of the Economy',
    excerpt: 'Major Wall Street banks have sharply raised their recession probability forecasts as consumer confidence craters, job creation stalls, and oil-fueled inflation squeezes household budgets, with a NerdWallet survey showing 65% of Americans now expect a downturn.',
    content: [
      {type:'paragraph',content:'Wall Street economists are sounding the alarm on the US economy as a cascade of weakening indicators suggests the expansion that began after the 2020 pandemic recession may be nearing its end. Goldman Sachs has raised its recession probability to 35% from 20% a month ago, while JPMorgan Chase puts the odds at 40% and Moody\'s Analytics chief economist Mark Zandi has warned that "the economy is one shock away from recession." The growing pessimism reflects a toxic combination of surging oil prices, persistent inflation, stalling job growth, and deteriorating consumer confidence that has accelerated markedly since the Iran conflict began four weeks ago.'},
      {type:'paragraph',content:'The labor market, long considered the economy\'s strongest pillar, is showing unmistakable signs of stress. The economy added just 116,000 jobs through all of 2025, a shocking deceleration from the robust gains of prior years. More concerning, payrolls outside healthcare-related fields have actually declined by more than 500,000 over the past year, suggesting that job creation has become dangerously narrow. Weekly initial jobless claims have crept above 240,000, while continuing claims have risen to levels not seen since early 2022.'},
      {type:'heading',level:2,content:'Consumer Confidence Craters to Recessionary Levels'},
      {type:'paragraph',content:'A NerdWallet survey released this week found that 65% of Americans now expect a recession within the next 12 months, up 6 percentage points from the prior month and the highest reading since the survey began in 2022. The University of Michigan Consumer Sentiment Index, whose final March reading is due Friday, is expected to confirm a sharp decline as Americans grapple with rising gasoline prices, elevated food costs, and stagnant wage growth. Consumer spending, which accounts for roughly 70% of US GDP, grew at its slowest pace in three years during the fourth quarter of 2025.'},
      {type:'paragraph',content:'The housing market has also become a significant drag on economic activity. KB Home, reporting earnings this week, said it expects to deliver between 10,000 and 11,500 homes in 2026 — a range that reflects the company\'s uncertainty about demand in the current environment. CEO Jeffrey Mezger cited "depressed consumer confidence, elevated mortgage rates, and affordability pressures" as headwinds that have stifled demand ahead of the crucial spring selling season. With 30-year mortgage rates hovering near 7%, the housing affordability crisis continues to lock out first-time buyers and reduce residential investment.'},
      {type:'heading',level:2,content:'GDP Estimates Paint a Grim Picture'},
      {type:'paragraph',content:'Fourth quarter 2025 GDP is expected to be revised down to just 0.7% annualized growth in Thursday\'s third estimate, while early tracking models for Q1 2026 are flashing warning signs. The Atlanta Fed\'s GDPNow model currently estimates Q1 growth at a meager 0.3%, dangerously close to contraction territory. The five-year breakeven inflation rate has risen 26 basis points since the Iran conflict began, reaching its highest level since February 2025, while the odds of a Fed rate cut this year have collapsed from 95% a month ago to just 8%.'},
      {type:'paragraph',content:'The specter of stagflation — the economically devastating combination of stagnant growth and high inflation — looms large over the outlook. The OECD has raised its US inflation forecast from 2.6% to 4.2% for 2026 while simultaneously lowering its growth projection, a divergence that mirrors the stagflationary conditions of the 1970s. For investors, the implications are sobering: equities historically perform poorly during stagflationary periods as companies face margin compression from rising costs and weakening demand simultaneously. Defensive sectors including utilities, healthcare, and consumer staples have begun to outperform, while cyclical sectors like consumer discretionary, industrials, and financials have underperformed sharply over the past month.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop&q=80',
    readTime: 6,
    relevantTickers: ['SPY', 'XLU', 'XLP', 'XLV', 'XLY', 'TLT'],
    seoKeywords: ['recession 2026', 'US economy warning', 'stagflation risk', 'consumer confidence drop', 'Wall Street recession odds', 'economic slowdown'],
    markets: 'us-markets',
    business: 'economy',
    isBreaking: true,
    tags: ['recession', 'economy', 'stagflation', 'consumer confidence', 'GDP']
  },
  {
    title: 'Apple Unveils AI-Powered Siri Overhaul With On-Screen Awareness Coming in iOS 26.4 This Spring',
    excerpt: 'Apple has officially announced that a completely reimagined, AI-powered Siri will debut alongside iOS 26.4, featuring context-aware intelligence, on-screen awareness, and seamless cross-app integration powered by Apple\'s proprietary large language models.',
    content: [
      {type:'paragraph',content:'Apple has officially pulled back the curtain on its most ambitious artificial intelligence initiative to date, announcing that a fundamentally reimagined version of Siri will launch this spring alongside iOS 26.4. The new Siri represents a ground-up rebuild of Apple\'s voice assistant, powered by proprietary large language models that run both on-device and in Apple\'s Private Cloud Compute infrastructure. The centerpiece feature is "on-screen awareness" — the ability for Siri to understand and act on whatever content is currently displayed on the user\'s screen, enabling natural language interactions that were previously impossible.'},
      {type:'paragraph',content:'In demonstrations shown to select media, the new Siri seamlessly handled complex multi-step tasks that would have been impossible for the current version. Users could look at a restaurant review in Safari and say "book a table there for Friday night" — with Siri understanding the context from the screen, finding the restaurant in Maps, and completing the reservation through a supported booking app. Similarly, viewing a product in a text message and asking Siri to "find this cheaper" triggered an intelligent price comparison across multiple shopping apps installed on the device.'},
      {type:'heading',level:2,content:'Apple\'s LLM Strategy Takes Shape'},
      {type:'paragraph',content:'The technical architecture behind the new Siri reflects Apple\'s distinctive approach to AI deployment. Smaller models running directly on Apple silicon handle routine queries and screen analysis with zero latency, while more complex requests are seamlessly routed to Apple\'s Private Cloud Compute servers. Crucially, Apple emphasized that no user data is stored on its servers and that all cloud processing occurs in encrypted enclaves that even Apple employees cannot access — a privacy-first approach that differentiates Apple from competitors like Google and OpenAI whose AI assistants process queries on general-purpose cloud infrastructure.'},
      {type:'paragraph',content:'Apple has also opened a new developer API called "App Intents for Intelligence" that allows third-party apps to expose their functionality to Siri in structured ways. This means Siri can orchestrate actions across multiple apps without those apps needing to communicate directly with each other. Early partners include major banks, airlines, food delivery services, and productivity suites, with Apple saying over 500 apps will support the new capabilities at launch.'},
      {type:'heading',level:2,content:'Competitive Implications for the AI Assistant Race'},
      {type:'paragraph',content:'The announcement puts Apple in direct competition with Google\'s Gemini-powered assistant and OpenAI\'s ChatGPT, both of which have been rapidly expanding their capabilities on mobile devices. Apple\'s key advantage is its control over the entire hardware-software stack, which enables on-device processing speeds and privacy guarantees that cloud-dependent competitors cannot match. The company also benefits from its installed base of over 2 billion active devices, giving it unparalleled distribution for its AI features.'},
      {type:'paragraph',content:'Wall Street reaction was cautiously positive, with Apple shares rising 1.8% following the announcement. Analysts at Wedbush called the new Siri "the most significant product upgrade at Apple since the iPhone X" and estimated it could drive a meaningful upgrade cycle as users seek devices with the latest Apple silicon needed to run the most capable on-device models. However, some analysts noted that Apple\'s AI efforts remain behind Google and OpenAI in raw model capability, and that the success of the new Siri will ultimately depend on whether the real-world user experience matches the carefully curated demos. The iOS 26.4 update is expected to begin rolling out in late April 2026.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1591337676887-a217a6c2e4e0?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['AAPL', 'GOOGL', 'MSFT', 'NVDA', 'QCOM'],
    seoKeywords: ['Apple Siri AI', 'iOS 26.4', 'Apple intelligence', 'AI assistant', 'on-screen awareness', 'Apple LLM'],
    markets: 'us-markets',
    business: 'tech',
    isBreaking: false,
    tags: ['Apple', 'Siri', 'artificial intelligence', 'iOS update', 'tech']
  },
  {
    title: 'CLARITY Act Faces March 27 Deadline With 90% Approval Odds as Crypto Industry Holds Its Breath',
    excerpt: 'The landmark CLARITY Act, which would establish comprehensive regulatory framework defining which digital assets are commodities versus securities, faces a critical congressional deadline today with over 90% approval odds according to prediction markets.',
    content: [
      {type:'paragraph',content:'The cryptocurrency industry is watching Washington with bated breath as the Comprehensive Legislation for the Advancement and Regulation of Innovative Technologies for Years (CLARITY) Act faces a pivotal deadline on March 27, 2026. The legislation, which has been years in the making, would for the first time establish clear federal guidelines defining which digital assets fall under commodities law regulated by the CFTC versus securities law governed by the SEC. Prediction markets show over 90% odds of the bill clearing its final committee vote today, setting the stage for a full Senate floor vote as early as next week.'},
      {type:'paragraph',content:'The CLARITY Act\'s core innovation is a "sufficiently decentralized" test that would exempt digital assets meeting specific criteria from securities registration requirements. Under the proposed framework, tokens associated with blockchain networks where no single entity controls more than 20% of governance or validation power would be classified as commodities, while tokens that remain under centralized control would be regulated as securities. The distinction has enormous implications for the industry — commodities classification means lighter regulatory requirements, no mandatory registration with the SEC, and eligibility for trading on a broader range of platforms.'},
      {type:'heading',level:2,content:'Stablecoin Provision Sparks Industry Backlash'},
      {type:'paragraph',content:'While the overall framework has been welcomed by most of the crypto industry, one controversial provision has generated fierce opposition. Section 7 of the CLARITY Act would prohibit yield generation on stablecoins, effectively banning the practice of paying interest to stablecoin holders — a core feature of protocols like MakerDAO\'s DAI savings rate and Circle\'s USDC yield products. Proponents argue the ban is necessary to prevent stablecoins from functioning as unregulated bank deposits, while critics say it would cripple innovation and drive stablecoin activity offshore.'},
      {type:'paragraph',content:'The stablecoin yield ban has already had market effects even before passage. Capital has been flowing out of yield-bearing stablecoin protocols in anticipation of the regulation, contributing to reduced liquidity across the broader DeFi ecosystem. Tether\'s USDT and Circle\'s USDC have both seen their total supply decline modestly over the past month as some holders rotate into other yield-generating instruments that would not be affected by the legislation.'},
      {type:'heading',level:2,content:'Market Implications of Regulatory Clarity'},
      {type:'paragraph',content:'Despite the stablecoin controversy, the broader crypto market stands to benefit significantly from regulatory clarity. The current legal ambiguity, which has persisted since the SEC began aggressively pursuing enforcement actions against crypto companies in 2023, has been a major impediment to institutional adoption. Major financial institutions including BlackRock, Fidelity, and JPMorgan have all indicated that clear regulation would unlock significantly more capital allocation to digital assets.'},
      {type:'paragraph',content:'Coinbase shares rose 5.2% in pre-market trading on Thursday as the exchange is widely seen as the biggest beneficiary of the CLARITY Act\'s passage. Under the new framework, Coinbase would face a clearer path to listing additional tokens without fear of SEC enforcement actions, potentially expanding its tradeable asset universe by hundreds of tokens. Other publicly traded crypto companies including MicroStrategy, Marathon Digital, and Riot Platforms also saw gains as investors positioned for a potential regulatory tailwind. However, Bitcoin itself has been unable to rally on the legislative optimism, weighed down by the broader macro headwinds of the Iran conflict and elevated oil prices that continue to dominate market sentiment.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['COIN', 'MSTR', 'MARA', 'RIOT', 'IBIT', 'BITO'],
    seoKeywords: ['CLARITY Act', 'crypto regulation', 'digital assets law', 'stablecoin regulation', 'SEC CFTC crypto', 'cryptocurrency legislation'],
    markets: 'crypto',
    business: 'finance',
    isBreaking: true,
    tags: ['CLARITY Act', 'crypto regulation', 'stablecoin', 'SEC', 'digital assets']
  }
];

async function main() {
  console.log('=== Creating 5 Trending Articles - March 27, 2026 (Batch 4 - Afternoon) ===\n');

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
