---
title: "Static Garden Discovery"
description: "A zero-cost experiment in making a growing knowledge archive easier to search without introducing a database or external search service."
date: 2026-10-07
tags:
  - Knowledge
  - Static Sites
  - UX
  - JavaScript
  - Maintainability
status: published
related:
  - notes:repository-is-the-memory
  - notes:derived-views-should-stay-disposable
  - projects:vajra
---

## Question

Can a growing static knowledge archive become easier to explore without adding a search backend?

## Hypothesis

Yes. The Garden already contains the complete set of published notes, writing and experiments at build time. A small client-side filter can search the generated index without changing the architecture.

## Boundary

The search is a **discovery aid**, not a new source of truth.

The repository remains authoritative. Astro still generates the archive. The browser only filters content that is already present on the page.

There is no database, API, account system, analytics service or paid search provider.

## Result

A lightweight search interaction can improve discovery while remaining disposable. If the interaction is removed later, the underlying archive and direct links remain unchanged.

## Lesson

When a static site needs a small amount of interactivity, start by asking whether the build already has all the data required for the interaction. If it does, a local derived view may be enough.
