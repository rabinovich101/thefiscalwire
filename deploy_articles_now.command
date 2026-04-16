#!/bin/bash
# Auto-deploy trending articles - March 27, 2026 (Batch 3)
# This script copies article scripts to production and runs them

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================="
echo "  Deploying 5 Trending Articles (Batch 3)"
echo "  March 27, 2026"
echo "========================================="
echo ""

# Use expect to handle SSH passphrase
/usr/bin/expect << 'EXPECT_SCRIPT'
set timeout 300
log_user 1

puts "\n Step 1/4: Copying create_trending_march27_batch3.js to server..."
spawn bash -c "cat scripts/create_trending_march27_batch3.js | ssh fiscalwire 'cat > /tmp/create_trending_march27_batch3.js'"
expect {
    -re "passphrase.*:" { send "Xx123456$\r"; exp_continue }
    -re "password:" { send "Xx123456\r"; exp_continue }
    eof
}
sleep 2

puts "\n Step 2/4: Copying add_to_zones.js to server..."
spawn bash -c "cat scripts/add_to_zones.js | ssh fiscalwire 'cat > /tmp/add_to_zones.js'"
expect {
    -re "passphrase.*:" { send "Xx123456$\r"; exp_continue }
    -re "password:" { send "Xx123456\r"; exp_continue }
    eof
}
sleep 2

puts "\n Step 3/4: Running article creation script..."
spawn ssh fiscalwire "CONTAINER=\$(docker ps --filter 'name=fiscal' --format '{{.Names}}' | head -1) && echo \"Using container: \$CONTAINER\" && docker cp /tmp/create_trending_march27_batch3.js \$CONTAINER:/app/scripts/ && docker cp /tmp/add_to_zones.js \$CONTAINER:/app/scripts/ && docker exec \$CONTAINER node scripts/create_trending_march27_batch3.js"
expect {
    -re "passphrase.*:" { send "Xx123456$\r"; exp_continue }
    -re "password:" { send "Xx123456\r"; exp_continue }
    eof
}
sleep 2

puts "\n Step 4/4: Adding articles to homepage zones..."
spawn ssh fiscalwire "CONTAINER=\$(docker ps --filter 'name=fiscal' --format '{{.Names}}' | head -1) && docker exec \$CONTAINER node scripts/add_to_zones.js"
expect {
    -re "passphrase.*:" { send "Xx123456$\r"; exp_continue }
    -re "password:" { send "Xx123456\r"; exp_continue }
    eof
}

puts "\n\n DEPLOYMENT COMPLETE!"
puts "Check https://thefiscalwire.com/ to verify\n"
EXPECT_SCRIPT

echo ""
echo "Press any key to close..."
read -n 1
