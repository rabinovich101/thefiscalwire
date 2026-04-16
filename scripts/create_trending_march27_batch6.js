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

// 5 Trending Viral Articles - March 27, 2026 (Batch 6 - Late Evening Edition)
const articles = [
  {
    title: 'Trump Extends Iran Deadline to April 6 After Tehran Sends 10 Oil Tankers Through Strait of Hormuz as Goodwill Gesture',
    excerpt: 'President Trump postponed his ultimatum to destroy Iran\'s power grid by 10 days, citing ongoing negotiations, after Iran allowed 10 Pakistan-flagged oil tankers through the Strait of Hormuz in what Trump called a "present" signaling Tehran is serious about a deal.',
    content: [
      {type:'paragraph',content:'President Trump announced Thursday that he is extending his deadline for Iran to reopen the Strait of Hormuz by 10 days to Monday, April 6, at 8 PM Eastern Time, stepping back from an imminent threat to destroy Iran\'s power grid and signaling that diplomatic channels remain open on Day 27 of the US-Iran conflict. The extension came hours after Trump claimed Iran had allowed 10 oil tankers — mostly Pakistan-flagged vessels — to transit the strait as a "present" to demonstrate it is "real and solid" about reaching a deal to end hostilities.'},
      {type:'paragraph',content:'The diplomatic maneuvering sent oil prices on a volatile ride. Brent crude, which had surged past $108 per barrel earlier in the session on fears of an imminent escalation, pulled back to $104.50 after Trump\'s announcement before settling at $106.20. The brief relief rally in equities was short-lived, however, as traders noted that Iran\'s Foreign Minister Abbas Araghchi refused to characterize the exchanges as negotiations, instead calling them merely an "exchange of messages" through intermediaries. The disconnect between Trump\'s optimistic rhetoric and Iran\'s defiant posture has left markets struggling to price the probability of a resolution.'},
      {type:'heading',level:2,content:'Iran\'s Five-Point Counteroffer Complicates Talks'},
      {type:'paragraph',content:'Behind the scenes, the situation is more complex than Trump\'s social media posts suggest. Iran has presented a five-point counteroffer that would give Tehran sovereign control over the Strait of Hormuz — a demand that the US and its Gulf allies have categorically rejected as a non-starter. Iran is also seeking war reparations and guaranteed payment for damages caused by US and Israeli strikes on its military and civilian infrastructure. The gap between the two sides\' positions remains enormous, and veteran Middle East diplomats warn that the extension may simply be delaying an inevitable escalation rather than paving the way to a genuine ceasefire.'},
      {type:'paragraph',content:'The economic fallout from the conflict continues to mount. The OECD this week sharply raised its US inflation forecast to 4.2% for 2026, up from a prior estimate of 2.8%, citing the energy shock from the war as the primary driver. The organization warned that in a downside scenario with oil prices hovering at $135 per barrel, global output could be 0.5% weaker than baseline projections while consumer prices would be nearly 1% higher. Interest rate futures markets have completely priced out any Fed rate cuts through July, a dramatic reversal from just four weeks ago when traders saw a 64% probability of at least one cut by then.'},
      {type:'heading',level:2,content:'Markets Brace for Extended Uncertainty'},
      {type:'paragraph',content:'For investors, the 10-day extension creates a new window of uncertainty rather than clarity. Energy stocks remain the clear winners — the S&P 500 Energy sector has outperformed the broader index by over 25 percentage points since the conflict began on February 28. Defense contractors including Lockheed Martin, Raytheon, and Northrop Grumman have also surged on expectations of sustained military operations regardless of the diplomatic outcome. Meanwhile, consumer discretionary and transportation stocks continue to suffer as elevated fuel costs eat into margins and household budgets. Goldman Sachs has raised its recession probability to 35%, warning that if the Strait remains effectively closed through summer, the US economy faces a significant risk of contraction in the second half of 2026.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1529074325985-28da4b21afe2?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['XOM', 'CVX', 'LMT', 'RTX', 'NOC', 'USO'],
    seoKeywords: ['Trump Iran deadline', 'Strait of Hormuz deal', 'Iran oil tankers', 'Iran war negotiations', 'oil prices March 2026', 'Trump Iran ceasefire'],
    markets: 'global-markets',
    business: 'economy',
    isBreaking: true,
    tags: ['Iran conflict', 'Strait of Hormuz', 'oil prices', 'Trump', 'geopolitics']
  },
  {
    title: 'OECD Warns US Inflation Will Surge to 4.2% in 2026 as Iran War Energy Shock Obliterates Fed Rate Cut Hopes',
    excerpt: 'The OECD dramatically raised its US inflation forecast from 2.8% to 4.2% for 2026, driven by the Iran war energy shock, while traders have completely priced out Fed rate cuts through July in a stunning reversal that threatens to tip the economy into recession.',
    content: [
      {type:'paragraph',content:'The Organization for Economic Cooperation and Development delivered a stark warning to global markets on Wednesday, raising its US inflation forecast for 2026 to 4.2% — a dramatic increase from its December projection of 2.8% and far above the 2.7% that Federal Reserve officials estimated at their most recent meeting. The revision, driven almost entirely by the energy price shock from the US-Iran conflict, represents the single largest upward adjustment to an OECD inflation forecast in over two decades and has sent shockwaves through fixed income and equity markets worldwide.'},
      {type:'paragraph',content:'The implications for monetary policy are severe. Since the first air strikes against Iran on February 28, traders in interest rate futures have completely abandoned expectations for monetary easing this year. The probability of at least one quarter-point rate cut by the end of July has collapsed from 63.9% on February 26 to effectively zero, according to CME FedWatch data. The OECD itself now projects the Fed will keep its policy rate flat not just through 2026 but through 2027 as well, a timeline that would represent the longest sustained period of restrictive monetary policy since the Volcker era of the early 1980s.'},
      {type:'heading',level:2,content:'The Inflation Breakdown: Energy Drives Everything'},
      {type:'paragraph',content:'The mechanics of the inflation surge are straightforward but punishing. Brent crude has averaged over $95 per barrel since the conflict began, compared with roughly $70 in the months prior. Gasoline prices have jumped to a national average of $4.85 per gallon, up from $3.20 just six weeks ago. The energy shock feeds through to virtually every sector of the economy — transportation costs rise, which increases the price of goods; heating and cooling costs surge, squeezing household budgets; and petrochemical-dependent industries face margin compression that gets passed along to consumers. The OECD warned that in a downside scenario with oil prices at $135 per barrel, global output could be 0.5% weaker while consumer prices would rise an additional 1% above baseline.'},
      {type:'paragraph',content:'US economic growth is already feeling the strain. The OECD cut its 2026 GDP growth forecast to 2.0%, down from 2.3% previously, noting that "strong growth momentum in the first quarter is expected to be offset by a slowdown in consumer spending owing to the combination of declining purchasing power, weakening labor force growth, and depleted household savings." The combination of persistent tariff effects and the war-driven energy shock creates what economists call a "double squeeze" — supply-side price pressures that monetary policy is poorly equipped to address without causing significant economic damage.'},
      {type:'heading',level:2,content:'Investment Implications: Stagflation Playbook Activated'},
      {type:'paragraph',content:'The emerging stagflationary environment — where inflation rises while growth slows — presents one of the most challenging backdrops for portfolio construction in decades. Traditional 60/40 portfolios are particularly vulnerable, as both stocks and bonds tend to perform poorly during stagflation. Gold has been the standout performer, surging past $3,200 per ounce to record highs as investors seek real assets that can preserve purchasing power. Treasury Inflation-Protected Securities (TIPS) have also seen massive inflows. On the equity side, energy and materials stocks continue to outperform, while rate-sensitive sectors like real estate and utilities face headwinds from the higher-for-longer rate environment. Bank of America\'s latest fund manager survey shows the highest cash allocations since the 2020 pandemic crash, reflecting deep uncertainty about the path forward.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop&q=80',
    readTime: 6,
    relevantTickers: ['SPY', 'TLT', 'GLD', 'XLE', 'TIP', 'DXY'],
    seoKeywords: ['OECD inflation forecast', 'US inflation 4.2%', 'Fed rate cuts 2026', 'stagflation risk', 'Iran war inflation', 'energy shock economy'],
    markets: 'us-markets',
    business: 'economy',
    isBreaking: true,
    tags: ['inflation', 'OECD', 'Federal Reserve', 'interest rates', 'stagflation']
  },
  {
    title: 'OpenAI Kills Sora Video App After Burning $15 Million Per Day as Company Pivots to Profitability Ahead of Blockbuster IPO',
    excerpt: 'OpenAI abruptly shut down its Sora AI video generation app after the service burned through an estimated $15 million daily in compute costs while generating just $2.1 million in total revenue, as the company scrambles to clean up its financials ahead of a planned IPO in the second half of 2026.',
    content: [
      {type:'paragraph',content:'OpenAI sent shockwaves through the artificial intelligence industry this week by abruptly shutting down Sora, its AI-powered video generation service, just six months after launching a dedicated mobile app and three months after inking a high-profile licensing deal with Disney for character avatars. The closure represents one of the most dramatic strategic reversals in recent tech history and underscores the brutal economics facing AI companies that have yet to find sustainable business models for their most compute-intensive products.'},
      {type:'paragraph',content:'The financial numbers behind the shutdown are staggering. Industry analysts estimate Sora\'s inference costs ran approximately $15 million per day — the computational expense of generating video content on demand for millions of users. Against that cost structure, the app generated a total of just $2.1 million in lifetime in-app revenue, creating a gap so vast that no realistic growth trajectory could close it. User growth had also collapsed, with downloads plunging 75% from their November peak as the initial novelty wore off and users encountered limitations in output quality and generation speed.'},
      {type:'heading',level:2,content:'Disney Deal Unwound in Weeks'},
      {type:'paragraph',content:'Perhaps the most embarrassing aspect of the shutdown is the rapid unwinding of a partnership with Disney that OpenAI had trumpeted as a validation of Sora\'s commercial potential. The deal, announced in December 2025, would have allowed users to create videos featuring hundreds of Disney\'s most iconic characters. The partnership lasted barely three months before being terminated, raising questions about the due diligence process at both companies and whether the deal was more about generating buzz than building a sustainable business. Disney declined to comment on the termination.'},
      {type:'paragraph',content:'CEO Sam Altman framed the decision as a strategic reallocation of compute resources toward "world simulation for robotics and autonomous systems," areas he described as having greater long-term commercial potential. But the timing is impossible to separate from OpenAI\'s IPO plans. The company is targeting a public offering in the second half of 2026, and every dollar burned on an unprofitable consumer app makes the financial story harder to sell to public market investors who have become increasingly skeptical of AI companies\' path to profitability.'},
      {type:'heading',level:2,content:'What It Means for the AI Industry'},
      {type:'paragraph',content:'The Sora shutdown sends a chilling message to the broader AI ecosystem. If OpenAI — the most well-funded AI company in history with over $30 billion in committed capital — cannot make a consumer-facing generative AI product work economically, it raises fundamental questions about the business model for the entire sector. Competing video generation startups including Runway, Pika, and Luma AI face similar cost structures, and investors are likely to scrutinize their unit economics more aggressively in light of Sora\'s failure. The episode also reinforces a growing narrative on Wall Street that the current AI boom may be following the same pattern as previous technology hype cycles — massive capital investment followed by a painful reckoning when revenues fail to materialize at the scale needed to justify the spending. For investors in AI-adjacent stocks like Nvidia, which derives a significant portion of its revenue from AI infrastructure buildout, the Sora shutdown is a reminder that the demand side of the AI equation remains highly uncertain even as supply-side spending continues to accelerate.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop&q=80',
    readTime: 5,
    relevantTickers: ['MSFT', 'NVDA', 'GOOG', 'META', 'AMZN'],
    seoKeywords: ['OpenAI Sora shutdown', 'Sora killed', 'OpenAI IPO 2026', 'AI video generation', 'OpenAI losses', 'AI bubble'],
    markets: 'us-markets',
    business: 'tech',
    isBreaking: true,
    tags: ['OpenAI', 'Sora', 'artificial intelligence', 'IPO', 'tech industry']
  },
  {
    title: 'Meta and YouTube Found Liable in Landmark Social Media Addiction Trial That Could Reshape the Future of Big Tech',
    excerpt: 'A Los Angeles jury found Meta and YouTube negligent on all counts in a historic social media addiction trial, ordering $6 million in damages and setting a legal precedent that could influence over 2,000 pending lawsuits against the tech giants.',
    content: [
      {type:'paragraph',content:'A jury in Los Angeles delivered a landmark verdict on Tuesday, finding both Meta Platforms and Google\'s YouTube negligent in the design of their platforms and liable for causing harm to a young user through features that were deliberately built to be addictive. The verdict — which found the companies liable on all counts including negligent design, failure to warn, and causing substantial harm — represents the first time a jury has held social media companies responsible for the addictive nature of their products and could fundamentally reshape the legal landscape for the technology industry.'},
      {type:'paragraph',content:'The jury ordered the companies to pay a total of $6 million in damages, with Meta bearing 70% of the responsibility and YouTube 30%. Specifically, the companies were ordered to pay $3 million in compensatory damages, with Meta paying an additional $2.1 million in punitive damages and YouTube $900,000. While the dollar amounts are negligible for companies with combined market capitalizations exceeding $3 trillion, the legal precedent is potentially devastating — there are approximately 2,000 similar lawsuits pending against the platforms, and a favorable verdict gives plaintiffs\' attorneys powerful ammunition for future cases.'},
      {type:'heading',level:2,content:'Damning Internal Documents Sealed Meta\'s Fate'},
      {type:'paragraph',content:'The trial featured a parade of internal documents that painted a damning picture of how Meta and YouTube prioritized engagement metrics over user safety. Plaintiffs\' attorneys showed the jury internal Meta communications in which CEO Mark Zuckerberg and other executives discussed strategies to attract and retain young users, including one document that stated: "If we wanna win big with teens, we must bring them in as tweens." Other exhibits showed that Meta\'s own researchers had identified the addictive properties of Instagram\'s infinite scroll and notification systems but that the company chose not to implement recommended safety features because they would reduce engagement.'},
      {type:'paragraph',content:'YouTube faced similar revelations. Internal documents showed the platform\'s recommendation algorithm was specifically tuned to maximize "watch time" with no guardrails for minor users, and that engineers had flagged concerns about the algorithm\'s tendency to lead young users into increasingly extreme content rabbit holes. Google\'s defense that YouTube is merely a neutral platform was undermined by evidence showing the company\'s active role in designing features — including autoplay, recommended videos, and notification prompts — that experts testified were modeled on behavioral psychology techniques used in slot machine design.'},
      {type:'heading',level:2,content:'Wall Street Assesses the Fallout'},
      {type:'paragraph',content:'Meta shares fell 2.3% on the verdict while Alphabet dipped 1.1%, reflecting investor concerns about the potential cumulative liability from thousands of pending cases. Analysts at Morgan Stanley estimated that if similar verdicts were reached in even a fraction of the 2,000 pending cases, the total liability could reach tens of billions of dollars — though they noted that most cases would likely be settled for significantly less. More concerning for the companies is the possibility of regulatory action. Several state attorneys general have cited the trial evidence in support of new legislation that would impose strict age verification requirements and limit algorithmic recommendation for minor users. The verdict also comes as Congress is considering the Kids Online Safety Act, which would create a duty of care requiring platforms to mitigate harms to minors. For investors, the social media addiction litigation represents a new category of structural risk that could weigh on Big Tech valuations for years to come.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=630&fit=crop&q=80',
    readTime: 6,
    relevantTickers: ['META', 'GOOGL', 'SNAP', 'PINS', 'RDDT'],
    seoKeywords: ['Meta YouTube trial verdict', 'social media addiction lawsuit', 'Meta liable children', 'YouTube negligent', 'Big Tech regulation', 'social media lawsuit 2026'],
    markets: 'us-markets',
    business: 'tech',
    isBreaking: false,
    tags: ['Meta', 'YouTube', 'social media', 'lawsuit', 'child safety']
  },
  {
    title: 'Russia Launches Largest Drone Assault in History With Nearly 400 Drones as NATO Scrambles Jets and Spring Offensive Begins',
    excerpt: 'Russia unleashed nearly 400 drones and dozens of missiles at Ukraine in one of the most devastating aerial bombardments of the war, forcing NATO allies Poland and Romania to scramble fighter jets as strikes approached allied airspace and defense stocks surged.',
    content: [
      {type:'paragraph',content:'Russia launched one of the most massive aerial assaults in the history of modern warfare this week, deploying nearly 400 drones along with 23 cruise missiles and 7 ballistic missiles at targets across Ukraine in what military analysts are calling the opening salvo of Moscow\'s long-anticipated spring offensive. The barrage struck at least 10 locations across seven Ukrainian cities, killing 6 people and injuring at least 46 in what President Zelensky described as "a night of terror designed to break our spirit." The scale of the attack prompted NATO allies Poland and Romania to scramble fighter jets as some strike trajectories approached allied airspace, with Warsaw placing its air defense systems on the "highest state of readiness."'},
      {type:'paragraph',content:'The assault marks a significant escalation in Russia\'s air war strategy. The deployment of Iranian-designed Shahed drones in such massive numbers — nearly four times the typical daily launch rate — suggests Russia has substantially expanded its drone production capacity and is willing to expend enormous quantities of munitions to overwhelm Ukraine\'s air defenses. The combination of slow-moving drones designed to saturate defense systems with faster cruise and ballistic missiles represents an evolved tactical approach that military experts say is increasingly difficult to counter without significant upgrades to Ukraine\'s integrated air defense network.'},
      {type:'heading',level:2,content:'Defense Stocks Surge on Escalation'},
      {type:'paragraph',content:'The escalation sent defense stocks sharply higher across European and US markets. Lockheed Martin rose 3.2%, Northrop Grumman gained 2.8%, and Raytheon Technologies climbed 2.5% as investors bet that the intensification of the conflict would drive further increases in defense spending across NATO member states. European defense giants also surged, with Rheinmetall rising 4.1% and BAE Systems gaining 3.5%. The SPADE Defense Index, which tracks US-listed defense companies, has risen over 18% year-to-date as the dual conflicts in Ukraine and the Middle East have accelerated global rearmament. NATO defense ministers are scheduled to meet next week to discuss additional military aid packages for Ukraine, with several member states expected to announce new commitments for air defense systems and ammunition supplies.'},
      {type:'paragraph',content:'The ground situation is equally alarming. Alongside the aerial bombardment, Russian forces have intensified ground operations along the eastern and southern front lines, with particularly heavy fighting reported around Pokrovsk and in the Zaporizhzhia region. Ukrainian military officials say Russia has committed fresh reserve units to the front, suggesting this is the beginning of a sustained offensive rather than a one-time escalation. The timing is significant — spring offensives have historically been decisive moments in the conflict, and Russia appears to be betting that a combination of aerial terror and ground pressure can achieve breakthroughs before Western military aid deliveries accelerate.'},
      {type:'heading',level:2,content:'Implications for Global Markets'},
      {type:'paragraph',content:'The Ukraine escalation adds another layer of geopolitical risk to markets already reeling from the Iran conflict and inflation fears. European natural gas futures jumped 8% on concerns that the escalation could disrupt remaining energy transit routes through Ukraine, which still carry modest volumes of Russian gas to parts of Central Europe. Agricultural commodity prices also spiked, with wheat futures rising 5% as Ukraine\'s spring planting season faces disruption from the intensified bombardment of agricultural regions. For global investors, the simultaneous escalation of conflicts in both the Middle East and Eastern Europe creates a risk environment that is difficult to hedge, reinforcing the flight to safe-haven assets including gold, the Swiss franc, and US Treasury bonds. The VIX volatility index has risen to its highest level since the initial Iran strikes in late February, reflecting deep uncertainty about the trajectory of both conflicts.'}
    ],
    imageUrl: 'https://images.unsplash.com/photo-1580752300992-559f8e0734e0?w=1200&h=630&fit=crop&q=80',
    readTime: 6,
    relevantTickers: ['LMT', 'NOC', 'RTX', 'GD', 'BA', 'BAESY'],
    seoKeywords: ['Russia Ukraine drone attack', 'NATO scrambles jets', 'Russia spring offensive 2026', 'defense stocks surge', 'Ukraine war escalation', 'Shahed drones'],
    markets: 'global-markets',
    business: 'economy',
    isBreaking: true,
    tags: ['Russia', 'Ukraine', 'NATO', 'defense', 'geopolitics']
  }
];

async function main() {
  console.log('=== Creating 5 Trending Articles - March 27, 2026 (Batch 6 - Late Evening) ===\n');

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
