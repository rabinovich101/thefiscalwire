#!/bin/bash
# Deployment script for 5 trending financial articles - March 26, 2026
# Run this ON THE PRODUCTION SERVER after SSH'ing in

echo "Deploying 5 Trending Articles - March 26, 2026..."
echo ""

# Find the Docker container
CONTAINER=$(docker ps --filter "name=fiscal" --format "{{.Names}}" | head -1)

if [ -z "$CONTAINER" ]; then
  echo "Could not find Docker container. Trying alternative names..."
  CONTAINER=$(docker ps --filter "name=thefiscal" --format "{{.Names}}" | head -1)
fi

if [ -z "$CONTAINER" ]; then
  echo "Could not find Docker container. Please check docker ps"
  docker ps
  exit 1
fi

echo "Using container: $CONTAINER"
echo ""

# Copy scripts to container
echo "Copying scripts to container..."
docker cp /tmp/create_trending_march26.js $CONTAINER:/app/scripts/
docker cp /tmp/add_to_zones.js $CONTAINER:/app/scripts/

echo ""
echo "Step 1: Creating 5 trending articles in production database..."
docker exec $CONTAINER node scripts/create_trending_march26.js

echo ""
echo "Step 2: Adding all articles to homepage zones..."
docker exec $CONTAINER node scripts/add_to_zones.js

echo ""
echo "Deployment complete!"
echo "Check https://thefiscalwire.com/ to verify"
