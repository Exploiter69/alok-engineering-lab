---
title: "Generated Route Audit Coverage"
description: "The Lab's browser audit exercises every generated HTML route at desktop and mobile viewports."
date: 2026-10-07
tags: [Evidence, Benchmark, Browser, Verification]
status: published
kind: benchmark
outcome: confirmed
method: "The repository's visual audit discovers generated HTML routes from dist/ and runs each route at desktop and mobile viewports."
result: "The quality gate is designed to measure route coverage rather than relying on a fixed sample of pages."
limitations:
  - "The audit checks automated structural and browser conditions; it does not replace human visual review."
related: [notes:content-integrity, experiments:static-site-verification]
---

This is a benchmark harness record: its value is the repeatable method and coverage contract. Individual CI runs remain the operational evidence for a particular commit.
