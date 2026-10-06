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
---

## The Problem

A feature-rich Telegram userbot becomes difficult to maintain when plugins own too much infrastructure and background work is treated as disposable.

AstraUserbot focuses on turning that kind of system into a more reliable platform without replacing the existing architecture with a framework rewrite.

## Architecture

The system remains a **single-process Python/asyncio modular monolith**.

Telegram is the transport layer. Shared infrastructure is owned by the platform core while plugins remain the feature edge.

The central flow is built around an ApplicationContext, plugins, a durable JobEngine, supervised tasks and services for storage, cache, HTTP, subprocesses, media, AI, search and operations.

SQLite/WAL is the default durable store.

## Reliability Work

The repository emphasizes deterministic plugin lifecycle and command ownership, bounded shutdown, durable job leases and recovery, SQLite integrity and backup/restore verification, bounded media workspaces, FTS5 search, secret-safe diagnostics and explicit isolation boundaries.

AI providers remain replaceable and AI output is not treated as authority.

## Current State

The repository currently describes release candidate **1.0.1**, with **56 active plugins** and **4 intentionally quarantined legacy AI modules**.

## Verification

A dedicated non-destructive release acceptance gate and focused checks cover production hardening, plugin behavior, ecosystem contracts, media pipelines, isolation, storage, jobs and shutdown behavior.

## Lessons

The valuable work is not only the number of commands a userbot exposes. It is the infrastructure that makes those commands predictable under restart, failure, resource limits and future change.
