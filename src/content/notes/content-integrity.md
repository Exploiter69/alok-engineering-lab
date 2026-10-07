---
title: "Content Integrity Is Part of the Architecture"
description: "A connected knowledge archive is only as trustworthy as the relationships connecting its entries."
date: 2026-10-07
tags: [Content, Architecture, Verification]
status: active
stage: evergreen
related:
  - experiments:static-site-verification
  - notes:verification-is-a-boundary
---

A digital garden depends on connections between pieces of knowledge.

If a project points to a note that no longer exists, the failure is not merely cosmetic. The archive has lost part of its structure.

That makes content relationships an architectural concern.

The Lab now treats relationship targets as build-time data integrity requirements. A misspelled, missing or self-referential `collection:entry-id` reference should stop verification rather than silently disappear.

The principle is simple:

**connected knowledge should fail loudly when its connections become invalid.**
