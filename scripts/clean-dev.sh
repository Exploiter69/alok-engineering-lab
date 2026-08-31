#!/usr/bin/env bash

echo "Cleaning Astro..."

npx astro dev stop 2>/dev/null || true

lsof -ti:4321 | xargs -r kill -9

echo "Clean complete"
