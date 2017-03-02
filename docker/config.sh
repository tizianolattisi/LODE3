#!/usr/bin/env bash

echo '>>> Install NPM Dependencies'
npm install --only=dev
npm install gulp -g
echo '>>> Build'
gulp build
