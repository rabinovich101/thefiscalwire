#!/bin/bash
# Deploy March 27 Batch 2 trending articles to production
set -e

echo "=== Deploying March 27 Batch 2 Trending Articles ==="

CONTAINER=$(docker ps --format '{{.Names}}' | grep -i fiscal | head -1)

if [ -z "$CONTAINER" ]; then
  echo "ERROR: Could not find fiscalwire container"
  docker ps
  exit 1
fi

echo "Using container: $CONTAINER"

echo "Copying scripts..."
docker cp /tmp/create_trending_march27_batch2.js "$CONTAINER":/app/scripts/
docker cp /tmp/add_to_zones.js "$CONTAINER":/app/scripts/

echo "Creating articles..."
docker exec "$CONTAINER" node scripts/create_trending_march27_batch2.js

echo "Adding articles to homepage zones..."
docker exec "$CONTAINER" node scripts/add_to_zones.js

echo ""
echo "=== Deployment Complete! ==="
echo "Visit https://thefiscalwire.com to verify"
