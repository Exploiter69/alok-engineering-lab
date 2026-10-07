---
title: "CP22–CP27: From Portfolio Surface to Engineering Lab"
description: "What changed when the Lab moved from presentation quality toward connected knowledge, project intelligence, discovery and executable maintenance."
date: 2026-10-07
tags:
  - Engineering
  - Architecture
  - Knowledge
  - Maintenance
status: published
stage: evergreen
related:
  - projects:vajra
  - projects:astra
  - projects:astra-userbot
  - projects:vgu-signal
---

## Observation

The Lab's limiting factor after UX hardening was no longer presentation. It was the ability to preserve engineering context as the archive grows.

CP22–CP27 therefore extend the existing static content model instead of introducing a runtime database.

## Architecture

Project records now capture current focus, known problems and future work alongside objective, lifecycle, architecture, decisions and lessons.

The archive has one full-text discovery surface and one relationship surface. Both are generated from Astro content collections and existing related references.

## Maintenance

The repository remains the publishing system. A content scaffold creates correctly shaped drafts, and validation, build, browser and performance checks form the release gate.

## Lesson

A long-lived engineering archive becomes more valuable when its structure explains not only what exists, but why it exists, what remains uncertain and how the pieces connect.
