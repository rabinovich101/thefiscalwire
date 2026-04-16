# Trending News Report - March 27, 2026 (Batch 6 - Late Evening)

## Articles Created (5 Total)

### 1. BREAKING: Trump Extends Iran Deadline to April 6 After Tehran Sends 10 Oil Tankers
- **Category**: Global Markets / Economy
- **Tickers**: XOM, CVX, LMT, RTX, NOC, USO
- **Source**: NPR, CNBC, CNN, CBS News, Al Jazeera
- Trump delayed power grid strikes by 10 days; Iran sent 10 tankers as "goodwill"
- Iran's 5-point counteroffer demands sovereignty over Strait of Hormuz

### 2. BREAKING: OECD Warns US Inflation Will Surge to 4.2% in 2026
- **Category**: US Markets / Economy
- **Tickers**: SPY, TLT, GLD, XLE, TIP
- **Source**: CNBC, Bloomberg, Irish Times, CFO Dive
- OECD revised US inflation from 2.8% to 4.2% due to Iran war energy shock
- Fed rate cuts completely priced out through July; OECD sees flat rates through 2027

### 3. BREAKING: OpenAI Kills Sora Video App ($15M/day burn rate)
- **Category**: US Markets / Tech
- **Tickers**: MSFT, NVDA, GOOG, META, AMZN
- **Source**: TechCrunch, Slate, Axios, Geeky Gadgets, eWeek
- Sora burned $15M/day in compute; only made $2.1M total revenue
- Disney deal unwound after 3 months; pivoting ahead of H2 2026 IPO

### 4. Meta and YouTube Found Liable in Social Media Addiction Trial
- **Category**: US Markets / Tech
- **Tickers**: META, GOOGL, SNAP, PINS, RDDT
- **Source**: NPR, Washington Post, CNN, CNBC, Al Jazeera
- Jury ordered $6M in damages; Meta 70% liable, YouTube 30%
- Could influence 2,000+ pending lawsuits

### 5. BREAKING: Russia Launches 400-Drone Assault as NATO Scrambles Jets
- **Category**: Global Markets / Economy
- **Tickers**: LMT, NOC, RTX, GD, BA
- **Source**: Fox News, Washington Post, PBS, Military.com
- Nearly 400 drones + 30 missiles; Poland/Romania scrambled fighter jets
- Spring offensive begins with ground operations intensifying

## Files Created
- `scripts/create_trending_march27_batch6.js` - Node.js article creation script
- `scripts/deploy_march27_batch6.sh` - SSH deployment script (expect-based)
- `src/app/api/import-trending-batch6/route.ts` - API endpoint for deployment

## Deployment Instructions

### Option A: Run deploy script from Mac Terminal
```bash
cd ~/Documents/ooo/newswebbyclaude
bash scripts/deploy_march27_batch6.sh
```

### Option B: Deploy via API (after code push)
```bash
# Push code to GitHub first, then after deployment:
curl -H "Authorization: Bearer bzlf6dapsxifmhw9asfeqhrihfr8om9r" \
  https://thefiscalwire.com/api/import-trending-batch6
```

### Option C: Direct SSH
```bash
ssh fiscalwire
# passphrase: Xx123456$
CONTAINER=$(docker ps --filter 'name=fiscal' --format '{{.Names}}' | head -1)
docker cp /tmp/create_trending_march27_batch6.js $CONTAINER:/app/scripts/
docker exec $CONTAINER node scripts/create_trending_march27_batch6.js
docker exec $CONTAINER node scripts/add_to_zones.js
```

## Status
- Articles researched and written
- All deployment files created
- **PENDING**: Deployment to production (requires SSH access from user's machine)
