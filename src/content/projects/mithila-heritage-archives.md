---
title: "Mithila Heritage Archives"
description: "An evidence-oriented digital archive for Mithila and the Maithili language, built around provenance, structured records and research discovery."
date: 2026-09-05
tags:
  - TypeScript
  - Digital Archives
  - Research
  - Provenance
status: active
repository: "https://github.com/Exploiter69/mithila-heritage-archives"
stack:
  - TypeScript
  - React
  - TanStack Start
  - Structured Data
architectureNodes:
  - "Sources / Evidence"
  - "Canonical Records"
  - "Provenance / Graph"
  - "Research Portal"
objective: "Build a durable public index of Mithila and Maithili cultural material while preserving source identity, uncertainty and editorial provenance."
currentFocus: "Expanding and verifying the archive while keeping catalogue counts, relationships, media rights and evidence states explicit."
knownProblems:
  - "Cultural material is distributed across heterogeneous sources with uneven evidence quality."
  - "Catalogue growth can create false confidence unless provenance and uncertainty remain visible."
futureWork:
  - "Continue expanding the canonical catalogue with evidence-backed records."
  - "Improve research discovery without weakening the archive's provenance model."
lifecycle: "building"
lifecycleSince: 2026-09-05
lifecycleHistory:
  - state: "building"
    date: 2026-09-05
    note: "Lifecycle baseline recorded in the Engineering Lab."
architectureSummary: "A research-oriented archive separates source records, canonical cultural entities, provenance assertions and explicit relationships before exposing them through public discovery and API surfaces."
decisions:
  - "A reachable URL is not treated as proof of a cultural claim."
  - "Uncertainty and disputed material remain explicitly represented instead of being silently converted into fact."
  - "Media rights and cultural claims are tracked separately so external media is not mistaken for owned archive material."
lessons:
  - "Archives become trustworthy when provenance is part of the data model rather than a footnote."
  - "A growing catalogue needs explicit uncertainty states to avoid turning scale into false authority."
  - "Research discovery is stronger when relationships and sources are navigable as first-class records."
---

## Problem

Mithila's cultural record is distributed across books, archives, recordings, community knowledge, institutional collections and living practice. A useful digital archive must make this material easier to navigate without pretending that every claim has the same evidentiary status.

Mithila Heritage Archives approaches the problem as an evidence-oriented catalogue rather than a generic content website.

## Architecture

The archive separates several responsibilities:

- **Sources** identify the material from which claims are derived.
- **Canonical records** represent people, works, language material, places, traditions and other catalogue entities.
- **Provenance assertions** connect claims to evidence and verification state.
- **Relationships** make explicit connections between records.
- **Research and API surfaces** expose the structured archive for readers and machine consumers.

This keeps editorial authority in the repository-backed dataset rather than in presentation code.

## Evidence Model

The archive distinguishes a source existing from a source being reachable, a record citing that source, and a claim being independently verified.

Verification states include verified, community-attested, needs-review and disputed. This makes uncertainty visible instead of hiding it behind polished prose.

## Current Scale

The repository currently describes hundreds of canonical records, source records, provenance assertions and explicit relationships, along with dedicated literature, language, music, art, heritage, people, atlas, timeline and research surfaces.

These counts are catalogue metadata, not a claim that the archive is complete.

## Rights Boundary

Media is treated separately from cultural claims. External recordings remain on their original providers, and Wikimedia material retains its contributor and licence information. The archive does not imply ownership of third-party media.

## Design Lesson

The core engineering problem is **preserving provenance while making a heterogeneous cultural corpus discoverable**. A research archive is more useful when uncertainty survives the journey from source to public interface.
