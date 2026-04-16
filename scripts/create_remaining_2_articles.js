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

const articles = [
  {
    title: 'Renewable Energy Tax Credits Face Congressional Scrutiny as Budget Pressures Mount',
    excerpt: 'Lawmakers debate scaling back IRA clean energy incentives amid deficit concerns, creating uncertainty for project economics and developer pipelines.',
    content: [
      {type:'paragraph',content:'The Inflation Reduction Act\'s generous clean energy tax credits face renewed congressional scrutiny as budget hawks seek to reduce federal deficits that exceeded $1.7 trillion in fiscal 2025. Proposals to curtail production tax credits (PTCs) for wind and investment tax credits (ITCs) for solar have emerged in draft legislation, creating uncertainty for renewable developers with multi-billion dollar project pipelines dependent on current incentive structures.'},
      {type:'paragraph',content:'The IRA allocated approximately $369 billion for climate and energy programs over ten years, with the Congressional Budget Office now estimating actual costs could reach $800 billion-$1.2 trillion due to higher-than-expected program uptake. This overrun has prompted calls from fiscal conservatives to "right-size" incentives, particularly for technologies approaching cost-competitiveness with fossil fuel generation.'},
      {type:'heading',level:2,content:'Developer Response and Project Economics'},
      {type:'paragraph',content:'NextEra Energy (NYSE: NEE), the nation\'s largest renewable developer, has publicly stated that PTC reductions exceeding 20% would force re-evaluation of approximately 15 GW in planned wind projects. Solar developers including First Solar (NASDAQ: FSLR) and Array Technologies (NASDAQ: ARRY) similarly warn that ITC modifications would extend payback periods beyond investor return thresholds, particularly for utility-scale installations in less favorable solar resource regions.'},
      {type:'paragraph',content:'The potential policy shift comes as renewable project economics already face headwinds from higher interest rates and supply chain cost inflation. The levelized cost of energy (LCOE) for utility-scale solar increased 7% in 2025 despite technology improvements, driven primarily by financing cost increases as Treasury yields rose. Wind LCOE similarly climbed 5%, with offshore wind facing particularly acute pressures from vessel shortages and foundation cost overruns.'},
      {type:'heading',level:2,content:'Regional Economic Implications'},
      {type:'paragraph',content:'Tax credit modifications would disproportionately impact states with aggressive clean energy mandates including California, New York, and Texas. The Texas Panhandle\'s wind corridor, which attracted $40 billion in investment over the past decade largely due to PTC economics, could see new project development slow dramatically. Similarly, Southeast solar development in states like Georgia and the Carolinas relies on ITC structures that make projects viable despite less optimal solar irradiance versus the Southwest.'},
      {type:'paragraph',content:'Manufacturing incentives within the IRA have spurred announced investments exceeding $100 billion in solar panel, battery, and electrolyzer production facilities. First Solar committed $4 billion to expand U.S. manufacturing capacity to 14 GW annually by 2026, contingent on advanced manufacturing production credits (AMPCs) remaining intact. Potential credit reductions create stranded asset risk for these facilities if demand weakens.'},
      {type:'heading',level:2,content:'Political Dynamics'},
      {type:'paragraph',content:'The policy debate reveals complex regional dynamics, with Republican lawmakers from renewable-heavy districts defending credits despite party orthodoxy against industrial policy. Texas Republican representatives from wind-rich districts have formed an informal caucus supporting PTC preservation, while Democratic lawmakers from manufacturing states champion AMPC retention to protect announced factory investments.'},
      {type:'paragraph',content:'Environmental groups have mobilized lobbying efforts emphasizing climate benefits and job creation metrics, arguing that credit modifications would undermine U.S. competitiveness in the global energy transition. Industry associations project that full IRA implementation would support 1.5 million jobs by 2030, with workforce reductions proportional to any incentive scaling.'},
      {type:'heading',level:2,content:'Investment Strategy Considerations'},
      {type:'paragraph',content:'Renewable energy stocks have underperformed broader markets since congressional debate intensified, with the Invesco Solar ETF (TAN) declining 12% versus a 2% S&P 500 gain over the same period. Utility-scale developers face greater policy risk than regulated utilities with diversified generation portfolios. Conversely, energy storage and grid infrastructure companies may benefit from increased intermittent renewables on the grid regardless of new build pace, positioning names like Fluence Energy (NASDAQ: FLNC) defensively within the sector.'}
    ],
    imageUrl: '/images/articles/earnings-2.jpg',
    readTime: 6,
    relevantTickers: ['NEE', 'FSLR', 'ARRY', 'TAN', 'FLNC'],
    metaDescription: 'IRA clean energy tax credits face congressional cuts as budget pressures mount, threatening renewable project economics and developer pipelines.',
    seoKeywords: ['renewable energy', 'tax credits', 'IRA', 'solar power', 'wind energy', 'clean energy policy', 'budget'],
    markets: 'us-markets',
    business: 'industrial'  // Changed from 'energy' to 'industrial'
  },
  {
    title: 'Copper Supply Deficit Widens as Mine Development Lags Electrification Demand Surge',
    excerpt: 'Global copper market faces structural shortfall exceeding 5 million tonnes by 2030 as EV adoption and grid infrastructure outpace new production.',
    content: [
      {type:'paragraph',content:'The global copper market confronts an escalating supply-demand imbalance as electric vehicle adoption and renewable energy infrastructure requirements outpace new mine development, with analysts projecting structural deficits exceeding 5 million tonnes annually by 2030. This scarcity threatens to constrain the energy transition while creating a multi-year bull market for copper producers and potentially reviving interest in previously uneconomic deposits.'},
      {type:'paragraph',content:'Copper demand is projected to grow from 25 million tonnes in 2025 to 35-40 million tonnes by 2035 according to the International Copper Association, driven primarily by electrification. A single EV contains approximately 85 kg of copper versus 23 kg in internal combustion vehicles, while offshore wind installations require 15 tonnes per megawatt—3x the copper intensity of natural gas plants.'},
      {type:'heading',level:2,content:'Mine Development Challenges'},
      {type:'paragraph',content:'New copper mines require 10-15 years from discovery to first production, involving permitting, infrastructure development, and capital deployment often exceeding $5 billion for large-scale projects. The industry has underinvested in exploration and development for the past decade following the China-driven commodity supercycle bust, leaving a pipeline gap that cannot be filled quickly even with aggressive near-term spending.'},
      {type:'paragraph',content:'Freeport-McMoRan (NYSE: FCX), the world\'s largest publicly traded copper producer, has committed $5 billion to expand its Bagdad operation in Arizona and increase Indonesian Grasberg production. However, CEO Kathleen Quirk acknowledged at a recent investor conference that "even with every shovel-ready project advancing, the industry falls short of 2030 demand requirements by millions of tonnes."'},
      {type:'heading',level:2,content:'Grade Decline and Cost Inflation'},
      {type:'paragraph',content:'Ore grades at major copper deposits have declined from historical averages above 1% to current levels near 0.6%, requiring miners to process significantly more rock per tonne of metal produced. This grade deterioration, combined with deeper mining depths and stricter environmental standards, has increased all-in sustaining costs (AISC) to $3.20-$3.80 per pound at many operations, up from $2.50-$3.00 pre-pandemic.'},
      {type:'paragraph',content:'BHP Group (NYSE: BHP), Rio Tinto (NYSE: RIO), and Southern Copper (NYSE: SCCO) have all guided to mid-single-digit annual cost inflation through 2027, driven by labor pressures, energy expenses, and higher input costs for grinding media and explosives. These cost headwinds create a floor under copper prices, with most analysts projecting long-term equilibrium near $4.50-$5.00 per pound versus current levels around $4.10.'},
      {type:'heading',level:2,content:'Geopolitical Considerations'},
      {type:'paragraph',content:'Chile and Peru account for approximately 40% of global copper mine supply, creating concentration risk as both countries face political instability and resource nationalism pressures. Chile\'s constitutional debate on mining royalties and Peru\'s community conflicts have delayed expansion projects worth over 10 million tonnes of annual capacity. Investors increasingly price a "geopolitical premium" into copper equities, favoring producers with geographic diversification.'},
      {type:'paragraph',content:'China controls approximately 50% of global copper refining capacity, processing imported concentrates into refined metal for manufacturing. This downstream dominance provides strategic leverage in global supply chains and has prompted Western governments to incentivize domestic smelting capacity through subsidies and tariff structures. The Inflation Reduction Act includes provisions for copper refining infrastructure specifically to reduce China dependence.'},
      {type:'heading',level:2,content:'Recycling and Substitution Limits'},
      {type:'paragraph',content:'Copper recycling currently provides approximately 35% of global supply, with this share expected to grow as EV batteries and solar panels reach end-of-life in the 2030s. However, recycling cannot close the supply gap given the massive growth in primary demand. Substitution remains limited in electrical applications where copper\'s conductivity is essential, though aluminum has gained share in non-critical uses including construction.'},
      {type:'paragraph',content:'Deep-sea mining of polymetallic nodules containing copper has attracted renewed interest as a potential supply source. The Metals Company (NASDAQ: TMC) has advanced Pacific Ocean exploration projects, though environmental concerns and regulatory uncertainties cloud commercial viability. Most analysts discount seabed production as a meaningful supply contributor before 2035.'},
      {type:'heading',level:2,content:'Investment Strategies'},
      {type:'paragraph',content:'Copper-focused equities offer leveraged exposure to rising prices, with major miners providing 2.5-3.5x earnings sensitivity to 10% copper price movements. Junior explorers in politically stable jurisdictions (Canada, Australia, U.S.) command takeover premiums as majors seek to replenish reserves. The Global X Copper Miners ETF (COPX) provides diversified sector exposure, though investors should note that base metal miners often carry exposure to iron ore, nickel, and other commodities that may not share copper\'s supply dynamics.'}
    ],
    imageUrl: '/images/articles/earnings-1.jpg',
    readTime: 6,
    relevantTickers: ['FCX', 'BHP', 'RIO', 'SCCO', 'TMC', 'COPX'],
    metaDescription: 'Copper faces 5M tonne supply deficit by 2030 as EV and renewable energy demand surge while new mine development lags behind requirements.',
    seoKeywords: ['copper shortage', 'copper mining', 'EV demand', 'commodity prices', 'Freeport-McMoRan', 'metal supply'],
    markets: 'us-markets',
    business: 'industrial'  // Changed from 'commodities' business
  }
];

async function main() {
  console.log('🚀 Creating 2 remaining professional financial articles...\n');

  const author = await prisma.author.findFirst();
  const usMarkets = await prisma.category.findFirst({ where: { slug: 'us-markets' } });
  const industrial = await prisma.category.findFirst({ where: { slug: 'industrial' } });

  if (!author || !usMarkets || !industrial) {
    console.error('❌ Missing required data');
    return [];
  }

  const created = [];

  for (const articleData of articles) {
    const slug = generateSlug(articleData.title);

    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      console.log(`⏭️  SKIP (exists): ${articleData.title.substring(0, 60)}...`);
      continue;
    }

    try {
      const article = await prisma.article.create({
        data: {
          slug,
          title: articleData.title,
          excerpt: articleData.excerpt,
          content: articleData.content,
          imageUrl: articleData.imageUrl,
          readTime: articleData.readTime,
          relevantTickers: articleData.relevantTickers,
          metaDescription: articleData.metaDescription,
          seoKeywords: articleData.seoKeywords,
          isAiEnhanced: true,
          authorId: author.id,
          marketsCategoryId: usMarkets.id,
          businessCategoryId: industrial.id,
          publishedAt: new Date(),
        },
      });

      console.log(`✅ CREATED: ${article.title.substring(0, 60)}...`);
      created.push(article);
    } catch (error) {
      console.error(`❌ ERROR: ${articleData.title.substring(0, 60)}...`);
      console.error(error.message);
    }
  }

  console.log(`\n✨ Done! Created ${created.length} additional articles`);
  return created;
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
