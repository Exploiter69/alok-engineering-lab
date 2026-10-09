---
title: "TelDrive Lab"
description: "A zero-cost, safety-first engineering control plane around an existing TelDrive deployment."
date: 2026-10-06
tags:
  - Python
  - Storage
  - Automation
  - Systems
status: active
repository: "https://github.com/Exploiter69/teldrive-lab"
stack:
  - Python
  - PostgreSQL
  - rclone
  - Local Storage
objective: "Add cataloging, planning, verification and controlled maintenance around an existing TelDrive deployment without becoming a second storage authority."
currentFocus: "Cataloging, search, analytics, verification and controlled maintenance around the production TelDrive authority."
knownProblems:
  - "The surrounding corpus is large enough that derived indexes must remain rebuildable and trustworthy."
  - "Mutation paths require stronger controls than read-only observation."
futureWork:
  - "Expand safe reporting and restore planning."
  - "Keep consequential mutation behind authorization, execution and verification evidence."
lifecycle: "maintaining"
lifecycleSince: 2026-10-06
lifecycleHistory:
  - state: "maintaining"
    date: 2026-10-06
    note: "Lifecycle baseline recorded in the Engineering Lab."
architectureSummary: "A local control plane derives catalogs, search, analytics and plans from the production storage while consequential mutation stays behind explicit authorization and verification boundaries."
architectureNodes:
  - "Production Storage"
  - "Catalog / Search"
  - "Control / Planning"
  - "Verify / Audit"
decisions:
  - "TelDrive remains the production storage authority."
  - "Derived indexes and catalogs are disposable views rather than canonical data stores."
  - "Consequential mutation requires explicit policy, controlled execution and evidence recording."
lessons:
  - "Control planes should observe before they mutate."
  - "Derived intelligence is safer when the production system remains authoritative."
  - "A sidecar can add operational capability without duplicating the responsibility of the system it surrounds."
---

## Problem

An existing TelDrive deployment can accumulate a large corpus of Telegram-backed storage without having a safe engineering layer for cataloging, planning, verification and controlled maintenance.

The goal is not to replace TelDrive. It is to make the surrounding system easier to understand and operate without weakening the production boundary.

## Constraints

- TelDrive remains the production storage authority.
- Existing Telegram data must not be migrated or re-uploaded.
- Existing rclone mounts and services remain protected.
- Sidecars must be disposable and rebuildable.
- Prefer read-only consumers.
- No cloud AI, speech-to-text provider or local LLM is required for normal operation.
- ₹0 / $0 infrastructure and resource-conscious operation.

## Architecture

The safety lifecycle is:

**Observe → understand → plan → authorize → controlled execution → verify → record evidence**

TelDrive Lab sits beside the production system as a control plane. Catalogs, search indexes, analytics and planning are derived views; the underlying production storage remains authoritative.

## Current Capabilities

The repository currently covers authoritative corpus discovery and local cataloging, unified search, media catalog and Jellyfin integration, durable jobs and recovery, storage/cache intelligence, read-only metadata/API interoperability, OCR and document fingerprints, deterministic local embeddings, storage analytics, snapshots and manifests, restore planning, report-only CAS/deduplication primitives and a loopback-only read-only Control Center.

## Safety Model

Consequential mutation is intentionally harder than observation. Read-only paths are preferred, while writes require explicit policy/authorization and controlled execution followed by verification and evidence recording.

That makes the Lab a safety-oriented sidecar rather than a second storage authority.

## Current State

The project remains an active engineering system around an existing TelDrive deployment. The repository's current architecture, roadmap and release checklist are authoritative for exact capability and operational status.

## Design Lesson

The interesting problem is not building another storage service. It is adding intelligence and control **around** an existing production boundary without silently taking ownership of the data.
