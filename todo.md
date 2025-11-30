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
