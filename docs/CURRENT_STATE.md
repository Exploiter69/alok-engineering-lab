# Alok Engineering Lab — Current State

> Snapshot of the current confirmed project state.

## Project

Alok Engineering Lab is a long-term personal Engineering Lab / digital garden rather than a conventional portfolio.

## Stack

- Astro
- Tailwind CSS
- MDX / Astro content collections
- TypeScript
- Git / GitHub
- Vercel
- Namecheap custom domain

## Current release state

The project is currently in active development after the `v1.1` website release baseline.

The stable `v1.0.0` history remains preserved and must not be rewritten.

## Current Git state

Local `master` is ahead of `origin/master`.

Latest confirmed local checkpoint:

`06e003c` — `feat: refine CP3 collection and detail pages`

Working tree was clean at the CP3 checkpoint.

## Completed phases

### CP0 — UI/UX Audit

**Status:** Complete.

The original website was audited for hierarchy, navigation, responsiveness, visual consistency and overall product direction.

### CP1 — Design System

**Status:** Complete and locked.

Established the visual foundation:

- modern engineering aesthetic
- restrained technical / hacker character
- typography-led hierarchy
- black canvas
- thin borders and rules
- monospace technical labels
- responsive spacing
- restrained cards
- minimal decorative effects

### CP2 — Information Architecture

**Status:** Complete and verified.

Primary navigation:

- Projects
- Writing
- Notes
- Experiments
- Timeline

Secondary / supporting areas:

- Garden
- Changelog
- Docs
- About

The homepage acts as a curated gateway rather than another content archive.

Content is designed to form a connected engineering knowledge system.

### CP3 — Visual / UX Refinement

**Status:** Complete and checkpointed.

CP3 refined:

- homepage hierarchy
- hero presentation
- Currently section
- selected work presentation
- featured ASTRA project treatment
- collection pages
- detail pages
- metadata presentation
- responsive behavior
- mobile layouts
- visual consistency

Verified desktop and mobile layouts using browser responsive tooling.

The current visual direction is intentionally restrained. No unnecessary 3D, WebGL, particle systems or decorative effects have been introduced.

## Current content architecture

The site currently contains / supports:

- Home
- Projects
- Writing
- Notes
- Experiments
- Timeline
- Garden
- Changelog
- Docs
- About

Projects, writing, notes, experiments and other knowledge areas can reference related content.

## Deployment

Production deployment uses Vercel.

Custom domain:

`alokthakur.me`

DNS is managed through Namecheap.

Do not randomly modify DNS records or nameservers.

## Current priority

The next development phase should focus on **content and product depth**, rather than another broad visual redesign.

Proposed next phase:

**CP4 — Content & Product Depth**

Potential scope:

- strengthen project case studies
- improve ASTRA project documentation
- improve writing / notes / experiment content
- strengthen cross-linking
- make Timeline / Journey useful
- improve Garden discovery
- establish stronger content quality standards

These items require explicit implementation decisions before coding.

## Verification baseline

CP3 checkpoints were verified with:

- `npm run build`
- `git diff --check`
- desktop visual inspection
- mobile responsive inspection

Build completed successfully with Astro check reporting no errors, warnings or hints.

## Development rules

- Inspect before modifying.
- Prefer small, reviewable changes.
- Preserve the Astro architecture.
- Do not rewrite `v1.0.0`.
- Run appropriate checks after changes.
- Use Git checkpoints.
- Keep the project at ₹0 / $0.
- Treat the repository and Git state as the strongest source of truth.
