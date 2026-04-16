#!/bin/bash
# Production Deployment Script
# Run this ON THE PRODUCTION SERVER

set -e

echo "🚀 Starting deployment..."
echo ""

# Find container
CONTAINER=$(docker ps --filter "name=fiscal" --format "{{.Names}}" | head -1)

if [ -z "$CONTAINER" ]; then
  echo "❌ No container found. Available containers:"
  docker ps --format "{{.Names}}"
  exit 1
fi

echo "📦 Using container: $CONTAINER"
echo ""

# Check if we're in the right directory
if [ ! -f "scripts/create_10_articles.js" ]; then
  echo "❌ Scripts not found. Please run from project root."
  echo "Current directory: $(pwd)"
  exit 1
fi

echo "📝 Creating 8 main articles..."
docker exec $CONTAINER node scripts/create_10_articles.js

echo ""
echo "📝 Creating 2 remaining articles..."
docker exec $CONTAINER node scripts/create_remaining_2_articles.js

echo ""
echo "📍 Adding articles to homepage zones..."
docker exec $CONTAINER node scripts/add_to_zones.js

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo "🌐 Check: https://thefiscalwire.com/"
