# ⚡ QUICK PRODUCTION DEPLOYMENT

## Option 1: Run SQL Directly (FASTEST - 30 seconds)

```bash
# 1. SSH to production
ssh fiscalwire
# Password: Xx123456$

# 2. Find your database container
docker ps | grep postgres

# 3. Copy the SQL file content and run it
# (Copy content from scripts/production_articles.sql)

# 4. Run SQL on production database
docker exec -i <postgres-container-name> psql -U <db-user> -d <db-name> < production_articles.sql

# OR if you know the database connection string:
psql "$DATABASE_URL" < scripts/production_articles.sql
```

## Option 2: Run Node Scripts (2 minutes)

```bash
# 1. SSH to production
ssh fiscalwire

# 2. Go to project directory
cd /data/coolify/services/thefiscalwire_12gfp9s/the-fiscal-wire

# 3. Find Docker container
CONTAINER=$(docker ps --filter "name=fiscal" --format "{{.Names}}" | head -1)

# 4. Run deployment
docker exec $CONTAINER node scripts/create_10_articles.js
docker exec $CONTAINER node scripts/create_remaining_2_articles.js
docker exec $CONTAINER node scripts/add_to_zones.js
```

## Option 3: One-Line Deployment

```bash
ssh fiscalwire 'cd /data/coolify/services/thefiscalwire_12gfp9s/the-fiscal-wire && CONTAINER=$(docker ps --filter "name=fiscal" --format "{{.Names}}" | head -1) && docker exec $CONTAINER node scripts/create_10_articles.js && docker exec $CONTAINER node scripts/create_remaining_2_articles.js && docker exec $CONTAINER node scripts/add_to_zones.js'
```

## ✅ Verify

After running, check: https://thefiscalwire.com/

You should see these new articles on the homepage:
1. Copper Supply Deficit Widens...
2. Renewable Energy Tax Credits Face...
3. Autonomous Trucking Deployment...
4. Commercial Real Estate Distress...
5. Biotech M&A Pipeline Builds...
6. Federal Reserve Officials Signal...
7. Semiconductor Manufacturing Faces...
8. Private Equity Expands...
9. Finland's IQM Targets...
10. Veris Residential Reports...
