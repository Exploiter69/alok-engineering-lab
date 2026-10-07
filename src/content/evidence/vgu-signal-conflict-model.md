---
title: "VGU Signal — Conflict Is a First-Class Failure Mode"
description: "The VGU Signal trust model explicitly represents conflicting, superseded and stale information instead of silently replacing history."
date: 2026-10-07
tags: [Evidence, Failure, VGU, Verification]
status: published
kind: failure
outcome: informational
method: "Inspect the documented VGU Signal information states and trust model."
result: "The system models changed, superseded, expired, conflicting and removed states so that information failure modes remain visible to downstream delivery."
limitations:
  - "This record documents a designed failure boundary, not a claim that every listed state has occurred in production."
related: [projects:vgu-signal, notes:provenance-makes-memory-useful]
---

A failure record can describe a known failure mode even when the Lab has not yet captured a specific incident. The important boundary is that failure does not disappear from the model.
