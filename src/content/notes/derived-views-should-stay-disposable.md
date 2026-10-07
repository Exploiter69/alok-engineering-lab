---
title: "Derived Views Should Stay Disposable"
description: "Indexes, catalogs and summaries are useful precisely because they can be rebuilt from authoritative state."
date: "2026-10-07"
tags: [Databases, Systems, Architecture]
status: published
stage: budding
related:
  - projects:teldrive-lab
  - projects:vgu-signal
  - notes:provenance-makes-memory-useful
---

A derived view becomes dangerous when the system quietly starts treating it as the source of truth.

TelDrive Lab keeps catalogs, search indexes and analytics rebuildable around an authoritative storage system. VGU Signal preserves evidence and source provenance so structured information can be corrected or superseded without pretending the derived record is the original source.

The goal is not to avoid derived data. It is to make its authority explicit.

If a view can be deleted and reconstructed without losing truth, its operational role is easier to understand and its failure mode is smaller.
