# Alok Engineering Lab — AI Handoff

> Start here when a new AI chat/session needs to continue the project.

## Current project
Alok Engineering Lab is a long-term personal Engineering Lab / digital garden, not merely a portfolio.

## Stack
- Astro
- Tailwind CSS
- MDX / Astro content collections
- TypeScript
- Git / GitHub
- Vercel
- Namecheap custom domain: alokthakur.me

## Source of truth
1. Actual current repository
2. Current Git state
3. Explicit current user decisions
4. Canonical docs
5. Recent project conversations
6. Older conversations

Always inspect the repository before making engineering changes.

## Stable baseline
v1.0.0 is preserved. Do not rewrite its history.

## CP4 status
CP4.1 through CP4.10 are complete.

## CP5 status
CP5 Product Quality / UX Hardening is complete at the repository level and has passed the current local production build. Vercel reports a successful deployment for the CP5 checkpoint.

Hardening includes shared metadata, explicit 404 noindex behavior, removal of favicon as an implicit social image, keyboard focus visibility, labelled navigation, deterministic Garden anchors, safer external links and a zero-cost build workflow.

## CP6 status
CP6 — Release / Production Readiness is complete at the repository and production-verification level.

Confirmed:
- production route generation and validation
- full generated-route browser audit coverage
- browser audit execution in GitHub Actions
- generated XML sitemap
- explicit robots.txt
- production changelog entry
- Vercel production deployment for commit bd356f9 verified READY
- custom domains alokthakur.me and www.alokthakur.me verified in Vercel
- v1.0.0 history preserved

The latest GitHub Actions Quality run for bd356f9 completed successfully, including the browser audit. Vercel also verified the production deployment and custom domains. A Git tag is not represented because the available GitHub connector cannot create tags; do not fake a tag with a branch.

## CP7 status
CP7 — Long-Term Maintenance is complete at the repository level.

Confirmed:
- content relationship validation is now a build-blocking gate
- maintenance/release discipline is documented in docs/MAINTENANCE.md
- content integrity is captured as durable knowledge
- CP7 has a changelog entry
- zero-cost architecture and Astro remain unchanged

## Visual direction
Preserve the restrained engineering aesthetic: black canvas, strong typography, thin borders/rules, monospace technical labels, editorial spacing, responsive layouts and minimal decoration.

Do not introduce 3D/WebGL/particles or large client-side systems without a real UX need.

## Financial constraint
The project remains permanently ₹0 / $0. No paid APIs, services, subscriptions or pay-as-you-go infrastructure.

## Development workflow
**inspect → implement → verify → review → checkpoint**

Do not rewrite v1.0.0. Prefer small, durable, reviewable changes. Keep canonical docs concise and current.

## Continuation
When continuing:
1. inspect current GitHub state
2. read this file and relevant canonical docs
3. identify the actual product problem
4. implement only the required scope
5. verify
6. checkpoint
7. update durable docs
