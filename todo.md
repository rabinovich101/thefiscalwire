# Docker Build Timeout Recovery Plan

## Goal
Fix the production Docker build failure where `npm ci` exits with `ETIMEDOUT` during image build on the Fiscal Wire deployment runner, then verify the deployment as a regular user.

## Current Findings
- The failure happens in `Dockerfile` at `RUN npm ci`, before source code is copied and before `npm run build`.
- This is a network/read timeout from npm registry access inside the Docker builder, not an application compile error.
- The current `Dockerfile` does not configure npm retry/fetch timeouts or use a BuildKit npm cache mount.
- The local workspace does not currently have a `.dockerignore`, so build context hygiene can also be improved separately and simply.
- `docker-compose.yml` builds the app image directly from the repo root.

## Checklist
- [x] 1. Read relevant deployment/build files and identify the failure point.
- [x] 2. Wait for user approval of this plan before making Docker/deployment changes.
- [x] 3. Update the Dockerfile with conservative npm retry/fetch timeout settings and a persistent BuildKit npm cache mount for `npm ci`.
- [x] 4. Add a minimal `.dockerignore` to keep unnecessary folders out of the Docker build context.
- [x] 5. Update `ARCHITECTURE.md` with the Docker build reliability detail.
- [x] 6. Run focused validation locally (`docker build` or syntax-safe equivalent, depending on available time/network).
- [x] 7. Commit and push the fix to `main`.
- [x] 8. SSH to `fiscalwire`, pull latest code in `/home/ooo/thefiscalwire`, and run the production Docker rebuild/deploy command.
- [x] 9. Verify production as a regular user with Playwright using `browser_navigate`, `browser_snapshot`, and `browser_take_screenshot`.
- [x] 10. Update this review section with the final result.

## Review
Completed on April 25, 2026.

Summary:
- Added npm retry and fetch-timeout settings to the Docker `npm ci` step.
- Added a BuildKit npm cache mount at `/root/.npm` so repeated production builds can reuse npm tarballs.
- Added `.dockerignore` to keep local caches, Git metadata, env files, browser artifacts, and generated media out of the build context.
- Updated `ARCHITECTURE.md` with the Docker build reliability details.

Validation:
- Local `DOCKER_BUILDKIT=1 docker build -t fiscalwire-build-check .` passed through `npm ci`, Prisma generation, and `next build`.
- Production SSH deploy from `/home/ooo/thefiscalwire` passed: `git fetch`, `git reset --hard origin/main`, `DOCKER_BUILDKIT=1 docker compose build`, and `docker compose up -d`.
- The original failure point (`RUN npm ci` timing out) is resolved in production.
- Playwright production verification completed with `browser_navigate`, `browser_snapshot`, and `browser_take_screenshot`.

Notes:
- During production verification, one older homepage article image URL returned 404. It was unrelated to this Docker build fix but visible to users, so it was updated directly in production from a broken Unsplash URL to a working oil-market image URL.
- Remaining browser console issues after verification are third-party analytics DNS failures and a React minified hydration warning. The homepage renders successfully.
