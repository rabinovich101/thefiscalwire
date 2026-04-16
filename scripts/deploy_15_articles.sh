#!/bin/bash
# Deployment script for 15 viral financial articles
# Run this ON THE PRODUCTION SERVER after SSH'ing in

echo "Deploying 15 viral financial articles to production..."
echo ""

# Find the Docker container
CONTAINER=$(docker ps --filter "name=fiscal" --format "{{.Names}}" | head -1)

if [ -z "$CONTAINER" ]; then
  echo "Could not find Docker container. Please check docker ps"
  exit 1
fi

echo "Using container: $CONTAINER"
echo ""

# Copy local scripts to container
echo "Copying scripts to container..."
docker cp scripts/create_15_viral_articles.js $CONTAINER:/app/scripts/
docker cp scripts/add_to_zones.js $CONTAINER:/app/scripts/

echo ""
echo "Creating 15 viral articles in production database..."
docker exec $CONTAINER node scripts/create_15_viral_articles.js

echo ""
echo "Adding articles to homepage zones..."
docker exec $CONTAINER node scripts/add_to_zones.js

echo ""
echo "Deployment complete!"
echo "Check https://thefiscalwire.com/ to verify"
