# Alok Engineering Lab — Master Context

> Canonical project context. Keep this document concise and update it when a durable project-level fact changes.

## Project

- **Name:** Alok Engineering Lab
- **Repository:** `alok-engineering-lab`
- **GitHub:** `Exploiter69/alok-engineering-lab`
- **Domain:** `alokthakur.me`
- **Framework:** Astro
- **Deployment:** Vercel
- **Content:** Astro content collections / MDX-oriented engineering content
- **Current release:** `v1.0.0`

## Vision

Alok Engineering Lab is a long-term personal engineering laboratory and public engineering record, not merely a resume or portfolio.

It combines:

- portfolio and projects
- technical writing
- engineering notes
- experiments
- Linux/rooting work
- AI experiments
- learning journey
- timeline
- changelog
- documentation and knowledge archive

The site should show what is being built, what was learned, why important decisions were made, and how engineering ability evolves over time.

## Product principles

1. **Engineering lab, not generic portfolio.**
2. **Long-lived:** architecture should remain maintainable for years.
3. **Connected knowledge:** projects, writing, notes, experiments, timeline and documentation should be able to reference each other.
4. **Modern engineering aesthetic:** clean, professional, technical, fast and responsive.
5. **Progressive complexity:** do not overengineer early versions.
6. **Evidence over assumptions:** current repository state outranks old conversation claims.
7. **AI assists; the user remains the decision-maker.**
8. **Git checkpoints are part of the safety model.**

## Architecture decision

The project went through an early Next.js vs Astro discussion.

The final research direction and the actual implementation are **Astro**.

**Do not migrate to Next.js unless a new, explicit architecture decision is made.**

## Source-of-truth hierarchy

When information conflicts, use:

1. Actual current repository
2. Current Git state / commits
3. Explicit current user decisions
4. These canonical project documents
5. Latest relevant project conversation
6. Older conversations

## Financial constraint

The project must remain **₹0 / $0**.

Do not recommend or enable:

- paid AI APIs
- pay-as-you-go services
- unexpected billing
- workflows that depend on consuming paid AI credits

Prefer genuinely free, student/free-tier, local, and open-source options. Clearly flag anything that could cost money before using it.

## AI workflow

- **ChatGPT:** planning, research, architecture, reasoning, explanations and project decisions.
- **Zed:** direct repository editing, agent-assisted implementation, command execution, testing and diff review.
- **Git:** checkpoints and history.
- **GitHub:** remote repository.
- **Vercel:** deployment.

Zed must not silently redefine project architecture.

## Stable baseline

`v1.0.0` is the first stable release checkpoint.

The responsive release commit is:

`b0c61f8` — `feat: make v1 responsive`

The pre-responsive tag is:

`v1.0.0-pre-responsive`

Do not rewrite the v1.0.0 history.

## Maintenance rule

Update these documents only when information is durable and useful to future work. Do not turn them into chat transcripts.
