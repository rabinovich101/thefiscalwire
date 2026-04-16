#!/bin/bash
# Deployment script for Batch 3 - 15 NEW viral financial articles
# Run this ON THE PRODUCTION SERVER after SSH'ing in

echo "Deploying Batch 3: 15 NEW viral financial articles to production..."
echo ""

# Find the Docker container
CONTAINER=$(docker ps --filter "name=fiscal" --format "{{.Names}}" | head -1)

if [ -z "$CONTAINER" ]; then
  echo "Could not find Docker container. Please check docker ps"
  exit 1
fi

echo "Using container: $CONTAINER"
echo ""

# Copy scripts to container
echo "Copying scripts to container..."
docker cp /tmp/create_15_viral_articles_batch3.js $CONTAINER:/app/scripts/
docker cp /tmp/add_to_zones.js $CONTAINER:/app/scripts/
docker cp /tmp/place_on_homepage_batch3.js $CONTAINER:/app/scripts/

echo ""
echo "Step 1: Creating 15 NEW viral articles in production database..."
docker exec $CONTAINER node scripts/create_15_viral_articles_batch3.js

echo ""
echo "Step 2: Adding all articles to zones..."
docker exec $CONTAINER node scripts/add_to_zones.js

echo ""
echo "Step 3: Placing all articles on homepage (newest first)..."
docker exec $CONTAINER node scripts/place_on_homepage_batch3.js

echo ""
echo "Batch 3 deployment complete!"
echo "Check https://thefiscalwire.com/ to verify"
