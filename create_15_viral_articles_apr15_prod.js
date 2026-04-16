const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function generateSlug(title) {
  return title.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 100);
}

function normalizeTitle(t) {
  return t.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
}

// PRODUCTION Category IDs
const CATS = {
  'us-markets':     '45e4226e-aba2-43e9-bf36-26e87cc1202a',
  'crypto':         '680d4de9-76be-4dcc-9ea1-bc531fad4f7d',
  'forex':          'fc62c2de-30a3-4829-95db-5c172cd8fc9e',
  'bonds':          '1338c742-6cc7-43c0-ab57-413091668198',
  'etf':            '2d6169e8-487f-4815-80ff-ae4e7cc54dea',
  'europe-markets': '4e9eedfa-3951-42df-9f4f-6b7f86d01623',
  'asia-markets':   '76189dbd-e565-4ed1-8080-53129ba6918c',
  'economy':        '7c2eb944-1494-4b71-877d-103c0da61b54',
  'finance':        '2f4f87a3-f2d2-403b-a335-53135fdc376f',
  'tech':           '38f36d81-fae0-4498-a7cc-974d1b8f5458',
  'health-science': '6d0c4c07-f1b5-4a92-b43e-12cc4b5c2cf2',
  'politics':       '926dfe41-b129-43cd-8976-de89ebb43b4f',
};

// PRODUCTION Author IDs
const AUTHORS = [
  '231f274d-0972-4385-91af-66036e2c3452', // Sarah Chen
  '5b02fd5d-9b07-4408-ba15-b3f6c431ad1d', // Emma Thompson
  '54724a73-80bc-4e24-ab3f-764f3f96f25b', // James Mitchell
  '0fa848ee-7a0b-4f68-9f43-563c787ff1f2', // Alex Rivera
  '42c5a5fa-2338-4cdf-afd5-b15ac4426b4c', // Jennifer Walsh
  '2a02f9a6-c957-4743-9867-32ce7588aae5', // Lisa Park
  '3ebb4fc9-db53-4521-8dde-e40456f090b0', // Michael Torres
  '9e1277f3-2219-4896-89ee-7ebbdfd5d8f9', // David Kim
  '5d1077a2-d62c-4191-9242-f9a229451d84', // Maria Santos
  'ab21b368-357b-4835-90c9-e8568a6e8ca8', // Robert Hayes
];

// 15 NEW viral articles - April 15 2026
const articles = [
  {
    title: 'IMF Slashes Global Growth Forecast to 3.1% as Iran War Hammers World Economy',
    excerpt: 'The International Monetary Fund released its April World Economic Outlook cutting global GDP to 3.1% from 3.3% while warning a prolonged Strait of Hormuz blockade could trigger the worst energy crisis since the 1970s.',
    content: [
      { type: 'paragraph', content: 'The International Monetary Fund on Tuesday cut its 2026 global growth forecast to 3.1%, down from the 3.3% projected in January, citing devastating economic spillover from the U.S.-Iran conflict and the partial closure of the Strait of Hormuz. The revision, released during the IMF-World Bank Spring Meetings in Washington, represents the fund\'s starkest warning yet about the conflict\'s lasting economic damage.' },
      { type: 'paragraph', content: 'IMF Chief Economist Pierre-Olivier Gourinchas told reporters that the world economy was "thrown off track" by an event that was not in any institution\'s baseline scenario at the start of the year. The fund raised its global inflation forecast to 4.4%, a 0.6-point upward revision from January, driven by the 28% surge in oil prices since the conflict began in late February.' },
      { type: 'heading', level: 2, content: 'Regional Forecasts Diverge Sharply' },
      { type: 'paragraph', content: 'The U.S. economy escaped with a modest downgrade to 2.3% from 2.4%, reflecting resilient domestic consumption offset by surging energy prices. The Eurozone bore the brunt with growth now forecast at 1.1%, down sharply from 1.4% in January. Germany faces the most severe impact with its economy forecast to contract by 0.2% in 2026.' },
      { type: 'paragraph', content: 'The Middle East and Central Asia region suffered the steepest cut, with the IMF slashing its 2026 forecast by 2 full percentage points to 1.9%, reflecting direct economic destruction from military operations and infrastructure damage. Sub-Saharan Africa, insulated from direct energy route disruptions, remains relatively stable at 4.3%.' },
      { type: 'heading', level: 2, content: 'Hormuz Blockade Is the Central Risk' },
      { type: 'paragraph', content: 'The fund\'s downside scenario — described as having "meaningful probability" — envisions the Strait remaining closed through the summer. In that case, global growth could fall to 2.4%, oil prices could top $130 per barrel, and global inflation could breach 6%. The IMF called on G20 nations to coordinate emergency fiscal responses.' },
      { type: 'paragraph', content: 'Gourinchas urged negotiators to prioritize a ceasefire, warning that "the longer this conflict persists, the deeper and more durable the damage to the global trading system will be." Financial markets responded with a modest relief rally after the IMF said it does not expect the crisis to trigger a full-blown global recession under its central scenario.' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297a?w=1200&h=630&fit=crop&q=80',
    readTime: 5, relevantTickers: ['SPY', 'EFA', 'VT', 'GLD', 'USO'],
    metaDescription: 'IMF cuts 2026 global growth to 3.1% and raises inflation to 4.4% as Iran war and Hormuz blockade threaten worst energy crisis since 1970s.',
    seoKeywords: ['IMF world economic outlook', 'global growth forecast 2026', 'Iran war economy', 'Strait of Hormuz', 'global inflation'],
    markets: 'us-markets', business: 'economy', authorIndex: 0, isFeatured: true, isBreaking: true,
  },
  {
    title: 'JPMorgan Shatters Records With $16.5 Billion Q1 Profit Despite Cutting Full-Year Guidance',
    excerpt: "America's largest bank posted a 13% jump in net income to $16.49 billion, crushing estimates on surging fixed-income trading and investment banking, but trimmed its 2026 NII outlook by $1.5 billion citing macro uncertainty.",
    content: [
      { type: 'paragraph', content: 'JPMorgan Chase delivered a record quarterly profit on Tuesday, reporting net income of $16.49 billion — up 13% year-over-year — and earnings per share of $5.94, decisively beating the $5.45 consensus estimate. Revenue of $50.54 billion also topped forecasts of $49.17 billion, driven by a powerful surge in trading and investment banking activity that offset mounting credit provisions.' },
      { type: 'paragraph', content: 'CEO Jamie Dimon described the results as "exceptionally strong" but struck a cautionary tone, warning of "significant turbulence ahead" from the Iran conflict, elevated inflation, and persistent geopolitical fragmentation. Shares rose 3.2% on the earnings beat before paring gains as Dimon\'s commentary filtered through trading floors.' },
      { type: 'heading', level: 2, content: 'Trading Desk Steals the Show' },
      { type: 'paragraph', content: 'Fixed income, currency, and commodities trading revenue surged 21% to $7.08 billion — its best quarter since 2020 — as energy price volatility generated enormous client hedging activity. Investment banking fees jumped 28% to $2.88 billion, with JPMorgan capturing market share in both equity and debt underwriting.' },
      { type: 'paragraph', content: 'The consumer banking division showed mixed results: net interest income grew 4%, but credit card charge-off rates edged up to 3.4% from 3.1% a year ago, suggesting high energy prices are beginning to pinch lower-income households. Auto loan delinquencies also ticked higher for the second consecutive quarter.' },
      { type: 'heading', level: 2, content: 'NII Guidance Cut Rattles Income Investors' },
      { type: 'paragraph', content: 'JPMorgan reduced its full-year net interest income guidance from $104.5 billion to approximately $103 billion. CFO Jeremy Barnum cited declining deposit balances and reduced rate-cut expectations as primary drivers. The guidance cut signals that the high-rate tailwind is beginning to fade even as the economy faces mounting headwinds.' },
      { type: 'paragraph', content: 'Analysts at Goldman Sachs and Barclays maintained Outperform ratings on JPM but noted the guidance trim may lead to modest downward revisions across the sector. Bank of America and Wells Fargo report later this week.' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=1200&h=630&fit=crop&q=80',
    readTime: 5, relevantTickers: ['JPM', 'BAC', 'WFC', 'GS', 'C'],
    metaDescription: 'JPMorgan posts record $16.49 billion Q1 profit beating all estimates but cuts 2026 NII guidance to $103 billion amid macro headwinds.',
    seoKeywords: ['JPMorgan earnings', 'JPM Q1 2026', 'bank earnings', 'investment banking revenue', 'Jamie Dimon'],
    markets: 'us-markets', business: 'finance', authorIndex: 1, isFeatured: true, isBreaking: false,
  },
  {
    title: 'Bitcoin Surges Past $75,000 on Iran Peace Optimism as Crypto Market Cap Recovers to $2.6 Trillion',
    excerpt: "Bitcoin climbed 5% to approach $75,000 for the first time since early February as Tehran signals willingness to resume ceasefire talks, triggering a broad rally that lifted Ethereum 8.8% and pushed total crypto market cap to $2.6 trillion.",
    content: [
      { type: 'paragraph', content: 'Bitcoin surged past $75,000 on Tuesday, its highest price since early February, as reports emerged that Iran had signaled renewed willingness to engage in ceasefire negotiations with the United States. The move triggered a broad risk-on rally that pushed total cryptocurrency market capitalization to $2.6 trillion — a 4% single-day gain.' },
      { type: 'paragraph', content: 'Ethereum led the majors with an 8.8% surge, climbing to $2,400 and setting a two-month high. Traders cited a combination of the macro catalyst and strong fundamental developments, including record weekly net inflows into spot Ether ETFs of approximately $187 million for the period ending April 10.' },
      { type: 'heading', level: 2, content: 'Q1 Losses Begin to Reverse' },
      { type: 'paragraph', content: 'The rally comes after a punishing Q1 that saw Bitcoin fall roughly 18%, Ethereum decline more than 30%, and altcoins suffer even deeper losses. The Iran conflict, which erupted in late February, proved a far more powerful headwind than bulls anticipated. Rather than acting as a safe haven, Bitcoin moved in lockstep with equities.' },
      { type: 'paragraph', content: 'Solana posted a 6.3% gain on Tuesday, XRP rose 4.2% to reach $1.35 — a level analysts say is critical resistance ahead of a potential breakout if the Senate CLARITY Act passes its markup vote scheduled for April 16.' },
      { type: 'heading', level: 2, content: 'Long-Term Holders Added During Drawdown' },
      { type: 'paragraph', content: 'Bitcoin ETFs have not yet seen the massive inflow reversal that bulls are hoping for, with spot BTC funds seeing modest net outflows on Monday. Analysts at Bernstein Research expect flows to turn decisively positive once geopolitical uncertainty subsides, maintaining a year-end Bitcoin target of $200,000.' },
      { type: 'paragraph', content: 'On-chain data from Glassnode shows that long-term holders — wallets that have not moved coins in more than 155 days — added to positions during the Q1 drawdown, accumulating at an average cost basis near $65,000. This behavior historically precedes sustained rallies.' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&h=630&fit=crop&q=80',
    readTime: 5, relevantTickers: ['BTC', 'ETH', 'SOL', 'XRP', 'IBIT'],
    metaDescription: 'Bitcoin surges past $75,000 on Iran peace hopes as Ethereum jumps 8.8% and total crypto market cap recovers to $2.6 trillion.',
    seoKeywords: ['Bitcoin price $75000', 'crypto rally April 2026', 'Ethereum price surge', 'crypto market cap', 'Iran peace talks crypto'],
    markets: 'crypto', business: 'finance', authorIndex: 2, isFeatured: true, isBreaking: false,
  },
  {
    title: 'Goldman Sachs Posts Record $17.55 EPS Beat as Equities Trading and Investment Banking Surge 48%',
    excerpt: 'Goldman Sachs reported Q1 net revenues of $17.23 billion and EPS of $17.55, topping estimates, as record equities trading revenue and a 48% leap in investment banking fees demonstrated its ability to monetize market volatility.',
    content: [
      { type: 'paragraph', content: 'Goldman Sachs Group reported first-quarter net revenues of $17.23 billion and net earnings of $5.63 billion, translating to earnings per share of $17.55 — well above the $14.30 consensus estimate — and a return on equity of 19.8%. The results underscore Goldman\'s unique ability to extract value from market chaos.' },
      { type: 'paragraph', content: 'CEO David Solomon told analysts that "markets requiring sophisticated risk management create opportunities for Goldman Sachs." He cautioned however that sustained geopolitical uncertainty could dampen M&A activity in coming quarters as CFOs delay strategic decisions.' },
      { type: 'heading', level: 2, content: 'Equities Desk Posts Historic Quarter' },
      { type: 'paragraph', content: 'Goldman\'s equities trading desk recorded its best quarter in firm history, generating $4.2 billion in revenue as clients scrambled to hedge equity exposures. Energy-linked structured products drove exceptional activity. Investment banking segment posted $2.4 billion in fees, up 48% year-over-year.' },
      { type: 'paragraph', content: 'The fixed income, currencies, and commodities trading desk generated $4.07 billion — respectable in absolute terms but lagging the outsized gains at JPMorgan. Goldman\'s FICC book is more exposed to credit-sensitive assets, which underperformed during the energy shock.' },
      { type: 'heading', level: 2, content: 'Asset Management Builds Momentum' },
      { type: 'paragraph', content: 'Goldman\'s Asset and Wealth Management division reported record assets under supervision of $3.1 trillion, up $180 billion from year-end 2025. Management fees hit a record $2.6 billion for the quarter.' },
      { type: 'paragraph', content: 'Shares rose 2.4% on the results. The stock trades at 1.3x book value, which analysts at Wells Fargo called "undemanding" given the demonstrated earnings power. Goldman\'s CET1 ratio of 14.9% gives it capacity for buybacks and dividends.' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop&q=80',
    readTime: 5, relevantTickers: ['GS', 'MS', 'JPM', 'BAC', 'BLK'],
    metaDescription: 'Goldman Sachs beats Q1 2026 estimates with $17.55 EPS on record equities trading and 48% surge in investment banking fees.',
    seoKeywords: ['Goldman Sachs earnings', 'GS Q1 2026', 'equities trading record', 'investment banking Goldman', 'David Solomon'],
    markets: 'us-markets', business: 'finance', authorIndex: 3, isFeatured: true, isBreaking: false,
  },
  {
    title: 'March CPI Surges to 3.3% on 10.9% Energy Spike, Raising Risk of Persistent Inflation',
    excerpt: 'Consumer prices accelerated sharply in March with the CPI rising 0.9% for the month and 3.3% annually as the Iran conflict drove energy costs up nearly 11%, raising the risk of a sustained inflation resurgence that could keep the Fed on hold indefinitely.',
    content: [
      { type: 'paragraph', content: 'U.S. consumer prices rose more than expected in March, with the Consumer Price Index advancing 0.9% on a seasonally adjusted monthly basis and 3.3% year-over-year — up from 2.4% in February and the highest annual reading since October 2024. The acceleration was overwhelmingly driven by a 10.9% surge in energy costs as the Iran conflict sent gasoline prices to $3.88 per gallon from $2.93 in early February.' },
      { type: 'paragraph', content: 'Core CPI — stripping out food and energy — rose a more moderate 0.3% for the month and 3.1% annually, suggesting the underlying inflationary impulse remains somewhat contained. Services inflation rose 0.2% for the month and 3% annually.' },
      { type: 'heading', level: 2, content: 'Shelter Costs Continue to Cool' },
      { type: 'paragraph', content: 'One bright spot was shelter inflation rising 0.3% monthly and 3% annually — tied for its lowest level since August 2021. The long-awaited cooldown in rent and owners equivalent rent is providing important counterweight to the energy surge.' },
      { type: 'paragraph', content: 'Food-at-home prices rose 0.4% for the month, with elevated transportation costs filtering through supply chains to grocery shelves. Airfares surged 3.1% monthly as carriers passed through jet fuel costs.' },
      { type: 'heading', level: 2, content: 'Market Reprices Rate Cut Expectations' },
      { type: 'paragraph', content: 'Fed funds futures moved to price a 73% chance of no rate cuts in 2026, up from 60% before the report. The March FOMC minutes showed that "many participants judged that rate cuts would be appropriate if inflation declines in line with expectations" — a condition this report makes harder to satisfy.' },
      { type: 'paragraph', content: 'Economists at Deutsche Bank warned that oil above $90 sustained through Q2 could push the year-end CPI print to 4%, forcing the Fed into a choice between accepting above-target inflation or raising rates into an already-slowing economy.' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop&q=80',
    readTime: 5, relevantTickers: ['TIP', 'TLT', 'SHY', 'XLE', 'USO'],
    metaDescription: 'US CPI inflation surges to 3.3% in March as energy prices spike 10.9% from Iran conflict, complicating Federal Reserve rate cut path.',
    seoKeywords: ['CPI inflation March 2026', 'consumer prices', 'energy inflation', 'Federal Reserve rates', 'inflation data'],
    markets: 'bonds', business: 'economy', authorIndex: 4, isFeatured: false, isBreaking: false,
  },
  {
    title: 'Tesla Q1 Deliveries Miss Estimates as EV Demand Softens and Musk Discount Widens in Europe',
    excerpt: "Tesla delivered 336,681 vehicles in Q1 2026 — below the 370,000 consensus estimate — as weakening consumer sentiment, elevated financing costs, and what Wall Street calls the 'Musk Distraction Discount' weigh on sales across key markets.",
    content: [
      { type: 'paragraph', content: 'Tesla reported first-quarter vehicle deliveries of 336,681 units, falling well short of the 370,000 consensus analyst estimate and representing an 8% decline from the prior year comparable quarter. The miss triggered a fresh round of target cuts from analysts arguing that macro headwinds, brand damage from CEO Elon Musk\'s political profile, and intensifying Chinese competition are reshaping the EV market leader\'s position.' },
      { type: 'paragraph', content: 'The production figure of 362,615 vehicles significantly exceeded deliveries, resulting in an unusually large inventory build that analysts say will pressure margins in Q2 as Tesla offers discounts to clear unsold stock.' },
      { type: 'heading', level: 2, content: 'The Musk Distraction Discount' },
      { type: 'paragraph', content: 'Several Wall Street analysts explicitly quantified what they call the "Musk Distraction Discount." In Europe, Tesla registrations declined 40% in Q1 year-over-year, as consumers in Germany, France, and the UK organized boycotts in response to Musk\'s comments supporting far-right political movements.' },
      { type: 'paragraph', content: 'Dan Ives of Wedbush trimmed his price target from $550 to $480 but maintained his Outperform rating, calling the delivery miss a "short-term speed bump" and arguing the Cybercab robotaxi launch expected in Austin by mid-2026 represents a multi-trillion-dollar opportunity.' },
      { type: 'heading', level: 2, content: 'BYD Extends Its Lead in China' },
      { type: 'paragraph', content: 'In China, BYD delivered 1.01 million vehicles in Q1 2026, further extending its lead as the world\'s largest EV manufacturer by volume. BYD\'s Han L and Tang L models, priced below equivalent Tesla models, have captured significant market share with lithium iron phosphate battery chemistry seen as a durable advantage.' },
      { type: 'paragraph', content: 'Looking ahead to Q2, Tesla confirmed the updated Model Y will begin ramping production at all four Gigafactories simultaneously, supporting a sequential delivery recovery. The company reaffirmed its full self-driving timeline.' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&h=630&fit=crop&q=80',
    readTime: 5, relevantTickers: ['TSLA', 'RIVN', 'NIO', 'F', 'GM'],
    metaDescription: "Tesla Q1 deliveries miss at 336,681 units vs 370,000 estimate as EV demand softens and Musk Distraction Discount widens in Europe.",
    seoKeywords: ['Tesla Q1 deliveries 2026', 'Tesla earnings miss', 'Elon Musk Tesla', 'EV market 2026', 'BYD vs Tesla'],
    markets: 'us-markets', business: 'tech', authorIndex: 5, isFeatured: false, isBreaking: false,
  },
  {
    title: "S&P 500 Q1 Earnings Track 12.6% Growth — Could Reach 19% as Season Peaks, Best Since 2021",
    excerpt: "With major banks leading the charge, Q1 2026 earnings season has started strongly with 12.6% blended growth, and historical patterns suggest the final tally could hit 19% — the highest since Q4 2021 — if current trends hold.",
    content: [
      { type: 'paragraph', content: 'The Q1 2026 earnings season has opened with encouraging momentum, with the S&P 500 tracking a blended earnings growth rate of 12.6% based on results reported so far. With the majority of companies yet to report, historical patterns suggest the final growth rate could expand to as high as 19% — which would represent the strongest quarterly earnings growth since Q4 2021.' },
      { type: 'paragraph', content: 'The financial sector set a high bar with JPMorgan and Goldman Sachs both crushing estimates, posting aggregate earnings growth of roughly 17% for the group. The sector\'s ability to monetize volatility through trading and investment banking has made it the standout performer of the crisis period.' },
      { type: 'heading', level: 2, content: 'Energy Sector Positioned for Record Profits' },
      { type: 'paragraph', content: 'Energy companies are expected to deliver the highest earnings growth of any S&P 500 sector, with consensus estimates calling for a 45% year-over-year profit increase as oil prices remain elevated. ExxonMobil and Chevron both report later this month, with Wall Street expecting record quarterly profits on the back of the oil price surge.' },
      { type: 'paragraph', content: 'Technology companies face a more complex picture. The Magnificent Seven enter earnings season after a difficult Q1. Microsoft, Alphabet, and Meta are each expected to report strong revenues, but investor attention will focus on whether AI capital expenditure — projected to exceed $470 billion for the group in 2026 — is beginning to generate proportionate returns.' },
      { type: 'heading', level: 2, content: 'Revenue Quality Matters More Than Beats' },
      { type: 'paragraph', content: 'Strategists at Morgan Stanley warned investors not to chase earnings beats without scrutinizing revenue quality. Companies raising guidance despite macro headwinds will be rewarded, while those meeting numbers but flagging margin pressure from energy costs could see sell-on-the-news reactions.' },
      { type: 'paragraph', content: 'The forward P/E for the S&P 500 stands at 20x based on a four-quarter earnings estimate of $339.22. The earnings yield of 4.97% offers a relatively narrow premium over 10-year Treasury yields of 4.45% — a compressed equity risk premium suggesting any disappointment could trigger meaningful re-rating.' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=630&fit=crop&q=80',
    readTime: 5, relevantTickers: ['SPY', 'QQQ', 'XLE', 'XLF', 'IVV'],
    metaDescription: "S&P 500 Q1 earnings track 12.6% growth with potential to hit 19% — strongest since Q4 2021 — as banks and energy sector outperform.",
    seoKeywords: ['S&P 500 earnings Q1 2026', 'earnings season', 'earnings growth rate', 'FactSet earnings', 'Wall Street earnings'],
    markets: 'us-markets', business: 'economy', authorIndex: 6, isFeatured: false, isBreaking: false,
  },
  {
    title: 'Ethereum ETFs Post Record $187M Weekly Inflow as BlackRock Staked ETH Product Gains Traction',
    excerpt: 'Spot Ether ETFs recorded their strongest week of net inflows since launch, pulling in $187 million in the week ending April 10, as BlackRock ETHB draws institutional allocators seeking yield alongside ETH price exposure.',
    content: [
      { type: 'paragraph', content: 'Spot Ethereum exchange-traded funds recorded net inflows of approximately $187 million in the week ending April 10, their strongest weekly performance since the products were approved in mid-2024. The surge marks a significant reversal from persistent outflows that plagued Ether ETFs through most of Q1 2026, and analysts say the catalyst is BlackRock\'s newly launched iShares Staked Ethereum Trust (ETHB).' },
      { type: 'paragraph', content: 'ETHB stakes between 70% and 95% of its ether holdings via Coinbase Prime, distributing approximately 82% of gross staking rewards — currently running at roughly 3.1% annually — to shareholders on a monthly basis, transforming it from a pure speculative vehicle into a yield-bearing digital asset instrument.' },
      { type: 'heading', level: 2, content: 'SEC Clarification Unlocked Staking' },
      { type: 'paragraph', content: 'The regulatory breakthrough that enabled ETHB came on March 17, when the SEC and CFTC issued a joint interpretive release classifying staking rewards from 16 digital commodities — with Ethereum explicitly included — as non-securities. Chair Paul Atkins\' guidance resolved years of legal ambiguity.' },
      { type: 'paragraph', content: 'Remaining staking amendments from Fidelity, Franklin Templeton, Invesco, 21Shares, and VanEck are expected to clear final regulatory review in Q2 2026. If all pending amendments receive approval, every major spot ETH ETF will offer staking by mid-2026.' },
      { type: 'heading', level: 2, content: 'DeFi Activity Confirms Fundamental Strength' },
      { type: 'paragraph', content: 'Institutional demand for Ethereum is broadening. The staking yield attached to ETHB creates a distinct value proposition for pension funds, endowments, and insurance companies with return obligations that need yield-generating assets.' },
      { type: 'paragraph', content: "Ethereum's total locked value across DeFi protocols rose to $68 billion in the week ending April 14, a 12% increase month-over-month, suggesting on-chain activity is accelerating alongside institutional adoption." },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=1200&h=630&fit=crop&q=80',
    readTime: 5, relevantTickers: ['ETH', 'ETHB', 'ETHA', 'IBIT', 'BTC'],
    metaDescription: 'Ethereum ETFs see record $187M weekly inflows as BlackRock ETHB staked ETH product attracts institutional yield seekers after SEC clarifies staking rules.',
    seoKeywords: ['Ethereum ETF inflows', 'BlackRock ETHB', 'staked Ethereum ETF', 'ETH ETF 2026', 'SEC staking ruling'],
    markets: 'crypto', business: 'finance', authorIndex: 8, isFeatured: false, isBreaking: false,
  },
  {
    title: 'Tariff Shock Hits Corporate Margins as GM Absorbs $3.1B and P&G Flags 5-Point EPS Headwind',
    excerpt: "The sweeping 2026 U.S. tariff regime is landing on corporate income statements, with General Motors absorbing $3.1 billion in costs and Procter & Gamble warning tariffs represent a 5-point drag on core EPS growth this year.",
    content: [
      { type: 'paragraph', content: 'The full economic weight of the Trump administration\'s sweeping tariff program — a 15% universal global tariff enacted via Section 122 emergency declaration in February 2026 — is beginning to land on corporate income statements. General Motors reported that U.S. tariffs cost the company $3.1 billion in 2025 and warned the current year will be far more impactful as the full policy has been in effect for multiple quarters.' },
      { type: 'paragraph', content: 'Procter and Gamble provided what analysts called the most explicit tariff guidance, warning tariffs represent a 5-percentage-point headwind to core EPS growth in fiscal 2026. CFO Andre Schulten said supplier price increases tied to tariffs on intermediate goods were flowing through with a 3-to-6-month lag.' },
      { type: 'heading', level: 2, content: 'Retail and Consumer Staples Hit Hardest' },
      { type: 'paragraph', content: 'Industries with complex global supply chains — retail, consumer packaged goods, automotive, and pharmaceuticals — are navigating the most challenging sourcing environment in a generation. Target and Walmart announced plans to source more goods from Mexico, India, and Vietnam to reduce exposure to China-sourced supply chains facing 25% tariff rates.' },
      { type: 'paragraph', content: 'The consumer is now directly bearing a portion of the cost. Tariff-sensitive categories — electronics, clothing, furniture, and small appliances — are rising at twice the overall CPI rate. A CNBC CFO Council survey found 78% of CFOs do not expect tariff refunds to benefit consumers.' },
      { type: 'heading', level: 2, content: 'Trade Policy Uncertainty Weighs on Capex' },
      { type: 'paragraph', content: 'Bank of America\'s Q2 Global Fund Manager Survey found that "trade war escalation" remained the top tail risk for the third consecutive quarter, with 42% of CFOs delaying planned capital investments until there is greater policy clarity.' },
      { type: 'paragraph', content: 'The Tax Foundation estimates the 2026 tariff regime will reduce after-tax income for the bottom quintile of U.S. households by 3.5%, functioning as one of the most regressive fiscal policy changes in recent history, generating intense political pressure from Republican senators ahead of the midterm cycle.' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=630&fit=crop&q=80',
    readTime: 6, relevantTickers: ['GM', 'PG', 'WMT', 'TGT', 'F'],
    metaDescription: 'US tariffs cost GM $3.1 billion and drag P&G earnings by 5 points as sweeping 2026 trade policy hits corporate margins and consumer prices.',
    seoKeywords: ['US tariffs 2026', 'tariff impact earnings', 'trade war corporate costs', 'General Motors tariffs', 'Procter Gamble tariffs'],
    markets: 'us-markets', business: 'economy', authorIndex: 9, isFeatured: false, isBreaking: false,
  },
  {
    title: 'XRP Climbs to $1.35 as Senate CLARITY Act Markup Vote Looms — Analysts See $1.60 If It Passes',
    excerpt: "Ripple's XRP token rose 4.2% to $1.35 ahead of a pivotal Senate committee vote on the CLARITY Act, which would codify XRP's digital commodity status under permanent federal law — a development analysts say could push the price well above $1.60.",
    content: [
      { type: 'paragraph', content: 'XRP, the native token of the Ripple payment network, rose 4.2% on Tuesday to reach $1.35 as crypto markets broadly rallied on Iran ceasefire optimism and traders positioned ahead of a pivotal legislative event. The Senate Banking Committee is scheduled to vote on the CLARITY Act in its April 16 markup session, and successful advancement would be the most significant regulatory development for XRP since Ripple Labs settled its long-running SEC dispute in 2025.' },
      { type: 'paragraph', content: 'The CLARITY Act, if passed into law, would make XRP\'s status as a digital commodity permanent federal law rather than a regulatory interpretation subject to change with administrations. This legal certainty is the single most important factor for institutional adoption of XRP.' },
      { type: 'heading', level: 2, content: 'Ripple Expands Corporate Treasury Features' },
      { type: 'paragraph', content: 'Ripple announced on April 1 that its Treasury platform launched native XRP and RLUSD stablecoin support, allowing corporate CFOs to hold and manage XRP alongside cash reserves. Ripple has partnerships with over 300 financial institutions across 55 countries using its On-Demand Liquidity product, with transaction volumes growing 40% year-over-year.' },
      { type: 'paragraph', content: 'Ripple CEO Brad Garlinghouse pointed to Latin America, Southeast Asia, and the Middle East as the fastest-growing corridors for cross-border settlement using XRP as a bridge currency.' },
      { type: 'heading', level: 2, content: 'Technical Picture at Critical Juncture' },
      { type: 'paragraph', content: 'Despite Tuesday\'s gains, XRP has had a brutal 2026, posting six consecutive monthly declines through Q1 and shedding roughly 35% from its late-2025 highs. The current $1.35 level represents critical resistance just above the 200-day moving average.' },
      { type: 'paragraph', content: 'Analysts at Galaxy Digital estimate that approval of the CLARITY Act could unlock $5-10 billion in institutional investment flows into XRP within 12 months. The firm raised its XRP year-end target to $2.20 conditional on legislative progress.' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&h=630&fit=crop&q=80',
    readTime: 5, relevantTickers: ['XRP', 'SOL', 'ETH', 'BTC', 'ADA'],
    metaDescription: "XRP gains 4.2% to $1.35 ahead of Senate CLARITY Act vote that could make its digital commodity status permanent law and push price to $1.60+.",
    seoKeywords: ['XRP price 2026', 'CLARITY Act Senate', 'Ripple XRP', 'crypto regulation 2026', 'XRP institutional investment'],
    markets: 'crypto', business: 'finance', authorIndex: 0, isFeatured: false, isBreaking: false,
  },
  {
    title: 'Dollar Index Falls to Six-Week Low as Reserve Share Hits Two-Decade Low of 58.4%',
    excerpt: "The U.S. dollar index slipped to a six-week low as Iran war concerns weigh on the greenback's safe-haven premium, while new IMF data show the dollar's share of global central bank reserves falling to 58.4% — a two-decade low — amid accelerating BRICS payment infrastructure buildout.",
    content: [
      { type: 'paragraph', content: 'The U.S. dollar index retreated to a six-week low on Tuesday, trading around 101.3, as the combination of falling oil prices, Iran ceasefire optimism, and mounting concerns about the long-term fiscal implications of the conflict weighed on the currency. The dollar has had its worst start to a year in decades.' },
      { type: 'paragraph', content: 'The dollar\'s weakness comes alongside fresh IMF data showing the greenback\'s share of global central bank foreign exchange reserves has fallen to 58.4% — a two-decade low — as emerging market central banks diversify into gold, euros, and Chinese renminbi.' },
      { type: 'heading', level: 2, content: 'BRICS Payment Infrastructure Advances' },
      { type: 'paragraph', content: 'The de-dollarization theme received renewed attention as the BRICS bloc continues building out alternative payment infrastructure. The BRICS Pay platform, which uses blockchain technology to enable international transactions in local currencies, is expected to reach full deployment by mid-2026. Iran and Venezuela have already formalized agreements to settle all bilateral trade in non-dollar currencies using the system.' },
      { type: 'paragraph', content: 'The New Development Bank has set a target of conducting 30% of its lending in local currencies by 2026, up from 22% currently. Analysts caution however that meaningful displacement of the dollar remains a long-term structural challenge.' },
      { type: 'heading', level: 2, content: 'Fed Independence Concerns Add Pressure' },
      { type: 'paragraph', content: 'Adding to dollar headwinds is unprecedented uncertainty surrounding Federal Reserve leadership. The DOJ investigation into Chair Powell and stalled Senate confirmation of his nominated successor Kevin Warsh have raised alarm among foreign central bank officials about U.S. monetary policy independence.' },
      { type: 'paragraph', content: 'Euro and Japanese yen strengthened against the dollar, with EUR/USD rising above 1.12 and USD/JPY falling below 148. Currency strategists at HSBC maintained their view that the dollar faces additional downside, with a 12-month EUR/USD target of 1.17.' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=1200&h=630&fit=crop&q=80',
    readTime: 6, relevantTickers: ['DXY', 'UUP', 'FXE', 'FXY', 'GLD'],
    metaDescription: 'Dollar index hits 6-week low as Iran war weighs on safe-haven status and dollar share of global reserves falls to two-decade low of 58.4%.',
    seoKeywords: ['dollar index decline', 'de-dollarization 2026', 'BRICS payment system', 'dollar reserve currency', 'Fed independence dollar'],
    markets: 'forex', business: 'economy', authorIndex: 1, isFeatured: false, isBreaking: false,
  },
  {
    title: 'Big Tech Commits $470 Billion to AI Infrastructure in 2026 as Investors Demand ROI Evidence',
    excerpt: 'Microsoft, Meta, Alphabet, and Amazon are set to spend $470 billion on AI capital expenditure in 2026 — up 34% from 2025 — but the scale is triggering intense scrutiny from shareholders who want concrete evidence the buildout is generating proportionate returns.',
    content: [
      { type: 'paragraph', content: 'The four largest U.S. technology companies — Microsoft, Meta, Alphabet, and Amazon — have collectively committed to approximately $470 billion in capital expenditure in 2026, a 34% year-over-year increase from the $350 billion spent in 2025. The figure dwarfs any previous period of corporate investment in computing infrastructure and is drawing intense scrutiny from institutional shareholders.' },
      { type: 'paragraph', content: 'The strategic narrative has shifted meaningfully. In 2025, the dominant story was "building the brain." The 2026 story is "putting the brain to work," as CEOs argue that the infrastructure phase is nearing completion and revenue generation from AI products is now the primary driver of spending.' },
      { type: 'heading', level: 2, content: 'Microsoft Leads With Azure AI Revenue' },
      { type: 'paragraph', content: 'Microsoft\'s Azure cloud platform is generating the most visible near-term revenue from AI investment, with cloud services accounting for more than $50 billion in quarterly revenue and Azure growing approximately 39% year-over-year.' },
      { type: 'paragraph', content: 'Meta CEO Mark Zuckerberg has committed to spending $115-135 billion on AI-related investment in 2026 alone, and has made a $14.3 billion investment for a 49% stake in Scale AI. Meta\'s advertising business is already showing strong AI-driven targeting improvements supporting pricing power.' },
      { type: 'heading', level: 2, content: 'Investor Patience Being Tested' },
      { type: 'paragraph', content: 'Several major asset managers have asked tech CFOs directly what the expected return on AI infrastructure investment is and how long the payback period will be. Amazon\'s Andy Jassy faced pointed questions at the annual shareholder meeting about the $120 billion in AWS capex projected for 2026.' },
      { type: 'paragraph', content: 'Analysts at AllianceBernstein estimated that Big Tech AI spending would generate $1.20 in additional revenue per dollar of capex over a 5-year horizon — "acceptable but not spectacular." The report warned that if the Iran conflict delays enterprise IT spending decisions, the revenue trajectory could slip before scale benefits are fully realized.' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=630&fit=crop&q=80',
    readTime: 6, relevantTickers: ['MSFT', 'META', 'GOOGL', 'AMZN', 'NVDA'],
    metaDescription: 'Microsoft, Meta, Alphabet, Amazon commit $470 billion to AI infrastructure in 2026 as investor ROI scrutiny intensifies ahead of Q1 earnings.',
    seoKeywords: ['Big Tech AI spending 2026', 'Microsoft AI capex', 'Meta AI investment', 'AI infrastructure spending', 'AI ROI Big Tech'],
    markets: 'us-markets', business: 'tech', authorIndex: 2, isFeatured: false, isBreaking: false,
  },
  {
    title: 'Solana DeFi Volume Hits $57 Billion in March Despite 40% Q1 Price Decline — Undervalued?',
    excerpt: "Despite shedding nearly 40% of its value in Q1 2026, Solana's blockchain recorded $57 billion in DeFi trading volume in March — its second highest month on record — revealing a growing disconnect between network economic activity and token price.",
    content: [
      { type: 'paragraph', content: "Solana's decentralized finance ecosystem recorded $57 billion in trading volume in March 2026, its second-highest monthly figure ever, even as the SOL token shed nearly 40% of its value during the quarter amid the broader crypto market selloff. The divergence between network activity and token price has prompted debate about whether Solana is fundamentally undervalued." },
      { type: 'paragraph', content: "On-chain data from Dune Analytics shows Solana's total daily active addresses averaged 4.2 million in Q1 2026, up 28% year-over-year, while the network processed 1.1 billion transactions in March alone. Transaction costs remain extraordinarily low — averaging less than $0.01 — making Solana the platform of choice for high-frequency on-chain activity." },
      { type: 'heading', level: 2, content: 'Perpetuals Trading Drives Volume Surge' },
      { type: 'paragraph', content: 'The DeFi volume surge was primarily driven by decentralized perpetual futures platforms, with Drift Protocol and Phoenix DEX collectively processing over $38 billion of the March total. The volatility triggered by the Iran conflict actually accelerated on-chain derivatives activity.' },
      { type: 'paragraph', content: "Solana's liquid staking ecosystem continued to grow, with total SOL staked reaching 65% of total supply — a historically high participation rate. Jito's restaking product, launched in February, accumulated over $2 billion in total value locked within six weeks." },
      { type: 'heading', level: 2, content: 'Fundamental-Price Disconnect Creates Opportunity' },
      { type: 'paragraph', content: "Venture capital firm Multicoin Capital argued Solana's current valuation — roughly 12x annualized protocol revenue — is 'the most compelling risk-reward in the crypto market.' Solana's developer count grew 18% year-over-year in Q1 despite the price selloff, a metric that historically leads price recovery by 2-3 quarters." },
      { type: 'paragraph', content: 'SOL rose 6.3% on Tuesday to trade near $120. Analysts at CoinShares set a Q3 2026 target of $180. Solana ETF applications from VanEck and Canary Capital remain pending at the SEC with a decision expected by Q3 2026.' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1200&h=630&fit=crop&q=80',
    readTime: 5, relevantTickers: ['SOL', 'ETH', 'BTC', 'JTO', 'BONK'],
    metaDescription: 'Solana DeFi volume hits $57 billion in March despite 40% Q1 price decline, revealing a growing disconnect between network utility and token price.',
    seoKeywords: ['Solana DeFi volume 2026', 'Solana price rally', 'SOL Q1 2026', 'Solana network activity', 'DeFi Solana'],
    markets: 'crypto', business: 'tech', authorIndex: 3, isFeatured: false, isBreaking: false,
  },
  {
    title: 'Eurozone Growth Slumps to 1.1% as Germany Flirts With Contraction and ECB Eyes Emergency Cuts',
    excerpt: "The IMF downgraded Eurozone GDP growth to 1.1% — with Germany projected to contract — as the Iran war's energy shock amplifies the bloc's structural vulnerabilities, prompting ECB President Lagarde to signal readiness to cut rates if the downturn deepens.",
    content: [
      { type: 'paragraph', content: "The International Monetary Fund's April World Economic Outlook cut Eurozone GDP growth to 1.1% for 2026, down from 1.4% projected in January, with Germany — the bloc's economic engine — now forecast to contract by 0.2%. The revision reflects Europe's acute vulnerability to the Iran war's energy shock." },
      { type: 'paragraph', content: 'ECB President Christine Lagarde, speaking at the IMF Spring Meetings in Washington, signaled the ECB\'s Governing Council would not hesitate to act if downside risks to growth materialized, laying groundwork for potential emergency rate cuts.' },
      { type: 'heading', level: 2, content: "Germany's Industrial Model Under Stress" },
      { type: 'paragraph', content: "Germany's manufacturing sector is bearing the brunt of the crisis. Industrial production fell 1.8% in February driven by energy-intensive industries including chemicals, steel, and automotive manufacturing. Volkswagen and BMW both issued profit warnings in March." },
      { type: 'paragraph', content: 'The Ifo Business Climate Index fell to 85.3 in April from 87.1 in March — its lowest level since the pandemic. Export orders declined for the eighth consecutive month.' },
      { type: 'heading', level: 2, content: 'ECB Faces Dilemma Similar to the Fed' },
      { type: 'paragraph', content: 'Like the Federal Reserve, the ECB finds itself caught between inflation above target — Euro area CPI reached 3.2% in March — and growth weakening rapidly. The market is pricing two 25-basis-point cuts by year-end 2026 if the conflict persists.' },
      { type: 'paragraph', content: 'European equity markets outperformed U.S. stocks on Tuesday, with the Euro Stoxx 50 gaining 1.4%. The pan-European index remains down roughly 8% year-to-date, but fund managers note that European valuations have become historically cheap relative to U.S. equities.' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&h=630&fit=crop&q=80',
    readTime: 5, relevantTickers: ['FEZ', 'EWG', 'VGK', 'EZU', 'HEDJ'],
    metaDescription: 'IMF cuts Eurozone growth to 1.1% with Germany facing contraction as Iran energy shock hits manufacturing and ECB signals potential emergency rate cuts.',
    seoKeywords: ['Eurozone GDP 2026', 'Germany recession 2026', 'ECB rate cuts', 'European economy', 'Euro Stoxx 50'],
    markets: 'europe-markets', business: 'economy', authorIndex: 4, isFeatured: false, isBreaking: false,
  },
  {
    title: 'Private Credit Market Surpasses $3 Trillion as Banks Retreat and Pension Funds Pour In',
    excerpt: 'The private credit industry has crossed the $3 trillion AUM milestone as regional bank pullback from leveraged lending and the hunt for yield drives record allocations from sovereign wealth funds, pension plans, and insurance companies.',
    content: [
      { type: 'paragraph', content: 'The global private credit market surpassed $3 trillion in assets under management in Q1 2026, a milestone that underscores the sweeping structural shift in corporate lending away from traditional bank intermediation toward direct lending funds. The growth has been accelerated by the Iran conflict and macroeconomic uncertainty, which prompted regional banks to tighten lending standards, creating a wider funding gap that private credit managers are eagerly filling.' },
      { type: 'paragraph', content: 'Blackstone Credit and Insurance, Apollo Global Management, and Ares Management collectively reported record fundraising in Q1 2026, with Blackstone alone closing on $32 billion in new private credit capital during the quarter. The three firms now manage a combined $1.1 trillion in credit assets.' },
      { type: 'heading', level: 2, content: 'Institutional Capital Flood Continues' },
      { type: 'paragraph', content: 'Pension funds and insurance companies are driving the majority of new allocations. CalPERS announced in March that it would increase its private credit target allocation from 5% to 8% of its portfolio over the next three years, channeling approximately $15 billion into the asset class.' },
      { type: 'paragraph', content: 'The appeal is straightforward: direct lending funds are generating current yields of 10-12% on senior secured loans to middle-market borrowers, at a time when investment-grade bond yields have declined and equity returns have been volatile.' },
      { type: 'heading', level: 2, content: 'Default Risks Creep Higher' },
      { type: 'paragraph', content: "Moody's warned in its Q1 default monitor that private credit default rates among U.S. middle-market borrowers have risen to 3.8% from 2.1% a year ago, as high interest rates pressure companies with leveraged balance sheets. The opacity of the private credit market could mask developing stress until it crystallizes in actual defaults." },
      { type: 'paragraph', content: 'Federal Reserve officials flagged private credit growth as a systemic risk factor in the most recent Financial Stability Report. The SEC has proposed enhanced disclosure requirements for large private credit managers, with final rules expected in Q3 2026.' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop&q=80',
    readTime: 6, relevantTickers: ['BX', 'APO', 'ARES', 'KKR', 'BAM'],
    metaDescription: 'Private credit market surpasses $3 trillion AUM as banks retreat from leveraged lending and pension funds pour in seeking 10-12% yields.',
    seoKeywords: ['private credit market 2026', 'direct lending $3 trillion', 'Blackstone Apollo credit', 'private credit default risk', 'institutional credit investing'],
    markets: 'bonds', business: 'finance', authorIndex: 7, isFeatured: false, isBreaking: false,
  },
];

async function main() {
  console.log('Starting PRODUCTION article creation - April 15, 2026 batch (15 articles)...\n');

  // Check for existing recent articles to prevent duplicates
  const recentArticles = await prisma.article.findMany({
    where: { createdAt: { gte: new Date(Date.now() - 12 * 60 * 60 * 1000) } },
    select: { title: true },
  });
  const recentTitles = recentArticles.map(a => normalizeTitle(a.title));
  console.log(`Found ${recentTitles.length} articles created in last 12 hours - checking for duplicates...\n`);

  // Reset featured/breaking
  await prisma.article.updateMany({ where: { isFeatured: true }, data: { isFeatured: false } });
  await prisma.article.updateMany({ where: { isBreaking: true }, data: { isBreaking: false } });
  await prisma.breakingNews.updateMany({ where: { isActive: true }, data: { isActive: false } });

  const createdIds = [];

  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];

    // Check for duplicate titles
    const normalizedNew = normalizeTitle(a.title);
    const isDupe = recentTitles.some(existing => {
      const words1 = new Set(normalizedNew.split(' ').filter(w => w.length > 3));
      const words2 = new Set(existing.split(' ').filter(w => w.length > 3));
      if (words1.size === 0) return false;
      const intersection = [...words1].filter(w => words2.has(w)).length;
      return intersection / words1.size > 0.5;
    });

    if (isDupe) {
      console.log(`  WARNING [${i + 1}/15] SKIPPING DUPLICATE: ${a.title.substring(0, 60)}...`);
      continue;
    }

    let slug = generateSlug(a.title);
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-apr15`;

    const marketsCategoryId = CATS[a.markets];
    const businessCategoryId = CATS[a.business];
    if (!marketsCategoryId || !businessCategoryId) {
      console.error(`  ERROR [${i + 1}/15] Unknown category: markets=${a.markets}, business=${a.business}`);
      continue;
    }

    try {
      const article = await prisma.article.create({
        data: {
          title: a.title,
          slug,
          excerpt: a.excerpt,
          content: a.content,
          headings: [],
          imageUrl: a.imageUrl,
          readTime: a.readTime,
          isFeatured: a.isFeatured,
          isBreaking: a.isBreaking,
          relevantTickers: a.relevantTickers,
          metaDescription: a.metaDescription,
          seoKeywords: a.seoKeywords,
          isAiEnhanced: true,
          authorId: AUTHORS[a.authorIndex % AUTHORS.length],
          marketsCategoryId,
          businessCategoryId,
          publishedAt: new Date(),
          categories: {
            connect: [{ id: marketsCategoryId }, { id: businessCategoryId }],
          },
        },
      });

      await prisma.articleAnalysis.create({
        data: {
          articleId: article.id,
          markets: ['US'],
          primarySector: a.business,
          businessType: 'news',
          sentiment: 'neutral',
          aiModel: 'claude-sonnet-4-6',
        },
      });

      if (a.isBreaking) {
        await prisma.breakingNews.create({
          data: { isActive: true, headline: a.title, url: `/article/${slug}` },
        });
      }

      createdIds.push(article.id);
      console.log(`  OK [${i + 1}/15] ${a.title.substring(0, 72)}...`);
    } catch (err) {
      console.error(`  ERROR [${i + 1}/15] ${err.message.substring(0, 120)}`);
    }
  }

  // Push ALL new articles to top of homepage zones
  console.log('\nPushing articles to top of homepage zones...');
  await pushToTopStories(createdIds);

  console.log(`\nDone! Created ${createdIds.length}/15 articles and pushed to top stories.`);
  await prisma.$disconnect();
}

async function pushToTopStories(newArticleIds) {
  if (newArticleIds.length === 0) return;

  const zoneConfigs = [
    { slug: 'hero-featured',    topSlots: 4  },
    { slug: 'article-grid',     topSlots: 6  },
    { slug: 'trending-sidebar', topSlots: 8  },
  ];

  for (const cfg of zoneConfigs) {
    const zone = await prisma.pageZone.findFirst({
      where: {
        zoneDefinition: { slug: cfg.slug },
        page: { slug: 'homepage' },
      },
      include: { placements: { orderBy: { position: 'asc' } } },
    });

    if (!zone) {
      console.log(`  - Zone "${cfg.slug}" not found on homepage.`);
      continue;
    }

    const existingIds = zone.placements
      .map(p => p.articleId)
      .filter(id => id && !newArticleIds.includes(id));

    const combinedIds = [...newArticleIds, ...existingIds].slice(0, cfg.topSlots * 2);

    await prisma.contentPlacement.deleteMany({ where: { zoneId: zone.id } });

    for (let i = 0; i < combinedIds.length; i++) {
      await prisma.contentPlacement.create({
        data: {
          zoneId: zone.id,
          contentType: 'ARTICLE',
          articleId: combinedIds[i],
          position: i,
          isPinned: i < cfg.topSlots,
        },
      });
    }
    console.log(`  OK Zone "${cfg.slug}" - ${newArticleIds.length} new articles pushed to top.`);
  }
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
