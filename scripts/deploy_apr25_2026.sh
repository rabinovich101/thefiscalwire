#!/usr/bin/env bash
set -euo pipefail

DEPLOY_TARGET="${DEPLOY_HOST:-fiscalwire}"
LOCAL_SCRIPT="scripts/create_articles_apr25_2026.js"
REMOTE_SCRIPT="/tmp/create_articles_apr25_2026.js"

if [ ! -f "$LOCAL_SCRIPT" ]; then
  echo "Missing local script: $LOCAL_SCRIPT" >&2
  exit 1
fi

if ! command -v expect >/dev/null 2>&1; then
  echo "expect is required for non-interactive SSH deployment." >&2
  exit 1
fi

run_with_expect() {
  local command="$1"
  EXPECT_COMMAND="$command" expect <<'EXPECT'
set timeout -1
set command $env(EXPECT_COMMAND)
spawn bash -lc $command
expect {
  -re "Are you sure you want to continue connecting.*" {
    send "yes\r"
    exp_continue
  }
  -re "Enter passphrase.*:" {
    if {[info exists env(SSH_PASSPHRASE)]} {
      send "$env(SSH_PASSPHRASE)\r"
    } else {
      send "\r"
    }
    exp_continue
  }
  -re "(?i)password:" {
    if {[info exists env(SSH_PASSWORD)]} {
      send "$env(SSH_PASSWORD)\r"
    } else {
      send "\r"
    }
    exp_continue
  }
  eof {
    catch wait result
    exit [lindex $result 3]
  }
}
EXPECT
}

echo "Copying April 25 article importer to ${DEPLOY_TARGET}..."
run_with_expect "scp '$LOCAL_SCRIPT' '${DEPLOY_TARGET}:${REMOTE_SCRIPT}'"

echo "Running importer inside the Fiscal Wire production container..."
run_with_expect "ssh '${DEPLOY_TARGET}' 'set -e; CONTAINER=\$(docker ps --filter \"name=fiscal\" --format \"{{.Names}}\" | head -1); if [ -z \"\$CONTAINER\" ]; then echo \"No fiscal container found\" >&2; docker ps --format \"{{.Names}}\"; exit 1; fi; docker cp ${REMOTE_SCRIPT} \$CONTAINER:/app/scripts/create_articles_apr25_2026.js; docker exec \$CONTAINER node scripts/create_articles_apr25_2026.js'"

echo "Production article import complete."
