#!/bin/bash
# Deploy Batch 8 Trending Articles - March 27, 2026
# Run this on the production server (ssh fiscalwire)

echo "=== Deploying Batch 8 Trending Articles ==="

# Find the container
CONTAINER=$(docker ps --format '{{.Names}}' | grep -i fiscal | head -1)

if [ -z "$CONTAINER" ]; then
  echo "ERROR: No fiscal wire container found"
  docker ps
  exit 1
fi

echo "Using container: $CONTAINER"

# Copy script into container
docker cp /tmp/create_trending_march27_batch8.js "$CONTAINER":/app/scripts/

# Run the script
echo "Creating articles..."
docker exec "$CONTAINER" node /app/scripts/create_trending_march27_batch8.js

echo ""
echo "=== Done! ==="
