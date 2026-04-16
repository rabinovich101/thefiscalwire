#!/bin/bash
# Deploy trending articles - March 27, 2026 (Batch 7 - Late Night)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PARENT_DIR"

echo "========================================="
echo "  Deploying 5 Trending Articles (Batch 7)"
echo "  March 27, 2026 - Late Night Edition"
echo "========================================="
echo ""

# Use expect to handle SSH passphrase
/usr/bin/expect << 'EXPECT_SCRIPT'
set timeout 300
log_user 1

puts "\n Step 1/5: Copying create_trending_march27_batch7.js to server..."
spawn bash -c "cat scripts/create_trending_march27_batch7.js | ssh fiscalwire 'cat > /tmp/create_trending_march27_batch7.js'"
expect {
    -re "passphrase.*:" { send "Xx123456$\r"; exp_continue }
    -re "password:" { send "Xx123456\r"; exp_continue }
    eof
}
sleep 2

puts "\n Step 2/5: Copying add_to_zones.js to server..."
spawn bash -c "cat scripts/add_to_zones.js | ssh fiscalwire 'cat > /tmp/add_to_zones.js'"
expect {
    -re "passphrase.*:" { send "Xx123456$\r"; exp_continue }
    -re "password:" { send "Xx123456\r"; exp_continue }
    eof
}
sleep 2

puts "\n Step 3/5: Copying place_on_homepage_batch7.js to server..."
spawn bash -c "cat scripts/place_on_homepage_batch7.js | ssh fiscalwire 'cat > /tmp/place_on_homepage_batch7.js'"
expect {
    -re "passphrase.*:" { send "Xx123456$\r"; exp_continue }
    -re "password:" { send "Xx123456\r"; exp_continue }
    eof
}
sleep 2

puts "\n Step 4/5: Running article creation script on production..."
spawn ssh fiscalwire "CONTAINER=\$(docker ps --filter 'name=fiscal' --format '{{.Names}}' | head -1) && echo \"Using container: \$CONTAINER\" && docker cp /tmp/create_trending_march27_batch7.js \$CONTAINER:/app/scripts/ && docker cp /tmp/add_to_zones.js \$CONTAINER:/app/scripts/ && docker cp /tmp/place_on_homepage_batch7.js \$CONTAINER:/app/scripts/ && docker exec \$CONTAINER node scripts/create_trending_march27_batch7.js"
expect {
    -re "passphrase.*:" { send "Xx123456$\r"; exp_continue }
    -re "password:" { send "Xx123456\r"; exp_continue }
    eof
}
sleep 2

puts "\n Step 5/5: Adding articles to zones and placing on homepage..."
spawn ssh fiscalwire "CONTAINER=\$(docker ps --filter 'name=fiscal' --format '{{.Names}}' | head -1) && docker exec \$CONTAINER node scripts/add_to_zones.js && docker exec \$CONTAINER node scripts/place_on_homepage_batch7.js"
expect {
    -re "passphrase.*:" { send "Xx123456$\r"; exp_continue }
    -re "password:" { send "Xx123456\r"; exp_continue }
    eof
}

puts "\n\n DEPLOYMENT COMPLETE!"
puts "Check https://thefiscalwire.com/ to verify\n"
EXPECT_SCRIPT

echo ""
echo "Deployment finished!"
