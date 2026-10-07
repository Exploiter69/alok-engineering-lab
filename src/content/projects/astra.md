---
title: "Astra"
description: "A modular developer QA and automation engine with explicit subsystem boundaries and a compatibility-tested core."
date: 2026-10-06
tags:
  - Python
  - Automation
  - Architecture
status: active
repository: "https://github.com/Exploiter69/astra"
stack:
  - Python
  - Modular Architecture
  - Testing
  - Automation
objective: "Evolve an established automation and QA engine through incremental modularization without losing behavior users already depend on."
lifecycle: "building"
lifecycleSince: 2026-10-06
lifecycleHistory:
  - state: "building"
    date: 2026-10-06
    note: "Lifecycle baseline recorded in the Engineering Lab."
architectureSummary: "A modular Python architecture separates infrastructure from detection, parsing, planning, execution, validation, recovery, automation, models and plugins while retaining a tested legacy behavior anchor."
decisions:
  - "Use replacement behind stable boundaries instead of a full rewrite."
  - "Treat existing tested behavior as migration evidence rather than disposable legacy."
  - "Move one subsystem at a time so architecture changes remain observable and reversible."
lessons:
  - "Good architecture must preserve behavior while it changes."
  - "A compatibility anchor can make large refactors incremental instead of catastrophic."
  - "The safest migration unit is a bounded subsystem with explicit verification."
---

## Problem

A mature automation tool accumulates behavior that users depend on. A large refactor can improve architecture while accidentally breaking that behavior.

Astra 3.5 approaches the problem as an incremental modularization rather than a rewrite.

## Constraints

- Preserve established behavior while improving structure.
- Avoid a destabilizing full rewrite.
- Make infrastructure/domain boundaries explicit.
- Keep future subsystem replacement possible.
- Use the existing tested implementation as evidence, not as disposable legacy.

## Architecture

Infrastructure boundaries include:

'cli.py', 'state.py', 'workspace.py', and 'clipboard.py'.

Replaceable domains include:

'detection/', 'parsing/', 'planning/', 'execution/', 'validation/', 'recovery/', 'automation/', 'models/', and 'plugins/'.

The mature implementation in 'astra/core/legacy.py' remains a compatibility and behavior anchor while these boundaries are migrated incrementally.

## Migration Strategy

The key choice is **replacement behind boundaries**, not “rewrite everything and hope the tests catch it.”

The legacy core provides a stable reference point. New modules can be validated against established behavior and migrated one subsystem at a time.

## Current State

The repository describes **Astra 3.5 — Modular Build**, with the Phase 3.5 architectural refactor established and the legacy behavior anchor intentionally retained.

## Design Lesson

Architecture quality is not only about having clean modules. It is also about being able to change architecture without losing the behavior that made the existing system useful.

## Relationship to VAJRA

Astra and VAJRA are intentionally different projects.

**Astra** studies modular evolution of an automation/QA system.

**VAJRA** studies bounded autonomous engineering with durable state, policy authority and independent verification.

Keeping that distinction explicit prevents the Lab from presenting two related systems as the same project.
