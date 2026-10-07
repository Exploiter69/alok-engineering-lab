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
- custom domains alokthakur.me and www.alokthakur.me verified
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

## CP8 status
CP8 — Continued Engineering Growth is complete at the repository level.

Confirmed:
- project status is now visible on project archive cards and project detail pages
- status is documented archive state, not live operational health
- CP8 added durable knowledge and experiment coverage for that boundary
- CP8 added timeline and changelog records
- no database, CMS, analytics, runtime API or paid service was introduced
- existing content relationship validation and full-route browser auditing remain in place

## Visual direction
Preserve the restrained engineering aesthetic: black canvas, strong typography, thin borders/rules, monospace technical labels, editorial spacing, responsive layouts and minimal decoration.

Do not introduce 3D/WebGL/particles or large client-side systems without a real UX need.

## Financial constraint
The project remains permanently ₹0 / $0. No paid APIs, services, subscriptions or pay-as-you-go infrastructure.

## Development workflow
**inspect → implement → verify → review → checkpoint**

Do not rewrite v1.0.0. Prefer small, durable, reviewable changes. Keep canonical docs concise and current.

## CP9 status
CP9 Knowledge Expansion is complete. Knowledge content is derived from real project architecture, constraints, verification and lessons rather than generic publishing quotas.

## CP10 status
CP10 Project Intelligence is complete. Project records now expose structured objective, lifecycle, architecture summary, decisions, lessons, linked knowledge and linked timeline entries.

## Post-CP10 stabilization
The first post-CP10 audit is closed. The Lab now has:
- Garden in primary desktop/mobile navigation
- active-route navigation context with `aria-current`
- zero-cost in-browser Garden search
- corrected deterministic Garden topic anchors
- additional project-derived notes, writing and experiments
- changelog and timeline records for the stabilization pass

Latest stabilization commit `e39163d` passed the GitHub Actions Quality workflow and has a READY Vercel production deployment.

## CP11 status
CP11 Knowledge Provenance is complete at the repository level.

Confirmed:
- notes, writing and experiment detail pages expose related project records as engineering provenance
- project pages continue to expose linked knowledge
- provenance reuses the existing `related:` graph instead of adding a second metadata system
- a durable note, changelog and timeline record document the checkpoint
- no database, runtime API, analytics, paid service or framework migration was introduced

## CP12–CP16 status
CP12 through CP16 are complete as a single growth batch.

- CP12 Project Lifecycle System: explicit lifecycle baseline/history and lifecycle-aware project discovery.
- CP13 Discovery & Navigation: static Garden topic routes plus project-local search/filtering.
- CP14 Engineering Evidence: typed Evidence collection with benchmark, failure, verification and observation records.
- CP15 Technical Writing System: explicit writing formats and docs/WRITING.md workflow.
- CP16 Lab Automation: metadata, relationship, lifecycle and writing validators run before production build and are also called explicitly by GitHub Actions.

The batch remains static, repository-backed and ₹0 / $0. No database, runtime search service, analytics, paid infrastructure or framework migration was introduced.

## Verification
The final batch is considered complete only after the latest GitHub Actions Quality run passes on master. Vercel production should also report READY for the final verified commit.

After verification, sync the local checkout with:
git pull --ff-only origin master

Do not invent CP17 automatically. The next phase should begin only after a new real product or engineering gap is demonstrated.
