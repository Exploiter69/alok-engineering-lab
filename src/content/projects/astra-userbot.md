---
title: "AstraUserbot"
description: "A reliability-focused Telegram userbot platform built as a single-process Python/asyncio modular monolith."
date: 2026-10-06
tags:
  - Python
  - Telegram
  - Automation
  - Reliability
status: active
repository: "https://github.com/Exploiter69/astraUserbot"
stack:
  - Python
  - asyncio
  - Telethon
  - SQLite/WAL
objective: "Harden a long-lived Telegram automation platform so feature growth does not reduce reliability, ownership clarity or recoverability."
currentFocus: "Reliability hardening across plugin lifecycle, supervised background work, durable jobs, storage recovery, media boundaries and release acceptance."
knownProblems:
  - "Large plugin surfaces increase lifecycle and ownership risk."
  - "Legacy AI modules remain intentionally quarantined while compatibility is preserved."
futureWork:
  - "Continue release acceptance hardening."
  - "Keep plugin ownership, recovery and storage boundaries explicit as features grow."
lifecycle: "building"
lifecycleSince: 2026-10-06
lifecycleHistory:
  - state: "building"
    date: 2026-10-06
    note: "Lifecycle baseline recorded in the Engineering Lab."
architectureSummary: "Single-process Python/asyncio modular monolith with Telethon at the edge, ApplicationContext and supervised services around a SQLite/WAL source of truth."
architectureNodes:
  - "Telegram / Telethon"
  - "Application Core"
  - "Jobs / Plugins"
  - "SQLite / Services"
decisions:
  - "Keep durable state in SQLite/WAL instead of introducing a distributed data layer."
  - "Keep plugin and background-work ownership explicit through shared lifecycle and supervision boundaries."
  - "Keep AI advisory and replaceable rather than allowing it to become an execution authority."
lessons:
  - "Reliability work is platform work: lifecycle, recovery and ownership matter as much as command features."
  - "A modular monolith can remain extensible when shared infrastructure has explicit ownership contracts."
  - "Quarantining legacy behavior is safer than silently deleting compatibility history."
---

## Problem

A large Telegram userbot can accumulate dozens of commands while becoming harder to operate safely: plugin lifecycle, background jobs, media processing, storage and AI integrations all compete for ownership.

AstraUserbot treats reliability as the platform problem rather than adding another framework rewrite.

## Constraints

- Keep a single-process Python/asyncio modular monolith.
- Keep Telegram/Telethon at the edge.
- Keep SQLite/WAL as the durable source of truth.
- Avoid Redis, Kafka, Celery, Kubernetes, microservices and paid infrastructure.
- AI remains advisory and replaceable rather than authoritative.

## Architecture

The platform core owns shared infrastructure while plugins remain the feature edge.

Key boundaries include **ApplicationContext**, supervised tasks/services, **JobEngine**, storage, cache, HTTP/subprocess/media infrastructure, search and optional AI providers.

The design favors explicit lifecycle and ownership contracts over a distributed architecture.

## Reliability Work

The current engineering focus includes deterministic plugin lifecycle and command ownership, supervised background work, durable job leases and recovery, bounded shutdown behavior, SQLite integrity plus backup/restore verification, bounded media workspaces, FTS5 search, secret-safe diagnostics and explicit isolation boundaries.

This is the work that makes a userbot predictable after restarts, failures and future plugin growth.

## Current State

The repository currently describes release candidate **1.0.1**, with **56 active plugins** and **4 intentionally quarantined legacy AI modules**.

The quarantined modules are kept as an explicit compatibility/history boundary rather than being silently deleted.

## Verification

A non-destructive release acceptance gate is supported by focused checks for plugin behavior, plugin ecosystem contracts, media pipelines, isolation/security, storage hardening, jobs and shutdown behavior.

## Design Lesson

The useful metric is not only how many commands the bot has. The deeper engineering value is whether the platform can keep those commands predictable under restart, resource pressure, plugin change and partial failure.

## Why It Belongs Here

AstraUserbot demonstrates a different side of engineering from VAJRA: instead of designing a new autonomous runtime, it hardens a long-lived application around clear ownership, durability and operational boundaries.
