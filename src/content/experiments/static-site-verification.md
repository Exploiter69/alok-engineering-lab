---
title: "Static Site Verification Loop"
description: "Testing a lightweight verification loop for content-driven Astro changes."
date: 2026-10-06
tags: [Experiment, Astro, Testing]
status: active
related: [projects:astra, experiments:first-experiment, notes:verification-is-a-boundary]
---

## Question

What is the smallest verification loop that gives useful confidence after changing a static content-driven site?

## Setup

Use layered checks:

1. type/content diagnostics
2. static production build
3. browser route checks
4. responsive checks
5. Git checkpoint

## Observation

Each layer catches a different class of failure.

The build catches generation problems. Browser checks catch rendered behavior. Responsive checks catch viewport-specific problems. Git preserves a known checkpoint.

## Result

A small layered loop provides better signal than relying on a single "build passed" result.

## Lesson

Verification should match the failure modes of the system.
