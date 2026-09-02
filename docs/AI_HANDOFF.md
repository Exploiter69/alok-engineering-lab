# Alok Engineering Lab — AI Handoff

> Start here when a new AI chat/session needs to continue the project.

## Current project

Alok Engineering Lab is a long-term personal Engineering Lab / digital garden, not merely a portfolio.

## Current stack

- Astro
- Tailwind CSS
- MDX / Astro content collections
- TypeScript
- Git / GitHub
- Vercel
- Namecheap custom domain: `alokthakur.me`

## Source of truth

When information conflicts, use this order:

1. Actual current repository
2. Current Git state
3. Explicit current user decisions
4. Canonical `docs/` files
5. Recent project conversations
6. Older conversations

Always inspect the repository before making engineering changes.

## Stable baseline

`v1.0.0` is the preserved stable foundation.

Release commit:

`b0c61f8` — `feat: make v1 responsive`

Do not rewrite the `v1.0.0` history.

## Current state

The project has progressed beyond the original v1.1 handoff.

Completed development phases:

- CP0 — UI/UX Audit
- CP1 — Design System
- CP2 — Information Architecture
- CP3 — Visual / UX Refinement

Latest confirmed local checkpoint:

`b1d1e84` — `content: deepen ASTRA project case study`

Local `master` is ahead of `origin/master`.

The current CP4.1 checkpoint has a clean working tree.

## CP3 outcome

The current website has a cohesive modern engineering visual system based on:

- black canvas
- strong typography
- restrained borders and rules
- monospace technical labels
- editorial spacing
- responsive layouts
- restrained content cards
- minimal decorative effects

The homepage now provides a clearer Engineering Lab identity and hierarchy.

Collection and detail pages have also been refined for consistency and responsive behavior.

Desktop and mobile layouts were visually inspected.

The automated quality audit now verifies 15 routes at desktop and 15 routes at mobile size, with 30/30 cases passing and zero warnings or failures.

## Current information architecture

Primary navigation:

- Projects
- Writing
- Notes
- Experiments
- Timeline

Supporting areas:

- Garden
- Changelog
- Docs
- About

The homepage is a curated gateway.

The Garden is intended as a discovery layer rather than simply another collection.

Content should remain interconnected where useful.

## Current development philosophy

The project is being developed using a fast but disciplined workflow:

**inspect → implement → verify → review → checkpoint**

Do not create unnecessary planning overhead.

Prefer small, high-impact, reviewable changes.

Do not blindly follow AI suggestions.

The user remains the final decision-maker.

## Current phase

The project is actively progressing through:

**CP4 — Content & Product Depth**

The current completed CP4.1 foundation combines content depth with lightweight discovery improvements.

The focus should shift from broad visual refinement toward making the Engineering Lab substantially richer and more useful.

Possible CP4 areas include:

- stronger project case studies
- deeper ASTRA project documentation
- better writing / notes / experiment content
- stronger cross-linking
- useful Timeline / Journey presentation
- better Garden discovery
- stronger content quality standards

CP4.1 has established the initial content and discovery foundation. Further CP4 work still requires an identified product problem, explicit scope, verification method, and Git checkpoint before implementation.

## Visual direction

Preserve the current restrained engineering aesthetic.

Do not add visual technology merely because it is technically impressive.

3D, WebGL, particles, large animation systems and similar effects should only be introduced if they provide a clear UX or product benefit.

## Financial constraint

The entire project must remain:

**₹0 / $0**

Do not recommend or enable:

- paid APIs
- pay-as-you-go AI
- paid services
- workflows that can unexpectedly incur charges

Prefer free, local and open-source solutions.

## Deployment

Production deployment uses Vercel.

Domain:

`alokthakur.me`

DNS is managed through Namecheap.

Do not randomly modify nameservers or DNS records.

## Development rules

- Do not migrate Astro to Next.js without an explicit architecture decision.
- Do not rewrite v1.0.0 history.
- Inspect before modifying.
- Preserve working architecture.
- Prefer small changes.
- Run appropriate checks.
- Review diffs.
- Create Git checkpoints.
- Do not push unless explicitly requested.
- Keep documentation durable and concise.

## If continuing this project

First inspect:

```bash
git status --short --branch
git log --oneline --decorate -8
