---
title: "VGU Signal"
description: "An independent student-information system that monitors official VGU sources, preserves evidence and delivers verified updates."
date: 2026-10-06
tags:
  - Python
  - Information Systems
  - Verification
  - Telegram
status: active
repository: "https://github.com/Exploiter69/VGU-Signal"
stack:
  - Python
  - Cloudflare Worker
  - D1
  - Telegram
objective: "Reduce the cost of finding trustworthy university information while preserving source authority, evidence, provenance and correction history."
currentFocus: "Production reliability of acquisition, verification and student-facing delivery while preserving official-source authority."
knownProblems:
  - "University information can change, conflict or become stale across multiple official surfaces."
  - "Delivery failures must not weaken the underlying trust model."
futureWork:
  - "Improve production acquisition and delivery reliability."
  - "Continue expanding useful student workflows without introducing a second authority."
lifecycle: "building"
lifecycleSince: 2026-10-06
lifecycleHistory:
  - state: "building"
    date: 2026-10-06
    note: "Lifecycle baseline recorded in the Engineering Lab."
architectureSummary: "A deterministic acquisition and evidence pipeline feeds structured verification and personalization, with Cloudflare Worker/D1 and Telegram providing the delivery/control layer."
architectureNodes:
  - "Official Sources"
  - "Evidence / Extraction"
  - "Verification / Trust"
  - "Telegram / Delivery"
decisions:
  - "Official VGU sources remain authoritative; student reports remain signals rather than authority."
  - "Evidence and provenance are preserved before information is personalized or delivered."
  - "Deterministic acquisition, extraction and verification come before AI-heavy augmentation."
lessons:
  - "Information systems are trust systems before they are notification systems."
  - "Provenance makes corrections and stale information manageable."
  - "Personalization should change delivery, not the authority or meaning of source information."
---

## Problem

University information is fragmented across pages, PDFs, notices, calendars and separate student portals. A useful student tool must reduce that search cost without turning forwarded messages or generated summaries into an authority.

## Constraints

- Official VGU sources remain authoritative.
- Preserve evidence and provenance for published information.
- Handle duplicates, changes, supersession and conflicts explicitly.
- Personalize delivery without changing source truth.
- Keep the operating target at ₹0 / $0.
- Prefer deterministic processing before AI-heavy features.

## Architecture

The information loop is:

**Discover → Fetch → Evidence → Extract → Verify / Deduplicate / Supersede → Personalize → Deliver → Verify again**

The Python side handles acquisition, evidence and structured processing. The Cloudflare Worker/D1 side provides the delivery/control layer, with Telegram as the student-facing channel.

## Trust Model

Information moves through explicit states such as:

'DISCOVERED' → 'FETCHED' → 'PARSED' → 'VERIFIED'

and can later become:

'CHANGED / SUPERSEDED / EXPIRED / CONFLICTING / REMOVED'

Community submissions are useful signals but are never authoritative by themselves.

The important product rule is simple: **the system can make information easier to consume, but it cannot make an unofficial source official.**

## Engineering Direction

The project deliberately builds deterministic source monitoring and evidence handling before leaning on AI. Every useful published fact should retain enough provenance for a student to trace it back to the source.

This also makes corrections and stale information explicit instead of silently replacing history.

## Delivery

Telegram provides practical alert and query workflows for students. The architecture keeps acquisition, trust and delivery concerns separate so that a future delivery surface does not need to redefine source authority.

## Current State

The repository is actively evolving through its implementation roadmap. Its current roadmap, gate records and Git state remain authoritative for exact production status.

## Design Lesson

A student information system is fundamentally a **trust and provenance problem**, not merely a scraping or Telegram-bot problem.
