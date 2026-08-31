#!/usr/bin/env bash

PROJECT="$(pwd)"

echo "🧹 Cleaning Alok Engineering Lab dev servers..."

# Stop Astro processes running from this project only
pkill -f "$PROJECT/node_modules/.bin/astro dev" 2>/dev/null || true

# Free port 4321 if still occupied
lsof -ti :4321 | xargs -r kill -9

sleep 1

echo "🚀 Starting Alok Engineering Lab..."

npm run dev
