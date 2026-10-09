---
title: "DuePilot"
description: "An India-first, local-first receivables decision engine that turns invoice data into a transparent action queue."
date: 2026-09-13
tags:
  - JavaScript
  - Fintech
  - Decision Systems
  - Data Quality
status: archived
repository: "https://github.com/Exploiter69/receivables-action-analyzer"
stack:
  - JavaScript
  - CSV
  - Deterministic Rules
  - GitHub Actions
architectureNodes:
  - "Invoice CSV"
  - "Data Quality Gate"
  - "Priority Engine"
  - "Action Queue"
objective: "Turn raw MSME receivables into a transparent next-action queue without replacing accounting, financing, legal or payment systems."
currentFocus: "Archived MVP; preserve the deterministic decision-engine pattern and explicit product boundaries if the concept is revisited."
knownProblems:
  - "Receivables decisions depend heavily on incomplete or inconsistent invoice evidence."
  - "Priority scores are useful only when operators can inspect the signals behind them."
futureWork:
  - "Validate recommendations against representative operator decisions before adding integrations or AI."
  - "Keep financing and recovery outputs as reviewable candidates rather than automated actions."
lifecycle: "archived"
lifecycleSince: 2026-09-13
lifecycleHistory:
  - state: "archived"
    date: 2026-09-13
    note: "MVP project recorded and later archived as a bounded decision-engine experiment."
architectureSummary: "A local CSV workflow validates receivable records, derives evidence and collection signals, scores priority deterministically and presents a reviewable action queue."
decisions:
  - "Data-quality failures are separated from financial totals and downstream recommendations."
  - "Priority scoring must expose understandable signals rather than hide decisions behind opaque automation."
  - "The system prepares operator actions but does not execute financing, legal recovery or payment workflows."
lessons:
  - "Decision systems are easier to trust when bad input is a first-class state."
  - "A useful MVP can stop at recommendation rather than pretending to automate the whole business process."
  - "Transparent rules provide a strong baseline for later experimentation with more advanced models."
---

## Problem

Small businesses can know that invoices are overdue without having a clear answer to what should happen next. Raw invoice exports also contain missing dates, duplicate records and incomplete evidence that can make naive prioritization misleading.

DuePilot explores a narrow decision layer between receivables data and operator action.

## Architecture

The MVP takes a CSV export through a deterministic pipeline:

**Invoice CSV → data-quality gate → evidence and risk signals → priority engine → action queue**

The action queue supports review-oriented Start / Done workflows and invoice-level drill-down.

## Decision Model

The engine groups possible next actions into a practical sequence:

**Monitor → Chase → Finance → Fix Evidence → Escalate → Prepare Recovery**

The scoring is intentionally transparent. Operators can inspect the invoice amount, due state, buyer information, evidence completeness and dispute-related signals behind a recommendation.

## Product Boundary

DuePilot does not replace accounting software, TReDS platforms, legal recovery, ODR or payment rails. Financing and recovery outputs are candidates for operator review, not financial, legal or accounting advice.

## Data Quality

Missing, invalid and duplicate records are handled explicitly. Rows with data issues are excluded from financial totals so a malformed import does not quietly distort the dashboard.

## Design Lesson

A decision engine does not need to automate the final action to be useful. A **transparent, reviewable next-action queue** can provide value while keeping consequential decisions with the operator.
