import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Stock chart data for articles
const stockChartData = {
  NVDA: [
    { time: "Nov 1", value: 132.50, volume: 45000000 },
    { time: "Nov 4", value: 135.20, volume: 52000000 },
    { time: "Nov 5", value: 138.80, volume: 48000000 },
    { time: "Nov 6", value: 136.40, volume: 41000000 },
    { time: "Nov 7", value: 140.20, volume: 55000000 },
    { time: "Nov 8", value: 139.50, volume: 47000000 },
    { time: "Nov 11", value: 142.80, volume: 51000000 },
    { time: "Nov 12", value: 145.60, volume: 62000000 },
    { time: "Nov 13", value: 143.20, volume: 44000000 },
    { time: "Nov 14", value: 147.90, volume: 58000000 },
    { time: "Nov 15", value: 146.30, volume: 49000000 },
    { time: "Nov 18", value: 149.80, volume: 53000000 },
    { time: "Nov 19", value: 152.40, volume: 67000000 },
    { time: "Nov 20", value: 148.90, volume: 71000000 },
    { time: "Nov 21", value: 145.20, volume: 68000000 },
    { time: "Nov 22", value: 142.62, volume: 54000000 },
  ],
  BTC: [
    { time: "Nov 1", value: 69500, volume: 28000000000 },
    { time: "Nov 4", value: 71200, volume: 32000000000 },
    { time: "Nov 5", value: 74800, volume: 35000000000 },
    { time: "Nov 6", value: 76200, volume: 38000000000 },
    { time: "Nov 7", value: 78500, volume: 42000000000 },
    { time: "Nov 8", value: 77100, volume: 36000000000 },
    { time: "Nov 11", value: 82300, volume: 45000000000 },
    { time: "Nov 12", value: 87600, volume: 52000000000 },
    { time: "Nov 13", value: 89200, volume: 48000000000 },
    { time: "Nov 14", value: 91800, volume: 55000000000 },
    { time: "Nov 15", value: 90400, volume: 47000000000 },
    { time: "Nov 18", value: 93200, volume: 51000000000 },
    { time: "Nov 19", value: 95800, volume: 58000000000 },
    { time: "Nov 20", value: 94200, volume: 49000000000 },
    { time: "Nov 21", value: 96500, volume: 53000000000 },
    { time: "Nov 22", value: 97245, volume: 56000000000 },
  ],
  ETH: [
    { time: "Nov 1", value: 2450, volume: 12000000000 },
    { time: "Nov 4", value: 2520, volume: 14000000000 },
    { time: "Nov 5", value: 2680, volume: 16000000000 },
    { time: "Nov 6", value: 2780, volume: 18000000000 },
    { time: "Nov 7", value: 2920, volume: 20000000000 },
    { time: "Nov 8", value: 2850, volume: 17000000000 },
    { time: "Nov 11", value: 3100, volume: 22000000000 },
    { time: "Nov 12", value: 3280, volume: 25000000000 },
    { time: "Nov 13", value: 3350, volume: 23000000000 },
    { time: "Nov 14", value: 3480, volume: 27000000000 },
    { time: "Nov 15", value: 3420, volume: 24000000000 },
    { time: "Nov 18", value: 3550, volume: 26000000000 },
    { time: "Nov 19", value: 3620, volume: 28000000000 },
    { time: "Nov 20", value: 3580, volume: 25000000000 },
    { time: "Nov 21", value: 3610, volume: 27000000000 },
    { time: "Nov 22", value: 3642, volume: 26000000000 },
  ],
  OIL: [
    { time: "Nov 1", value: 71.20, volume: 850000 },
    { time: "Nov 4", value: 70.80, volume: 920000 },
    { time: "Nov 5", value: 71.50, volume: 880000 },
    { time: "Nov 6", value: 70.20, volume: 950000 },
    { time: "Nov 7", value: 69.80, volume: 1020000 },
    { time: "Nov 8", value: 70.40, volume: 890000 },
    { time: "Nov 11", value: 69.50, volume: 980000 },
    { time: "Nov 12", value: 68.90, volume: 1100000 },
    { time: "Nov 13", value: 69.20, volume: 920000 },
    { time: "Nov 14", value: 68.50, volume: 1050000 },
    { time: "Nov 15", value: 69.00, volume: 900000 },
    { time: "Nov 18", value: 68.20, volume: 1080000 },
    { time: "Nov 19", value: 67.80, volume: 1150000 },
    { time: "Nov 20", value: 68.40, volume: 980000 },
    { time: "Nov 21", value: 68.90, volume: 920000 },
    { time: "Nov 22", value: 68.72, volume: 950000 },
  ],
  AAPL: [
    { time: "Nov 1", value: 225.80, volume: 52000000 },
    { time: "Nov 4", value: 228.50, volume: 58000000 },
    { time: "Nov 5", value: 231.20, volume: 55000000 },
    { time: "Nov 6", value: 229.80, volume: 48000000 },
    { time: "Nov 7", value: 232.40, volume: 62000000 },
    { time: "Nov 8", value: 230.90, volume: 51000000 },
    { time: "Nov 11", value: 234.60, volume: 58000000 },
    { time: "Nov 12", value: 237.80, volume: 65000000 },
    { time: "Nov 13", value: 235.20, volume: 52000000 },
    { time: "Nov 14", value: 238.90, volume: 61000000 },
    { time: "Nov 15", value: 236.40, volume: 54000000 },
    { time: "Nov 18", value: 239.20, volume: 59000000 },
    { time: "Nov 19", value: 241.80, volume: 68000000 },
    { time: "Nov 20", value: 238.50, volume: 72000000 },
    { time: "Nov 21", value: 240.20, volume: 64000000 },
    { time: "Nov 22", value: 242.50, volume: 58000000 },
  ],
  TSLA: [
    { time: "Nov 1", value: 320.50, volume: 95000000 },
    { time: "Nov 4", value: 328.80, volume: 102000000 },
    { time: "Nov 5", value: 335.20, volume: 98000000 },
    { time: "Nov 6", value: 330.40, volume: 88000000 },
    { time: "Nov 7", value: 338.90, volume: 105000000 },
    { time: "Nov 8", value: 342.50, volume: 92000000 },
    { time: "Nov 11", value: 348.20, volume: 108000000 },
    { time: "Nov 12", value: 355.80, volume: 115000000 },
    { time: "Nov 13", value: 350.20, volume: 95000000 },
    { time: "Nov 14", value: 358.40, volume: 110000000 },
    { time: "Nov 15", value: 354.90, volume: 98000000 },
    { time: "Nov 18", value: 360.20, volume: 105000000 },
    { time: "Nov 19", value: 365.80, volume: 118000000 },
    { time: "Nov 20", value: 358.40, volume: 125000000 },
    { time: "Nov 21", value: 355.20, volume: 112000000 },
    { time: "Nov 22", value: 352.56, volume: 102000000 },
  ],
}

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  await prisma.article.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.category.deleteMany()
  await prisma.author.deleteMany()
  await prisma.marketIndex.deleteMany()
  await prisma.video.deleteMany()
  await prisma.breakingNews.deleteMany()

  console.log('📝 Creating authors...')
  const authors = await Promise.all([
    prisma.author.create({
      data: {
        name: 'Sarah Chen',
        avatar: 'https://picsum.photos/seed/sarah/100/100',
        bio: 'Senior Market Analyst covering technology and AI sectors. Former Goldman Sachs researcher.',
      },
    }),
    prisma.author.create({
      data: {
        name: 'Michael Torres',
        avatar: 'https://picsum.photos/seed/michael/100/100',
        bio: 'Cryptocurrency correspondent and blockchain technology expert.',
      },
    }),
    prisma.author.create({
      data: {
        name: 'Jennifer Walsh',
        avatar: 'https://picsum.photos/seed/jennifer/100/100',
        bio: 'Federal Reserve and monetary policy specialist with 15 years of experience.',
      },
    }),
    prisma.author.create({
      data: {
        name: 'David Kim',
        avatar: 'https://picsum.photos/seed/david/100/100',
        bio: 'Technology industry reporter focusing on semiconductors and hardware.',
      },
    }),
    prisma.author.create({
      data: {
        name: 'Robert Hayes',
        avatar: 'https://picsum.photos/seed/robert/100/100',
        bio: 'Energy markets analyst covering oil, gas, and renewable sectors.',
      },
    }),
    prisma.author.create({
      data: {
        name: 'Lisa Park',
        avatar: 'https://picsum.photos/seed/lisa/100/100',
        bio: 'Consumer technology reporter covering Apple, Google, and major tech companies.',
      },
    }),
    prisma.author.create({
      data: {
        name: 'Alex Rivera',
        avatar: 'https://picsum.photos/seed/alex/100/100',
        bio: 'DeFi and Web3 specialist tracking emerging blockchain technologies.',
      },
    }),
    prisma.author.create({
      data: {
        name: 'Maria Santos',
        avatar: 'https://picsum.photos/seed/maria/100/100',
        bio: 'Real estate and housing market correspondent.',
      },
    }),
    prisma.author.create({
      data: {
        name: 'James Mitchell',
        avatar: 'https://picsum.photos/seed/james/100/100',
        bio: 'Chief Investment Strategist and market commentator.',
      },
    }),
    prisma.author.create({
      data: {
        name: 'Emma Thompson',
        avatar: 'https://picsum.photos/seed/emma/100/100',
        bio: 'Electric vehicle and clean energy reporter.',
      },
    }),
  ])

  const authorMap = Object.fromEntries(authors.map((a) => [a.name, a.id]))

  console.log('📂 Creating categories...')
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Markets', slug: 'markets', color: 'bg-blue-600' },
    }),
    prisma.category.create({
      data: { name: 'Tech', slug: 'tech', color: 'bg-purple-600' },
    }),
    prisma.category.create({
      data: { name: 'Crypto', slug: 'crypto', color: 'bg-orange-500' },
    }),
    prisma.category.create({
      data: { name: 'Economy', slug: 'economy', color: 'bg-green-600' },
    }),
    prisma.category.create({
      data: { name: 'Opinion', slug: 'opinion', color: 'bg-gray-600' },
    }),
  ])

  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]))

  console.log('🏷️ Creating tags...')
  const tagNames = [
    'AI', 'Technology', 'S&P 500', 'NVIDIA', 'Semiconductors', 'Bitcoin', 'Cryptocurrency',
    'Institutional Investment', 'ETF', 'Federal Reserve', 'Interest Rates', 'Inflation',
    'Earnings', 'Data Center', 'GPU', 'OPEC', 'Oil', 'Energy', 'Apple', 'iPhone',
    'Machine Learning', 'Ethereum', 'DeFi', 'Protocol', 'Housing', 'Real Estate',
    'Mortgage', 'Investment Strategy', 'Bull Market', 'Tesla', 'EV', 'Cybertruck'
  ]

  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.create({
        data: {
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-'),
        },
      })
    )
  )

  const tagMap = Object.fromEntries(tags.map((t) => [t.name, t.id]))

  console.log('📰 Creating articles...')

  // Article 1: Tech Giants Lead Market Rally
  const article1 = await prisma.article.create({
    data: {
      slug: 'tech-giants-lead-market-rally',
      title: 'Tech Giants Lead Market Rally as AI Investments Surge to Record Highs',
      excerpt: 'Major technology companies posted significant gains on Wednesday as investors pile into artificial intelligence stocks, with semiconductor makers leading the charge. The S&P 500 tech sector rose 2.3% in its best session since October.',
      imageUrl: 'https://picsum.photos/seed/tech-rally/1920/1080',
      readTime: 5,
      isFeatured: true,
      isBreaking: false,
      relevantTickers: ['NVDA', 'AMD', 'MSFT', 'GOOGL'],
      authorId: authorMap['Sarah Chen'],
      categoryId: categoryMap['markets'],
      headings: [
        { id: 'ai-boom', text: 'The AI Investment Boom', level: 2 },
        { id: 'key-players', text: 'Key Players Leading the Charge', level: 2 },
        { id: 'nvidia-analysis', text: 'NVIDIA Performance Analysis', level: 3 },
        { id: 'market-outlook', text: 'Market Outlook for 2025', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'The technology sector delivered its strongest performance in months on Wednesday, with the S&P 500 tech sector surging 2.3% as investors doubled down on artificial intelligence plays. The rally, led by semiconductor giants, signals renewed confidence in the AI narrative despite recent market volatility.',
        },
        {
          type: 'paragraph',
          content: 'Trading volumes reached their highest levels since early October, with over 15 billion shares changing hands on major exchanges. The surge reflects growing institutional conviction that AI-related companies will continue to outperform the broader market through 2025.',
        },
        { type: 'heading', level: 2, content: 'The AI Investment Boom' },
        {
          type: 'paragraph',
          content: 'Artificial intelligence investments have reached unprecedented levels, with corporations worldwide committing over $200 billion to AI infrastructure in 2024 alone. This spending spree shows no signs of slowing down, as companies race to integrate generative AI capabilities into their products and services.',
        },
        {
          type: 'callout',
          content: 'Global AI spending reached $200B+ in 2024, with projections of $500B by 2027',
        },
        {
          type: 'paragraph',
          content: 'The demand for AI computing power has created a supply crunch for high-end GPUs, benefiting manufacturers like NVIDIA and AMD. Data center operators are scrambling to secure capacity, leading to extended wait times for the latest AI accelerators.',
        },
        {
          type: 'paragraph',
          content: 'Microsoft, Amazon, and Google have collectively announced plans to invest over $100 billion in AI infrastructure over the next three years. These investments span data centers, custom silicon, and research and development.',
        },
        { type: 'heading', level: 2, content: 'Key Players Leading the Charge' },
        {
          type: 'paragraph',
          content: 'NVIDIA remains the undisputed leader in AI computing, with its data center revenue growing 279% year-over-year. The company\'s H100 and upcoming B100 chips have become essential components for training large language models and running AI inference workloads.',
        },
        {
          type: 'quote',
          content: 'We\'re seeing demand that exceeds anything we\'ve experienced in our history. The AI revolution is just beginning, and we\'re positioned at the center of it.',
          attribution: 'Jensen Huang, CEO of NVIDIA',
        },
        {
          type: 'paragraph',
          content: 'AMD has also emerged as a serious competitor in the AI chip market. The company\'s MI300X accelerator has gained traction among cloud providers seeking alternatives to NVIDIA\'s dominant GPUs. AMD projects its AI chip revenue could reach $4 billion in 2024.',
        },
        { type: 'heading', level: 3, content: 'NVIDIA Performance Analysis' },
        {
          type: 'paragraph',
          content: 'NVIDIA shares have gained over 200% in the past year, making it one of the best-performing large-cap stocks. The company\'s market capitalization briefly exceeded $1.5 trillion, placing it among the world\'s most valuable companies.',
        },
        {
          type: 'chart',
          chartSymbol: 'NVDA',
          chartData: stockChartData.NVDA,
        },
        {
          type: 'paragraph',
          content: 'Technical analysts note strong support at the 50-day moving average, with resistance near the recent all-time highs. The stock\'s relative strength index (RSI) suggests momentum remains favorable despite elevated valuations.',
        },
        {
          type: 'list',
          items: [
            'NVIDIA: +6.29% ($142.62)',
            'AMD: +3.91% ($138.91)',
            'Microsoft: +1.8% ($378.50)',
            'Google: +2.1% ($152.80)',
          ],
        },
        { type: 'heading', level: 2, content: 'Market Outlook for 2025' },
        {
          type: 'paragraph',
          content: 'Wall Street analysts remain broadly bullish on the AI trade, though valuations have become a concern for some. The sector trades at roughly 30 times forward earnings, compared to 18 times for the broader S&P 500.',
        },
        {
          type: 'paragraph',
          content: 'However, bulls argue that the growth trajectory justifies premium multiples. With AI adoption still in early stages across most industries, the addressable market continues to expand. Enterprise software companies are racing to embed AI features, creating sustained demand for the underlying infrastructure.',
        },
        {
          type: 'callout',
          content: 'Analyst consensus: 78% rate NVDA as "Buy" with an average price target of $165',
        },
        {
          type: 'paragraph',
          content: 'The Federal Reserve\'s pivot toward rate cuts could provide additional tailwinds for growth stocks. Lower interest rates typically benefit high-multiple technology companies by reducing the discount applied to future earnings.',
        },
        {
          type: 'paragraph',
          content: 'Investors should monitor upcoming earnings reports from major tech companies for signals about AI spending trends. Any indication of slowing investment could trigger a sector-wide reassessment, though current evidence points to accelerating adoption.',
        },
      ],
      tags: {
        connect: [
          { id: tagMap['AI'] },
          { id: tagMap['Technology'] },
          { id: tagMap['S&P 500'] },
          { id: tagMap['NVIDIA'] },
          { id: tagMap['Semiconductors'] },
        ],
      },
    },
  })

  // Article 2: Bitcoin Surges Past $97K
  const article2 = await prisma.article.create({
    data: {
      slug: 'bitcoin-surges-past-97k',
      title: 'Bitcoin Surges Past $97K as Institutional Demand Accelerates',
      excerpt: 'Cryptocurrency markets continue their impressive rally as major financial institutions increase their Bitcoin holdings.',
      imageUrl: 'https://picsum.photos/seed/bitcoin-surge/1920/1080',
      readTime: 4,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['BTC', 'ETH', 'COIN', 'MSTR'],
      authorId: authorMap['Michael Torres'],
      categoryId: categoryMap['crypto'],
      headings: [
        { id: 'institutional-wave', text: 'The Institutional Wave', level: 2 },
        { id: 'etf-flows', text: 'ETF Flows Drive Momentum', level: 2 },
        { id: 'price-analysis', text: 'Price Analysis', level: 3 },
        { id: 'road-to-100k', text: 'The Road to $100K', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'Bitcoin has surged past $97,000 for the first time in its history, extending a remarkable rally fueled by institutional adoption and the success of spot Bitcoin ETFs. The world\'s largest cryptocurrency is now within striking distance of the psychologically significant $100,000 level.',
        },
        {
          type: 'paragraph',
          content: 'The latest surge came amid reports that several major pension funds are considering adding Bitcoin to their portfolios. This institutional interest marks a significant shift from just two years ago when many traditional investors dismissed cryptocurrency as too volatile for serious consideration.',
        },
        { type: 'heading', level: 2, content: 'The Institutional Wave' },
        {
          type: 'paragraph',
          content: 'Major financial institutions have dramatically increased their exposure to Bitcoin over the past year. Asset managers now hold over 1 million BTC through various investment vehicles, representing approximately 5% of the total supply.',
        },
        {
          type: 'callout',
          content: 'Institutional investors now hold over 1 million BTC worth approximately $97 billion',
        },
        {
          type: 'paragraph',
          content: 'MicroStrategy, led by Bitcoin advocate Michael Saylor, continues to accumulate coins aggressively. The company now holds over 150,000 BTC, making it the largest corporate holder of Bitcoin globally.',
        },
        {
          type: 'quote',
          content: 'Bitcoin has proven itself as a legitimate asset class. We\'re allocating a portion of our portfolio to digital assets as part of our diversification strategy.',
          attribution: 'BlackRock CEO Larry Fink',
        },
        { type: 'heading', level: 2, content: 'ETF Flows Drive Momentum' },
        {
          type: 'paragraph',
          content: 'The launch of spot Bitcoin ETFs in January 2024 marked a turning point for cryptocurrency adoption. These products have attracted over $50 billion in net inflows, with BlackRock\'s IBIT leading the pack.',
        },
        {
          type: 'paragraph',
          content: 'Daily trading volumes in Bitcoin ETFs regularly exceed $1 billion, providing liquidity that was previously unavailable to traditional investors. This accessibility has opened Bitcoin to a new class of buyers who prefer regulated investment products.',
        },
        { type: 'heading', level: 3, content: 'Price Analysis' },
        {
          type: 'chart',
          chartSymbol: 'BTC',
          chartData: stockChartData.BTC,
        },
        {
          type: 'paragraph',
          content: 'Bitcoin\'s price action shows a clear uptrend with higher highs and higher lows. The cryptocurrency has successfully broken through multiple resistance levels, with strong buying pressure on any dips.',
        },
        {
          type: 'paragraph',
          content: 'On-chain metrics remain bullish, with long-term holders continuing to accumulate. The realized price—measuring the average cost basis of all Bitcoin—sits around $28,000, suggesting most holders are in significant profit.',
        },
        { type: 'heading', level: 2, content: 'The Road to $100K' },
        {
          type: 'paragraph',
          content: 'Market analysts are increasingly confident that Bitcoin will breach $100,000 before year-end. The combination of institutional demand, limited supply due to the April 2024 halving, and improving regulatory clarity creates a favorable backdrop.',
        },
        {
          type: 'list',
          items: [
            'Spot ETF inflows: $50B+ since January',
            'Post-halving supply reduction: 50%',
            'Active addresses: All-time high',
            'Miner revenue: Stabilizing after halving',
          ],
        },
        {
          type: 'paragraph',
          content: 'However, traders should remain cautious about potential volatility. Bitcoin has historically experienced sharp corrections even during bull markets, and leveraged positions remain elevated across major exchanges.',
        },
        {
          type: 'paragraph',
          content: 'The regulatory environment continues to evolve, with the SEC taking a more measured approach under new leadership. Clear guidelines for cryptocurrency custody and trading could unlock additional institutional capital.',
        },
      ],
      tags: {
        connect: [
          { id: tagMap['Bitcoin'] },
          { id: tagMap['Cryptocurrency'] },
          { id: tagMap['Institutional Investment'] },
          { id: tagMap['ETF'] },
        ],
      },
    },
  })

  // Article 3: Fed Minutes Reveal Divided Opinion
  const article3 = await prisma.article.create({
    data: {
      slug: 'fed-minutes-divided-opinion',
      title: 'Fed Minutes Reveal Divided Opinion on Rate Path Forward',
      excerpt: 'Central bank officials weigh inflation risks against growth concerns as the economy shows mixed signals.',
      imageUrl: 'https://picsum.photos/seed/fed-minutes/1920/1080',
      readTime: 6,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['SPY', 'TLT', 'DXY'],
      authorId: authorMap['Jennifer Walsh'],
      categoryId: categoryMap['economy'],
      headings: [
        { id: 'divided-committee', text: 'A Divided Committee', level: 2 },
        { id: 'inflation-debate', text: 'The Inflation Debate', level: 2 },
        { id: 'growth-concerns', text: 'Growth Concerns Emerge', level: 3 },
        { id: 'market-implications', text: 'Market Implications', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'Minutes from the Federal Reserve\'s latest policy meeting revealed significant disagreement among committee members about the appropriate path for interest rates. While officials agreed that inflation has cooled substantially, views differed on how quickly to ease monetary policy.',
        },
        {
          type: 'paragraph',
          content: 'The documents show that several participants favored a more aggressive approach to rate cuts, citing concerns about weakening labor market conditions. Others preferred a more gradual approach, worried that cutting too quickly could reignite inflationary pressures.',
        },
        { type: 'heading', level: 2, content: 'A Divided Committee' },
        {
          type: 'paragraph',
          content: 'The meeting minutes painted a picture of a central bank navigating uncertain economic terrain. Some members pointed to declining job openings and slowing wage growth as evidence that the labor market is cooling appropriately.',
        },
        {
          type: 'quote',
          content: 'The balance of risks has shifted. We need to be attentive to both sides of our dual mandate—price stability and maximum employment.',
          attribution: 'Federal Reserve Chair Jerome Powell',
        },
        {
          type: 'paragraph',
          content: 'Other participants expressed concern that core inflation remains above the Fed\'s 2% target. They argued that premature easing could allow price pressures to become entrenched, requiring a more painful policy response later.',
        },
        { type: 'heading', level: 2, content: 'The Inflation Debate' },
        {
          type: 'callout',
          content: 'Core PCE inflation: 2.8% (Fed target: 2.0%)',
        },
        {
          type: 'paragraph',
          content: 'The Personal Consumption Expenditures (PCE) price index, the Fed\'s preferred inflation measure, has declined from its peak of 7.1% but remains elevated at 2.8%. Housing costs continue to exert upward pressure on the index.',
        },
        {
          type: 'paragraph',
          content: 'Several committee members noted that goods inflation has largely normalized, with deflation in some categories. Services inflation, however, remains sticky, reflecting strong consumer demand and persistent wage growth in service industries.',
        },
        { type: 'heading', level: 3, content: 'Growth Concerns Emerge' },
        {
          type: 'paragraph',
          content: 'Recent economic data has painted a mixed picture. While GDP growth remains positive, leading indicators suggest momentum may be slowing. Manufacturing surveys show contraction, and consumer confidence has declined from recent highs.',
        },
        {
          type: 'list',
          items: [
            'GDP growth: +2.4% (Q3 annualized)',
            'Unemployment rate: 4.1%',
            'Job openings: Down 20% from peak',
            'Consumer confidence: 102.0 (down from 110.7)',
          ],
        },
        {
          type: 'paragraph',
          content: 'The minutes revealed particular concern about small business conditions. Surveys show that small business optimism has fallen to multi-year lows, with owners citing difficulty accessing credit and concerns about future demand.',
        },
        { type: 'heading', level: 2, content: 'Market Implications' },
        {
          type: 'paragraph',
          content: 'Financial markets have priced in substantial rate cuts over the coming year. Fed funds futures suggest investors expect the policy rate to fall by 100-125 basis points by the end of 2025.',
        },
        {
          type: 'paragraph',
          content: 'Bond yields fell following the release of the minutes, with the 10-year Treasury yield dropping to 4.15%. The yield curve, which had been inverted, has begun to steepen—a traditional signal that markets expect the Fed to ease policy.',
        },
        {
          type: 'paragraph',
          content: 'Equity markets rallied on hopes that lower rates will support valuations. Growth stocks, which are particularly sensitive to interest rate changes, led the advance. Real estate investment trusts also gained, benefiting from the prospect of cheaper financing.',
        },
        {
          type: 'paragraph',
          content: 'Investors will closely watch upcoming employment and inflation data for clues about the Fed\'s next move. The December meeting will be crucial, with many expecting the committee to signal its intentions for 2025.',
        },
      ],
      tags: {
        connect: [
          { id: tagMap['Federal Reserve'] },
          { id: tagMap['Interest Rates'] },
          { id: tagMap['Inflation'] },
        ],
      },
    },
  })

  // Article 4: NVIDIA Reports Record Revenue
  const article4 = await prisma.article.create({
    data: {
      slug: 'nvidia-record-revenue',
      title: 'NVIDIA Reports Record Revenue on AI Chip Demand',
      excerpt: 'Chipmaker exceeds Wall Street expectations for Q4 as data center sales surge to unprecedented levels.',
      imageUrl: 'https://picsum.photos/seed/nvidia/1920/1080',
      readTime: 5,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['NVDA', 'AMD', 'INTC', 'TSM'],
      authorId: authorMap['David Kim'],
      categoryId: categoryMap['tech'],
      headings: [
        { id: 'record-quarter', text: 'A Record-Breaking Quarter', level: 2 },
        { id: 'data-center-dominance', text: 'Data Center Dominance', level: 2 },
        { id: 'guidance-outlook', text: 'Guidance and Outlook', level: 3 },
        { id: 'competitive-landscape', text: 'The Competitive Landscape', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'NVIDIA reported quarterly revenue of $22.1 billion, crushing Wall Street estimates of $20.4 billion and marking another milestone in the company\'s AI-driven transformation. The semiconductor giant\'s data center business accounted for a record 80% of total sales.',
        },
        {
          type: 'paragraph',
          content: 'Earnings per share came in at $5.16, well above the consensus estimate of $4.64. The company also announced a $25 billion addition to its share repurchase program, signaling confidence in future growth.',
        },
        { type: 'heading', level: 2, content: 'A Record-Breaking Quarter' },
        {
          type: 'callout',
          content: 'Q4 Revenue: $22.1B (+265% YoY) | EPS: $5.16 (+480% YoY)',
        },
        {
          type: 'paragraph',
          content: 'The results extend NVIDIA\'s remarkable streak of earnings beats. The company has exceeded analyst expectations in every quarter since the AI boom began, consistently raising guidance as demand outpaces supply.',
        },
        {
          type: 'paragraph',
          content: 'CEO Jensen Huang described the quarter as "extraordinary," noting that demand for the company\'s AI accelerators continues to exceed production capacity. Customers are placing orders for chips that won\'t be delivered for another six to nine months.',
        },
        { type: 'heading', level: 2, content: 'Data Center Dominance' },
        {
          type: 'paragraph',
          content: 'NVIDIA\'s data center segment generated $18.4 billion in revenue, up 409% from a year ago. The segment has grown from roughly 40% of total revenue to 80% in just two years, reflecting the insatiable demand for AI computing.',
        },
        {
          type: 'chart',
          chartSymbol: 'NVDA',
          chartData: stockChartData.NVDA,
        },
        {
          type: 'quote',
          content: 'The next industrial revolution has begun. Companies and countries are partnering with NVIDIA to shift the trillion-dollar traditional data centers to accelerated computing.',
          attribution: 'Jensen Huang, NVIDIA CEO',
        },
        {
          type: 'paragraph',
          content: 'Major cloud providers—Microsoft Azure, Amazon AWS, and Google Cloud—continue to be NVIDIA\'s largest customers. All three are racing to expand their AI infrastructure, with Azure recently announcing a $50 billion investment in data centers.',
        },
        { type: 'heading', level: 3, content: 'Guidance and Outlook' },
        {
          type: 'paragraph',
          content: 'NVIDIA provided Q1 guidance above expectations, projecting revenue of $24 billion plus or minus 2%. This implies continued sequential growth as the company ramps production of its Blackwell architecture chips.',
        },
        {
          type: 'list',
          items: [
            'Q1 FY25 Revenue Guidance: $24B (+/- 2%)',
            'Gross Margin Guidance: 74.5%-75.5%',
            'Data Center Growth: Expected to continue outpacing',
            'Gaming Segment: Stabilizing at $2.9B/quarter',
          ],
        },
        {
          type: 'paragraph',
          content: 'The company expects gross margins to remain elevated near 75%, benefiting from strong pricing power and high-margin data center products. Gaming revenue, once NVIDIA\'s core business, has stabilized but is no longer the growth driver.',
        },
        { type: 'heading', level: 2, content: 'The Competitive Landscape' },
        {
          type: 'paragraph',
          content: 'Despite emerging competition from AMD and custom silicon from cloud providers, NVIDIA maintains a commanding lead in AI chips. The company\'s CUDA software ecosystem creates significant switching costs, as developers have invested years in NVIDIA-specific tools.',
        },
        {
          type: 'paragraph',
          content: 'AMD\'s MI300X has gained some traction, with cloud providers offering it as an alternative to NVIDIA\'s H100. However, benchmarks suggest NVIDIA\'s chips retain performance advantages in most AI workloads.',
        },
        {
          type: 'paragraph',
          content: 'Analysts raised their price targets following the results, with several now projecting NVIDIA could reach $200 per share. The stock traded up 8% in after-hours trading, pushing its market capitalization toward $1.5 trillion.',
        },
      ],
      tags: {
        connect: [
          { id: tagMap['NVIDIA'] },
          { id: tagMap['Earnings'] },
          { id: tagMap['Data Center'] },
          { id: tagMap['GPU'] },
          { id: tagMap['AI'] },
        ],
      },
    },
  })

  // Article 5: Oil Prices Drop
  const article5 = await prisma.article.create({
    data: {
      slug: 'oil-prices-drop-opec',
      title: 'Oil Prices Drop as OPEC+ Considers Production Increase',
      excerpt: 'Crude futures fall 1.5% on reports of potential supply boost from major producers.',
      imageUrl: 'https://picsum.photos/seed/oil-markets/1920/1080',
      readTime: 4,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['CL', 'XOM', 'CVX', 'OXY'],
      authorId: authorMap['Robert Hayes'],
      categoryId: categoryMap['markets'],
      headings: [
        { id: 'opec-deliberations', text: 'OPEC+ Deliberations', level: 2 },
        { id: 'demand-outlook', text: 'Global Demand Outlook', level: 2 },
        { id: 'technical-analysis', text: 'Technical Analysis', level: 3 },
        { id: 'producer-outlook', text: 'What It Means for Producers', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'Oil prices retreated sharply on Thursday following reports that OPEC+ is considering increasing production quotas at its upcoming December meeting. West Texas Intermediate crude fell 1.5% to $68.72 per barrel, extending losses to the lowest level in three months.',
        },
        {
          type: 'paragraph',
          content: 'Brent crude, the global benchmark, dropped to $73.18 per barrel. The decline accelerated after Saudi Arabia\'s energy minister suggested the group should reconsider its output strategy in light of changing market conditions.',
        },
        { type: 'heading', level: 2, content: 'OPEC+ Deliberations' },
        {
          type: 'paragraph',
          content: 'The oil producer alliance has maintained strict production cuts throughout 2024 to support prices amid sluggish demand growth. However, internal disagreements have emerged over whether the policy remains appropriate.',
        },
        {
          type: 'quote',
          content: 'Market conditions have evolved. We must balance our desire for price stability with the need to defend market share.',
          attribution: 'Saudi Energy Minister Prince Abdulaziz bin Salman',
        },
        {
          type: 'paragraph',
          content: 'Russia, the alliance\'s second-largest producer, has reportedly pushed for loosening restrictions. Russian officials have cited the need for budget revenue as justification for increasing output.',
        },
        { type: 'heading', level: 2, content: 'Global Demand Outlook' },
        {
          type: 'callout',
          content: 'Global oil demand growth forecast for 2024: 1.2 million barrels/day (down from 2.4 million in 2023)',
        },
        {
          type: 'paragraph',
          content: 'Demand growth has disappointed this year, particularly in China. The world\'s largest oil importer has seen consumption flatten as its economy struggles and electric vehicle adoption accelerates.',
        },
        {
          type: 'paragraph',
          content: 'The International Energy Agency recently revised down its demand forecast, citing weaker-than-expected consumption in developed economies. High prices have also encouraged conservation and switching to alternative fuels.',
        },
        {
          type: 'chart',
          chartSymbol: 'OIL',
          chartData: stockChartData.OIL,
        },
        { type: 'heading', level: 3, content: 'Technical Analysis' },
        {
          type: 'paragraph',
          content: 'Oil prices have broken below key technical support levels, suggesting further downside risk. The 200-day moving average at $72 proved unable to hold, opening the door to a test of the $65 level.',
        },
        {
          type: 'list',
          items: [
            'WTI Crude: $68.72 (-1.5%)',
            'Brent Crude: $73.18 (-1.4%)',
            'Key Support: $65.00',
            'Key Resistance: $75.00',
          ],
        },
        { type: 'heading', level: 2, content: 'What It Means for Producers' },
        {
          type: 'paragraph',
          content: 'Energy stocks fell in sympathy with crude prices. ExxonMobil dropped 2.8% while Chevron declined 2.5%. Smaller exploration and production companies faced even steeper losses.',
        },
        {
          type: 'paragraph',
          content: 'Lower oil prices could benefit consumers and help central banks in their fight against inflation. However, the impact on energy sector employment and investment could create headwinds for oil-producing regions.',
        },
        {
          type: 'paragraph',
          content: 'OPEC+ is scheduled to meet on December 1st to finalize production policy for 2025. Markets will closely watch the outcome, with any surprise increase likely to trigger additional selling pressure.',
        },
      ],
      tags: {
        connect: [
          { id: tagMap['OPEC'] },
          { id: tagMap['Oil'] },
          { id: tagMap['Energy'] },
        ],
      },
    },
  })

  // Article 6: Apple Unveils New AI Features
  const article6 = await prisma.article.create({
    data: {
      slug: 'apple-ai-features-2025',
      title: 'Apple Unveils New AI Features for iPhone Coming in 2025',
      excerpt: 'Tech giant announces major software update with enhanced machine learning capabilities.',
      imageUrl: 'https://picsum.photos/seed/apple-ai/1920/1080',
      readTime: 5,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['AAPL', 'MSFT', 'GOOGL'],
      authorId: authorMap['Lisa Park'],
      categoryId: categoryMap['tech'],
      headings: [
        { id: 'apple-intelligence', text: 'Apple Intelligence Arrives', level: 2 },
        { id: 'key-features', text: 'Key Features Announced', level: 2 },
        { id: 'siri-upgrade', text: 'The New Siri', level: 3 },
        { id: 'privacy-approach', text: 'Privacy-First Approach', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'Apple announced sweeping AI enhancements coming to iPhone, iPad, and Mac in 2025, marking the company\'s most significant software update in years. The features, collectively branded as "Apple Intelligence," will bring generative AI capabilities to over one billion Apple devices.',
        },
        {
          type: 'paragraph',
          content: 'The announcement came during a special event at Apple Park, where CEO Tim Cook described AI as "the next major chapter for Apple." Shares rose 2.3% in trading following the presentation.',
        },
        { type: 'heading', level: 2, content: 'Apple Intelligence Arrives' },
        {
          type: 'paragraph',
          content: 'Apple Intelligence represents the company\'s answer to ChatGPT and Google\'s AI offerings. The system runs locally on-device for most tasks, with cloud processing available for more complex queries.',
        },
        {
          type: 'callout',
          content: 'Apple Intelligence will require iPhone 15 Pro or newer, M1 Mac or newer',
        },
        {
          type: 'paragraph',
          content: 'The hardware requirements mean only relatively recent devices will support the new features. Apple has invested heavily in neural engine capabilities in its A-series and M-series chips to enable on-device AI processing.',
        },
        { type: 'heading', level: 2, content: 'Key Features Announced' },
        {
          type: 'list',
          items: [
            'Intelligent writing assistance across all apps',
            'Photo enhancement and editing with AI',
            'Smart email summarization and replies',
            'Real-time language translation',
            'Personalized recommendations across Apple services',
          ],
        },
        {
          type: 'paragraph',
          content: 'The writing assistance feature can rewrite emails and messages in different tones, proofread documents, and summarize long texts. The system learns user preferences over time to provide more relevant suggestions.',
        },
        {
          type: 'chart',
          chartSymbol: 'AAPL',
          chartData: stockChartData.AAPL,
        },
        { type: 'heading', level: 3, content: 'The New Siri' },
        {
          type: 'paragraph',
          content: 'Siri will receive its most substantial upgrade since launch, with improved natural language understanding and the ability to maintain context across conversations. Users can now interact with Siri through text as well as voice.',
        },
        {
          type: 'quote',
          content: 'We\'ve completely reimagined Siri with AI at its core. It\'s not just an assistant anymore—it\'s a true partner that understands you and your needs.',
          attribution: 'Tim Cook, Apple CEO',
        },
        {
          type: 'paragraph',
          content: 'The updated Siri can perform complex, multi-step tasks across apps. For example, users can ask Siri to "find photos from last weekend\'s party and create a shared album for everyone who attended."',
        },
        { type: 'heading', level: 2, content: 'Privacy-First Approach' },
        {
          type: 'paragraph',
          content: 'Apple emphasized its privacy-first approach to AI, contrasting with competitors who rely primarily on cloud processing. Personal data used for AI features remains encrypted and processed on-device whenever possible.',
        },
        {
          type: 'paragraph',
          content: 'When cloud processing is required, Apple has developed "Private Cloud Compute," which uses custom Apple silicon servers. Data is never stored on servers and cannot be accessed by Apple employees.',
        },
        {
          type: 'paragraph',
          content: 'The features will roll out gradually starting with iOS 18.4 in March 2025. Some capabilities will initially be available only in English, with additional languages following throughout the year.',
        },
      ],
      tags: {
        connect: [
          { id: tagMap['Apple'] },
          { id: tagMap['iPhone'] },
          { id: tagMap['Machine Learning'] },
          { id: tagMap['AI'] },
        ],
      },
    },
  })

  // Article 7: Ethereum Foundation Announces Upgrade
  const article7 = await prisma.article.create({
    data: {
      slug: 'ethereum-protocol-upgrade',
      title: 'Ethereum Foundation Announces Major Protocol Upgrade',
      excerpt: 'Next-generation improvements aim to enhance scalability and reduce transaction costs.',
      imageUrl: 'https://picsum.photos/seed/ethereum/1920/1080',
      readTime: 6,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['ETH', 'BTC', 'SOL'],
      authorId: authorMap['Alex Rivera'],
      categoryId: categoryMap['crypto'],
      headings: [
        { id: 'pectra-upgrade', text: 'The Pectra Upgrade', level: 2 },
        { id: 'technical-changes', text: 'Technical Changes', level: 2 },
        { id: 'eip-details', text: 'Key EIPs Included', level: 3 },
        { id: 'ecosystem-impact', text: 'Impact on the Ecosystem', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'The Ethereum Foundation has unveiled details of its next major protocol upgrade, codenamed "Pectra," scheduled for Q1 2025. The upgrade combines improvements from both the Prague and Electra development phases, promising significant enhancements to network scalability.',
        },
        {
          type: 'paragraph',
          content: 'Ethereum co-founder Vitalik Buterin described the upgrade as "the most significant improvement since the Merge," which transitioned the network to proof-of-stake in September 2022.',
        },
        { type: 'heading', level: 2, content: 'The Pectra Upgrade' },
        {
          type: 'callout',
          content: 'Target deployment: Q1 2025 | Expected gas fee reduction: 90% for Layer 2s',
        },
        {
          type: 'paragraph',
          content: 'Pectra focuses on improving Ethereum\'s scalability roadmap, particularly for Layer 2 solutions. The upgrade will dramatically reduce costs for rollups like Arbitrum and Optimism, which process the majority of Ethereum transactions.',
        },
        {
          type: 'paragraph',
          content: 'The improvement comes through "blobs," a new data structure introduced in the earlier Dencun upgrade. Pectra expands blob capacity, allowing Layer 2s to post more data to Ethereum at lower cost.',
        },
        { type: 'heading', level: 2, content: 'Technical Changes' },
        {
          type: 'paragraph',
          content: 'The upgrade includes over a dozen Ethereum Improvement Proposals (EIPs) addressing various aspects of the protocol. Key changes focus on validator operations, account abstraction, and execution layer efficiency.',
        },
        {
          type: 'chart',
          chartSymbol: 'ETH',
          chartData: stockChartData.ETH,
        },
        { type: 'heading', level: 3, content: 'Key EIPs Included' },
        {
          type: 'list',
          items: [
            'EIP-7251: Increased max validator stake (2048 ETH)',
            'EIP-7702: Improved account abstraction',
            'EIP-6110: On-chain validator deposits',
            'EIP-7549: Committee-based validator attestation',
          ],
        },
        {
          type: 'paragraph',
          content: 'The increased validator stake limit is particularly significant for large staking providers. Currently capped at 32 ETH per validator, the change allows consolidation into fewer validators, reducing network overhead.',
        },
        { type: 'heading', level: 2, content: 'Impact on the Ecosystem' },
        {
          type: 'paragraph',
          content: 'DeFi protocols are preparing to take advantage of lower transaction costs. Uniswap, the largest decentralized exchange, announced plans to deploy enhanced features once Pectra activates.',
        },
        {
          type: 'quote',
          content: 'These upgrades will make Ethereum competitive with centralized alternatives on cost while maintaining decentralization. It\'s the best of both worlds.',
          attribution: 'Vitalik Buterin, Ethereum Co-founder',
        },
        {
          type: 'paragraph',
          content: 'The upgrade arrives amid intensifying competition from alternative blockchains. Solana has gained market share by offering faster, cheaper transactions, though critics question its decentralization compared to Ethereum.',
        },
        {
          type: 'paragraph',
          content: 'ETH prices rallied 3.5% following the announcement, recovering from recent weakness. Analysts suggest the upgrade could be a catalyst for renewed investor interest in Ethereum-based assets.',
        },
        {
          type: 'paragraph',
          content: 'Developers are encouraged to test their applications on the Holesky testnet, where Pectra will be deployed in December. The foundation emphasized the importance of extensive testing to ensure a smooth mainnet transition.',
        },
      ],
      tags: {
        connect: [
          { id: tagMap['Ethereum'] },
          { id: tagMap['DeFi'] },
          { id: tagMap['Protocol'] },
          { id: tagMap['Cryptocurrency'] },
        ],
      },
    },
  })

  // Article 8: Housing Market Recovery
  const article8 = await prisma.article.create({
    data: {
      slug: 'housing-market-recovery',
      title: 'Housing Market Shows Signs of Recovery in Major Cities',
      excerpt: 'Home sales rise for third consecutive month as mortgage rates stabilize.',
      imageUrl: 'https://picsum.photos/seed/housing/1920/1080',
      readTime: 4,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['XHB', 'LEN', 'DHI', 'TOL'],
      authorId: authorMap['Maria Santos'],
      categoryId: categoryMap['economy'],
      headings: [
        { id: 'sales-rebound', text: 'Sales Rebound', level: 2 },
        { id: 'regional-trends', text: 'Regional Trends', level: 2 },
        { id: 'rate-impact', text: 'Mortgage Rate Impact', level: 3 },
        { id: 'outlook', text: '2025 Outlook', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'The U.S. housing market is showing tentative signs of recovery after nearly two years of decline. Existing home sales rose 3.4% in October, marking the third consecutive monthly increase. The improvement comes as mortgage rates retreat from multi-decade highs.',
        },
        {
          type: 'paragraph',
          content: 'The National Association of Realtors reported that 3.96 million homes sold in October on a seasonally adjusted annualized basis. While still below pre-pandemic norms, the trend suggests buyers are returning despite elevated prices.',
        },
        { type: 'heading', level: 2, content: 'Sales Rebound' },
        {
          type: 'callout',
          content: 'October existing home sales: 3.96 million (annualized) | +3.4% from September',
        },
        {
          type: 'paragraph',
          content: 'The recovery has been driven by improving affordability as mortgage rates decline. The average 30-year fixed rate has fallen from its peak of 7.8% to around 6.8%, reducing monthly payments by several hundred dollars for typical buyers.',
        },
        {
          type: 'paragraph',
          content: 'Inventory levels have also begun to normalize, with 1.37 million homes on the market. This represents a 4.2-month supply at the current sales pace, still below the 5-6 month level considered a balanced market.',
        },
        { type: 'heading', level: 2, content: 'Regional Trends' },
        {
          type: 'paragraph',
          content: 'The housing recovery varies significantly by region. Sun Belt markets that boomed during the pandemic, including Phoenix and Austin, have seen price declines. Meanwhile, Northeast and Midwest markets remain tight.',
        },
        {
          type: 'list',
          items: [
            'Northeast: +4.8% sales, +5.2% median price',
            'Midwest: +3.2% sales, +4.1% median price',
            'South: +2.8% sales, -1.2% median price',
            'West: +3.1% sales, +2.8% median price',
          ],
        },
        {
          type: 'paragraph',
          content: 'First-time buyers comprised 28% of purchases, up from 26% in September but still below the historical average of 40%. Many young buyers continue to be priced out, particularly in high-cost metropolitan areas.',
        },
        { type: 'heading', level: 3, content: 'Mortgage Rate Impact' },
        {
          type: 'quote',
          content: 'We\'re seeing buyers who had been waiting on the sidelines finally making moves. The combination of lower rates and more inventory is creating opportunities.',
          attribution: 'Lawrence Yun, NAR Chief Economist',
        },
        {
          type: 'paragraph',
          content: 'The rate decline reflects expectations that the Federal Reserve will continue cutting rates into 2025. Mortgage rates typically track the 10-year Treasury yield, which has fallen in anticipation of easier monetary policy.',
        },
        { type: 'heading', level: 2, content: '2025 Outlook' },
        {
          type: 'paragraph',
          content: 'Housing economists project continued improvement in 2025, though the pace of recovery will depend on rate trajectory. Most forecasts assume mortgage rates will gradually decline to the low 6% range by year-end.',
        },
        {
          type: 'paragraph',
          content: 'New construction has picked up in response to tight inventory. Housing starts rose 5.2% in October, with single-family construction leading the gains. Builders report strong demand for entry-level homes.',
        },
        {
          type: 'paragraph',
          content: 'Homebuilder stocks have rallied on the improving outlook. The iShares Home Construction ETF (XHB) has gained 28% year-to-date, outperforming the broader market. Analysts see further upside as rates decline.',
        },
      ],
      tags: {
        connect: [
          { id: tagMap['Housing'] },
          { id: tagMap['Real Estate'] },
          { id: tagMap['Mortgage'] },
        ],
      },
    },
  })

  // Article 9: Why Stock Market Could Surprise
  const article9 = await prisma.article.create({
    data: {
      slug: 'stock-market-surprise-2025',
      title: 'Why the Stock Market Could Surprise Everyone in 2025',
      excerpt: 'Contrarian view suggests overlooked factors may drive unexpected gains.',
      imageUrl: 'https://picsum.photos/seed/opinion/1920/1080',
      readTime: 7,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['SPY', 'QQQ', 'IWM'],
      authorId: authorMap['James Mitchell'],
      categoryId: categoryMap['opinion'],
      headings: [
        { id: 'contrarian-case', text: 'The Contrarian Case', level: 2 },
        { id: 'overlooked-factors', text: 'Overlooked Factors', level: 2 },
        { id: 'liquidity-tailwinds', text: 'Liquidity Tailwinds', level: 3 },
        { id: 'risks-consider', text: 'Risks to Consider', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'Wall Street consensus calls for modest single-digit gains in 2025, citing elevated valuations and policy uncertainty. But what if the consensus is wrong? History suggests the crowd often underestimates market momentum, and several overlooked factors could drive surprising strength.',
        },
        {
          type: 'paragraph',
          content: 'I\'ve been investing for over 30 years, and one pattern has remained constant: when everyone agrees on the outlook, reality tends to diverge. The current consensus for 8-10% returns feels too comfortable, and comfortable predictions rarely capture market reality.',
        },
        { type: 'heading', level: 2, content: 'The Contrarian Case' },
        {
          type: 'paragraph',
          content: 'Bears point to the S&P 500\'s price-to-earnings ratio of 22x, above historical averages. But this metric tells an incomplete story. Earnings growth has consistently surprised to the upside, and the composition of the index has shifted toward higher-quality, faster-growing companies.',
        },
        {
          type: 'callout',
          content: 'S&P 500 earnings have beaten estimates in 12 of the last 16 quarters',
        },
        {
          type: 'paragraph',
          content: 'The mega-cap technology companies that dominate today\'s index generate substantially higher profit margins than the industrial conglomerates of previous eras. Comparing today\'s PE ratio to historical averages is like comparing apples to oranges.',
        },
        { type: 'heading', level: 2, content: 'Overlooked Factors' },
        {
          type: 'paragraph',
          content: 'Several bullish factors aren\'t receiving adequate attention. First, corporate profit margins remain near record highs despite recession fears. Companies have successfully passed inflation costs to consumers and implemented efficiency improvements using AI.',
        },
        {
          type: 'quote',
          content: 'The productivity gains from AI adoption are just beginning to show up in earnings. We\'re in the early innings of what could be a multi-year profit expansion.',
          attribution: 'Investment thesis',
        },
        {
          type: 'paragraph',
          content: 'Second, household balance sheets remain healthy. Consumer debt levels as a percentage of income are near 40-year lows. This provides a cushion against economic slowdown and supports continued spending.',
        },
        { type: 'heading', level: 3, content: 'Liquidity Tailwinds' },
        {
          type: 'paragraph',
          content: 'Perhaps the most overlooked factor is the wall of cash sitting on the sidelines. Money market funds hold over $6 trillion in assets, nearly double pre-pandemic levels. As rate cuts reduce money market yields, some of this cash will inevitably rotate into equities.',
        },
        {
          type: 'list',
          items: [
            'Money market fund assets: $6.1 trillion (record high)',
            'Corporate cash on balance sheets: $4.2 trillion',
            'Pension fund allocation to equities: Below average',
            'Retail investor sentiment: Neutral (not euphoric)',
          ],
        },
        {
          type: 'paragraph',
          content: 'Additionally, corporate buybacks continue at a robust pace. S&P 500 companies are projected to repurchase over $1 trillion in shares in 2025, providing consistent buying pressure that supports prices.',
        },
        { type: 'heading', level: 2, content: 'Risks to Consider' },
        {
          type: 'paragraph',
          content: 'This isn\'t a call to throw caution to the wind. Several risks could derail the bull case. Inflation could prove stickier than expected, forcing the Fed to maintain restrictive policy. Geopolitical tensions, particularly around Taiwan, represent a tail risk.',
        },
        {
          type: 'paragraph',
          content: 'The concentration of market gains in a handful of mega-cap stocks is also concerning. A stumble by any of the "Magnificent Seven" could have outsized impact on index performance. Diversification remains important.',
        },
        {
          type: 'paragraph',
          content: 'My base case is that the S&P 500 could reach 6,500 by year-end 2025, implying roughly 15% upside from current levels. This would be consistent with historical bull market patterns and supported by the fundamental factors outlined above.',
        },
        {
          type: 'paragraph',
          content: 'The biggest risk may be remaining too cautious. For long-term investors, missing a rally is just as costly as enduring a correction. Sometimes the best strategy is to stay invested and let compound returns work their magic.',
        },
      ],
      tags: {
        connect: [
          { id: tagMap['Investment Strategy'] },
          { id: tagMap['Bull Market'] },
          { id: tagMap['S&P 500'] },
        ],
      },
    },
  })

  // Article 10: Tesla Cybertruck
  const article10 = await prisma.article.create({
    data: {
      slug: 'tesla-cybertruck-deliveries',
      title: 'Tesla Stock Jumps After Cybertruck Delivery Numbers Revealed',
      excerpt: 'Electric vehicle maker beats expectations with strong Q4 delivery figures.',
      imageUrl: 'https://picsum.photos/seed/tesla/1920/1080',
      readTime: 4,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['TSLA', 'F', 'GM', 'RIVN'],
      authorId: authorMap['Emma Thompson'],
      categoryId: categoryMap['markets'],
      headings: [
        { id: 'delivery-numbers', text: 'The Delivery Numbers', level: 2 },
        { id: 'cybertruck-impact', text: 'Cybertruck\'s Impact', level: 2 },
        { id: 'production-ramp', text: 'Production Ramp', level: 3 },
        { id: 'competition-ahead', text: 'Competition Ahead', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'Tesla shares surged 6.8% on Thursday after the electric vehicle maker reported Q4 deliveries that exceeded Wall Street expectations. The company delivered 495,000 vehicles in the quarter, driven by strong demand for the Model Y and unexpectedly robust Cybertruck sales.',
        },
        {
          type: 'paragraph',
          content: 'The results suggest Tesla is maintaining its growth trajectory despite increased competition from legacy automakers and Chinese EV manufacturers. Full-year 2024 deliveries reached 1.85 million vehicles, up 8% from 2023.',
        },
        { type: 'heading', level: 2, content: 'The Delivery Numbers' },
        {
          type: 'callout',
          content: 'Q4 Deliveries: 495,000 vehicles | Full Year: 1.85 million (+8% YoY)',
        },
        {
          type: 'paragraph',
          content: 'Analysts had expected Q4 deliveries of 475,000 vehicles. The beat was primarily attributed to stronger-than-anticipated Cybertruck volumes, with the distinctive pickup truck accounting for an estimated 25,000 deliveries.',
        },
        {
          type: 'paragraph',
          content: 'Model Y remained Tesla\'s best-seller globally, with the compact SUV particularly popular in Europe and China. Price cuts implemented earlier in the year appear to have stimulated demand without significantly impacting margins.',
        },
        { type: 'heading', level: 2, content: 'Cybertruck\'s Impact' },
        {
          type: 'paragraph',
          content: 'The Cybertruck, Tesla\'s first new vehicle in years, has ramped faster than expected. CEO Elon Musk stated during an earnings call that Cybertruck has become the best-selling electric pickup in America.',
        },
        {
          type: 'chart',
          chartSymbol: 'TSLA',
          chartData: stockChartData.TSLA,
        },
        {
          type: 'quote',
          content: 'Cybertruck is the most American-made vehicle. We\'re proud of what the team has accomplished in ramping production of such an ambitious design.',
          attribution: 'Elon Musk, Tesla CEO',
        },
        { type: 'heading', level: 3, content: 'Production Ramp' },
        {
          type: 'paragraph',
          content: 'Tesla\'s Texas Gigafactory has increased Cybertruck production capacity to approximately 2,500 units per week. The company targets 250,000 annual Cybertruck production by mid-2025.',
        },
        {
          type: 'list',
          items: [
            'Cybertruck Q4 deliveries: ~25,000 (estimated)',
            'Current weekly production: ~2,500 units',
            '2025 production target: 250,000 units',
            'Average selling price: $79,000',
          ],
        },
        {
          type: 'paragraph',
          content: 'The high average selling price of the Cybertruck—around $79,000—is helping Tesla maintain profitability despite competitive pricing on other models. Gross margins are expected to improve as production scales.',
        },
        { type: 'heading', level: 2, content: 'Competition Ahead' },
        {
          type: 'paragraph',
          content: 'Tesla faces intensifying competition across all segments. Ford\'s F-150 Lightning and Rivian\'s R1T compete in the electric truck market, while Chinese manufacturers like BYD are taking share in Europe and emerging markets.',
        },
        {
          type: 'paragraph',
          content: 'The company\'s upcoming lower-cost vehicle, expected in late 2025, could be a game-changer. Priced around $25,000, it would dramatically expand Tesla\'s addressable market and fend off competition from affordable Chinese EVs.',
        },
        {
          type: 'paragraph',
          content: 'Analysts raised price targets following the delivery report, with several now projecting $400+ share prices. Bulls point to Tesla\'s energy storage business and autonomous driving potential as additional value drivers beyond vehicle sales.',
        },
      ],
      tags: {
        connect: [
          { id: tagMap['Tesla'] },
          { id: tagMap['EV'] },
          { id: tagMap['Cybertruck'] },
        ],
      },
    },
  })

  // Connect related articles
  console.log('🔗 Connecting related articles...')
  await prisma.article.update({
    where: { id: article1.id },
    data: { relatedTo: { connect: [{ id: article2.id }, { id: article4.id }, { id: article6.id }] } },
  })
  await prisma.article.update({
    where: { id: article2.id },
    data: { relatedTo: { connect: [{ id: article7.id }, { id: article3.id }, { id: article1.id }] } },
  })
  await prisma.article.update({
    where: { id: article4.id },
    data: { relatedTo: { connect: [{ id: article1.id }, { id: article6.id }] } },
  })

  console.log('📊 Creating market indices...')
  await prisma.marketIndex.createMany({
    data: [
      { symbol: 'SPX', name: 'S&P 500', price: 5998.74, change: 22.44, changePercent: 0.38 },
      { symbol: 'IXIC', name: 'NASDAQ', price: 19060.48, change: -47.11, changePercent: -0.25 },
      { symbol: 'DJI', name: 'DOW', price: 44910.65, change: 188.59, changePercent: 0.42 },
      { symbol: 'RUT', name: 'Russell 2000', price: 2434.73, change: 12.88, changePercent: 0.53 },
      { symbol: 'BTC', name: 'Bitcoin', price: 97245.0, change: 1892.5, changePercent: 1.98 },
      { symbol: 'ETH', name: 'Ethereum', price: 3642.18, change: -28.44, changePercent: -0.77 },
      { symbol: 'GC', name: 'Gold', price: 2678.4, change: 8.2, changePercent: 0.31 },
      { symbol: 'CL', name: 'Crude Oil', price: 68.72, change: -0.94, changePercent: -1.35 },
    ],
  })

  console.log('🎬 Creating videos...')
  await prisma.video.createMany({
    data: [
      {
        title: 'Market Close: Tech Leads Rally as Fed Minutes Released',
        thumbnail: 'https://picsum.photos/seed/market-close/400/225',
        duration: '8:42',
        category: 'markets',
      },
      {
        title: 'Bitcoin Analysis: Technical Levels to Watch',
        thumbnail: 'https://picsum.photos/seed/btc-analysis/400/225',
        duration: '12:15',
        category: 'crypto',
      },
      {
        title: 'NVIDIA Earnings Preview: What Investors Need to Know',
        thumbnail: 'https://picsum.photos/seed/nvda-earnings/400/225',
        duration: '6:33',
        category: 'tech',
      },
      {
        title: 'Economic Outlook 2025: Expert Panel Discussion',
        thumbnail: 'https://picsum.photos/seed/econ-outlook/400/225',
        duration: '24:18',
        category: 'economy',
      },
    ],
  })

  console.log('🚨 Creating breaking news...')
  await prisma.breakingNews.create({
    data: {
      isActive: true,
      headline: 'Federal Reserve signals potential rate cut in early 2025 amid cooling inflation',
      url: '/article/fed-minutes-divided-opinion',
    },
  })

  console.log('✅ Seed completed successfully!')
  console.log(`   - ${authors.length} authors`)
  console.log(`   - ${categories.length} categories`)
  console.log(`   - ${tags.length} tags`)
  console.log(`   - 10 articles with full content`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
