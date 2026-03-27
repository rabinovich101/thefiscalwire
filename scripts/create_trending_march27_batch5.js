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

// 5 Trending Viral Articles - March 27, 2026 (Batch 5 - Evening Edition)
const articles = [
  {
    title: 'SpaceX Expected to File for Largest IPO in History This Week With $1.75 Trillion Valuation Target',
    excerpt: 'Elon Musk\'s SpaceX is reportedly preparing to file for its initial public offering as early as this week, targeting a record-shattering $1.75 trillion valuation that would make it the biggest IPO in history and dwarf every previous market debut.',
    content: [
      {type:'paragraph',content:'SpaceX, the aerospace giant founded by Elon Musk, is reportedly preparing to file for its initial public offering as early as this week, according to a CNBC report that sent shockwaves through financial markets on Thursday. The company is targeting a valuation of up to $1.75 trillion and aims to raise approximately $50 billion in what would be the largest IPO in history by a massive margin. The filing would come just weeks after SpaceX completed its acquisition of xAI, creating a combined entity that spans rocket launches, satellite internet, and artificial intelligence.'},
      {type:'paragraph',content:'The anticipated IPO has already catalyzed significant moves in funds with SpaceX exposure. Cathie Wood\'s ARK Venture Fund (ARKVX), which holds SpaceX as its largest position at 18% of the portfolio, has seen a surge of inflows as retail investors scramble for pre-IPO exposure. ARK projects SpaceX could reach a $2.5 trillion valuation by 2030, driven primarily by the explosive growth of its Starlink satellite internet division, which now serves over 5 million subscribers across 100 countries and is approaching profitability.'},
      {type:'heading',level:2,content:'A Valuation That Defies Historical Precedent'},
      {type:'paragraph',content:'At $1.75 trillion, SpaceX would debut at a valuation larger than the entire market capitalizations of companies like Meta Platforms, Berkshire Hathaway, or Saudi Aramco at their IPO. The astronomical figure reflects SpaceX\'s unique position spanning multiple high-growth markets: commercial launch services, government defense contracts, global broadband internet via Starlink, and now AI infrastructure following the xAI merger. Revenue is estimated to have exceeded $15 billion in 2025, with projections of $25 billion or more for 2026 as Starlink subscriptions accelerate and defense contracts expand.'},
      {type:'paragraph',content:'Wall Street banks are reportedly jockeying for lead underwriter positions, with Goldman Sachs, Morgan Stanley, and JPMorgan Chase all in discussions to manage the offering. The IPO would likely be structured as a dual-class share arrangement, allowing Musk to retain voting control while giving public investors economic exposure to the company\'s growth. Some analysts have raised concerns about the valuation premium, noting that SpaceX would trade at roughly 70 times estimated 2026 revenue — a multiple that assumes near-perfect execution across multiple business lines in an increasingly competitive landscape.'},
      {type:'heading',level:2,content:'Implications for the Broader Market'},
      {type:'paragraph',content:'The SpaceX IPO arrives at a challenging moment for equity markets, with the S&P 500 under pressure from geopolitical tensions and recession fears. However, bankers believe the offering could actually serve as a positive catalyst by demonstrating continued investor appetite for transformative technology companies. The deal would also provide a massive liquidity event for SpaceX\'s existing investors and employees, potentially injecting billions of dollars back into the technology ecosystem. For the broader space industry, a successful SpaceX IPO would validate the sector and could trigger a wave of follow-on offerings from companies like Rocket Lab, Relativity Space, and Blue Origin.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['RKLB', 'BA', 'LMT', 'NOC', 'GOOG', 'GS'],
    seoKeywords: ['SpaceX IPO', 'SpaceX valuation', 'Elon Musk IPO', 'Starlink IPO', 'largest IPO history', 'SpaceX stock'],
    markets: 'us-markets',
    business: 'tech',
    isBreaking: true,
    tags: ['SpaceX', 'IPO', 'Elon Musk', 'Starlink', 'space industry']
  },
  {
    title: 'Oil Surges Past $107 as Strait of Hormuz Disruptions Create Largest Supply Crisis in History',
    excerpt: 'Brent crude surged past $107 per barrel on Thursday as the ongoing US-Iran conflict continues to disrupt tanker traffic through the Strait of Hormuz, creating what the IEA has called the largest oil supply disruption in the history of the global market.',
    content: [
      {type:'paragraph',content:'Oil prices surged to their highest levels in over two years on Thursday, with Brent crude climbing past $107 per barrel and West Texas Intermediate reaching $93.79, as the month-old US-Iran conflict continues to choke off the world\'s most critical energy chokepoint. The International Energy Agency has declared the current disruption the largest supply crisis in the history of the global oil market, with flows through the Strait of Hormuz — which normally carries 20 million barrels per day, roughly 20% of global consumption — collapsing to a trickle as military operations intensify in the Persian Gulf region.'},
      {type:'paragraph',content:'The supply shock has forced major investment banks to dramatically revise their oil price forecasts. Macquarie raised its fiscal year 2026 WTI average forecast from $58 to $83 per barrel, while Goldman Sachs now projects Brent could average $95 for the full year if the conflict persists through summer. Morgan Stanley\'s latest analysis warns that a prolonged closure of the Strait could push Brent above $130 per barrel, a level that would almost certainly tip the global economy into recession by choking consumer spending and corporate margins simultaneously.'},
      {type:'heading',level:2,content:'Gulf Producers Running Out of Storage'},
      {type:'paragraph',content:'The situation on the ground is deteriorating rapidly. Gulf producers including Saudi Arabia, Kuwait, and the UAE have been forced to curtail output by at least 10 million barrels per day — not because of direct military damage to facilities, but because they have literally run out of storage capacity with tanker traffic unable to safely transit the strait. Saudi Aramco has reportedly filled every available storage tank in the kingdom and has begun shutting in production from its largest fields, including the giant Ghawar reservoir. The physical disruption is unprecedented in scale, dwarfing previous crises including the 1990 Iraqi invasion of Kuwait and the 2019 Abqaiq attacks.'},
      {type:'paragraph',content:'The ripple effects are being felt across the global economy. US gasoline prices have surged to a national average of $4.85 per gallon, up from $3.20 just six weeks ago, squeezing household budgets that were already strained by persistent inflation. European natural gas prices have also spiked, as Qatar — the world\'s largest LNG exporter — faces similar transit challenges for its liquefied natural gas shipments. The energy shock has added an estimated 1.5 percentage points to headline inflation forecasts across developed economies, complicating central bank efforts to normalize monetary policy.'},
      {type:'heading',level:2,content:'Diplomatic Efforts and Market Outlook'},
      {type:'paragraph',content:'Diplomatic efforts to resolve the crisis have so far failed to gain traction. Initial optimism over a US offer to delay its deadline for Iran to reach a deal faded quickly as both sides hardened their positions. The five-year breakeven inflation rate has risen 26 basis points since the conflict began, reflecting market expectations that energy-driven inflation will persist. For investors, energy stocks have been the clear beneficiaries — the S&P 500 Energy sector is up 22% since the conflict began, while defensive sectors like utilities and consumer staples have also outperformed. The question now is whether diplomatic channels can reopen before the supply crisis triggers a full-blown global recession.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=1200&h=630&fit=crop&q=80',
    readTime: 6,
    relevantTickers: ['XOM', 'CVX', 'COP', 'OXY', 'XLE', 'USO'],
    seoKeywords: ['oil prices surge', 'Strait of Hormuz', 'Iran war oil', 'energy crisis 2026', 'oil supply disruption', 'Brent crude $107'],
    markets: 'global-markets',
    business: 'economy',
    isBreaking: true,
    tags: ['oil prices', 'Iran conflict', 'energy crisis', 'Strait of Hormuz', 'OPEC']
  },
  {
    title: 'Meta Slashes 700 Jobs Across Reality Labs and Facebook as AI Spending Soars to $167 Billion',
    excerpt: 'Meta Platforms has cut approximately 700 positions across Reality Labs, recruiting, sales, and Facebook teams as the company redirects resources toward its massive $167 billion AI infrastructure buildout while racing to compete with OpenAI and Google.',
    content: [
      {type:'paragraph',content:'Meta Platforms confirmed on Wednesday that it has laid off roughly 700 employees across multiple divisions, marking the second round of workforce reductions at the social media giant in 2026. The cuts primarily affect Reality Labs — Meta\'s virtual and augmented reality division — along with recruiting operations, sales teams, and parts of the core Facebook organization. The layoffs follow a 10% reduction in Reality Labs staff in January, signaling a continued strategic pivot away from the metaverse vision that CEO Mark Zuckerberg championed for years toward artificial intelligence.'},
      {type:'paragraph',content:'The workforce reduction comes as Meta plans to spend a staggering $162 to $169 billion in total expenses for 2026, with capital expenditure on AI infrastructure alone reaching up to $135 billion. The company has been racing to catch up with rivals OpenAI, Anthropic, and Google in the AI arms race, building massive data centers filled with Nvidia GPUs to train and deploy its Llama family of large language models. Meta\'s AI assistant, powered by Llama 4, has been integrated across Instagram, WhatsApp, and Facebook, and the company views AI as the primary growth driver for its advertising business over the next decade.'},
      {type:'heading',level:2,content:'Reality Labs Continues to Bleed'},
      {type:'paragraph',content:'The latest cuts underscore the growing tension between Meta\'s AI ambitions and its struggling metaverse division. Reality Labs has lost over $50 billion cumulatively since 2020, and the division\'s losses have accelerated even as Meta has scaled back its most ambitious virtual reality projects. The Quest headset line continues to sell modestly, but revenues remain a fraction of what Meta had projected when it rebranded from Facebook to Meta in 2021. Analysts at Bernstein estimate that Reality Labs will lose another $18 billion in 2026, making it one of the most expensive corporate R&D bets in history.'},
      {type:'paragraph',content:'Some of the affected employees are being offered alternative roles within the company or relocation options, but the majority are being separated with severance packages. The cuts are relatively modest compared to Meta\'s total workforce of approximately 72,000, representing less than 1% of the company\'s headcount. However, the symbolic significance is notable — each round of Reality Labs layoffs further distances Meta from the metaverse narrative that once defined its corporate identity.'},
      {type:'heading',level:2,content:'Wall Street Reaction and AI Strategy'},
      {type:'paragraph',content:'Meta shares were little changed on the news, as investors have largely priced in the company\'s strategic shift toward AI. The stock is down roughly 8% year-to-date, underperforming the broader market amid concerns about the massive capital expenditure required for AI infrastructure and growing regulatory headwinds. Jury verdicts against Meta and Google this week in California and New Mexico — finding the companies liable for harms to children — have added another layer of uncertainty. Despite these challenges, most analysts remain constructive on Meta\'s long-term AI strategy, with the consensus view that the company\'s massive user base and advertising platform create a unique advantage in monetizing AI capabilities. The key question for investors is whether Meta\'s enormous AI spending will generate returns that justify the investment, or whether the company is making the same kind of speculative bet on AI that it made on the metaverse.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['META', 'GOOGL', 'NVDA', 'MSFT', 'AAPL'],
    seoKeywords: ['Meta layoffs 2026', 'Meta Reality Labs cuts', 'Meta AI spending', 'Meta job cuts', 'Facebook layoffs', 'Meta restructuring'],
    markets: 'us-markets',
    business: 'tech',
    isBreaking: false,
    tags: ['Meta', 'layoffs', 'Reality Labs', 'artificial intelligence', 'Big Tech']
  },
  {
    title: 'Dow Plunges 606 Points as Nasdaq Enters Correction Territory on Rate Fears and Iran Tensions',
    excerpt: 'The Dow Jones Industrial Average tumbled over 600 points while the Nasdaq officially entered correction territory as strong economic data paradoxically spooked investors by signaling the Fed will keep rates higher for longer amid the Iran-fueled inflation surge.',
    content: [
      {type:'paragraph',content:'Wall Street suffered its worst session in over a year on Wednesday as a toxic mix of strong economic data, geopolitical anxiety, and mounting recession fears sent all three major indexes sharply lower. The Dow Jones Industrial Average plummeted 605.78 points, or 1.53%, to close at 39,065.26, while the S&P 500 fell 0.74% to 5,267.84 and the Nasdaq Composite declined 0.39% to 16,736.03. The Nasdaq has now fallen more than 10% from its recent highs, officially entering correction territory — a milestone that historically signals further downside risk in the near term.'},
      {type:'paragraph',content:'The selloff was triggered by a series of robust economic reports that reignited fears of persistent inflation and a "higher for longer" interest rate policy from the Federal Reserve. Initial jobless claims fell to 215,000, well below expectations, while durable goods orders showed surprising strength. In normal times, strong economic data would be welcomed by markets, but in the current environment — where oil prices have surged 40% due to the Iran conflict and headline inflation is running well above the Fed\'s 2% target — evidence of economic resilience is interpreted as a signal that the Fed cannot cut rates, prolonging the squeeze on corporate valuations and consumer budgets alike.'},
      {type:'heading',level:2,content:'Tech Divergence Tells the Story'},
      {type:'paragraph',content:'The most notable feature of Wednesday\'s session was the sharp divergence within the technology sector. While the Nasdaq index itself declined, individual AI-related stocks showed remarkable resilience. The broader market rout masked a historic session for certain megacap tech names, even as Boeing tumbled 7.6% after its CFO warned of negative free cash flow in 2026 due to production delays and safety inspections, and Tesla fell 3.5% amid reports of reduced Model Y production at its Shanghai plant.'},
      {type:'paragraph',content:'The divergence highlights the increasingly bifurcated nature of the current market, where a handful of AI-beneficiary stocks are propping up capitalization-weighted indexes while the median stock is experiencing a much more severe downturn. Equal-weighted versions of the S&P 500 have significantly underperformed their market-cap-weighted counterparts, suggesting that market breadth is deteriorating — a classic warning sign that the rally in headline indexes may be built on an increasingly fragile foundation.'},
      {type:'heading',level:2,content:'Where Markets Go From Here'},
      {type:'paragraph',content:'The outlook remains deeply uncertain. The Fed is trapped between conflicting mandates — fighting inflation that has been exacerbated by the oil price shock while trying to avoid pushing the economy into recession. The odds of a Fed rate cut this year have collapsed from 95% just a month ago to a mere 8%, according to Fed funds futures markets. Meanwhile, the Atlanta Fed\'s GDPNow model estimates first-quarter 2026 growth at just 0.3%, dangerously close to contraction. Goldman Sachs has raised its recession probability to 35%, while JPMorgan puts the odds at 40%.'},
      {type:'paragraph',content:'Defensive positioning has accelerated across Wall Street. Utilities, healthcare, and consumer staples have begun to outperform as investors rotate out of cyclical and growth stocks into safer havens. Gold has surged to record highs above $3,200 per ounce, while Treasury yields have fallen as bond markets price in economic weakness despite the Fed\'s hawkish stance. For individual investors, the current environment calls for caution — the combination of elevated valuations, geopolitical risk, and monetary policy uncertainty creates a minefield that even the most seasoned portfolio managers are struggling to navigate.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop&q=80',
    readTime: 6,
    relevantTickers: ['SPY', 'QQQ', 'DIA', 'VIX', 'GLD', 'TLT'],
    seoKeywords: ['Dow drops 600 points', 'Nasdaq correction', 'stock market crash', 'market selloff March 2026', 'Fed rate fears', 'recession risk'],
    markets: 'us-markets',
    business: 'finance',
    isBreaking: true,
    tags: ['stock market', 'Dow Jones', 'Nasdaq', 'market correction', 'Fed rates']
  },
  {
    title: 'Boeing Stock Crashes 7.6% After CFO Warns of Negative Free Cash Flow as 777X Delays Mount',
    excerpt: 'Boeing shares plunged 7.6% to 2026 lows after CFO Jay Malave warned of negative free cash flow this year due to persistent 777X certification delays, production setbacks, and safety inspections that continue to plague the aerospace giant\'s turnaround efforts.',
    content: [
      {type:'paragraph',content:'Boeing shares suffered their worst single-day decline in over a year, plunging 7.6% to $201.18 on Wednesday — their lowest level of 2026 — after Chief Financial Officer Jay Malave delivered a sobering assessment of the company\'s financial trajectory at a UBS-hosted conference. Malave warned that Boeing now expects negative free cash flow in 2026, a dramatic reversal from the company\'s previous guidance that had projected a return to positive cash generation this year. The warning sent shockwaves through the aerospace sector and raised fresh doubts about Boeing\'s ability to execute its long-delayed turnaround plan.'},
      {type:'paragraph',content:'The cash flow deterioration stems from a cascading series of operational challenges. The 777X wide-body jet program, which was originally scheduled to enter service in 2020, now faces certification delays that could push delivery to 2027 or beyond. The extended timeline means Boeing continues to burn cash on the program without generating revenue from deliveries. Additionally, ongoing safety inspections across Boeing\'s fleet and manufacturing facilities — mandated after a series of quality incidents including the Alaska Airlines door plug blowout — have slowed production rates and increased costs across the board.'},
      {type:'heading',level:2,content:'A $54 Billion Debt Mountain'},
      {type:'paragraph',content:'Boeing\'s financial position is increasingly precarious. The company carries approximately $54 billion in total debt, with more than $40 billion in net debt after accounting for cash reserves. Large debt maturities are coming due in 2026 and 2027, creating a refinancing challenge at a time when the company\'s creditworthiness is under scrutiny. S&P has revised its estimated 2026 free operating cash flow down to about $3 billion — at least $2 billion lower than previous forecasts — reflecting what the rating agency called "persistent execution and cost risks" that show no signs of abating.'},
      {type:'paragraph',content:'The supply chain remains another major headwind. Spirit AeroSystems, Boeing\'s key fuselage supplier which the company is in the process of reacquiring, continues to face quality issues that ripple through Boeing\'s production system. The Iran conflict has also disrupted supply chains for certain aerospace components, particularly titanium alloys sourced from regions affected by the geopolitical tensions. With finished-goods inventory cushions shrinking, Boeing has less flexibility to absorb production setbacks, increasing the risk of further delivery delays to airline customers.'},
      {type:'heading',level:2,content:'Can the Turnaround Survive?'},
      {type:'paragraph',content:'Despite the grim near-term outlook, Boeing\'s fourth-quarter 2025 results had offered a glimmer of hope, with revenue surging 57% to $23.95 billion — the highest quarterly figure since 2018 — and the company achieving positive free cash flow for the first time in years. However, analysts caution that the Q4 strength was partly driven by one-time factors and that sustaining positive cash flow in 2026 was always going to require near-flawless execution. Malave\'s admission that cash flow will now turn negative suggests the execution challenges are deeper and more persistent than management had acknowledged.'},
      {type:'paragraph',content:'For Boeing\'s stock, the path forward depends heavily on the 777X timeline. Each quarter of delay costs the company billions in deferred revenue and ongoing development expenses. Airbus, Boeing\'s European rival, has been aggressively taking market share during Boeing\'s struggles, winning a disproportionate share of new widebody orders as airlines lose patience with Boeing\'s delivery uncertainty. The stock now trades at roughly 25 times its reduced 2026 earnings estimates, a premium that some analysts argue is difficult to justify given the execution risks. Boeing faces a critical six months that will determine whether its turnaround remains credible or whether deeper financial restructuring becomes necessary.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1200&h=630&fit=crop&q=80',
    readTime: 6,
    relevantTickers: ['BA', 'EADSY', 'RTX', 'GE', 'HWM', 'SPR'],
    seoKeywords: ['Boeing stock crash', 'Boeing cash flow warning', 'Boeing 777X delay', 'Boeing CFO warning', 'Boeing stock 2026', 'aerospace stocks'],
    markets: 'us-markets',
    business: 'finance',
    isBreaking: false,
    tags: ['Boeing', 'aerospace', 'cash flow', '777X', 'stock market']
  }
];

async function main() {
  console.log('=== Creating 5 Trending Articles - March 27, 2026 (Batch 5 - Evening) ===\n');

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
