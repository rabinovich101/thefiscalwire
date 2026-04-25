# April 25, 2026 Viral Articles Deployment Plan

## Goal
Create and publish 15 fresh articles covering the most viral current stories in economics, finance, geopolitics, and crypto, using strong creative article images. Keep the homepage article count unchanged by moving old articles down or removing old placements only where zone limits require it. Push the work to the development/production flow and deploy to the Fiscal Wire production host over SSH.

## Current Architecture Notes
- The app is a Next.js 16 App Router site backed by PostgreSQL through Prisma.
- Articles live in the `Article` table and require both a markets category and a business category.
- The homepage prefers Page Builder content from `PageDefinition`, `PageZone`, and `ContentPlacement`.
- Homepage article display is split across three article zones: hero, article grid, and trending sidebar.
- Existing 15-article batches use a Prisma script pattern: create/find articles by slug, then place 5 articles in each homepage zone.
- Existing scripts have separate local and production category/author/zone IDs, so the new batch should preserve that pattern and avoid unrelated app changes.

## Checklist
- [x] 1. Wait for user approval of this plan before making article/deployment changes.
- [x] 2. Research current viral stories from reliable, recent sources across economics, finance, geopolitics, and crypto.
- [x] 3. Select 15 article topics with no duplicate angles and a balanced category mix.
- [x] 4. Choose creative, high-quality image URLs for every article.
- [x] 5. Create a local Prisma article script for the April 25 batch.
- [x] 6. Make the Prisma article script production-safe by resolving IDs from the active database instead of hardcoding local or production IDs.
- [x] 7. Ensure homepage zone placement keeps the same number of visible homepage articles by replacing only the top/homepage placements needed for the new 15.
- [x] 8. Add or update the deployment helper script for copying/running the production article script over SSH on `fiscalwire`.
- [x] 9. Update `ARCHITECTURE.md` with the article batch/deployment details discovered during this work.
- [x] 10. Run local validation checks (`npm run lint` or focused syntax/build checks as appropriate).
- [x] 11. Run the local article creation script against the dev database.
- [x] 12. Start the local app and test as a regular user with Playwright using `browser_navigate`, `browser_snapshot`, and `browser_take_screenshot`.
- [x] 13. Commit/push the approved code changes to the repo's deployment branch.
- [x] 14. Deploy to production through `$DEPLOY_HOST`/`fiscalwire` over SSH, using `$SSH_PASSPHRASE` and `$SSH_PASSWORD` only through non-logged automation.
- [x] 15. Verify production as a regular user with Playwright using `browser_navigate`, `browser_snapshot`, and `browser_take_screenshot`.
- [x] 16. Mark completed checklist items and write the final review summary below.

## Review
Completed on April 25, 2026.

Summary:
- Created `scripts/create_articles_apr25_2026.js` with exactly 15 current viral articles across economics, finance, geopolitics, and crypto.
- The importer resolves category IDs, author IDs, and homepage zones dynamically from the active database so the same file works locally and inside production.
- The importer updates existing April 25 articles on rerun, creates missing ones, places five stories in each homepage article zone, and trims back to the zone's pre-import count.
- Added `scripts/deploy_apr25_2026.sh` for SSH deployment to the running Fiscal Wire container.
- Updated `ARCHITECTURE.md` with the editorial batch import and homepage placement behavior.

Validation:
- `node --check scripts/create_articles_apr25_2026.js` passed.
- `bash -n scripts/deploy_apr25_2026.sh` passed.
- All 15 article image URLs returned HTTP 200.
- Local importer created/updated 15 dev articles and preserved local homepage zone counts.
- Production SSH import created 15 production articles and preserved production homepage zone counts.
- Playwright verified local homepage/article and production homepage/article with `browser_navigate`, `browser_snapshot`, and `browser_take_screenshot`.
- `npm run lint` still fails because of pre-existing repository lint issues, mostly old CommonJS scripts and unrelated React lint rules. The new article script has an explicit lint exemption for its CommonJS runtime style.

Notes:
- Production Playwright verification shows the new IMF lead story live on the homepage and article page.
- Browser console errors during verification were limited to third-party analytics resources (`googletagmanager.com` locally/production and Cloudflare Insights production) failing DNS resolution in the test environment.
