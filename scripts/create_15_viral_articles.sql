-- 15 Viral Financial News Articles for March 6, 2026
-- Run via: docker exec -i logk4gg8wcogs4cck0ogg8cg psql -U postgres -d postgres < create_15_viral_articles.sql

BEGIN;

-- Article 1: Oil Strait of Hormuz (BREAKING)
INSERT INTO "Article" (
  "id","slug","title","excerpt","content","imageUrl","publishedAt","readTime",
  "isFeatured","isBreaking","metaDescription","seoKeywords","isAiEnhanced",
  "relevantTickers","authorId","marketsCategoryId","businessCategoryId","createdAt","updatedAt"
) VALUES (
  gen_random_uuid(),
  'oil-explodes-8-percent-strait-of-hormuz-clash-brent-hits-85',
  'Oil Explodes 8.5% as Strait of Hormuz Clash Intensifies — Brent Hits $85, Highest Since Summer 2024',
  'Global energy markets were sent into a tailspin as escalating military tensions near the Strait of Hormuz sparked fears of a prolonged supply disruption. WTI crude surged to $81.01 while Brent topped $85.41.',
  '[{"type":"paragraph","content":"Global energy markets were sent into a tailspin on March 5, 2026, as escalating military tensions in the Middle East sparked fears of a prolonged supply disruption near the Strait of Hormuz, the world''s most critical maritime chokepoint for oil transit. West Texas Intermediate crude surged 8.5% to settle at $81.01 per barrel, while the international benchmark Brent crude climbed to $85.41."},{"type":"paragraph","content":"The spike represents the sharpest single-day gain in crude prices since October 2023, when the initial Hamas-Israel conflict first rattled energy markets. Hundreds of commercial tankers remain stuck in the Persian Gulf despite U.S. Navy promises to escort vessels through the strait, which handles roughly 21% of global petroleum consumption daily."},{"type":"heading","level":2,"content":"Supply Disruption Fears Mount"},{"type":"paragraph","content":"Goldman Sachs issued an urgent research note warning that a prolonged closure of the Strait of Hormuz could push Brent crude above $100 per barrel within weeks, potentially tipping the global economy toward stagflation. The bank estimates that even a partial blockade removing 5 million barrels per day from global supply would overwhelm strategic petroleum reserves within 60 days."},{"type":"paragraph","content":"Energy analysts at Rystad Energy estimate the conflict has already removed approximately 2.3 million barrels per day of transit capacity, with insurance premiums for tankers transiting the region jumping 400% since hostilities began. The ripple effects are being felt across supply chains, with petrochemical feedstock prices surging and Asian refiners scrambling for alternative crude sources."},{"type":"heading","level":2,"content":"Market Impact and Outlook"},{"type":"paragraph","content":"The oil surge sent shockwaves through equity markets, with the Dow Jones Industrial Average plunging 785 points as inflation fears reignited. Airlines were among the hardest hit sectors, with American Airlines falling 5.4% on jet fuel cost concerns. Conversely, energy stocks rallied sharply, with Exxon Mobil gaining 6.2% and Chevron advancing 5.4%."},{"type":"paragraph","content":"Looking ahead, market participants are closely watching diplomatic channels and naval movements for signs of de-escalation. The International Energy Agency has scheduled an emergency meeting for later this week to assess the supply situation and coordinate potential releases from strategic reserves among member nations."}]'::jsonb,
  'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=1200&h=600&fit=crop',
  NOW(),
  5,
  true,
  true,
  'Oil prices surge 8.5% as Strait of Hormuz military tensions threaten global supply. Brent hits $85, highest since summer 2024.',
  '{"oil prices","Strait of Hormuz","Brent crude","energy crisis","Iran conflict"}'::text[],
  true,
  '{"XOM","CVX","COP","OXY","SLB"}'::text[],
  '54724a73-80bc-4e24-ab3f-764f3f96f25b',
  '45e4226e-aba2-43e9-bf36-26e87cc1202a',
  '276c450b-d606-47fe-9b68-1eb98b1f3527',
  NOW(),
  NOW()
);

-- Article 2: Broadcom Earnings
INSERT INTO "Article" (
  "id","slug","title","excerpt","content","imageUrl","publishedAt","readTime",
  "isFeatured","isBreaking","metaDescription","seoKeywords","isAiEnhanced",
  "relevantTickers","authorId","marketsCategoryId","businessCategoryId","createdAt","updatedAt"
) VALUES (
  gen_random_uuid(),
  'broadcom-crushes-earnings-19-billion-revenue-ai-chip-sales-record',
  'Broadcom Crushes Earnings With $19.3B Revenue — AI Chip Sales Hit Record $8.4 Billion',
  'Broadcom reported record Q1 fiscal 2026 revenue of $19.3 billion, up 29% year-over-year, powered by a record $8.4 billion in AI semiconductor sales.',
  '[{"type":"paragraph","content":"Broadcom Inc. (NASDAQ: AVGO) delivered a blockbuster first fiscal quarter for 2026, reporting record revenue of $19.3 billion — a 29% increase year-over-year that exceeded even the most optimistic Wall Street estimates. The semiconductor and infrastructure software giant''s results were powered by explosive growth in artificial intelligence chip demand, with AI semiconductor revenue reaching a record $8.4 billion, up 16% sequentially."},{"type":"paragraph","content":"Perhaps more strikingly, Broadcom guided second-quarter revenue to approximately $22 billion, representing a staggering 47% year-over-year growth rate. The guidance sent shares surging in after-hours trading, adding roughly $45 billion to the company''s market capitalization and cementing Broadcom''s position alongside NVIDIA as a primary beneficiary of the AI infrastructure buildout."},{"type":"heading","level":2,"content":"AI Demand Shows No Signs of Slowing"},{"type":"paragraph","content":"CEO Hock Tan emphasized on the earnings call that hyperscaler customers are accelerating their AI chip procurement timelines, with several major cloud providers doubling their custom silicon orders for the second half of 2026. Broadcom''s custom AI accelerator business, which designs application-specific chips for companies like Google and Meta, has emerged as the fastest-growing segment within the company."},{"type":"paragraph","content":"The company''s infrastructure software segment, bolstered by the VMware acquisition, contributed $5.2 billion in revenue with operating margins expanding to 72%. Tan noted that VMware''s transition to a subscription model is proceeding ahead of schedule, with annual recurring revenue from cloud subscriptions growing 48% year-over-year."},{"type":"heading","level":2,"content":"Broader Semiconductor Landscape"},{"type":"paragraph","content":"Broadcom''s results provide a crucial data point for the semiconductor sector amid growing debate about the sustainability of AI spending. While some analysts have warned of potential overcapacity in AI infrastructure, Broadcom''s order book and guidance suggest enterprise and hyperscaler demand remains robust through at least mid-2027."},{"type":"paragraph","content":"The company raised its full-year 2026 revenue outlook to $88 billion, up from previous guidance of $83 billion. With a current market capitalization exceeding $950 billion, Broadcom is now the third most valuable semiconductor company globally, trailing only NVIDIA and TSMC."}]'::jsonb,
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop',
  NOW() - INTERVAL '1 hour',
  5,
  true,
  false,
  'Broadcom reports record $19.3B revenue with AI chip sales hitting $8.4B. Guides Q2 to $22B, up 47% YoY.',
  '{"Broadcom","AVGO","AI chips","semiconductor","earnings","VMware"}'::text[],
  true,
  '{"AVGO","NVDA","AMD","TSM"}'::text[],
  '231f274d-0972-4385-91af-66036e2c3452',
  '45e4226e-aba2-43e9-bf36-26e87cc1202a',
  '38f36d81-fae0-4498-a7cc-974d1b8f5458',
  NOW() - INTERVAL '1 hour',
  NOW() - INTERVAL '1 hour'
);

-- Article 3: Dow Plunges
INSERT INTO "Article" (
  "id","slug","title","excerpt","content","imageUrl","publishedAt","readTime",
  "isFeatured","isBreaking","metaDescription","seoKeywords","isAiEnhanced",
  "relevantTickers","authorId","marketsCategoryId","businessCategoryId","createdAt","updatedAt"
) VALUES (
  gen_random_uuid(),
  'dow-plunges-785-points-oil-surge-iran-conflict-inflation-fears',
  'Dow Plunges 785 Points as Oil Surge and Iran Conflict Ignite Fresh Inflation Fears',
  'The Dow Jones Industrial Average cratered 784.67 points, or 1.6%, to close at 47,954 as skyrocketing oil prices reignited inflation anxiety across Wall Street.',
  '[{"type":"paragraph","content":"The Dow Jones Industrial Average suffered its worst single-day decline in three months on Thursday, plunging 784.67 points — or 1.6% — to close at 47,954.74. The broad-based selloff was triggered by a dramatic surge in crude oil prices following intensified military operations near the Strait of Hormuz, reigniting inflation fears that many investors thought had been put to rest."},{"type":"paragraph","content":"The S&P 500 fell 0.56% to 6,830.71, while the tech-heavy Nasdaq Composite showed relative resilience, dipping just 0.26% to 22,748.99. The divergence reflected investors'' continued faith in AI-driven growth stories even as the broader market buckled under macroeconomic pressure."},{"type":"heading","level":2,"content":"Sector-by-Sector Carnage"},{"type":"paragraph","content":"Airlines and transportation stocks bore the brunt of the selling. American Airlines plunged 5.4% following a brokerage downgrade citing extreme jet fuel risk exposure, while United Airlines dropped 5.0% and Delta Air Lines lost 4.0%. Industrial bellwethers Caterpillar (-3.6%) and GE Aerospace (-3.4%) also sold off sharply on supply chain disruption fears."},{"type":"paragraph","content":"Financial stocks retreated as the yield curve flattened, compressing net interest margin outlooks. Goldman Sachs fell 3.7% and Morgan Stanley dropped 3.0%, with both banks cutting trading revenue guidance as institutional clients pulled back from risk. The KBW Bank Index posted its largest daily decline since the regional banking crisis of March 2023."},{"type":"heading","level":2,"content":"Flight to Safety"},{"type":"paragraph","content":"The 10-year Treasury yield fell 8 basis points to 3.88% as investors piled into government bonds for safety. Gold held steady near $5,121 per ounce, and the VIX volatility index spiked 22% to 24.8, signaling elevated fear in options markets. Energy stocks were the sole bright spot, with the S&P 500 Energy sector gaining 4.2% on the session."},{"type":"paragraph","content":"Market strategists warned that continued escalation in the Middle East could push the S&P 500 into correction territory, with the index now down 6.2% from its January all-time high. The February jobs report, due Friday morning, adds another layer of uncertainty to an already fragile market backdrop."}]'::jsonb,
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop',
  NOW() - INTERVAL '2 hours',
  5,
  false,
  false,
  'Dow Jones plunges 785 points as oil prices surge on Iran-Hormuz conflict. Airlines crater, banks retreat, energy rallies.',
  '{"Dow Jones","stock market","selloff","oil prices","inflation","Iran"}'::text[],
  true,
  '{"DIA","SPY","QQQ","AAL","UAL","DAL"}'::text[],
  '3ebb4fc9-db53-4521-8dde-e40456f090b0',
  '45e4226e-aba2-43e9-bf36-26e87cc1202a',
  '2f4f87a3-f2d2-403b-a335-53135fdc376f',
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '2 hours'
);

-- Article 4: Trade Desk + OpenAI
INSERT INTO "Article" (
  "id","slug","title","excerpt","content","imageUrl","publishedAt","readTime",
  "isFeatured","isBreaking","metaDescription","seoKeywords","isAiEnhanced",
  "relevantTickers","authorId","marketsCategoryId","businessCategoryId","createdAt","updatedAt"
) VALUES (
  gen_random_uuid(),
  'trade-desk-soars-27-percent-openai-ad-deal-ai-advertising',
  'The Trade Desk Soars 27% on Blockbuster OpenAI Ad Deal — AI-Powered Advertising Takes Off',
  'The Trade Desk skyrocketed 27.25% in a single session after reports of a landmark advertising partnership with OpenAI, marking a paradigm shift in AI-powered advertising.',
  '[{"type":"paragraph","content":"The Trade Desk (NASDAQ: TTD) staged a massive rally on Thursday, surging 27.25% in a single trading session after reports emerged of a landmark advertising partnership with OpenAI. The deal positions the demand-side platform to serve programmatic advertisements across AI-generated content, marking what analysts are calling a potential paradigm shift in how brands reach consumers."},{"type":"paragraph","content":"Under the reported agreement, The Trade Desk will become the primary programmatic advertising partner for OpenAI''s consumer products, including ChatGPT and its suite of enterprise AI tools. As OpenAI moves toward ad-supported tiers to diversify revenue beyond subscriptions, The Trade Desk''s infrastructure would handle the targeting, bidding, and measurement of ads served to hundreds of millions of monthly active users."},{"type":"heading","level":2,"content":"A New Advertising Frontier"},{"type":"paragraph","content":"The partnership addresses one of the most pressing questions in digital advertising: how to monetize AI-generated content. Traditional display and search advertising models struggle with conversational AI interfaces, but The Trade Desk''s programmatic approach could enable contextually relevant ads within AI-generated responses without disrupting the user experience."},{"type":"paragraph","content":"Morgan Stanley analysts upgraded the stock to Overweight following the announcement, setting a $135 price target that implies further upside from current levels. The analysts noted that the OpenAI deal could represent $2-3 billion in incremental annual revenue at maturity, fundamentally changing The Trade Desk''s growth trajectory and competitive positioning."},{"type":"heading","level":2,"content":"Competitive Implications"},{"type":"paragraph","content":"The deal has significant implications for the broader digital advertising ecosystem. Google, which generates the majority of its revenue from search advertising, faces the prospect of AI-native advertising platforms capturing share as consumers increasingly turn to conversational AI for information and recommendations. Meta Platforms and Amazon''s advertising businesses could also face disruption if the OpenAI-Trade Desk model proves successful."},{"type":"paragraph","content":"The Trade Desk''s stock has now gained over 45% year-to-date, making it one of the best-performing large-cap technology stocks in 2026. CEO Jeff Green has long positioned the company as a beneficiary of the shift away from walled-garden advertising, and the OpenAI partnership validates that thesis in dramatic fashion."}]'::jsonb,
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
  NOW() - INTERVAL '3 hours',
  5,
  false,
  false,
  'The Trade Desk surges 27% on OpenAI advertising partnership deal. AI-powered programmatic ads mark new advertising frontier.',
  '{"The Trade Desk","TTD","OpenAI","AI advertising","programmatic ads","digital marketing"}'::text[],
  true,
  '{"TTD","GOOGL","META","AMZN"}'::text[],
  '9e1277f3-2219-4896-89ee-7ebbdfd5d8f9',
  '45e4226e-aba2-43e9-bf36-26e87cc1202a',
  '38f36d81-fae0-4498-a7cc-974d1b8f5458',
  NOW() - INTERVAL '3 hours',
  NOW() - INTERVAL '3 hours'
);

-- Article 5: Gold Safe Haven
INSERT INTO "Article" (
  "id","slug","title","excerpt","content","imageUrl","publishedAt","readTime",
  "isFeatured","isBreaking","metaDescription","seoKeywords","isAiEnhanced",
  "relevantTickers","authorId","marketsCategoryId","businessCategoryId","createdAt","updatedAt"
) VALUES (
  gen_random_uuid(),
  'gold-holds-near-all-time-high-5121-investors-scramble-safe-havens',
  'Gold Holds Near All-Time High at $5,121 as Investors Scramble for Safe Havens',
  'Spot gold traded near $5,121 per ounce as geopolitical tensions and inflation fears kept demand red-hot, with the metal gaining over 15% year-to-date.',
  '[{"type":"paragraph","content":"Spot gold traded near $5,121 per ounce on Thursday, holding within striking distance of its all-time high as a perfect storm of geopolitical uncertainty and inflation anxiety kept safe-haven demand elevated. The precious metal has gained more than 15% year-to-date, dramatically outperforming major equity indices and cementing its status as the asset class of choice for institutional investors seeking portfolio protection."},{"type":"paragraph","content":"The SPDR Gold Trust (GLD), the world''s largest gold ETF, recorded inflows of $1.8 billion this week alone, its highest weekly intake since the onset of the pandemic in March 2020. Central bank purchases have also accelerated, with the World Gold Council reporting that sovereign buyers added a record 387 tonnes in Q4 2025 and show no signs of slowing."},{"type":"heading","level":2,"content":"Multiple Demand Drivers Converge"},{"type":"paragraph","content":"Gold''s rally reflects the convergence of several powerful tailwinds. The Iran-Hormuz conflict has reignited geopolitical risk premiums, while the tariff-driven inflation surge has eroded confidence in fiat currencies. Additionally, the prospect of eventual Fed rate cuts — even if delayed — reduces the opportunity cost of holding non-yielding gold, making it more attractive relative to Treasury bonds."},{"type":"paragraph","content":"Goldman Sachs raised its 12-month gold price target to $5,800 per ounce, citing structural de-dollarization trends and persistent central bank accumulation. The bank notes that BRICS nations have collectively increased gold reserves by 2,400 tonnes since 2022, reflecting a strategic shift away from U.S. dollar-denominated reserves."},{"type":"heading","level":2,"content":"Mining Stocks Ride the Wave"},{"type":"paragraph","content":"Gold mining equities have surged alongside the commodity, with Newmont Corporation up 32% year-to-date and Barrick Gold gaining 28%. Smaller miners with high-grade deposits have seen even more dramatic moves, as the elevated gold price makes previously marginal projects economically viable."},{"type":"paragraph","content":"Looking ahead, technical analysts note that gold''s breakout above the $5,000 psychological level has cleared the path for a potential run toward $5,500 by mid-2026. However, a sudden de-escalation in the Middle East or a hawkish surprise from the Federal Reserve could trigger short-term profit-taking from overbought levels."}]'::jsonb,
  'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&h=600&fit=crop',
  NOW() - INTERVAL '4 hours',
  5,
  false,
  false,
  'Gold trades near record $5,121 per ounce as safe-haven demand surges amid geopolitical tensions and inflation fears.',
  '{"gold","safe haven","precious metals","inflation","geopolitical risk"}'::text[],
  true,
  '{"GLD","NEM","GOLD","GDX"}'::text[],
  'ab21b368-357b-4835-90c9-e8568a6e8ca8',
  '45e4226e-aba2-43e9-bf36-26e87cc1202a',
  '2f4f87a3-f2d2-403b-a335-53135fdc376f',
  NOW() - INTERVAL '4 hours',
  NOW() - INTERVAL '4 hours'
);

-- Article 6: February Jobs Report
INSERT INTO "Article" (
  "id","slug","title","excerpt","content","imageUrl","publishedAt","readTime",
  "isFeatured","isBreaking","metaDescription","seoKeywords","isAiEnhanced",
  "relevantTickers","authorId","marketsCategoryId","businessCategoryId","createdAt","updatedAt"
) VALUES (
  gen_random_uuid(),
  'february-jobs-report-looms-economists-brace-shocking-slowdown-60k',
  'February Jobs Report Looms — Economists Brace for Shocking Slowdown to Just 60K Payrolls',
  'Wall Street is bracing for a dramatically weak nonfarm payrolls print, with consensus forecasts at just 60,000 new jobs versus 130,000 the prior month.',
  '[{"type":"paragraph","content":"The Bureau of Labor Statistics is set to release the February employment situation report on Friday morning, and Wall Street is bracing for what could be the weakest jobs print since the pandemic era. Consensus estimates compiled by Bloomberg show economists expecting just 60,000 nonfarm payroll additions, a dramatic deceleration from January''s already-tepid 130,000 and well below the 12-month average of 185,000."},{"type":"paragraph","content":"The expected weakness reflects the compounding impact of trade policy uncertainty, elevated borrowing costs, and the chilling effect of geopolitical turmoil on business confidence. The NFIB Small Business Optimism Index fell to its lowest level in 18 months in February, with hiring plans among small employers plunging to pandemic-era lows."},{"type":"heading","level":2,"content":"Bifurcated Labor Market"},{"type":"paragraph","content":"Economists warn that the headline number may mask a deeply bifurcated labor market. Nearly all net job creation in 2026 has been concentrated in healthcare, government, and private education, while manufacturing, technology, finance, and logistics sectors are actively shedding workers. This structural shift suggests the economy may be far weaker than aggregate employment data implies."},{"type":"paragraph","content":"Initial jobless claims have trended higher for five consecutive weeks, reaching 248,000 in the most recent reading. More concerning, continuing claims have climbed to 1.92 million, the highest level since November 2021, indicating that displaced workers are finding it increasingly difficult to secure new positions."},{"type":"heading","level":2,"content":"Fed Implications"},{"type":"paragraph","content":"A weak jobs report could create a policy dilemma for the Federal Reserve heading into its March 17-18 meeting. While surging oil prices argue against rate cuts, deteriorating labor market conditions could force the central bank to prioritize growth over inflation control. CME FedWatch data currently shows less than 20% probability of a March rate cut, but a significantly weak payrolls print could shift those odds dramatically."},{"type":"paragraph","content":"Market participants will also be closely watching the average hourly earnings component. Economists expect wage growth of 0.3% month-over-month, but any upside surprise would reinforce the stagflationary narrative — rising prices alongside weakening employment — that has increasingly dominated financial market discourse in 2026."}]'::jsonb,
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop',
  NOW() - INTERVAL '4 hours',
  5,
  false,
  false,
  'February jobs report expected to show just 60,000 payrolls added, signaling dramatic labor market slowdown.',
  '{"jobs report","nonfarm payrolls","unemployment","labor market","Fed","economy"}'::text[],
  true,
  '{"SPY","DIA","TLT"}'::text[],
  '5b02fd5d-9b07-4408-ba15-b3f6c431ad1d',
  '45e4226e-aba2-43e9-bf36-26e87cc1202a',
  '7c2eb944-1494-4b71-877d-103c0da61b54',
  NOW() - INTERVAL '4 hours',
  NOW() - INTERVAL '4 hours'
);

-- Article 7: Fed Rate Cut Odds
INSERT INTO "Article" (
  "id","slug","title","excerpt","content","imageUrl","publishedAt","readTime",
  "isFeatured","isBreaking","metaDescription","seoKeywords","isAiEnhanced",
  "relevantTickers","authorId","marketsCategoryId","businessCategoryId","createdAt","updatedAt"
) VALUES (
  gen_random_uuid(),
  'fed-rate-cut-odds-collapse-under-20-percent-march-meeting-hold',
  'Fed Rate Cut Odds Collapse to Under 20% — March 17 Meeting Now a Hold Consensus',
  'CME FedWatch data shows the probability of a 25bp cut at the March FOMC meeting has plummeted from 85% to below 20% as oil prices and inflation force the Fed to hold.',
  '[{"type":"paragraph","content":"The probability of a Federal Reserve rate cut at the March 17-18 FOMC meeting has collapsed from 85% in early February to below 20% as of Thursday, according to CME FedWatch data. The dramatic repricing reflects the reality that surging oil prices, sticky core inflation, and the administration''s tariff regime have effectively tied the central bank''s hands, even as economic growth shows signs of deterioration."},{"type":"paragraph","content":"The federal funds rate currently sits at 3.50-3.75% following four consecutive 25-basis-point cuts in 2025. Just weeks ago, markets had priced in up to three additional cuts in 2026, but the Iran-Hormuz oil shock has fundamentally altered the inflation calculus. Core PCE inflation — the Fed''s preferred gauge — came in at 2.8% in January, still well above the 2% target."},{"type":"heading","level":2,"content":"The Stagflation Dilemma"},{"type":"paragraph","content":"Federal Reserve Chair Jerome Powell faces a policy dilemma not seen since the 1970s stagflation era: rising prices alongside weakening growth. CNN reported that President Trump''s war in Iran has made the next Fed chair''s job considerably harder, as geopolitical forces are pushing inflation higher at precisely the moment the economy needs monetary stimulus."},{"type":"paragraph","content":"Several Fed governors have signaled a preference for patience in recent speeches. Governor Christopher Waller noted that ''the oil price shock creates genuine uncertainty about the inflation path'' and that the committee needs ''several months of data to assess the persistence of energy-driven price pressures'' before considering further easing."},{"type":"heading","level":2,"content":"Bond Market Reaction"},{"type":"paragraph","content":"The 10-year Treasury yield fell to 3.88% on Thursday as bond traders bet that the economic damage from the oil shock will eventually force rate cuts, even if not in March. The 2-year yield, more sensitive to near-term Fed expectations, actually rose slightly to 3.72%, creating a steeper yield curve that some analysts interpret as a positive sign for the banking sector."},{"type":"paragraph","content":"Looking beyond March, futures markets now price in a 55% chance of a rate cut by June, down from 90% a month ago. The recalibration underscores just how rapidly the macro landscape has shifted, transforming what was expected to be a year of continued monetary easing into an extended policy pause that could persist well into the second half of 2026."}]'::jsonb,
  'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=600&fit=crop',
  NOW() - INTERVAL '5 hours',
  5,
  false,
  false,
  'Fed rate cut odds collapse below 20% for March meeting. Oil shock and tariff inflation force extended policy pause.',
  '{"Federal Reserve","interest rates","FOMC","rate cut","inflation","monetary policy"}'::text[],
  true,
  '{"TLT","IEF","SHY"}'::text[],
  '3ebb4fc9-db53-4521-8dde-e40456f090b0',
  '45e4226e-aba2-43e9-bf36-26e87cc1202a',
  '2f4f87a3-f2d2-403b-a335-53135fdc376f',
  NOW() - INTERVAL '5 hours',
  NOW() - INTERVAL '5 hours'
);

-- Article 8: Tariff Cost
INSERT INTO "Article" (
  "id","slug","title","excerpt","content","imageUrl","publishedAt","readTime",
  "isFeatured","isBreaking","metaDescription","seoKeywords","isAiEnhanced",
  "relevantTickers","authorId","marketsCategoryId","businessCategoryId","createdAt","updatedAt"
) VALUES (
  gen_random_uuid(),
  'tariff-regime-costs-average-household-1500-per-year-largest-tax-hike',
  'Tariff Regime Now Costs Average Household $1,500 per Year — Largest Tax Hike Since 1993',
  'Fresh analysis reveals the universal Section 122 tariff regime amounts to the largest U.S. tax increase as a share of GDP in over three decades.',
  '[{"type":"paragraph","content":"Fresh analysis from the Tax Foundation reveals that the administration''s universal tariff regime — implemented under Section 122 of the Trade Act of 1974 after the Supreme Court struck down the original IEEPA-based tariffs — now costs the average American household approximately $1,500 per year. The figure represents the largest effective tax increase as a share of GDP since President Clinton''s 1993 Omnibus Budget Reconciliation Act."},{"type":"paragraph","content":"The economic impact is already visible in inflation data. Core Producer Price Index readings have jumped 0.8% in January and February alone, a pace that projects to nearly 5% annualized producer-level inflation. Consumer prices have followed, with grocery costs up 4.2% year-over-year and general merchandise prices rising 3.1% as retailers exhaust pre-tariff inventory buffers."},{"type":"heading","level":2,"content":"Consumer Confidence Plummets"},{"type":"paragraph","content":"The Conference Board''s Consumer Confidence Index fell to 87.3 in February, its lowest reading since November 2023 and well below the 100 level that separates optimism from pessimism. A recent Washington Post poll found that 64% of Americans disapprove of the tariff policy, with particular opposition concentrated among middle-income households earning between $50,000 and $100,000 annually."},{"type":"paragraph","content":"Retail executives have been increasingly vocal about the impact on their businesses. Following Walmart''s warning that tariff inventory buffers are exhausted, Target and Dollar General have issued similar cautionary statements, noting that price increases are accelerating across categories and threatening to push lower-income consumers toward trade-down behavior."},{"type":"heading","level":2,"content":"Political and Economic Fallout"},{"type":"paragraph","content":"The tariff debate has intensified on Capitol Hill, with a bipartisan group of senators introducing legislation to require Congressional approval for tariffs above 10%. The bill faces an uphill battle given the administration''s executive authority claims, but it reflects growing legislative unease with the economic consequences of trade policy."},{"type":"paragraph","content":"Economists at JPMorgan estimate that if the current tariff levels persist through 2026, they will subtract 0.8 percentage points from GDP growth and add 0.5 percentage points to core inflation. The combination of weaker growth and higher prices — the textbook definition of stagflation — has become the dominant concern among institutional investors and policy analysts."}]'::jsonb,
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop',
  NOW() - INTERVAL '6 hours',
  5,
  false,
  false,
  'Universal tariff regime costs US households $1,500 annually, representing largest tax increase since 1993. Consumer confidence plummets.',
  '{"tariffs","trade war","consumer prices","inflation","Section 122","tax increase"}'::text[],
  true,
  '{"WMT","TGT","DG","COST"}'::text[],
  '2a02f9a6-c957-4743-9867-32ce7588aae5',
  '45e4226e-aba2-43e9-bf36-26e87cc1202a',
  '7c2eb944-1494-4b71-877d-103c0da61b54',
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '6 hours'
);

-- Article 9: Bitcoin
INSERT INTO "Article" (
  "id","slug","title","excerpt","content","imageUrl","publishedAt","readTime",
  "isFeatured","isBreaking","metaDescription","seoKeywords","isAiEnhanced",
  "relevantTickers","authorId","marketsCategoryId","businessCategoryId","createdAt","updatedAt"
) VALUES (
  gen_random_uuid(),
  'bitcoin-treads-water-72500-caught-between-safe-haven-risk-off',
  'Bitcoin Treads Water at $72,500 as Crypto Caught Between Safe-Haven and Risk-Off Currents',
  'Bitcoin hovered near $72,525 as the market grappled with conflicting forces — geopolitical hedging versus broader risk-off sentiment.',
  '[{"type":"paragraph","content":"Bitcoin traded in a narrow range around $72,525 on Thursday, unable to break decisively in either direction as cryptocurrency markets grappled with conflicting macroeconomic signals. The world''s largest digital asset has gained approximately 6% over the past week, outperforming major equity indices but underperforming gold and oil as investors debate whether crypto qualifies as a genuine safe-haven asset."},{"type":"paragraph","content":"The Binance research team published a notable analysis suggesting that if oil prices sustain above $100 per barrel, Bitcoin could decouple from its historical correlation with U.S. equities and rally on its ''digital gold'' narrative. The thesis rests on the idea that extreme energy inflation would accelerate de-dollarization trends and drive capital toward non-sovereign stores of value, a dynamic that played out briefly during the Russia-Ukraine conflict in 2022."},{"type":"heading","level":2,"content":"ETF Flows Tell a Mixed Story"},{"type":"paragraph","content":"U.S. spot Bitcoin ETFs recorded net inflows of $210 million on Thursday, a modest but positive figure that suggests institutional investors remain cautiously constructive. BlackRock''s IBIT led the inflows with $145 million, while Grayscale''s GBTC continued to see steady outflows of $32 million as investors rotate into lower-fee alternatives."},{"type":"paragraph","content":"Total assets under management across all U.S. Bitcoin ETFs have reached $68 billion, a figure that would have seemed implausible just 18 months ago. The products have democratized Bitcoin exposure for institutional and retail investors alike, creating a structural bid that provides price support during market drawdowns."},{"type":"heading","level":2,"content":"Regulatory Tailwinds"},{"type":"paragraph","content":"The crypto market is also digesting positive regulatory developments. The Crypto Clarity Act continues to advance through Congress, and passage could trigger a significant institutional rally by providing the regulatory certainty that large allocators have demanded. JPMorgan estimates that clear SEC classification of digital assets could unlock $500 billion in institutional capital currently sidelined by regulatory ambiguity."},{"type":"paragraph","content":"Technical analysts note that Bitcoin''s ability to hold above $70,000 amid the broader equity selloff is constructive, with the $75,000 level representing the next major resistance. A decisive break above that level could target the all-time high of $108,000 set in January 2025, though the path will likely remain volatile given the uncertain macro backdrop."}]'::jsonb,
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=600&fit=crop',
  NOW() - INTERVAL '6 hours',
  5,
  false,
  false,
  'Bitcoin holds at $72,500 amid conflicting safe-haven and risk-off signals. ETF inflows remain positive, regulatory clarity advances.',
  '{"Bitcoin","BTC","cryptocurrency","crypto ETF","digital assets","safe haven"}'::text[],
  true,
  '{"IBIT","GBTC","COIN","MSTR"}'::text[],
  '9e1277f3-2219-4896-89ee-7ebbdfd5d8f9',
  '680d4de9-76be-4dcc-9ea1-bc531fad4f7d',
  '2f4f87a3-f2d2-403b-a335-53135fdc376f',
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '6 hours'
);

-- Article 10: AI 2028 Crisis Report
INSERT INTO "Article" (
  "id","slug","title","excerpt","content","imageUrl","publishedAt","readTime",
  "isFeatured","isBreaking","metaDescription","seoKeywords","isAiEnhanced",
  "relevantTickers","authorId","marketsCategoryId","businessCategoryId","createdAt","updatedAt"
) VALUES (
  gen_random_uuid(),
  'the-2028-crisis-report-shockwaves-ai-wipe-out-white-collar-jobs',
  'The 2028 Crisis Report Sends Shockwaves — AI to Wipe Out 10% of White-Collar Jobs',
  'A viral intelligence report titled The 2028 Global Intelligence Crisis rattled markets this week, warning AI tools will eliminate millions of white-collar roles within two years.',
  '[{"type":"paragraph","content":"A leaked intelligence report titled ''The 2028 Global Intelligence Crisis'' has sent shockwaves through financial markets this week, presenting a detailed scenario in which artificial intelligence tools eliminate approximately 10% of white-collar jobs globally within the next two years. The document, which circulated widely on social media before being picked up by major financial news outlets, describes a future where AI agents handle complex tasks in software development, financial analysis, legal research, and corporate management."},{"type":"paragraph","content":"The report''s viral spread contributed to a notable rotation out of technology employment-sensitive sectors, with staffing firms Robert Half International (-8.2%) and Kforce (-6.5%) among the worst performers this week. The broader implications for corporate earnings are mixed: while AI-driven efficiency gains could boost profit margins, the loss of consumer purchasing power from displaced workers could undermine demand."},{"type":"heading","level":2,"content":"Corporate AI Adoption Accelerating"},{"type":"paragraph","content":"The report''s timing coincides with an acceleration in corporate AI adoption announcements. Expedia this week revealed plans to replace thousands of roles with AI agents, while consulting firm McKinsey disclosed that it has already reduced its analyst class by 15% through AI-assisted research tools. Technology hiring has slowed 40% year-over-year according to CompTIA data, even as overall AI-related job postings have surged."},{"type":"paragraph","content":"Economists at the International Monetary Fund published a companion analysis estimating that advanced economies could see 40% of jobs ''exposed'' to AI disruption by 2030, with roughly half of those facing outright displacement rather than augmentation. The IMF notes that previous technological transitions — from agriculture to industry, and from industry to services — occurred over decades, while the AI transition may compress similar disruption into just 5-10 years."},{"type":"heading","level":2,"content":"Policy Response and Social Impact"},{"type":"paragraph","content":"The report has reignited debate about universal basic income, AI taxation, and retraining programs. Several European countries have accelerated legislative efforts to regulate AI deployment in workplaces, while U.S. policymakers remain divided along partisan lines about the appropriate government response."},{"type":"paragraph","content":"Despite the alarming headlines, some economists argue the report overstates near-term disruption. MIT professor Daron Acemoglu cautioned that AI capabilities tend to be overestimated in the short run and underestimated in the long run, and that labor market adjustments — while painful — tend to create new categories of employment that are difficult to predict in advance."}]'::jsonb,
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
  NOW() - INTERVAL '7 hours',
  5,
  false,
  false,
  'Viral 2028 Crisis report warns AI will eliminate 10% of white-collar jobs. Corporate AI adoption accelerates across industries.',
  '{"AI jobs","artificial intelligence","2028 crisis","white collar","automation","employment"}'::text[],
  true,
  '{"MSFT","GOOGL","META","RHI"}'::text[],
  '231f274d-0972-4385-91af-66036e2c3452',
  '45e4226e-aba2-43e9-bf36-26e87cc1202a',
  '38f36d81-fae0-4498-a7cc-974d1b8f5458',
  NOW() - INTERVAL '7 hours',
  NOW() - INTERVAL '7 hours'
);

-- Article 11: Airlines Crater
INSERT INTO "Article" (
  "id","slug","title","excerpt","content","imageUrl","publishedAt","readTime",
  "isFeatured","isBreaking","metaDescription","seoKeywords","isAiEnhanced",
  "relevantTickers","authorId","marketsCategoryId","businessCategoryId","createdAt","updatedAt"
) VALUES (
  gen_random_uuid(),
  'airlines-crater-jet-fuel-costs-surge-american-airlines-slashed-5-percent',
  'Airlines Crater as Jet Fuel Costs Surge — American Airlines Slashed 5.4% in One Day',
  'The airline sector was decimated as surging crude prices sent jet fuel costs spiraling higher. American Airlines plunged 5.4% following a brokerage downgrade.',
  '[{"type":"paragraph","content":"The airline sector suffered its worst day of 2026 on Thursday as surging crude oil prices sent jet fuel cost projections spiraling upward, threatening to erase hard-won margin improvements across the industry. American Airlines Group (NASDAQ: AAL) led the decline, plunging 5.4% after a major brokerage downgraded the stock to Sell, citing extreme fuel cost exposure and inadequate hedging positions."},{"type":"paragraph","content":"United Airlines Holdings fell 5.0%, Delta Air Lines dropped 4.0%, and Southwest Airlines declined 3.8% in sympathy selling that swept across the entire transportation sector. The NYSE Arca Airline Index posted its largest single-day decline since March 2023, erasing nearly $12 billion in combined market capitalization."},{"type":"heading","level":2,"content":"Jet Fuel Cost Shock"},{"type":"paragraph","content":"Jet fuel prices have surged approximately 25% since the Iran-Hormuz conflict escalated in late February, reaching $2.85 per gallon — levels not seen since summer 2024. For context, fuel represents roughly 20-30% of airline operating costs, meaning a sustained 25% increase in fuel prices translates to a 5-7.5% increase in total operating expenses."},{"type":"paragraph","content":"Most major U.S. carriers entered 2026 with minimal fuel hedging positions, having been burned by hedging losses in prior years when oil prices declined. American Airlines, in particular, has no fuel hedges for 2026, leaving it fully exposed to spot market prices — a vulnerability that the downgrading analyst called ''an unacceptable risk management gap.''"},{"type":"heading","level":2,"content":"Demand Resilience in Question"},{"type":"paragraph","content":"Adding to investor concerns, forward booking data from Airlines Reporting Corporation shows that domestic leisure travel demand has softened for the first time since the post-pandemic recovery began. International bookings remain relatively strong, particularly to European destinations, but the tariff-driven squeeze on consumer wallets is beginning to show up in discretionary travel spending."},{"type":"paragraph","content":"The International Air Transport Association (IATA) warned in its latest global outlook that airlines face a potential $45 billion increase in collective fuel bills in 2026 if current crude prices persist, which would cut industry profits by roughly 40% from 2025 levels. Airline executives are evaluating fuel surcharges and capacity reductions as potential responses."}]'::jsonb,
  'https://images.unsplash.com/photo-1436491865332-7a61a109db56?w=1200&h=600&fit=crop',
  NOW() - INTERVAL '8 hours',
  5,
  false,
  false,
  'Airlines plunge as jet fuel surges 25% on Hormuz crisis. American Airlines drops 5.4% on downgrade, sector loses $12B.',
  '{"airlines","jet fuel","American Airlines","oil prices","transportation","travel"}'::text[],
  true,
  '{"AAL","UAL","DAL","LUV","JETS"}'::text[],
  '42c5a5fa-2338-4cdf-afd5-b15ac4426b4c',
  '45e4226e-aba2-43e9-bf36-26e87cc1202a',
  '0774fff7-199a-4121-8a8c-2ad4003143c3',
  NOW() - INTERVAL '8 hours',
  NOW() - INTERVAL '8 hours'
);

-- Article 12: Expedia AI Layoffs
INSERT INTO "Article" (
  "id","slug","title","excerpt","content","imageUrl","publishedAt","readTime",
  "isFeatured","isBreaking","metaDescription","seoKeywords","isAiEnhanced",
  "relevantTickers","authorId","marketsCategoryId","businessCategoryId","createdAt","updatedAt"
) VALUES (
  gen_random_uuid(),
  'expedia-surges-10-percent-aggressive-ai-driven-layoff-strategy',
  'Expedia Surges Nearly 10% After Revealing Aggressive AI-Driven Layoff Strategy',
  'Expedia Group jumped 9.92% after executives outlined plans to replace thousands of roles with AI agents at the Morgan Stanley tech conference.',
  '[{"type":"paragraph","content":"Expedia Group (NASDAQ: EXPE) was the talk of Wall Street on Thursday, surging 9.92% after executives at the Morgan Stanley Technology, Media & Telecom Conference outlined an aggressive strategy to replace thousands of human roles with AI-powered agents. The company disclosed that AI-assisted customer service already handles 40% of all customer inquiries, with plans to expand automation across booking, pricing, revenue management, and marketing operations."},{"type":"paragraph","content":"CEO Ariane Gorin detailed a three-year transformation roadmap that envisions reducing the company''s headcount by approximately 25% while maintaining or improving service quality. The cost savings, estimated at $800 million annually by 2028, would flow directly to the bottom line and fund investment in next-generation travel technology platforms."},{"type":"heading","level":2,"content":"AI Replacing White-Collar Functions"},{"type":"paragraph","content":"The presentation detailed specific AI applications already in production. Expedia''s pricing engine now uses machine learning to optimize over 500 million price points daily across hotels, flights, and packages — a task previously requiring teams of revenue management analysts. The company''s customer service bots resolve 85% of routine inquiries without human intervention, up from 45% just 18 months ago."},{"type":"paragraph","content":"Perhaps most notably, Expedia revealed that its marketing department has been restructured around AI content generation tools, reducing the team from 340 to 120 people while increasing content output by 300%. The remaining human marketers focus on strategy and brand positioning while AI handles copywriting, image selection, and A/B testing at scale."},{"type":"heading","level":2,"content":"Investor Reaction and Industry Implications"},{"type":"paragraph","content":"Wall Street responded enthusiastically to the margin expansion story, with multiple analysts raising price targets. Jefferies upgraded EXPE to Buy with a $220 target, noting that ''Expedia is demonstrating what aggressive AI adoption looks like in practice, and the margin implications are transformative.''"},{"type":"paragraph","content":"The broader travel technology sector rallied in sympathy, with Booking Holdings gaining 3.2% and Airbnb adding 2.8%. However, labor advocates criticized the announcement as emblematic of a broader trend of corporate America using AI to maximize shareholder returns at the expense of middle-class employment, adding fuel to the already heated debate over AI regulation and worker protection."}]'::jsonb,
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop',
  NOW() - INTERVAL '9 hours',
  5,
  false,
  false,
  'Expedia surges 10% on AI layoff strategy, plans to cut 25% of workforce. AI handles 40% of customer inquiries.',
  '{"Expedia","AI layoffs","automation","travel tech","cost savings","AI agents"}'::text[],
  true,
  '{"EXPE","BKNG","ABNB"}'::text[],
  '0fa848ee-7a0b-4f68-9f43-563c787ff1f2',
  '45e4226e-aba2-43e9-bf36-26e87cc1202a',
  '38f36d81-fae0-4498-a7cc-974d1b8f5458',
  NOW() - INTERVAL '9 hours',
  NOW() - INTERVAL '9 hours'
);

-- Article 13: Goldman/Morgan Stanley Banks
INSERT INTO "Article" (
  "id","slug","title","excerpt","content","imageUrl","publishedAt","readTime",
  "isFeatured","isBreaking","metaDescription","seoKeywords","isAiEnhanced",
  "relevantTickers","authorId","marketsCategoryId","businessCategoryId","createdAt","updatedAt"
) VALUES (
  gen_random_uuid(),
  'wall-street-banks-beating-goldman-sachs-drops-morgan-stanley-falls',
  'Wall Street Banks Take a Beating — Goldman Sachs Drops 3.7%, Morgan Stanley Falls 3.0%',
  'Major bank stocks retreated sharply as geopolitical uncertainty and a flattening yield curve compressed net interest margin outlooks.',
  '[{"type":"paragraph","content":"Major Wall Street bank stocks suffered significant losses on Thursday as the escalating geopolitical crisis, combined with a rapidly flattening yield curve, painted a grim picture for near-term profitability. Goldman Sachs Group (NYSE: GS) fell 3.7% to $568.10, while Morgan Stanley (NYSE: MS) dropped 3.0% — both posting their worst single-day performances since the March 2023 regional banking crisis."},{"type":"paragraph","content":"The KBW Bank Index declined 2.8% overall, with losses broad-based across both money center and regional bank stocks. JPMorgan Chase, the nation''s largest bank by assets, fell 2.4%, while Citigroup dropped 3.1%. The selling accelerated in the final hour of trading as institutional investors de-risked ahead of Friday''s jobs report."},{"type":"heading","level":2,"content":"Yield Curve Compression"},{"type":"paragraph","content":"The primary driver of bank stock weakness was the flattening of the Treasury yield curve. As the 10-year yield plunged to 3.88% on safe-haven demand while the 2-year yield held relatively steady at 3.72%, the spread between the two narrowed to just 16 basis points — the tightest since October 2025. Banks earn profits on the spread between short-term borrowing costs and long-term lending rates, so a flatter curve directly compresses net interest margins."},{"type":"paragraph","content":"Goldman Sachs and Morgan Stanley face additional pressure from their investment banking and trading operations. Both firms indicated during recent investor presentations that geopolitical uncertainty has caused institutional clients to pull back from risk-taking, reducing trading volumes and delaying M&A activity that generates advisory fees."},{"type":"heading","level":2,"content":"Credit Quality Concerns"},{"type":"paragraph","content":"Beyond the rate environment, analysts are increasingly focused on potential credit quality deterioration. Commercial real estate exposure remains a concern for regional banks, while consumer credit metrics — particularly credit card delinquency rates — have been trending higher. If the tariff-driven inflation squeeze continues to erode consumer purchasing power, credit losses could accelerate in the second half of 2026."},{"type":"paragraph","content":"Despite the near-term headwinds, several analysts maintain constructive longer-term views on bank stocks, arguing that current valuations at 1.2-1.5x tangible book value already discount a meaningful earnings slowdown. The sector''s high dividend yields — averaging 3.2% among the top six banks — provide a valuation floor, though additional selling pressure cannot be ruled out if the macro environment continues to deteriorate."}]'::jsonb,
  'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1200&h=600&fit=crop',
  NOW() - INTERVAL '10 hours',
  5,
  false,
  false,
  'Goldman Sachs drops 3.7%, Morgan Stanley falls 3.0% as yield curve flattens and geopolitical uncertainty hits banking sector.',
  '{"Goldman Sachs","Morgan Stanley","banking","yield curve","financial sector","Wall Street"}'::text[],
  true,
  '{"GS","MS","JPM","C","BAC","KBE"}'::text[],
  '5d1077a2-d62c-4191-9242-f9a229451d84',
  '45e4226e-aba2-43e9-bf36-26e87cc1202a',
  '2f4f87a3-f2d2-403b-a335-53135fdc376f',
  NOW() - INTERVAL '10 hours',
  NOW() - INTERVAL '10 hours'
);

-- Article 14: Private Credit
INSERT INTO "Article" (
  "id","slug","title","excerpt","content","imageUrl","publishedAt","readTime",
  "isFeatured","isBreaking","metaDescription","seoKeywords","isAiEnhanced",
  "relevantTickers","authorId","marketsCategoryId","businessCategoryId","createdAt","updatedAt"
) VALUES (
  gen_random_uuid(),
  'private-credit-seizes-15-percent-global-lending-apollo-blackstone',
  'Private Credit Seizes 15% of Global Lending — Apollo, Blackstone Lead the $41 Trillion Land Grab',
  'Private credit funds are on track to capture 15% of the $41 trillion global lending market as banks retreat under tighter regulatory pressure.',
  '[{"type":"paragraph","content":"Private credit has emerged as the most transformative force in global finance since the 2008 financial crisis, with alternative lending funds on track to capture approximately 15% of the traditional $41 trillion global lending market. Apollo Global Management, Blackstone, and Ares Management are leading the charge, collectively deploying over $180 billion in direct lending capital in the past 12 months alone."},{"type":"paragraph","content":"The structural shift accelerated in 2026 as Basel III endgame capital requirements forced traditional banks to curtail lending activity, particularly in leveraged finance and commercial real estate. McKinsey estimates that banks have shed approximately $800 billion in lending capacity since 2022, creating a vacuum that private credit managers have eagerly filled with faster execution, more flexible terms, and higher risk tolerance."},{"type":"heading","level":2,"content":"The New Lending Paradigm"},{"type":"paragraph","content":"Unlike traditional bank lending, private credit offers borrowers a single point of contact, faster underwriting timelines, and customized capital structures. These advantages have proven particularly attractive to mid-market companies that may not have access to public bond markets and find traditional bank processes too slow or restrictive."},{"type":"paragraph","content":"Apollo CEO Marc Rowan has been particularly aggressive in articulating the firm''s vision, calling private credit ''the most important financial innovation of the decade'' and predicting that the asset class will reach $5 trillion in AUM by 2030, up from approximately $2.1 trillion today. The firm recently launched a $25 billion direct lending vehicle focused on investment-grade private credit — a category that barely existed five years ago."},{"type":"heading","level":2,"content":"Risks and Regulatory Scrutiny"},{"type":"paragraph","content":"The rapid growth of private credit has not escaped regulatory attention. The Financial Stability Board has flagged potential systemic risks arising from the interconnectedness of private credit with traditional banking, insurance, and pension fund capital. Concerns include opaque valuations, limited liquidity in secondary markets, and potential conflicts of interest when private credit managers also control distressed borrower workout processes."},{"type":"paragraph","content":"Despite these concerns, institutional investors continue to increase allocations to private credit, attracted by yields of 10-14% that far exceed public market alternatives. Public pension funds now allocate an average of 8% of assets to private credit, up from just 3% in 2020, ensuring continued capital inflows that will further expand the asset class''s market share in coming years."}]'::jsonb,
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=600&fit=crop',
  NOW() - INTERVAL '11 hours',
  5,
  false,
  false,
  'Private credit captures 15% of $41T global lending market. Apollo, Blackstone lead expansion as banks retreat.',
  '{"private credit","Apollo","Blackstone","direct lending","alternative finance","banking"}'::text[],
  true,
  '{"APO","BX","ARES","KKR"}'::text[],
  '42c5a5fa-2338-4cdf-afd5-b15ac4426b4c',
  '45e4226e-aba2-43e9-bf36-26e87cc1202a',
  '2f4f87a3-f2d2-403b-a335-53135fdc376f',
  NOW() - INTERVAL '11 hours',
  NOW() - INTERVAL '11 hours'
);

-- Article 15: Energy Stocks Rally
INSERT INTO "Article" (
  "id","slug","title","excerpt","content","imageUrl","publishedAt","readTime",
  "isFeatured","isBreaking","metaDescription","seoKeywords","isAiEnhanced",
  "relevantTickers","authorId","marketsCategoryId","businessCategoryId","createdAt","updatedAt"
) VALUES (
  gen_random_uuid(),
  'exxon-chevron-lead-energy-rally-6-percent-gains-oil-war-premium',
  'Exxon and Chevron Lead Energy Rally With 6%+ Gains as Oil War Premium Reprices the Sector',
  'Energy equities posted their strongest single-day performance in months as Brent crude topped $85. Exxon surged 6.2% and Chevron gained 5.4%.',
  '[{"type":"paragraph","content":"The energy sector delivered its strongest single-day performance in 2026 on Thursday, with the S&P 500 Energy Index surging 4.2% as crude oil prices spiked on intensified Strait of Hormuz tensions. Exxon Mobil (NYSE: XOM) led the charge with a 6.2% gain to $124.30, followed by Chevron Corporation (NYSE: CVX) which advanced 5.4% to $168.45."},{"type":"paragraph","content":"ConocoPhillips rose 5.8%, Pioneer Natural Resources gained 4.9%, and oilfield services giant Schlumberger added 4.3% as the entire energy value chain benefited from the oil price surge. The Energy Select Sector SPDR Fund (XLE) recorded its largest daily inflow in six months at $1.2 billion, signaling institutional investors are rapidly rotating capital into the sector."},{"type":"heading","level":2,"content":"Repricing for Sustained High Prices"},{"type":"paragraph","content":"Analysts note that energy stocks had been trading at a significant discount to their commodity price sensitivity, reflecting investor skepticism that elevated crude prices would persist. Thursday''s rally represents the beginning of a repricing as the market accepts that Brent crude above $80 per barrel may be the new baseline rather than a temporary spike."},{"type":"paragraph","content":"Goldman Sachs raised its 2026 Brent crude forecast to $88 per barrel from $78, citing the Hormuz supply disruption and limited OPEC+ spare capacity. At these prices, major integrated oil companies generate massive free cash flow — Exxon alone could produce over $50 billion in annual free cash flow, supporting continued dividends, buybacks, and strategic investments."},{"type":"heading","level":2,"content":"Dividend and Buyback Windfall"},{"type":"paragraph","content":"The oil price surge has significant implications for shareholder returns. Exxon''s board is expected to announce an accelerated buyback program at its upcoming analyst day, potentially increasing the current $20 billion annual repurchase authorization. Chevron, already executing a $75 billion multi-year buyback, may face renewed pressure from activist investors to increase the pace of capital returns."},{"type":"paragraph","content":"The energy sector remains deeply out of favor among ESG-focused institutional investors, which paradoxically has created value for traditional investors. At current prices, the sector trades at just 11x forward earnings compared to 21x for the S&P 500, with dividend yields averaging 3.5% — making energy stocks among the most attractively valued and highest-yielding segments of the U.S. equity market."}]'::jsonb,
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=600&fit=crop',
  NOW() - INTERVAL '12 hours',
  5,
  false,
  false,
  'Exxon surges 6.2%, Chevron gains 5.4% as energy sector rallies on $85 Brent crude. War premium reprices sector outlook.',
  '{"energy stocks","Exxon","Chevron","oil prices","energy sector","dividends"}'::text[],
  true,
  '{"XOM","CVX","COP","SLB","XLE"}'::text[],
  '54724a73-80bc-4e24-ab3f-764f3f96f25b',
  '45e4226e-aba2-43e9-bf36-26e87cc1202a',
  '276c450b-d606-47fe-9b68-1eb98b1f3527',
  NOW() - INTERVAL '12 hours',
  NOW() - INTERVAL '12 hours'
);

-- Now add the new articles to homepage zones
-- First, get the new article IDs and shift existing zone positions

-- Shift existing positions using temp offset to avoid unique constraint violations
-- ARTICLE_GRID zone
UPDATE "ContentPlacement"
SET position = position + 10000
WHERE "zoneId" = 'e63170a5-dc57-4c9e-9ac8-02fe4f548836';

UPDATE "ContentPlacement"
SET position = position - 10000 + 15
WHERE "zoneId" = 'e63170a5-dc57-4c9e-9ac8-02fe4f548836'
AND position >= 10000;

-- TRENDING_SIDEBAR zone
UPDATE "ContentPlacement"
SET position = position + 10000
WHERE "zoneId" = 'c8e643d4-d82a-4f47-bcdc-1f0a93a01081';

UPDATE "ContentPlacement"
SET position = position - 10000 + 15
WHERE "zoneId" = 'c8e643d4-d82a-4f47-bcdc-1f0a93a01081'
AND position >= 10000;

-- HERO_FEATURED zone
UPDATE "ContentPlacement"
SET position = position + 10000
WHERE "zoneId" = 'ce373fb1-f999-4c66-916e-d1a84027b2ec';

UPDATE "ContentPlacement"
SET position = position - 10000 + 2
WHERE "zoneId" = 'ce373fb1-f999-4c66-916e-d1a84027b2ec'
AND position >= 10000;

-- Create temp table with new article slugs for zone placement
CREATE TEMP TABLE _new_slugs (slug TEXT);
INSERT INTO _new_slugs VALUES
  ('oil-explodes-8-percent-strait-of-hormuz-clash-brent-hits-85'),
  ('broadcom-crushes-earnings-19-billion-revenue-ai-chip-sales-record'),
  ('dow-plunges-785-points-oil-surge-iran-conflict-inflation-fears'),
  ('trade-desk-soars-27-percent-openai-ad-deal-ai-advertising'),
  ('gold-holds-near-all-time-high-5121-investors-scramble-safe-havens'),
  ('february-jobs-report-looms-economists-brace-shocking-slowdown-60k'),
  ('fed-rate-cut-odds-collapse-under-20-percent-march-meeting-hold'),
  ('tariff-regime-costs-average-household-1500-per-year-largest-tax-hike'),
  ('bitcoin-treads-water-72500-caught-between-safe-haven-risk-off'),
  ('the-2028-crisis-report-shockwaves-ai-wipe-out-white-collar-jobs'),
  ('airlines-crater-jet-fuel-costs-surge-american-airlines-slashed-5-percent'),
  ('expedia-surges-10-percent-aggressive-ai-driven-layoff-strategy'),
  ('wall-street-banks-beating-goldman-sachs-drops-morgan-stanley-falls'),
  ('private-credit-seizes-15-percent-global-lending-apollo-blackstone'),
  ('exxon-chevron-lead-energy-rally-6-percent-gains-oil-war-premium');

-- Insert all 15 articles into ARTICLE_GRID zone
INSERT INTO "ContentPlacement" ("id","zoneId","contentType","articleId","position","isPinned","createdAt","updatedAt")
SELECT
  gen_random_uuid(),
  'e63170a5-dc57-4c9e-9ac8-02fe4f548836',
  'ARTICLE',
  a.id,
  ROW_NUMBER() OVER (ORDER BY a."publishedAt" DESC) - 1,
  false,
  NOW(),
  NOW()
FROM "Article" a
JOIN _new_slugs ns ON a.slug = ns.slug;

-- Insert top 10 articles into TRENDING_SIDEBAR zone
INSERT INTO "ContentPlacement" ("id","zoneId","contentType","articleId","position","isPinned","createdAt","updatedAt")
SELECT
  gen_random_uuid(),
  'c8e643d4-d82a-4f47-bcdc-1f0a93a01081',
  'ARTICLE',
  sub.id,
  sub.rn - 1,
  false,
  NOW(),
  NOW()
FROM (
  SELECT a.id, ROW_NUMBER() OVER (ORDER BY a."publishedAt" DESC) as rn
  FROM "Article" a
  JOIN _new_slugs ns ON a.slug = ns.slug
) sub
WHERE sub.rn <= 10;

-- Insert top 2 into HERO_FEATURED zone
INSERT INTO "ContentPlacement" ("id","zoneId","contentType","articleId","position","isPinned","createdAt","updatedAt")
SELECT
  gen_random_uuid(),
  'ce373fb1-f999-4c66-916e-d1a84027b2ec',
  'ARTICLE',
  a.id,
  ROW_NUMBER() OVER (ORDER BY a."publishedAt" DESC) - 1,
  false,
  NOW(),
  NOW()
FROM "Article" a
WHERE a.slug IN (
  'oil-explodes-8-percent-strait-of-hormuz-clash-brent-hits-85',
  'broadcom-crushes-earnings-19-billion-revenue-ai-chip-sales-record'
);

-- Remove oldest placements from zones (keep max 20 per zone)
DELETE FROM "ContentPlacement"
WHERE id IN (
  SELECT id FROM "ContentPlacement"
  WHERE "zoneId" = 'e63170a5-dc57-4c9e-9ac8-02fe4f548836'
  ORDER BY position DESC
  OFFSET 20
);

DELETE FROM "ContentPlacement"
WHERE id IN (
  SELECT id FROM "ContentPlacement"
  WHERE "zoneId" = 'c8e643d4-d82a-4f47-bcdc-1f0a93a01081'
  ORDER BY position DESC
  OFFSET 15
);

DELETE FROM "ContentPlacement"
WHERE id IN (
  SELECT id FROM "ContentPlacement"
  WHERE "zoneId" = 'ce373fb1-f999-4c66-916e-d1a84027b2ec'
  ORDER BY position DESC
  OFFSET 4
);

DROP TABLE _new_slugs;

COMMIT;
