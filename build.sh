#!/usr/bin/env bash

# Prepare files and run build for production

echo '>>> Install NPM'
npm install

echo '>>> Build server'
npm run server:build:prod

echo '>>> Build client'
npm run client:build:prod
