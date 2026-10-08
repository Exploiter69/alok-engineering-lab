---
title: "VGU Pulse"
description: "A student-facing campus network for VGU that combines trusted information discovery with moderated participation and student coordination."
date: 2026-10-06
tags:
  - TypeScript
  - Telegram
  - Campus Social
  - Product Systems
status: active
repository: "https://github.com/Exploiter69/VGU-Pulse"
stack:
  - TypeScript
  - Cloudflare Worker
  - D1
  - Telegram Mini App
architectureNodes:
  - "Official Signal"
  - "Campus Discovery"
  - "Social Graph"
  - "Telegram / Mini App"
objective: "Build a student operating layer around VGU information without confusing official authority with student-generated participation."
currentFocus: "Production reliability, student-owned social workflows, moderation, community discovery and Telegram Mini App UX."
knownProblems:
  - "Student-generated content needs strong privacy and moderation boundaries."
  - "Official information and community discussion must remain visibly distinct."
futureWork:
  - "Expand community, people and participation workflows while preserving trust boundaries."
  - "Continue polishing the Telegram Mini App as the primary student experience."
lifecycle: "building"
lifecycleSince: 2026-10-06
lifecycleHistory:
  - state: "building"
    date: 2026-10-06
    note: "Lifecycle baseline recorded in the Engineering Lab."
architectureSummary: "A student experience layer consumes trusted VGU Signal information while adding discovery, participation and social coordination through a Telegram-first application surface."
decisions:
  - "VGU Signal remains the authority for official information; Pulse does not duplicate its acquisition and verification pipeline."
  - "Student posts, confessions, polls and discussions remain student-owned signals rather than official announcements."
  - "Privacy and moderation are product boundaries from the foundation, not later add-ons."
lessons:
  - "A campus social product needs an explicit trust boundary between official information and community speech."
  - "The strongest UX is created by separating discovery, participation and identity concerns instead of merging them into one feed."
  - "A Telegram-first surface can reduce infrastructure cost while still supporting a richer student experience."
---

## Problem

Students need more than a notice feed. They need a place to discover campus activity, ask questions, find people, coordinate projects and participate in student culture.

VGU Pulse is designed as that social and participation layer, while VGU Signal remains the trusted official-information engine.

## Architecture

The system separates the trusted information plane from the student experience plane:

**VGU Signal → trusted campus information → Pulse discovery**

Pulse then adds:

- campus discovery and events
- questions and discussions
- polls and ratings
- student profiles and interests
- communities and coordination
- moderated posts, confessions and participation
- Telegram bot and Mini App surfaces

The architecture is intentionally not a replacement for Instagram, WhatsApp, Telegram or VGU ERP.

## Trust Boundary

Official information and student-generated content are different classes of data.

Signal provides verified source-backed information. Pulse can surface that information alongside student activity, but it must not make a community post look official.

This distinction is central to both the data model and the interface.

## Product Direction

The long-term product is a student operating layer rather than a generic social network. Useful campus workflows should come first: discovering notices and events, finding teammates, connecting seniors and juniors, joining branch/batch communities and participating in moderated campus conversations.

## Cost and Architecture

The project is designed around a ₹0 / $0 strategy, with a simple modular architecture rather than a distributed microservice stack. Telegram provides the bot and Mini App surfaces while Cloudflare Worker/D1 provide the application backend.

## Design Lesson

The hard problem is not adding social features. It is **making community participation useful without allowing community speech to inherit official authority**.
