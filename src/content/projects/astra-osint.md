---
title: "Astra OSINT"
description: "A local entity-search workbench that federates structured datasets through DuckDB and exposes bounded search and administration APIs."
date: 2026-09-06
tags:
  - Python
  - OSINT
  - DuckDB
  - Search
status: archived
repository: "https://github.com/Exploiter69/astra-osint"
stack:
  - Python
  - FastAPI
  - DuckDB
  - Parquet
architectureNodes:
  - "Dataset Sources"
  - "DuckDB Federation"
  - "Entity Search"
  - "Admin / Results"
objective: "Explore a practical local workbench for searching structured intelligence datasets while keeping remote data access bounded and failure-tolerant."
currentFocus: "Repository is an archived experiment; its useful lessons are dataset federation, bounded remote queries and predictable API failure handling."
knownProblems:
  - "Remote dataset schemas can vary enough to cause type-conversion failures during search."
  - "Unreachable remote datasets must not stall the local search experience."
futureWork:
  - "If revived, formalize dataset contracts and add stronger source/provenance metadata."
  - "Keep remote federation optional so local search remains useful when sources are unavailable."
lifecycle: "archived"
lifecycleSince: 2026-09-06
lifecycleHistory:
  - state: "archived"
    date: 2026-09-06
    note: "Archived experiment recorded in the Engineering Lab."
architectureSummary: "A FastAPI workbench federates structured datasets through DuckDB, normalizes heterogeneous fields for search and keeps remote failures isolated from the local API."
decisions:
  - "Keep DuckDB work synchronous inside isolated worker functions rather than sharing cursor state across async boundaries."
  - "Use parameterized predicates and TRY_CAST for heterogeneous remote dataset schemas."
  - "Treat remote datasets as optional inputs and return bounded failure results instead of hanging the API."
lessons:
  - "Data federation needs a failure boundary as much as an access layer."
  - "Heterogeneous datasets should be normalized at the query boundary instead of trusting remote types."
  - "A small search workbench becomes more useful when API error behavior is as predictable as successful results."
---

## Problem

OSINT-style search systems often combine datasets that were not designed to share one schema. A field can be numeric in one source and textual in another, while remote files can disappear or become slow without warning.

Astra OSINT explored a compact local workbench for making that kind of dataset search usable without turning every query into a fragile dependency on remote infrastructure.

## Architecture

The application uses FastAPI for the HTTP boundary and DuckDB for local and federated analytical queries. Dataset management and search sit behind the API, with a small administrative surface for dataset state.

The important flow is:

**Dataset sources → DuckDB federation → normalized entity search → API/admin results**

Remote Parquet-backed datasets are treated as data inputs rather than trusted application state.

## Reliability Work

The repository's audit work addressed several concrete failure modes:

- DuckDB work was moved into synchronous helper functions executed through `asyncio.to_thread`.
- Dynamic filters use parameterized bindings.
- Heterogeneous columns are converted with `TRY_CAST(... AS VARCHAR)` before text search.
- Remote queries have a short timeout and degrade to an empty result rather than blocking indefinitely.
- In-memory DuckDB views use a shared connection where required so startup-created views remain visible to request handlers.
- FastAPI exception handling returns structured JSON envelopes instead of HTML tracebacks.

## Current State

The repository is small and archived rather than presented as a production intelligence platform. Its value in the Lab is the engineering lesson around **bounded data federation and predictable failure behavior**.

## Design Lesson

The interesting part is not the search box. It is the boundary between local control and unreliable external data: remote sources should enrich a system without becoming capable of freezing or corrupting the local experience.
