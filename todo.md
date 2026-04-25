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
- [ ] 7. Commit and push the fix to `main`.
- [ ] 8. SSH to `fiscalwire`, pull latest code in `/home/ooo/thefiscalwire`, and run the production Docker rebuild/deploy command.
- [ ] 9. Verify production as a regular user with Playwright using `browser_navigate`, `browser_snapshot`, and `browser_take_screenshot`.
- [ ] 10. Update this review section with the final result.

## Review
Pending.
