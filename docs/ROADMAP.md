# Alok Engineering Lab — Roadmap

> Directional roadmap for the Engineering Lab.
> Roadmap items are not automatically approved for implementation.

## Completed

### v1.0.0 — Foundation

* initial Engineering Lab foundation
* content structure
* detail-page linking
* responsive/mobile improvements
* Git/GitHub release checkpoint
* Vercel deployment foundation

The `v1.0.0` history is preserved and must not be rewritten.

### v1.1 — Website Release Baseline

The project progressed beyond the original v1.1 handoff and established the current website baseline.

### CP0 — UI/UX Audit

**Status: Complete**

Audited:

* hierarchy
* navigation
* responsiveness
* visual consistency
* overall product direction

### CP1 — Design System

**Status: Complete and locked**

Established the current visual foundation:

* modern engineering aesthetic
* restrained technical / hacker character
* typography-led hierarchy
* black canvas
* thin borders and rules
* monospace technical labels
* responsive spacing
* restrained cards
* minimal decorative effects

### CP2 — Information Architecture

**Status: Complete and verified**

Established the primary navigation and supporting information architecture:

* Projects
* Writing
* Notes
* Experiments
* Timeline
* Garden
* Changelog
* Docs
* About

The homepage acts as a curated gateway, while the Garden serves as a discovery layer.

### CP3 — Visual / UX Refinement

**Status: Complete and checkpointed**

Refined:

* homepage hierarchy
* hero presentation
* Currently section
* selected work presentation
* featured ASTRA project treatment
* collection pages
* detail pages
* metadata presentation
* responsive behavior
* mobile layouts
* visual consistency

Desktop and mobile layouts were visually inspected.

The visual direction remains intentionally restrained. Large animation systems, 3D, WebGL, particles and similar effects are not part of the current system.

Latest confirmed local checkpoint:

`b2aaf1d` — `test: add automated quality audit`

---

## Current Phase

### CP4 — Content & Product Depth

**Status: Planned**

The next phase shifts the focus from broad visual refinement toward making the Engineering Lab substantially richer, more useful and more representative of actual engineering work.

Potential areas:

* stronger project case studies
* deeper ASTRA project documentation
* better writing, notes and experiment content
* stronger cross-linking between related content
* useful Timeline / Journey presentation
* better Garden discovery
* stronger content quality standards

### CP4 planning rule

These are **candidate areas**, not approved implementation tasks.

Before coding:

1. inspect the current repository
2. identify the actual problem or opportunity
3. define the specific CP4 scope
4. decide what is intentionally out of scope
5. implement small, reviewable changes
6. verify the result
7. review the visual and functional outcome
8. create a Git checkpoint
9. update the canonical documentation

---

## Longer-Term Ideas

These remain exploratory ideas and are not commitments:

* advanced content search
* richer project case studies
* deeper content relationships
* timeline / changelog integration
* knowledge-graph-like navigation
* analytics
* newsletter
* more engineering experiments
* expanded documentation
* additional discovery mechanisms

A future idea should not be implemented merely because it appears on this roadmap.

---

## Product Direction

Alok Engineering Lab is intended to grow into a long-term personal Engineering Lab / digital garden containing:

* portfolio
* projects
* technical writing
* engineering notes
* experiments
* Linux / rooting work
* AI experiments
* learning journey
* timeline
* changelog
* documentation
* knowledge archive

The site should prioritize:

* useful content
* clarity
* maintainability
* performance
* responsive UX
* meaningful relationships between knowledge
* durable documentation

Visual complexity should serve the product rather than become the product.

---

## Development Principles

The preferred workflow is:

**inspect → implement → verify → review → checkpoint**

Development should remain:

* small and reviewable
* architecture-preserving
* evidence-driven
* documentation-aware
* ₹0 / $0
* free of unnecessary complexity

The repository and current Git state remain stronger sources of truth than this roadmap.

The user remains the final decision-maker for scope and implementation.

---

## Release / Change Rule

For each meaningful phase or release:

1. define scope
2. inspect current code
3. implement
4. run appropriate checks
5. review the diff
6. visually inspect where applicable
7. create a Git checkpoint
8. update `CURRENT_STATE.md`
9. update `AI_HANDOFF.md` when continuation context changes
10. update this roadmap when phase status changes
11. deploy only when appropriate

## CP4.1 — Content + Discovery Foundation
**Status: Planned / Scope Locked**

CP4.1 will combine content depth with a small product-level discovery improvement.

### Goals
* improve the usefulness and depth of Engineering Lab content
* establish practical quality standards for Projects, Writing, Notes, Experiments, and Timeline
* improve discovery using the existing content/relationship architecture
* preserve the current Astro, MDX, and content-collection architecture

### Initial product direction
The first discovery improvement will be selected after reviewing the current rendered experience. Candidate areas include:
* Garden organization
* content metadata presentation
* related-content discovery
* lightweight tag/topic discovery

### Out of Scope
* search infrastructure
* database or CMS
* authentication
* analytics
* newsletter
* external APIs
* major redesign
* framework migration
* changes to the ASTRA repository
* paid services

### CP4.1 Development Rule
No implementation is approved merely because it is listed as a candidate. Each change must first have an identified user/product problem, a defined scope, and a clear verification method.
