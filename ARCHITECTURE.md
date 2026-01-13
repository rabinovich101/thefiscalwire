# The Fiscal Wire - Architecture & Deployment Guide

## Overview
**The Fiscal Wire** (thefiscalwire.com) is a financial news website built with Next.js, providing real-time market data, news articles, and stock analysis.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS, Radix UI, shadcn/ui components
- **Charts**:
  - Recharts (simple area charts)
  - Lightweight Charts (candlestick/technical analysis)
  - TradingView Widgets (embedded Mini & Advanced charts via CDN)
  - Custom SVG Treemap (market heatmap)
- **State**: React hooks (no external state management)
- **Auth**: NextAuth v5 (beta)

### Backend
- **API**: Next.js API Routes (`/src/app/api/`)
- **Database**: PostgreSQL (Railway hosted)
- **ORM**: Prisma 6
- **File Uploads**: UploadThing

### External APIs & Data Sources
- **Yahoo Finance 2**: Primary stock data (quotes, charts, options, fundamentals)
- **Nasdaq API**: Fallback for stock data, options chains, short interest
- **Finviz**: Fallback scraping for detailed metrics (P/E, margins, technicals)
- **Alpha Vantage**: Earnings calendar data
- **NewsData.io**: News article imports
- **TradingView**: Embedded chart widgets (CDN)
- **Resend**: Email delivery
- **Index Constituents API**: S&P 500, DJIA, Nasdaq 100 composition (GitHub)

### Data Fallback Chain
Stock quotes use a three-tier fallback strategy:
1. Yahoo Finance (primary) → 2. Nasdaq + Finviz (parallel) → 3. Last known good data

Chart data: Yahoo → Nasdaq (intraday only) → Cached data → Empty fallback

All endpoints return graceful fallbacks instead of 500 errors.

### Caching
- In-memory caching with 60-second TTL for market data
- 5-minute cache for Finviz scraped data
- 24-hour cache for Alpha Vantage earnings
- "Last known good" fallback for rate-limited scenarios

---

## Project Structure

```
newswebbyclaude/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── stocks/        # Stock data APIs
│   │   │   │   └── [symbol]/  # Per-stock endpoints
│   │   │   │       ├── route.ts        # Stock summary
│   │   │   │       ├── options/        # Options chain
│   │   │   │       ├── chart/          # Chart data
│   │   │   │       └── ...
│   │   │   ├── news/          # News APIs
│   │   │   └── cron/          # Scheduled jobs
│   │   ├── stocks/            # Stock pages
│   │   │   └── [symbol]/      # Individual stock pages
│   │   │       ├── page.tsx           # Summary
│   │   │       ├── options/page.tsx   # Options chain
│   │   │       ├── chart/page.tsx     # Chart
│   │   │       └── ...
│   │   ├── markets/           # Market overview pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── article/           # Article pages
│   │   └── category/          # Category pages
│   ├── components/            # React components (9 categories)
│   │   ├── ui/               # shadcn/ui base components
│   │   ├── stocks/           # Stock-related components
│   │   ├── article/          # Article components
│   │   ├── home/             # Homepage components
│   │   ├── layout/           # Layout components
│   │   ├── admin/            # Admin components
│   │   ├── sidebar/          # Sidebar navigation components
│   │   ├── zones/            # Page zone/layout components
│   │   └── providers/        # React context providers
│   ├── lib/                   # Utility functions (25 modules)
│   │   ├── prisma.ts         # Prisma client
│   │   ├── auth.ts           # Auth config
│   │   ├── utils.ts          # Helpers
│   │   ├── yahoo-finance.ts  # Yahoo Finance integration
│   │   ├── rate-limit.ts     # API rate limiting
│   │   ├── scheduler.ts      # Cron job scheduler
│   │   ├── perplexity.ts     # Perplexity AI integration
│   │   └── ...               # 17 more utility modules
│   ├── types/                 # TypeScript types
│   └── data/                  # Static data files
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Database migrations
│   └── seed.ts               # Seed script
├── scripts/                   # Utility scripts (15 total)
│   ├── import-news.ts        # News import from NewsData.io
│   ├── cron-import.ts        # Scheduled imports
│   ├── assign-categories.ts  # Category assignment
│   └── ...                   # Database maintenance scripts
├── public/                    # Static assets
│   └── uploads/              # Uploaded files
└── package.json
```

---

## Database Schema (Key Models)

```prisma
# News & Content
- Article        # News articles with JSON content blocks
- Author         # Article authors
- Category       # Article categories (Markets/Business)
- Tag            # Article tags

# Users & Auth
- User           # User accounts
- Account        # OAuth accounts
- Session        # User sessions

# Site Configuration
- PageDefinition # Page layout definitions
- Zone           # Content zones for layouts
```

---

## Deployment

### Hosting: Coolify (Self-hosted PaaS)
- **Server**: Proxmox VM running Ubuntu 24.04
- **Platform**: Coolify (Docker-based deployment)
- **SSH**: `ssh fiscalwire` (configured in ~/.ssh/config)
- **Location**: `/data/coolify/`

### Database: Railway
- **Provider**: Railway PostgreSQL
- **Connection**: Via `DATABASE_URL` environment variable
- **Migrations**: Run with `npx prisma migrate deploy`

### Deployment Flow
1. Push code to GitHub (`rabinovich101/thefiscalwire`)
2. GitHub Actions workflow triggers (`.github/workflows/deploy.yml`)
3. SSH tunnel through proxy to production server
4. Docker Compose rebuild with Traefik labels
5. Container deployed with automatic SSL via Traefik

### Docker Configuration
- **Dockerfile**: Multi-stage build, Node.js 22 Alpine
- **docker-compose.yml**: Traefik labels for SSL/routing
- **Network**: Connected to Coolify's Traefik proxy

### Server Access
```bash
# SSH to server
ssh fiscalwire

# Note: User 'ooo' needs to be added to docker group to run docker commands
# Run on server: sudo usermod -aG docker ooo && newgrp docker
```

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://thefiscalwire.com"

# External APIs
NEWSDATA_API_KEY="..."
RESEND_API_KEY="..."
ALPHA_VANTAGE_API_KEY="..."
FISCALWIRE_API_KEY="..."      # Optional

# Cron Jobs
CRON_SECRET="..."

# File Uploads
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."
```

---

## Key Features

### Stock Pages (`/stocks/[symbol]`)
- **Summary**: Price, stats, company info
- **Options**: Full options chain with Greeks (Nasdaq API)
- **Chart**: Interactive TradingView-style charts
- **News**: Stock-specific news
- **Financials**: Income, balance sheet, cash flow
- **Analysis**: Analyst ratings and price targets

### Markets (`/markets`)
- Market overview and indices
- Sector heatmaps
- Market movers

### Admin (`/admin`)
- Article management
- Category/tag management
- User management
- Site configuration

---

## Scripts

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm run start            # Start production server

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio

# Testing
npm test                 # Run tests (Vitest)

# News Import
npm run import-news      # Import articles from NewsData.io
```

---

## API Routes

### Stock APIs (`/api/stocks/[symbol]/`)
| Endpoint | Description |
|----------|-------------|
| `/api/stocks/[symbol]` | Stock summary & quote |
| `/api/stocks/[symbol]/options` | Options chain |
| `/api/stocks/[symbol]/chart` | OHLC chart data |
| `/api/stocks/[symbol]/statistics` | Key statistics |
| `/api/stocks/[symbol]/financials` | Financial statements |
| `/api/stocks/[symbol]/analysis` | Analyst ratings |
| `/api/stocks/[symbol]/holders` | Institutional holders |
| `/api/stocks/[symbol]/short-interest` | Short interest data |

### Market APIs (`/api/market/`)
| Endpoint | Description |
|----------|-------------|
| `/api/market/quotes` | Market indices (S&P, Nasdaq, Dow) |
| `/api/market/movers` | Top gainers and losers |
| `/api/market/chart` | Market index charts |

### Additional Stock APIs
| Endpoint | Description |
|----------|-------------|
| `/api/stocks/[symbol]/profile` | Company profile |
| `/api/stocks/[symbol]/news` | Stock-specific news |
| `/api/stocks/[symbol]/historical` | Historical price data |
| `/api/stocks/heatmap` | Market heatmap data |
| `/api/stocks/trending` | Trending stocks |
| `/api/stocks/earnings/stream` | Earnings streaming |

### Other APIs
| Endpoint | Description |
|----------|-------------|
| `/api/auth/*` | NextAuth endpoints |
| `/api/news/*` | News article endpoints |
| `/api/cron/import-news` | Scheduled news import |
| `/api/search` | Global search |
| `/api/upload` | File uploads |

---

## Troubleshooting

### Deployment not updating
1. Check Coolify dashboard for build status
2. Verify GitHub webhook is configured
3. Check Docker logs: `docker logs <container>`

### Database issues
1. Check Railway dashboard for DB status
2. Run migrations: `npx prisma migrate deploy`
3. Check connection: `npx prisma db pull`

### Options showing limited strikes
- Ensure `money` parameter is passed to Nasdaq API
- `money=all` shows all strikes
- Default `money=at` (Near the Money) shows only ~3 strikes

---

## Contact
- **Repository**: https://github.com/rabinovich101/thefiscalwire
- **Domain**: https://thefiscalwire.com
