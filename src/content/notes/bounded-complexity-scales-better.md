---
title: "Bounded Complexity Scales Better"
description: "A system can grow substantially without becoming unbounded when each new capability enters through explicit ownership and failure boundaries."
date: 2026-10-07
tags: [Architecture, Systems, Python]
status: published
stage: budding
related:
  - projects:astra-userbot
  - projects:astra
  - writing:why-small-systems-win
  - notes:complexity-budget
---

Complexity is not the same thing as feature count.

AstraUserbot can grow through plugins because lifecycle and infrastructure ownership are explicit. Astra can change architecture because migration is divided into bounded subsystems. Both avoid making every feature a new distributed service.

A useful growth rule is: new capability should introduce a new boundary only when the existing boundary cannot express its ownership safely.

This keeps complexity proportional to real requirements instead of architectural fashion.
