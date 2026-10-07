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

CP17 Long-Term Archive is complete.

## CP18 status
CP18 Performance & Accessibility Excellence is complete.

## CP19 status
CP19 Visual Evolution is complete.

The next architectural checkpoint is CP20 Maturity / v2 Readiness, which is a decision gate rather than an automatic rewrite.

## CP20 status
CP20 — Experience Excellence is complete at the repository verification level.

Confirmed:
- homepage hierarchy now establishes Alok → Engineering Lab identity, current work, featured engineering, Lab discovery, recent thinking and journey
- primary navigation is simplified to Projects, Garden, Journey and About, with knowledge surfaces grouped under Garden
- project archives use typography-first engineering rows and project detail pages expose case-study navigation, technical records and repository-backed chronology
- lifecycle and evidence records have explicit text/status cues rather than relying on color alone
- Garden topic/index surfaces and knowledge provenance are more discovery-oriented
- long-form writing, notes and experiments expose reading-time context and improved reading rhythm
- responsive viewport metadata and media bounds were strengthened
- browser audit now checks visible interaction target minimums and keyboard focus visibility in addition to existing route, link, structure and overflow checks
- final GitHub Actions Quality run 37583092301 passed all validation/build/browser-audit stages across 264 desktop/mobile cases
- no database, CMS, analytics, paid service, WebGL, 3D, particle system or framework migration was introduced

The CP20 work preserves Astro and the ₹0 / $0 constraint. v1.0.0 history remains untouched.


## CP21 status
CP21 — UX Reliability & Interaction Excellence is complete at the implementation level. Final combined verification remains the release gate.

Implemented:
- project lifecycle filters now expose visible active state as well as aria-pressed state
- evidence outcomes use distinct semantic visual treatment for confirmed, failed, inconclusive and informational records
- Garden search now includes record body text and Evidence is exposed in Garden view navigation
- project search covers architecture summaries, decisions and lessons
- long-form records expose subtle reading progress and adjacent archive navigation
- 404 recovery matches the Lab visual language
- related-content styling uses the same neutral token family
- evidence archive exposes outcome counts
- browser audit expanded from two viewports to 320/375/390/430/768/1024/1280/1440 widths
- browser audit now checks full keyboard traversal, accessible names, form labels, focus appearance, contrast warnings, 44px primary targets, navigation interactions and project/Garden search behavior
- internal-link HTTP validation is performed once per route set at a representative viewport to avoid redundant CI work

No 3D/WebGL, database, CMS, analytics, paid service or framework migration was introduced.


## CP22–CP27 implementation status
CP22 through CP27 are implemented as the next long-term Engineering Lab capability layer. Final combined Quality verification and production deployment remain the release gate.

- CP22 Knowledge Architecture: project records expose current focus, known problems and future work; connected content remains repository-backed.
- CP23 Engineering Lab Intelligence: project intelligence presents objective, lifecycle, architecture, stack, decisions, lessons, focus, risks, future work, linked knowledge and chronology.
- CP24 Discovery & Navigation: `/explore` searches full text across published collections with type/topic filters; `/connections` exposes repository-backed hubs and connection gaps.
- CP25 Performance & Accessibility: browser quality remains a release gate; a zero-cost Playwright performance audit checks LCP, CLS, TTFB, runtime external resources, script count and image contracts.
- CP26 Developer Workflow: `scripts/new-content.mjs` scaffolds repository-native content templates; validation/build/audit commands remain the publishing gate.
- CP27 Visual Identity Refinement: new surfaces use the existing typography-first, border-led engineering language without decorative runtime systems.

## Experience refinement checkpoint
The Lab now has a more specific engineering proposition, repository-derived proof metrics, a static social preview, a simplified Projects / Writing / Lab / Journey / About / Contact navigation model, a keyboard command palette, technology filtering on Projects, a public Contact surface, and stronger homepage activity/provenance cues. Personal email, LinkedIn and resume credentials are not invented; only verified public destinations are surfaced.
