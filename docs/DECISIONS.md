# Alok Engineering Lab — Decisions

> Record durable decisions only. If a decision changes, keep the old decision in history and mark the replacement.

## D-001 — Product identity
**Decision:** Build an Engineering Lab / digital garden rather than a conventional portfolio.
**Status:** Active.
**Reason:** The site is intended to document engineering work, learning, experiments and evolution over many years.

## D-002 — Connected content model
**Decision:** Projects, writing, notes, experiments, timeline and documentation should be able to connect rather than becoming unnecessarily isolated systems.
**Status:** Active.
**Reason:** The site should behave like one body of engineering knowledge with multiple useful views.

## D-003 — Framework
**Decision:** Astro.
**Status:** Active.
**History:** Next.js was considered during early planning, but the research direction selected Astro and the implemented repository is Astro.
**Rule:** Do not migrate frameworks without a new explicit decision.

## D-004 — Deployment
**Decision:** Vercel for deployment.
**Status:** Active.

## D-005 — Custom domain
**Decision:** Use `alokthakur.me` as the public domain.
**Status:** Active.
**Pending:** Live DNS verification remains an operational check rather than a repository architecture concern; use the Vercel domain verification tooling when the environment has access to the live DNS endpoint.

## D-006 — Visual direction
**Decision:** Modern engineering aesthetic with restrained technical/hacker character.
**Status:** Active.
**Priorities:** clean, professional, technical, responsive, fast, readable and long-lived.

## D-007 — AI-assisted development
**Decision:** Use AI heavily, but keep the user as final decision-maker.
**Status:** Active.
AI should inspect existing code, explain important changes, implement, test and expose diffs for review.

## D-008 — Zero-cost constraint
**Decision:** Project budget for AI/tools/services is ₹0 / $0.
**Status:** Permanent constraint.
No workflow should assume willingness to pay later.

## D-009 — v1.0.0 baseline
**Decision:** Treat `v1.0.0` as a stable checkpoint.
**Status:** Active.
Do not rewrite release history. Future work proceeds forward with new commits/releases.

## D-010 — Content relationship integrity
**Decision:** Treat `related:` references as build-time integrity constraints.
**Status:** Active.
**Reason:** The knowledge archive depends on trustworthy connections. Missing, malformed, unknown or self-referential relationship targets should fail verification instead of silently disappearing from the interface.

## D-011 — Documented project status boundary
**Decision:** Project `status` is a repository-backed documentation signal, not a live operational health indicator.
**Status:** Active.
**Reason:** The static Lab should expose useful current-state context without introducing a runtime status service or implying real-time authority it does not have.

## D-012 — Project intelligence is repository-backed
**Decision:** Project technical records should be derived from structured repository metadata and linked content, not a runtime project database.
**Status:** Active.
**Reason:** The Lab needs richer project context without introducing a second source of truth, runtime infrastructure or cost.

## D-013 — Knowledge must trace back to engineering work
**Decision:** Durable knowledge should be extracted from demonstrated project decisions, constraints, failures and verification rather than published to satisfy a content quota.
**Status:** Active.
**Reason:** The Lab is an engineering record, so reusable principles are valuable when their provenance remains visible.

## D-014 — Knowledge provenance is bidirectional
**Decision:** Knowledge detail pages should expose the project records connected through their existing `related:` references, while project pages continue to expose derived knowledge.
**Status:** Active.
**Reason:** A connected engineering archive is more trustworthy and useful when readers can travel from project work to derived knowledge and back without introducing a second source of truth.

## D-016 — Static discovery uses durable indexes
**Decision:** Growing content should be discoverable through static topic routes, collection views and lightweight browser-local filters before introducing backend search.
**Status:** Active.
**Reason:** The archive can gain useful navigation paths without adding runtime infrastructure or cost.

## D-017 — Engineering evidence is a first-class content type
**Decision:** Benchmarks, failure modes, verification records and observations belong in a typed Evidence collection with explicit method, result and limitations.
**Status:** Active.
**Reason:** Compact evidence records make engineering claims easier to inspect without forcing every claim into a long article.

## D-018 — Technical writing has an explicit workflow
**Decision:** Deep writing follows source → frame → outline → draft → verify → publish → revisit, with format metadata and existing relationship provenance.
**Status:** Active.
**Reason:** Durable technical writing should remain traceable to the engineering work it explains.

## D-019 — Maintenance rules are executable
**Decision:** Content metadata, relationships, project lifecycle history and writing provenance are repository validation gates.
**Status:** Active.
**Reason:** A long-lived archive should enforce its documented integrity contracts automatically before production builds.

## D-020 — Archive chronology is repository-backed
**Decision:** Long-term project history is presented from dated lifecycle and timeline records already stored in the repository; the Lab does not synthesize live activity or maintain a second historical database.
**Status:** Active.
**Reason:** The archive should remain trustworthy and durable as it grows while preserving the zero-cost, static architecture.

## D-021 — Accessibility and performance are release gates
**Decision:** Accessibility and browser-quality checks belong in the existing zero-cost route audit rather than as a separate runtime monitoring system.
**Status:** Active.
**Reason:** The Lab should continuously protect keyboard access, document semantics, responsive behavior and dependency discipline while remaining static and inexpensive.


## D-022 — Experience excellence favors hierarchy over spectacle
**Decision:** Improve the Lab through information hierarchy, typography, proof, connected discovery, readable long-form content and restrained interaction rather than decorative visual systems.
**Status:** Active.
**Reason:** The Lab's primary product is the engineering record. Visual effects should support comprehension, not compete with it.

## D-023 — Interaction quality is part of the browser gate
**Decision:** The generated-route audit must verify visible primary interaction targets and visible keyboard focus in addition to route, metadata, link, structure and responsive checks.
**Status:** Active.
**Reason:** Accessibility and UX quality should remain executable release constraints rather than manual aspirations.


## CP21 — UX reliability over visual spectacle
The Lab should improve through explicit interaction states, accessible semantics, responsive reliability and repository-backed discovery rather than decorative complexity. 44px primary interaction targets are preferred, accessibility checks should be automated where practical, and 3D/WebGL remains out of scope unless a future engineering visualization has a concrete explanatory purpose.


## D-024 — Repository-native publishing workflow
**Decision:** Content creation should remain a Git-native workflow with generated templates, build-time validation and browser/performance gates.
**Status:** Active.
**Reason:** The repository is the Lab's source of truth; a CMS or runtime publishing service would add complexity and cost without improving authority.

## D-025 — Unified static discovery
**Decision:** Provide one static full-text discovery surface across published collections and a separate readable relationship view before considering backend search.
**Status:** Active.
**Reason:** Astro content collections expose raw entry bodies at build time, allowing useful search and graph-like discovery without runtime infrastructure.

## D-026 — Performance as a release contract
**Decision:** Track LCP, CLS, TTFB, runtime external resources, script count and image contracts in the existing browser-based CI gate.
**Status:** Active.
**Reason:** The Lab is content-heavy and static; inexpensive build-time/browser checks protect performance without introducing monitoring infrastructure.
