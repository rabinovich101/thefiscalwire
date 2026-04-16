# Deploy 5 Trending Articles - March 26, 2026

## Articles Ready to Deploy

5 trending finance articles have been written and committed to the repo:

1. **S&P 500 Drops to Four-Month Low as Oil Prices Surge on US-Iran Standoff** (BREAKING)
2. **Wall Street Recession Fears Mount as Economic Cracks Appear Beneath the Surface**
3. **Arm Holdings Soars 16% After Launching Next-Generation AI Data Center Chip**
4. **Coca-Cola CEO James Quincey Steps Down Citing AI-Driven Business Transformation**
5. **Record Cash Pile: Money Market Fund Assets Hit $7.86 Trillion as Investors Flee Risk**

## Files Created

- `src/app/api/import-trending/route.ts` - API endpoint that creates all 5 articles (secured with CRON_SECRET)
- `scripts/create_trending_march26.js` - Standalone JS script for docker exec
- `scripts/deploy_trending.sh` - Deploy script for production server

## How to Deploy

### Option A: Push to GitHub + Call API
```bash
git push origin main
# Wait for auto-deploy (~3-5 min)
curl -H "Authorization: Bearer bzlf6dapsxifmhw9asfeqhrihfr8om9r" https://thefiscalwire.com/api/import-trending
```

### Option B: SSH + Docker Exec
```bash
# Copy scripts to server
scp scripts/create_trending_march26.js scripts/add_to_zones.js scripts/deploy_trending.sh fiscalwire:/tmp/

# SSH to server
ssh fiscalwire
# passphrase: Xx123456$
# password: Xx123456

# Run deploy script
bash /tmp/deploy_trending.sh
```

### Option C: Claude Code
Open Claude Code in this project and run:
```
/article 5
```
Or tell Claude Code:
"Push code to GitHub, SSH to fiscalwire (passphrase Xx123456$, password Xx123456), and run: bash /tmp/deploy_trending.sh"
