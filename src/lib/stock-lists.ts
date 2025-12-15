/**
 * Comprehensive stock lists and industry mappings for heatmap
 * Based on finviz.com structure
 */

// =============================================================================
// INDEX DEFINITIONS
// =============================================================================

export type HeatmapIndex =
  | "sp500"
  | "dji"
  | "ndx"
  | "rut"
  | "etf"
  | "crypto";

export interface IndexInfo {
  id: HeatmapIndex;
  name: string;
  description: string;
  url: string; // finviz URL param
}

export const INDEX_INFO: IndexInfo[] = [
  { id: "sp500", name: "S&P 500", description: "Standard and Poor's 500 index stocks", url: "sec" },
  { id: "dji", name: "Dow Jones 30", description: "Dow Jones Industrial Average", url: "sec_dji" },
  { id: "ndx", name: "Nasdaq 100", description: "Nasdaq 100 index stocks", url: "sec_ndx" },
  { id: "rut", name: "Russell 2000", description: "Russell 2000 small cap index", url: "sec_rut" },
  { id: "etf", name: "ETFs", description: "Exchange Traded Funds", url: "etf" },
  { id: "crypto", name: "Crypto", description: "Cryptocurrencies", url: "crypto" },
];

// =============================================================================
// PERIOD / DATA TYPE OPTIONS
// =============================================================================

export type DataTypeCategory = "performance";

export interface DataTypeOption {
  id: string;
  label: string;
  category: DataTypeCategory;
  yahooField?: string; // Yahoo Finance field name for this metric
}

export const DATA_TYPE_OPTIONS: DataTypeOption[] = [
  { id: "d1", label: "1-Day", category: "performance", yahooField: "regularMarketChangePercent" },
  { id: "w1", label: "1-Week", category: "performance", yahooField: "regularMarketChangePercent" },
  { id: "m1", label: "1-Month", category: "performance", yahooField: "regularMarketChangePercent" },
];

export const DATA_TYPE_CATEGORIES: { id: DataTypeCategory; label: string }[] = [
  { id: "performance", label: "Performance" },
];

// =============================================================================
// SECTOR & INDUSTRY DEFINITIONS (GICS-based like finviz)
// =============================================================================

export interface SectorDefinition {
  id: string;
  name: string;
  industries: IndustryDefinition[];
}

export interface IndustryDefinition {
  id: string;
  name: string;
}

export const SECTORS_WITH_INDUSTRIES: SectorDefinition[] = [
  {
    id: "technology",
    name: "TECHNOLOGY",
    industries: [
      { id: "software-infra", name: "SOFTWARE - INFRASTRUCTURE" },
      { id: "software-app", name: "SOFTWARE - APPLICATION" },
      { id: "semiconductors", name: "SEMICONDUCTORS" },
      { id: "semiconductor-equip", name: "SEMICONDUCTOR EQUIPMENT" },
      { id: "consumer-electronics", name: "CONSUMER ELECTRONICS" },
      { id: "computer-hardware", name: "COMPUTER HARDWARE" },
      { id: "communication-equip", name: "COMMUNICATION EQUIPMENT" },
      { id: "electronic-comp", name: "ELECTRONIC COMPONENTS" },
      { id: "info-tech-services", name: "INFORMATION TECHNOLOGY SERVICES" },
      { id: "solar", name: "SOLAR" },
      { id: "scientific-instruments", name: "SCIENTIFIC & TECHNICAL INSTRUMENTS" },
    ],
  },
  {
    id: "communication-services",
    name: "COMMUNICATION SERVICES",
    industries: [
      { id: "internet-content", name: "INTERNET CONTENT & INFORMATION" },
      { id: "telecom-services", name: "TELECOM SERVICES" },
      { id: "entertainment", name: "ENTERTAINMENT" },
      { id: "electronic-gaming", name: "ELECTRONIC GAMING & MULTIMEDIA" },
      { id: "advertising", name: "ADVERTISING AGENCIES" },
      { id: "broadcasting", name: "BROADCASTING" },
      { id: "publishing", name: "PUBLISHING" },
    ],
  },
  {
    id: "consumer-cyclical",
    name: "CONSUMER CYCLICAL",
    industries: [
      { id: "internet-retail", name: "INTERNET RETAIL" },
      { id: "auto-manufacturers", name: "AUTO MANUFACTURERS" },
      { id: "restaurants", name: "RESTAURANTS" },
      { id: "travel-services", name: "TRAVEL SERVICES" },
      { id: "apparel-retail", name: "APPAREL RETAIL" },
      { id: "specialty-retail", name: "SPECIALTY RETAIL" },
      { id: "home-improvement", name: "HOME IMPROVEMENT RETAIL" },
      { id: "auto-parts", name: "AUTO PARTS" },
      { id: "residential-construction", name: "RESIDENTIAL CONSTRUCTION" },
      { id: "gambling", name: "GAMBLING" },
      { id: "leisure", name: "LEISURE" },
      { id: "footwear-accessories", name: "FOOTWEAR & ACCESSORIES" },
      { id: "apparel-manufacturing", name: "APPAREL MANUFACTURING" },
      { id: "packaging-containers", name: "PACKAGING & CONTAINERS" },
      { id: "personal-services", name: "PERSONAL SERVICES" },
      { id: "furnishings", name: "FURNISHINGS, FIXTURES & APPLIANCES" },
      { id: "luxury-goods", name: "LUXURY GOODS" },
      { id: "department-stores", name: "DEPARTMENT STORES" },
      { id: "auto-dealers", name: "AUTO & TRUCK DEALERSHIPS" },
    ],
  },
  {
    id: "consumer-defensive",
    name: "CONSUMER DEFENSIVE",
    industries: [
      { id: "discount-stores", name: "DISCOUNT STORES" },
      { id: "beverages-non-alcoholic", name: "BEVERAGES - NON-ALCOHOLIC" },
      { id: "household-products", name: "HOUSEHOLD & PERSONAL PRODUCTS" },
      { id: "tobacco", name: "TOBACCO" },
      { id: "packaged-foods", name: "PACKAGED FOODS" },
      { id: "food-distribution", name: "FOOD DISTRIBUTION" },
      { id: "grocery-stores", name: "GROCERY STORES" },
      { id: "beverages-alcoholic", name: "BEVERAGES - ALCOHOLIC" },
      { id: "confectioners", name: "CONFECTIONERS" },
      { id: "farm-products", name: "FARM PRODUCTS" },
      { id: "education-training", name: "EDUCATION & TRAINING SERVICES" },
    ],
  },
  {
    id: "healthcare",
    name: "HEALTHCARE",
    industries: [
      { id: "drug-manufacturers", name: "DRUG MANUFACTURERS - GENERAL" },
      { id: "drug-specialty", name: "DRUG MANUFACTURERS - SPECIALTY & GENERIC" },
      { id: "medical-devices", name: "MEDICAL DEVICES" },
      { id: "medical-instruments", name: "MEDICAL INSTRUMENTS & SUPPLIES" },
      { id: "diagnostics-research", name: "DIAGNOSTICS & RESEARCH" },
      { id: "biotech", name: "BIOTECHNOLOGY" },
      { id: "healthcare-plans", name: "HEALTHCARE PLANS" },
      { id: "healthcare-providers", name: "MEDICAL CARE FACILITIES" },
      { id: "medical-distribution", name: "MEDICAL DISTRIBUTION" },
      { id: "health-info-services", name: "HEALTH INFORMATION SERVICES" },
    ],
  },
  {
    id: "financial",
    name: "FINANCIAL",
    industries: [
      { id: "banks-diversified", name: "BANKS - DIVERSIFIED" },
      { id: "banks-regional", name: "BANKS - REGIONAL" },
      { id: "credit-services", name: "CREDIT SERVICES" },
      { id: "asset-management", name: "ASSET MANAGEMENT" },
      { id: "insurance-diversified", name: "INSURANCE - DIVERSIFIED" },
      { id: "insurance-life", name: "INSURANCE - LIFE" },
      { id: "insurance-property", name: "INSURANCE - PROPERTY & CASUALTY" },
      { id: "insurance-brokers", name: "INSURANCE BROKERS" },
      { id: "insurance-specialty", name: "INSURANCE - SPECIALTY" },
      { id: "capital-markets", name: "CAPITAL MARKETS" },
      { id: "financial-data", name: "FINANCIAL DATA & STOCK EXCHANGES" },
      { id: "mortgage-finance", name: "MORTGAGE FINANCE" },
      { id: "financial-conglomerates", name: "FINANCIAL CONGLOMERATES" },
      { id: "shell-companies", name: "SHELL COMPANIES" },
    ],
  },
  {
    id: "industrials",
    name: "INDUSTRIALS",
    industries: [
      { id: "aerospace-defense", name: "AEROSPACE & DEFENSE" },
      { id: "railroads", name: "RAILROADS" },
      { id: "farm-machinery", name: "FARM & HEAVY CONSTRUCTION MACHINERY" },
      { id: "industrial-distribution", name: "INDUSTRIAL DISTRIBUTION" },
      { id: "specialty-industrial", name: "SPECIALTY INDUSTRIAL MACHINERY" },
      { id: "integrated-freight", name: "INTEGRATED FREIGHT & LOGISTICS" },
      { id: "waste-management", name: "WASTE MANAGEMENT" },
      { id: "conglomerates", name: "CONGLOMERATES" },
      { id: "airlines", name: "AIRLINES" },
      { id: "trucking", name: "TRUCKING" },
      { id: "consulting-services", name: "CONSULTING SERVICES" },
      { id: "engineering-construction", name: "ENGINEERING & CONSTRUCTION" },
      { id: "building-products", name: "BUILDING PRODUCTS & EQUIPMENT" },
      { id: "rental-leasing", name: "RENTAL & LEASING SERVICES" },
      { id: "staffing", name: "STAFFING & EMPLOYMENT SERVICES" },
      { id: "business-equipment", name: "BUSINESS EQUIPMENT & SUPPLIES" },
      { id: "electrical-equipment", name: "ELECTRICAL EQUIPMENT & PARTS" },
      { id: "security-protection", name: "SECURITY & PROTECTION SERVICES" },
      { id: "marine-shipping", name: "MARINE SHIPPING" },
      { id: "airports", name: "AIRPORTS & AIR SERVICES" },
      { id: "tools-accessories", name: "TOOLS & ACCESSORIES" },
      { id: "metal-fabrication", name: "METAL FABRICATION" },
      { id: "pollution-treatment", name: "POLLUTION & TREATMENT CONTROLS" },
    ],
  },
  {
    id: "energy",
    name: "ENERGY",
    industries: [
      { id: "oil-gas-integrated", name: "OIL & GAS INTEGRATED" },
      { id: "oil-gas-ep", name: "OIL & GAS E&P" },
      { id: "oil-gas-midstream", name: "OIL & GAS MIDSTREAM" },
      { id: "oil-gas-refining", name: "OIL & GAS REFINING & MARKETING" },
      { id: "oil-gas-drilling", name: "OIL & GAS DRILLING" },
      { id: "oil-gas-equipment", name: "OIL & GAS EQUIPMENT & SERVICES" },
      { id: "uranium", name: "URANIUM" },
      { id: "thermal-coal", name: "THERMAL COAL" },
    ],
  },
  {
    id: "utilities",
    name: "UTILITIES",
    industries: [
      { id: "utilities-regulated", name: "UTILITIES - REGULATED ELECTRIC" },
      { id: "utilities-diversified", name: "UTILITIES - DIVERSIFIED" },
      { id: "utilities-renewable", name: "UTILITIES - RENEWABLE" },
      { id: "utilities-gas", name: "UTILITIES - REGULATED GAS" },
      { id: "utilities-water", name: "UTILITIES - REGULATED WATER" },
      { id: "utilities-independent", name: "UTILITIES - INDEPENDENT POWER PRODUCERS" },
    ],
  },
  {
    id: "real-estate",
    name: "REAL ESTATE",
    industries: [
      { id: "reit-specialty", name: "REIT - SPECIALTY" },
      { id: "reit-industrial", name: "REIT - INDUSTRIAL" },
      { id: "reit-retail", name: "REIT - RETAIL" },
      { id: "reit-residential", name: "REIT - RESIDENTIAL" },
      { id: "reit-healthcare", name: "REIT - HEALTHCARE FACILITIES" },
      { id: "reit-office", name: "REIT - OFFICE" },
      { id: "reit-diversified", name: "REIT - DIVERSIFIED" },
      { id: "reit-hotel", name: "REIT - HOTEL & MOTEL" },
      { id: "reit-mortgage", name: "REIT - MORTGAGE" },
      { id: "real-estate-services", name: "REAL ESTATE SERVICES" },
      { id: "real-estate-development", name: "REAL ESTATE - DEVELOPMENT" },
      { id: "real-estate-diversified", name: "REAL ESTATE - DIVERSIFIED" },
    ],
  },
  {
    id: "basic-materials",
    name: "BASIC MATERIALS",
    industries: [
      { id: "specialty-chemicals", name: "SPECIALTY CHEMICALS" },
      { id: "gold", name: "GOLD" },
      { id: "copper", name: "COPPER" },
      { id: "steel", name: "STEEL" },
      { id: "agricultural-inputs", name: "AGRICULTURAL INPUTS" },
      { id: "aluminum", name: "ALUMINUM" },
      { id: "building-materials", name: "BUILDING MATERIALS" },
      { id: "chemicals", name: "CHEMICALS" },
      { id: "other-industrial-metals", name: "OTHER INDUSTRIAL METALS & MINING" },
      { id: "other-precious-metals", name: "OTHER PRECIOUS METALS & MINING" },
      { id: "lumber-wood", name: "LUMBER & WOOD PRODUCTION" },
      { id: "coking-coal", name: "COKING COAL" },
      { id: "paper", name: "PAPER & PAPER PRODUCTS" },
      { id: "silver", name: "SILVER" },
    ],
  },
];

// =============================================================================
// STOCK SYMBOL LISTS
// =============================================================================

// S&P 500 Full List (503 stocks as of Dec 2024)
export const SP500_FULL: string[] = [
  // Technology
  "AAPL", "MSFT", "NVDA", "AVGO", "ORCL", "CRM", "AMD", "ADBE", "CSCO", "ACN",
  "IBM", "INTC", "INTU", "QCOM", "TXN", "NOW", "AMAT", "ADI", "MU", "LRCX",
  "KLAC", "CDNS", "SNPS", "MCHP", "FTNT", "PANW", "ANSS", "KEYS", "NXPI", "ON",
  "MPWR", "CTSH", "IT", "HPQ", "HPE", "ANET", "CDW", "EPAM", "FFIV", "JNPR",
  "SWKS", "QRVO", "GEN", "ZBRA", "NTAP", "GLW", "ENPH", "SEDG", "FSLR", "ROP",
  "TYL", "PTC", "TRMB", "LDOS", "AKAM", "JKHY", "PAYC", "CDAY",

  // Communication Services
  "GOOGL", "GOOG", "META", "NFLX", "DIS", "CMCSA", "T", "VZ", "TMUS", "CHTR",
  "EA", "TTWO", "WBD", "PARA", "FOX", "FOXA", "MTCH", "IPG", "OMC", "LYV",
  "NWS", "NWSA",

  // Consumer Discretionary
  "AMZN", "TSLA", "HD", "MCD", "NKE", "LOW", "SBUX", "TJX", "BKNG", "MAR",
  "HLT", "GM", "F", "ABNB", "CMG", "ORLY", "AZO", "ROST", "DHI", "LEN",
  "PHM", "NVR", "EBAY", "YUM", "DRI", "GPC", "BBY", "ULTA", "POOL", "GRMN",
  "LVS", "MGM", "WYNN", "CZR", "DPZ", "EXPE", "CCL", "RCL", "NCLH", "TPR",
  "HAS", "BWA", "LKQ", "KMX", "APTV", "ETSY", "DECK", "LULU", "VFC", "RL",
  "GNRC", "WHR", "MHK", "NWL", "PVH", "CPRI",

  // Consumer Staples
  "PG", "KO", "PEP", "COST", "WMT", "PM", "MO", "CL", "MDLZ", "KMB",
  "GIS", "HSY", "KDP", "SYY", "KR", "STZ", "ADM", "MKC", "CAG", "TAP",
  "CHD", "CPB", "SJM", "HRL", "K", "CLX", "TSN", "BF-B", "WBA", "DG",
  "DLTR", "EL", "KVUE",

  // Healthcare
  "LLY", "UNH", "JNJ", "MRK", "ABBV", "PFE", "TMO", "ABT", "DHR", "BMY",
  "AMGN", "GILD", "VRTX", "ISRG", "MDT", "ELV", "CI", "CVS", "SYK", "REGN",
  "BDX", "ZTS", "BSX", "HCA", "MCK", "GEHC", "EW", "DXCM", "IQV", "A",
  "IDXX", "MTD", "RMD", "CAH", "COR", "ALGN", "PODD", "HOLX", "WAT", "TECH",
  "COO", "MOH", "HUM", "CNC", "BIIB", "VTRS", "LH", "DGX", "INCY", "HSIC",

  // Financial
  "JPM", "V", "MA", "BAC", "WFC", "MS", "GS", "AXP", "SPGI", "BLK",
  "C", "SCHW", "CB", "MMC", "PGR", "CME", "AON", "ICE", "USB", "AJG",
  "PNC", "MET", "AFL", "AIG", "TRV", "PRU", "ALL", "MSCI", "MCO", "COF",
  "BK", "STT", "NDAQ", "DFS", "FITB", "HBAN", "MTB", "KEY", "CFG", "TROW",
  "RF", "NTRS", "CINF", "FDS", "CBOE", "RJF", "L", "WRB", "BRO", "EG",
  "GL", "ERIE", "RE", "HIG", "LNC", "MKTX", "AIZ", "BEN", "IVZ", "FRT",
  "ACGL", "AMP", "NYCB",

  // Industrials
  "GE", "CAT", "UNP", "RTX", "HON", "DE", "UPS", "BA", "LMT", "ADP",
  "ETN", "WM", "ITW", "EMR", "GD", "FDX", "NSC", "CSX", "PH", "TT",
  "NOC", "CARR", "JCI", "PCAR", "CPRT", "FAST", "CTAS", "RSG", "ODFL", "DAL",
  "LUV", "UAL", "AAL", "ALK", "JBHT", "XYL", "DOV", "OTIS", "ROK", "AME",
  "IR", "CMI", "GWW", "PWR", "VRSK", "WAB", "AXON", "EFX", "EXPD", "HWM",
  "BR", "CHRW", "SNA", "MAS", "J", "TDG", "HII", "IEX", "RHI",
  "NDSN", "ALLE", "SWK", "PNR", "LHX", "TXT",

  // Energy
  "XOM", "CVX", "COP", "SLB", "EOG", "MPC", "PSX", "VLO", "PXD", "OXY",
  "WMB", "KMI", "HES", "DVN", "HAL", "BKR", "FANG", "CTRA", "OKE", "TRGP",
  "MRO", "APA",

  // Utilities
  "NEE", "SO", "DUK", "D", "SRE", "AEP", "EXC", "XEL", "PEG", "ED",
  "WEC", "ES", "AWK", "EIX", "DTE", "AEE", "ETR", "PPL", "FE", "CMS",
  "CNP", "NI", "EVRG", "ATO", "NRG", "AES", "PNW", "LNT", "CEG",

  // Real Estate
  "PLD", "AMT", "EQIX", "CCI", "PSA", "O", "WELL", "DLR", "SPG", "SBAC",
  "AVB", "EQR", "VICI", "CBRE", "WY", "VTR", "ARE", "MAA", "EXR", "IRM",
  "UDR", "ESS", "INVH", "KIM", "REG", "CPT", "HST", "BXP", "DOC", "PEAK",

  // Materials
  "LIN", "APD", "SHW", "ECL", "FCX", "NEM", "NUE", "VMC", "MLM", "DD",
  "PPG", "DOW", "CTVA", "ALB", "FMC", "CE", "CF", "MOS", "IFF", "EMN",
  "IP", "PKG", "AVY", "BALL", "AMCR", "SEE", "WRK",
];

// Dow Jones Industrial Average (30 stocks)
export const DOW_JONES_30: string[] = [
  "AAPL", "AMGN", "AMZN", "AXP", "BA", "CAT", "CRM", "CSCO", "CVX", "DIS",
  "DOW", "GS", "HD", "HON", "IBM", "INTC", "JNJ", "JPM", "KO", "MCD",
  "MMM", "MRK", "MSFT", "NKE", "PG", "TRV", "UNH", "V", "VZ", "WMT",
];

// NASDAQ-100 (100 stocks)
export const NASDAQ_100: string[] = [
  "AAPL", "ABNB", "ADBE", "ADI", "ADP", "ADSK", "AEP", "AMAT", "AMGN", "AMZN",
  "ANSS", "ARM", "ASML", "AVGO", "AZN", "BIIB", "BKNG", "BKR", "CCEP", "CDNS",
  "CDW", "CEG", "CHTR", "CMCSA", "COST", "CPRT", "CRWD", "CSCO", "CSGP", "CSX",
  "CTAS", "CTSH", "DDOG", "DLTR", "DXCM", "EA", "EXC", "FANG", "FAST", "FTNT",
  "GEHC", "GFS", "GILD", "GOOG", "GOOGL", "HON", "IDXX", "ILMN", "INTC", "INTU",
  "ISRG", "KDP", "KHC", "KLAC", "LIN", "LRCX", "LULU", "MAR", "MCHP", "MDB",
  "MDLZ", "MELI", "META", "MNST", "MRNA", "MRVL", "MSFT", "MU", "NFLX", "NVDA",
  "NXPI", "ODFL", "ON", "ORLY", "PANW", "PAYX", "PCAR", "PDD", "PEP", "PYPL",
  "QCOM", "REGN", "ROP", "ROST", "SBUX", "SMCI", "SNPS", "TEAM", "TMUS", "TSLA",
  "TTD", "TTWO", "TXN", "VRSK", "VRTX", "WBD", "WDAY", "XEL", "ZS",
];

// Russell 2000 Top 200 (by market cap - representative sample)
export const RUSSELL_2000_TOP: string[] = [
  "SMCI", "MARA", "RIOT", "SOUN", "IONQ", "JOBY", "AEHR", "WOLF", "ENVX", "POWL",
  "CLSK", "BTBT", "CIFR", "HIVE", "MSTR", "FTAI", "INSM", "RXRX", "SAIA", "CSWI",
  "CORT", "RBC", "MOD", "ITRI", "WULF", "ALKT", "GSHD", "CPRX", "HRMY", "PLXS",
  "CRVL", "KTOS", "AXSM", "WDFC", "DFIN", "VECO", "UFI", "STEP", "PAYO", "SPSC",
  "NMIH", "PRVA", "LNTH", "TTMI", "KRYS", "CVLT", "SITM", "PIPR", "CNX", "FORM",
  "VCTR", "OMCL", "EXTR", "CALM", "PRIM", "ASGN", "BTU", "SIG", "ATKR", "MATX",
  "DY", "KWR", "LCII", "CERT", "ICUI", "MGRC", "NNI", "FSS", "COLL", "BMI",
  "VCEL", "SEM", "AVNT", "MC", "MGEE", "BGS", "HI", "STRA", "REZI", "PINC",
  "ARCB", "LAUR", "PTGX", "MTH", "DORM", "GVA", "EXEL", "IPAR", "CALX", "CWT",
  "HLI", "IOVA", "RELY", "CRGY", "TNET", "RXO", "NABL", "SNEX", "LBRT", "DIOD",
];

// Top ETFs (reduced for faster loading - 15 most important)
export const TOP_ETFS: string[] = [
  // US Index (3)
  "SPY", "QQQ", "IWM",
  // US Sector (5)
  "XLK", "XLF", "XLE", "XLV", "XLI",
  // Fixed Income (2)
  "TLT", "HYG",
  // Commodity (3)
  "GLD", "SLV", "USO",
  // International (2)
  "EEM", "FXI",
];

// ETF category mapping for heatmap sectors
export const ETF_CATEGORIES: Record<string, { sector: string; industry: string }> = {
  // US INDEX
  "SPY": { sector: "US Index", industry: "S&P 500" },
  "VOO": { sector: "US Index", industry: "S&P 500" },
  "QQQ": { sector: "US Index", industry: "Nasdaq 100" },
  "DIA": { sector: "US Index", industry: "Dow Jones" },
  "IWM": { sector: "US Index", industry: "Russell 2000" },
  "VTI": { sector: "US Index", industry: "Total Market" },
  // US SECTOR
  "XLK": { sector: "US Sector", industry: "Technology" },
  "XLF": { sector: "US Sector", industry: "Financials" },
  "XLE": { sector: "US Sector", industry: "Energy" },
  "XLV": { sector: "US Sector", industry: "Healthcare" },
  "XLY": { sector: "US Sector", industry: "Consumer Cyclical" },
  "XLP": { sector: "US Sector", industry: "Consumer Staples" },
  "XLI": { sector: "US Sector", industry: "Industrials" },
  "XLU": { sector: "US Sector", industry: "Utilities" },
  "XLB": { sector: "US Sector", industry: "Materials" },
  "XLRE": { sector: "US Sector", industry: "Real Estate" },
  // FIXED INCOME
  "AGG": { sector: "Fixed Income", industry: "Aggregate Bond" },
  "TLT": { sector: "Fixed Income", industry: "Treasury Long" },
  "BND": { sector: "Fixed Income", industry: "Total Bond" },
  "HYG": { sector: "Fixed Income", industry: "High Yield" },
  "LQD": { sector: "Fixed Income", industry: "Corporate" },
  // COMMODITY
  "GLD": { sector: "Commodity", industry: "Gold" },
  "SLV": { sector: "Commodity", industry: "Silver" },
  "USO": { sector: "Commodity", industry: "Oil" },
  "GDX": { sector: "Commodity", industry: "Gold Miners" },
  // INTERNATIONAL
  "EFA": { sector: "International", industry: "Developed Markets" },
  "EEM": { sector: "International", industry: "Emerging Markets" },
  "VWO": { sector: "International", industry: "Emerging Markets" },
  "FXI": { sector: "International", industry: "China" },
  "VEA": { sector: "International", industry: "Developed Markets" },
};

// Crypto assets (reduced for faster loading - 10 most important)
export const CRYPTO_ASSETS: string[] = [
  "BTC-USD", "ETH-USD", "SOL-USD", "BNB-USD", "XRP-USD",
  "ADA-USD", "DOGE-USD", "AVAX-USD", "LINK-USD", "LTC-USD",
];

// Futures contracts
export const FUTURES_CONTRACTS: string[] = [
  "ES=F", "NQ=F", "YM=F", "RTY=F", // Index futures
  "CL=F", "BZ=F", "NG=F", "RB=F", "HO=F", // Energy futures
  "GC=F", "SI=F", "PL=F", "PA=F", "HG=F", // Metals futures
  "ZC=F", "ZS=F", "ZW=F", "ZM=F", "ZL=F", // Grain futures
  "LE=F", "HE=F", "GF=F", // Livestock futures
  "KC=F", "SB=F", "CC=F", "CT=F", "OJ=F", // Soft futures
  "6E=F", "6J=F", "6B=F", "6C=F", "6A=F", "6S=F", // Currency futures
  "ZB=F", "ZN=F", "ZF=F", "ZT=F", // Treasury futures
  "VX=F", // VIX futures
];

// =============================================================================
// INDUSTRY MAPPING (Symbol -> Industry ID)
// =============================================================================

export const STOCK_INDUSTRY_MAP: Record<string, string> = {
  // Technology - Software Infrastructure
  "MSFT": "software-infra", "ORCL": "software-infra", "CRM": "software-infra", "NOW": "software-infra",
  "INTU": "software-infra", "PANW": "software-infra", "CRWD": "software-infra", "FTNT": "software-infra",
  "SNPS": "software-infra", "CDNS": "software-infra", "ANSS": "software-infra", "PLTR": "software-infra",
  "NET": "software-infra", "ZS": "software-infra", "DDOG": "software-infra", "MDB": "software-infra",
  "SNOW": "software-infra", "SPLK": "software-infra", "OKTA": "software-infra", "WDAY": "software-infra",
  "TEAM": "software-infra", "ESTC": "software-infra", "CFLT": "software-infra", "PATH": "software-infra",
  "BILL": "software-infra", "NCNO": "software-infra", "DOCN": "software-infra", "MNDY": "software-infra",
  "HUBS": "software-infra", "ZEN": "software-infra", "RNG": "software-infra", "DBX": "software-infra",
  "BOX": "software-infra", "FROG": "software-infra", "GTLB": "software-infra", "BRZE": "software-infra",

  // Technology - Software Application
  "ADBE": "software-app", "DOCU": "software-app", "ADSK": "software-app", "PAYC": "software-app",
  "SMAR": "software-app", "ASAN": "software-app", "TYL": "software-app", "PTC": "software-app",
  "APP": "software-app", "DUOL": "software-app",
  "ZI": "software-app", "FRSH": "software-app", "JAMF": "software-app", "PCOR": "software-app",

  // Technology - Semiconductors
  "NVDA": "semiconductors", "AVGO": "semiconductors", "AMD": "semiconductors", "INTC": "semiconductors",
  "QCOM": "semiconductors", "TXN": "semiconductors", "MU": "semiconductors", "ADI": "semiconductors",
  "NXPI": "semiconductors", "MCHP": "semiconductors", "ON": "semiconductors", "MRVL": "semiconductors",
  "MPWR": "semiconductors", "SWKS": "semiconductors", "QRVO": "semiconductors", "GFS": "semiconductors",
  "ARM": "semiconductors", "SMCI": "semiconductors",

  // Technology - Semiconductor Equipment
  "AMAT": "semiconductor-equip", "LRCX": "semiconductor-equip", "KLAC": "semiconductor-equip",
  "ASML": "semiconductor-equip", "ENTG": "semiconductor-equip", "MKSI": "semiconductor-equip",
  "COHR": "semiconductor-equip", "NVMI": "semiconductor-equip", "CRUS": "semiconductor-equip",

  // Technology - Consumer Electronics
  "AAPL": "consumer-electronics", "SONO": "consumer-electronics", "HEAR": "consumer-electronics",
  "GPRO": "consumer-electronics", "LOGI": "consumer-electronics", "KOSS": "consumer-electronics",

  // Technology - Computer Hardware
  "DELL": "computer-hardware", "HPQ": "computer-hardware", "HPE": "computer-hardware",
  "NTAP": "computer-hardware", "PSTG": "computer-hardware", "WDC": "computer-hardware",
  "STX": "computer-hardware", "IBM": "computer-hardware",

  // Technology - Communication Equipment
  "CSCO": "communication-equip", "ANET": "communication-equip", "JNPR": "communication-equip",
  "FFIV": "communication-equip", "CIEN": "communication-equip", "LITE": "communication-equip",
  "VIAV": "communication-equip", "COMM": "communication-equip",

  // Technology - IT Services
  "ACN": "info-tech-services", "CTSH": "info-tech-services", "IT": "info-tech-services",
  "CDW": "info-tech-services", "EPAM": "info-tech-services", "LDOS": "info-tech-services",
  "INFY": "info-tech-services", "WIT": "info-tech-services", "GLOB": "info-tech-services",

  // Communication Services - Internet Content
  "GOOGL": "internet-content", "GOOG": "internet-content", "META": "internet-content",
  "PINS": "internet-content", "SNAP": "internet-content", "MTCH": "internet-content",
  "BMBL": "internet-content", "ZG": "internet-content", "Z": "internet-content",
  "YELP": "internet-content", "IAC": "internet-content", "ANGI": "internet-content",
  "TWTR": "internet-content",

  // Communication Services - Entertainment
  "NFLX": "entertainment", "DIS": "entertainment", "WBD": "entertainment", "PARA": "entertainment",
  "FOX": "entertainment", "FOXA": "entertainment", "LGF-A": "entertainment", "LSXMA": "entertainment",
  "SIRI": "entertainment", "LYV": "entertainment", "IMAX": "entertainment",

  // Communication Services - Telecom
  "T": "telecom-services", "VZ": "telecom-services", "TMUS": "telecom-services",
  "LUMN": "telecom-services", "CHTR": "telecom-services", "CMCSA": "telecom-services",

  // Communication Services - Gaming
  "EA": "electronic-gaming", "TTWO": "electronic-gaming", "ATVI": "electronic-gaming",
  "SE": "electronic-gaming",

  // Consumer Cyclical - Internet Retail
  "AMZN": "internet-retail", "BABA": "internet-retail", "JD": "internet-retail",
  "PDD": "internet-retail", "MELI": "internet-retail", "EBAY": "internet-retail",
  "ETSY": "internet-retail", "W": "internet-retail", "CVNA": "internet-retail",
  "CHWY": "internet-retail", "FTCH": "internet-retail",

  // Consumer Cyclical - Auto Manufacturers
  "TSLA": "auto-manufacturers", "GM": "auto-manufacturers", "F": "auto-manufacturers",
  "TM": "auto-manufacturers", "HMC": "auto-manufacturers", "RIVN": "auto-manufacturers",
  "LCID": "auto-manufacturers", "NIO": "auto-manufacturers", "LI": "auto-manufacturers",
  "XPEV": "auto-manufacturers", "STLA": "auto-manufacturers",

  // Consumer Cyclical - Restaurants
  "MCD": "restaurants", "SBUX": "restaurants", "CMG": "restaurants", "YUM": "restaurants",
  "DRI": "restaurants", "DPZ": "restaurants", "QSR": "restaurants", "WING": "restaurants",
  "CAVA": "restaurants", "SHAK": "restaurants", "BROS": "restaurants",

  // Consumer Cyclical - Travel & Hotels
  "BKNG": "travel-services", "MAR": "travel-services", "HLT": "travel-services",
  "ABNB": "travel-services", "EXPE": "travel-services", "H": "travel-services",
  "WH": "travel-services", "IHG": "travel-services", "CCL": "travel-services",
  "RCL": "travel-services", "NCLH": "travel-services",

  // Consumer Cyclical - Retail
  "HD": "home-improvement", "LOW": "home-improvement", "ORLY": "specialty-retail",
  "AZO": "specialty-retail", "TJX": "apparel-retail", "ROST": "apparel-retail",
  "GPS": "apparel-retail", "ANF": "apparel-retail", "URBN": "apparel-retail",
  "BBY": "specialty-retail", "ULTA": "specialty-retail", "FIVE": "specialty-retail",
  "WSM": "specialty-retail", "RH": "specialty-retail", "TSCO": "specialty-retail",
  "AAP": "specialty-retail", "GPC": "specialty-retail", "POOL": "specialty-retail",

  // Consumer Cyclical - Home Builders
  "DHI": "residential-construction", "LEN": "residential-construction",
  "PHM": "residential-construction", "NVR": "residential-construction",
  "TOL": "residential-construction", "KBH": "residential-construction",
  "MTH": "residential-construction", "MDC": "residential-construction",

  // Consumer Cyclical - Apparel
  "NKE": "footwear-accessories", "LULU": "apparel-manufacturing", "VFC": "apparel-manufacturing",
  "RL": "apparel-manufacturing", "PVH": "apparel-manufacturing", "HBI": "apparel-manufacturing",
  "UA": "footwear-accessories", "UAA": "footwear-accessories", "DECK": "footwear-accessories",
  "SKX": "footwear-accessories", "CROX": "footwear-accessories", "GOOS": "apparel-manufacturing",
  "TPR": "footwear-accessories", "CPRI": "luxury-goods",

  // Consumer Cyclical - Gambling
  "LVS": "gambling", "MGM": "gambling", "WYNN": "gambling", "CZR": "gambling",
  "PENN": "gambling", "DKNG": "gambling", "FLUT": "gambling", "GENI": "gambling",

  // Consumer Defensive - Discount Stores
  "WMT": "discount-stores", "COST": "discount-stores", "TGT": "discount-stores",
  "DG": "discount-stores", "DLTR": "discount-stores", "BJ": "discount-stores",

  // Consumer Defensive - Beverages
  "KO": "beverages-non-alcoholic", "PEP": "beverages-non-alcoholic", "MNST": "beverages-non-alcoholic",
  "KDP": "beverages-non-alcoholic", "CELH": "beverages-non-alcoholic",
  "STZ": "beverages-alcoholic", "BF-B": "beverages-alcoholic", "SAM": "beverages-alcoholic",
  "TAP": "beverages-alcoholic", "DEO": "beverages-alcoholic",

  // Consumer Defensive - Household Products
  "PG": "household-products", "CL": "household-products", "KMB": "household-products",
  "CLX": "household-products", "CHD": "household-products", "SPB": "household-products",
  "EL": "household-products", "COTY": "household-products", "ELF": "household-products",

  // Consumer Defensive - Packaged Foods
  "MDLZ": "packaged-foods", "GIS": "packaged-foods", "HSY": "packaged-foods",
  "K": "packaged-foods", "CPB": "packaged-foods", "CAG": "packaged-foods",
  "SJM": "packaged-foods", "MKC": "packaged-foods", "HRL": "packaged-foods",
  "TSN": "packaged-foods", "INGR": "packaged-foods",

  // Consumer Defensive - Tobacco
  "PM": "tobacco", "MO": "tobacco", "BTI": "tobacco", "BGCP": "tobacco",

  // Consumer Defensive - Food Distribution
  "SYY": "food-distribution", "USFD": "food-distribution", "PFGC": "food-distribution",

  // Consumer Defensive - Grocery
  "KR": "grocery-stores", "ACI": "grocery-stores", "SFM": "grocery-stores",

  // Consumer Defensive - Farm Products
  "ADM": "farm-products", "BG": "farm-products",
  "DAR": "farm-products",

  // Healthcare - Drug Manufacturers General
  "LLY": "drug-manufacturers", "JNJ": "drug-manufacturers", "MRK": "drug-manufacturers",
  "PFE": "drug-manufacturers", "ABBV": "drug-manufacturers", "BMY": "drug-manufacturers",
  "AZN": "drug-manufacturers", "GSK": "drug-manufacturers", "NVS": "drug-manufacturers",
  "SNY": "drug-manufacturers", "RHHBY": "drug-manufacturers",

  // Healthcare - Drug Specialty
  "VRTX": "drug-specialty", "REGN": "drug-specialty", "GILD": "drug-specialty",
  "BIIB": "drug-specialty", "MRNA": "drug-specialty", "INCY": "drug-specialty",
  "ALNY": "drug-specialty", "SGEN": "drug-specialty", "JAZZ": "drug-specialty",
  "UTHR": "drug-specialty", "NBIX": "drug-specialty",

  // Healthcare - Medical Devices
  "MDT": "medical-devices", "ABT": "medical-devices", "SYK": "medical-devices",
  "BSX": "medical-devices", "EW": "medical-devices", "ISRG": "medical-devices",
  "BDX": "medical-devices", "DXCM": "medical-devices", "ZBH": "medical-devices",
  "ALGN": "medical-devices", "PODD": "medical-devices", "HOLX": "medical-devices",
  "COO": "medical-devices", "TFX": "medical-devices", "NVST": "medical-devices",
  "INSP": "medical-devices",

  // Healthcare - Diagnostics
  "DHR": "diagnostics-research", "TMO": "diagnostics-research", "A": "diagnostics-research",
  "ILMN": "diagnostics-research", "IDXX": "diagnostics-research", "MTD": "diagnostics-research",
  "WAT": "diagnostics-research", "TECH": "diagnostics-research", "IQV": "diagnostics-research",
  "BIO": "diagnostics-research", "PKI": "diagnostics-research", "QGEN": "diagnostics-research",

  // Healthcare - Biotech
  "AMGN": "biotech", "BNTX": "biotech", "BMRN": "biotech",
  "EXEL": "biotech", "SRPT": "biotech", "PCVX": "biotech", "IONS": "biotech",
  "HALO": "biotech", "RARE": "biotech", "BPMC": "biotech", "ARWR": "biotech",

  // Healthcare - Healthcare Plans
  "UNH": "healthcare-plans", "ELV": "healthcare-plans", "CI": "healthcare-plans",
  "HUM": "healthcare-plans", "CNC": "healthcare-plans", "MOH": "healthcare-plans",

  // Healthcare - Medical Facilities
  "HCA": "healthcare-providers", "UHS": "healthcare-providers", "THC": "healthcare-providers",
  "CYH": "healthcare-providers", "ACHC": "healthcare-providers", "DVA": "healthcare-providers",

  // Healthcare - Medical Distribution
  "MCK": "medical-distribution", "CAH": "medical-distribution", "COR": "medical-distribution",

  // Healthcare - Health Info
  "CVS": "health-info-services", "WBA": "health-info-services", "VEEV": "health-info-services",
  "GEHC": "diagnostics-research", "LH": "diagnostics-research", "DGX": "diagnostics-research",

  // Healthcare - Medical Instruments
  "RMD": "medical-instruments", "HSIC": "medical-instruments", "XRAY": "medical-instruments",
  "NUVA": "medical-instruments", "GMED": "medical-instruments",

  // Financial - Banks Diversified
  "JPM": "banks-diversified", "BAC": "banks-diversified", "WFC": "banks-diversified",
  "C": "banks-diversified", "USB": "banks-diversified", "PNC": "banks-diversified",
  "TFC": "banks-diversified", "SCHW": "banks-diversified",

  // Financial - Banks Regional
  "MTB": "banks-regional", "KEY": "banks-regional", "CFG": "banks-regional",
  "RF": "banks-regional", "FITB": "banks-regional", "HBAN": "banks-regional",
  "ZION": "banks-regional", "CMA": "banks-regional", "FHN": "banks-regional",
  "WAL": "banks-regional", "SIVB": "banks-regional", "PACW": "banks-regional",

  // Financial - Credit Services
  "V": "credit-services", "MA": "credit-services", "AXP": "credit-services",
  "COF": "credit-services", "DFS": "credit-services", "SYF": "credit-services",
  "PYPL": "credit-services", "SQ": "credit-services", "AFRM": "credit-services",
  "UPST": "credit-services", "SOFI": "credit-services",

  // Financial - Asset Management
  "BLK": "asset-management", "BX": "asset-management", "KKR": "asset-management",
  "APO": "asset-management", "CG": "asset-management", "ARES": "asset-management",
  "OWL": "asset-management", "TROW": "asset-management", "BEN": "asset-management",
  "IVZ": "asset-management", "AMG": "asset-management",

  // Financial - Capital Markets
  "MS": "capital-markets", "GS": "capital-markets", "SPGI": "capital-markets",
  "MSCI": "capital-markets", "MCO": "capital-markets", "ICE": "capital-markets",
  "CME": "capital-markets", "NDAQ": "capital-markets", "CBOE": "capital-markets",
  "MKTX": "capital-markets", "FDS": "capital-markets", "COIN": "capital-markets",
  "HOOD": "capital-markets",

  // Financial - Insurance Diversified
  "BRK-B": "insurance-diversified", "BRK-A": "insurance-diversified",
  "CB": "insurance-diversified", "MMC": "insurance-diversified",
  "AON": "insurance-diversified", "AJG": "insurance-diversified",
  "ACGL": "insurance-diversified",

  // Financial - Insurance Life
  "MET": "insurance-life", "PRU": "insurance-life", "AFL": "insurance-life",
  "LNC": "insurance-life", "PFG": "insurance-life", "VOYA": "insurance-life",
  "UNM": "insurance-life", "GL": "insurance-life",

  // Financial - Insurance Property
  "PGR": "insurance-property", "TRV": "insurance-property", "ALL": "insurance-property",
  "AIG": "insurance-property", "HIG": "insurance-property", "CNA": "insurance-property",
  "WRB": "insurance-property", "CINF": "insurance-property", "L": "insurance-property",
  "RE": "insurance-property",

  // Industrials - Aerospace & Defense
  "RTX": "aerospace-defense", "LMT": "aerospace-defense", "BA": "aerospace-defense",
  "GE": "aerospace-defense", "NOC": "aerospace-defense", "GD": "aerospace-defense",
  "TDG": "aerospace-defense", "HWM": "aerospace-defense", "LHX": "aerospace-defense",
  "HII": "aerospace-defense", "TXT": "aerospace-defense", "AXON": "aerospace-defense",
  "KTOS": "aerospace-defense", "CACI": "aerospace-defense",
  "SPR": "aerospace-defense",

  // Industrials - Railroads
  "UNP": "railroads", "NSC": "railroads", "CSX": "railroads", "CP": "railroads",
  "CNI": "railroads",

  // Industrials - Machinery
  "CAT": "farm-machinery", "DE": "farm-machinery", "PCAR": "farm-machinery",
  "CMI": "specialty-industrial", "EMR": "specialty-industrial", "ROK": "specialty-industrial",
  "ETN": "specialty-industrial", "ITW": "specialty-industrial", "PH": "specialty-industrial",
  "DOV": "specialty-industrial", "AME": "specialty-industrial", "IR": "specialty-industrial",
  "XYL": "specialty-industrial", "FTV": "specialty-industrial", "NDSN": "specialty-industrial",
  "IEX": "specialty-industrial",

  // Industrials - Freight & Logistics
  "UPS": "integrated-freight", "FDX": "integrated-freight", "XPO": "integrated-freight",
  "ODFL": "integrated-freight", "SAIA": "integrated-freight", "JBHT": "integrated-freight",
  "CHRW": "integrated-freight", "EXPD": "integrated-freight", "RXO": "integrated-freight",
  "HUBG": "integrated-freight", "KNX": "integrated-freight", "WERN": "integrated-freight",

  // Industrials - Airlines
  "DAL": "airlines", "UAL": "airlines", "LUV": "airlines", "AAL": "airlines",
  "ALK": "airlines", "JBLU": "airlines", "HA": "airlines", "SAVE": "airlines",

  // Industrials - Waste Management
  "WM": "waste-management", "RSG": "waste-management", "WCN": "waste-management",
  "CWST": "waste-management", "CLH": "waste-management", "SRCL": "waste-management",

  // Industrials - Building Products
  "JCI": "building-products", "CARR": "building-products", "TT": "building-products",
  "OTIS": "building-products", "LII": "building-products", "ALLE": "building-products",
  "AOS": "building-products", "MAS": "building-products",

  // Industrials - Conglomerates
  "HON": "conglomerates", "MMM": "conglomerates",

  // Industrials - Consulting
  "ADP": "consulting-services", "PAYX": "consulting-services", "CTAS": "consulting-services",
  "CPRT": "consulting-services", "FAST": "consulting-services", "WAB": "consulting-services",
  "BR": "consulting-services", "EFX": "consulting-services", "VRSK": "consulting-services",
  "INFO": "consulting-services",

  // Energy - Oil & Gas Integrated
  "XOM": "oil-gas-integrated", "CVX": "oil-gas-integrated", "SHEL": "oil-gas-integrated",
  "BP": "oil-gas-integrated", "TTE": "oil-gas-integrated",

  // Energy - Oil & Gas E&P
  "COP": "oil-gas-ep", "EOG": "oil-gas-ep", "PXD": "oil-gas-ep", "HES": "oil-gas-ep",
  "DVN": "oil-gas-ep", "FANG": "oil-gas-ep", "MRO": "oil-gas-ep", "APA": "oil-gas-ep",
  "CTRA": "oil-gas-ep", "EQT": "oil-gas-ep", "OXY": "oil-gas-ep",

  // Energy - Oil & Gas Midstream
  "WMB": "oil-gas-midstream", "KMI": "oil-gas-midstream", "OKE": "oil-gas-midstream",
  "TRGP": "oil-gas-midstream", "EPD": "oil-gas-midstream", "ET": "oil-gas-midstream",
  "MPLX": "oil-gas-midstream", "PAA": "oil-gas-midstream",

  // Energy - Oil & Gas Refining
  "MPC": "oil-gas-refining", "PSX": "oil-gas-refining", "VLO": "oil-gas-refining",
  "DK": "oil-gas-refining", "HFC": "oil-gas-refining",

  // Energy - Oil & Gas Equipment
  "SLB": "oil-gas-equipment", "HAL": "oil-gas-equipment", "BKR": "oil-gas-equipment",
  "NOV": "oil-gas-equipment", "FTI": "oil-gas-equipment", "CHX": "oil-gas-equipment",

  // Utilities - Electric
  "NEE": "utilities-regulated", "SO": "utilities-regulated", "DUK": "utilities-regulated",
  "D": "utilities-regulated", "SRE": "utilities-regulated", "AEP": "utilities-regulated",
  "EXC": "utilities-regulated", "XEL": "utilities-regulated", "PEG": "utilities-regulated",
  "ED": "utilities-regulated", "WEC": "utilities-regulated", "ES": "utilities-regulated",
  "EIX": "utilities-regulated", "DTE": "utilities-regulated", "AEE": "utilities-regulated",
  "ETR": "utilities-regulated", "PPL": "utilities-regulated", "FE": "utilities-regulated",
  "CMS": "utilities-regulated", "CNP": "utilities-regulated", "NI": "utilities-regulated",
  "EVRG": "utilities-regulated", "PNW": "utilities-regulated", "LNT": "utilities-regulated",
  "CEG": "utilities-regulated",

  // Utilities - Diversified
  "NRG": "utilities-diversified", "AES": "utilities-diversified", "VST": "utilities-diversified",

  // Utilities - Gas
  "ATO": "utilities-gas", "NJR": "utilities-gas", "SWX": "utilities-gas", "OGS": "utilities-gas",

  // Utilities - Water
  "AWK": "utilities-water", "WTRG": "utilities-water", "CWT": "utilities-water",
  "AWR": "utilities-water",

  // Real Estate - REITs
  "PLD": "reit-industrial", "AMT": "reit-specialty", "EQIX": "reit-specialty",
  "CCI": "reit-specialty", "PSA": "reit-specialty", "O": "reit-retail",
  "WELL": "reit-healthcare", "DLR": "reit-specialty", "SPG": "reit-retail",
  "SBAC": "reit-specialty", "AVB": "reit-residential", "EQR": "reit-residential",
  "VICI": "reit-specialty", "WY": "reit-specialty", "VTR": "reit-healthcare",
  "ARE": "reit-office", "MAA": "reit-residential", "EXR": "reit-specialty",
  "IRM": "reit-specialty", "UDR": "reit-residential", "ESS": "reit-residential",
  "INVH": "reit-residential", "KIM": "reit-retail", "REG": "reit-retail",
  "CPT": "reit-residential", "HST": "reit-hotel", "BXP": "reit-office",
  "PEAK": "reit-healthcare", "DOC": "reit-healthcare",
  "FRT": "reit-retail",

  // Real Estate - Services
  "CBRE": "real-estate-services", "JLL": "real-estate-services", "CSGP": "real-estate-services",
  "RDFN": "real-estate-services",
  "OPEN": "real-estate-services", "COMP": "real-estate-services",

  // Basic Materials - Specialty Chemicals
  "LIN": "specialty-chemicals", "APD": "specialty-chemicals", "SHW": "specialty-chemicals",
  "ECL": "specialty-chemicals", "PPG": "specialty-chemicals", "IFF": "specialty-chemicals",
  "ALB": "specialty-chemicals", "DD": "specialty-chemicals", "EMN": "specialty-chemicals",
  "CE": "specialty-chemicals", "RPM": "specialty-chemicals", "AVY": "specialty-chemicals",
  "FUL": "specialty-chemicals", "AXTA": "specialty-chemicals",

  // Basic Materials - Gold
  "NEM": "gold", "GOLD": "gold", "AEM": "gold", "FNV": "gold", "WPM": "gold",
  "KGC": "gold", "AU": "gold", "BTG": "gold", "EGO": "gold", "HL": "gold",

  // Basic Materials - Copper
  "FCX": "copper", "SCCO": "copper", "TECK": "copper",

  // Basic Materials - Steel
  "NUE": "steel", "STLD": "steel", "CLF": "steel", "RS": "steel", "X": "steel",

  // Basic Materials - Agricultural Inputs
  "CTVA": "agricultural-inputs", "FMC": "agricultural-inputs", "CF": "agricultural-inputs",
  "MOS": "agricultural-inputs", "NTR": "agricultural-inputs", "SMG": "agricultural-inputs",

  // Basic Materials - Building Materials
  "VMC": "building-materials", "MLM": "building-materials", "EXP": "building-materials",
  "USLM": "building-materials",

  // Basic Materials - Chemicals
  "DOW": "chemicals", "LYB": "chemicals", "OLN": "chemicals", "CC": "chemicals",
  "HUN": "chemicals", "KWR": "chemicals",

  // Basic Materials - Paper
  "IP": "paper", "PKG": "paper", "WRK": "paper", "CLW": "paper", "SLVM": "paper",

  // Basic Materials - Packaging
  "BALL": "packaging-containers", "AMCR": "packaging-containers", "SEE": "packaging-containers",
  "BLL": "packaging-containers", "CCK": "packaging-containers", "GPK": "packaging-containers",
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the sector ID for a stock symbol
 */
export function getSectorIdForSymbol(symbol: string): string {
  const industryId = STOCK_INDUSTRY_MAP[symbol];
  if (!industryId) return "other";

  for (const sector of SECTORS_WITH_INDUSTRIES) {
    if (sector.industries.some(ind => ind.id === industryId)) {
      return sector.id;
    }
  }
  return "other";
}

/**
 * Get the industry ID for a stock symbol
 */
export function getIndustryIdForSymbol(symbol: string): string {
  return STOCK_INDUSTRY_MAP[symbol] || "other";
}

/**
 * Get industry name for an industry ID
 */
export function getIndustryName(industryId: string): string {
  for (const sector of SECTORS_WITH_INDUSTRIES) {
    const industry = sector.industries.find(ind => ind.id === industryId);
    if (industry) return industry.name;
  }
  return industryId.toUpperCase();
}

/**
 * Get sector name for a sector ID
 */
export function getSectorName(sectorId: string): string {
  const sector = SECTORS_WITH_INDUSTRIES.find(s => s.id === sectorId);
  return sector?.name || "OTHER";
}

// =============================================================================
// DYNAMIC INDEX FETCHING
// =============================================================================

// Memory cache for dynamically fetched index symbols
const indexCache = new Map<string, { symbols: string[]; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// API URLs for dynamic index constituents (auto-updated monthly)
// Source: https://github.com/yfiua/index-constituents
const INDEX_API_URLS: Record<string, string> = {
  dji: "https://yfiua.github.io/index-constituents/constituents-dowjones.json",
  sp500: "https://yfiua.github.io/index-constituents/constituents-sp500.json",
  ndx: "https://yfiua.github.io/index-constituents/constituents-nasdaq100.json",
};

// Alpha Vantage ETF symbols for index constituents (backup/primary for Russell 2000)
const ALPHA_VANTAGE_ETF_MAP: Record<string, string> = {
  rut: "IWM",   // Russell 2000
  sp500: "SPY", // S&P 500 (backup)
  ndx: "QQQ",   // NASDAQ 100 (backup)
  dji: "DIA",   // Dow Jones 30 (backup)
};

/**
 * Fetch ETF holdings from Alpha Vantage API
 */
async function fetchAlphaVantageETFHoldings(etfSymbol: string): Promise<string[]> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) return [];

  try {
    const url = `https://www.alphavantage.co/query?function=ETF_PROFILE&symbol=${etfSymbol}&apikey=${apiKey}`;
    const response = await fetch(url, { next: { revalidate: 86400 } }); // 24h cache
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (data.holdings && Array.isArray(data.holdings)) {
      // Filter out non-stock holdings (futures, cash, etc.)
      return data.holdings
        .filter((h: { symbol?: string }) => h.symbol && !h.symbol.includes(' ') && h.symbol.length <= 5)
        .map((h: { symbol: string }) => h.symbol);
    }
    return [];
  } catch (error) {
    console.error(`Failed to fetch ETF holdings for ${etfSymbol}:`, error);
    return [];
  }
}

/**
 * Fetch index symbols dynamically from external APIs
 * Priority: yfiua API -> Alpha Vantage ETF -> static fallback
 */
export async function fetchIndexSymbols(index: HeatmapIndex): Promise<string[]> {
  // Check cache first
  const cached = indexCache.get(index);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.symbols;
  }

  let symbols: string[] = [];

  // Try yfiua API first (for sp500, ndx, dji)
  const yfiuaUrl = INDEX_API_URLS[index];
  if (yfiuaUrl) {
    try {
      const response = await fetch(yfiuaUrl, { next: { revalidate: 86400 } }); // 24h cache
      if (response.ok) {
        const data = await response.json();
        symbols = data.map((item: { Symbol: string }) => item.Symbol);
      }
    } catch (error) {
      console.error(`yfiua API failed for ${index}:`, error);
    }
  }

  // Try Alpha Vantage ETF holdings (primary for rut, backup for others)
  if (symbols.length === 0) {
    const etfSymbol = ALPHA_VANTAGE_ETF_MAP[index];
    if (etfSymbol) {
      symbols = await fetchAlphaVantageETFHoldings(etfSymbol);
    }
  }

  // Cache if successful
  if (symbols.length > 0) {
    indexCache.set(index, { symbols, timestamp: Date.now() });
    return symbols;
  }

  // Fallback to hardcoded lists
  return getSymbolsForIndex(index);
}

// =============================================================================
// NASDAQ PRICE FETCHING (Fast bulk price data)
// =============================================================================

export interface NasdaqStock {
  symbol: string;
  name: string;
  lastsale: string;  // "$175.02"
  netchange: string; // "-5.91"
  pctchange: string; // "-3.266%"
  marketCap: string; // "4,252,986,000,000"
}

// Cache all stock prices from Nasdaq
let nasdaqPriceCache: Map<string, NasdaqStock> | null = null;
let nasdaqCacheTimestamp = 0;
const NASDAQ_PRICE_CACHE_TTL = 60 * 1000; // 1 minute

/**
 * Fetch all stock prices from Nasdaq Screener API (very fast - 5000 stocks in ~1 second)
 */
export async function fetchAllNasdaqPrices(): Promise<Map<string, NasdaqStock>> {
  // Return cache if fresh
  if (nasdaqPriceCache && Date.now() - nasdaqCacheTimestamp < NASDAQ_PRICE_CACHE_TTL) {
    return nasdaqPriceCache;
  }

  try {
    const response = await fetch(
      "https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=5000&offset=0",
      {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; FiscalWire/1.0)" },
        next: { revalidate: 60 }
      }
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const stocks = data.data?.table?.rows as NasdaqStock[] || [];

    // Build lookup map
    const priceMap = new Map<string, NasdaqStock>();
    for (const stock of stocks) {
      if (stock.symbol) {
        priceMap.set(stock.symbol, stock);
      }
    }

    nasdaqPriceCache = priceMap;
    nasdaqCacheTimestamp = Date.now();
    console.log(`Nasdaq price cache updated: ${priceMap.size} stocks`);
    return priceMap;
  } catch (error) {
    console.error("Failed to fetch Nasdaq prices:", error);
    // Return empty map or cached data if available
    return nasdaqPriceCache || new Map();
  }
}

// =============================================================================
// NASDAQ SECTOR MAPPING (Dynamic sector data for all US stocks)
// =============================================================================

const NASDAQ_SECTORS = [
  'technology', 'health_care', 'finance', 'real_estate',
  'consumer_discretionary', 'consumer_staples', 'industrials',
  'basic_materials', 'energy', 'utilities', 'telecommunications', 'miscellaneous'
] as const;

// Map Nasdaq sector names to our sector IDs
const NASDAQ_TO_SECTOR_ID: Record<string, string> = {
  'technology': 'technology',
  'health_care': 'healthcare',
  'finance': 'financial',
  'real_estate': 'real-estate',
  'consumer_discretionary': 'consumer-cyclical',
  'consumer_staples': 'consumer-defensive',
  'industrials': 'industrials',
  'basic_materials': 'basic-materials',
  'energy': 'energy',
  'utilities': 'utilities',
  'telecommunications': 'communication-services',
  'miscellaneous': 'other',
};

// Cache sector mapping
let sectorMapCache: Map<string, string> | null = null;
let sectorMapCacheTimestamp = 0;
const SECTOR_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetch sector mapping for all US stocks from Nasdaq API
 * Returns a Map of symbol -> sectorId
 */
export async function fetchSectorMapping(): Promise<Map<string, string>> {
  // Return cache if fresh
  if (sectorMapCache && Date.now() - sectorMapCacheTimestamp < SECTOR_CACHE_TTL) {
    return sectorMapCache;
  }

  const sectorMap = new Map<string, string>();

  // Fetch all sectors in parallel for speed
  const promises = NASDAQ_SECTORS.map(async (nasdaqSector) => {
    try {
      const response = await fetch(
        `https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=2000&offset=0&sector=${nasdaqSector}`,
        {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; FiscalWire/1.0)" },
          next: { revalidate: 86400 } // 24 hour cache
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const stocks = data.data?.table?.rows || [];
      const sectorId = NASDAQ_TO_SECTOR_ID[nasdaqSector] || 'other';

      return { stocks, sectorId };
    } catch (error) {
      console.error(`Failed to fetch sector ${nasdaqSector}:`, error);
      return { stocks: [], sectorId: 'other' };
    }
  });

  const results = await Promise.all(promises);

  // Build the mapping
  for (const { stocks, sectorId } of results) {
    for (const stock of stocks) {
      if (stock.symbol) {
        sectorMap.set(stock.symbol, sectorId);
      }
    }
  }

  sectorMapCache = sectorMap;
  sectorMapCacheTimestamp = Date.now();
  console.log(`Sector map cache updated: ${sectorMap.size} stocks`);
  return sectorMap;
}

// =============================================================================
// ETF PRICE FETCHING (Nasdaq Quote API)
// =============================================================================

export interface NasdaqETFQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
  industry: string;
}

let etfPriceCache: Map<string, NasdaqETFQuote> | null = null;
let etfCacheTimestamp = 0;
const ETF_CACHE_TTL = 5 * 60 * 1000; // 5 minutes - ETFs don't change as fast

export async function fetchETFPrices(): Promise<Map<string, NasdaqETFQuote>> {
  if (etfPriceCache && Date.now() - etfCacheTimestamp < ETF_CACHE_TTL) {
    return etfPriceCache;
  }

  const etfMap = new Map<string, NasdaqETFQuote>();

  // Fetch all ETF quotes in parallel from Nasdaq
  const promises = TOP_ETFS.map(async (symbol) => {
    try {
      const res = await fetch(
        `https://api.nasdaq.com/api/quote/${symbol}/info?assetclass=etf`,
        { headers: { "User-Agent": "Mozilla/5.0 (compatible; FiscalWire/1.0)" } }
      );
      const data = await res.json();
      if (data.data?.primaryData) {
        const pd = data.data.primaryData;
        const category = ETF_CATEGORIES[symbol] || { sector: "Other", industry: "Other" };
        return {
          symbol,
          name: data.data.companyName || symbol,
          price: parseFloat((pd.lastSalePrice || "$0").replace(/[$,]/g, '')) || 0,
          change: parseFloat(pd.netChange || "0") || 0,
          changePercent: parseFloat((pd.percentageChange || "0%").replace(/[%()]/g, '')) || 0,
          sector: category.sector,
          industry: category.industry,
        };
      }
    } catch (e) { /* skip */ }
    return null;
  });

  const results = await Promise.all(promises);
  for (const r of results) {
    if (r) etfMap.set(r.symbol, r);
  }

  etfPriceCache = etfMap;
  etfCacheTimestamp = Date.now();
  console.log(`ETF price cache updated: ${etfMap.size} ETFs`);
  return etfMap;
}

// =============================================================================
// CRYPTO PRICE FETCHING (DIA API - diadata.org)
// =============================================================================

export interface CryptoQuote {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

let cryptoPriceCache: Map<string, CryptoQuote> | null = null;
let cryptoCacheTimestamp = 0;
const CRYPTO_CACHE_TTL = 5 * 60 * 1000; // 5 minutes - faster subsequent loads

export async function fetchCryptoPrices(): Promise<Map<string, CryptoQuote>> {
  if (cryptoPriceCache && Date.now() - cryptoCacheTimestamp < CRYPTO_CACHE_TTL) {
    return cryptoPriceCache;
  }

  const cryptoMap = new Map<string, CryptoQuote>();

  // Fetch all crypto quotes in parallel from DIA API
  const promises = CRYPTO_ASSETS.map(async (ourSymbol) => {
    // Convert our symbol format (BTC-USD) to DIA format (BTC)
    const diaSymbol = ourSymbol.replace('-USD', '');
    try {
      const response = await fetch(`https://api.diadata.org/v1/quotation/${diaSymbol}`);
      const data = await response.json();
      if (data.Price) {
        const changePercent = data.PriceYesterday
          ? ((data.Price - data.PriceYesterday) / data.PriceYesterday * 100)
          : 0;
        return {
          symbol: ourSymbol,
          name: data.Name || diaSymbol,
          price: data.Price,
          changePercent,
        };
      }
    } catch (e) {
      // Silently skip failed cryptos
    }
    return null;
  });

  const results = await Promise.all(promises);
  for (const r of results) {
    if (r) cryptoMap.set(r.symbol, r);
  }

  cryptoPriceCache = cryptoMap;
  cryptoCacheTimestamp = Date.now();
  console.log(`Crypto price cache updated: ${cryptoMap.size} cryptos`);
  return cryptoMap;
}

// =============================================================================
// PERIOD-BASED PRICE CHANGE (Yahoo Finance Spark API)
// =============================================================================

// Cache for period-specific changes
const periodChangeCache = new Map<string, { data: Map<string, number>; timestamp: number }>();
const PERIOD_CACHE_TTL = {
  d1: 60 * 1000,      // 1 minute for daily
  w1: 5 * 60 * 1000,  // 5 minutes for weekly
  m1: 5 * 60 * 1000,  // 5 minutes for monthly
};

// Convert Nasdaq symbol to Yahoo format (e.g., BF-B -> BF.B)
function toYahooSymbol(symbol: string): string {
  return symbol.replace('-', '.');
}

// Convert Yahoo symbol back to Nasdaq format (e.g., BF.B -> BF-B)
function fromYahooSymbol(symbol: string): string {
  return symbol.replace('.', '-');
}

/**
 * Fetch period-specific price change data from Yahoo Finance Spark API
 * Returns percentage change for each symbol over the specified period
 */
export async function fetchPeriodChangeData(
  symbols: string[],
  period: 'd1' | 'w1' | 'm1'
): Promise<Map<string, number>> {
  // For 1D, return empty map - we'll use existing Nasdaq data
  if (period === 'd1') {
    return new Map();
  }

  // Check cache
  const cacheKey = `${period}-${symbols.length}`;
  const cached = periodChangeCache.get(cacheKey);
  const cacheTTL = PERIOD_CACHE_TTL[period];
  if (cached && Date.now() - cached.timestamp < cacheTTL) {
    return cached.data;
  }

  const range = period === 'w1' ? '5d' : '1mo';
  const changeMap = new Map<string, number>();

  // Convert symbols to Yahoo format
  const yahooSymbols = symbols.map(toYahooSymbol);

  // Batch into chunks of 20 (smaller to avoid 414 URI too long errors)
  const chunks: string[][] = [];
  for (let i = 0; i < yahooSymbols.length; i += 20) {
    chunks.push(yahooSymbols.slice(i, i + 20));
  }

  // Fetch chunks with limited concurrency (5 at a time to avoid rate limits)
  const startTime = Date.now();
  const CONCURRENCY = 5;

  for (let i = 0; i < chunks.length; i += CONCURRENCY) {
    const batch = chunks.slice(i, i + CONCURRENCY);

    await Promise.all(batch.map(async (chunk) => {
      try {
        const symbolsParam = chunk.join(',');
        const url = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${encodeURIComponent(symbolsParam)}&range=${range}&interval=1d`;
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        });

        if (!res.ok) {
          // Try without encoding if encoded version fails
          const url2 = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${symbolsParam}&range=${range}&interval=1d`;
          const res2 = await fetch(url2, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
          });
          if (!res2.ok) {
            console.error(`Yahoo Spark API error: ${res2.status} for ${chunk.length} symbols`);
            return;
          }
          const data2 = await res2.json();
          processYahooResults(data2, changeMap);
          return;
        }

        const data = await res.json();
        processYahooResults(data, changeMap);
      } catch (error) {
        console.error('Error fetching Yahoo Spark data:', error);
      }
    }));
  }

  const elapsed = Date.now() - startTime;
  console.log(`Yahoo Spark ${period}: ${changeMap.size} stocks loaded in ${elapsed}ms`);

  // Cache the results
  periodChangeCache.set(cacheKey, { data: changeMap, timestamp: Date.now() });

  return changeMap;
}

// Helper to process Yahoo Finance results
function processYahooResults(data: { spark?: { result?: Array<{ symbol: string; response?: Array<{ indicators?: { quote?: Array<{ close?: (number | null)[] }> } }> }> } }, changeMap: Map<string, number>) {
  for (const result of data.spark?.result || []) {
    const closes = result.response?.[0]?.indicators?.quote?.[0]?.close;
    if (closes && closes.length >= 2) {
      // Filter out null values
      const validCloses = closes.filter((c): c is number => c !== null);
      if (validCloses.length >= 2) {
        const first = validCloses[0];
        const last = validCloses[validCloses.length - 1];
        const pctChange = ((last - first) / first) * 100;
        // Convert back to Nasdaq symbol format
        const nasdaqSymbol = fromYahooSymbol(result.symbol);
        changeMap.set(nasdaqSymbol, pctChange);
      }
    }
  }
}

/**
 * Get stock symbols for an index (static fallback)
 */
export function getSymbolsForIndex(index: HeatmapIndex): string[] {
  switch (index) {
    case "sp500":
      return SP500_FULL;
    case "dji":
      return DOW_JONES_30;
    case "ndx":
      return NASDAQ_100;
    case "rut":
      return RUSSELL_2000_TOP;
    case "etf":
      return TOP_ETFS;
    case "crypto":
      return CRYPTO_ASSETS;
    default:
      return SP500_FULL;
  }
}

/**
 * Group stocks by sector and industry
 */
export interface GroupedStock {
  symbol: string;
  sectorId: string;
  industryId: string;
}

export function groupStocksBySectorAndIndustry(symbols: string[]): Map<string, Map<string, string[]>> {
  const result = new Map<string, Map<string, string[]>>();

  for (const symbol of symbols) {
    const sectorId = getSectorIdForSymbol(symbol);
    const industryId = getIndustryIdForSymbol(symbol);

    if (!result.has(sectorId)) {
      result.set(sectorId, new Map());
    }

    const sectorMap = result.get(sectorId)!;
    if (!sectorMap.has(industryId)) {
      sectorMap.set(industryId, []);
    }

    sectorMap.get(industryId)!.push(symbol);
  }

  return result;
}
