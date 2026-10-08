---
title: "DuePilot"
description: "An India-first, local-first receivables action engine that turns unpaid invoices into a transparent prioritized action queue."
date: 2026-10-08
tags:
  - TypeScript
  - Fintech
  - Decision Systems
  - Data Quality
status: active
repository: "https://github.com/Exploiter69/receivables-action-analyzer"
stack:
  - Node.js
  - TypeScript
  - Static Web
  - GitHub Actions
objective: "Turn MSME receivables data into transparent next actions without replacing accounting, financing, legal or payment systems."
currentFocus: "Deterministic data quality, evidence completeness, transparent prioritization and operator-controlled action workflows."
knownProblems:
  - "Recommendations must remain explainable when invoice data is incomplete or contradictory."
  - "Financing and recovery decisions require operator review rather than automated external action."
futureWork:
  - "Validate recommendations against representative real-world operator decisions."
  - "Add integrations only after the deterministic decision layer is proven useful."
lifecycle: "building"
lifecycleSince: 2026-10-08
lifecycleHistory:
  - state: "building"
    date: 2026-10-08
    note: "Project record added from the current MVP repository."
architectureSummary: "A deterministic CSV pipeline validates receivables, evaluates evidence and dispute signals, computes transparent priorities and presents an operator-controlled action queue."
architectureNodes:
  - "CSV / Invoices"
  - "Quality / Evidence"
  - "Priority Engine"
  - "Action Queue"
decisions:
  - "Data-quality failures are separated from financial totals rather than silently included."
  - "Priority scoring remains transparent instead of becoming an opaque model output."
  - "Financing and recovery outputs are candidates for operator review, not automated external actions."
lessons:
  - "Decision systems are safer when bad input is visible before prioritization."
  - "A useful action engine can start deterministic before adding AI or external integrations."
  - "The decision layer should complement existing financial systems rather than pretending to replace them."
---

## Problem

Unpaid invoices create an operational question: **what should happen next?**

DuePilot turns receivables into an action queue instead of attempting to become a replacement accounting system, financing platform, legal service or payment rail.

## Decision Flow

Every invoice is assigned a potential next action:

**Monitor → Chase → Finance → Fix Evidence → Escalate → Prepare Recovery**

The MVP combines CSV import, deterministic parsing, data-quality checks, evidence completeness, dispute signals, financing-candidate detection, collection/recovery state and transparent priority scoring.

## Data Safety

Missing, invalid and duplicate records are surfaced by a data-quality gate. Financial totals exclude data-issue rows rather than quietly incorporating questionable data.

The action queue uses explicit Start/Done workflows and invoice detail views so an operator can inspect why an item was prioritized.

## Constraints

- Local-first operation.
- ₹0 / $0 infrastructure target.
- No paid APIs or runtime services.
- No automated external financing, legal or payment action.
- Node regression tests and GitHub Actions provide the initial verification boundary.

## Design Lesson

The interesting engineering problem is not predicting who will pay. It is building a **transparent decision layer over imperfect receivables data** and making every recommendation inspectable before a human acts on it.
