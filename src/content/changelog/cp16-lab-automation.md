---
title: "CP16 — Lab Automation"
description: "Metadata, relationship, lifecycle and writing checks now run as explicit repository validation gates."
date: 2026-10-07
tags: [Release, CP16, Automation, Maintenance]
status: published
related: [notes:content-integrity]
---

CP16 turns the Lab's maintenance rules into executable zero-cost checks.

The production build now runs repository validation before Astro diagnostics, while GitHub Actions runs the same validation explicitly before the build and browser audit.
