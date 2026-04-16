# Production Deployment Guide for 10 New Articles

## ✅ Completed Locally

- ✅ Created 10 professional financial news articles
- ✅ Added all articles to homepage zones
- ✅ Verified articles appear on local homepage (http://localhost:3000)

## 📋 Articles Created

1. **Veris Residential Reports 20% Core FFO Growth** - Finance/US Markets
2. **Finland's IQM Targets $1.8B Quantum Computing SPAC Merger** - Tech/US Markets
3. **Private Equity Expands Commercial Services** - Finance/US Markets
4. **Semiconductor Manufacturing Faces Critical Talent Shortage** - Tech/US Markets
5. **Federal Reserve Officials Signal Caution on Rate Cuts** - Economy/US Markets
6. **Biotech M&A Pipeline Builds as Large Pharma Seeks Offset** - Health Science/US Markets
7. **Renewable Energy Tax Credits Face Congressional Scrutiny** - Industrial/US Markets
8. **Commercial Real Estate Distress Accelerates** - Finance/US Markets
9. **Autonomous Trucking Deployment Accelerates** - Tech/US Markets
10. **Copper Supply Deficit Widens** - Industrial/US Markets

## 🚀 Deploy to Production

### Option 1: SSH and Run Scripts (Recommended)

```bash
# 1. SSH to production
ssh fiscalwire
# Password: Xx123456$

# 2. Navigate to project directory
cd /data/coolify/services/thefiscalwire_12gfp9s/the-fiscal-wire || cd /data/coolify

# 3. Copy scripts to production (from your local machine, before SSH)
# On your local machine:
scp scripts/create_10_articles.js fiscalwire:/tmp/
scp scripts/create_remaining_2_articles.js fiscalwire:/tmp/
scp scripts/add_to_zones.js fiscalwire:/tmp/

# 4. Once SSH'd in, copy scripts to correct location
cp /tmp/*.js ./scripts/

# 5. Find your Docker container name
docker ps | grep fiscal

# 6. Run the scripts in Docker container
docker exec thefiscalwire-production node scripts/create_10_articles.js
docker exec thefiscalwire-production node scripts/create_remaining_2_articles.js
docker exec thefiscalwire-production node scripts/add_to_zones.js
```

### Option 2: Manual Docker Commands

```bash
# SSH to production
ssh fiscalwire

# Find Docker container
docker ps

# Execute Node.js scripts directly in container
# You'll need to manually create the scripts in the container or mount them
docker exec -it <container-name> bash

# Inside container, run:
cd /app
node scripts/create_10_articles.js
node scripts/create_remaining_2_articles.js
node scripts/add_to_zones.js
```

### Option 3: API-Based Deployment

If you have an admin API endpoint for importing articles, you can also deploy via API calls from your local machine.

## ✅ Verification

After deployment, verify articles appear on:
- **Homepage**: https://thefiscalwire.com/
- **Category Pages**:
  - https://thefiscalwire.com/category/us-markets
  - https://thefiscalwire.com/category/tech
  - https://thefiscalwire.com/category/finance

## 📸 Local Preview

Check `homepage-new-articles.png` for a screenshot of how the articles appear locally.

## 🔧 Troubleshooting

If articles don't appear:
1. Check Docker logs: `docker logs <container-name>`
2. Verify database connection in production
3. Check if scripts ran successfully
4. Clear any production cache if applicable
5. Restart the production container if needed: `docker restart <container-name>`

## 📝 Notes

- All articles use placeholder images from `/images/articles/` directory
- Articles are marked as `isAiEnhanced: true`
- All articles are attributed to "Sarah Chen" (first author in database)
- Articles are automatically added to Homepage, Markets category, and Business category zones
