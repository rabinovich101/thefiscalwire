const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

// 15 NEW Viral Financial News Articles - Batch 4 - March 12, 2026
const articles = [
  {
    title: 'Oil Surges Past $100 as Iran Vows to Keep Strait of Hormuz Shut',
    excerpt: 'Brent crude blasts through $100 per barrel after Iran\'s Revolutionary Guard doubles down on its blockade of the Strait of Hormuz, choking off 21% of global oil transit and sending energy markets into crisis mode.',
    content: [
      {type:'paragraph',content:'Brent crude oil surged past $100 per barrel on Wednesday, climbing 6.4% to $103.80 in volatile trading after Iran\'s Islamic Revolutionary Guard Corps (IRGC) issued a defiant statement vowing to maintain its naval blockade of the Strait of Hormuz "until all American forces withdraw from the Persian Gulf." WTI crude followed with a 5.9% jump to $99.60, breaching the psychologically critical $100 threshold for the first time in over two years as traders priced in an extended disruption to the world\'s most important oil chokepoint.'},
      {type:'paragraph',content:'The strait, a narrow waterway between Iran and Oman, carries approximately 21% of global petroleum consumption—roughly 17 million barrels per day—making any sustained blockade a direct threat to global energy security. IRGC Navy commander Rear Admiral Alireza Tangsiri stated that Iran had deployed additional fast-attack boats, anti-ship missiles, and naval mines to reinforce the blockade, which has already halted at least 40 oil tankers over the past 72 hours.'},
      {type:'heading',level:2,content:'Global Energy Impact'},
      {type:'paragraph',content:'The price spike reverberated across global energy markets. European natural gas futures jumped 8.2% on concerns that LNG shipments routed through the Persian Gulf could also be disrupted. Gasoline futures surged 7.5%, with analysts at GasBuddy projecting that U.S. pump prices could reach $4.50 per gallon within two weeks if the blockade persists. Energy stocks rallied broadly, with ExxonMobil (NYSE: XOM) gaining 4.1%, Chevron (NYSE: CVX) rising 3.8%, and ConocoPhillips (NYSE: COP) adding 5.2%.'},
      {type:'paragraph',content:'OPEC members Saudi Arabia and the UAE, whose export terminals lie on the Persian Gulf side of the strait, have activated contingency plans to reroute some crude shipments via overland pipelines to Red Sea ports, but analysts estimate these alternative routes can handle only 4-5 million barrels per day—a fraction of the strait\'s normal throughput. "There is no quick fix for a Hormuz blockade," warned Helima Croft, head of global commodity strategy at RBC Capital Markets. "Even with pipeline alternatives at full capacity, the market faces a 12-13 million barrel per day shortfall that cannot be replaced."'},
      {type:'heading',level:2,content:'Diplomatic Efforts'},
      {type:'paragraph',content:'The United Nations Security Council held an emergency session on Wednesday morning, with Secretary-General Antonio Guterres calling the blockade "a grave threat to international peace and economic stability." China, which imports 40% of its crude oil through the strait, joined Western nations in calling for an immediate reopening of the waterway, though Beijing stopped short of endorsing military action to break the blockade. Diplomatic sources indicate that Oman and Qatar are attempting to mediate, but Iran\'s preconditions—including a full U.S. military withdrawal from the region—remain a non-starter for Washington.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['XOM', 'CVX', 'COP'],
    metaDescription: 'Brent crude surges past $100 as Iran vows to maintain Strait of Hormuz blockade, choking off 21% of global oil transit and sending energy markets into crisis.',
    seoKeywords: ['oil prices', 'Brent crude', 'Strait of Hormuz', 'Iran blockade', 'energy crisis', 'oil surge', 'IRGC'],
    markets: 'commodities',
    business: 'energy'
  },
  {
    title: 'Three Ships Struck in Persian Gulf as Iran Escalates Shipping Attacks',
    excerpt: 'Iran-linked forces strike three commercial vessels in the Persian Gulf within 24 hours, including a Liberian-flagged oil tanker, escalating maritime hostilities and triggering a surge in global shipping insurance rates.',
    content: [
      {type:'paragraph',content:'Three commercial ships were struck by Iranian-linked forces in the Persian Gulf on Wednesday in the most intense day of maritime attacks since the conflict began, according to the U.S. Fifth Fleet and the United Kingdom Maritime Trade Operations center. A Liberian-flagged crude oil tanker was hit by an anti-ship missile near the Strait of Hormuz, causing a fire in its engine room; a Marshall Islands-registered container ship was damaged by a naval mine; and a Greek-flagged bulk carrier was struck by drone fragments, suffering minor hull damage.'},
      {type:'paragraph',content:'No fatalities were reported among the combined 87 crew members aboard the three vessels, but the attacks mark a dangerous escalation in Iran\'s campaign to disrupt commercial shipping through the world\'s most vital maritime corridor. The U.S. Navy destroyer USS Carney responded to the tanker attack and is escorting the damaged vessel to a safe port in Oman, while commercial salvage operations are underway for the container ship.'},
      {type:'heading',level:2,content:'Shipping Industry Fallout'},
      {type:'paragraph',content:'War risk insurance premiums for vessels transiting the Persian Gulf skyrocketed to 5-7% of hull value, up from 0.5% before the conflict—a cost increase that adds $3-5 million per voyage for large crude carriers. Several major shipping companies, including Maersk, MSC, and Hapag-Lloyd, have suspended all transits through the Strait of Hormuz pending security reassessment, forcing cargo to be rerouted around the Cape of Good Hope at an additional 10-14 days of voyage time.'},
      {type:'paragraph',content:'The Baltic Dry Index, a benchmark for global shipping costs, surged 12% on the news as the combination of rerouted vessels, higher insurance costs, and reduced available capacity tightened the global shipping market. Container shipping rates from Asia to Europe jumped 18% in a single day. "We haven\'t seen this level of disruption to global shipping since the Houthi attacks in the Red Sea, and this is potentially far more severe because the volumes transiting Hormuz dwarf those in the Bab el-Mandeb," said Lars Jensen, CEO of Vespucci Maritime.'},
      {type:'heading',level:2,content:'Military Response'},
      {type:'paragraph',content:'The Pentagon announced the deployment of an additional carrier strike group, led by USS Harry S. Truman, to the Persian Gulf region, bringing the total U.S. naval presence to three carrier groups—the largest concentration of American naval power in the region since the 2003 Iraq invasion. Defense Secretary Pete Hegseth stated that U.S. forces would "take all necessary measures to protect freedom of navigation" but declined to specify whether the U.S. would attempt to forcibly reopen the strait through mine-clearing operations or strikes on Iranian coastal missile batteries.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1524522173746-f628baad3644?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: [],
    metaDescription: 'Three commercial ships struck by Iran-linked forces in Persian Gulf in 24 hours, shipping insurance rates soar as maritime attacks escalate.',
    seoKeywords: ['Persian Gulf', 'shipping attacks', 'Iran', 'maritime security', 'shipping insurance', 'Strait of Hormuz', 'naval conflict'],
    markets: 'commodities',
    business: 'energy'
  },
  {
    title: 'IEA Approves Record 400 Million Barrel Oil Reserve Release, Prices Keep Rising',
    excerpt: 'The International Energy Agency authorizes a historic 400 million barrel coordinated release from strategic petroleum reserves across 31 member nations, but oil prices continue climbing as traders doubt the release can offset the Hormuz blockade.',
    content: [
      {type:'paragraph',content:'The International Energy Agency on Wednesday approved the largest coordinated release of strategic petroleum reserves in its 50-year history, authorizing member nations to collectively release 400 million barrels over the next six months to combat the supply crisis created by Iran\'s blockade of the Strait of Hormuz. The release dwarfs the previous record of 240 million barrels coordinated during the 2022 Russia-Ukraine crisis and involves contributions from all 31 IEA member countries.'},
      {type:'paragraph',content:'Despite the historic scale of the intervention, oil prices barely flinched. Brent crude held above $103 per barrel and WTI remained near $100, as traders calculated that 400 million barrels spread over six months amounts to roughly 2.2 million barrels per day—a fraction of the 17 million barrels per day normally flowing through the Strait of Hormuz. "This is the largest SPR release ever announced, and the market is telling you it\'s not enough," said Amrita Sen, co-founder of Energy Aspects. "You can\'t replace a 17 million barrel per day chokepoint with strategic reserves."'},
      {type:'heading',level:2,content:'Country Contributions'},
      {type:'paragraph',content:'The United States is contributing the largest share with 180 million barrels, drawing its Strategic Petroleum Reserve down to approximately 170 million barrels—the lowest level since 1976 and just 27 days of import cover. Japan is releasing 45 million barrels from its national reserve, Germany 30 million, South Korea 25 million, and France 20 million, with the remaining 100 million barrels spread across 26 other member nations. IEA Executive Director Fatih Birol acknowledged that the release is "a bridge, not a solution," emphasizing that diplomatic resolution of the Hormuz blockade remains essential.'},
      {type:'paragraph',content:'China, which is not an IEA member but holds an estimated 950 million barrels in its own strategic reserves, declined to participate in the coordinated release. Beijing has instead been quietly increasing crude purchases from Russia and Central Asian suppliers connected by overland pipelines, effectively insulating itself from the Hormuz disruption while Western nations deplete their reserves.'},
      {type:'heading',level:2,content:'Market Skepticism'},
      {type:'paragraph',content:'Energy market analysts expressed deep skepticism about the efficacy of the reserve release. "Strategic reserves were designed for short-term supply disruptions of a few weeks, not an open-ended geopolitical blockade," wrote Goldman Sachs commodity strategist Daan Struyven. "At the current drawdown rate, IEA member reserves will be critically depleted within four months, leaving the global economy even more vulnerable if the blockade persists." Goldman maintained its $120 Brent crude forecast for the next 90 days, arguing that the reserve release merely delays rather than prevents the price spike.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: [],
    metaDescription: 'IEA authorizes historic 400M barrel oil reserve release across 31 nations but prices keep climbing as market doubts offset to Hormuz blockade.',
    seoKeywords: ['IEA', 'strategic petroleum reserve', 'SPR release', 'oil reserves', 'oil prices', 'Hormuz blockade', 'energy crisis'],
    markets: 'commodities',
    business: 'economy'
  },
  {
    title: 'Trump Authorizes 172 Million Barrel SPR Release, Largest U.S. Drawdown in History',
    excerpt: 'President Trump orders an emergency release of 172 million barrels from the Strategic Petroleum Reserve, the largest single drawdown in U.S. history, bringing reserve levels to their lowest point since the SPR was created in 1975.',
    content: [
      {type:'paragraph',content:'President Donald Trump signed an executive order on Wednesday authorizing the emergency release of 172 million barrels from the U.S. Strategic Petroleum Reserve, the largest single drawdown in the reserve\'s 51-year history. The release, which will be executed over the next 90 days at a rate of approximately 1.9 million barrels per day, will bring SPR holdings to roughly 175 million barrels—the lowest level since the reserve was established in 1975 following the Arab oil embargo.'},
      {type:'paragraph',content:'"We will not allow the American people to be held hostage by Iranian aggression," Trump stated during a Rose Garden announcement. "This release, combined with our allies\' contributions, will keep gas prices under control while our military works to restore freedom of navigation in the Persian Gulf." The White House projected that the SPR release would shave $0.30-$0.50 per gallon off gasoline prices within 30 days.'},
      {type:'heading',level:2,content:'Political and Strategic Risks'},
      {type:'paragraph',content:'The decision drew immediate criticism from energy security experts and opposition lawmakers who warned that depleting the SPR to near-record lows leaves the United States dangerously exposed to future supply disruptions. Senator Lisa Murkowski (R-AK), ranking member of the Senate Energy Committee, called the drawdown "fiscally irresponsible" and noted that refilling the reserve at current prices would cost taxpayers over $17 billion—more than double what the oil was worth when it was originally purchased.'},
      {type:'paragraph',content:'Former Energy Secretary Ernest Moniz warned that the rapid drawdown could face physical infrastructure constraints. "The SPR caverns in Louisiana and Texas have maximum drawdown rates of approximately 4.4 million barrels per day, and sustaining high flow rates for 90 days risks technical complications including cavern instability and pipeline bottlenecks," Moniz said. The Department of Energy acknowledged the engineering challenges but expressed confidence in achieving the planned release rate.'},
      {type:'heading',level:2,content:'Market Reaction'},
      {type:'paragraph',content:'Oil markets reacted with cautious skepticism, with Brent crude briefly dipping 1.2% on the announcement before recovering to close essentially flat at $103.50. Traders noted that the combined U.S. and IEA releases still fall short of replacing the barrels lost to the Hormuz blockade and questioned the sustainability of drawing reserves to historically low levels. Shares of major oil refiners, including Valero Energy (NYSE: VLO) and Marathon Petroleum (NYSE: MPC), rose 2-3% on expectations that the SPR release would increase crude supply available for domestic refining.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['VLO', 'MPC'],
    metaDescription: 'Trump orders historic 172M barrel SPR release, largest U.S. drawdown ever, bringing reserves to lowest level since 1975 amid Iran crisis.',
    seoKeywords: ['SPR release', 'Strategic Petroleum Reserve', 'Trump', 'oil reserves', 'energy policy', 'Iran crisis', 'crude oil'],
    markets: 'commodities',
    business: 'economy'
  },
  {
    title: 'S&P 500 Slides 1.2% as Oil Rally and Iran Escalation Rattle Wall Street',
    excerpt: 'The S&P 500 drops 1.2% and the Dow sheds 440 points as surging oil prices, fresh shipping attacks in the Persian Gulf, and growing fears of an extended Iran conflict send investors fleeing to safe havens.',
    content: [
      {type:'paragraph',content:'The S&P 500 fell 1.2% on Wednesday to close at 5,372, while the Dow Jones Industrial Average dropped 440 points and the Nasdaq Composite declined 1.5% as a fresh wave of geopolitical anxiety swept through Wall Street. The selling was triggered by Iran\'s escalation of shipping attacks in the Persian Gulf, oil\'s breach of $100 per barrel, and growing consensus among strategists that the conflict will last longer and extract a higher economic toll than previously anticipated.'},
      {type:'paragraph',content:'All 11 S&P 500 sectors finished in negative territory except energy, which gained 2.8% on the oil price surge. Consumer discretionary stocks led the decline, falling 2.4% as investors priced in the impact of higher gasoline prices on household spending. Technology dropped 1.6%, financials fell 1.3%, and industrials declined 1.1%. The CBOE Volatility Index (VIX) jumped 14% to 32.5, its highest level in three weeks, signaling elevated fear in the options market.'},
      {type:'heading',level:2,content:'Defensive Rotation'},
      {type:'paragraph',content:'Investors executed a sharp rotation into defensive assets. Gold surged to a new record above $5,100 per ounce, Treasury bonds rallied with the 10-year yield falling 6 basis points to 4.12%, and the U.S. dollar strengthened 0.4% against a basket of major currencies. Utilities and consumer staples, the market\'s traditional safe havens, outperformed with losses of just 0.3% and 0.4% respectively.'},
      {type:'paragraph',content:'Market breadth was overwhelmingly negative, with declining stocks outnumbering advancers by a 4.5:1 ratio on the NYSE. More than 85% of S&P 500 constituents closed lower, indicating broad-based selling pressure rather than sector-specific weakness. Trading volume surged to 14.2 billion shares, well above the 20-day average of 11.8 billion, suggesting institutional investors were actively reducing risk exposure.'},
      {type:'heading',level:2,content:'Strategist Outlook'},
      {type:'paragraph',content:'Wall Street strategists are increasingly warning that the combination of elevated oil prices and geopolitical uncertainty could push the economy toward recession. Morgan Stanley\'s Mike Wilson cut his S&P 500 year-end target from 5,800 to 5,400, citing "the toxic combination of a supply-side oil shock, consumer spending headwinds, and policy uncertainty." JPMorgan\'s Marko Kolanovic went further, arguing that "if oil sustains above $100 for more than four weeks, the probability of a U.S. recession in the second half of 2026 rises to 55%, up from our current baseline of 30%."'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['SPY', 'QQQ', 'DIA'],
    metaDescription: 'S&P 500 drops 1.2%, Dow sheds 440 points as oil surges past $100 and Iran escalates Persian Gulf shipping attacks, rattling Wall Street.',
    seoKeywords: ['S&P 500', 'stock market', 'Wall Street', 'oil prices', 'Iran conflict', 'market selloff', 'VIX', 'recession risk'],
    markets: 'us-markets',
    business: 'finance'
  },
  {
    title: 'Gold Shatters $5,100 Record as Safe-Haven Demand Surges on War and Job Losses',
    excerpt: 'Gold prices rocket to a new all-time high above $5,100 per ounce as investors pile into the safe-haven metal amid the Iran war escalation, a weakening labor market, and growing fears of stagflation.',
    content: [
      {type:'paragraph',content:'Gold prices shattered records on Wednesday, surging 3.2% to close at $5,127 per ounce—a new all-time high—as a perfect storm of geopolitical chaos, economic anxiety, and central bank uncertainty drove unprecedented safe-haven demand. The precious metal has gained 14% since the Iran conflict began and is now up 28% year-to-date, making it the best-performing major asset class of 2026 by a wide margin.'},
      {type:'paragraph',content:'The rally was fueled by a convergence of bullish catalysts. Iran\'s escalation of shipping attacks in the Persian Gulf sent oil above $100, reigniting inflation fears. The February jobs report showed the U.S. economy lost 92,000 positions, the worst monthly print since the pandemic. And the Federal Reserve faces what economists call an "impossible tradeoff" between fighting inflation and supporting employment, creating the kind of policy uncertainty that historically drives gold demand.'},
      {type:'heading',level:2,content:'Central Bank Buying'},
      {type:'paragraph',content:'Central bank gold purchases have accelerated dramatically during the crisis. The People\'s Bank of China added 18 tonnes in February, its largest monthly purchase in over a year. India\'s Reserve Bank bought 12 tonnes, Turkey acquired 15 tonnes, and Poland added 8 tonnes. Combined central bank buying in the first two months of 2026 reached 185 tonnes, putting the year on pace to exceed the record 1,136 tonnes purchased in 2025.'},
      {type:'paragraph',content:'"Central banks are sending an unmistakable signal: they are diversifying away from dollar-denominated reserves at an accelerating pace," said John Reade, chief market strategist at the World Gold Council. "The Iran conflict has merely intensified a structural trend that was already in place. We see gold reaching $5,500 by mid-year and potentially $6,000 by year-end."'},
      {type:'heading',level:2,content:'Investment Flows'},
      {type:'paragraph',content:'Gold ETFs saw their largest daily inflow since March 2020, with SPDR Gold Shares (GLD) attracting $1.2 billion and iShares Gold Trust (IAU) pulling in $480 million. Total gold ETF holdings surged to 3,350 tonnes, the highest level since 2020. Mining stocks outperformed physical gold, with Newmont Corporation (NYSE: NEM) jumping 5.8%, Barrick Gold (NYSE: GOLD) surging 6.2%, and Agnico Eagle Mines (NYSE: AEM) gaining 7.1% as investors sought leveraged exposure to rising gold prices.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['NEM', 'GOLD', 'AEM'],
    metaDescription: 'Gold shatters $5,100 record high as safe-haven demand surges on Iran war escalation, job losses, and stagflation fears, up 28% in 2026.',
    seoKeywords: ['gold price', 'gold record high', 'safe haven', 'precious metals', 'central bank gold', 'gold ETF', 'war premium'],
    markets: 'commodities',
    business: 'finance'
  },
  {
    title: 'Defense Stocks Surge as Pentagon Races to Restock $5.6 Billion in Depleted Ammunition',
    excerpt: 'Defense contractors rally sharply after the Pentagon reveals it has burned through $5.6 billion in precision-guided munitions during the Iran conflict and urgently needs to accelerate production to replenish depleted stockpiles.',
    content: [
      {type:'paragraph',content:'Defense stocks surged on Wednesday after the Pentagon disclosed that U.S. forces have expended $5.6 billion worth of precision-guided munitions, cruise missiles, and interceptor missiles since the Iran conflict began—a burn rate that has depleted key stockpiles to critically low levels and forced the Department of Defense to issue emergency production acceleration orders to major defense contractors. Lockheed Martin (NYSE: LMT) jumped 4.7%, Raytheon Technologies (NYSE: RTX) gained 5.2%, and Northrop Grumman (NYSE: NOC) rose 3.9%.'},
      {type:'paragraph',content:'Deputy Secretary of Defense Kathleen Hicks revealed in Congressional testimony that stocks of Tomahawk cruise missiles, JASSM-ER air-launched missiles, and Standard Missile-6 interceptors are at their lowest levels in over a decade. "We are consuming precision munitions at a rate that significantly exceeds our current production capacity," Hicks stated. "Without immediate action, we face the risk of degraded readiness for contingencies in other theaters, including the Indo-Pacific."'},
      {type:'heading',level:2,content:'Emergency Production Orders'},
      {type:'paragraph',content:'The Pentagon has issued emergency contracts totaling $8.2 billion to ramp up munitions production, with Raytheon receiving $3.4 billion for Tomahawk and SM-6 missiles, Lockheed Martin getting $2.8 billion for JASSM-ER and LRASM anti-ship missiles, and Northrop Grumman securing $1.5 billion for interceptor components and advanced targeting systems. The contracts include "hot production line" provisions that authorize 24/7 manufacturing operations and the hiring of thousands of additional workers at munitions plants in Alabama, Arkansas, and Arizona.'},
      {type:'paragraph',content:'General Dynamics (NYSE: GD) rose 3.2% on expectations that its ammunition and ordnance division will receive follow-on contracts for conventional munitions, while L3Harris Technologies (NYSE: LHX) gained 2.8% on demand for electronic warfare and reconnaissance systems. Smaller defense contractors also benefited, with AeroVironment (NASDAQ: AVAV) surging 8.1% on demand for its Switchblade loitering munitions.'},
      {type:'heading',level:2,content:'Long-Term Implications'},
      {type:'paragraph',content:'Defense analysts say the Iran conflict has exposed structural vulnerabilities in the U.S. defense industrial base that will take years to address. "The current crisis demonstrates that the defense industrial base was not sized for sustained high-intensity conflict," wrote Roman Schweizer, defense analyst at TD Cowen. "We expect defense spending to increase significantly over the next 3-5 years, with munitions production capacity being the highest priority." Bank of America raised its defense sector rating to "overweight," projecting that defense budgets will grow 6-8% annually through 2030, up from the previous estimate of 3-4%.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['LMT', 'RTX', 'NOC', 'GD', 'LHX'],
    metaDescription: 'Defense stocks surge as Pentagon reveals $5.6B in depleted munitions, issues $8.2B emergency contracts to Lockheed, Raytheon, Northrop to restock.',
    seoKeywords: ['defense stocks', 'Pentagon', 'munitions', 'Lockheed Martin', 'Raytheon', 'military spending', 'defense contracts'],
    markets: 'us-markets',
    business: 'industrial'
  },
  {
    title: 'Stryker Hit by Iran-Linked Cyberattack, First Major U.S. Corporate Target Since War Began',
    excerpt: 'Medical device giant Stryker becomes the first major U.S. corporation targeted by an Iran-linked cyberattack since the conflict began, disrupting surgical systems in hospitals and exposing critical infrastructure vulnerabilities.',
    content: [
      {type:'paragraph',content:'Stryker Corporation (NYSE: SYK), the $130 billion medical device maker, disclosed on Wednesday that it was the target of a sophisticated cyberattack attributed to Iranian state-sponsored hackers, making it the first major U.S. corporation to suffer a significant cyber intrusion directly linked to the ongoing Iran conflict. The attack disrupted networked surgical navigation systems and implant inventory management platforms at an undisclosed number of U.S. hospitals, forcing some facilities to postpone elective surgeries.'},
      {type:'paragraph',content:'Stryker shares fell 4.8% on the disclosure, wiping approximately $6 billion from its market capitalization. The company said in a statement that it detected the intrusion on Tuesday evening and immediately activated incident response protocols, including isolating affected systems, engaging cybersecurity firm CrowdStrike (NASDAQ: CRWD) for forensic investigation, and notifying the FBI and the Cybersecurity and Infrastructure Security Agency (CISA). CrowdStrike shares rose 3.1% on the engagement.'},
      {type:'heading',level:2,content:'Attack Details'},
      {type:'paragraph',content:'Preliminary analysis indicates the attack was conducted by a group tracked by cybersecurity researchers as "Charming Kitten" (also known as APT35), an Iranian hacking group with known ties to the IRGC. The attackers exploited a zero-day vulnerability in a third-party software component used by Stryker\'s Mako robotic-assisted surgery platform, gaining access to hospital networks where the systems are deployed. CISA issued an emergency advisory urging all healthcare facilities using connected surgical systems to implement additional network segmentation measures.'},
      {type:'paragraph',content:'The attack highlights the growing risk of cyber warfare targeting civilian infrastructure during geopolitical conflicts. While Iran has historically focused cyber operations on government and military targets, intelligence officials have warned that the current conflict could escalate into attacks on U.S. critical infrastructure including healthcare, energy, and financial systems.'},
      {type:'heading',level:2,content:'Healthcare Sector Response'},
      {type:'paragraph',content:'The American Hospital Association issued a nationwide alert urging member hospitals to heighten cybersecurity vigilance, particularly for connected medical devices and surgical systems. The broader healthcare sector declined on the news, with the Health Care Select Sector SPDR Fund (XLV) falling 0.7%. Cybersecurity stocks rallied, with Palo Alto Networks (NASDAQ: PANW) gaining 2.4%, Fortinet (NASDAQ: FTNT) rising 1.9%, and SentinelOne (NYSE: S) jumping 3.5% as investors anticipated increased cybersecurity spending by healthcare organizations. "This attack is a wake-up call for the entire healthcare industry," said John Riggi, national advisor for cybersecurity at the American Hospital Association. "Connected medical devices have become the soft underbelly of hospital cybersecurity."'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['SYK', 'CRWD', 'PANW'],
    metaDescription: 'Stryker hit by Iran-linked cyberattack disrupting surgical systems in hospitals, first major U.S. corporate target since conflict began.',
    seoKeywords: ['cyberattack', 'Stryker', 'Iran hackers', 'healthcare cybersecurity', 'cyber warfare', 'medical devices', 'APT35'],
    markets: 'us-markets',
    business: 'tech'
  },
  {
    title: 'February CPI Holds at 2.4% but Iran War Threatens to Reignite Inflation',
    excerpt: 'The Consumer Price Index holds steady at 2.4% year-over-year in February, but economists warn the Iran conflict and surging oil prices could push inflation back above 3% in coming months, complicating the Fed\'s rate-cut timeline.',
    content: [
      {type:'paragraph',content:'The Bureau of Labor Statistics reported Wednesday that the Consumer Price Index rose 2.4% year-over-year in February 2026, matching January\'s reading and coming in slightly below the consensus estimate of 2.5%. Core CPI, which excludes volatile food and energy prices, edged up 2.8% year-over-year, down from 2.9% in January. On a month-over-month basis, headline CPI increased 0.2% while core CPI rose 0.3%.'},
      {type:'paragraph',content:'The report initially provided a brief respite for markets that have been anxious about the inflationary impact of the Iran conflict. However, economists quickly noted that the February data largely predates the surge in oil prices above $100 per barrel that began in the past week, meaning the most significant inflationary impulse from the geopolitical crisis has yet to flow through to consumer prices.'},
      {type:'heading',level:2,content:'Energy Inflation Ahead'},
      {type:'paragraph',content:'"The February CPI is essentially a backward-looking snapshot of a pre-crisis economy," said Kathy Bostjancic, chief U.S. economist at Nationwide. "With oil above $100 and gasoline prices heading toward $4.50, we expect energy to add 0.5-0.8 percentage points to headline CPI over the next two months, pushing the annual rate above 3% by April." Food prices, which rose 2.1% year-over-year in February, are also expected to accelerate as higher diesel costs increase transportation expenses throughout the supply chain.'},
      {type:'paragraph',content:'The shelter component, which has been the most persistent source of inflation, showed tentative signs of moderation, rising 4.8% year-over-year versus 5.0% in January. Rent of primary residence decelerated to 4.3% from 4.5%, and owners\' equivalent rent eased to 5.1% from 5.3%. Economists view the shelter slowdown as encouraging but note it will take several more months to determine whether the trend is durable.'},
      {type:'heading',level:2,content:'Policy Implications'},
      {type:'paragraph',content:'The CPI report complicates the Federal Reserve\'s already-difficult decision ahead of next week\'s FOMC meeting. While the February data supports the case for continued rate cuts to support a weakening labor market, the looming energy-driven inflation surge argues for caution. Fed funds futures shifted modestly after the report, now pricing in a 48% chance of a 25-basis-point cut in March, down from 52% before the data. "The Fed is caught between the backward-looking relief of February CPI and the forward-looking alarm of $100 oil," summarized Mohamed El-Erian, chief economic advisor at Allianz. "This is the definition of stagflation risk—slowing growth and rising prices simultaneously."'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: [],
    metaDescription: 'February CPI holds at 2.4% but economists warn Iran war and $100 oil could push inflation back above 3%, complicating Fed rate-cut plans.',
    seoKeywords: ['CPI', 'inflation', 'consumer prices', 'Federal Reserve', 'oil prices', 'stagflation', 'interest rates'],
    markets: 'bonds',
    business: 'economy'
  },
  {
    title: "Fed Expected to Hold Rates as Oil Shock Clouds Rate-Cut Timeline",
    excerpt: 'Federal Reserve officials signal they will likely hold rates steady at 3.50-3.75% at next week\'s FOMC meeting as the Iran oil shock injects massive uncertainty into the inflation and growth outlook.',
    content: [
      {type:'paragraph',content:'Federal Reserve officials are widely expected to hold the federal funds rate steady at 3.50-3.75% at next week\'s FOMC meeting on March 18-19, as the Iran-driven oil shock has dramatically complicated the central bank\'s rate-cut timeline. Fed funds futures now price in just a 28% probability of a rate cut in March, down from 52% a week ago, as traders acknowledge that the combination of $100 oil and geopolitical uncertainty makes easing nearly impossible despite clear signs of labor market weakness.'},
      {type:'paragraph',content:'Several Fed officials have signaled their inclination to pause in public remarks this week. Governor Christopher Waller stated that "the inflationary implications of the oil supply disruption need to be assessed before we can confidently continue the easing cycle." Cleveland Fed President Loretta Mester echoed the sentiment, noting that "the risk of cutting into an oil-driven inflation spike outweighs the risk of holding rates for one more meeting." Only Chicago Fed President Austan Goolsbee argued for continued easing, warning that "waiting too long to respond to labor market weakness is how soft landings turn into hard landings."'},
      {type:'heading',level:2,content:'The Stagflation Dilemma'},
      {type:'paragraph',content:'The Fed faces the textbook stagflation dilemma that last confronted the institution in the 1970s: an external supply shock that simultaneously raises prices and depresses economic activity. Cutting rates risks fueling inflation; holding risks deepening the economic slowdown. The historical parallel is deeply uncomfortable for Fed officials, as the Fed\'s policy mistakes during the 1970s oil shocks—first cutting too quickly, then being forced into draconian tightening—resulted in two recessions and a decade of economic instability.'},
      {type:'paragraph',content:'Oxford Economics projects that if oil prices sustain above $100 for three months, U.S. GDP growth will decelerate to 0.8% annualized in Q2 and Q3, down from their baseline forecast of 1.6%. Meanwhile, headline inflation would rise to 3.2-3.5%, pushing the Fed further from its 2% target. "The Fed\'s traditional tools are poorly suited for supply-side shocks," wrote Oxford\'s Ryan Sweet. "Rate cuts won\'t bring oil prices down, and rate hikes won\'t fix the Strait of Hormuz."'},
      {type:'heading',level:2,content:'Market Pricing'},
      {type:'paragraph',content:'The Treasury market reflects deep uncertainty about the rate path. The 2-year yield, which is most sensitive to Fed policy expectations, has been trading in a volatile 30-basis-point range this week as traders struggle to price in the competing forces of inflation and recession risk. The yield curve between 2-year and 10-year Treasuries has flattened to just 15 basis points, near inversion territory, which would historically signal elevated recession probability. "The bond market is telling you that the Fed has no good options," said Rick Rieder, CIO of fixed income at BlackRock. "Every path leads to pain for someone—either consumers through higher inflation or workers through higher unemployment."'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: [],
    metaDescription: 'Fed expected to hold rates at 3.50-3.75% as Iran oil shock clouds rate-cut timeline, with stagflation fears growing on Wall Street.',
    seoKeywords: ['Federal Reserve', 'interest rates', 'FOMC', 'rate hold', 'oil shock', 'stagflation', 'monetary policy'],
    markets: 'bonds',
    business: 'finance'
  },
  {
    title: 'Airlines Hike Fares 11% as Jet Fuel Costs Double on Iran Conflict',
    excerpt: 'Major U.S. airlines announce an average 11% fare increase across domestic and international routes as jet fuel prices double from pre-conflict levels, squeezing margins and threatening the post-pandemic travel boom.',
    content: [
      {type:'paragraph',content:'Major U.S. airlines are raising fares by an average of 11% across domestic and international routes as jet fuel costs have doubled from pre-conflict levels, threatening to end the post-pandemic travel boom that has been a bright spot in the U.S. economy. Delta Air Lines (NYSE: DAL) announced the largest increases at 13% for international routes and 9% for domestic flights, while United Airlines (NASDAQ: UAL) raised fares 12% on average and American Airlines (NASDAQ: AAL) hiked prices 10%.'},
      {type:'paragraph',content:'Jet fuel prices have surged to $3.85 per gallon, up from $1.90 before the Iran conflict began, as the Strait of Hormuz blockade disrupts crude oil supply chains. Fuel typically accounts for 25-30% of airline operating costs, but at current prices it is approaching 40%, forcing carriers to choose between passing costs to consumers or absorbing margin-destroying losses. "There is no way to absorb a doubling of our largest input cost without adjusting pricing," said Delta CEO Ed Bastian on a hastily arranged investor call.'},
      {type:'heading',level:2,content:'Demand Impact'},
      {type:'paragraph',content:'Travel demand analysts warn that the fare increases could trigger a meaningful decline in passenger volumes, particularly in price-sensitive leisure travel. Hopper, the travel booking app, reported that domestic airfare searches dropped 18% in the past week as consumers balked at higher prices. International searches fell even more sharply, declining 24% as the combination of higher fares, longer routes (due to Middle East airspace closures), and general geopolitical anxiety discouraged overseas travel.'},
      {type:'paragraph',content:'Budget carriers are being hit even harder than legacy airlines. Spirit Airlines, which emerged from bankruptcy reorganization just three months ago, warned that its ultra-low-cost model is "under severe stress" at current fuel prices. Southwest Airlines (NYSE: LUV) said it is evaluating whether to reduce its summer schedule by 5-8% if fuel prices remain elevated.'},
      {type:'heading',level:2,content:'Stock Market Reaction'},
      {type:'paragraph',content:'Airline stocks fell sharply despite the fare increases, as investors concluded that higher prices will not fully offset the fuel cost surge. The NYSE Arca Airline Index dropped 4.2% on Wednesday, with Delta declining 5.1%, United falling 4.8%, and American losing 6.3%. The selloff reflects concerns that the fare increases will destroy demand faster than they can protect margins. "Airlines are in a no-win situation," wrote Helane Becker, senior analyst at TD Cowen. "If they raise fares enough to cover fuel costs, they kill demand. If they don\'t raise fares enough, they lose money. Either way, earnings estimates need to come down significantly."'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['DAL', 'UAL', 'AAL', 'LUV'],
    metaDescription: 'Airlines hike fares 11% as jet fuel prices double on Iran conflict, threatening post-pandemic travel boom with Delta, United leading increases.',
    seoKeywords: ['airline fares', 'jet fuel prices', 'Delta Air Lines', 'United Airlines', 'travel costs', 'fuel surcharge', 'airline stocks'],
    markets: 'us-markets',
    business: 'consumption'
  },
  {
    title: 'BlackRock Launches Staked Ethereum ETF on Nasdaq, First of Its Kind',
    excerpt: 'BlackRock debuts the iShares Ethereum Staked Trust on Nasdaq, the first U.S. exchange-traded fund that allows investors to earn staking rewards on Ethereum holdings, marking a milestone for institutional crypto adoption.',
    content: [
      {type:'paragraph',content:'BlackRock Inc. (NYSE: BLK) launched the iShares Ethereum Staked Trust (ticker: IETH) on Nasdaq on Wednesday, making it the first U.S. exchange-traded fund to offer investors exposure to both Ethereum price appreciation and staking rewards. The fund opened at $38.50 per share and attracted $340 million in first-day inflows, signaling strong institutional demand for yield-generating crypto products.'},
      {type:'paragraph',content:'The ETF stakes a portion of its Ethereum holdings through institutional-grade validators operated by Coinbase (NASDAQ: COIN), currently generating an annualized staking yield of approximately 3.8%. This yield is passed through to shareholders minus BlackRock\'s 0.30% management fee, giving investors a net yield of roughly 3.5%—competitive with short-term Treasury bills while also providing exposure to Ethereum\'s price upside. Coinbase shares rose 5.2% on the partnership announcement.'},
      {type:'heading',level:2,content:'Regulatory Breakthrough'},
      {type:'paragraph',content:'The launch represents a significant regulatory breakthrough. The SEC had previously blocked staked crypto ETFs under the prior administration, citing concerns about liquidity risks associated with Ethereum\'s unstaking queue, which can take several days during periods of high withdrawal demand. BlackRock addressed these concerns by maintaining a minimum 20% liquid reserve of unstaked ETH that can be sold immediately, and by implementing a tiered redemption mechanism that manages large outflows without destabilizing the staking infrastructure.'},
      {type:'paragraph',content:'SEC Chair Mark Uyeda\'s approval of the product signals a more accommodating stance toward crypto-native features in regulated investment vehicles. "This is the most important crypto ETF development since the spot Bitcoin ETF launch in January 2024," said Matt Hougan, CIO of Bitwise Asset Management. "It establishes the precedent that DeFi yield can be packaged into traditional financial products, which opens the door to a wave of yield-bearing crypto ETFs."'},
      {type:'heading',level:2,content:'Market Impact'},
      {type:'paragraph',content:'Ethereum prices jumped 4.5% to $3,890 on the news, outperforming Bitcoin\'s 1.2% gain as traders anticipated that the staking ETF will drive incremental demand for ETH. The launch also pressured competing fund managers to accelerate their own staked ETH products, with Fidelity, VanEck, and Grayscale all reportedly in late-stage SEC discussions. BlackRock CEO Larry Fink called the product "a natural evolution of our digital assets strategy" and hinted at plans for additional yield-bearing crypto ETFs covering other proof-of-stake networks. "The tokenization of finance is happening faster than most people realize," Fink stated.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['BLK', 'COIN'],
    metaDescription: 'BlackRock launches first staked Ethereum ETF on Nasdaq, offering 3.5% staking yield, attracting $340M in day-one inflows in crypto milestone.',
    seoKeywords: ['BlackRock', 'Ethereum ETF', 'staking', 'crypto ETF', 'IETH', 'Nasdaq', 'institutional crypto'],
    markets: 'crypto',
    business: 'finance'
  },
  {
    title: 'Bitcoin Holds Near $70,000 as Crypto Outperforms Amid Geopolitical Chaos',
    excerpt: 'Bitcoin maintains its position near $70,000 as the cryptocurrency market demonstrates resilience amid geopolitical turmoil, with institutional investors increasingly viewing digital assets as a portfolio diversifier alongside gold.',
    content: [
      {type:'paragraph',content:'Bitcoin held firm near $70,000 on Wednesday, trading at $69,850 despite the broad risk-off sentiment that sent equities lower, as the cryptocurrency market continued to demonstrate surprising resilience amid the geopolitical chaos surrounding the Iran conflict. While the S&P 500 fell 1.2% and global equity markets declined, Bitcoin\'s losses were limited to 0.3%, reinforcing its evolving narrative as a "digital gold" hedge against geopolitical uncertainty.'},
      {type:'paragraph',content:'The relative outperformance has caught the attention of institutional investors. BlackRock\'s iShares Bitcoin Trust (IBIT) recorded $215 million in net inflows on Wednesday—its 15th consecutive day of positive flows—even as equity markets sold off. Fidelity\'s Wise Origin Bitcoin Fund (FBTC) attracted $95 million, and the combined spot Bitcoin ETF complex saw $380 million in net inflows, the largest daily total in three weeks.'},
      {type:'heading',level:2,content:'Safe-Haven Evolution'},
      {type:'paragraph',content:'Crypto strategists argue that Bitcoin\'s behavior during the Iran crisis marks a maturation point for the asset class. "For the first time in a major geopolitical event, Bitcoin is trading more like gold than like a risk asset," said Matt Hougan, CIO of Bitwise Asset Management. "In 2020 during the COVID crash, Bitcoin fell 50% in a day. During the 2022 Russia-Ukraine escalation, it fell 15%. This time, it\'s essentially flat while equities are down significantly. The narrative is shifting in real time."'},
      {type:'paragraph',content:'The correlation between Bitcoin and the S&P 500 has fallen to 0.15 over the past 30 days, the lowest level since early 2023, suggesting genuine decorrelation rather than coincidence. Meanwhile, Bitcoin\'s correlation with gold has risen to 0.45, its highest reading on record. On-chain data shows long-term holders continuing to accumulate, with exchange balances falling to their lowest level since 2017.'},
      {type:'heading',level:2,content:'Altcoin Performance'},
      {type:'paragraph',content:'The broader crypto market was mixed. Ethereum gained 4.5% to $3,890, boosted by BlackRock\'s staked ETF launch. Solana declined 1.8% to $165 on profit-taking. DeFi tokens outperformed, with Aave rising 6.2% and Uniswap gaining 4.8% as on-chain activity surged. Total crypto market capitalization held steady at $2.72 trillion. "Bitcoin is increasingly being institutionalized as a portfolio diversifier alongside gold, real estate, and Treasuries," noted Cathie Wood, CEO of ARK Invest, who reiterated her $1 million Bitcoin price target for 2030. "The Iran crisis is accelerating institutional adoption by demonstrating Bitcoin\'s resilience under geopolitical stress."'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: [],
    metaDescription: 'Bitcoin holds near $70,000 as crypto outperforms equities amid Iran crisis, with spot ETFs seeing $380M inflows and gold correlation at record highs.',
    seoKeywords: ['Bitcoin', 'cryptocurrency', 'BTC', 'digital gold', 'crypto ETF', 'safe haven', 'geopolitical hedge'],
    markets: 'crypto',
    business: 'tech'
  },
  {
    title: 'Nvidia Gains 1.8% on Southeast Asia AI Data Center Expansion',
    excerpt: 'Nvidia rises 1.8% after announcing a $4 billion AI data center expansion across Southeast Asia, partnering with sovereign wealth funds in Singapore, Malaysia, and Thailand to build GPU clusters for the region\'s booming AI market.',
    content: [
      {type:'paragraph',content:'Nvidia Corporation (NASDAQ: NVDA) gained 1.8% on Wednesday to close at $142.50, bucking the broader market selloff, after announcing a $4 billion initiative to build AI data centers across Southeast Asia in partnership with sovereign wealth funds from Singapore, Malaysia, and Thailand. The expansion positions Nvidia to capture a rapidly growing regional AI market that McKinsey estimates will reach $100 billion annually by 2030.'},
      {type:'paragraph',content:'The initiative includes three major projects: a $1.8 billion GPU supercomputing cluster in Singapore developed with GIC (Singapore\'s sovereign wealth fund), a $1.2 billion AI training facility in Johor, Malaysia backed by Khazanah Nasional, and an $800 million inference data center in Bangkok partnered with Thailand\'s Office of the National Digital Economy and Society Commission. All three facilities will be equipped with Nvidia\'s latest Blackwell B200 GPU architecture and connected via high-speed fiber networks.'},
      {type:'heading',level:2,content:'Strategic Rationale'},
      {type:'paragraph',content:'The Southeast Asian expansion addresses several strategic imperatives for Nvidia. The region\'s six largest economies—Indonesia, Thailand, Singapore, Malaysia, Vietnam, and the Philippines—have a combined GDP of $3.6 trillion and are investing aggressively in AI infrastructure as they seek to leapfrog traditional technology development paths. Data sovereignty requirements in many of these countries mandate that AI training and inference occur within national borders, creating demand for locally deployed GPU infrastructure.'},
      {type:'paragraph',content:'CEO Jensen Huang, who visited Singapore last week, described Southeast Asia as "the next great frontier for AI adoption" and noted that the region\'s young, digitally native population of 680 million people represents an enormous market for AI-powered services in healthcare, agriculture, financial services, and education. The expansion also diversifies Nvidia\'s geographic revenue base away from heavy concentration in the U.S. and China.'},
      {type:'heading',level:2,content:'Competitive Landscape'},
      {type:'paragraph',content:'The announcement intensifies competition with Microsoft, Google, and Amazon, all of which have announced significant data center investments in Southeast Asia over the past year. Microsoft committed $2.2 billion in Malaysia, Google pledged $2 billion across the region, and Amazon Web Services is building a $5 billion infrastructure hub in Thailand. Nvidia\'s approach differs by focusing exclusively on AI compute rather than general-purpose cloud services, positioning its facilities as specialized GPU-as-a-service platforms that complement rather than compete with hyperscaler offerings. Analysts at Jefferies raised their Nvidia price target from $165 to $180, citing the Southeast Asian expansion as evidence that "AI infrastructure demand is broadening geographically faster than consensus expects."'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['NVDA'],
    metaDescription: 'Nvidia gains 1.8% on $4B Southeast Asia AI data center expansion with sovereign wealth funds in Singapore, Malaysia, and Thailand.',
    seoKeywords: ['Nvidia', 'AI data center', 'Southeast Asia', 'GPU', 'artificial intelligence', 'Singapore', 'Blackwell'],
    markets: 'us-markets',
    business: 'tech'
  },
  {
    title: 'UNHCR: 3.2 Million Displaced in Iran as Humanitarian Crisis Grows',
    excerpt: 'The UN refugee agency reports that 3.2 million Iranians have been internally displaced by the conflict, creating the Middle East\'s worst humanitarian crisis since the Syrian civil war and straining neighboring countries\' resources.',
    content: [
      {type:'paragraph',content:'The United Nations High Commissioner for Refugees (UNHCR) reported on Wednesday that 3.2 million Iranians have been internally displaced by the ongoing conflict, with an additional 480,000 refugees crossing into neighboring Turkey, Iraq, Pakistan, and Afghanistan. The agency described the situation as the Middle East\'s worst humanitarian crisis since the Syrian civil war, with critical shortages of food, clean water, medical supplies, and shelter in affected regions.'},
      {type:'paragraph',content:'UNHCR High Commissioner Filippo Grandi issued an emergency appeal for $2.8 billion in humanitarian funding, warning that current contributions cover less than 15% of estimated needs. "We are witnessing a catastrophe unfold in real time," Grandi stated during a press conference in Geneva. "The scale of displacement is staggering, and the international community\'s response has been woefully inadequate. Without immediate and massive funding, we face the prospect of preventable deaths from disease, malnutrition, and exposure."'},
      {type:'heading',level:2,content:'Regional Impact'},
      {type:'paragraph',content:'Turkey, which already hosts 3.6 million Syrian refugees, has received the largest share of Iranian refugees at approximately 210,000. Turkish President Recep Tayyip Erdogan warned that his country cannot absorb another major refugee influx without significant international financial support and called on the European Union to honor its commitments under the 2016 EU-Turkey refugee deal. Iraq has received 120,000 Iranian refugees, straining a country still rebuilding from its own decades of conflict and displacement.'},
      {type:'paragraph',content:'The humanitarian crisis has economic implications beyond the immediate region. The World Bank estimates that the conflict has reduced Iran\'s GDP by 18% since hostilities began, destroying critical infrastructure including power plants, water treatment facilities, and transportation networks. Iran\'s rial has collapsed to historic lows, making imported food and medicine unaffordable for millions. Oil exports, which historically funded Iran\'s social safety net, have been largely halted by the conflict and international sanctions.'},
      {type:'heading',level:2,content:'Market Implications'},
      {type:'paragraph',content:'The humanitarian crisis adds another dimension of uncertainty to global markets. Defense and humanitarian logistics companies have seen increased activity, while oil markets remain on edge as the displacement crisis underscores the conflict\'s severity and reduces the probability of a quick resolution. Refugee resettlement agencies and NGOs have warned that the displacement could trigger secondary migration waves toward Europe, potentially reigniting the political tensions that shaped European politics during the 2015 Syrian refugee crisis. "The humanitarian catastrophe in Iran is not just a moral emergency—it\'s an economic and geopolitical event that will reshape the region for years," wrote the Economist Intelligence Unit in a special briefing. "Markets are not yet pricing in the full cost of this conflict."'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: [],
    metaDescription: 'UNHCR reports 3.2 million displaced in Iran, worst Middle East humanitarian crisis since Syria, with $2.8B emergency funding appeal.',
    seoKeywords: ['UNHCR', 'Iran refugees', 'humanitarian crisis', 'displacement', 'Middle East', 'refugee crisis', 'Iran conflict'],
    markets: 'us-markets',
    business: 'economy'
  }
];

async function main() {
  console.log('Creating 15 NEW viral financial articles (Batch 4)...\n');

  // Get required data
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
    return;
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

  // Stagger publishedAt times: Article 0 = 5 hours ago, Article 14 = 20 min ago
  // Each article is ~20 minutes apart
  const baseTime = new Date();

  for (let i = 0; i < articles.length; i++) {
    const articleData = articles[i];
    const slug = generateSlug(articleData.title);

    // Check if article already exists
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
    console.log(`\nDone! Created ${articles.length} NEW viral financial articles (Batch 4)`);
  })
  .catch(e => {
    console.error('\nError:', e);
  })
  .finally(() => prisma.$disconnect());
