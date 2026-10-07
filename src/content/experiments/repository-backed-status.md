---
title: "Repository-Backed Project Status"
description: "A small experiment in making project activity visible without adding a live status service."
date: 2026-10-07
tags:
  - Architecture
  - Content Model
  - Static Sites
  - Verification
status: published
related:
  - projects:vgu-signal
  - projects:astra-userbot
  - notes:project-status-is-part-of-the-archive
---

## Question

Can an Engineering Lab make its current project activity easier to understand without adding a database, API, polling or client-side state?

## Hypothesis

Yes. The content model already has a project status field. Rendering that field on project surfaces should provide a useful current-state signal while keeping the repository as the source of truth.

## Change

Expose project status in the project archive and project detail view.

The site remains a static build:

**repository content → Astro build → generated HTML**

There is no runtime status service.

## Boundary

This is intentionally **documented status**, not live health.

A project marked active means the archive currently records it as active. It does not mean its deployment, bot, API or worker is healthy at the exact moment a visitor loads the page.

That distinction avoids a false promise while still giving readers useful context.

## Result

The experiment favors a small existing capability over a new system.

No database, API, authentication, analytics or background process is required.

## Lesson

When a product already contains trustworthy metadata, the first question should be whether the interface actually exposes it before adding infrastructure to compute more state.
