import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Adding 10 articles from Wall St Engine content...')

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
    'NVIDIA', 'China', 'AI', 'Semiconductors', 'Coca-Cola', 'Trump',
    'Consumer Goods', 'Federal Reserve', 'Interest Rates', 'Chevron',
    'Oil', 'M&A', 'Uber', 'Robotaxi', 'Electric Vehicles', 'ByteDance',
    'TikTok', 'Social Media', 'OpenAI', 'Valuation', 'Meta', 'Talent',
    'CoreWeave', 'Cloud Computing', 'Data Center', 'S&P 500', 'Market Analysis'
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
    // Article 1: NVIDIA H20 China chip sales
    {
      slug: 'nvidia-resumes-h20-chip-exports-china-approval',
      title: 'NVIDIA Receives U.S. Approval to Resume H20 GPU Exports to China',
      excerpt: 'CEO Jensen Huang confirms regulatory clearance for H20 chip sales to Chinese customers, with analysts estimating $10 billion in inventory could now be monetized. AMD also receives approval for MI308 shipments.',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop',
      readTime: 5,
      isFeatured: true,
      isBreaking: false,
      relevantTickers: ['NVDA', 'AMD', 'INTC'],
      authorId: authorMap['David Kim'] || authors[0].id,
      marketsCategoryId: categoryMap['us-markets'],
      businessCategoryId: categoryMap['tech'],
      headings: [
        { id: 'regulatory-approval', text: 'Regulatory Approval Opens China Market', level: 2 },
        { id: 'inventory-monetization', text: 'Inventory Monetization Opportunity', level: 2 },
        { id: 'amd-approval', text: 'AMD Also Receives Clearance', level: 3 },
        { id: 'market-implications', text: 'Market Implications', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'NVIDIA Corporation has received approval from the United States government to resume exports of its H20 graphics processing units to China, according to CEO Jensen Huang. The development marks a significant shift in the ongoing semiconductor trade dynamics between the world\'s two largest economies.',
        },
        {
          type: 'paragraph',
          content: 'The H20 chip, designed specifically to comply with U.S. export restrictions, represents NVIDIA\'s primary offering for the Chinese market. The approval comes after months of uncertainty regarding the regulatory status of these modified processors.',
        },
        { type: 'heading', level: 2, content: 'Regulatory Approval Opens China Market' },
        {
          type: 'paragraph',
          content: 'The clearance allows NVIDIA to serve Chinese customers seeking AI computing capabilities while remaining compliant with U.S. national security requirements. Chinese technology companies and cloud providers have been eager to access these chips for their artificial intelligence initiatives.',
        },
        {
          type: 'callout',
          content: 'NVIDIA H20 chips are designed to meet U.S. export control thresholds while still delivering substantial AI computing performance',
        },
        {
          type: 'paragraph',
          content: 'Industry observers note that the approval reflects a calibrated approach by U.S. regulators, seeking to balance national security concerns with the commercial interests of American semiconductor companies.',
        },
        { type: 'heading', level: 2, content: 'Inventory Monetization Opportunity' },
        {
          type: 'paragraph',
          content: 'Wall Street analysts estimate that NVIDIA has accumulated approximately $10 billion worth of H20 inventory that can now be sold to Chinese customers. This inventory buildup occurred during the period of regulatory uncertainty.',
        },
        {
          type: 'quote',
          content: 'The approval to resume H20 exports represents a meaningful near-term revenue opportunity for NVIDIA, with significant inventory ready for immediate shipment.',
          attribution: 'Bank of America Semiconductor Analyst',
        },
        {
          type: 'paragraph',
          content: 'The monetization of this inventory could provide a substantial boost to NVIDIA\'s data center revenue in the coming quarters, though the long-term trajectory of China sales remains subject to evolving regulatory dynamics.',
        },
        { type: 'heading', level: 3, content: 'AMD Also Receives Clearance' },
        {
          type: 'paragraph',
          content: 'Advanced Micro Devices has also received approval for its MI308 chip shipments to China. Bank of America projects this could generate an additional $1-2 billion in revenue for AMD during 2025-2026.',
        },
        {
          type: 'list',
          items: [
            'NVIDIA H20: Designed for China compliance, now cleared for export',
            'AMD MI308: Approved for Chinese market, $1-2B revenue potential',
            'Combined inventory value: Estimated $10B+ ready for monetization',
            'Timeline: Immediate shipments expected to commence',
          ],
        },
        { type: 'heading', level: 2, content: 'Market Implications' },
        {
          type: 'paragraph',
          content: 'The regulatory clearance removes a significant overhang from both NVIDIA and AMD shares. Investors had been concerned about the companies\' ability to serve the Chinese market, which represents a substantial portion of global AI chip demand.',
        },
        {
          type: 'paragraph',
          content: 'However, analysts caution that the broader U.S.-China technology competition continues to create uncertainty. Future regulatory changes could impact the long-term accessibility of the Chinese market for American semiconductor companies.',
        },
      ],
      tags: ['NVIDIA', 'China', 'AI', 'Semiconductors'],
    },
    // Article 2: Coca-Cola formula change
    {
      slug: 'coca-cola-formula-change-trump-corn-syrup-cane-sugar',
      title: 'Trump Claims Coca-Cola to Switch U.S. Formula from Corn Syrup to Cane Sugar',
      excerpt: 'ADM and Ingredion shares fall 6-7% on reports that Coca-Cola may change its U.S. sweetener, though the beverage giant has not confirmed the switch. Raw sugar futures jump over 1%.',
      imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=1920&h=1080&fit=crop',
      readTime: 4,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['KO', 'ADM', 'INGR'],
      authorId: authorMap['Lisa Park'] || authors[0].id,
      marketsCategoryId: categoryMap['us-markets'],
      businessCategoryId: categoryMap['consumption'],
      headings: [
        { id: 'formula-announcement', text: 'The Formula Announcement', level: 2 },
        { id: 'market-reaction', text: 'Market Reaction', level: 2 },
        { id: 'supply-challenges', text: 'Supply Chain Challenges', level: 3 },
        { id: 'industry-impact', text: 'Broader Industry Impact', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'President Trump announced that Coca-Cola has agreed to switch its U.S. formula from high-fructose corn syrup (HFCS) to cane sugar, though the beverage company has not officially confirmed the change. The announcement sent shockwaves through agricultural commodity markets.',
        },
        {
          type: 'paragraph',
          content: 'Coca-Cola indicated that more announcements would be forthcoming, neither confirming nor denying the specific formula change. The company has historically used different sweeteners in different markets, with Mexican Coca-Cola notably using cane sugar.',
        },
        { type: 'heading', level: 2, content: 'The Formula Announcement' },
        {
          type: 'paragraph',
          content: 'The potential switch represents a significant departure from decades of U.S. beverage industry practice. American soft drink manufacturers transitioned to high-fructose corn syrup in the 1980s due to lower costs and abundant domestic corn supply.',
        },
        {
          type: 'callout',
          content: 'U.S. produces approximately 4 million tons of cane sugar annually versus 12.5 million tons consumed',
        },
        {
          type: 'paragraph',
          content: 'Consumer advocates have long argued that cane sugar produces a superior taste, pointing to the popularity of "Mexican Coke" among American consumers willing to pay premium prices for the cane sugar version.',
        },
        { type: 'heading', level: 2, content: 'Market Reaction' },
        {
          type: 'paragraph',
          content: 'Shares of Archer-Daniels-Midland and Ingredion, major producers of high-fructose corn syrup, fell 6-7% in premarket trading. These companies have significant exposure to the beverage industry sweetener market.',
        },
        {
          type: 'list',
          items: [
            'ADM: Down 6.2% in premarket trading',
            'Ingredion: Down 7.1% in premarket trading',
            'Raw sugar futures: Up 1.3%',
            'Corn futures: Down 0.8%',
          ],
        },
        {
          type: 'paragraph',
          content: 'Raw sugar futures jumped over 1% on the news, as traders anticipated increased demand for cane sugar from the beverage industry. The sugar market has been relatively subdued in recent months.',
        },
        { type: 'heading', level: 3, content: 'Supply Chain Challenges' },
        {
          type: 'paragraph',
          content: 'Industry analysts raised significant questions about the feasibility of a large-scale switch to cane sugar. The United States produces only about 4 million tons of cane sugar annually, while consuming approximately 12.5 million tons.',
        },
        {
          type: 'quote',
          content: 'A formula switch at scale would require substantially increased imports from Brazil and Mexico, potentially complicated by existing tariff structures.',
          attribution: 'Agricultural Commodities Analyst',
        },
        {
          type: 'paragraph',
          content: 'The Trump administration\'s tariff policies could complicate efforts to source additional cane sugar from international markets, potentially increasing costs for beverage manufacturers.',
        },
        { type: 'heading', level: 2, content: 'Broader Industry Impact' },
        {
          type: 'paragraph',
          content: 'If Coca-Cola proceeds with the formula change, other beverage manufacturers may face pressure to follow suit. PepsiCo and other major soft drink companies would likely face similar consumer and political pressure to switch sweeteners.',
        },
        {
          type: 'paragraph',
          content: 'The development underscores the intersection of politics, consumer preferences, and agricultural policy in the American food and beverage industry.',
        },
      ],
      tags: ['Coca-Cola', 'Trump', 'Consumer Goods'],
    },
    // Article 3: Federal Reserve Jerome Powell
    {
      slug: 'federal-reserve-powell-termination-concerns-deutsche-bank',
      title: 'Deutsche Bank Warns Fed Independence Under Threat as Powell Termination Floated',
      excerpt: 'Reports emerge of a draft termination letter for Fed Chair Powell, though removal described as "highly unlikely." Deutsche Bank calls it one of the largest underpriced event risks in markets.',
      imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1920&h=1080&fit=crop',
      readTime: 5,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['SPY', 'TLT', 'DXY'],
      authorId: authorMap['Jennifer Walsh'] || authors[0].id,
      marketsCategoryId: categoryMap['us-markets'],
      businessCategoryId: categoryMap['economy'],
      headings: [
        { id: 'termination-reports', text: 'Termination Reports Surface', level: 2 },
        { id: 'market-implications', text: 'Market Risk Assessment', level: 2 },
        { id: 'fed-independence', text: 'Federal Reserve Independence', level: 3 },
        { id: 'outlook', text: 'Outlook and Timeline', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'Deutsche Bank has identified potential threats to Federal Reserve independence as one of the largest underpriced event risks in financial markets, following reports that a draft termination letter for Fed Chair Jerome Powell was shown to lawmakers.',
        },
        {
          type: 'paragraph',
          content: 'While the prospect of removing Powell was subsequently described as "highly unlikely," the mere existence of such discussions has raised concerns among investors about the future of central bank autonomy in the United States.',
        },
        { type: 'heading', level: 2, content: 'Termination Reports Surface' },
        {
          type: 'paragraph',
          content: 'According to reports, President Trump showed lawmakers a draft termination letter for Federal Reserve Chairman Jerome Powell before reversing course. The episode highlights ongoing tensions between the administration and the central bank over monetary policy.',
        },
        {
          type: 'callout',
          content: 'Polymarket prices a 19% probability of Powell removal before his term ends in May 2026',
        },
        {
          type: 'paragraph',
          content: 'Powell\'s term as Fed Chair extends until May 2026, and any attempt to remove him before then would face significant legal and institutional obstacles. The Federal Reserve Act provides for removal only "for cause," a standard that has never been tested in court.',
        },
        { type: 'heading', level: 2, content: 'Market Risk Assessment' },
        {
          type: 'paragraph',
          content: 'Deutsche Bank strategists argue that markets have not adequately priced the risk of Federal Reserve independence being compromised. Such a development could have profound implications for bond markets, currency valuations, and inflation expectations.',
        },
        {
          type: 'quote',
          content: 'The independence of the Federal Reserve is foundational to U.S. financial market credibility. Any erosion of that independence would likely trigger significant market volatility.',
          attribution: 'Deutsche Bank Global Strategy',
        },
        {
          type: 'paragraph',
          content: 'Historical precedents suggest that perceived interference with central bank independence typically results in higher long-term interest rates, currency depreciation, and elevated inflation expectations.',
        },
        { type: 'heading', level: 3, content: 'Federal Reserve Independence' },
        {
          type: 'paragraph',
          content: 'The Federal Reserve\'s independence from political interference has been a cornerstone of American economic policy since the Volcker era. This autonomy allows the central bank to make unpopular decisions necessary for long-term economic stability.',
        },
        {
          type: 'list',
          items: [
            'Fed Chair term: Extends to May 2026',
            'Legal standard: Removal only "for cause"',
            'Market pricing: 19% removal probability (Polymarket)',
            'Deutsche Bank: One of largest underpriced risks',
          ],
        },
        {
          type: 'paragraph',
          content: 'International investors closely monitor Fed independence, as it underpins the dollar\'s status as the global reserve currency and the perceived safety of U.S. Treasury securities.',
        },
        { type: 'heading', level: 2, content: 'Outlook and Timeline' },
        {
          type: 'paragraph',
          content: 'Despite the concerning reports, most analysts expect Powell to serve out his remaining term. The legal and institutional barriers to removal remain substantial, and the market impact of such an unprecedented action would likely deter any serious attempt.',
        },
        {
          type: 'paragraph',
          content: 'Investors are advised to monitor developments closely, as any escalation could have immediate and significant implications for interest rate markets and the broader financial system.',
        },
      ],
      tags: ['Federal Reserve', 'Interest Rates', 'Market Analysis'],
    },
    // Article 4: Chevron-Hess merger
    {
      slug: 'chevron-hess-53-billion-merger-closes-guyana-stake',
      title: 'Chevron Completes $53 Billion Hess Acquisition, Gains Major Guyana Stake',
      excerpt: 'Energy giant finalizes landmark deal after ExxonMobil arbitration challenge fails, securing 30% stake in prolific Stabroek oil field expected to produce 1.2 million barrels daily by 2027.',
      imageUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=1920&h=1080&fit=crop',
      readTime: 5,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['CVX', 'HES', 'XOM'],
      authorId: authorMap['Robert Hayes'] || authors[0].id,
      marketsCategoryId: categoryMap['us-markets'],
      businessCategoryId: categoryMap['industrial'],
      headings: [
        { id: 'deal-closes', text: 'Deal Closes After Arbitration', level: 2 },
        { id: 'guyana-stake', text: 'Strategic Guyana Position', level: 2 },
        { id: 'production-outlook', text: 'Production Outlook', level: 3 },
        { id: 'industry-implications', text: 'Industry Implications', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'Chevron Corporation has completed its $53 billion acquisition of Hess Corporation, marking one of the largest oil and gas transactions in recent years. The deal closes after ExxonMobil\'s arbitration challenge regarding right-of-first-refusal provisions failed to block the merger.',
        },
        {
          type: 'paragraph',
          content: 'The transaction significantly strengthens Chevron\'s position in the emerging Guyana oil province, which has become one of the most important new production regions globally.',
        },
        { type: 'heading', level: 2, content: 'Deal Closes After Arbitration' },
        {
          type: 'paragraph',
          content: 'ExxonMobil had challenged the acquisition, arguing that its joint operating agreement in Guyana included provisions that could have blocked or complicated the transfer of Hess\'s stake. The arbitration ruling cleared the path for deal completion.',
        },
        {
          type: 'callout',
          content: 'Chevron acquires 30% stake in Guyana\'s Stabroek block, one of the world\'s most prolific new oil discoveries',
        },
        {
          type: 'paragraph',
          content: 'The successful closure represents a major strategic victory for Chevron, which gains access to low-cost barrels in a politically stable jurisdiction at a time when new large-scale oil discoveries have become increasingly rare.',
        },
        { type: 'heading', level: 2, content: 'Strategic Guyana Position' },
        {
          type: 'paragraph',
          content: 'The Stabroek block offshore Guyana has emerged as one of the most significant oil discoveries of the past decade. Operator ExxonMobil has made numerous discoveries in the block, with estimated recoverable resources exceeding 11 billion barrels of oil equivalent.',
        },
        {
          type: 'quote',
          content: 'The Hess acquisition transforms Chevron\'s portfolio, adding high-quality, low-cost barrels with significant growth potential in one of the world\'s premier new oil provinces.',
          attribution: 'Chevron CEO',
        },
        {
          type: 'paragraph',
          content: 'Chevron\'s 30% stake positions the company alongside ExxonMobil (45%) and CNOOC (25%) in the joint venture. The partnership has already sanctioned multiple development projects and continues to explore for additional resources.',
        },
        { type: 'heading', level: 3, content: 'Production Outlook' },
        {
          type: 'paragraph',
          content: 'Production from the Stabroek block is expected to reach 1.2 million barrels per day by 2027, making Guyana one of the world\'s largest oil exporters on a per-capita basis. Current production has already ramped up significantly with multiple floating production vessels in operation.',
        },
        {
          type: 'list',
          items: [
            'Current production: Multiple FPSOs operational',
            'Target production: 1.2 million barrels/day by 2027',
            'Recoverable resources: 11+ billion barrels',
            'Chevron stake: 30% of Stabroek block',
          ],
        },
        {
          type: 'paragraph',
          content: 'The low breakeven cost of Guyanese oil, estimated at around $25-35 per barrel, provides attractive economics even in lower price environments.',
        },
        { type: 'heading', level: 2, content: 'Industry Implications' },
        {
          type: 'paragraph',
          content: 'The Chevron-Hess deal reflects ongoing consolidation in the oil and gas industry as major companies seek to strengthen their portfolios. The transaction follows other large deals as companies position for long-term production in an evolving energy landscape.',
        },
        {
          type: 'paragraph',
          content: 'Analysts expect continued M&A activity in the sector as companies seek to acquire high-quality assets capable of generating returns across various commodity price scenarios.',
        },
      ],
      tags: ['Chevron', 'Oil', 'M&A'],
    },
    // Article 5: Uber Robotaxi partnerships
    {
      slug: 'uber-robotaxi-lucid-baidu-partnerships-autonomous-vehicles',
      title: 'Uber Invests $300 Million in Lucid, Plans 20,000 Robotaxis Starting 2026',
      excerpt: 'Ride-sharing giant announces major autonomous vehicle partnerships with Lucid Motors and Baidu\'s Apollo Go, signaling accelerated push into driverless transportation.',
      imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1920&h=1080&fit=crop',
      readTime: 4,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['UBER', 'LCID', 'BIDU'],
      authorId: authorMap['Emma Thompson'] || authors[0].id,
      marketsCategoryId: categoryMap['us-markets'],
      businessCategoryId: categoryMap['transportation'],
      headings: [
        { id: 'lucid-partnership', text: 'Lucid Partnership Details', level: 2 },
        { id: 'baidu-expansion', text: 'Baidu Apollo Expansion', level: 2 },
        { id: 'robotaxi-strategy', text: 'Robotaxi Strategy', level: 3 },
        { id: 'market-outlook', text: 'Autonomous Vehicle Market Outlook', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'Uber Technologies has announced a $300 million investment in Lucid Motors as part of a broader partnership to deploy over 20,000 robotaxis on its platform starting in 2026. The agreement represents Uber\'s most significant commitment to autonomous vehicle technology to date.',
        },
        {
          type: 'paragraph',
          content: 'Separately, Uber has partnered with Baidu\'s Apollo Go for autonomous vehicle deployment across Asia and the Middle East, leveraging the Chinese company\'s experience operating one of the world\'s largest robotaxi fleets.',
        },
        { type: 'heading', level: 2, content: 'Lucid Partnership Details' },
        {
          type: 'paragraph',
          content: 'The Lucid partnership will see Uber acquire a significant stake in the electric vehicle manufacturer while securing access to purpose-built autonomous vehicles. Lucid\'s advanced electric vehicle technology and manufacturing capabilities make it an attractive partner for Uber\'s robotaxi ambitions.',
        },
        {
          type: 'callout',
          content: 'Uber plans to deploy 20,000+ Lucid-based robotaxis starting 2026',
        },
        {
          type: 'paragraph',
          content: 'The vehicles will be designed specifically for autonomous ride-sharing applications, incorporating Lucid\'s battery technology and vehicle architecture with autonomous driving systems.',
        },
        { type: 'heading', level: 2, content: 'Baidu Apollo Expansion' },
        {
          type: 'paragraph',
          content: 'Baidu\'s Apollo Go has completed over 11 million autonomous rides across 15 cities in China, making it one of the most experienced operators in the robotaxi space. The partnership with Uber will bring this expertise to new markets in Asia and the Middle East.',
        },
        {
          type: 'quote',
          content: 'Apollo Go\'s proven track record of safe autonomous operations positions us well to expand into new markets alongside Uber\'s global platform.',
          attribution: 'Baidu Autonomous Driving Executive',
        },
        {
          type: 'paragraph',
          content: 'The collaboration leverages Baidu\'s autonomous driving technology while utilizing Uber\'s established platform for passenger acquisition and fleet management.',
        },
        { type: 'heading', level: 3, content: 'Robotaxi Strategy' },
        {
          type: 'paragraph',
          content: 'Uber\'s multi-partner approach to autonomous vehicles reflects a strategic decision to work with multiple technology providers rather than developing proprietary autonomous driving systems.',
        },
        {
          type: 'list',
          items: [
            'Lucid investment: $300 million',
            'Planned robotaxi fleet: 20,000+ vehicles',
            'Launch timeline: Starting 2026',
            'Baidu Apollo rides completed: 11+ million',
          ],
        },
        {
          type: 'paragraph',
          content: 'This partnership model allows Uber to access diverse autonomous technologies while maintaining flexibility as the industry evolves.',
        },
        { type: 'heading', level: 2, content: 'Autonomous Vehicle Market Outlook' },
        {
          type: 'paragraph',
          content: 'The autonomous vehicle ride-sharing market is projected to grow significantly over the coming decade as technology matures and regulatory frameworks develop. Uber\'s partnerships position the company to participate in this growth across multiple geographies.',
        },
        {
          type: 'paragraph',
          content: 'Competition in the robotaxi space continues to intensify, with Waymo, Cruise, and other operators expanding their operations. Uber\'s platform scale provides a potential competitive advantage in deploying autonomous vehicles at scale.',
        },
      ],
      tags: ['Uber', 'Robotaxi', 'Electric Vehicles'],
    },
    // Article 6: ByteDance revenue
    {
      slug: 'bytedance-155-billion-revenue-tiktok-growth-2024',
      title: 'ByteDance Revenue Jumps 29% to $155 Billion, Driven by TikTok International Growth',
      excerpt: 'Chinese tech giant reports strong 2024 results with TikTok international sales surging 63% to $39 billion, now comprising a quarter of total revenue. Net profit reaches approximately $33 billion.',
      imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1920&h=1080&fit=crop',
      readTime: 4,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: [],
      authorId: authorMap['Sarah Chen'] || authors[0].id,
      marketsCategoryId: categoryMap['asia-markets'],
      businessCategoryId: categoryMap['media'],
      headings: [
        { id: 'revenue-growth', text: 'Revenue Growth Accelerates', level: 2 },
        { id: 'tiktok-performance', text: 'TikTok International Performance', level: 2 },
        { id: 'profitability', text: 'Strong Profitability', level: 3 },
        { id: 'regulatory-challenges', text: 'Regulatory Challenges Persist', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'ByteDance, the Chinese technology company behind TikTok, reported $155 billion in revenue for 2024, representing a 29% increase from the prior year according to Bloomberg. The results demonstrate the company\'s continued growth despite ongoing regulatory scrutiny in key markets.',
        },
        {
          type: 'paragraph',
          content: 'TikTok\'s international operations emerged as the primary growth driver, with sales jumping 63% to reach $39 billion. The platform now contributes approximately one quarter of ByteDance\'s total revenue.',
        },
        { type: 'heading', level: 2, content: 'Revenue Growth Accelerates' },
        {
          type: 'paragraph',
          content: 'ByteDance\'s 29% revenue growth marks another year of strong expansion for the privately held company. The growth reflects continued user engagement across its portfolio of apps and improving monetization through advertising and e-commerce.',
        },
        {
          type: 'callout',
          content: 'ByteDance 2024: $155B revenue (+29%), TikTok international $39B (+63%)',
        },
        {
          type: 'paragraph',
          content: 'The company\'s domestic Chinese operations, including Douyin (the Chinese version of TikTok) and news aggregator Toutiao, continue to generate substantial revenue despite a challenging advertising market in China.',
        },
        { type: 'heading', level: 2, content: 'TikTok International Performance' },
        {
          type: 'paragraph',
          content: 'TikTok\'s international revenue growth of 63% significantly outpaced the overall company growth rate, highlighting the platform\'s success in monetizing its massive global user base. The short-form video app has become one of the world\'s most popular social media platforms.',
        },
        {
          type: 'quote',
          content: 'TikTok has successfully transitioned from a user acquisition phase to meaningful monetization, with advertising and commerce revenue scaling rapidly across markets.',
          attribution: 'Technology Industry Analyst',
        },
        {
          type: 'paragraph',
          content: 'The platform\'s e-commerce initiatives, particularly TikTok Shop, have contributed meaningfully to revenue growth as the company expands its social commerce capabilities.',
        },
        { type: 'heading', level: 3, content: 'Strong Profitability' },
        {
          type: 'paragraph',
          content: 'ByteDance generated approximately $33 billion in net profit for 2024, demonstrating the company\'s ability to convert its revenue growth into bottom-line results. The profit figure positions ByteDance among the world\'s most profitable technology companies.',
        },
        {
          type: 'list',
          items: [
            'Total revenue: $155 billion (+29% YoY)',
            'TikTok international: $39 billion (+63% YoY)',
            'TikTok share of revenue: ~25%',
            'Net profit: ~$33 billion',
          ],
        },
        { type: 'heading', level: 2, content: 'Regulatory Challenges Persist' },
        {
          type: 'paragraph',
          content: 'Despite strong financial performance, ByteDance continues to face regulatory challenges in key markets. In the United States, TikTok faces potential restrictions or forced divestiture due to national security concerns.',
        },
        {
          type: 'paragraph',
          content: 'The company\'s ability to maintain its growth trajectory will depend in part on navigating these regulatory headwinds while continuing to expand its advertising and commerce businesses globally.',
        },
      ],
      tags: ['ByteDance', 'TikTok', 'Social Media'],
    },
    // Article 7: OpenAI valuation concerns
    {
      slug: 'openai-valuation-concerns-jpmorgan-analysis-27x-revenue',
      title: 'JPMorgan Warns OpenAI\'s 27x Revenue Valuation Faces Headwinds',
      excerpt: 'Investment bank analysis shows OpenAI trading at steep premium to tech peers despite $10 billion ARR. Analysts cite shrinking moat as newer AI models outperform GPT-4.',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&h=1080&fit=crop',
      readTime: 5,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['MSFT', 'GOOGL', 'META'],
      authorId: authorMap['Sarah Chen'] || authors[0].id,
      marketsCategoryId: categoryMap['us-markets'],
      businessCategoryId: categoryMap['tech'],
      headings: [
        { id: 'valuation-analysis', text: 'Valuation Analysis', level: 2 },
        { id: 'competitive-concerns', text: 'Competitive Moat Concerns', level: 2 },
        { id: 'revenue-growth', text: 'Revenue Growth vs. Valuation', level: 3 },
        { id: 'agent-monetization', text: 'Agent Monetization Critical', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'JPMorgan has issued a cautionary analysis on OpenAI\'s valuation, noting that the artificial intelligence company trades at 27 times 2025 estimated revenue compared to approximately 9 times for the "Magnificent Seven" technology companies. The analysis raises questions about the sustainability of OpenAI\'s premium valuation.',
        },
        {
          type: 'paragraph',
          content: 'While OpenAI has achieved $10 billion in annual recurring revenue, representing an impressive 82% growth rate, the bank warns of a potentially shrinking competitive moat as rival AI models demonstrate superior performance in some applications.',
        },
        { type: 'heading', level: 2, content: 'Valuation Analysis' },
        {
          type: 'paragraph',
          content: 'OpenAI\'s current valuation implies extraordinary growth expectations that may be difficult to achieve given intensifying competition. At 27 times forward revenue, the company trades at a significant premium to established technology leaders with proven profitability.',
        },
        {
          type: 'callout',
          content: 'OpenAI: 27x 2025E revenue vs. Magnificent Seven average of 9x',
        },
        {
          type: 'paragraph',
          content: 'The valuation disparity raises questions about whether investors are fully accounting for execution risk and competitive pressures in the rapidly evolving AI landscape.',
        },
        { type: 'heading', level: 2, content: 'Competitive Moat Concerns' },
        {
          type: 'paragraph',
          content: 'JPMorgan analysts highlight concerns about OpenAI\'s competitive position, noting that newer AI models from various competitors have demonstrated capabilities that match or exceed GPT-4 in certain benchmarks and applications.',
        },
        {
          type: 'quote',
          content: 'The AI model landscape is evolving rapidly, and OpenAI\'s first-mover advantage may prove less durable than current valuations imply.',
          attribution: 'JPMorgan Technology Analyst',
        },
        {
          type: 'paragraph',
          content: 'Google, Anthropic, Meta, and other well-resourced competitors continue to advance their AI capabilities, potentially eroding OpenAI\'s market share over time.',
        },
        { type: 'heading', level: 3, content: 'Revenue Growth vs. Valuation' },
        {
          type: 'paragraph',
          content: 'OpenAI\'s 82% ARR growth is impressive but must be weighed against the substantial premium embedded in current valuations. The company needs to maintain exceptional growth rates to justify its valuation relative to peers.',
        },
        {
          type: 'list',
          items: [
            'Annual recurring revenue: $10 billion',
            'ARR growth: 82% year-over-year',
            'Revenue multiple: 27x 2025E',
            'M7 comparison: ~9x 2025E revenue',
          ],
        },
        { type: 'heading', level: 2, content: 'Agent Monetization Critical' },
        {
          type: 'paragraph',
          content: 'JPMorgan identifies AI agent monetization as critical for OpenAI\'s long-term upside. The ability to generate revenue from autonomous AI agents performing tasks could unlock significant new market opportunities beyond the current chatbot and API business.',
        },
        {
          type: 'paragraph',
          content: 'However, the agent market remains nascent, and OpenAI faces competition from multiple well-funded rivals also pursuing agent capabilities. The path to meaningful agent revenue remains uncertain.',
        },
      ],
      tags: ['OpenAI', 'Valuation', 'AI'],
    },
    // Article 8: Meta AI talent
    {
      slug: 'meta-hires-openai-researchers-ai-talent-acquisition',
      title: 'Meta Acquires Top OpenAI Researchers in AI Talent Competition',
      excerpt: 'Facebook parent hires Jason Wei and Hyung Won Chung, experts in reasoning and agentic AI systems, as part of expanded superalignment team building.',
      imageUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1920&h=1080&fit=crop',
      readTime: 4,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['META'],
      authorId: authorMap['David Kim'] || authors[0].id,
      marketsCategoryId: categoryMap['us-markets'],
      businessCategoryId: categoryMap['tech'],
      headings: [
        { id: 'key-hires', text: 'Key Researcher Acquisitions', level: 2 },
        { id: 'expertise-areas', text: 'Areas of Expertise', level: 2 },
        { id: 'superalignment-team', text: 'Superalignment Team Expansion', level: 3 },
        { id: 'talent-competition', text: 'AI Talent Competition Intensifies', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'Meta Platforms has hired two prominent researchers from OpenAI as part of its intensified push to build leading artificial intelligence capabilities. Jason Wei and Hyung Won Chung, recognized experts in reasoning and agentic AI systems, have joined Meta\'s expanding AI research organization.',
        },
        {
          type: 'paragraph',
          content: 'The hires signal Meta\'s commitment to competing at the frontier of AI research, particularly in areas critical for developing more capable and reliable AI systems.',
        },
        { type: 'heading', level: 2, content: 'Key Researcher Acquisitions' },
        {
          type: 'paragraph',
          content: 'Jason Wei and Hyung Won Chung bring extensive experience in advancing AI capabilities. Their work at OpenAI contributed to breakthroughs in language model reasoning and the development of AI systems capable of complex, multi-step task execution.',
        },
        {
          type: 'callout',
          content: 'Meta continues building its superalignment team with top AI safety and capability researchers',
        },
        {
          type: 'paragraph',
          content: 'The acquisitions represent significant additions to Meta\'s AI research bench, bringing expertise that could accelerate the company\'s AI development efforts.',
        },
        { type: 'heading', level: 2, content: 'Areas of Expertise' },
        {
          type: 'paragraph',
          content: 'Wei and Chung specialize in reasoning and agentic AI systems—two areas considered critical for the next generation of AI capabilities. Reasoning enables AI systems to solve complex problems through logical steps, while agentic capabilities allow AI to autonomously perform tasks.',
        },
        {
          type: 'quote',
          content: 'The next frontier in AI involves systems that can reason through complex problems and take autonomous actions to achieve goals. Attracting top researchers in these areas is essential.',
          attribution: 'AI Industry Analyst',
        },
        {
          type: 'paragraph',
          content: 'These capabilities are seen as essential for developing AI assistants that can reliably perform useful work rather than simply generating text or images.',
        },
        { type: 'heading', level: 3, content: 'Superalignment Team Expansion' },
        {
          type: 'paragraph',
          content: 'The hires are part of Meta\'s broader effort to build a superalignment team focused on ensuring advanced AI systems remain safe and aligned with human values. This mirrors efforts at other leading AI labs to address safety concerns as systems become more capable.',
        },
        {
          type: 'list',
          items: [
            'New hires: Jason Wei, Hyung Won Chung',
            'Expertise: Reasoning and agentic AI systems',
            'Previous employer: OpenAI',
            'Focus area: Superalignment and AI safety',
          ],
        },
        { type: 'heading', level: 2, content: 'AI Talent Competition Intensifies' },
        {
          type: 'paragraph',
          content: 'The competition for top AI researchers has intensified as major technology companies race to develop more advanced AI systems. Compensation packages for senior AI researchers can reach tens of millions of dollars as companies seek to attract scarce talent.',
        },
        {
          type: 'paragraph',
          content: 'Meta\'s ability to attract researchers from OpenAI demonstrates the company\'s competitive position in the AI talent market and its commitment to AI research despite recent cost-cutting measures in other areas of the business.',
        },
      ],
      tags: ['Meta', 'Talent', 'AI'],
    },
    // Article 9: CoreWeave earnings
    {
      slug: 'coreweave-nvidia-backstop-deal-earnings-supply-pressure',
      title: 'CoreWeave Reports Relentless Demand Amid Supply Chain Pressures, NVIDIA Backstop',
      excerpt: 'Cloud computing provider highlights $55.6 billion backlog with 271% YoY growth. Major customers include OpenAI ($22.4B), Meta ($14.2B), and Microsoft (67% of revenue).',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&h=1080&fit=crop',
      readTime: 5,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['CRWV', 'NVDA', 'META', 'MSFT'],
      authorId: authorMap['David Kim'] || authors[0].id,
      marketsCategoryId: categoryMap['us-markets'],
      businessCategoryId: categoryMap['tech'],
      headings: [
        { id: 'backlog-growth', text: 'Backlog Growth Continues', level: 2 },
        { id: 'customer-concentration', text: 'Customer Concentration', level: 2 },
        { id: 'nvidia-backstop', text: 'NVIDIA Backstop Agreement', level: 3 },
        { id: 'supply-challenges', text: 'Supply Chain Challenges', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'CoreWeave reported exceptional backlog growth in its latest earnings, with CEO Mike Intrator describing demand as "relentless." The AI cloud computing provider highlighted a $55.6 billion backlog representing 271% year-over-year growth, underscoring the intense demand for AI computing infrastructure.',
        },
        {
          type: 'paragraph',
          content: 'However, the company also noted "unprecedented pressure across supply chains" affecting operations, with a data center developer behind schedule causing delays that impacted the quarter\'s results.',
        },
        { type: 'heading', level: 2, content: 'Backlog Growth Continues' },
        {
          type: 'paragraph',
          content: 'CoreWeave\'s $55.6 billion backlog at quarter end demonstrates the sustained appetite for AI computing capacity among major technology companies. The backlog growth significantly outpaces capacity expansion, highlighting the supply-demand imbalance in the AI infrastructure market.',
        },
        {
          type: 'callout',
          content: 'CoreWeave backlog: $55.6 billion (+271% YoY) including OpenAI $22.4B and Meta $14.2B commitments',
        },
        {
          type: 'paragraph',
          content: 'The company revised full-year revenue guidance to between $5.05 billion and $5.15 billion, reflecting the impact of supply chain challenges on near-term delivery capacity.',
        },
        { type: 'heading', level: 2, content: 'Customer Concentration' },
        {
          type: 'paragraph',
          content: 'CoreWeave\'s customer base includes several of the world\'s largest AI companies. OpenAI has committed $22.4 billion, while Meta Platforms has signed a new $14.2 billion multi-year agreement. Microsoft accounts for approximately 67% of current revenue.',
        },
        {
          type: 'quote',
          content: 'The depth of commitments from leading AI companies validates the CoreWeave model and the broader demand for specialized AI computing infrastructure.',
          attribution: 'CoreWeave CEO Mike Intrator',
        },
        {
          type: 'paragraph',
          content: 'While customer concentration presents risk, the long-term nature of these commitments provides revenue visibility and supports the company\'s aggressive capacity expansion plans.',
        },
        { type: 'heading', level: 3, content: 'NVIDIA Backstop Agreement' },
        {
          type: 'paragraph',
          content: 'CoreWeave and NVIDIA have entered a $6.3 billion backstop agreement, with NVIDIA also acquiring a $900 million stake in the company. The backstop provides a safety net guaranteeing NVIDIA will step in as a buyer of last resort if needed.',
        },
        {
          type: 'list',
          items: [
            'Total backlog: $55.6 billion (+271% YoY)',
            'OpenAI commitment: $22.4 billion',
            'Meta commitment: $14.2 billion (new)',
            'Microsoft revenue share: 67%',
            'NVIDIA backstop: $6.3 billion',
            'NVIDIA stake: $900 million',
          ],
        },
        { type: 'heading', level: 2, content: 'Supply Chain Challenges' },
        {
          type: 'paragraph',
          content: 'Despite strong demand, CoreWeave faces operational challenges as it scales rapidly. The company cited a data center developer running behind schedule, impacting the timing of capacity additions and affecting fourth quarter revenue.',
        },
        {
          type: 'paragraph',
          content: 'The supply chain pressures highlight the challenges of scaling AI infrastructure quickly enough to meet surging demand. CoreWeave continues to expand its capacity but faces competition for data center resources, power, and NVIDIA GPUs.',
        },
      ],
      tags: ['CoreWeave', 'Cloud Computing', 'Data Center', 'NVIDIA'],
    },
    // Article 10: BofA Trump put analysis
    {
      slug: 'bofa-trump-put-sp500-5600-fiscal-intervention',
      title: 'BofA Strategist Hartnett: "Trump Put" Strike Price Around S&P 500 5,600',
      excerpt: 'Bank of America analysis suggests markets expect fiscal intervention from Trump administration if S&P 500 dips to 5,600-5,700 range. "The stock market is his traffic light."',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&h=1080&fit=crop',
      readTime: 4,
      isFeatured: false,
      isBreaking: false,
      relevantTickers: ['SPY', 'SPX', 'QQQ'],
      authorId: authorMap['James Mitchell'] || authors[0].id,
      marketsCategoryId: categoryMap['us-markets'],
      businessCategoryId: categoryMap['finance'],
      headings: [
        { id: 'trump-put-concept', text: 'The "Trump Put" Concept', level: 2 },
        { id: 'strike-price', text: 'Strike Price Analysis', level: 2 },
        { id: 'fiscal-intervention', text: 'Fiscal Intervention Expectations', level: 3 },
        { id: 'market-implications', text: 'Market Implications', level: 2 },
      ],
      content: [
        {
          type: 'paragraph',
          content: 'Bank of America strategist Michael Hartnett has identified what he calls the "Trump put," suggesting that investors expect the administration to provide fiscal support if the S&P 500 drops to the 5,600-5,700 range. The analysis frames the stock market as a key performance indicator for the current administration.',
        },
        {
          type: 'paragraph',
          content: 'Hartnett\'s note characterizes the stock market as Trump\'s "traffic light," implying that significant market declines would likely trigger policy responses aimed at supporting equity prices.',
        },
        { type: 'heading', level: 2, content: 'The "Trump Put" Concept' },
        {
          type: 'paragraph',
          content: 'The "put" concept in market analysis refers to an implied floor on asset prices, similar to how an options put provides downside protection. The "Trump put" suggests that the administration would take action to support markets if prices fall significantly.',
        },
        {
          type: 'callout',
          content: 'BofA estimates the "Trump put" strike price at approximately 5,600 on the S&P 500',
        },
        {
          type: 'paragraph',
          content: 'This concept echoes the "Fed put" that markets have relied upon for decades, where the Federal Reserve was expected to ease monetary policy in response to significant market declines.',
        },
        { type: 'heading', level: 2, content: 'Strike Price Analysis' },
        {
          type: 'paragraph',
          content: 'Hartnett identifies the 5,600-5,700 range on the S&P 500 as the approximate level where the Trump administration would likely intervene. This represents roughly a 5-8% decline from recent highs.',
        },
        {
          type: 'quote',
          content: 'The stock market is his traffic light. Investors will probably expect some fiscal intervention from the Trump administration if the S&P 500 dips to 5,600-5,700.',
          attribution: 'Michael Hartnett, BofA Chief Investment Strategist',
        },
        {
          type: 'paragraph',
          content: 'The analysis suggests that moderate pullbacks may not trigger a response, but more significant declines approaching these levels could prompt policy announcements or other supportive measures.',
        },
        { type: 'heading', level: 3, content: 'Fiscal Intervention Expectations' },
        {
          type: 'paragraph',
          content: 'Unlike the monetary policy-focused Fed put, the Trump put would involve fiscal measures such as tax cuts, deregulation announcements, or other policies designed to boost market confidence and economic activity.',
        },
        {
          type: 'list',
          items: [
            'S&P 500 "put" strike: ~5,600-5,700',
            'Current S&P 500: Trading near record highs',
            'Implied downside protection: 5-8% decline',
            'Intervention type: Fiscal rather than monetary',
          ],
        },
        { type: 'heading', level: 2, content: 'Market Implications' },
        {
          type: 'paragraph',
          content: 'The existence of an implied "Trump put" could encourage more aggressive risk-taking by investors, similar to the moral hazard concerns raised about the Fed put. If investors believe that significant downside is limited, they may take on more leverage or concentrate positions.',
        },
        {
          type: 'paragraph',
          content: 'However, the reliability of any such put remains uncertain. Unlike the Federal Reserve, which has clear monetary policy tools, fiscal interventions require congressional action and face political constraints that could limit their speed and effectiveness.',
        },
      ],
      tags: ['S&P 500', 'Market Analysis', 'Trump'],
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

  console.log('Done! Added Wall St Engine articles.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
