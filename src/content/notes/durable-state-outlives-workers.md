---
title: "Durable State Outlives Workers"
description: "Long-lived engineering systems should preserve meaningful state independently of the process currently performing the work."
date: 2026-10-07
tags: [Systems, Reliability, Databases]
status: published
stage: budding
related:
  - projects:vajra
  - projects:astra-userbot
  - projects:teldrive-lab
---

Workers are replaceable. The state they are responsible for should not be.

VAJRA makes runs, steps and evidence durable while treating attempts and workers as disposable. AstraUserbot applies a similar principle through SQLite/WAL, job recovery and supervised background work. TelDrive Lab keeps production storage authoritative while allowing catalogs and indexes to be rebuilt.

The common pattern is not a specific database technology. It is an ownership rule: rebuildable computation should not be the only place meaningful state exists.

When a process dies, the system should be able to determine what happened, what remains valid and what can safely continue.
