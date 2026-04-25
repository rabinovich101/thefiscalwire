/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 100);
}

const NOW = new Date("2026-04-25T08:00:00.000Z");

const ARTICLE_ZONE_TYPES = {
  HERO_FEATURED: [0, 1, 2, 3, 4],
  ARTICLE_GRID: [5, 6, 7, 8, 9],
  TRENDING_SIDEBAR: [10, 11, 12, 13, 14],
};

const articles = [
  {
    title: "IMF Cuts Global Growth to 3.1% as Iran War Turns Oil Shock Into Inflation Test",
    excerpt: "The IMF's April outlook warns that the Middle East war has stopped a global growth upgrade in its tracks, pushing policymakers back into a stagflation debate just as energy markets whipsaw.",
    content: [
      { type: "paragraph", content: `The International Monetary Fund's April World Economic Outlook landed with the force of a market note and a diplomatic cable at once: the global economy is now being priced around war, oil and inflation again. The fund cut its 2026 global growth forecast to 3.1%, warning that the Iran conflict has interrupted what had looked like a cleaner expansion built on resilient demand, easier trade tensions and heavy technology investment.` },
      { type: "paragraph", content: `The downgrade is modest on paper but powerful in context. Before the war shock, IMF economists said the world was positioned for an upgrade. Instead, oil disruption through the Strait of Hormuz has revived inflation fears, tightened financial conditions for importers and created a harder policy mix for central banks that were hoping to guide rates lower.` },
      { type: "heading", level: 2, content: "A War Shock With Uneven Costs" },
      { type: "paragraph", content: `The pressure is not spread evenly. Energy exporters and the United States are better insulated than Asian and emerging-market importers that buy fuel in dollars and have thinner fiscal buffers. For those economies, every week of unstable shipping creates a direct hit to trade balances, currencies and household fuel bills.` },
      { type: "paragraph", content: `The viral market takeaway is simple: the war outlook has become the economic outlook. Investors may still be willing to buy equities when ceasefire headlines improve, but the IMF's message is that the baseline has shifted. Growth is lower, inflation is stickier and the path back to normal now runs through the Persian Gulf.` },
    ],
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=630&fit=crop&q=85",
    readTime: 4,
    relevantTickers: ["SPY", "TLT", "USO", "DXY", "EEM"],
    metaDescription: "The IMF cuts 2026 global growth to 3.1% as the Iran war and oil shock revive inflation and stagflation risks.",
    seoKeywords: ["IMF outlook", "global growth", "Iran war", "oil shock", "inflation"],
    markets: "us-markets",
    business: "economy",
    sourceUrl: "https://www.imf.org/en/publications/weo/issues/2026/04/14/world-economic-outlook-april-2026",
    isFeatured: true,
  },
  {
    title: "Bessent Rules Out New Iran and Russia Oil Waivers as Washington Tightens the Energy Squeeze",
    excerpt: "Treasury Secretary Scott Bessent says the United States does not plan to renew temporary oil waivers for Iran or Russia, raising the stakes for crude supply, sanctions enforcement and vulnerable importers.",
    content: [
      { type: "paragraph", content: `Treasury Secretary Scott Bessent has drawn a hard line under Washington's emergency oil-waiver policy, telling the Associated Press that the United States does not plan to renew a waiver for Russian oil already at sea and that another waiver for Iranian barrels is off the table. The comments landed while global energy markets remain strained by the U.S.-Israeli war in Iran and the unstable status of Strait of Hormuz shipping.` },
      { type: "paragraph", content: `The waiver regime was designed as a pressure valve after crude prices surged above $100 per barrel and poorer importers warned of shortages. Bessent's latest comments suggest the administration now sees the supply shock as manageable enough to re-tighten sanctions, even if the market remains jumpy.` },
      { type: "heading", level: 2, content: "Sanctions Meet Supply Risk" },
      { type: "paragraph", content: `The geopolitical signal is blunt. Washington wants to deny oil revenue to Tehran and Moscow at the same time it is trying to prevent a broader fuel crisis. That balance is fragile because tanker flows, insurance availability and port access can change faster than official policy statements.` },
      { type: "paragraph", content: `For markets, the risk is a renewed sanctions premium in crude. If physical supply tightens while financial traders are still reacting to ceasefire headlines, energy prices could stay volatile even without a full closure of Hormuz. The decision also raises pressure on Asian buyers to find replacement barrels before inventories are drawn down.` },
    ],
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=630&fit=crop&q=85",
    readTime: 4,
    relevantTickers: ["USO", "BNO", "XOM", "CVX", "DXY"],
    metaDescription: "Bessent rules out renewed Iranian and Russian oil waivers as Washington tightens sanctions amid Strait of Hormuz volatility.",
    seoKeywords: ["Scott Bessent", "oil waivers", "Iran sanctions", "Russia oil", "Hormuz"],
    markets: "us-markets",
    business: "politics",
    sourceUrl: "https://apnews.com/article/6e68ed3fed7e02e917002427a1a52881",
    isFeatured: true,
  },
  {
    title: "EU Unlocks $106 Billion Ukraine Loan After Pipeline Deal Breaks Sanctions Deadlock",
    excerpt: "The European Union approved a 90-billion-euro support package for Ukraine and a new Russia sanctions round after Druzhba pipeline repairs ended a months-long standoff with Hungary and Slovakia.",
    content: [
      { type: "paragraph", content: `The European Union has approved a 90-billion-euro, roughly $106 billion, loan package for Ukraine after repairs to the Druzhba pipeline cleared the political blockade that had stalled the aid for months. The package is designed to cover Ukraine's military and economic needs over the next two years and arrived alongside a new round of EU sanctions targeting Russia.` },
      { type: "paragraph", content: `The breakthrough shows how deeply energy logistics now shape wartime finance. Hungary and Slovakia had resisted the package while oil flows through the pipeline were disrupted, turning an infrastructure repair into the key that unlocked one of Europe's most consequential funding decisions of the year.` },
      { type: "heading", level: 2, content: "Aid, Oil and Sanctions Interlock" },
      { type: "paragraph", content: `For Kyiv, the money provides a major liquidity bridge at a moment when defense spending and reconstruction costs remain enormous. For Brussels, the deal demonstrates that unity on Ukraine still depends on keeping energy-exposed member states from feeling cornered by sanctions policy.` },
      { type: "paragraph", content: `The viral angle is the bargain itself: Russian oil transit resumed through Ukraine, and that helped unlock European money and new sanctions against Russia. It is a reminder that in 2026, geopolitical finance rarely moves in a straight line. Pipelines, vetoes and war budgets are now the same story.` },
    ],
    imageUrl: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?w=1200&h=630&fit=crop&q=85",
    readTime: 4,
    relevantTickers: ["VGK", "EWU", "EWI", "EURUSD=X", "USO"],
    metaDescription: "The EU approves a $106 billion Ukraine loan and new Russia sanctions after Druzhba pipeline repairs end a political deadlock.",
    seoKeywords: ["Ukraine loan", "EU sanctions", "Druzhba pipeline", "Russia sanctions", "European Union"],
    markets: "europe-markets",
    business: "politics",
    sourceUrl: "https://apnews.com/article/8ddc0f83e41d4be65b141c833f885eff",
    isFeatured: true,
  },
  {
    title: "Oil Traders Brace for Another Hormuz Whipsaw as Brent Swings on Ceasefire Headlines",
    excerpt: "Brent crude has been jerked lower and higher by conflicting signals from Iran, the United States and shipping channels, leaving energy buyers stuck in a market where diplomacy trades like an options expiry.",
    content: [
      { type: "paragraph", content: `Oil markets are trading less like a commodity curve and more like a live geopolitical referendum. After crude plunged on claims that the Strait of Hormuz was open to commercial shipping, prices snapped back as traders questioned whether tanker traffic could actually normalize before ceasefire deadlines and sanctions decisions changed again.` },
      { type: "paragraph", content: `The Strait of Hormuz handles a huge share of global petroleum cargoes, so even partial disruption can ripple through refiners, airlines, shipping insurers and household fuel prices. Axios and AP reporting over the past week captured the violent price action: sharp drops on reopening claims, fresh jumps when standoffs stranded tankers and renewed anxiety as talks shifted locations.` },
      { type: "heading", level: 2, content: "Physical Oil Versus Paper Optimism" },
      { type: "paragraph", content: `The key tension is between futures traders pricing a diplomatic path and physical buyers needing barrels that can actually move. If vessels are delayed, rerouted or uninsured, spot markets can stay tight even while futures fall on hopeful headlines.` },
      { type: "paragraph", content: `That split matters for inflation. A lower screen price for Brent does not immediately mean cheaper gasoline, lower jet fuel or relief for factories. Until shipping normalizes, consumers and businesses are likely to feel the crisis through delayed, sticky and uneven energy costs.` },
    ],
    imageUrl: "https://images.unsplash.com/photo-1624953587687-daf255b6b80a?w=1200&h=630&fit=crop&q=85",
    readTime: 4,
    relevantTickers: ["USO", "BNO", "XLE", "DAL", "UAL"],
    metaDescription: "Oil traders brace for another Strait of Hormuz whipsaw as Brent crude swings on ceasefire and tanker-flow headlines.",
    seoKeywords: ["oil prices", "Brent crude", "Strait of Hormuz", "ceasefire", "energy markets"],
    markets: "us-markets",
    business: "industrial",
    sourceUrl: "https://www.axios.com/2026/04/17/hormuz-iran-oil-prices",
    isFeatured: true,
  },
  {
    title: "Wall Street Banks Pocket Nearly $50 Billion as War Volatility Becomes a Trading Bonanza",
    excerpt: "Big U.S. lenders turned Iran-war market turbulence into a first-quarter profit surge, with trading desks at JPMorgan, Bank of America, Morgan Stanley, Citi and Goldman riding record activity.",
    content: [
      { type: "paragraph", content: `The same volatility that frightened households and policymakers has turned into a windfall for Wall Street. The largest U.S. banks reported nearly $50 billion in combined first-quarter profit as markets convulsed around the Iran war, oil prices, rate expectations and a rapid rotation between risk assets and havens.` },
      { type: "paragraph", content: `Bank of America said stock-trading revenue jumped 30% from a year earlier, while Morgan Stanley's equity trading revenue climbed 25% and its bond desk also posted a powerful gain. JPMorgan, Goldman Sachs and Citi all benefited from clients repositioning portfolios at high speed.` },
      { type: "heading", level: 2, content: "Volatility Is Revenue" },
      { type: "paragraph", content: `For banks with deep trading franchises, chaos can be profitable. Wide bid-ask spreads, elevated volume and client demand for hedges all feed revenue. The first quarter offered the full menu: oil shock, equity selloff, ceasefire rebound, rates repricing and currency stress.` },
      { type: "paragraph", content: `The risk is that the same forces powering trading desks could later damage loan demand, credit quality and dealmaking. For now, Wall Street has monetized the uncertainty. Main Street is still paying for it at the pump and in inflation expectations.` },
    ],
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop&q=85",
    readTime: 4,
    relevantTickers: ["JPM", "BAC", "MS", "GS", "C"],
    metaDescription: "Major U.S. banks report nearly $50 billion in Q1 profit as Iran-war volatility fuels trading revenue.",
    seoKeywords: ["Wall Street banks", "trading revenue", "JPMorgan", "Bank of America", "Iran war"],
    markets: "us-markets",
    business: "finance",
    sourceUrl: "https://www.theguardian.com/business/2026/apr/15/big-us-banks-profit-iran-war-markets-morgan-stanley-jp-morgan",
  },
  {
    title: "Systematic Funds Buy $86 Billion in Stocks as the Ceasefire Rally Forces a Momentum Flip",
    excerpt: "Goldman Sachs data shows CTAs and other systematic funds bought equities at one of the fastest paces on record, adding $86 billion as global markets bounced from war-driven lows.",
    content: [
      { type: "paragraph", content: `The fastest buyers in the market this month were not stock pickers debating earnings calls. They were systematic funds responding to price signals. Goldman Sachs estimated that CTAs and related algorithmic strategies bought $86 billion of equities over five trading sessions as the ceasefire rebound forced trend models from defensive to bullish.` },
      { type: "paragraph", content: `The buying helps explain why equities recovered so sharply even as oil remained unstable and the IMF warned about slower growth. Once indexes reclaimed key technical levels, mechanical strategies were pushed into the same direction, creating a feedback loop that lifted global stocks.` },
      { type: "heading", level: 2, content: "Momentum Over Macro" },
      { type: "paragraph", content: `The move shows how market structure can overpower headlines in the short run. If trend signals say buy, CTAs buy. If volatility compresses, risk budgets expand. That can pull discretionary investors back into the market even before macro risks are resolved.` },
      { type: "paragraph", content: `The danger is symmetry. The same strategies that add liquidity on the way up can sell quickly if oil spikes again or ceasefire talks fail. For now, the rally has a powerful technical tailwind, but that tailwind is tied to momentum rather than certainty.` },
    ],
    imageUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1200&h=630&fit=crop&q=85",
    readTime: 4,
    relevantTickers: ["SPY", "QQQ", "DIA", "IWM", "GS"],
    metaDescription: "Systematic funds bought $86 billion of equities in five sessions as ceasefire optimism flipped trend-following models bullish.",
    seoKeywords: ["CTA buying", "systematic funds", "Goldman Sachs", "stock rally", "momentum"],
    markets: "us-markets",
    business: "finance",
    sourceUrl: "https://finance.yahoo.com/markets/stocks/articles/systematic-funds-buy-stocks-record-122530261.html",
  },
  {
    title: "Consumer Sentiment Hits Record Low as Iran-War Inflation Fears Reach U.S. Households",
    excerpt: "The University of Michigan sentiment index plunged to 47.6 in early April, the lowest reading on record, as consumers blamed high prices, weaker asset values and the Iran conflict.",
    content: [
      { type: "paragraph", content: `American consumers are not reading the stock rally the same way Wall Street is. The University of Michigan's preliminary April sentiment index fell to 47.6, an 11% drop from March and the lowest reading in the survey's history, as households reacted to higher fuel prices and anxiety over the Iran war.` },
      { type: "paragraph", content: `The detail was bleak. Assessments of personal finances weakened, buying conditions for durable goods and vehicles deteriorated, and inflation fears rose. Survey director Joanne Hsu noted that many open-ended comments blamed the Iran conflict for unfavorable economic changes.` },
      { type: "heading", level: 2, content: "Markets Rally, Households Retreat" },
      { type: "paragraph", content: `The split screen is striking. Equities have bounced on ceasefire hopes and AI earnings strength, while consumers are telling pollsters that the economy feels worse than it did during prior crisis points. Gasoline prices are visible, frequent and psychologically powerful, making the oil shock especially damaging to confidence.` },
      { type: "paragraph", content: `Because most responses were collected before the temporary ceasefire announcement, sentiment could rebound if fuel prices retreat. But the record-low reading is already a warning for retailers, automakers and politicians: households may not spend like the market expects if inflation fear stays this loud.` },
    ],
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop&q=85",
    readTime: 4,
    relevantTickers: ["XLY", "WMT", "TGT", "GM", "F"],
    metaDescription: "U.S. consumer sentiment falls to a record-low 47.6 as Iran-war inflation and high prices pressure households.",
    seoKeywords: ["consumer sentiment", "University of Michigan", "inflation expectations", "Iran war", "gas prices"],
    markets: "us-markets",
    business: "consumption",
    sourceUrl: "https://www.kiplinger.com/investing/economy/this-weeks-economic-calendar",
  },
  {
    title: "Intel Stock Jumps 28% as AI Server Demand Revives the CPU Turnaround Story",
    excerpt: "Intel shares surged after Q1 results beat expectations, with stronger data-center CPU demand and improved fab productivity helping investors look past restructuring charges.",
    content: [
      { type: "paragraph", content: `Intel delivered the kind of quarter that can rewrite a turnaround narrative. Shares jumped about 28% after the company reported first-quarter revenue of roughly $13.6 billion, beating its own outlook as demand for data-center CPUs strengthened and manufacturing output improved.` },
      { type: "paragraph", content: `The company still recorded a large GAAP loss tied to Mobileye goodwill and restructuring charges, but investors focused on the operating signal underneath it: non-GAAP profitability, better supply availability and management commentary that the CPU remains essential in the AI era.` },
      { type: "heading", level: 2, content: "The CPU Fights Back" },
      { type: "paragraph", content: `For two years, the AI trade has been dominated by GPUs, accelerators and high-bandwidth memory. Intel's report suggests that server CPUs are not being left behind. Every AI cluster still needs host processors, networking, storage control and general-purpose compute around the accelerators.` },
      { type: "paragraph", content: `The market reaction also reflects faith in Lip-Bu Tan's execution plan. If Intel can improve node yields while meeting data-center demand, the foundry story becomes easier to finance. The stock move was less about one quarter and more about investors deciding the comeback has evidence now.` },
    ],
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop&q=85",
    readTime: 4,
    relevantTickers: ["INTC", "AMD", "NVDA", "TSM", "SOXX"],
    metaDescription: "Intel stock jumps 28% after Q1 results beat expectations as AI server CPU demand and fab productivity improve.",
    seoKeywords: ["Intel earnings", "INTC stock", "AI server demand", "CPU", "semiconductors"],
    markets: "us-markets",
    business: "tech",
    sourceUrl: "https://download.intel.com/newsroom/2026/earnings/1Q2026-Earnings-Call.pdf",
    isFeatured: true,
  },
  {
    title: "Meta Cuts 8,000 Jobs While AI Capex Swells Toward $135 Billion",
    excerpt: "Meta is laying off around 10% of its workforce as investors pressure Big Tech to fund massive AI infrastructure plans without letting expenses outrun profits.",
    content: [
      { type: "paragraph", content: `Meta told employees it plans to cut roughly 8,000 jobs, about 10% of the company, as it tries to show investors that its huge AI infrastructure program can coexist with expense discipline. The layoffs arrive before the company's April 29 earnings report and follow months of concern that AI capex could pressure margins.` },
      { type: "paragraph", content: `Meta has guided for 2026 capital spending of $115 billion to $135 billion, nearly double last year's level, as it builds data centers, trains frontier models and pushes AI deeper into Facebook, Instagram, WhatsApp and advertising tools.` },
      { type: "heading", level: 2, content: "The New Big Tech Trade" },
      { type: "paragraph", content: `The story is no longer simply whether Big Tech can build powerful AI. It is whether companies can fund the buildout without losing operating leverage. Layoffs have become part of the market script: reduce headcount, automate workflows and redirect savings into chips, power and data centers.` },
      { type: "paragraph", content: `That is why the Meta cuts went viral beyond tech circles. They frame the central labor-market question of the AI cycle: whether productivity gains will create enough new work to offset the roles eliminated while companies race to automate themselves.` },
    ],
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&h=630&fit=crop&q=85",
    readTime: 4,
    relevantTickers: ["META", "GOOGL", "MSFT", "NVDA", "AMZN"],
    metaDescription: "Meta plans to cut about 8,000 jobs as AI capital spending rises toward $135 billion in 2026.",
    seoKeywords: ["Meta layoffs", "AI capex", "Mark Zuckerberg", "Big Tech", "META stock"],
    markets: "us-markets",
    business: "tech",
    sourceUrl: "https://www.axios.com/2026/04/23/meta-layoffs-ai-efficiency-push",
    isFeatured: true,
  },
  {
    title: "Tesla's $25 Billion AI Capex Plan Forces Investors to Rethink the Car Business",
    excerpt: "Tesla posted higher Q1 revenue and profit, but the market focused on rising AI, robotaxi and factory spending as core auto economics looked less dominant than the company's future bets.",
    content: [
      { type: "paragraph", content: `Tesla's first-quarter report gave bulls and bears exactly what they wanted to fight about. Revenue rose to about $22.4 billion and the company remained profitable, but management's plan to lift 2026 capital spending toward $25 billion shifted the focus from cars to AI infrastructure, robotaxis, Optimus and factory expansion.` },
      { type: "paragraph", content: `Investors reacted cautiously because the spending ramp makes Tesla harder to value. If robotaxis and robotics scale, the capex looks like a down payment on a much larger platform. If they do not, shareholders are left with a capital-intensive automaker whose core vehicle margins remain under pressure.` },
      { type: "heading", level: 2, content: "From EV Maker to AI Infrastructure Bet" },
      { type: "paragraph", content: `The quarter highlighted Tesla's identity shift. The company is still judged on deliveries, pricing and automotive revenue, but the valuation increasingly rests on software-like expectations around autonomy and robotics. That creates a mismatch between current earnings and future promises.` },
      { type: "paragraph", content: `The viral market question is whether Tesla deserves to be valued as the owner of an AI mobility network or as an automaker funding expensive experiments. Q1 did not settle that argument. It made it louder.` },
    ],
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&h=630&fit=crop&q=85",
    readTime: 4,
    relevantTickers: ["TSLA", "NVDA", "GOOGL", "UBER", "RIVN"],
    metaDescription: "Tesla's Q1 earnings shift investor focus to a $25 billion 2026 capex plan for AI, robotaxis, robotics and factories.",
    seoKeywords: ["Tesla earnings", "TSLA stock", "AI capex", "robotaxi", "Optimus"],
    markets: "us-markets",
    business: "tech",
    sourceUrl: "https://www.axios.com/2026/04/22/tesla-earnings-elon-musk-ai",
  },
  {
    title: "Bitcoin Holds Near $80,000 as ETF Demand Rebuilds the Institutional Bid",
    excerpt: "Bitcoin is trading like a macro asset again, balancing oil-war risk against renewed ETF demand, stablecoin growth and a stronger institutional infrastructure story.",
    content: [
      { type: "paragraph", content: `Bitcoin has spent the week near the $80,000 area, absorbing geopolitical shocks while investors debate whether ETF demand can keep overpowering macro volatility. The token is no longer moving only on crypto-native catalysts. It is reacting to oil headlines, dollar moves, rate expectations and institutional flow data.` },
      { type: "paragraph", content: `The bullish case is that spot ETF assets and broader brokerage access have rebuilt a structural bid underneath the market. The bearish case is that Bitcoin remains exposed to the same liquidity conditions that pressure growth stocks when oil spikes and inflation expectations rise.` },
      { type: "heading", level: 2, content: "Digital Gold or High-Beta Macro" },
      { type: "paragraph", content: `The answer may be both. In crisis weeks, Bitcoin can catch safe-haven narratives from investors worried about currency debasement and sovereign risk. In selloff weeks, it can still behave like a leveraged technology asset. That dual identity is exactly why the current range has attracted so much attention.` },
      { type: "paragraph", content: `For crypto markets, the next test is whether institutional inflows broaden beyond Bitcoin into ether, Solana and tokenized real-world assets. If they do, the spring rebound becomes a market-structure story. If not, Bitcoin dominance could stay elevated while the rest of crypto struggles for liquidity.` },
    ],
    imageUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1200&h=630&fit=crop&q=85",
    readTime: 4,
    relevantTickers: ["BTC", "ETH", "COIN", "MSTR", "IBIT"],
    metaDescription: "Bitcoin holds near $80,000 as ETF demand, stablecoin growth and geopolitical macro volatility shape crypto trading.",
    seoKeywords: ["Bitcoin price", "Bitcoin ETF", "crypto markets", "institutional demand", "BTC"],
    markets: "crypto",
    business: "finance",
    sourceUrl: "https://sergeytereshkin.com/publications/cryptocurrency-2026-analysis-of-bitcoin-and-digital-assets",
  },
  {
    title: "BlackRock's Staked Ethereum ETF Turns Yield Into the New Crypto Product War",
    excerpt: "The iShares Staked Ethereum Trust gives investors ETF access to ether staking rewards, putting monthly income, custody and liquidity risk at the center of the next institutional crypto cycle.",
    content: [
      { type: "paragraph", content: `BlackRock's iShares Staked Ethereum Trust ETF has made yield the center of the institutional crypto conversation. The fund offers exposure to ether and staking rewards without requiring investors to manage validators, private keys or operational staking mechanics themselves.` },
      { type: "paragraph", content: `The product is important because it changes what a crypto ETF can be. Bitcoin ETFs turned digital assets into a familiar brokerage product. A staked Ethereum ETF adds an income component, forcing advisers and allocators to weigh yield, liquidity sleeves, custody arrangements and protocol risk in a regulated wrapper.` },
      { type: "heading", level: 2, content: "Ethereum's Institutional Pitch Changes" },
      { type: "paragraph", content: `Ethereum has long pitched itself as settlement infrastructure for applications, stablecoins and tokenized assets. Staking ETFs add a second pitch: ether can look more like a productive financial asset, with rewards that resemble a native yield.` },
      { type: "paragraph", content: `That does not remove risk. Staking can create liquidity constraints, validator penalties and operational dependencies. But the creative leap is clear: the ETF market is no longer only about price exposure. It is becoming a competition over what parts of crypto's native economics can be packaged for mainstream portfolios.` },
    ],
    imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&h=630&fit=crop&q=85",
    readTime: 4,
    relevantTickers: ["ETH", "ETHB", "COIN", "BLK", "BTC"],
    metaDescription: "BlackRock's staked Ethereum ETF turns staking yield into the next battleground for institutional crypto products.",
    seoKeywords: ["BlackRock ETHB", "Ethereum ETF", "staking yield", "crypto ETF", "ETH"],
    markets: "crypto",
    business: "finance",
    sourceUrl: "https://www.blackrock.com/us/individual/products/348532/ishares-staked-ethereum-trust-etf",
  },
  {
    title: "KelpDAO's $292 Million Hack Exposes the Off-Chain Weak Spot in DeFi",
    excerpt: "Chainalysis says attackers linked to North Korea's Lazarus Group stole roughly $292 million from KelpDAO by compromising off-chain infrastructure rather than exploiting a smart contract bug.",
    content: [
      { type: "paragraph", content: `The biggest DeFi story of the week was not a bug in a smart contract. It was a failure in the infrastructure around one. Chainalysis says attackers linked to North Korea's Lazarus Group stole roughly $292 million, or 116,500 rsETH, from KelpDAO's LayerZero bridge by compromising RPC nodes and exploiting a single-verifier setup.` },
      { type: "paragraph", content: `The attack tricked the system into releasing funds against a non-existent burn on the source chain. To ordinary on-chain monitoring tools, the transactions looked valid. The weakness was in the cross-chain message verification stack, where off-chain data feeds and failover assumptions became the real attack surface.` },
      { type: "heading", level: 2, content: "A Bridge Lesson for the Whole Market" },
      { type: "paragraph", content: `The exploit spread fear because rsETH was not isolated inside KelpDAO. It was used across lending and liquidity venues, which meant a bridge failure quickly became a collateral-quality problem for other protocols.` },
      { type: "paragraph", content: `The lesson is uncomfortable for DeFi: composability multiplies both innovation and blast radius. Audited smart contracts are not enough when a protocol relies on cross-chain messages, RPC infrastructure and verifier configurations that can fail outside the code users see.` },
    ],
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop&q=85",
    readTime: 4,
    relevantTickers: ["ETH", "AAVE", "LDO", "COIN", "BTC"],
    metaDescription: "KelpDAO's roughly $292 million exploit shows how off-chain bridge infrastructure can become DeFi's weakest link.",
    seoKeywords: ["KelpDAO hack", "Lazarus Group", "DeFi exploit", "LayerZero", "rsETH"],
    markets: "crypto",
    business: "tech",
    sourceUrl: "https://www.chainalysis.com/blog/kelpdao-bridge-exploit-april-2026/",
    isFeatured: true,
  },
  {
    title: "China's Reported U.S. Capital Curbs Signal a New Wall Around AI Startups",
    excerpt: "Reports that Beijing may require approval before top tech firms accept U.S. investment add a fresh layer to AI decoupling, with capital flows joining chips and software controls.",
    content: [
      { type: "paragraph", content: `China is reportedly moving to restrict leading technology companies, including AI startups, from accepting U.S. capital without government approval. If implemented, the measure would push the U.S.-China tech conflict deeper into financing, not just chips, software, cloud access or export controls.` },
      { type: "paragraph", content: `The reported move follows years of tightening rules around sensitive technology on both sides. Washington has limited advanced semiconductor exports and outbound investment in strategic areas, while Beijing has pushed domestic substitution and tighter control over data-heavy industries.` },
      { type: "heading", level: 2, content: "Capital Becomes a Strategic Asset" },
      { type: "paragraph", content: `The important shift is that venture capital itself becomes part of national security policy. AI startups need money, compute and talent at the same time. If cross-border financing is restricted, companies may be forced to choose ecosystems earlier in their life cycle.` },
      { type: "paragraph", content: `For markets, the issue is not only which firms lose funding. It is whether global AI supply chains become less efficient as capital, chips and model development split along geopolitical lines. Decoupling is no longer an abstract risk. It is becoming a term sheet problem.` },
    ],
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=630&fit=crop&q=85",
    readTime: 4,
    relevantTickers: ["BABA", "BIDU", "NVDA", "TSM", "KWEB"],
    metaDescription: "Reported Chinese curbs on U.S. investment in tech firms would put AI startup financing at the center of decoupling.",
    seoKeywords: ["China tech", "U.S. investment", "AI startups", "decoupling", "venture capital"],
    markets: "asia-markets",
    business: "tech",
    sourceUrl: "https://www.reddit.com/r/ArtificialInteligence/comments/1suc2h0/china_to_curb_us_investment_in_tech_companies/",
  },
  {
    title: "IMF Warns Stablecoins Are Becoming Too Important for Regulators to Treat as Crypto Plumbing",
    excerpt: "The IMF's April financial stability report flags stablecoins as a growing payments and market-liquidity channel, raising the pressure for rules, backstops and clearer reserve standards.",
    content: [
      { type: "paragraph", content: `Stablecoins are no longer a side topic in crypto. The IMF's April Global Financial Stability Report treats them as a fast-growing piece of payment and market infrastructure, especially as USDC, tokenized assets and cross-border settlement experiments expand beyond crypto exchanges.` },
      { type: "paragraph", content: `The concern is straightforward: stablecoins can move like money-market instruments, payment rails and shadow-bank liabilities at the same time. Without clear reserve rules, redemption backstops and cross-border supervision, stress in one issuer could travel quickly through trading venues, DeFi protocols and emerging-market payment channels.` },
      { type: "heading", level: 2, content: "Payment Innovation Meets Run Risk" },
      { type: "paragraph", content: `The bullish case is that stablecoins lower settlement costs and make dollar liquidity programmable. The risk case is that they create private money at internet speed, with confidence depending on assets, audits and legal claims that many users do not fully understand.` },
      { type: "paragraph", content: `That is why the topic is going viral with both crypto builders and regulators. The stablecoin market has become too useful to ignore and too large to leave vague. The next phase of crypto regulation may be written less around speculative tokens and more around the dollars moving underneath them.` },
    ],
    imageUrl: "https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=1200&h=630&fit=crop&q=85",
    readTime: 4,
    relevantTickers: ["USDC", "USDT", "COIN", "PYPL", "ETH"],
    metaDescription: "The IMF warns stablecoins are becoming a growing payments and financial-stability channel that needs stronger regulation.",
    seoKeywords: ["stablecoins", "IMF GFSR", "USDC", "crypto regulation", "payments"],
    markets: "crypto",
    business: "economy",
    sourceUrl: "https://www.imf.org/-/media/files/publications/gfsr/2026/april/english/text.pdf",
  },
];

async function getRequiredData() {
  const categories = await prisma.category.findMany({
    select: { id: true, slug: true },
  });
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category.id]));

  const authors = await prisma.author.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  if (authors.length === 0) {
    throw new Error("No authors found. Create at least one author before importing articles.");
  }

  const homepage = await prisma.pageDefinition.findFirst({
    where: {
      isActive: true,
      OR: [{ slug: "homepage" }, { pageType: "HOMEPAGE" }],
    },
    include: {
      zones: {
        where: { isEnabled: true },
        include: {
          zoneDefinition: {
            select: { zoneType: true, slug: true, name: true },
          },
        },
      },
    },
  });

  if (!homepage) {
    throw new Error("Active homepage page definition was not found.");
  }

  const zonesByType = new Map(
    homepage.zones.map((zone) => [zone.zoneDefinition.zoneType, zone])
  );

  for (const zoneType of Object.keys(ARTICLE_ZONE_TYPES)) {
    if (!zonesByType.has(zoneType)) {
      throw new Error(`Homepage zone not found for type: ${zoneType}`);
    }
  }

  return { categoryBySlug, authors, zonesByType };
}

function requireCategory(categoryBySlug, slug) {
  const id = categoryBySlug.get(slug);
  if (!id) {
    throw new Error(`Missing category slug: ${slug}`);
  }
  return id;
}

function createHeadings(content) {
  return content
    .filter((block) => block.type === "heading" && block.content)
    .map((block) => ({
      id: block.content
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-"),
      text: block.content,
      level: block.level || 2,
    }));
}

async function createArticles(requiredData) {
  const createdIds = [];

  for (let i = 0; i < articles.length; i += 1) {
    const item = articles[i];
    const slug = generateSlug(item.title);
    const marketsCategoryId = requireCategory(requiredData.categoryBySlug, item.markets);
    const businessCategoryId = requireCategory(requiredData.categoryBySlug, item.business);
    const authorId = requiredData.authors[i % requiredData.authors.length].id;
    const data = {
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      headings: createHeadings(item.content),
      imageUrl: item.imageUrl,
      publishedAt: new Date(NOW.getTime() + i * 60 * 1000),
      readTime: item.readTime,
      isFeatured: Boolean(item.isFeatured),
      isBreaking: false,
      sourceUrl: item.sourceUrl,
      metaDescription: item.metaDescription,
      seoKeywords: item.seoKeywords,
      isAiEnhanced: true,
      relevantTickers: item.relevantTickers,
      categoryId: marketsCategoryId,
      marketsCategoryId,
      businessCategoryId,
      authorId,
    };

    const existing = await prisma.article.findUnique({ where: { slug } });
    const article = existing
      ? await prisma.article.update({ where: { slug }, data })
      : await prisma.article.create({ data: { slug, ...data } });

    createdIds.push(article.id);
    console.log(`[${existing ? "UPDATE" : "OK"} ${i + 1}/15] ${item.title}`);
  }

  return createdIds;
}

function placementFromArticle(articleId) {
  return {
    contentType: "ARTICLE",
    articleId,
    videoId: null,
    customContent: undefined,
    isPinned: true,
    startDate: null,
    endDate: null,
  };
}

function placementFromExisting(placement) {
  return {
    contentType: placement.contentType,
    articleId: placement.articleId,
    videoId: placement.videoId,
    customContent: placement.customContent === null ? undefined : placement.customContent,
    isPinned: placement.isPinned,
    startDate: placement.startDate,
    endDate: placement.endDate,
  };
}

async function replaceHomepageZone(zone, newArticleIds) {
  const existingPlacements = await prisma.contentPlacement.findMany({
    where: { zoneId: zone.id },
    orderBy: { position: "asc" },
  });

  const originalCount = existingPlacements.length;
  const newArticleIdSet = new Set(newArticleIds);
  const preservedPlacements = existingPlacements
    .filter((placement) => !placement.articleId || !newArticleIdSet.has(placement.articleId))
    .map(placementFromExisting);

  const desiredPlacements = [
    ...newArticleIds.map(placementFromArticle),
    ...preservedPlacements,
  ].slice(0, originalCount);

  await prisma.$transaction(async (tx) => {
    await tx.contentPlacement.deleteMany({ where: { zoneId: zone.id } });

    for (let position = 0; position < desiredPlacements.length; position += 1) {
      const placement = desiredPlacements[position];
      await tx.contentPlacement.create({
        data: {
          zoneId: zone.id,
          contentType: placement.contentType,
          articleId: placement.articleId,
          videoId: placement.videoId,
          customContent: placement.customContent,
          position,
          isPinned: placement.isPinned,
          startDate: placement.startDate,
          endDate: placement.endDate,
        },
      });
    }
  });

  console.log(
    `[PLACED] ${newArticleIds.length} new articles in ${zone.zoneDefinition.name}; homepage zone count preserved at ${desiredPlacements.length}.`
  );
}

async function updateHomepage(createdIds, requiredData) {
  for (const [zoneType, articleIndexes] of Object.entries(ARTICLE_ZONE_TYPES)) {
    const zone = requiredData.zonesByType.get(zoneType);
    const articleIds = articleIndexes.map((index) => createdIds[index]).filter(Boolean);
    await replaceHomepageZone(zone, articleIds);
  }
}

async function main() {
  console.log("Creating April 25, 2026 viral article batch...");

  const requiredData = await getRequiredData();
  const createdIds = await createArticles(requiredData);

  console.log(`Created/found ${createdIds.length} articles. Updating homepage placements...`);
  await updateHomepage(createdIds, requiredData);

  console.log("Done. April 25, 2026 articles are created and homepage counts are preserved.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
