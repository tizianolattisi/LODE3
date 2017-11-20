#!/usr/bin/env bash

# Run server using forever
# REMEMBER to set env vars before run this script

# To check logs: ./node_modules/forever/bin/forever logs

echo '>>> Start server'
npm run forever:start

echo ''
echo '>>> Use "npm run forever:stop" to stop the server'
