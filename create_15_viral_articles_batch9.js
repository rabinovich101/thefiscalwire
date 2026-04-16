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

// 15 NEW Viral Financial News Articles - Batch 9 - March 29, 2026
const articles = [
  {
    title: 'S&P 500 Posts Worst March Since 2020 as Recession Probability Hits 49%',
    excerpt: 'The benchmark index falls 6.8% in March—its steepest monthly decline since the pandemic crash—as Moody\'s AI model raises US recession odds to 49% and traders price in a possible Fed rate hike.',
    content: [
      {type:'paragraph',content:'The S&P 500 closed out March with a punishing 6.8% monthly decline, marking its worst performance since the pandemic-driven selloff of March 2020. The benchmark has now fallen for five consecutive weeks—the longest losing streak since late 2022—as a toxic cocktail of surging oil prices, cratering consumer confidence, and escalating geopolitical tensions has shattered the bullish consensus that dominated the start of the year.'},
      {type:'paragraph',content:'Moody\'s Analytics delivered a sobering assessment on Friday, revealing that its artificial intelligence-driven recession model now places the probability of a U.S. recession at 49%, up from just 22% at the beginning of March. The near-coin-flip odds represent the highest recession probability reading since the regional banking crisis of early 2023.'},
      {type:'heading',level:2,content:'Rate Hike Fears Emerge'},
      {type:'paragraph',content:'Perhaps the most alarming development for equity investors is the emergence of rate hike expectations. Fed funds futures markets now price a 52% probability of a rate increase by year-end 2026, a dramatic reversal from the three cuts that were expected just six weeks ago. The shift reflects the Fed\'s impossible policy dilemma: inflation is accelerating due to the energy shock while economic growth is simultaneously decelerating.'},
      {type:'paragraph',content:'Goldman Sachs cut its 2026 year-end S&P 500 target to 5,200 from 6,100, citing the deteriorating macro outlook and the risk that the Fed may be forced to tighten rather than ease in the second half of the year.'},
      {type:'heading',level:2,content:'Sector Divergence Widens'},
      {type:'paragraph',content:'The market has fractured into clear winners and losers. Energy and defense stocks have posted double-digit gains since the Iran conflict began, while technology, consumer discretionary, and real estate sectors have borne the brunt of the selling. The VIX volatility index surged to its highest level since February, signaling elevated institutional hedging and persistent uncertainty about the path forward.'},
      {type:'paragraph',content:'Market strategists warn that absent a resolution to the Hormuz crisis or a meaningful de-escalation in the Middle East, the path of least resistance for equities remains lower. The April 4 jobs report and the April 6 Hormuz deadline are the next critical catalysts that could determine whether the correction deepens into a bear market.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['SPY', 'QQQ', 'VIX'],
    metaDescription: 'S&P 500 drops 6.8% in worst March since 2020 as Moody\'s recession model hits 49% and traders price in possible Fed rate hike.',
    seoKeywords: ['S&P 500 crash', 'recession probability', 'stock market March 2026', 'Fed rate hike', 'market correction'],
    markets: 'us-markets',
    business: 'economy'
  },
  {
    title: 'Gold Hits Record $4,559 as Goldman Sees $4,900 by Year-End on War Premium',
    excerpt: 'Spot gold surges to an all-time high of $4,558.81 per ounce as Goldman Sachs raises its year-end target to $4,900, driven by central bank buying and geopolitical safe-haven demand.',
    content: [
      {type:'paragraph',content:'Gold prices climbed to an all-time record of $4,558.81 per ounce on Friday, extending a relentless rally that has seen the precious metal gain more than 30% year-to-date as investors flee to safety amid the worst geopolitical crisis since Russia\'s invasion of Ukraine. The surge was amplified by a brief easing in oil prices that tempered inflation concerns, paradoxically making gold more attractive as a non-yielding asset.'},
      {type:'paragraph',content:'Goldman Sachs responded to the breakout by raising its year-end gold price forecast to $4,900 per ounce, up from a prior target of $4,200. The bank cited three structural drivers: record central bank purchases, particularly from China and emerging market nations seeking to diversify away from dollar reserves; persistent geopolitical risk premium from the Iran conflict; and growing skepticism about the ability of fiat currencies to maintain purchasing power in an era of fiscal excess.'},
      {type:'heading',level:2,content:'Central Banks Lead the Charge'},
      {type:'paragraph',content:'Central bank gold purchases have exceeded 1,100 tonnes in 2025 and are on pace to surpass that figure in 2026, with the People\'s Bank of China leading buyers for the 18th consecutive month. The trend reflects a broader de-dollarization impulse among non-Western nations, accelerated by the weaponization of dollar-based financial sanctions during the Ukraine conflict and now the Iran war.'},
      {type:'paragraph',content:'Gold ETFs have seen massive inflows, with the SPDR Gold Shares ETF and iShares Gold Trust both reporting their strongest quarterly inflows since the pandemic era. Retail demand for physical gold coins and bars has also surged, with the U.S. Mint reporting sold-out allocations for several popular products.'},
      {type:'heading',level:2,content:'Bitcoin vs Gold Debate Intensifies'},
      {type:'paragraph',content:'Gold\'s spectacular performance during the Iran crisis has reignited the debate over its role versus Bitcoin as the ultimate safe-haven asset. While Bitcoin has fallen roughly 20% year-to-date amid broader risk-off sentiment, gold has rallied in near-perfect inverse correlation with equity markets—precisely the behavior investors expect from a crisis hedge. The divergence has dealt a significant blow to the "digital gold" narrative that has been central to Bitcoin\'s institutional marketing.'},
      {type:'paragraph',content:'Mining equities including Newmont, Barrick Gold, and Agnico Eagle have tracked the metal higher, with the VanEck Gold Miners ETF outperforming the S&P 500 by more than 35 percentage points year-to-date.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['GLD', 'IAU', 'NEM', 'GOLD'],
    metaDescription: 'Gold hits record $4,559 as Goldman raises target to $4,900, driven by central bank buying and Iran war safe-haven demand.',
    seoKeywords: ['gold price record', 'Goldman Sachs gold forecast', 'safe haven', 'central bank gold buying', 'gold vs bitcoin'],
    markets: 'commodities',
    business: 'finance'
  },
  {
    title: 'Bitcoin Miners Pivot to AI With $70 Billion in Contracts as Mining Economics Collapse',
    excerpt: 'Public Bitcoin miners spent $79,995 to produce one BTC last quarter while the coin trades at $68,000, forcing a mass pivot to AI data center contracts worth $70 billion.',
    content: [
      {type:'paragraph',content:'The economics of Bitcoin mining have become unsustainable for most public miners, with the average cost to produce one Bitcoin reaching $79,995 last quarter—well above the current market price near $68,000. The math has forced an industry-wide pivot toward artificial intelligence, with public mining companies collectively signing more than $70 billion in AI data center contracts as they repurpose their massive energy infrastructure for machine learning workloads.'},
      {type:'paragraph',content:'Marathon Digital, Riot Platforms, CleanSpark, and Core Scientific are among the companies leading the transformation, converting mining facilities into AI compute centers or building new dual-purpose campuses. The shift has been accelerated by the April 2024 halving that cut block rewards to 3.125 BTC, and now the Iran-driven energy crisis that has pushed electricity costs sharply higher in many regions.'},
      {type:'heading',level:2,content:'Revenue Diversification Imperative'},
      {type:'paragraph',content:'Industry analysts note that AI workloads offer several advantages over Bitcoin mining: predictable revenue streams through long-term contracts, lower energy intensity per dollar of revenue, and valuations that trade at premium multiples in the current market environment. Companies that have successfully announced AI partnerships have seen their stock prices diverge positively from the Bitcoin price, breaking the historical correlation that defined the sector.'},
      {type:'paragraph',content:'Core Scientific, which emerged from bankruptcy in early 2024, has become the poster child for the pivot, securing a massive multi-year contract with CoreWeave that transformed its market narrative from distressed miner to AI infrastructure provider.'},
      {type:'heading',level:2,content:'Bitcoin Treasury Liquidation'},
      {type:'paragraph',content:'Several miners have begun liquidating their Bitcoin treasuries to finance the capital expenditure required for AI infrastructure buildout. The selling pressure from miners adds to the headwinds facing Bitcoin\'s price, creating a potential negative feedback loop where lower prices force more selling, which pushes prices lower still. Analysts estimate that public miners hold approximately 45,000 BTC collectively, representing a significant potential source of supply.'},
      {type:'paragraph',content:'The transformation of the mining industry from Bitcoin-focused to AI-diversified represents one of the most significant structural shifts in the cryptocurrency ecosystem, with implications for Bitcoin\'s hash rate security, energy market dynamics, and the broader narrative around proof-of-work mining sustainability.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['MARA', 'RIOT', 'CLSK', 'CORZ'],
    metaDescription: 'Bitcoin miners pivot to AI with $70B in contracts as production cost of $79,995 per BTC exceeds market price of $68,000.',
    seoKeywords: ['Bitcoin mining', 'AI data centers', 'mining economics', 'crypto mining pivot', 'AI infrastructure'],
    markets: 'crypto',
    business: 'tech'
  },
  {
    title: 'Brent Crude Settles at $112 as IEA Calls Hormuz Blockade Largest Supply Disruption in History',
    excerpt: 'The International Energy Agency characterizes the Strait of Hormuz closure as the most severe oil supply disruption ever recorded, with Gulf production cut by at least 10 million barrels per day.',
    content: [
      {type:'paragraph',content:'Brent crude settled at $112.57 per barrel on Friday as the International Energy Agency officially characterized the ongoing Strait of Hormuz blockade as the largest supply disruption in the history of the global oil market. The assessment came alongside data showing that Gulf oil-producing nations have been forced to cut total production by at least 10 million barrels per day, dwarfing previous disruptions including the 1973 Arab oil embargo and the 1990 Iraqi invasion of Kuwait.'},
      {type:'paragraph',content:'The IEA confirmed that oil and product flows through the Hormuz strait have collapsed from approximately 20 million barrels per day before the war to what it described as "a trickle," with approximately 150 ships anchored in or near the waterway awaiting safe passage. The disruption has forced oil-importing nations to draw down emergency reserves at an unprecedented pace.'},
      {type:'heading',level:2,content:'Strategic Reserve Drawdown'},
      {type:'paragraph',content:'IEA member countries unanimously agreed on March 11 to make 400 million barrels from their emergency stockpiles available to the market, representing the largest coordinated reserve release in history. However, the drawdown has proven insufficient to contain prices, as the daily supply gap of 10 million barrels far exceeds the approximately 2 million barrels per day that can practically be released from strategic reserves.'},
      {type:'paragraph',content:'The United States has also temporarily eased sanctions on select Russian and Iranian oil in an attempt to redirect supply flows, but logistical constraints and tanker availability have limited the effectiveness of these measures.'},
      {type:'heading',level:2,content:'Gasoline Prices Dominate Public Discourse'},
      {type:'paragraph',content:'At the consumer level, U.S. gasoline prices have surged past levels that are generating significant social media backlash and political pressure. The energy shock is functioning as a regressive tax on lower-income households and is already showing up in weakening retail sales data and cratering consumer sentiment readings. Energy equities remain the lone bright spot, with ExxonMobil, Chevron, and ConocoPhillips all posting substantial gains since the crisis began.'},
      {type:'paragraph',content:'Analysts warn that if oil remains above $100 per barrel through the second quarter, the cumulative drag on global GDP could reach $2.5 trillion, with the economic damage concentrated in oil-importing nations across Asia, Europe, and the developing world.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['XOM', 'CVX', 'COP', 'USO'],
    metaDescription: 'Brent crude at $112 as IEA calls Hormuz blockade the largest oil supply disruption in history with Gulf output cut 10M bpd.',
    seoKeywords: ['oil prices', 'Brent crude', 'Hormuz blockade', 'IEA supply disruption', 'energy crisis'],
    markets: 'commodities',
    business: 'energy'
  },
  {
    title: 'Fed Holds Rates at 3.5%-3.75% as Powell Warns of "Extraordinary Uncertainty" From Iran War',
    excerpt: 'The Federal Reserve keeps rates steady with an 11-1 vote as Chair Powell cites the Iran conflict and energy shock as creating unprecedented policy uncertainty, with only one cut projected for 2026.',
    content: [
      {type:'paragraph',content:'The Federal Reserve held its benchmark interest rate steady at the 3.5%-3.75% range at its March meeting, with Chair Jerome Powell warning that the Iran war and associated energy shock have created "extraordinary uncertainty" that prevents the central bank from providing clear forward guidance. The decision was approved on an 11-1 vote, with dissenter Stephen Mirin preferring a quarter-point cut.'},
      {type:'paragraph',content:'The closely watched "dot plot" showed Fed officials projecting just one rate cut for the remainder of 2026, a dramatic reduction from the three cuts expected at the start of the year. Several officials noted that the energy-driven inflation surge could force the committee to consider rate increases if price pressures prove persistent, though Powell emphasized that no such decision is imminent.'},
      {type:'heading',level:2,content:'Stagflation Dilemma'},
      {type:'paragraph',content:'Powell acknowledged the central bank is caught between competing mandates: the labor market remains solid but is showing signs of cooling, while inflation has been pushed higher by factors entirely outside the Fed\'s control. The GDP growth projection was raised slightly to 2.4% for 2026, but this figure was compiled before the full impact of the oil shock had been factored into economic models.'},
      {type:'paragraph',content:'The New York Fed\'s DSGE model, released separately, painted a more cautious picture, with its forecast reflecting the potential for the energy shock to subtract meaningfully from growth in the second and third quarters. The Atlanta Fed\'s GDPNow tracker for Q1 has already declined to 1.2% from 2.8% at the quarter\'s start.'},
      {type:'heading',level:2,content:'Market Implications'},
      {type:'paragraph',content:'Bond markets reacted by pushing Treasury yields higher across the curve, with the 10-year note settling at 4.45%. The yield curve remains inverted in key segments, maintaining a recession signal that has persisted since 2022. Inflation-protected securities outperformed nominal bonds as investors sought protection against the energy-driven inflation impulse.'},
      {type:'paragraph',content:'The leadership vacuum at the Fed—with Powell\'s term expiring in May and his nominated successor Kevin Warsh facing a stalled Senate confirmation amid a DOJ investigation—adds another layer of uncertainty to an already fraught policy environment. Markets are pricing in potential disruption to monetary policy continuity at the worst possible time.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=630&fit=crop&q=80',
    readTime: 6,
    relevantTickers: ['TLT', 'TIP', 'IEF', 'SHY'],
    metaDescription: 'Fed holds rates at 3.5%-3.75% as Powell warns of extraordinary uncertainty from Iran war, projects only one cut for 2026.',
    seoKeywords: ['Federal Reserve', 'interest rates', 'Jerome Powell', 'monetary policy', 'inflation'],
    markets: 'bonds',
    business: 'economy'
  },
  {
    title: 'Crypto-Backed Mortgages Launch as Coinbase and Better Home Partner on Bitcoin Collateral Loans',
    excerpt: 'Coinbase and Better Home & Finance introduce the first Fannie Mae-backed mortgage product that accepts Bitcoin and USDC as collateral for down payments, opening homeownership to crypto holders.',
    content: [
      {type:'paragraph',content:'Coinbase Global and Better Home & Finance have jointly launched the first cryptocurrency-backed mortgage product tied to Fannie Mae-backed loans, marking a watershed moment in the integration of digital assets into traditional consumer finance. The program allows borrowers to pledge Bitcoin or USDC stablecoins as collateral for a down payment, then receive a standard Fannie Mae mortgage on the property at competitive interest rates.'},
      {type:'paragraph',content:'The structure works through a dual-loan arrangement: borrowers first obtain a crypto-collateralized loan to generate their down payment, then receive a separate Fannie Mae-conforming mortgage. Both loans carry the same interest rate and term, with a single combined monthly payment for simplicity. The crypto collateral is held in a custodial account managed by Coinbase\'s institutional custody division.'},
      {type:'heading',level:2,content:'Unlocking Crypto Wealth for Homeownership'},
      {type:'paragraph',content:'The product addresses a long-standing pain point for cryptocurrency holders who possess significant digital asset wealth but face challenges qualifying for traditional mortgages. Under current lending standards, crypto holdings are generally not counted as qualifying assets, forcing potential homebuyers to liquidate their positions—and trigger taxable events—to fund down payments.'},
      {type:'paragraph',content:'Industry estimates suggest that more than 50 million Americans hold cryptocurrency, with a significant subset possessing six-figure or larger portfolios. The new product could unlock substantial housing demand from this demographic, particularly among younger, tech-savvy borrowers who have accumulated crypto wealth faster than traditional savings.'},
      {type:'heading',level:2,content:'Regulatory Breakthrough'},
      {type:'paragraph',content:'The product\'s connection to Fannie Mae lending standards required extensive regulatory coordination and represents one of the most tangible outcomes of the current administration\'s pro-crypto regulatory stance. The SEC\'s recent classification of Bitcoin as a digital commodity provided the legal foundation for treating it as legitimate collateral under existing lending frameworks.'},
      {type:'paragraph',content:'Coinbase shares rose on the announcement as analysts noted the product opens a massive new addressable market for the exchange beyond trading fees. Better Home\'s digital-first mortgage platform is expected to offer the product initially in 15 states with plans for nationwide expansion by Q3 2026.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['COIN', 'FNMA', 'BTC'],
    metaDescription: 'Coinbase and Better Home launch first Fannie Mae-backed mortgage accepting Bitcoin and USDC as down payment collateral.',
    seoKeywords: ['crypto mortgage', 'Bitcoin collateral', 'Coinbase mortgage', 'Fannie Mae crypto', 'digital asset lending'],
    markets: 'crypto',
    business: 'finance'
  },
  {
    title: 'GPT-5.4 Launches With 1 Million Token Context as OpenAI Erases Quality Gap With Open Source',
    excerpt: 'OpenAI releases GPT-5.4 in three variants with context windows up to 1.05 million tokens, but Alibaba\'s 9B parameter open-source model matches the 120B model on key benchmarks.',
    content: [
      {type:'paragraph',content:'OpenAI launched GPT-5.4 on March 5 in what CEO Sam Altman called the company\'s most significant release since GPT-4, debuting three model variants—Standard, Thinking (reasoning-first), and Pro (maximum capability)—with API support for context windows up to 1.05 million tokens. The release represents the largest commercial context window OpenAI has ever offered and positions the company to compete directly with Google\'s Gemini in long-document processing use cases.'},
      {type:'paragraph',content:'The Thinking variant introduces a reasoning-first architecture that allows the model to allocate variable compute time to complex problems, similar to the approach pioneered by the o1 series but integrated into a general-purpose model for the first time. Early benchmarks show significant improvements in mathematical reasoning, code generation, and multi-step logical inference.'},
      {type:'heading',level:2,content:'Open Source Catches Up'},
      {type:'paragraph',content:'However, the release was accompanied by a sobering data point for OpenAI\'s competitive moat: Alibaba\'s Qwen3 9B open-source model matched GPT-5.4 Standard\'s performance on the GPQA Diamond benchmark despite using just 9 billion parameters compared to the estimated 120 billion in OpenAI\'s model. The result validates what AI researchers have been predicting—that algorithmic efficiency gains are allowing smaller models to match or exceed larger ones at a fraction of the compute cost.'},
      {type:'paragraph',content:'The narrowing quality gap between proprietary and open-source models has profound implications for OpenAI\'s business model, which depends on maintaining enough of a capability lead to justify premium pricing. Investors have noticed: while OpenAI continues to attract massive funding, the competitive threat from efficient open-source alternatives is increasingly factored into private market valuations.'},
      {type:'heading',level:2,content:'Enterprise AI Spending Accelerates'},
      {type:'paragraph',content:'Despite the competitive concerns, global enterprise AI spending is accelerating dramatically. Gartner projects worldwide AI expenditure will hit $2.52 trillion in 2026, driven by agentic AI deployments that are transitioning from experimental pilots to production systems. The telecommunications sector leads adoption at 48%, followed by retail at 47%, with NVIDIA\'s Agent Toolkit providing the infrastructure layer for autonomous enterprise agents.'},
      {type:'paragraph',content:'The race between proprietary and open-source AI models is expected to intensify through 2026, with the primary beneficiaries being enterprise customers who gain access to increasingly capable AI tools at falling price points regardless of which paradigm ultimately wins.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['MSFT', 'NVDA', 'GOOG', 'BABA'],
    metaDescription: 'OpenAI launches GPT-5.4 with 1M token context but Alibaba\'s 9B open-source model matches it on key benchmarks.',
    seoKeywords: ['GPT-5.4', 'OpenAI', 'artificial intelligence', 'open source AI', 'enterprise AI spending'],
    markets: 'us-markets',
    business: 'tech'
  },
  {
    title: 'Trump Launches $12 Billion Project Vault to Counter China\'s Rare Earth Dominance',
    excerpt: 'The White House unveils a $12 billion strategic critical minerals reserve backed by Export-Import Bank loans and private capital to challenge China\'s 90% control of rare earth processing.',
    content: [
      {type:'paragraph',content:'President Trump unveiled "Project Vault," a $12 billion strategic critical minerals reserve designed to counter China\'s stranglehold on the rare earth supply chain that underpins everything from electric vehicles to advanced weapons systems. The initiative is backed by a $10 billion Export-Import Bank loan facility and nearly $2 billion in private capital commitments from mining companies and defense contractors.'},
      {type:'paragraph',content:'China currently controls approximately 70% of global rare earth mining and an even more dominant 90% of processing capacity—a concentration of supply that U.S. national security officials have characterized as an unacceptable strategic vulnerability. The conflict with Iran has intensified these concerns, as disrupted shipping lanes have highlighted the fragility of global commodity supply chains.'},
      {type:'heading',level:2,content:'Strategic Stockpiling and Domestic Production'},
      {type:'paragraph',content:'Project Vault has two components: immediate strategic stockpiling of critical minerals purchased from allied nations including Australia, Canada, and Brazil; and longer-term investment in domestic mining and processing infrastructure. The program targets 17 minerals deemed essential for defense and clean energy applications, including lithium, cobalt, nickel, neodymium, and gallium.'},
      {type:'paragraph',content:'The initiative represents the largest U.S. government intervention in mineral markets since World War II and signals a bipartisan recognition that market forces alone cannot deliver the supply chain security required in an era of great power competition. Mining equities rallied on the announcement, with MP Materials, Albemarle, and Livent all posting gains.'},
      {type:'heading',level:2,content:'Geopolitical Implications'},
      {type:'paragraph',content:'The timing of Project Vault—announced just weeks before Trump\'s state visit to Beijing—adds a strategic dimension to the upcoming trade negotiations. China has previously weaponized its rare earth dominance by restricting exports during diplomatic disputes, most notably against Japan in 2010 and more recently against several Western nations in response to semiconductor export controls.'},
      {type:'paragraph',content:'Defense analysts note that building an independent rare earth processing capacity will take 5-7 years even with aggressive government support, meaning that Project Vault is as much about signaling long-term strategic intent as delivering immediate supply chain resilience.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['MP', 'ALB', 'LTHM'],
    metaDescription: 'Trump launches $12B Project Vault to build US critical minerals reserve and counter China\'s 90% rare earth processing dominance.',
    seoKeywords: ['Project Vault', 'rare earth minerals', 'China rare earth', 'critical minerals', 'supply chain security'],
    markets: 'us-markets',
    business: 'industrial'
  },
  {
    title: 'NYSE Owner Doubles Down on Polymarket With Fresh $600 Million Investment',
    excerpt: 'Intercontinental Exchange pours another $600 million into prediction market Polymarket, bringing total investment to nearly $2 billion as regulated betting on real-world events goes mainstream.',
    content: [
      {type:'paragraph',content:'Intercontinental Exchange, the parent company of the New York Stock Exchange, has committed an additional $600 million to prediction market platform Polymarket, bringing its total investment to nearly $2 billion and signaling that the world\'s most powerful exchange operator views event-based trading as a core growth opportunity. The investment values Polymarket at approximately $8 billion, a remarkable figure for a platform that barely existed three years ago.'},
      {type:'paragraph',content:'Polymarket has seen explosive growth in 2026, with daily trading volumes regularly exceeding $500 million as users bet on outcomes ranging from Federal Reserve policy decisions to election results and geopolitical events. The Iran conflict has been a particular driver of volume, with markets on Hormuz reopening dates, ceasefire timelines, and oil price targets attracting massive institutional and retail participation.'},
      {type:'heading',level:2,content:'Mainstream Financial Integration'},
      {type:'paragraph',content:'ICE\'s deepening commitment to Polymarket reflects a broader trend of prediction markets being integrated into the traditional financial ecosystem. Banks and hedge funds are increasingly using Polymarket odds as real-time indicators of geopolitical risk, supplementing traditional analysis with crowd-sourced probability estimates. The platform\'s prediction for the S&P 500 opening direction on March 30 has attracted particular attention given the extreme market volatility.'},
      {type:'paragraph',content:'The investment also positions ICE to capture a share of the rapidly growing event derivatives market, which analysts project could reach $50 billion in annual volume by 2028 as regulatory clarity improves and institutional adoption accelerates.'},
      {type:'heading',level:2,content:'Regulatory Tailwinds'},
      {type:'paragraph',content:'The prediction market industry has benefited from a more permissive regulatory environment under the current administration, with the CFTC signaling openness to event-based contracts that were previously restricted. Polymarket\'s partnership with ICE provides regulatory credibility and operational infrastructure that should ease concerns from institutional participants who have been watching from the sidelines.'},
      {type:'paragraph',content:'Competitors including Kalshi and Robinhood\'s prediction market feature are also seeing strong growth, suggesting that the category as a whole is entering a breakout phase. The convergence of crypto infrastructure, traditional exchange expertise, and regulatory acceptance is creating a new asset class that blurs the line between speculation and information markets.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['ICE', 'HOOD', 'CME'],
    metaDescription: 'NYSE parent ICE invests $600M more in Polymarket, bringing total to $2B as prediction markets go mainstream during Iran crisis.',
    seoKeywords: ['Polymarket', 'prediction markets', 'NYSE ICE investment', 'event trading', 'crypto betting'],
    markets: 'us-markets',
    business: 'finance'
  },
  {
    title: 'AI Bots Officially Outnumber Humans on the Internet as Automated Traffic Surges 8x',
    excerpt: 'A landmark report finds that AI-generated and bot traffic has eclipsed human activity online for the first time, growing eight times faster than human usage and reshaping the digital economy.',
    content: [
      {type:'paragraph',content:'Artificial intelligence and automated bots have officially eclipsed human users on the internet for the first time in history, according to a landmark State of AI Traffic report released by cybersecurity firm Human Security. The analysis found that automated traffic grew nearly eight times faster than human activity throughout 2025 and has continued accelerating in 2026, fundamentally altering the economics and security landscape of the digital world.'},
      {type:'paragraph',content:'The findings have profound implications for the advertising industry, content creators, and platform companies that depend on human engagement metrics to justify their business models. If a majority of internet traffic is now automated, the value of traditional digital advertising impressions comes into question, potentially disrupting a $680 billion global digital ad market.'},
      {type:'heading',level:2,content:'Advertising Industry Disruption'},
      {type:'paragraph',content:'AI-driven advertising is simultaneously booming and threatening the ecosystem it depends on. Spending on AI-powered ad campaigns is projected to grow 63% in 2026 to $57 billion, even as the very AI agents placing and optimizing those ads contribute to the non-human traffic problem. Advertisers are increasingly paying to reach AI crawlers, scrapers, and agents rather than human consumers—an irony that the industry is only beginning to grapple with.'},
      {type:'paragraph',content:'Google\'s rollout of its Personal Intelligence feature to all U.S. users—allowing Gemini to access Gmail, Photos, and YouTube data for context-aware responses—represents both the promise and peril of AI integration. While it delivers better user experiences, it also generates additional automated traffic that further tilts the human-to-bot ratio.'},
      {type:'heading',level:2,content:'Cybersecurity and Trust Implications'},
      {type:'paragraph',content:'The bot traffic surge has created unprecedented challenges for cybersecurity teams, with sophisticated AI agents capable of mimicking human behavior patterns that defeat traditional bot detection systems. CAPTCHA solve rates by AI have reached levels that render many verification systems ineffective, forcing the industry to develop entirely new approaches to distinguishing human from artificial users.'},
      {type:'paragraph',content:'Web publishers are responding by implementing AI traffic detection and blocking tools, but the arms race is tilting in favor of the bots. The shift has implications for democratic discourse, content moderation, and the fundamental trustworthiness of online information—concerns that regulators in the EU and U.S. are beginning to address through proposed legislation targeting AI-generated content disclosure.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['GOOG', 'META', 'TTD'],
    metaDescription: 'AI bots now outnumber humans online as automated traffic grows 8x faster, threatening $680B digital advertising market.',
    seoKeywords: ['AI bots internet', 'automated traffic', 'bot traffic', 'digital advertising', 'AI internet'],
    markets: 'us-markets',
    business: 'tech'
  },
  {
    title: 'Strategy Buys 45,000 Bitcoin in 30 Days as Corporate Treasury Peers Fall Behind',
    excerpt: 'Michael Saylor\'s Strategy purchases approximately 45,000 BTC in March while all other publicly traded Bitcoin treasury companies combined bought fewer than 1,000 coins.',
    content: [
      {type:'paragraph',content:'Strategy, the software company formerly known as MicroStrategy, has emerged as the dominant corporate Bitcoin buyer in 2026, purchasing approximately 45,000 BTC over the past 30 days in what amounts to the most aggressive accumulation campaign in the company\'s already aggressive history. The purchases were made at prices ranging from $68,000 to $75,000, adding roughly $3.2 billion to the company\'s already massive Bitcoin holdings.'},
      {type:'paragraph',content:'The scale of Strategy\'s buying dwarfs all other publicly traded Bitcoin treasury companies combined, which collectively acquired fewer than 1,000 BTC during the same period. The concentration of corporate Bitcoin demand in a single entity has raised questions about market structure and the risks of having one company exert such outsized influence on an asset class.'},
      {type:'heading',level:2,content:'Funding the Accumulation'},
      {type:'paragraph',content:'Strategy has funded its purchases through a combination of convertible note offerings, at-the-market equity sales, and the company\'s newly launched preferred stock program. CEO Michael Saylor has argued that Bitcoin\'s decline from its January highs represents a generational buying opportunity, particularly given the structural supply constraints highlighted by the recent mining of the 20 millionth Bitcoin.'},
      {type:'paragraph',content:'The company now holds an estimated 520,000 BTC with a cost basis of approximately $33 billion, making it by far the largest corporate holder of Bitcoin globally. The position represents roughly 2.5% of all Bitcoin that will ever exist.'},
      {type:'heading',level:2,content:'Market Impact and Risks'},
      {type:'paragraph',content:'Strategy\'s relentless buying has provided a significant floor under Bitcoin prices during the broader market selloff, absorbing selling pressure from ETF outflows and miner liquidations. However, the leverage embedded in the company\'s balance sheet—including approximately $7 billion in convertible debt—means that a sustained decline in Bitcoin prices could force selling or dilutive equity issuance, creating the potential for a violent unwind.'},
      {type:'paragraph',content:'The stock trades at a substantial premium to the net asset value of its Bitcoin holdings, reflecting investor belief in Saylor\'s ability to continue creating value through financial engineering. Critics argue that the premium is unsustainable and that the company has essentially become a leveraged Bitcoin ETF with software company overhead.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['MSTR', 'BTC', 'IBIT'],
    metaDescription: 'Strategy buys 45,000 BTC in March, dwarfing all other corporate buyers combined as Saylor calls decline a buying opportunity.',
    seoKeywords: ['MicroStrategy Bitcoin', 'Strategy BTC', 'Michael Saylor', 'corporate Bitcoin', 'Bitcoin accumulation'],
    markets: 'crypto',
    business: 'finance'
  },
  {
    title: 'Google Quantum Deadline Sends Shockwave Through Crypto as 2029 Migration Target Set',
    excerpt: 'Google mandates post-quantum cryptography migration for all authentication services by 2029, validating the timeline Ethereum has been building toward and putting legacy blockchains on notice.',
    content: [
      {type:'paragraph',content:'Google set a corporate deadline to migrate all authentication services to quantum-resistant cryptography by 2029, validating the timeline that has been at the center of the cryptocurrency industry\'s most existential debate. The announcement from the world\'s largest technology company effectively confirms that cryptographically relevant quantum computers could arrive within the decade, putting every blockchain network that relies on current encryption standards on a countdown clock.'},
      {type:'paragraph',content:'Ethereum\'s research team has been building toward quantum resistance for eight years, with co-founder Vitalik Buterin repeatedly emphasizing the need for proactive migration. The network\'s roadmap includes a gradual transition to quantum-safe signature schemes, with test implementations already running on development networks. Buterin\'s foresight is now being validated by the industry\'s largest player setting a matching timeline.'},
      {type:'heading',level:2,content:'Bitcoin\'s Quantum Vulnerability'},
      {type:'paragraph',content:'Bitcoin faces a more challenging quantum transition due to its deliberately conservative approach to protocol changes. The network\'s ECDSA signature scheme would be vulnerable to a sufficiently powerful quantum computer, and the approximately 4 million BTC held in addresses with exposed public keys—including Satoshi Nakamoto\'s estimated 1.1 million coins—would be at theoretical risk. Upgrading Bitcoin\'s cryptography would require a hard fork that the community has historically been reluctant to pursue.'},
      {type:'paragraph',content:'Cryptographers note that the practical timeline for quantum threats to current encryption may be slightly longer than Google\'s migration deadline suggests, as breaking Bitcoin\'s 256-bit ECDSA would require quantum computers with significantly more qubits than are currently projected for 2029.'},
      {type:'heading',level:2,content:'Industry Response Accelerates'},
      {type:'paragraph',content:'Google\'s announcement has accelerated quantum-preparedness efforts across the tech and financial sectors. NIST\'s recently finalized post-quantum encryption standards are being adopted by major cloud providers, banking systems, and telecommunications networks. The cryptocurrency industry, however, lags behind due to the decentralized nature of protocol upgrades and the consensus challenges they entail.'},
      {type:'paragraph',content:'Quantum computing stocks including IonQ, Rigetti, and D-Wave saw renewed investor interest on the announcement, while cybersecurity firms specializing in post-quantum solutions reported a surge in enterprise inquiries.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['GOOG', 'IONQ', 'RGTI'],
    metaDescription: 'Google sets 2029 deadline for post-quantum migration, validating Ethereum\'s timeline and raising concerns about Bitcoin vulnerability.',
    seoKeywords: ['quantum computing crypto', 'post-quantum cryptography', 'Google quantum', 'Bitcoin quantum threat', 'Ethereum quantum'],
    markets: 'crypto',
    business: 'tech'
  },
  {
    title: 'U.S. Trade Deficit Widens 33% to $70.3 Billion as Tariffs Fail to Curb Imports',
    excerpt: 'The monthly trade gap surged to $70.3 billion despite average tariffs of 47.5% on China as imports from Vietnam and Taiwan offset declining Chinese shipments.',
    content: [
      {type:'paragraph',content:'The U.S. monthly goods and services trade deficit widened by a startling 32.6% to $70.3 billion in December, dealing a blow to the administration\'s claim that aggressive tariff policy would meaningfully reduce trade imbalances. While the bilateral deficit with China narrowed as expected under 47.5% average tariffs, the improvement was more than offset by surging imports from Vietnam, Taiwan, and other nations that have absorbed manufacturing capacity redirected from China.'},
      {type:'paragraph',content:'Imports from Taiwan increased by $85.2 billion on an annualized basis, driven primarily by semiconductor purchases, while Vietnamese imports grew by $57.3 billion as manufacturers continued relocating production from China to avoid U.S. tariffs. The pattern validates what trade economists have warned: tariffs on one country simply redirect trade flows rather than eliminating deficits.'},
      {type:'heading',level:2,content:'Section 301 Investigations Broaden'},
      {type:'paragraph',content:'The U.S. Trade Representative responded to the persistent deficits by initiating new Section 301 investigations on March 11 targeting "structural excess capacity and production in manufacturing sectors" across 16 countries. The probes could pave the way for tariffs beyond China, potentially targeting the very nations that have benefited from Chinese trade diversion. The legal basis shifted to Section 301 after the Supreme Court ruled in February that IEEPA authority cannot be used for tariff imposition.'},
      {type:'paragraph',content:'The broadening of trade friction beyond China has alarmed multinational corporations that spent billions restructuring supply chains specifically to avoid Chinese tariffs, only to face the prospect of new barriers in their chosen alternative manufacturing hubs.'},
      {type:'heading',level:2,content:'Market and Dollar Impact'},
      {type:'paragraph',content:'The widening deficit creates a policy contradiction with the administration\'s simultaneous desire for a strong dollar, which makes U.S. exports more expensive and imports cheaper. The Bloomberg Dollar Spot Index has risen more than 2% in March on safe-haven flows, further disadvantaging American exporters at a time when the trade agenda calls for improved competitiveness.'},
      {type:'paragraph',content:'The trade data will loom large over Trump\'s state visit to Beijing from March 31 to April 2, where a framework trade agreement is expected to be on the agenda. China\'s decision to launch counter-investigations into U.S. trade practices days before the summit suggests that any deal will be more form than substance, with both sides seeking diplomatic optics rather than genuine concessions.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['FXI', 'EWY', 'VNM'],
    metaDescription: 'US trade deficit widens 33% to $70.3B as tariffs on China redirect imports to Vietnam and Taiwan rather than reducing the gap.',
    seoKeywords: ['trade deficit', 'US tariffs', 'China trade war', 'Section 301', 'trade policy'],
    markets: 'us-markets',
    business: 'economy'
  },
  {
    title: 'Fed Chair Succession Crisis Deepens as Warsh Nomination Stalls Amid DOJ Probe',
    excerpt: 'Kevin Warsh\'s nomination to replace Jerome Powell as Fed Chair faces a Senate blockade and missing financial disclosures as a DOJ investigation into Powell creates a leadership vacuum.',
    content: [
      {type:'paragraph',content:'The Federal Reserve faces an unprecedented leadership crisis as Kevin Warsh\'s nomination to succeed Jerome Powell as Chair remains stalled due to a Senate blockade, incomplete financial disclosures, and growing questions about his independence from the White House. Powell\'s term expires in May 2026, and the nomination process has been complicated by a Department of Justice investigation into the current Chair that has further politicized the transition.'},
      {type:'paragraph',content:'Senate Banking Committee members from both parties have raised concerns about Warsh\'s financial entanglements, including investments in firms that could be affected by monetary policy decisions. The committee has not yet scheduled a confirmation hearing, and with the Senate having departed for a two-week recess, the timeline for resolution has been pushed to late April at the earliest.'},
      {type:'heading',level:2,content:'Leadership Vacuum at Worst Time'},
      {type:'paragraph',content:'The Fed leadership uncertainty comes at arguably the worst possible moment for the institution. The central bank is navigating the most complex policy environment since the 2008 financial crisis, with the Iran energy shock creating simultaneous inflation and growth challenges that require confident, credible leadership to manage. Markets have historically punished uncertainty about Fed independence and continuity.'},
      {type:'paragraph',content:'Bond market volatility has elevated as traders contemplate scenarios ranging from Powell staying past his term under interim authority to a recess appointment of Warsh that would bypass Senate confirmation. Each scenario carries different implications for monetary policy credibility and market expectations.'},
      {type:'heading',level:2,content:'Independence Concerns Mount'},
      {type:'paragraph',content:'The DOJ investigation into Powell—initiated after the President publicly criticized the Chair for not cutting rates fast enough—has raised alarm bells among economists and former Fed officials who view central bank independence as essential to economic stability. Multiple former Fed governors have issued public statements warning that politicizing the monetary policy process could undermine the dollar\'s reserve currency status and increase long-term borrowing costs.'},
      {type:'paragraph',content:'Financial markets are pricing a growing "Fed independence risk premium" into Treasury yields, with analysts noting that the combination of a leadership vacuum, politicized investigations, and unprecedented policy challenges represents uncharted territory for the world\'s most important central bank.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['TLT', 'UUP', 'GLD'],
    metaDescription: 'Fed Chair succession crisis deepens as Warsh nomination stalls in Senate and DOJ investigation into Powell creates leadership vacuum.',
    seoKeywords: ['Fed Chair nomination', 'Kevin Warsh', 'Jerome Powell', 'Federal Reserve independence', 'monetary policy'],
    markets: 'bonds',
    business: 'economy'
  },
  {
    title: 'NVIDIA Launches Agent Toolkit as Enterprise AI Spending Hits $2.52 Trillion Globally',
    excerpt: 'NVIDIA unveils an open platform for building autonomous AI agents as Gartner projects worldwide AI spending to reach $2.52 trillion in 2026, with telecom and retail leading enterprise adoption.',
    content: [
      {type:'paragraph',content:'NVIDIA launched its Agent Toolkit, an open platform for developing autonomous AI agents capable of reasoning, acting, and completing complex enterprise tasks without human intervention. The toolkit provides pre-built components for agent memory, tool use, multi-step planning, and integration with enterprise systems, dramatically lowering the barrier to deploying agentic AI in production environments.'},
      {type:'paragraph',content:'The announcement comes as Gartner projects worldwide AI spending to reach $2.52 trillion in 2026, a figure that encompasses hardware, software, services, and the organizational restructuring required to integrate AI into business operations. The spending surge is being driven by a fundamental shift from experimental AI pilots to full-scale production deployments across every major industry.'},
      {type:'heading',level:2,content:'Agentic AI Goes Mainstream'},
      {type:'paragraph',content:'Enterprise adoption of agentic AI—systems that can autonomously complete multi-step tasks—has crossed a critical threshold in early 2026. According to NVIDIA\'s State of AI report, telecommunications companies lead adoption at 48%, followed by retail and consumer packaged goods at 47%. The agents are handling tasks ranging from customer service escalation to supply chain optimization and predictive maintenance.'},
      {type:'paragraph',content:'The rapid adoption has created what NVIDIA CEO Jensen Huang calls "the next computing platform," where AI agents function as a new type of workforce alongside human employees. The company\'s GPU hardware and software ecosystem are positioned to capture a significant share of the infrastructure spending required to support this transition.'},
      {type:'heading',level:2,content:'Competitive Dynamics Intensify'},
      {type:'paragraph',content:'NVIDIA\'s Agent Toolkit puts it in direct competition with cloud providers including Amazon Web Services, Microsoft Azure, and Google Cloud, all of which offer their own agentic AI frameworks. However, NVIDIA\'s hardware agnosticism and deep integration with the GPU computing stack that powers most AI workloads give it a structural advantage in the infrastructure layer.'},
      {type:'paragraph',content:'The AI spending surge is creating a two-tier market dynamic: companies successfully deploying AI agents—like Unity Software, which reported a 13.5% revenue surge from its AI ad platform—are being rewarded by investors, while companies still in the investment phase without visible returns face increasing pressure to demonstrate concrete ROI. This divergence is expected to accelerate as the market matures.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['NVDA', 'MSFT', 'AMZN', 'GOOG'],
    metaDescription: 'NVIDIA launches Agent Toolkit for autonomous AI as Gartner projects $2.52T global AI spending in 2026 with telecom leading adoption.',
    seoKeywords: ['NVIDIA Agent Toolkit', 'agentic AI', 'enterprise AI', 'AI spending', 'autonomous agents'],
    markets: 'us-markets',
    business: 'tech'
  }
];

async function main() {
  console.log('Creating 15 NEW viral financial articles (Batch 9 - Mar 29, 2026)...\n');

  const author = await prisma.author.findFirst();
  const categories = {
    usMarkets: await prisma.category.findFirst({ where: { slug: 'us-markets' } }),
    crypto: await prisma.category.findFirst({ where: { slug: 'crypto' } }),
    commodities: await prisma.category.findFirst({ where: { slug: 'commodities' } }),
    bonds: await prisma.category.findFirst({ where: { slug: 'bonds' } }),
    forex: await prisma.category.findFirst({ where: { slug: 'forex' } }),
    tech: await prisma.category.findFirst({ where: { slug: 'tech' } }),
    finance: await prisma.category.findFirst({ where: { slug: 'finance' } }),
    economy: await prisma.category.findFirst({ where: { slug: 'economy' } }),
    energy: await prisma.category.findFirst({ where: { slug: 'energy' } }),
    industrial: await prisma.category.findFirst({ where: { slug: 'industrial' } }),
    consumption: await prisma.category.findFirst({ where: { slug: 'consumption' } }),
  };

  if (!author) {
    console.error('No author found in database');
    return [];
  }

  const categoryMapping = {
    'us-markets': categories.usMarkets?.id,
    'crypto': categories.crypto?.id,
    'commodities': categories.commodities?.id,
    'bonds': categories.bonds?.id,
    'forex': categories.forex?.id,
  };

  const businessMapping = {
    'tech': categories.tech?.id,
    'finance': categories.finance?.id,
    'economy': categories.economy?.id,
    'energy': categories.energy?.id,
    'industrial': categories.industrial?.id,
    'consumption': categories.consumption?.id,
  };

  const created = [];
  const skipped = [];
  const baseTime = new Date();

  for (let i = 0; i < articles.length; i++) {
    const articleData = articles[i];
    const slug = generateSlug(articleData.title);

    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      console.log(`SKIP (exists): ${articleData.title.substring(0, 60)}...`);
      skipped.push(articleData.title);
      continue;
    }

    const marketsCategoryId = categoryMapping[articleData.markets];
    const businessCategoryId = businessMapping[articleData.business];

    if (!marketsCategoryId || !businessCategoryId) {
      console.log(`SKIP (missing category): markets=${articleData.markets}(${marketsCategoryId}) business=${articleData.business}(${businessCategoryId}) - ${articleData.title.substring(0, 60)}...`);
      skipped.push(articleData.title);
      continue;
    }

    // Article 0 = 5 hours ago, Article 14 = 20 min ago
    const publishedAt = new Date(baseTime.getTime() - (5 * 60 * 60 * 1000) + (i * 20 * 60 * 1000));

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
          marketsCategoryId,
          businessCategoryId,
          publishedAt,
        },
      });

      console.log(`CREATED: ${article.title.substring(0, 60)}...`);
      created.push(article);
    } catch (error) {
      console.error(`ERROR creating article: ${articleData.title.substring(0, 60)}...`);
      console.error(error.message);
      skipped.push(articleData.title);
    }
  }

  console.log(`\nSummary:`);
  console.log(`   Created: ${created.length} articles`);
  console.log(`   Skipped: ${skipped.length} articles`);

  if (created.length > 0) {
    console.log(`\nCreated articles:`);
    created.forEach((article, index) => {
      console.log(`   ${index + 1}. ${article.title}`);
    });
  }

  return created;
}

main()
  .then(articles => {
    console.log(`\nDone! Created ${articles.length} NEW viral financial articles (Batch 9)`);
  })
  .catch(e => {
    console.error('\nError:', e);
  })
  .finally(() => prisma.$disconnect());
