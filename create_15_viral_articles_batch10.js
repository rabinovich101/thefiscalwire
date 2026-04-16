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

// 15 NEW Viral Financial News Articles - Batch 10 - March 30, 2026
const articles = [
  {
    title: 'Dow Enters Correction as S&P 500 Posts Fifth Straight Weekly Loss on Iran Escalation',
    excerpt: 'The Dow Jones plunges 793 points to enter correction territory while the S&P 500 drops to a seven-month low, extending its losing streak to five consecutive weeks as Middle East tensions intensify.',
    content: [
      {type:'paragraph',content:'The Dow Jones Industrial Average tumbled 793 points on Friday to close at 45,166, officially entering correction territory with a decline of more than 10% from its recent highs. The S&P 500 shed 1.67% to settle at 6,368—its lowest close in seven months—while the Nasdaq Composite dropped 2.15% to 20,948, extending its year-to-date loss beyond 10%.'},
      {type:'paragraph',content:'The selloff marked the fifth consecutive weekly decline for the broad market, a streak not seen since the 2022 bear market. The S&P 500 fell 2.1% for the week, the Nasdaq slid 3.2%, and the Dow retreated 0.9%. Year-to-date, the damage has been severe: the S&P 500 is down roughly 7%, the Dow has slipped about 8%, and the tech-heavy Nasdaq has fallen more than 10%.'},
      {type:'heading',level:2,content:'Iran War Drives Risk-Off Sentiment'},
      {type:'paragraph',content:'The primary catalyst remains the escalating U.S.-Iran conflict and its impact on global energy markets. Brent crude topped $110 per barrel after fresh incidents in the Strait of Hormuz exacerbated supply fears. The U.S. Armed Forces launched a military campaign on March 19 to reopen the strait, but Iran\'s Revolutionary Guard Corps continues to enforce a de facto blockade, with approximately 150 vessels anchored awaiting safe passage.'},
      {type:'paragraph',content:'President Trump granted Iran another extension on the deadline to reopen the waterway on March 26, extending diplomatic runway but failing to calm markets. Secretary of State Rubio reportedly told G7 ministers that the conflict could continue another two to four weeks, dashing hopes of a swift resolution.'},
      {type:'heading',level:2,content:'Recession Probability Climbs'},
      {type:'paragraph',content:'Moody\'s Analytics AI-driven recession model now places the probability of a U.S. downturn at 49%. Historically, every time this model has crossed the 50% threshold, a recession followed within 12 months. Consumer sentiment has deteriorated sharply as gasoline prices surged to $3.88 per gallon from $2.93 just one month ago, functioning as a regressive tax on household budgets.'},
      {type:'paragraph',content:'Goldman Sachs and Morgan Stanley both cut their year-end S&P 500 targets this week, with strategists warning that the energy shock could subtract meaningfully from corporate earnings in the second and third quarters unless oil prices retreat below $90 per barrel.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['SPY', 'DIA', 'QQQ', 'VIX'],
    metaDescription: 'Dow enters correction with 793-point drop as S&P 500 posts fifth straight weekly loss amid Iran war escalation and recession fears.',
    seoKeywords: ['Dow correction', 'S&P 500 weekly loss', 'stock market crash', 'Iran war markets', 'recession probability'],
    markets: 'us-markets',
    business: 'economy'
  },
  {
    title: 'Gold Surges Past $5,500 to All-Time High as Investors Flee to Safety',
    excerpt: 'Spot gold rockets to $5,595 per ounce—an 18% gain year-to-date—as the Iran conflict and collapsing equity markets drive unprecedented safe-haven demand from both institutions and central banks.',
    content: [
      {type:'paragraph',content:'Gold prices surged to a record $5,595 per ounce on Friday, capping an extraordinary 18% rally year-to-date that has made the precious metal the best-performing major asset class of 2026. The breakout came as equity markets cratered and oil prices surged, creating the exact macro environment—geopolitical chaos, inflation fears, and collapsing risk appetite—that has historically turbocharged gold demand.'},
      {type:'paragraph',content:'The rally has been driven by a confluence of structural and cyclical forces. Central bank buying continues at a record pace, with the People\'s Bank of China adding to reserves for the 19th consecutive month. Gold ETFs reported their strongest quarterly inflows since the pandemic era, while retail demand for physical coins and bars has overwhelmed dealer inventories.'},
      {type:'heading',level:2,content:'Oil-Gold Correlation Strengthens'},
      {type:'paragraph',content:'The oil-gold correlation has strengthened materially during the Iran conflict, with both commodities benefiting from geopolitical uncertainty. However, analysts note a critical difference: oil carries more upside supply-disruption risk with no equivalent in precious metals, making gold the cleaner safe-haven play. The divergence with Bitcoin—which has fallen roughly 15% year-to-date—has dealt another blow to the digital gold narrative.'},
      {type:'paragraph',content:'Goldman Sachs raised its year-end gold target to $6,000 per ounce, citing the likelihood that the Iran conflict will persist through Q2 and that central bank buying shows no signs of abating. The bank estimates that gold could reach $7,000 if the Strait of Hormuz remains disrupted through the summer.'},
      {type:'heading',level:2,content:'Mining Equities Surge'},
      {type:'paragraph',content:'Gold mining stocks have been among the market\'s few bright spots. The VanEck Gold Miners ETF has outperformed the S&P 500 by more than 30 percentage points year-to-date, with Newmont, Barrick Gold, and Agnico Eagle all posting substantial gains. Analysts note that miners offer leveraged exposure to the gold price, with profit margins expanding as the metal price rises while production costs remain relatively stable.'},
      {type:'paragraph',content:'The World Gold Council projects that 2026 will set records for both investment and central bank demand, marking a structural shift in how institutional allocators view the metal\'s role in portfolio construction during an era of deglobalization and geopolitical fragmentation.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['GLD', 'IAU', 'NEM', 'GOLD', 'GDX'],
    metaDescription: 'Gold hits record $5,595 per ounce with 18% YTD gain as Iran conflict and equity selloff drive unprecedented safe-haven demand.',
    seoKeywords: ['gold price record', 'gold all-time high', 'safe haven gold', 'gold vs bitcoin', 'central bank gold buying'],
    markets: 'commodities',
    business: 'finance'
  },
  {
    title: 'Brent Crude Touches $120 as Hormuz Military Campaign Fails to Restore Oil Flows',
    excerpt: 'Oil prices trade within a whisker of $120 per barrel as the U.S. military campaign to reopen the Strait of Hormuz encounters fierce Iranian resistance, with the IEA warning of the largest supply disruption in history.',
    content: [
      {type:'paragraph',content:'Brent crude futures surged to within a whisker of $120 per barrel this week before settling near $108 on Friday, as the U.S. military\'s campaign to reopen the Strait of Hormuz encountered fiercer-than-expected Iranian resistance. The benchmark is now up 28% year-to-date from its January opening price of $82.80, representing the sharpest energy cost spike since the 2022 Russian invasion of Ukraine.'},
      {type:'paragraph',content:'The International Energy Agency characterized the disruption as the most severe in the history of the global oil market, with Gulf production cut by an estimated 10 million barrels per day. Approximately 150 ships remain anchored in or near the waterway, and tanker operators have been reluctant to risk passage despite U.S. naval escort offers.'},
      {type:'heading',level:2,content:'Strategic Reserves Under Pressure'},
      {type:'paragraph',content:'IEA member countries have released 400 million barrels from emergency stockpiles—the largest coordinated release ever—but the daily supply gap far exceeds the approximately 2 million barrels per day that can practically flow from strategic reserves. The U.S. has temporarily eased sanctions on select Russian and Iranian crude, but logistical bottlenecks have limited the impact.'},
      {type:'paragraph',content:'At the consumer level, U.S. gasoline prices have jumped to $3.88 per gallon from $2.93 just one month ago, generating intense political pressure and showing up in weakening retail sales data. Energy analysts warn that if oil remains above $100 through Q2, the cumulative drag on global GDP could reach $2.5 trillion.'},
      {type:'heading',level:2,content:'China Refuses to Help'},
      {type:'paragraph',content:'President Trump\'s demand that China send warships to help secure the Strait of Hormuz was flatly rejected by Beijing, complicating the diplomatic picture ahead of Trump\'s planned state visit. China\'s strategic petroleum reserve covers an estimated 100 to 120 days of normal consumption, giving Beijing a buffer that most importing nations lack.'},
      {type:'paragraph',content:'Energy equities remain the lone bright spot in equity markets, with ExxonMobil, Chevron, and ConocoPhillips all posting double-digit gains since the crisis began. Defense stocks including Lockheed Martin and RTX have also outperformed as the conflict escalates.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['XOM', 'CVX', 'COP', 'USO', 'LMT'],
    metaDescription: 'Brent crude touches $120 as US military struggles to reopen Strait of Hormuz and IEA calls it the largest oil supply disruption ever.',
    seoKeywords: ['oil prices', 'Brent crude $120', 'Strait of Hormuz', 'oil supply disruption', 'energy crisis 2026'],
    markets: 'commodities',
    business: 'energy'
  },
  {
    title: 'Fed Holds Rates at 3.5%-3.75% With Only One Cut Expected as Stagflation Fears Rise',
    excerpt: 'The Federal Reserve keeps rates unchanged while projecting only one cut for 2026, as Chair Powell warns that the Iran energy shock has created an impossible policy dilemma between fighting inflation and supporting growth.',
    content: [
      {type:'paragraph',content:'The Federal Reserve held its benchmark interest rate steady at 3.5%-3.75% at its March meeting, with Chair Jerome Powell delivering an unusually somber assessment of the economic outlook. The committee\'s updated dot plot projects just one rate cut for the remainder of 2026—down from three cuts expected at the start of the year—reflecting the energy-driven inflation surge that has fundamentally altered the policy calculus.'},
      {type:'paragraph',content:'The Fed raised its inflation forecast to 2.7% for both headline and core PCE, while maintaining a GDP growth projection of 2.4%—though Powell acknowledged this figure was compiled before the full impact of the oil shock had been incorporated into economic models. The Atlanta Fed\'s GDPNow tracker has already declined to 1.2% from 2.8% at the quarter\'s start, suggesting the official forecast is stale.'},
      {type:'heading',level:2,content:'Caught Between Mandates'},
      {type:'paragraph',content:'The energy shock has created a textbook stagflation scenario that leaves the Fed with no good options. Cutting rates would risk further fueling inflation that is already running above target, while hiking rates would damage an economy already reeling from the oil price surge. Powell chose the path of inaction, describing the current situation as requiring "patience and careful observation."'},
      {type:'paragraph',content:'Bond markets pushed Treasury yields higher across the curve, with the 10-year note settling at 4.45%. The yield curve remains inverted in key segments, maintaining a recession signal that has persisted since 2022. Inflation-protected securities outperformed nominal bonds as investors sought hedges against the energy-driven price surge.'},
      {type:'heading',level:2,content:'Leadership Vacuum Compounds Uncertainty'},
      {type:'paragraph',content:'The Fed\'s policy challenges are compounded by an unprecedented leadership crisis. Powell\'s term expires in May, and his nominated successor Kevin Warsh faces a stalled Senate confirmation amid incomplete financial disclosures. The Department of Justice investigation into Powell—initiated after presidential criticism of monetary policy—has raised alarm about central bank independence.'},
      {type:'paragraph',content:'Former Fed officials have issued public warnings that politicizing the monetary policy process could undermine the dollar\'s reserve currency status. Markets are pricing in potential disruption to policy continuity at the worst possible moment for the U.S. economy.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=630&fit=crop&q=80',
    readTime: 6,
    relevantTickers: ['TLT', 'TIP', 'IEF', 'SHY'],
    metaDescription: 'Fed holds rates at 3.5%-3.75% with only one cut projected for 2026 as Iran energy shock creates stagflation policy dilemma.',
    seoKeywords: ['Federal Reserve rates', 'interest rate decision', 'stagflation', 'Jerome Powell', 'monetary policy 2026'],
    markets: 'bonds',
    business: 'economy'
  },
  {
    title: 'Strategy Amasses 762,000 Bitcoin Worth $52 Billion as Rivals Sit on Sidelines',
    excerpt: 'Michael Saylor\'s Strategy accelerates its Bitcoin buying pace to 762,099 BTC—worth $52.36 billion—while all other public corporate treasury buyers combined acquire fewer than 1,000 coins in March.',
    content: [
      {type:'paragraph',content:'Strategy, the company formerly known as MicroStrategy, has expanded its Bitcoin holdings to 762,099 BTC valued at approximately $52.36 billion as of March 24, making it by far the largest corporate holder of the cryptocurrency. The company has accelerated its buying pace in recent weeks, acquiring Bitcoin at its fastest rate in nearly a year even as the asset trades well below the average production cost for miners.'},
      {type:'paragraph',content:'The concentration of corporate Bitcoin demand in Strategy has become striking. According to data from Bitcoin Magazine, the company accounted for 97.5% of all corporate Bitcoin purchases in January, and the pattern has continued through March. CEO Michael Saylor signaled further acquisitions are imminent, maintaining his conviction that the current price decline represents a generational buying opportunity.'},
      {type:'heading',level:2,content:'The 42/42 Plan in Action'},
      {type:'paragraph',content:'Strategy is executing its ambitious "42/42" capital raise—$42 billion in at-the-market equity sales and $42 billion in fixed-income securities over three years—to fund continued Bitcoin accumulation. The company\'s average purchase price stands at $66,384 per coin with a total cost basis of $33.1 billion, meaning the position currently shows a significant unrealized gain despite Bitcoin trading near $69,000.'},
      {type:'paragraph',content:'The stock trades at a substantial premium to the net asset value of its Bitcoin holdings, reflecting investor belief in Saylor\'s ability to create value through financial engineering. MSTR has effectively become a leveraged Bitcoin ETF alternative, attracting investors who want amplified exposure to the cryptocurrency.'},
      {type:'heading',level:2,content:'Market Structure Concerns'},
      {type:'paragraph',content:'The dominance of a single buyer in the corporate treasury space has raised questions about Bitcoin\'s market structure. Strategy\'s buying provides a persistent bid that absorbs selling pressure from ETF outflows and miner liquidations, but the approximately $7 billion in convertible debt on the company\'s balance sheet creates tail risk if Bitcoin prices decline sharply.'},
      {type:'paragraph',content:'Spot Bitcoin ETFs have collectively attracted $56 billion in inflows since their January 2024 launch and are on pace for their first month of net inflows since October, suggesting that institutional demand extends beyond Saylor\'s one-man accumulation campaign.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['MSTR', 'BTC', 'IBIT', 'COIN'],
    metaDescription: 'Strategy expands Bitcoin holdings to 762,099 BTC worth $52B while all other corporate buyers combined purchase fewer than 1,000 coins.',
    seoKeywords: ['MicroStrategy Bitcoin', 'Strategy BTC holdings', 'Michael Saylor', 'corporate Bitcoin treasury', 'MSTR stock'],
    markets: 'crypto',
    business: 'finance'
  },
  {
    title: 'SEC and CFTC Issue Landmark Crypto Token Taxonomy Clarifying Securities Law',
    excerpt: 'The SEC and CFTC jointly publish a comprehensive framework classifying digital assets into five categories—commodities, collectibles, tools, stablecoins, and securities—providing the regulatory clarity the industry has demanded for years.',
    content: [
      {type:'paragraph',content:'The Securities and Exchange Commission, joined by the Commodity Futures Trading Commission, issued a landmark joint interpretation on March 17 that provides the most comprehensive regulatory framework for digital assets in U.S. history. The guidance establishes a coherent token taxonomy that classifies crypto assets into five distinct categories: digital commodities, digital collectibles, digital tools, stablecoins, and digital securities.'},
      {type:'paragraph',content:'The framework represents a dramatic departure from the previous SEC administration\'s enforcement-first approach, which treated virtually all tokens as securities and relied on litigation to establish regulatory boundaries. The new taxonomy provides clear criteria for each category, giving issuers and exchanges a roadmap for compliance that the industry has demanded since Bitcoin\'s earliest days.'},
      {type:'heading',level:2,content:'Five Categories Defined'},
      {type:'paragraph',content:'Digital commodities—including Bitcoin and Ethereum—fall under CFTC jurisdiction for spot market regulation. Digital securities, which include tokens that represent ownership stakes or revenue-sharing arrangements, remain under SEC authority. Stablecoins are carved out with a separate regulatory pathway aligned with pending congressional legislation. Digital collectibles (NFTs) and digital tools (utility tokens) receive lighter-touch treatment.'},
      {type:'paragraph',content:'The guidance explicitly states that the mere use of blockchain technology does not make an asset a security, resolving an ambiguity that had chilled innovation and driven projects offshore. Exchanges that list tokens properly classified under the framework receive safe harbor protections for a transition period.'},
      {type:'heading',level:2,content:'Market and Industry Response'},
      {type:'paragraph',content:'Crypto industry leaders praised the framework as a watershed moment for regulatory clarity, with Coinbase CEO Brian Armstrong calling it "the single most important regulatory development since the Bitcoin ETF approvals." The guidance is expected to accelerate institutional adoption by removing the legal uncertainty that has kept many traditional financial firms on the sidelines.'},
      {type:'paragraph',content:'Nasdaq simultaneously received SEC approval to facilitate trading of tokenized securities, bridging traditional equity markets with blockchain-based settlement. The convergence of regulatory clarity and institutional infrastructure is creating what Grayscale describes as "the dawn of the institutional era" for digital assets.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['COIN', 'HOOD', 'BTC', 'ETH'],
    metaDescription: 'SEC and CFTC issue joint crypto token taxonomy classifying digital assets into five categories, providing landmark regulatory clarity.',
    seoKeywords: ['SEC crypto regulation', 'token taxonomy', 'crypto securities law', 'CFTC digital assets', 'crypto regulatory framework'],
    markets: 'crypto',
    business: 'finance'
  },
  {
    title: 'NVIDIA Unveils RTX PRO Blackwell at GTC 2026 With 100x Vision AI Performance',
    excerpt: 'Jensen Huang debuts the RTX PRO 4500 Blackwell Server Edition delivering 100x performance for vision AI and 50x for vector databases, while dedicating his keynote to the emergence of autonomous AI agents.',
    content: [
      {type:'paragraph',content:'NVIDIA CEO Jensen Huang used the company\'s GTC 2026 conference to unveil the RTX PRO 4500 Blackwell Server Edition, a GPU that delivers 100x performance improvement for vision AI applications and up to 50x for vector databases compared to previous generation hardware. The announcement underscores NVIDIA\'s strategy of targeting enterprise AI workloads that require specialized silicon rather than general-purpose compute.'},
      {type:'paragraph',content:'The new hardware features fifth-generation Tensor Cores and fourth-generation RTX technology, representing what Huang called "the most significant architectural leap in enterprise AI acceleration since the original A100." The Server Edition is specifically designed for the data center deployments that are driving the AI infrastructure buildout across every major industry.'},
      {type:'heading',level:2,content:'Agentic AI Takes Center Stage'},
      {type:'paragraph',content:'Huang dedicated a significant portion of his keynote to the emergence of autonomous AI agent systems, highlighting NVIDIA\'s Agent Toolkit as the infrastructure layer for enterprise deployments. The CEO pointed to the telecommunications sector—where agentic AI adoption has reached 48%—as evidence that autonomous agents are transitioning from experimental pilots to production-grade systems.'},
      {type:'paragraph',content:'The conference also featured the debut of OpenClaw, a technology that Huang described as representing a fundamental shift toward autonomous agentic AI. The announcement sparked a broad industry conversation about whether AI models are becoming commoditized, with CNBC reporting that the development has generated concerns across the technology sector.'},
      {type:'heading',level:2,content:'$2.5 Trillion AI Spending Wave'},
      {type:'paragraph',content:'Gartner projects worldwide AI expenditure will reach $2.52 trillion in 2026, with NVIDIA positioned to capture a disproportionate share through its dominant position in both training and inference hardware. The company\'s data center revenue continues to set records each quarter as hyperscalers and enterprises race to build AI infrastructure.'},
      {type:'paragraph',content:'NVIDIA shares have outperformed the broader market year-to-date despite the Iran-driven selloff, reflecting investor conviction that AI spending is relatively insulated from the energy shock affecting other sectors. The stock remains the most widely held position among hedge funds and the single largest contributor to S&P 500 earnings growth expectations for 2026.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['NVDA', 'AMD', 'MSFT', 'GOOG'],
    metaDescription: 'NVIDIA unveils RTX PRO Blackwell with 100x vision AI performance at GTC 2026 as Jensen Huang highlights agentic AI revolution.',
    seoKeywords: ['NVIDIA GTC 2026', 'RTX PRO Blackwell', 'Jensen Huang', 'agentic AI', 'AI infrastructure'],
    markets: 'us-markets',
    business: 'tech'
  },
  {
    title: 'Apple Partners With Google Gemini for AI-Powered Siri Relaunch in iOS 26.4',
    excerpt: 'Apple announces a reimagined Siri built on Google\'s 1.2 trillion parameter Gemini model running on Apple Private Cloud Compute, targeting a March 2026 release with on-screen awareness and cross-app integration.',
    content: [
      {type:'paragraph',content:'Apple announced a fundamental reimagining of Siri that will leverage Google\'s 1.2 trillion parameter Gemini AI model, marking the most significant partnership between the two tech giants since Google Maps launched on the original iPhone. The new Siri will debut in iOS 26.4—targeted for late March 2026—with capabilities including on-screen awareness, seamless cross-app integration, and conversational context that persists across sessions.'},
      {type:'paragraph',content:'The partnership is structured to maintain Apple\'s privacy commitments, with all Gemini processing routed through Apple\'s Private Cloud Compute infrastructure. This means user data never touches Google\'s servers directly, addressing the privacy concerns that have historically made Apple reluctant to rely on external AI providers.'},
      {type:'heading',level:2,content:'Catching Up to the AI Race'},
      {type:'paragraph',content:'The announcement represents Apple\'s most aggressive move to close the gap with competitors in artificial intelligence. While Google, Microsoft, and OpenAI have dominated the generative AI narrative, Apple has been perceived as falling behind despite its massive installed base of more than 2 billion active devices. The Gemini partnership allows Apple to leapfrog its own in-house AI development timeline.'},
      {type:'paragraph',content:'The new Siri will understand context from what\'s displayed on screen, execute multi-step tasks across applications, and maintain conversational memory—capabilities that current Siri lacks entirely. Demonstrations showed the assistant booking restaurants, managing calendars, and summarizing email threads with natural language understanding that approaches human-level comprehension.'},
      {type:'heading',level:2,content:'Market and Developer Impact'},
      {type:'paragraph',content:'Apple shares rose on the announcement as analysts noted the potential for AI features to drive an iPhone upgrade cycle. Morgan Stanley estimates that an AI-powered Siri could add $50 billion in annual services revenue over the next three years through enhanced app engagement and new subscription offerings.'},
      {type:'paragraph',content:'For developers, the integration opens new possibilities for AI-powered app experiences built on Apple\'s platforms. The company announced expanded APIs that will allow third-party apps to interact with Siri\'s Gemini-powered intelligence, creating an ecosystem play that could differentiate iOS from Android in the enterprise market.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1591337676887-a217a6c8a130?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['AAPL', 'GOOG', 'MSFT'],
    metaDescription: 'Apple partners with Google Gemini for AI-powered Siri relaunch in iOS 26.4 with on-screen awareness and cross-app intelligence.',
    seoKeywords: ['Apple Siri AI', 'Google Gemini Apple', 'iOS 26.4', 'Apple Intelligence', 'AI assistant'],
    markets: 'us-markets',
    business: 'tech'
  },
  {
    title: 'Trump Delays Beijing Summit as China Refuses to Help Reopen Strait of Hormuz',
    excerpt: 'President Trump signals a postponement of his historic state visit to China after Beijing flatly rejects his demand to send warships to the Strait of Hormuz, raising stakes for the bilateral trade truce expiring in November.',
    content: [
      {type:'paragraph',content:'President Trump signaled a possible delay to his planned state visit to Beijing after China refused his request to deploy naval forces to help reopen the Strait of Hormuz. The diplomatic standoff injects fresh uncertainty into what was expected to be a pivotal summit for U.S.-China trade relations, with the bilateral tariff truce set to expire in November 2026.'},
      {type:'paragraph',content:'Trump took to social media on March 15 to demand that both NATO allies and China contribute to securing the vital waterway, warning that "we will remember" which countries stepped up during the crisis. China\'s foreign ministry dismissed the request, stating that the Hormuz situation is a consequence of U.S. military action and that China bears no responsibility for resolving it.'},
      {type:'heading',level:2,content:'Trade Truce at Risk'},
      {type:'paragraph',content:'The confrontation threatens to derail the fragile trade truce that has kept bilateral tariffs from escalating further. The current agreement, which holds average tariffs at 47.5% on Chinese goods, expires in November and was widely expected to be extended or improved during the summit. Treasury Secretary Scott Bessent attempted to de-link the Hormuz demand from the trade agenda, but the diplomatic damage may already be done.'},
      {type:'paragraph',content:'China has launched counter-investigations into U.S. trade practices ahead of the summit, suggesting that any framework agreement will prioritize diplomatic optics over substantive concessions. Meanwhile, the U.S. trade deficit widened 33% to $70.3 billion as imports simply shifted from China to Vietnam and Taiwan rather than declining.'},
      {type:'heading',level:2,content:'Beijing\'s Strategic Patience'},
      {type:'paragraph',content:'Analysts note that China is weathering the Iran crisis with minimal economic damage. Beijing maintains a strategic petroleum reserve covering 100 to 120 days of normal consumption, providing a buffer that most oil-importing nations lack. The Chinese economy is less oil-intensive than Western economies, and alternative supply routes through Russia and Central Asia partially offset the Hormuz disruption.'},
      {type:'paragraph',content:'The geopolitical calculus gives China leverage in any trade negotiation: Washington needs Beijing\'s cooperation on Iran more than Beijing needs a trade deal, inverting the power dynamic that has characterized previous rounds of U.S.-China economic diplomacy.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['FXI', 'EWY', 'KWEB', 'BABA'],
    metaDescription: 'Trump delays Beijing summit after China refuses to help reopen Strait of Hormuz, threatening bilateral trade truce expiring November.',
    seoKeywords: ['Trump China summit', 'US China trade war', 'Strait of Hormuz China', 'Beijing state visit', 'trade truce'],
    markets: 'us-markets',
    business: 'economy'
  },
  {
    title: 'Stablecoin Yield Bill Sparks Industry Backlash as Congress Debates Digital Dollar Framework',
    excerpt: 'The proposed Digital Asset PARITY Act draft triggers pushback from issuers and DeFi protocols alike as regulators debate whether stablecoins should be allowed to generate yield for holders.',
    content: [
      {type:'paragraph',content:'A draft of the Digital Asset PARITY Act has sparked intense debate across the cryptocurrency industry by proposing to extend wash-sale rules to digital assets while simultaneously addressing the contentious question of whether regulated stablecoins should be permitted to generate yield for holders. Industry representatives who previewed the bill\'s yield provisions described them as a compromise that fully satisfies no one.'},
      {type:'paragraph',content:'The proposed legislation would shield certain regulated payment stablecoins from routine gain-or-loss recognition—a significant simplification for everyday crypto transactions—but would impose new restrictions on how stablecoin issuers can distribute yield to holders. The framework calls for regulators to draft new rules around permissible yield-generating activity, creating uncertainty about the future of products that currently pay interest on stablecoin balances.'},
      {type:'heading',level:2,content:'Industry Divided'},
      {type:'paragraph',content:'Stablecoin issuers like Circle and Paxos have expressed concern that overly restrictive yield provisions could push activity offshore or into unregulated protocols. DeFi advocates argue that any framework limiting on-chain yield is incompatible with the permissionless nature of decentralized finance. Meanwhile, traditional banking lobbyists push for strict limits, viewing yield-bearing stablecoins as unlicensed deposit-taking that competes with regulated banks.'},
      {type:'paragraph',content:'Regulated stablecoin issuers including USDC, RLUSD, and PYUSD have been steadily gaining market share, with Ripple\'s RLUSD surpassing $1 billion in market capitalization within its first year. The growth has made the regulatory treatment of stablecoin yields a multi-billion-dollar policy question.'},
      {type:'heading',level:2,content:'Stablecoin Payments Go Mainstream'},
      {type:'paragraph',content:'While Washington debates, stablecoin adoption continues accelerating globally. StraitsX, a Singapore-based payment company, reported a 40x surge in stablecoin card transaction volume and an 83x increase in card issuance, as stablecoin payments become "invisible" to consumers in Southeast Asia. The trend suggests that stablecoins are finding product-market fit as payment infrastructure regardless of how U.S. regulators treat their yield characteristics.'},
      {type:'paragraph',content:'World Liberty Financial\'s release of the open-source AgentPay SDK—enabling AI agents to autonomously manage stablecoin transactions—adds another dimension to the regulatory debate, as autonomous agents could execute millions of micro-transactions that blur the line between payment and investment activity.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['COIN', 'XRP', 'PYPL'],
    metaDescription: 'Digital Asset PARITY Act draft sparks backlash over stablecoin yield restrictions as Congress debates regulatory framework.',
    seoKeywords: ['stablecoin regulation', 'PARITY Act', 'crypto legislation', 'stablecoin yield', 'digital dollar'],
    markets: 'crypto',
    business: 'finance'
  },
  {
    title: 'Bitcoin Miners Lose $19,000 Per Coin as Production Cost Hits $88,000 Amid Energy Crisis',
    excerpt: 'Public Bitcoin miners now spend $88,000 to produce one BTC against a market price of $69,200—a 21% loss per block—accelerating the industry pivot to AI data center contracts.',
    content: [
      {type:'paragraph',content:'The economics of Bitcoin mining have deteriorated to crisis levels, with the average public miner now spending approximately $88,000 to produce one Bitcoin while the cryptocurrency trades near $69,200. The 21% loss per block—driven by post-halving reward reductions and surging energy costs from the Iran oil crisis—has pushed the industry into what analysts describe as a capitulation phase.'},
      {type:'paragraph',content:'The math is unsustainable for all but the most efficient operators. Electricity costs have surged across key mining regions as oil prices ripple through global energy markets, compounding the impact of the April 2024 halving that cut block rewards to 3.125 BTC. Hash rate has declined for the first time in two years as marginal miners shut down unprofitable equipment.'},
      {type:'heading',level:2,content:'AI Pivot Accelerates'},
      {type:'paragraph',content:'The mining economics crisis has accelerated an industry-wide pivot toward artificial intelligence. Marathon Digital, Riot Platforms, CleanSpark, and Core Scientific are among the companies repurposing mining facilities for AI compute, collectively signing more than $70 billion in AI data center contracts. The diversification offers predictable revenue streams and premium valuations compared to Bitcoin mining.'},
      {type:'paragraph',content:'Core Scientific has become the template for successful transformation, having emerged from bankruptcy to secure a massive multi-year contract with CoreWeave that transformed its market narrative. Companies that have announced AI partnerships have seen their stock prices decouple from Bitcoin, breaking the historical correlation that defined the mining sector.'},
      {type:'heading',level:2,content:'Treasury Liquidation Pressure'},
      {type:'paragraph',content:'Several miners have begun liquidating Bitcoin treasuries to finance AI infrastructure buildout, adding selling pressure to an already weak market. Public miners collectively hold approximately 45,000 BTC, representing a significant potential supply overhang. The selling creates a negative feedback loop where lower prices force more liquidation, which pushes prices lower still.'},
      {type:'paragraph',content:'The structural shift from mining to AI represents a fundamental transformation of the cryptocurrency infrastructure industry, with implications for Bitcoin\'s hash rate security and the broader proof-of-work sustainability narrative.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['MARA', 'RIOT', 'CLSK', 'CORZ'],
    metaDescription: 'Bitcoin miners lose $19K per coin as production cost hits $88K amid energy crisis, accelerating mass pivot to AI data centers.',
    seoKeywords: ['Bitcoin mining crisis', 'miner capitulation', 'BTC production cost', 'AI data center pivot', 'crypto mining'],
    markets: 'crypto',
    business: 'tech'
  },
  {
    title: 'OpenAI Launches GPT-5.4 Pro With 1 Million Token Context as Open Source Closes the Gap',
    excerpt: 'OpenAI debuts GPT-5.4 in three variants with context windows up to 1.05 million tokens, but Alibaba\'s 9B parameter Qwen3 matches the flagship on key benchmarks at a fraction of the compute cost.',
    content: [
      {type:'paragraph',content:'OpenAI released GPT-5.4 in what CEO Sam Altman called the company\'s most significant launch since GPT-4, debuting three model variants—Standard, Thinking, and Pro—with the Pro variant supporting context windows of 1.05 million tokens. The release represents the largest commercial context window OpenAI has ever offered and positions the company to compete with Google\'s Gemini in long-document and multi-modal processing.'},
      {type:'paragraph',content:'The Thinking variant introduces a reasoning-first architecture that allocates variable compute time to complex problems, integrating the approach pioneered by the o1 series into a general-purpose model. Early benchmarks show significant improvements in mathematical reasoning, code generation, and multi-step logical inference. The Pro variant adds native computer-use capabilities, enabling the model to interact with desktop applications and web browsers autonomously.'},
      {type:'heading',level:2,content:'Open Source Narrows the Moat'},
      {type:'paragraph',content:'However, the launch was overshadowed by a sobering competitive reality: Alibaba\'s Qwen3 9B open-source model matched GPT-5.4 Standard on the GPQA Diamond benchmark despite using just 9 billion parameters compared to OpenAI\'s estimated 120 billion. The result validates predictions that algorithmic efficiency gains are enabling smaller models to match larger ones at a fraction of the cost.'},
      {type:'paragraph',content:'The narrowing quality gap between proprietary and open-source models has profound implications for OpenAI\'s business model, which depends on maintaining enough capability lead to justify premium pricing. Google simultaneously released Gemini 3.1 Flash-Lite at just $0.25 per million input tokens, further compressing the pricing environment.'},
      {type:'heading',level:2,content:'Enterprise Spending Undeterred'},
      {type:'paragraph',content:'Despite the competitive pressure, enterprise AI adoption continues accelerating. Gartner projects worldwide AI expenditure of $2.52 trillion in 2026, driven by agentic AI deployments transitioning from pilots to production. OpenAI secured a record $110 billion in funding to scale accessibility, expanding integrations with NVIDIA hardware and Amazon infrastructure.'},
      {type:'paragraph',content:'The AI model landscape is entering what analysts describe as a commoditization phase, where the primary beneficiaries are enterprise customers who gain access to increasingly capable AI at falling price points regardless of which model provider wins the benchmark race.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['MSFT', 'NVDA', 'GOOG', 'BABA'],
    metaDescription: 'OpenAI launches GPT-5.4 with 1M token context in three variants as Alibaba open-source model matches it on key benchmarks.',
    seoKeywords: ['GPT-5.4', 'OpenAI launch', 'AI models 2026', 'open source AI', 'enterprise AI spending'],
    markets: 'us-markets',
    business: 'tech'
  },
  {
    title: 'Gasoline Prices Surge 32% in One Month as Energy Shock Crushes Consumer Confidence',
    excerpt: 'U.S. average gasoline prices jump from $2.93 to $3.88 per gallon in four weeks, the fastest increase since 2008, as the oil shock from the Iran conflict functions as a regressive tax on American households.',
    content: [
      {type:'paragraph',content:'Average U.S. gasoline prices surged to $3.88 per gallon this week, up a staggering 32% from $2.93 just one month ago—the fastest monthly increase since the 2008 oil crisis. The spike is a direct consequence of the Strait of Hormuz disruption, which has removed approximately 10 million barrels per day of Gulf oil production from global markets and sent Brent crude above $110 per barrel.'},
      {type:'paragraph',content:'The energy shock is functioning as a regressive tax that falls disproportionately on lower-income households, who spend a larger share of income on transportation. Consumer confidence surveys have cratered to multi-year lows, with the University of Michigan sentiment index recording its sharpest monthly decline since the COVID-19 pandemic.'},
      {type:'heading',level:2,content:'Retail Spending Already Weakening'},
      {type:'paragraph',content:'The hit to consumer wallets is already showing up in real-time spending data. Credit card transaction data from major processors shows declining volumes at restaurants, entertainment venues, and discretionary retailers over the past two weeks. The Atlanta Fed\'s GDPNow estimate for Q1 GDP growth has plunged to 1.2% from 2.8% at the start of the quarter, with energy costs cited as the primary drag.'},
      {type:'paragraph',content:'Travel and leisure stocks have been hit particularly hard, with airlines facing the double burden of higher jet fuel costs and weakening consumer demand. Hotel and restaurant chains are reporting soft forward bookings as consumers pull back on discretionary spending to absorb higher energy bills.'},
      {type:'heading',level:2,content:'Political Pressure Intensifies'},
      {type:'paragraph',content:'The gas price surge has generated intense social media backlash and bipartisan political pressure on the administration. While U.S. households spend a smaller share of income on energy today than during past oil shocks, providing some economic resilience, the psychological impact of rapidly rising pump prices has historically driven consumer behavior changes that amplify recessionary dynamics.'},
      {type:'paragraph',content:'Energy strategists warn that gasoline could reach $4.50 per gallon by late April if the Hormuz situation is not resolved, pushing the energy burden to levels that would materially impact consumer spending across all income groups and significantly raise the probability of a consumer-led recession.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1545262810-a4eb1017539c?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['XLE', 'XRT', 'JETS'],
    metaDescription: 'Gas prices surge 32% in one month to $3.88 as Iran oil shock crushes consumer confidence and threatens consumer-led recession.',
    seoKeywords: ['gasoline prices surge', 'gas prices 2026', 'consumer confidence', 'energy shock', 'consumer spending'],
    markets: 'us-markets',
    business: 'consumption'
  },
  {
    title: 'Nasdaq Approves Tokenized Securities Trading in Landmark Bridge Between Wall Street and Blockchain',
    excerpt: 'Nasdaq receives SEC approval to facilitate trading of tokenized securities on its exchange infrastructure, creating the first regulated bridge between traditional equity markets and blockchain settlement.',
    content: [
      {type:'paragraph',content:'Nasdaq received SEC approval to facilitate the trading of tokenized securities on its existing exchange infrastructure, a landmark decision that creates the first regulated bridge between traditional equity markets and blockchain-based settlement systems. The approval allows companies to issue and trade equity tokens that settle on distributed ledger technology while maintaining full compliance with existing securities regulations.'},
      {type:'paragraph',content:'The decision represents one of the most significant structural developments in capital markets since the move to electronic trading, potentially reshaping how securities are issued, traded, and settled. Nasdaq CEO Adena Friedman described the approval as "the beginning of a new chapter in market infrastructure" that will reduce settlement times, lower costs, and expand access to capital markets.'},
      {type:'heading',level:2,content:'T+0 Settlement Becomes Reality'},
      {type:'paragraph',content:'Tokenized securities settle nearly instantaneously on blockchain networks, compared to the current T+1 standard for traditional equities. The efficiency gain eliminates counterparty risk during the settlement window and frees up billions of dollars in capital that is currently locked in clearing and settlement infrastructure. Industry estimates suggest that blockchain settlement could save the global financial system $10-20 billion annually.'},
      {type:'paragraph',content:'The first tokenized securities are expected to begin trading on Nasdaq\'s platform in Q3 2026, with an initial focus on fixed-income products and equity shares of smaller companies that can benefit from reduced listing costs. Major investment banks including Goldman Sachs and JPMorgan have expressed interest in participating as market makers.'},
      {type:'heading',level:2,content:'Crypto Infrastructure Meets TradFi'},
      {type:'paragraph',content:'The approval validates the thesis that blockchain technology will be adopted by traditional finance through regulated channels rather than replacing existing institutions. The convergence creates opportunities for crypto-native infrastructure providers like Coinbase, which can leverage its custody and trading technology to serve institutional clients moving into tokenized securities.'},
      {type:'paragraph',content:'The development arrives alongside the SEC\'s comprehensive token taxonomy, creating a regulatory environment that for the first time provides clarity on how digital assets interact with existing securities law. Taken together, these developments mark 2026 as the year that institutional crypto adoption shifted from aspiration to implementation.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['NDAQ', 'COIN', 'GS', 'JPM'],
    metaDescription: 'Nasdaq receives SEC approval for tokenized securities trading, creating first regulated bridge between Wall Street and blockchain.',
    seoKeywords: ['tokenized securities', 'Nasdaq blockchain', 'SEC tokenization', 'blockchain settlement', 'digital securities'],
    markets: 'us-markets',
    business: 'finance'
  },
  {
    title: 'Defense Stocks Rally 25% as Pentagon Requests Emergency $40 Billion Supplemental for Iran Operations',
    excerpt: 'The Pentagon submits an emergency $40 billion supplemental budget request to Congress as the cost of Operation Sovereign Passage escalates, sending Lockheed Martin, RTX, and Northrop Grumman to all-time highs.',
    content: [
      {type:'paragraph',content:'Defense stocks surged to all-time highs this week after the Pentagon submitted a $40 billion emergency supplemental budget request to Congress for the ongoing military operations against Iran. The request covers the cost of Operation Sovereign Passage—the naval campaign to reopen the Strait of Hormuz—as well as air defense systems deployed to protect Gulf allies from Iranian missile and drone attacks.'},
      {type:'paragraph',content:'Lockheed Martin, RTX (formerly Raytheon), and Northrop Grumman have all rallied more than 25% since the conflict began in late February, making the defense sector the best-performing group in the S&P 500 alongside energy. The iShares U.S. Aerospace & Defense ETF has outperformed the broad market by more than 30 percentage points year-to-date.'},
      {type:'heading',level:2,content:'Munitions Replenishment Drives Orders'},
      {type:'paragraph',content:'A significant portion of the supplemental request targets munitions replenishment, with Tomahawk cruise missiles, JDAM guided bombs, and Patriot interceptors being consumed at rates that have strained existing inventories. Lockheed Martin\'s backlog has expanded to a record as the military races to replace expended munitions while maintaining readiness for potential escalation.'},
      {type:'paragraph',content:'RTX has seen particularly strong demand for its Patriot air defense system and SM-6 missiles, which have been critical in defending coalition forces and Gulf state infrastructure from Iranian ballistic missile attacks. The company announced accelerated production schedules across multiple facilities to meet the surging demand.'},
      {type:'heading',level:2,content:'Long-Term Defense Spending Implications'},
      {type:'paragraph',content:'Defense analysts project that the Iran conflict will have lasting effects on global military spending, even after hostilities conclude. NATO allies are accelerating defense budget increases, with several European nations announcing plans to exceed the 2% GDP spending target. The conflict has also validated investments in autonomous systems and AI-powered defense capabilities, benefiting companies like Palantir and Anduril.'},
      {type:'paragraph',content:'Congressional leaders from both parties have signaled support for the supplemental request, though some fiscal hawks have raised concerns about adding to the deficit at a time when the economy faces potential recession. The bipartisan consensus on defense spending contrasts sharply with the gridlock affecting domestic policy legislation.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['LMT', 'RTX', 'NOC', 'ITA', 'PLTR'],
    metaDescription: 'Defense stocks rally 25% as Pentagon requests $40B emergency supplemental for Iran operations, sending Lockheed and RTX to record highs.',
    seoKeywords: ['defense stocks rally', 'Pentagon budget Iran', 'Lockheed Martin', 'military spending', 'Operation Sovereign Passage'],
    markets: 'us-markets',
    business: 'industrial'
  }
];

async function main() {
  console.log('Creating 15 NEW viral financial articles (Batch 10 - Mar 30, 2026)...\n');

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

  // First, delete all existing articles to replace with fresh ones
  const deleteResult = await prisma.article.deleteMany({});
  console.log(`Deleted ${deleteResult.count} existing articles to replace with fresh batch.\n`);

  const created = [];
  const skipped = [];
  const baseTime = new Date();

  for (let i = 0; i < articles.length; i++) {
    const articleData = articles[i];
    const slug = generateSlug(articleData.title);

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
    console.log(`\nDone! Created ${articles.length} NEW viral financial articles (Batch 10)`);
  })
  .catch(e => {
    console.error('\nError:', e);
  })
  .finally(() => prisma.$disconnect());
