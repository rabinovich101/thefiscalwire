# PostgreSQL + Docker + Prisma Setup Plan

## Overview
Set up a self-hosted PostgreSQL database using Docker with Prisma ORM for the news website.

---

## Checklist

### Phase 1: Docker Setup
- [x] Create `docker-compose.yml` for PostgreSQL
- [x] Create `.env` file with database credentials
- [x] Add `.env` to `.gitignore` (verify) - already included
- [x] Test Docker container starts correctly

### Phase 2: Prisma Setup
- [x] Install Prisma dependencies (`prisma`, `@prisma/client`)
- [x] Initialize Prisma (`npx prisma init`)
- [x] Configure `prisma/schema.prisma` with PostgreSQL

### Phase 3: Database Schema
- [x] Design and create Article model
- [x] Design and create Category model
- [x] Design and create Author model
- [x] Design and create Tag model
- [x] Add relationships between models
- [x] Run initial migration

### Phase 4: Prisma Client Setup
- [x] Create `src/lib/prisma.ts` (singleton client)
- [x] Add Prisma generate to build scripts

### Phase 5: Seed Data
- [x] Create seed script to populate initial data
- [x] Migrate mock data to database with full article content

---

## Files Created/Modified

| File | Action | Status |
|------|--------|--------|
| `docker-compose.yml` | Created | Done |
| `.env` | Created | Done |
| `prisma/schema.prisma` | Created | Done |
| `prisma/seed.ts` | Created | Done |
| `src/lib/prisma.ts` | Created | Done |
| `package.json` | Modified (scripts) | Done |

---

## Review

### Summary
Successfully set up PostgreSQL with Docker and Prisma ORM. The database contains:
- **10 authors** with bios and avatars
- **5 categories** (markets, tech, crypto, economy, opinion)
- **32 tags** for article categorization
- **10 full articles** with rich content including:
  - Multiple paragraphs
  - Headings with table of contents
  - Quotes with attribution
  - Callout boxes
  - Stock charts with data
  - Bullet lists
  - Related article connections
- **8 market indices** (S&P 500, NASDAQ, DOW, Bitcoin, etc.)
- **4 videos**
- **1 breaking news item**

### Database Commands
```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio (GUI)
npm run db:studio

# Generate Prisma client
npm run db:generate
```

### Schema Models
- `Author` - Writer profiles with articles relation
- `Category` - Article categories with color coding
- `Tag` - Many-to-many article tags
- `Article` - Full articles with JSON content blocks
- `MarketIndex` - Live market data
- `Video` - Video content
- `BreakingNews` - Breaking news banner

### Phase 6: Data Layer & Component Updates (Completed)
- [x] Create `src/lib/data.ts` with all data fetching functions
- [x] Update `src/app/page.tsx` to fetch from database
- [x] Update `src/app/article/[slug]/page.tsx` to fetch from database
- [x] Update all components to accept props instead of importing mock data:
  - [x] HeroSection
  - [x] ArticleGrid
  - [x] TrendingSidebar
  - [x] MarketMovers
  - [x] VideoCarousel
  - [x] BreakingNewsBanner
  - [x] MarketTicker
  - [x] ArticleCard
  - [x] ArticleHero
  - [x] ArticleBody
  - [x] ArticleSidebar
  - [x] RelatedArticles
  - [x] ArticleTOC

---

## Current Status: ✅ Complete

All database integration tasks are finished. The application now:
- Fetches all data from PostgreSQL via Prisma
- Home page and article pages fully functional
- Prisma Studio available for data management

### Running Services
- **Dev Server**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555
- **PostgreSQL**: Docker container `newswebbyclaude-db`

### Next Steps (Optional)
1. Add admin panel for content management
2. Deploy database to production (Railway, Supabase, or VPS)

---

# Sign Up & Login Implementation Plan

## Overview
Implement user authentication (sign up and login) for the finance news website using NextAuth.js with credentials provider and Prisma adapter.

## Tech Stack for Auth
- **NextAuth.js v5** - Authentication library for Next.js
- **bcryptjs** - Password hashing
- **Prisma Adapter** - Connect NextAuth to our PostgreSQL database

---

## To-Do Checklist

### 1. Database Setup
- [x] Add User model to Prisma schema (id, email, password, name, createdAt, updatedAt)
- [x] Add Account, Session, VerificationToken models for NextAuth
- [x] Run Prisma migration

### 2. Install Dependencies
- [x] Install next-auth, @auth/prisma-adapter, bcryptjs, @types/bcryptjs

### 3. NextAuth Configuration
- [x] Create auth configuration file (src/lib/auth.ts)
- [x] Create API route for NextAuth (src/app/api/auth/[...nextauth]/route.ts)
- [x] Add AUTH_SECRET to environment variables

### 4. UI Components
- [x] Create Login page (src/app/login/page.tsx)
- [x] Create Sign Up page (src/app/signup/page.tsx)
- [x] Create Input component for forms (src/components/ui/input.tsx)
- [x] Create Label component for forms (src/components/ui/label.tsx)

### 5. API Routes
- [x] Create signup API route (src/app/api/auth/signup/route.ts)

### 6. Header Integration
- [x] Update Header component to show login/signup buttons or user info

### 7. Session Provider
- [x] Create AuthProvider wrapper component
- [x] Add AuthProvider to root layout

---

## Current Status: ✅ Complete

## Review Section

### Summary
Successfully implemented user authentication with sign up and login functionality using NextAuth.js v5.

### Features Implemented
- **Sign Up**: Users can create accounts with name, email, and password
- **Login**: Users can sign in with email/password credentials
- **Session Management**: JWT-based session handling
- **Header Integration**: Shows user name and sign out button when logged in, or sign in/sign up buttons when logged out
- **Mobile Support**: Auth buttons also work in mobile menu

### Files Created

| File | Description |
|------|-------------|
| `src/lib/auth.ts` | NextAuth configuration with credentials provider |
| `src/app/api/auth/[...nextauth]/route.ts` | NextAuth API route handler |
| `src/app/api/auth/signup/route.ts` | User registration endpoint |
| `src/app/login/page.tsx` | Login page with form |
| `src/app/signup/page.tsx` | Sign up page with form |
| `src/components/ui/input.tsx` | Input form component |
| `src/components/ui/label.tsx` | Label form component |
| `src/components/providers/AuthProvider.tsx` | SessionProvider wrapper |

### Files Modified

| File | Changes |
|------|---------|
| `prisma/schema.prisma` | Added User, Account, Session, VerificationToken models |
| `src/app/layout.tsx` | Wrapped app with AuthProvider |
| `src/components/layout/Header.tsx` | Added auth buttons and user display |
| `.env` | Added AUTH_SECRET and NEXTAUTH_URL |

### Database Models Added
- `User` - Stores user credentials and profile
- `Account` - OAuth account linking (for future providers)
- `Session` - Session management
- `VerificationToken` - Email verification (for future use)

### Security Features
- Password hashing with bcryptjs (12 rounds)
- JWT-based sessions
- CSRF protection via NextAuth
- Input validation on forms

### Test Credentials
Created test user during development:
- Email: test@example.com
- Password: password123

---

# Admin Panel Implementation Plan

## Overview
Create an admin panel for managing articles with full CRUD operations and image upload capabilities.

## Current State
- Article model exists with rich JSON content blocks (paragraph, heading, image, chart, quote, callout, list)
- Basic user authentication via NextAuth.js (no roles)
- No file upload infrastructure
- No admin panel

---

## Implementation Checklist

### Phase 1: Admin Role & Protection
- [ ] Add `role` field to User model (USER, ADMIN)
- [ ] Run Prisma migration
- [ ] Create admin middleware/protection helper
- [ ] Update existing test user to ADMIN role

### Phase 2: Image Upload Setup
- [ ] Create `/api/upload` endpoint for image uploads
- [ ] Store images in `/public/uploads/` directory
- [ ] Return uploaded image URL

### Phase 3: Admin Layout & Dashboard
- [ ] Create `/admin` route group with layout
- [ ] Build admin sidebar navigation
- [ ] Create admin dashboard page with article stats
- [ ] Add protected route check (redirect if not admin)

### Phase 4: Article Management Pages
- [ ] Create articles list page (`/admin/articles`)
- [ ] Create new article page (`/admin/articles/new`)
- [ ] Create edit article page (`/admin/articles/[id]/edit`)

### Phase 5: Article Editor
- [ ] Build article form with basic fields (title, slug, excerpt, category, author)
- [ ] Build content block editor (add/remove/reorder blocks)
- [ ] Support block types: paragraph, heading, image, quote, list, callout
- [ ] Image upload within content blocks
- [ ] Featured image upload
- [ ] Tags selection/creation
- [ ] Preview functionality

### Phase 6: API Routes
- [ ] POST `/api/admin/articles` - Create article
- [ ] PUT `/api/admin/articles/[id]` - Update article
- [ ] DELETE `/api/admin/articles/[id]` - Delete article
- [ ] GET `/api/admin/categories` - List categories
- [ ] GET `/api/admin/authors` - List authors
- [ ] GET `/api/admin/tags` - List/create tags

### Phase 7: Testing & Polish
- [ ] Test full article creation flow
- [ ] Test article editing
- [ ] Test image uploads
- [ ] Verify articles display correctly on frontend

---

## Technical Decisions

### Image Storage
Using local storage (`/public/uploads/`) for simplicity. Can migrate to Cloudinary/S3 later for production.

### Rich Text vs Block Editor
Using **block-based editor** to match existing ArticleContentBlock structure:
- paragraph, heading, image, quote, list, callout
- Each block editable individually
- Drag to reorder blocks

---

## Review Section
_(To be filled after implementation)_

---

# Live Yahoo Finance Stock Prices Implementation

## Overview
Replace static/mock stock price data with live data from Yahoo Finance API.

## Current State
- Mock data in `src/data/mockData.ts`
- MarketTicker shows 8 indices (S&P 500, NASDAQ, DOW, Russell 2000, BTC, ETH, Gold, Crude Oil)
- MarketMovers shows top gainers/losers
- InlineStockChart shows 30-day price history
- LiveMarketWidget shows relevant stocks for articles

## Plan

### Phase 1: Yahoo Finance API Integration
- [x] Install `yahoo-finance2` npm package
- [x] Create Yahoo Finance service (`src/lib/yahoo-finance.ts`)
  - Functions for: quotes, historical data, market movers

### Phase 2: API Endpoints
- [x] Create `/api/market/quotes` - Get real-time quotes for multiple symbols
- [x] Create `/api/market/movers` - Get top gainers and losers
- [x] Create `/api/market/chart/[symbol]` - Get historical chart data

### Phase 3: Update Components
- [x] Update MarketTicker to fetch live data with auto-refresh (every 30 seconds)
- [x] Update MarketMovers to fetch live gainers/losers
- [x] Update InlineStockChart to fetch live historical data
- [x] Update LiveMarketWidget to use live data

### Phase 4: Testing & Polish
- [x] Test all components with live data
- [x] Add loading states and error handling
- [x] Verify prices match Yahoo Finance website

## Symbol Mapping (Yahoo Finance format)
| Display | Yahoo Symbol |
|---------|-------------|
| S&P 500 | ^GSPC |
| NASDAQ | ^IXIC |
| DOW | ^DJI |
| Russell 2000 | ^RUT |
| Bitcoin | BTC-USD |
| Ethereum | ETH-USD |
| Gold | GC=F |
| Crude Oil | CL=F |

## Current Status: ✅ Complete

## Review

### Summary
Successfully integrated live Yahoo Finance data to replace all static/mock stock prices. The application now displays real-time market data with automatic refresh intervals.

### Files Created

| File | Description |
|------|-------------|
| `src/lib/yahoo-finance.ts` | Core Yahoo Finance service with all API functions |
| `src/app/api/market/quotes/route.ts` | API endpoint for real-time quotes |
| `src/app/api/market/movers/route.ts` | API endpoint for top gainers/losers |
| `src/app/api/market/chart/route.ts` | API endpoint for historical chart data |

### Files Modified

| File | Changes |
|------|---------|
| `src/components/layout/MarketTicker.tsx` | Client-side fetching with 30-second auto-refresh |
| `src/components/home/MarketMovers.tsx` | Client-side fetching with 60-second auto-refresh |
| `src/components/article/InlineStockChart.tsx` | Fetches live chart data based on symbol |
| `src/components/sidebar/LiveMarketWidget.tsx` | Fetches live quotes for article tickers |
| `src/components/article/ArticleBody.tsx` | Removed static data prop from InlineStockChart |
| `src/app/page.tsx` | Removed server-side market data fetching |
| `src/app/article/[slug]/page.tsx` | Removed server-side market data fetching |

### Key Features

- **Real-time quotes**: Market indices, crypto, and commodities update every 30 seconds
- **Top movers**: Live top gainers and losers from US market
- **Historical charts**: Intraday and multi-period chart data (1d, 5d, 1mo, 3mo, 6mo, 1y)
- **Symbol mapping**: Internal display symbols mapped to Yahoo Finance API symbols
- **Error handling**: Loading states and graceful error handling in all components
- **Dynamic data**: No caching - always fresh data from Yahoo Finance

### Technical Notes

- Using `yahoo-finance2` npm package v3 (requires `new YahooFinance()` instantiation)
- API routes use `force-dynamic` and `revalidate: 0` to prevent caching
- Client components fetch data on mount and auto-refresh on intervals

---

# NewsData.io Auto-Import Integration

## Overview
Automatically import news articles from newsdata.io API related to US stock market, investing, Wall Street, and politics.

## Configuration
- **Categories**: Business, Politics, Technology
- **Country**: USA (us)
- **Language**: English (en)
- **Keywords**: stocks, investing, "wall street", trading, market
- **Mode**: Fully automated (cron job)

---

## Implementation Checklist

### Phase 1: Setup & Configuration
- [x] Add `NEWSDATA_API_KEY` to `.env`
- [x] Create NewsData service (`src/lib/newsdata.ts`)
- [x] Define TypeScript types for API response

### Phase 2: Database Updates
- [x] Add `sourceUrl` field to Article model (original article link)
- [x] Add `externalId` field (newsdata article_id for deduplication)
- [x] Run Prisma migration

### Phase 3: Import Logic
- [x] Create news fetching function with filters
- [x] Create mapping function (newsdata → Article model)
- [x] Create slug generator from title
- [x] Create/get "NewsData" system author
- [x] Map newsdata categories to existing categories
- [x] Implement deduplication (check externalId)
- [x] Convert content to JSON block format

### Phase 4: Cron API Route
- [x] Create `/api/cron/import-news` route
- [x] Add CRON_SECRET for security
- [x] Add logging for import results

### Phase 5: Vercel Cron Setup
- [x] Add `vercel.json` with cron configuration
- [x] Configure hourly import schedule

---

## Field Mapping

| newsdata.io | Article Model | Notes |
|-------------|---------------|-------|
| `article_id` | `externalId` | NEW - deduplication |
| `title` | `title` | Direct |
| `description` | `excerpt` | Direct |
| `content` | `content` | → JSON blocks |
| `image_url` | `imageUrl` | Direct |
| `pubDate` | `publishedAt` | Parse DateTime |
| `category[]` | `categoryId` | Map to existing |
| `creator[]` | `authorId` | NewsData author |
| `keywords[]` | `tags` | Create/map |
| `link` | `sourceUrl` | NEW - original URL |

## API Query

```
Endpoint: https://newsdata.io/api/1/latest
Parameters:
  apikey: NEWSDATA_API_KEY
  country: us
  category: business,politics,technology
  q: stocks OR investing OR "wall street" OR trading
  language: en
```

---

## Review Section

### Summary
Successfully implemented automated news import from NewsData.io API. The system fetches US financial news related to stocks, investing, Wall Street, and politics.

### Files Created

| File | Description |
|------|-------------|
| `src/lib/newsdata.ts` | NewsData API service with types and helper functions |
| `src/app/api/cron/import-news/route.ts` | Cron job endpoint for automated imports |
| `vercel.json` | Vercel cron configuration (hourly schedule) |

### Files Modified

| File | Changes |
|------|---------|
| `prisma/schema.prisma` | Added `externalId` and `sourceUrl` fields to Article model |
| `next.config.ts` | Allowed all external image hosts |
| `.env` | Added `NEWSDATA_API_KEY` and `CRON_SECRET` |

### Key Features

- **Automated imports**: Runs hourly via Vercel Cron
- **Deduplication**: Uses `externalId` to prevent duplicate imports
- **Category mapping**: Maps newsdata categories to existing site categories
- **Tag creation**: Auto-creates tags from article keywords
- **Content conversion**: Converts plain text to JSON block format
- **Ticker extraction**: Extracts stock tickers from article content
- **Security**: Protected by `CRON_SECRET` token

### Test Results

- First import: **9 articles** successfully imported
- Second run: **9 articles skipped** (deduplication working)
- All articles display correctly on homepage with images

### How to Trigger Manually

```bash
curl "http://localhost:3000/api/cron/import-news?secret=your-cron-secret-change-in-production"
```

### Current Status: ✅ Complete
