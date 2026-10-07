---
title: "Project Status Is Part of the Archive"
description: "A project archive is more useful when it distinguishes durable history from the work that is active now."
date: 2026-10-07
tags:
  - Projects
  - Documentation
  - Maintenance
  - Evidence
status: published
stage: evergreen
related:
  - projects:vgu-signal
  - projects:astra-userbot
  - experiments:repository-backed-status
---

A project page should answer two different questions:

1. What is this system?
2. Where is the system now?

The first question belongs to durable architecture documentation. The second is a moving snapshot.

That distinction matters because an Engineering Lab is not a museum. Active systems change faster than their long-form case studies. If a repository-backed project is marked active, that state should be visible to a reader rather than remaining hidden in front matter.

The status still should not pretend to be a live deployment monitor. A static archive can state the last documented state, link to the authoritative repository, and make the boundary explicit.

This gives the Lab a useful rule:

**Documented status is evidence about the archive, not a claim of live operational truth.**

That keeps the site honest while still making the engineering journey easier to follow.

## Practical consequence

Project metadata should carry durable signals such as:

- whether work is active, published or archived
- when the current snapshot was documented
- where the implementation lives
- which related notes or experiments explain the engineering decisions

The website can then expose those signals without introducing a database, polling system or analytics service.

That is enough for a long-lived personal Engineering Lab: simple data, visible state, and a clear boundary between documentation and live operations.
