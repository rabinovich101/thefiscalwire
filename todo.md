# Stock Sectors Feature Implementation

## Overview
Create a sectors page that organizes all stocks by their sector, allowing users to browse all available sectors and view stocks within each sector.

## Sector Categories (from existing SECTOR_MAP)
- Technology (40 stocks)
- Healthcare (30 stocks)
- Financial (15 stocks)
- Consumer (20 stocks)
- Consumer Staples (12 stocks)
- Industrial (19 stocks)
- Energy (7 stocks)
- Utilities (7 stocks)
- Real Estate (3 stocks)
- Materials (3 stocks)
- Communication (9 stocks)

---

## To-Do Checklist

### Phase 1: Data Layer
- [x] 1. Add `SECTORS` constant with sector metadata (name, icon, description, color)
- [x] 2. Add `getSectorStocks(sector)` function to return all stocks in a sector with live data

### Phase 2: API Routes
- [x] 3. Create `/api/stocks/sectors/route.ts` - GET all sectors with performance data
- [x] 4. Create `/api/stocks/sectors/[sector]/route.ts` - GET all stocks in a sector

### Phase 3: UI Components
- [x] 5. Create `SectorCard.tsx` component - displays sector with icon, stock count, and performance

### Phase 4: Pages
- [x] 6. Create `/stocks/sectors/page.tsx` - Main sectors hub showing all sectors as clickable cards
- [x] 7. Create `/stocks/sectors/[sector]/page.tsx` - Individual sector page showing all stocks in a table

### Phase 5: Navigation
- [x] 8. Add "Sectors" link to stocks navigation (already existed at `/stocks/sectors`)

---

## Review

### Summary
Successfully implemented a world-class stock sectors feature with premium design inspired by Google/Apple design principles.

### Features Implemented

**Sectors Hub Page (`/stocks/sectors`)**
- Hero section with gradient background and blur effects
- Quick stats: total stocks, average change, advancing/declining counts
- Live market indices ticker
- Best/Worst performing sector highlight cards with animations
- Grid of 11 sector cards sorted by performance

**Sector Card Component**
- Premium design with sector-specific colors and gradients
- Animated hover effects (scale, glow, translate)
- Sector icon with colored background
- Performance badge with trend indicator
- Stats grid (stock count, market cap)
- Advancers/Decliners progress bar
- Top gainer and worst performer display

**Individual Sector Page (`/stocks/sectors/[sector]`)**
- Sector header with icon, name, description
- Key stats: stock count, avg change, total market cap
- Advancers/Decliners bar with search integration
- Live market ticker
- Professional stock table with:
  - Rank, Symbol, Name, Price, Change %, Market Cap
  - 52-week range visual indicator
  - Hover animations and click-through to stock details

### Files Created

| File | Description |
|------|-------------|
| `src/lib/yahoo-finance.ts` | Added SECTORS constant, SectorInfo interface, getSectorStocks(), getAllSectorsPerformance() |
| `src/app/api/stocks/sectors/route.ts` | API endpoint for all sectors with performance data |
| `src/app/api/stocks/sectors/[sector]/route.ts` | API endpoint for stocks in a specific sector |
| `src/components/stocks/SectorCard.tsx` | Premium sector card component with compact variant |
| `src/app/stocks/sectors/page.tsx` | Main sectors hub page |
| `src/app/stocks/sectors/[sector]/page.tsx` | Individual sector detail page |

### Design Highlights
- **Color System**: Each sector has unique color scheme (blue for Tech, emerald for Healthcare, etc.)
- **Gradients**: Subtle gradient overlays on hover
- **Animations**: Smooth 300ms transitions, scale effects, translate animations
- **Typography**: Clear hierarchy with proper font weights
- **Spacing**: Consistent 8px grid system
- **Accessibility**: Proper ARIA labels, keyboard navigation support

### Sector Data
- 11 sectors with 163 total stocks
- Real-time data from Yahoo Finance API
- Sorted by daily performance (best to worst)

### Current Status: ✅ Complete

---

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

# User Profile Dropdown & Account Settings Feature

## Overview
Create a world-class user profile dropdown and account settings page following design patterns from Google, Apple, LinkedIn, and other top companies.

## Design Principles (Based on Research)
- **Clean dropdown menu** with clear visual hierarchy (primary vs secondary actions)
- **Section-level editing** for profile settings (not inline field editing)
- **One-column form layout** for all edit forms
- **8px spacing grid system** for consistency
- **Smooth animations** (150-200ms transitions)
- **Full keyboard accessibility**

## To-Do Checklist

### Phase 1: Database Schema Update
- [x] Add new fields to User model: `firstName`, `lastName`, `dateOfBirth`, `phoneNumber`, `username`
- [x] Run Prisma migration

### Phase 2: Create UI Components
- [x] Install shadcn dropdown-menu and avatar components
- [x] Create `Avatar` component with initials fallback
- [x] Create `UserProfileDropdown` component

### Phase 3: Create Account Settings Page
- [x] Create `/account/settings` page layout
- [x] Create sections: Personal Info, Password Change
- [x] Create edit forms for each section

### Phase 4: Create API Endpoints
- [x] GET `/api/user/profile` - Fetch user profile
- [x] POST `/api/user/update-profile` - Update name, DOB, phone, username
- [x] POST `/api/user/change-password` - Change password

### Phase 5: Integration
- [x] Replace current user display in Header with UserProfileDropdown
- [x] Add mobile support for dropdown
- [x] Test all functionality

### Phase 6: Polish
- [x] Add animations and transitions (via shadcn/radix)
- [x] Keyboard accessibility (built into radix components)
- [x] Visual comparison with reference designs

---

## Technical Details

### Dropdown Menu Structure:
```
┌─────────────────────────────┐
│  [Avatar] User Name         │
│  email@example.com          │
├─────────────────────────────┤
│  ⚙️  Account Settings       │
├─────────────────────────────┤
│  🌙  Dark Mode Toggle       │
├─────────────────────────────┤
│  🚪  Sign Out               │
└─────────────────────────────┘
```

### Account Settings Page Structure:
```
┌─────────────────────────────────────────┐
│  Account Settings                       │
├─────────────────────────────────────────┤
│                                         │
│  Personal Information          [Edit]   │
│  ─────────────────────────────────────  │
│  First Name: John                       │
│  Last Name: Doe                         │
│  Username: johndoe                      │
│  Email: john@example.com                │
│  Phone: +1 (555) 123-4567              │
│  Date of Birth: January 15, 1990        │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  Password & Security           [Edit]   │
│  ─────────────────────────────────────  │
│  Password: ••••••••••                   │
│  Last changed: 30 days ago              │
│                                         │
└─────────────────────────────────────────┘
```

## Review
(To be filled after implementation)

---

# Activity Logger for Admin Panel

## Overview
Build a comprehensive activity logger to track all automation activities on the website:
- Article imports from NewsData.io (count of imported articles)
- Perplexity API usage (number of requests, articles translated/rewritten)
- Error tracking (any failures in automation)
- Sortable and filterable by date/time

## To-Do Checklist

### Phase 1: Database Schema
- [x] Create `ActivityLog` model in Prisma schema with fields:
  - id, type (IMPORT, PERPLEXITY_API, NEWS_API, ERROR, SYSTEM)
  - action (description of what happened)
  - details (JSON for flexible data storage)
  - count (number of items affected)
  - status (SUCCESS, ERROR, WARNING, INFO)
  - createdAt

### Phase 2: Logging Service
- [x] Create `/src/lib/activityLogger.ts` with functions:
  - `logActivity()` - General logging function
  - `logImport()` - Log article imports
  - `logPerplexityUsage()` - Log AI API calls
  - `logNewsApiUsage()` - Log NewsData.io API calls
  - `logError()` - Log errors
  - `logPerplexityBatch()` - Log batch Perplexity API usage

### Phase 3: Update Automation Scripts
- [x] Update `/api/cron/import-news/route.ts` to log activities
- [x] Update `/api/cron/import-category/route.ts` to log activities

### Phase 4: Admin API
- [x] Create `/api/admin/activity-logs/route.ts` with:
  - GET: Fetch logs with pagination, filtering, sorting
  - Query params: type, status, startDate, endDate, page, limit
  - Statistics for today and week

### Phase 5: Admin UI
- [x] Add "Activity Logs" to admin sidebar
- [x] Create `/admin/activity-logs/page.tsx` with:
  - Table view of all activities
  - Filters: type, status, date range
  - Sorting by date/time
  - Pagination
  - Expandable rows to show JSON details
  - Stats cards showing today's metrics

## Review

### Summary
Successfully implemented a comprehensive activity logging system for tracking all automation activities.

### Files Created
| File | Description |
|------|-------------|
| `prisma/schema.prisma` | Added ActivityLog model with enums for ActivityType and ActivityStatus |
| `src/lib/activityLogger.ts` | Logging service with helper functions |
| `src/app/api/admin/activity-logs/route.ts` | Admin API endpoint with filtering, pagination, and stats |
| `src/app/admin/activity-logs/page.tsx` | Admin UI page with table, filters, and stats cards |

### Files Modified
| File | Changes |
|------|---------|
| `src/app/api/cron/import-news/route.ts` | Added activity logging for imports, API calls, and errors |
| `src/app/api/cron/import-category/route.ts` | Added activity logging for category imports |
| `src/components/admin/AdminSidebar.tsx` | Added Activity Logs link |

### Features
- **Activity Types**: IMPORT, PERPLEXITY_API, NEWS_API, ERROR, SYSTEM
- **Status Tracking**: SUCCESS, ERROR, WARNING, INFO
- **Dashboard Stats**: Today's imports, Perplexity calls, News API calls, errors
- **Filtering**: By type, status, and date range
- **Pagination**: Configurable page size with navigation
- **Expandable Details**: Click rows to view full JSON details
- **Color-coded UI**: Different colors for each activity type and status

### Current Status: Complete

---

# Stock Feature Implementation Plan

## Overview
Create a comprehensive stock feature similar to Yahoo Finance where users can:
- Search for stocks by symbol or company name
- View detailed stock pages with charts, statistics, and news
- See real-time price data and historical performance

## Reference
- Target UI: https://finance.yahoo.com/quote/MRVL/

---

## To-Do Checklist

### Phase 1: API Infrastructure
- [ ] **1.1** Create stock search API endpoint (`/api/stocks/search`)
  - Use yahoo-finance2 `search()` function
  - Return stock symbols, names, exchange info

- [ ] **1.2** Create stock quote API endpoint (`/api/stocks/[symbol]/quote`)
  - Use yahoo-finance2 `quoteSummary()` for detailed data
  - Include: price, change, market cap, P/E, volume, 52-week range, etc.

- [ ] **1.3** Create stock chart API endpoint (`/api/stocks/[symbol]/chart`)
  - Use yahoo-finance2 chart functionality
  - Support multiple timeframes: 1D, 5D, 1M, 6M, YTD, 1Y, 5Y, MAX

- [ ] **1.4** Create stock news API endpoint (`/api/stocks/[symbol]/news`)
  - Fetch news related to specific stock ticker

### Phase 2: UI Components
- [ ] **2.1** Create `StockSearchBar` component
  - Autocomplete dropdown with stock suggestions
  - Debounced search input
  - Navigate to stock page on selection

- [ ] **2.2** Create `StockPriceHeader` component
  - Large price display with change indicator (+/- percentage)
  - Company name, symbol, and exchange info
  - Real-time price updates

- [ ] **2.3** Create `StockChart` component
  - Interactive chart with recharts (AreaChart)
  - Timeframe selector (1D, 5D, 1M, 6M, YTD, 1Y, 5Y, MAX)
  - Hover tooltips with price/date

- [ ] **2.4** Create `StockStatistics` component
  - Key statistics grid layout
  - Market cap, P/E ratio, EPS, dividend yield
  - 52-week high/low, volume, avg volume

- [ ] **2.5** Create `StockNews` component
  - Related news articles list
  - Link to full articles or external sources

- [ ] **2.6** Create `StockSidebar` component
  - Key data summary
  - Related/similar stocks

### Phase 3: Pages
- [ ] **3.1** Create stock listing page (`/stocks`)
  - Search bar prominently displayed
  - Popular stocks / Market overview

- [ ] **3.2** Create individual stock page (`/stocks/[symbol]`)
  - Full stock detail page similar to Yahoo Finance
  - Sections: Summary, Chart, Statistics, News

### Phase 4: Integration
- [ ] **4.1** Add stock search to header/navigation
- [ ] **4.2** Link relevant tickers in articles to stock pages
- [ ] **4.3** Add "View Stock" links in MarketMovers widget

### Phase 5: Polish & Testing
- [ ] **5.1** Add loading states and error handling
- [ ] **5.2** Mobile responsive design
- [ ] **5.3** Test with various stock symbols
- [ ] **5.4** Compare UI with Yahoo Finance reference

---

## Technical Notes

### Yahoo Finance Data Available (yahoo-finance2):
- `quoteSummary()` - Comprehensive stock data with modules
- `search()` - Stock symbol search
- `chart()` - Historical price data

### Existing Infrastructure to Leverage:
- `/lib/yahoo-finance.ts` - Already has Yahoo Finance integration
- `/api/market/chart` - Chart data endpoint exists
- `/api/market/quotes` - Quote endpoint exists
- `recharts` - Already installed for charts
- shadcn components for UI

---

## Review Section
*(To be filled after implementation)*

### Current Status: Pending Approval

---

# Stock Heatmap Page Implementation

## Overview
Create a dynamic stock market heatmap page under `/stocks/heatmap` that displays S&P 500 and NASDAQ stocks with color-coded performance visualization. Users can switch between indices via dropdown.

## To-Do Checklist

- [x] 1. Add S&P 500 and NASDAQ constituent functions to Yahoo Finance lib
- [x] 2. Create API route `/api/stocks/heatmap` to serve heatmap data
- [x] 3. Create `StockHeatmap` component with treemap visualization
- [x] 4. Create the heatmap page at `/stocks/heatmap/page.tsx`
- [x] 5. Add dropdown to switch between S&P 500 and NASDAQ
- [x] 6. Style the heatmap with color gradients (red to green based on % change)
- [x] 7. Add hover tooltips showing stock details
- [x] 8. Update navigation config to include Heatmap link
- [x] 9. Test and verify with Playwright

## Technical Approach

### Heatmap Data Structure
```typescript
interface HeatmapStock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  marketCap: number
  sector: string
}
```

### Color Mapping
- Deep Red: < -5%
- Red: -5% to -2%
- Light Red: -2% to 0%
- Light Green: 0% to 2%
- Green: 2% to 5%
- Deep Green: > 5%

### Size Mapping
- Block size proportional to market cap

## Review

### Summary
Successfully implemented a dynamic stock market heatmap page with the following features:

### Features Implemented
- **Treemap Visualization**: Stocks displayed in a treemap where box size represents market cap
- **Color Coding**: Red-to-green gradient based on daily percentage change (-5% to +5%)
- **Index Selector**: Dropdown to switch between S&P 500 Top 100 and NASDAQ-100
- **Stats Cards**: Shows count of advancing/declining/unchanged stocks and average change
- **Interactive Tooltips**: Hover to see symbol, sector, company name, price, change, and market cap
- **Color Legend**: Visual legend showing the color scale
- **Click Navigation**: Click any stock to go to its detail page
- **Live Market Ticker**: Scrolling ticker showing major indices at the top

### Files Created
| File | Description |
|------|-------------|
| `src/app/api/stocks/heatmap/route.ts` | API endpoint for heatmap data |
| `src/app/stocks/heatmap/page.tsx` | Heatmap page with hero section and market ticker |
| `src/components/stocks/StockHeatmap.tsx` | Interactive treemap component with tooltip |
| `src/components/ui/select.tsx` | Shadcn Select component for dropdown |

### Files Modified
| File | Changes |
|------|---------|
| `src/lib/yahoo-finance.ts` | Added SP500_SYMBOLS, NASDAQ100_SYMBOLS arrays, HeatmapStock interface, getHeatmapData() function, and SECTOR_MAP |
| `src/components/stocks/index.ts` | Added StockHeatmap export |
| `src/config/navigation.ts` | Added Heatmap link under Stocks menu |

### Current Status: Complete
