---
title: "Static Discovery and Performance Gates"
description: "A bounded validation experiment for full-text archive discovery and browser-level performance checks without runtime infrastructure."
date: 2026-10-07
tags:
  - Verification
  - Performance
  - Discovery
  - Static Sites
status: published
related:
  - notes:cp22-cp27-engineering-lab-architecture
---

## Question

Can the Lab gain useful archive-wide search and meaningful performance regression protection without a database, analytics service or paid monitoring?

## Setup

The experiment uses Astro build-time content collections, raw entry bodies for search indexing, static HTML controls for filtering, and Playwright in CI for browser-level metrics.

## Result

The approach keeps discovery static and repository-backed while allowing the release workflow to check LCP, CLS, TTFB, runtime external resources, script count and image contracts.

## Limits

These checks are release-time signals, not real-user telemetry. They intentionally do not turn the Lab into an analytics system.
