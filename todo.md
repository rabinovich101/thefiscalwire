# Fix: Market Ticker Showing Incorrect Static Prices

## Goal
Fix the market ticker on the home page to show real Yahoo Finance prices instead of hardcoded static fallback data.

## Root Cause
10 separate `new YahooFinance()` instances across route files each created their own cookie jar. In Next.js standalone Docker build, Yahoo Finance rate-limited the server immediately, causing all API calls to fail and return static fallback prices.

## Checklist
- [x] 1. Convert YahooFinance to globalThis singleton in `src/lib/yahoo-finance.ts`
- [x] 2. Replace duplicate instance in `quote/route.ts`
- [x] 3. Replace duplicate instance in `analysis/route.ts`
- [x] 4. Replace duplicate instance in `chart/route.ts`
- [x] 5. Replace duplicate instance in `historical/route.ts`
- [x] 6. Replace duplicate instance in `profile/route.ts`
- [x] 7. Replace duplicate instance in `holders/route.ts`
- [x] 8. Replace duplicate instance in `news/route.ts`
- [x] 9. Replace duplicate instance in `options/route.ts`
- [x] 10. Replace duplicate instance in `valuation-history/route.ts`
- [x] 11. Add structured error logging to `/api/market/quotes`
- [x] 12. Verify build succeeds
- [ ] 13. Deploy to production and verify real prices appear

## Review
Consolidated 10 YahooFinance instances into 1 globalThis singleton (same pattern as Prisma). Build succeeds. Needs deployment to production to verify real prices appear on the ticker.
