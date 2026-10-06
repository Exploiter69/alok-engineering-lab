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
---

## The Problem

An existing TelDrive deployment can accumulate a large amount of storage and metadata without having a safe engineering layer for cataloging, planning, verification and controlled maintenance.

TelDrive Lab adds that control plane without taking ownership away from the production storage system.

## Boundary

TelDrive remains the production storage authority.

The Lab is a sidecar that observes, catalogs, searches, plans and performs explicitly authorized operations while protecting existing Telegram-backed storage, rclone mounts and services.

## Safety Model

**Observe → understand → plan → authorize → controlled execution → verify → record evidence**

Read-only consumers are preferred. Consequential mutation is bounded by explicit policy and authorization.

The repository intentionally does not require cloud AI, a speech-to-text provider or a local LLM runtime for normal operation.

## Current Capabilities

The current product includes corpus discovery and local cataloging, unified search, media cataloging, durable jobs and recovery, storage/cache intelligence, OCR and document fingerprints, deterministic local embeddings, storage analytics, manifests, verification and restore planning, report-only deduplication primitives and a loopback-only read-only Control Center.

## Constraints

The project is designed for **₹0 / $0 infrastructure** and resource-conscious operation.

The existing TelDrive deployment and its data remain protected rather than being migrated into a new system.

## Lessons

The interesting engineering problem is not replacing TelDrive. It is building useful intelligence around an existing production boundary without making that boundary fragile.
