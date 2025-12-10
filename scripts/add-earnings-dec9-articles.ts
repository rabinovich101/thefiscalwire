import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Adding earnings articles from December 9, 2025...')

  // Get existing authors and categories
  const authors = await prisma.author.findMany()
  const categories = await prisma.category.findMany()

  if (authors.length === 0 || categories.length === 0) {
    console.error('No authors or categories found. Please run the main seed first.')
    process.exit(1)
  }

  const authorMap = Object.fromEntries(authors.map((a) => [a.name, a.id]))
  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]))

  // Get or create tags we need
  const tagNames = [
    'GameStop', 'Retail', 'Meme Stock', 'Earnings', 'Bitcoin',
    'AeroVironment', 'Defense', 'Drones', 'Military',
    'Caseys', 'Convenience Store', 'Fuel', 'Consumer',
    'Cracker Barrel', 'Restaurant', 'Dining',
    'Dave and Busters', 'Entertainment', 'Gaming',
    'Braze', 'Software', 'SaaS', 'Marketing', 'Tech'
  ]

  const tags: Record<string, string> = {}
  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-')
    const existing = await prisma.tag.findUnique({ where: { slug } })
    if (existing) {
      tags[name] = existing.id
    } else {
      const created = await prisma.tag.create({ data: { name, slug } })
      tags[name] = created.id
    }
  }

  const articlesData = [
    // Article 1: GameStop Q3 2025 Earnings
    {
      slug: 'gamestop-q3-2025-earnings-revenue-miss-bitcoin-treasury',
      title: 'GameStop Posts Q3 Profit Surge But Revenue Misses as Core Business Declines',
      excerpt: 'Meme stock darling reports $77.1 million net income as cost cuts boost profitability. Revenue falls to $821 million, missing estimates by wide margin. Company holds $8.8 billion cash and $519 million in Bitcoin.',
      imageUrl: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=1920&h=1080&fit=crop',
      readTime: 5,
      isFeatured: true,
      isBreaking: false,
      relevantTickers: ['GME', 'AMC', 'BBBY', 'COIN'],
      authorId: authorMap['David Kim'] || authors[0].id,
      marketsCategoryId: categoryMap['us-markets'],
      businessCategoryId: categoryMap['tech'],
      headings: [
        { id: 'profit-surge', text: 'Profit Surges on Cost Cuts', level: 2 },
        { id: 'revenue-decline', text: 'Revenue Continues Decline', level: 2 },
        { id: 'bitcoin-holdings', text: 'Massive Cash and Bitcoin Position', level: 3 },
        { id: 'no-call', text: 'No Earnings Call Scheduled', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'GameStop Corporation reported third-quarter fiscal 2025 results that showcased improving profitability but continued revenue declines, as the video game retailer navigates an evolving gaming landscape. The company posted net income of $77.1 million, or $0.17 per diluted share, compared to a net loss of $3.1 million in the year-ago period.',
        },
        {
          type: 'paragraph',
          content: 'However, net sales of $821 million fell well short of analyst estimates around $887 million and declined from $860.3 million in the prior year quarter. Shares fell approximately 6% in after-hours trading as investors weighed the revenue miss against the profit improvement.',
        },
        { type: 'heading', level: 2, content: 'Profit Surges on Cost Cuts' },
        {
          type: 'paragraph',
          content: 'The dramatic swing to profitability reflects GameStops aggressive cost reduction initiatives under CEO Ryan Cohen. Operating income reached $41.3 million compared to an operating loss of $33.4 million in Q3 2024, demonstrating the impact of store closures and headcount reductions.',
        },
        {
          type: 'callout',
          content: 'Q3 FY2025: Net income $77.1M vs. ($3.1M) loss YoY; Revenue $821M (-4.6% YoY) vs. $887M expected',
        },
        {
          type: 'paragraph',
          content: 'Selling, general and administrative expenses declined meaningfully as the company continued its store optimization program. The leaner cost structure allowed GameStop to generate profits despite the challenging top-line environment.',
        },
        { type: 'heading', level: 2, content: 'Revenue Continues Decline' },
        {
          type: 'paragraph',
          content: 'The revenue breakdown revealed continued pressure on GameStops core business segments. Hardware and accessories revenue fell to $367.4 million from $417.4 million, while software sales dropped to $197.5 million from $271.8 million as digital game downloads continue displacing physical disc sales.',
        },
        {
          type: 'paragraph',
          content: 'The bright spot was collectibles, which surged 49% to $256.1 million from $171.1 million, reflecting GameStops strategic pivot toward higher-margin merchandise categories including trading cards, toys, and pop culture items.',
        },
        {
          type: 'list',
          items: [
            'Hardware & Accessories: $367.4M (down from $417.4M)',
            'Software: $197.5M (down from $271.8M)',
            'Collectibles: $256.1M (up 49% from $171.1M)',
            'Operating income: $41.3M vs. ($33.4M) loss YoY',
          ],
        },
        { type: 'heading', level: 3, content: 'Massive Cash and Bitcoin Position' },
        {
          type: 'paragraph',
          content: 'GameStop ended the quarter with approximately $7.8 billion in cash and cash equivalents plus $987 million in marketable securities, totaling roughly $8.8 billion in liquid assets. Additionally, the company holds Bitcoin valued at $519.4 million, reflecting its cryptocurrency treasury strategy.',
        },
        {
          type: 'paragraph',
          content: 'The fortress balance sheet, built through multiple equity offerings during the meme stock rallies, provides GameStop substantial flexibility to pursue strategic initiatives or weather extended periods of revenue decline.',
        },
        { type: 'heading', level: 2, content: 'No Earnings Call Scheduled' },
        {
          type: 'paragraph',
          content: 'Consistent with recent practice, GameStop did not schedule an earnings conference call to discuss the results. The company has not held a quarterly earnings call since early 2023, limiting investor insight into managements strategic thinking.',
        },
        {
          type: 'paragraph',
          content: 'The lack of guidance and management commentary continues to frustrate some investors seeking clarity on how GameStop plans to deploy its massive cash reserves. The stock remains a favorite among retail traders but has declined significantly from its 2021 meme stock peaks.',
        },
      ],
      tags: ['GameStop', 'Retail', 'Meme Stock', 'Earnings', 'Bitcoin'],
    },
    // Article 2: AeroVironment Q2 FY2026 Earnings
    {
      slug: 'aerovironment-q2-fy2026-earnings-eps-miss-revenue-beats',
      title: 'AeroVironment Shares Slide After Q2 EPS Miss Despite Revenue Beat',
      excerpt: 'Defense drone maker reports adjusted EPS of $0.44, well below $0.79 estimate. Revenue of $472.5 million tops forecasts as military demand stays strong. Company lowers full-year earnings guidance.',
      imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1920&h=1080&fit=crop',
      readTime: 5,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['AVAV', 'LMT', 'NOC', 'RTX'],
      authorId: authorMap['Sarah Chen'] || authors[0].id,
      marketsCategoryId: categoryMap['us-markets'],
      businessCategoryId: categoryMap['tech'],
      headings: [
        { id: 'eps-miss', text: 'Earnings Miss Expectations', level: 2 },
        { id: 'revenue-beats', text: 'Revenue Tops Forecasts', level: 2 },
        { id: 'guidance-cut', text: 'Full-Year Guidance Lowered', level: 3 },
        { id: 'defense-demand', text: 'Strong Defense Demand Continues', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'AeroVironment Inc. reported fiscal second-quarter 2026 results that disappointed on the bottom line despite solid revenue performance, sending shares lower in after-hours trading. The defense technology company posted adjusted earnings of $0.44 per share, significantly below analyst expectations of $0.79.',
        },
        {
          type: 'paragraph',
          content: 'Revenue of $472.5 million exceeded the consensus estimate of $468.7 million, reflecting continued strong demand for the companys unmanned aircraft systems and loitering munitions. However, the earnings shortfall and reduced guidance weighed on investor sentiment.',
        },
        { type: 'heading', level: 2, content: 'Earnings Miss Expectations' },
        {
          type: 'paragraph',
          content: 'AeroVironment reported a GAAP net loss of $17.1 million for the quarter, compared to a profit in the year-ago period. The adjusted EPS of $0.44 represented a 44% miss versus the $0.79 consensus, marking a significant negative surprise for investors.',
        },
        {
          type: 'callout',
          content: 'Q2 FY2026: Adj. EPS $0.44 vs. $0.79 expected (-44% miss); Revenue $472.5M vs. $468.7M expected',
        },
        {
          type: 'paragraph',
          content: 'The earnings miss reflected higher costs and investment spending as AeroVironment scales production capacity to meet elevated defense demand. The company has been investing heavily in manufacturing facilities and workforce expansion.',
        },
        { type: 'heading', level: 2, content: 'Revenue Tops Forecasts' },
        {
          type: 'paragraph',
          content: 'Despite the earnings disappointment, AeroVironments top line demonstrated the robust demand environment for defense technologies. Revenue growth was driven by increased deliveries of Switchblade loitering munitions and Puma unmanned aircraft systems.',
        },
        {
          type: 'paragraph',
          content: 'The company continues to benefit from heightened global defense spending, particularly demand for its tactical drone systems which have proven effective in modern combat environments. International sales also contributed to the revenue performance.',
        },
        { type: 'heading', level: 3, content: 'Full-Year Guidance Lowered' },
        {
          type: 'paragraph',
          content: 'AeroVironment lowered its fiscal 2026 adjusted EPS guidance to a range of $3.40 to $3.55, down from prior expectations and below the $3.64 analyst estimate. The company raised its revenue guidance to $1.95 billion to $2 billion.',
        },
        {
          type: 'list',
          items: [
            'FY2026 adj. EPS guidance: $3.40-$3.55 (lowered)',
            'FY2026 revenue guidance: $1.95B-$2.0B (raised)',
            'Stock up 83% year-to-date before earnings',
            'Recent $874M U.S. Army contract win',
          ],
        },
        { type: 'heading', level: 2, content: 'Strong Defense Demand Continues' },
        {
          type: 'paragraph',
          content: 'The company recently secured an $874 million contract from the U.S. Army, underscoring its strong competitive position in the tactical unmanned systems market. AeroVironment has emerged as a key supplier of loitering munitions for Ukraine and NATO allies.',
        },
        {
          type: 'paragraph',
          content: 'Despite the near-term earnings pressure, analysts remain generally positive on AeroVironments long-term prospects given the favorable defense spending environment and the companys leading technology position. Shares had risen 83% year-to-date prior to the earnings report.',
        },
      ],
      tags: ['AeroVironment', 'Defense', 'Drones', 'Military', 'Earnings'],
    },
    // Article 3: Caseys General Stores Q2 FY2026 Earnings
    {
      slug: 'caseys-general-stores-q2-fy2026-earnings-beat-estimates',
      title: 'Caseys General Stores Beats Q2 Estimates, Raises Full-Year Outlook',
      excerpt: 'Convenience store chain reports EPS of $5.53 vs. $5.21 expected. Inside sales grow 3.3% with 42.4% margins. Company raises fiscal 2026 EBITDA guidance to 15-17% growth.',
      imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1920&h=1080&fit=crop',
      readTime: 5,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['CASY', 'MUSA', 'CTRE', 'ARKO'],
      authorId: authorMap['Jennifer Walsh'] || authors[0].id,
      marketsCategoryId: categoryMap['us-markets'],
      businessCategoryId: categoryMap['consumption'],
      headings: [
        { id: 'beats-estimates', text: 'Results Beat Expectations', level: 2 },
        { id: 'inside-sales', text: 'Strong Inside Sales Performance', level: 2 },
        { id: 'fuel-margins', text: 'Fuel Margins Remain Healthy', level: 3 },
        { id: 'raised-guidance', text: 'Full-Year Guidance Raised', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'Caseys General Stores Inc. delivered second-quarter fiscal 2026 results that exceeded analyst expectations, driven by strong inside sales performance and healthy fuel margins. The Ankeny, Iowa-based convenience store chain reported earnings per share of $5.53, topping the consensus estimate of $5.21.',
        },
        {
          type: 'paragraph',
          content: 'Net income reached $206.3 million, up 14% from the prior year period. The company also raised its full-year guidance, reflecting confidence in continued momentum across its store network of over 2,600 locations.',
        },
        { type: 'heading', level: 2, content: 'Results Beat Expectations' },
        {
          type: 'paragraph',
          content: 'Caseys reported total revenue of $4.51 billion for the quarter. Diluted EPS of $5.53 represented a 14% increase from $4.85 in the year-ago period. EBITDA grew 17.5% to $410.1 million, demonstrating strong operational execution.',
        },
        {
          type: 'callout',
          content: 'Q2 FY2026: EPS $5.53 vs. $5.21 expected (+14% YoY); EBITDA $410.1M (+17.5% YoY)',
        },
        {
          type: 'paragraph',
          content: 'The results reflected Caseys successful strategy of driving higher-margin inside sales while maintaining disciplined cost management. The company continues to benefit from its strong presence in Midwestern markets.',
        },
        { type: 'heading', level: 2, content: 'Strong Inside Sales Performance' },
        {
          type: 'paragraph',
          content: 'Inside same-store sales increased 3.3% compared to the prior year, with an impressive 7.5% growth on a two-year stacked basis. Inside margin reached 42.4%, reflecting the profitability of Caseys prepared food and grocery offerings.',
        },
        {
          type: 'paragraph',
          content: 'Total inside gross profit grew 13.5% to $703.4 million, driven by the companys popular pizza program and expanded foodservice offerings. Caseys has differentiated itself through its made-from-scratch pizza, which drives customer traffic and loyalty.',
        },
        {
          type: 'list',
          items: [
            'Inside same-store sales: +3.3% YoY',
            'Inside margin: 42.4%',
            'Total inside gross profit: $703.4M (+13.5%)',
            'Fuel margin: 41.6 cents per gallon',
          ],
        },
        { type: 'heading', level: 3, content: 'Fuel Margins Remain Healthy' },
        {
          type: 'paragraph',
          content: 'Same-store fuel gallons increased 0.8% with a fuel margin of 41.6 cents per gallon. Total fuel gross profit jumped 20.9% to $377.4 million compared to the prior year, benefiting from favorable wholesale fuel dynamics.',
        },
        { type: 'heading', level: 2, content: 'Full-Year Guidance Raised' },
        {
          type: 'paragraph',
          content: 'Caseys raised its fiscal 2026 outlook, now expecting EBITDA to increase 15% to 17%. The company projects inside same-store sales growth of 3% to 4% with inside margins of 41% to 42%. The Board approved a quarterly dividend of $0.57 per share.',
        },
        {
          type: 'paragraph',
          content: 'The company ended the quarter with approximately $1.4 billion in available liquidity and repurchased approximately $31 million of shares during the period. Caseys continues to execute on its growth strategy through new store development and strategic acquisitions.',
        },
      ],
      tags: ['Caseys', 'Convenience Store', 'Fuel', 'Consumer', 'Earnings'],
    },
    // Article 4: Cracker Barrel Q1 FY2026 Earnings
    {
      slug: 'cracker-barrel-q1-fy2026-earnings-loss-guidance-cut',
      title: 'Cracker Barrel Plunges After Q1 Loss, Slashes Full-Year Outlook',
      excerpt: 'Restaurant chain reports adjusted loss of $0.74 per share vs. $0.68 loss expected. Revenue falls 5.7% as rebranding efforts struggle. Company cuts FY2026 EBITDA guidance to $70-110 million from $150-190 million.',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop',
      readTime: 5,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['CBRL', 'DRI', 'TXRH', 'EAT'],
      authorId: authorMap['Maria Santos'] || authors[0].id,
      marketsCategoryId: categoryMap['us-markets'],
      businessCategoryId: categoryMap['consumption'],
      headings: [
        { id: 'results-miss', text: 'Results Miss Expectations', level: 2 },
        { id: 'rebranding-struggles', text: 'Rebranding Efforts Struggle', level: 2 },
        { id: 'guidance-slashed', text: 'Full-Year Guidance Slashed', level: 3 },
        { id: 'turnaround-timeline', text: 'Extended Turnaround Timeline', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'Cracker Barrel Old Country Store reported first-quarter fiscal 2026 results that missed expectations and prompted a dramatic reduction in full-year guidance, sending shares down more than 11% in after-hours trading. The restaurant and retail chain posted an adjusted loss of $0.74 per share, worse than the $0.68 loss analysts expected.',
        },
        {
          type: 'paragraph',
          content: 'Total revenue of $797.2 million fell 5.7% year-over-year and missed the $802.2 million consensus. The disappointing results reflect ongoing challenges with the companys rebranding initiative, which has failed to resonate with customers.',
        },
        { type: 'heading', level: 2, content: 'Results Miss Expectations' },
        {
          type: 'paragraph',
          content: 'Cracker Barrel reported a GAAP net loss of $24.6 million for the quarter. Comparable store restaurant sales declined 4.7% while comparable store retail sales fell 8.5%, reflecting weak traffic trends across both segments.',
        },
        {
          type: 'callout',
          content: 'Q1 FY2026: Adj. loss ($0.74) vs. ($0.68) expected; Revenue $797.2M (-5.7% YoY)',
        },
        {
          type: 'paragraph',
          content: 'Adjusted EBITDA was just $7.2 million, a fraction of prior year levels. The company has struggled to maintain traffic as consumers pull back on dining out amid economic uncertainty and as the rebranding campaign has created confusion among loyal customers.',
        },
        { type: 'heading', level: 2, content: 'Rebranding Efforts Struggle' },
        {
          type: 'paragraph',
          content: 'Cracker Barrel unveiled a new logo and brand refresh in August, but the initiative has been poorly received. The stock has lost more than half its value since the rebranding announcement as customers and investors question the strategic direction.',
        },
        {
          type: 'quote',
          content: 'First quarter results were below our expectations amid unique and ongoing headwinds. We have adjusted our operational initiatives, menu, and marketing to ensure we are consistently delivering delicious food and exceptional experiences.',
          attribution: 'Julie Masino, President and CEO',
        },
        {
          type: 'paragraph',
          content: 'Management acknowledged the challenges and indicated they are recalibrating the approach to better connect with Cracker Barrels traditional customer base while attempting to attract new guests.',
        },
        { type: 'heading', level: 3, content: 'Full-Year Guidance Slashed' },
        {
          type: 'paragraph',
          content: 'The company dramatically lowered its fiscal 2026 outlook. Adjusted EBITDA guidance was cut to $70 million to $110 million, down from the prior range of $150 million to $190 million. Revenue is now expected at $3.2 billion to $3.3 billion.',
        },
        {
          type: 'list',
          items: [
            'FY2026 EBITDA guidance: $70-110M (was $150-190M)',
            'FY2026 revenue guidance: $3.2-3.3B',
            'Comparable restaurant sales: -4.7%',
            'Comparable retail sales: -8.5%',
            'Quarterly dividend: $0.25 per share maintained',
          ],
        },
        { type: 'heading', level: 2, content: 'Extended Turnaround Timeline' },
        {
          type: 'paragraph',
          content: 'CEO Julie Masino warned that the recovery will take time as the company implements cost savings initiatives and refines its operational approach. Capital expenditures were reduced to $110 million to $125 million as Cracker Barrel preserves cash.',
        },
        {
          type: 'paragraph',
          content: 'The company maintained its quarterly dividend of $0.25 per share despite the challenging results, payable February 11, 2026. Available liquidity stood at $485 million at quarter end, providing some financial cushion during the turnaround effort.',
        },
      ],
      tags: ['Cracker Barrel', 'Restaurant', 'Dining', 'Consumer', 'Earnings'],
    },
    // Article 5: Dave & Busters Q3 2025 Earnings
    {
      slug: 'dave-and-busters-q3-2025-earnings-loss-widens',
      title: 'Dave and Busters Reports Wider Q3 Loss as Revenue Declines',
      excerpt: 'Entertainment chain posts adjusted loss of $1.14 per share vs. $1.01 expected. Revenue falls to $448.2 million as comparable store sales drop 4%. CEO cites progress on back-to-basics plan.',
      imageUrl: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=1920&h=1080&fit=crop',
      readTime: 5,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['PLAY', 'BOWL', 'FUN', 'SIX'],
      authorId: authorMap['Michael Torres'] || authors[0].id,
      marketsCategoryId: categoryMap['us-markets'],
      businessCategoryId: categoryMap['consumption'],
      headings: [
        { id: 'loss-widens', text: 'Loss Widens on Revenue Decline', level: 2 },
        { id: 'comp-sales-drop', text: 'Comparable Sales Decline', level: 2 },
        { id: 'back-to-basics', text: 'Back-to-Basics Strategy', level: 3 },
        { id: 'expansion-continues', text: 'Store Expansion Continues', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'Dave and Busters Entertainment reported third-quarter 2025 results that missed expectations as the entertainment and dining chain continues to navigate challenging consumer spending trends. The company posted an adjusted loss of $1.14 per share, wider than the $1.01 loss analysts expected.',
        },
        {
          type: 'paragraph',
          content: 'Revenue of $448.2 million fell short of the $461.3 million consensus and declined from $453 million in the prior year period. Shares edged lower in after-hours trading as investors assessed the companys turnaround progress.',
        },
        { type: 'heading', level: 2, content: 'Loss Widens on Revenue Decline' },
        {
          type: 'paragraph',
          content: 'Dave and Busters reported a GAAP net loss of $42.1 million, or $1.22 per share, for the quarter. Adjusted EBITDA declined to $59.4 million from $68.3 million in the year-ago quarter, reflecting deleverage on lower sales.',
        },
        {
          type: 'callout',
          content: 'Q3 2025: Adj. loss ($1.14) vs. ($1.01) expected; Revenue $448.2M vs. $461.3M expected',
        },
        {
          type: 'paragraph',
          content: 'The results reflect ongoing pressures on discretionary consumer spending, particularly for experiential entertainment venues. The company has been working to revitalize its offerings and operational execution.',
        },
        { type: 'heading', level: 2, content: 'Comparable Sales Decline' },
        {
          type: 'paragraph',
          content: 'Comparable store sales decreased 4% versus the prior year period, marking continued traffic challenges. Both the Dave and Busters and Main Event brands experienced softness as consumers remain cautious about entertainment spending.',
        },
        {
          type: 'paragraph',
          content: 'The company noted particular weakness in walk-in traffic, while special events and group bookings showed relative resilience. Management is focused on driving incremental visits through enhanced marketing and promotional activities.',
        },
        { type: 'heading', level: 3, content: 'Back-to-Basics Strategy' },
        {
          type: 'quote',
          content: 'I am pleased to report we are making substantive progress on our back-to-basics plan. Weve been hard at work relaunching our marketing engine, reinvigorating our food and beverage offering, improving our operations, refreshing our games platform, and revamping our store remodel program.',
          attribution: 'Tarun Lal, CEO',
        },
        {
          type: 'list',
          items: [
            'Comparable store sales: -4% YoY',
            'Adjusted EBITDA: $59.4M (down from $68.3M)',
            'Available liquidity: $441.9 million',
            'New stores opened Q3: 4 (1 D&B, 3 Main Event)',
          ],
        },
        { type: 'heading', level: 2, content: 'Store Expansion Continues' },
        {
          type: 'paragraph',
          content: 'Dave and Busters opened one new domestic location and three Main Event stores during the quarter. The company expects to open two additional domestic Dave and Busters stores in Q4, bringing fiscal 2025 new openings to 11 stores plus one relocation.',
        },
        {
          type: 'paragraph',
          content: 'International expansion also progressed with the opening of a third franchise location in the Philippines. The company expects at least four additional international franchise stores over the next six months as it pursues global growth opportunities.',
        },
      ],
      tags: ['Dave and Busters', 'Entertainment', 'Gaming', 'Consumer', 'Earnings'],
    },
    // Article 6: Braze Q3 FY2026 Earnings
    {
      slug: 'braze-q3-fy2026-earnings-beat-stock-soars',
      title: 'Braze Stock Surges After Strong Q3 Beat, Raises Full-Year Guidance',
      excerpt: 'Customer engagement platform reports revenue of $190.8 million, up 25.5% and topping estimates. Company swings to positive operating income. Large customer count grows 29% to 303.',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop',
      readTime: 5,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['BRZE', 'TWLO', 'HUB', 'CRM'],
      authorId: authorMap['Sarah Chen'] || authors[0].id,
      marketsCategoryId: categoryMap['us-markets'],
      businessCategoryId: categoryMap['tech'],
      headings: [
        { id: 'beats-estimates', text: 'Strong Beat Across Metrics', level: 2 },
        { id: 'profitability', text: 'Swing to Profitability', level: 2 },
        { id: 'customer-growth', text: 'Large Customer Growth Accelerates', level: 3 },
        { id: 'raised-guidance', text: 'Full-Year Guidance Raised', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'Braze Inc. delivered third-quarter fiscal 2026 results that significantly exceeded expectations, sending shares up more than 7% in after-hours trading. The customer engagement platform reported revenue of $190.8 million, representing 25.5% year-over-year growth and topping the consensus estimate of $184.2 million.',
        },
        {
          type: 'paragraph',
          content: 'The company also achieved a milestone by swinging to positive non-GAAP operating income and generating strong free cash flow, demonstrating the scalability of its business model as it reaches greater scale.',
        },
        { type: 'heading', level: 2, content: 'Strong Beat Across Metrics' },
        {
          type: 'paragraph',
          content: 'Braze reported earnings per share of $0.06, meeting expectations while dramatically improving profitability metrics. Billings reached $200.3 million, up 22.4% year-over-year, indicating healthy demand for the companys customer engagement solutions.',
        },
        {
          type: 'callout',
          content: 'Q3 FY2026: Revenue $190.8M (+25.5% YoY) vs. $184.2M expected; Non-GAAP operating income $5.1M',
        },
        {
          type: 'paragraph',
          content: 'The results reflected Brazes success in helping brands orchestrate personalized customer communications across email, mobile, and web channels. The platform has become increasingly critical as companies focus on customer retention and engagement efficiency.',
        },
        { type: 'heading', level: 2, content: 'Swing to Profitability' },
        {
          type: 'paragraph',
          content: 'Braze achieved non-GAAP operating income of $5.1 million, compared to a loss of $2.2 million in the year-ago quarter. Free cash flow reached $17.8 million versus a loss of $14.2 million in Q3 2025, marking a dramatic turnaround.',
        },
        {
          type: 'paragraph',
          content: 'Free cash flow margin improved to 9.3%, up from 2% in the previous quarter. The profitability improvement demonstrates Brazes operating leverage as it scales revenue while maintaining disciplined cost management.',
        },
        { type: 'heading', level: 3, content: 'Large Customer Growth Accelerates' },
        {
          type: 'paragraph',
          content: 'Customers generating over $500,000 in annual recurring revenue grew 29% year-over-year to 303, up from 234. Total customer count reached 2,528, with net revenue retention rate holding steady at 108%.',
        },
        {
          type: 'list',
          items: [
            'Total customers: 2,528 (up from 2,422)',
            'Large customers ($500K+ ARR): 303 (+29% YoY)',
            'Net revenue retention: 108%',
            'Free cash flow margin: 9.3%',
            'Billings: $200.3M (+22.4% YoY)',
          ],
        },
        { type: 'heading', level: 2, content: 'Full-Year Guidance Raised' },
        {
          type: 'paragraph',
          content: 'Braze raised its fiscal 2026 outlook across all metrics. The company now expects full-year revenue of $730.5 million to $731.5 million, above the prior $717.7 million analyst estimate. Adjusted EPS guidance was lifted to $0.42 to $0.43.',
        },
        {
          type: 'paragraph',
          content: 'For Q4, Braze projects revenue of $197.5 million to $198.5 million, representing approximately 23% year-over-year growth. The raised guidance reflects confidence in sustained demand for customer engagement technology as brands prioritize personalization and retention.',
        },
      ],
      tags: ['Braze', 'Software', 'SaaS', 'Marketing', 'Earnings'],
    },
  ]

  // Create articles
  for (const articleData of articlesData) {
    const { tags: tagNames, ...data } = articleData

    // Check if article already exists
    const existing = await prisma.article.findUnique({
      where: { slug: data.slug }
    })

    if (existing) {
      console.log(`Article "${data.slug}" already exists, skipping...`)
      continue
    }

    const tagConnections = tagNames.map(name => ({ id: tags[name] })).filter(t => t.id)

    await prisma.article.create({
      data: {
        ...data,
        tags: {
          connect: tagConnections,
        },
      },
    })
    console.log(`Created article: ${data.title}`)
  }

  console.log('Done! Added December 9, 2025 earnings articles.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
