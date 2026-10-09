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

## Stable baseline
The v1.0.0 history remains preserved and must not be rewritten.

## CP4 status
CP4.1 through CP4.10 are complete.

### Archive and knowledge surfaces
Six deep project case studies, substantive Writing/Notes/Experiments, project/content cross-linking, meaningful Timeline milestones, Garden discovery, public Docs, Changelog history and About/identity are established.

## CP5 status
CP5 Product Quality / UX Hardening is complete at the repository level.

Current hardening covers metadata/canonical handling, favicon/social-preview behavior, robots/noindex behavior, keyboard focus visibility, semantic navigation labels, deterministic Garden anchors, external-link safety and a zero-cost build gate.

## CP6 status
CP6 Release / Production Readiness is complete at the repository and production-verification level.

Confirmed:
- browser audit discovers every generated HTML route instead of a fixed sample list
- GitHub Actions runs build plus Chromium browser audit
- the latest verified CP6 Quality run completed successfully
- generated XML sitemap at /sitemap.xml
- explicit robots.txt
- production changelog entry
- Vercel production deployment was verified READY for the CP6 checkpoint
- alokthakur.me and www.alokthakur.me are verified Vercel project domains
- v1.0.0 history remains preserved

The release tag is not represented in the repository because the available GitHub connector cannot create tags; no branch is used as a fake tag.

## CP7 status
CP7 Long-Term Maintenance is complete at the repository level.

Confirmed:
- build now blocks on invalid content relationships
- maintenance and release discipline are documented
- content integrity is captured as a durable note
- CP7 changelog entry is published
- no new paid service or infrastructure was introduced

## CP8 status
CP8 Continued Engineering Growth is complete at the repository level.

Confirmed:
- documented project status is visible on project archive cards and project detail pages
- the distinction between documented status and live operational truth is recorded
- CP8 includes a durable note, experiment, timeline milestone and changelog entry
- Astro remains the architecture
- the repository remains the source of truth
- no database, CMS, analytics, runtime API or paid service was introduced

## CP9 status
CP9 Knowledge Expansion is complete. The archive contains reusable engineering principles extracted from actual project architecture, constraints and verification.

## CP10 status
CP10 Project Intelligence is complete. Every project has structured objective, lifecycle, architecture summary, decisions and lessons metadata, and project detail pages expose linked knowledge and project-specific timeline records.

## Post-CP10 stabilization
The first post-CP10 audit is now closed.

Completed:
- Garden is part of the primary desktop and mobile navigation.
- Primary navigation exposes active-route context with `aria-current`.
- Garden has lightweight in-browser search over published notes, writing and experiments.
- Garden topic anchors use deterministic, working targets.
- Additional project-derived knowledge was added as notes, writing and an experiment.
- Changelog and timeline records document this stabilization pass.
- No database, search service, analytics, runtime API, framework migration or paid service was introduced.

## CP11 status
CP11 Knowledge Provenance is complete.

Completed:
- knowledge detail pages expose their related project records as explicit engineering provenance
- project detail pages continue to expose linked Writing/Notes/Experiments
- provenance uses the existing repository-backed `related:` relationship model
- durable note, changelog and timeline records document the phase
- no second source of truth, database, runtime service or paid infrastructure was introduced

## Verification baseline
The repository contains a Playwright-based visual/quality audit covering every generated HTML route at desktop and mobile viewports.

The CP11 implementation should be considered verified when the GitHub Actions Quality workflow for the final CP11 docs commit passes.

## Deployment
Production is configured for Vercel with www.alokthakur.me as the canonical site URL and Namecheap as the registrar/DNS provider. Vercel currently reports both custom domains as verified.

## Current repository checkpoint
The current master HEAD is `2918e914` (`test: audit production viewports in CI`). The repository has moved beyond the older CP22–CP27 release-pending wording in earlier handoff notes.

Phase 0 admin foundation is being developed on `admin/phase-0-foundation`. The public site remains static and repository-backed.

The seven current collections are projects, writing, notes, experiments, evidence, timeline and changelog. A typed management descriptor now exists at `src/content/schema-metadata.ts` while `src/content.config.ts` remains the validation authority.

Timeline chronology was audited against the Git history for CP10, CP11, CP13–CP17, CP20–CP22/27 and post-CP10 stabilization. The CP records inspected were created/updated on 2026-10-07, so the repeated date is real rather than a fabricated ordering error.

The implementation uses `www.alokthakur.me` as its canonical URL. Both apex and www are referenced by existing production documentation, but Vercel account-level verification is not available in this execution environment.

## Development rules
- Inspect before modifying.
- Preserve Astro architecture.
- Do not rewrite v1.0.0.
- Prefer small reviewable changes.
- Run appropriate checks.
- Use Git checkpoints.
- Keep the project at ₹0 / $0.
- Treat current repository/Git state as the strongest source of truth.

## CP12–CP16 status
The CP12–CP16 batch is implemented on master.

Confirmed repository capabilities:
- CP12: explicit project lifecycle baselines/history and lifecycle-aware project discovery
- CP13: static Garden topic pages plus browser-local project search/filtering
- CP14: first-class Evidence collection and evidence-aware project/content graph
- CP15: explicit writing formats, provenance rules and docs/WRITING.md workflow
- CP16: metadata, relationship, lifecycle and writing validation gates wired into build and CI
- sitemap includes published evidence and static Garden topic routes while excluding draft content
- Astro, Vercel and the ₹0 / $0 architecture remain unchanged


## CP17 status
CP17 Long-Term Archive is complete.

Confirmed:
- Projects expose lifecycle distribution at the archive level.
- Project detail pages distinguish current state, lifecycle baseline and recorded historical states.
- Historical chronology is explicitly repository-backed rather than presented as live telemetry.
- No new database, runtime service, analytics, paid infrastructure or framework migration was introduced.


## CP18 status
CP18 Performance & Accessibility Excellence is complete.

Confirmed:
- Shared layout provides skip navigation and reduced-motion support.
- Desktop/mobile navigation is consistent and the duplicate Evidence entry is removed.
- Project lifecycle filters expose their active state to assistive technology.
- The browser audit checks language, skip navigation, duplicate visible navigation, external resources, overflow, headings, images, buttons and internal links across generated routes at desktop/mobile sizes.
- No paid monitoring, third-party analytics or runtime infrastructure was introduced.

## CP19 status
CP19 Visual Evolution is complete.

Confirmed:
- Timeline, Changelog and Evidence archive/index surfaces use the current restrained engineering visual language.
- Archive content remains typography-led, border-based and responsive.
- No 3D/WebGL, particle system, visual framework or large client-side system was introduced.


## CP20 status
CP20 — Experience Excellence is complete and verified.

The current experience now includes:
- a stronger personal identity and homepage hierarchy
- featured engineering presented as the primary product surface
- reduced primary navigation with Garden grouping
- typography-first project archive rows and explicit project case-study navigation
- clearer lifecycle and evidence status language
- Garden topic discovery and editorial provenance surfaces
- improved long-form reading metadata and rhythm
- stronger footer identity and internal navigation
- responsive viewport/media protections
- visible-control target and keyboard-focus checks in the generated-route browser audit

The final Quality workflow passed repository validation, Astro build and the full browser audit for 264 desktop/mobile cases.


## CP21 — UX Reliability & Interaction Excellence
The interface has received a reliability-focused UX pass covering interaction semantics, accessibility, responsive controls, Garden/project discovery, long-form reading, evidence summaries and 404 recovery. The browser audit now covers eight responsive viewport classes and interaction-level checks in addition to route-level validation.


## CP22–CP27 — Engineering Lab Expansion
Implemented as the next capability layer after CP21:
- Project records expose current focus, known problems and future work.
- Project intelligence presents the full repository-backed technical record.
- /explore provides static full-text search across all published collections with type/topic filters.
- /connections provides a readable repository-backed relationship view and connection-gap signal.
- A repository-native content generator provides collection-aware draft templates.
- Browser quality remains the interaction/accessibility gate, with a new Playwright performance gate covering LCP, CLS, TTFB, runtime external resources, script count and image contracts.
- Structured WebSite metadata and a public content workflow guide strengthen the publishing contract.
- No database, CMS, analytics, paid service, framework migration, WebGL or 3D system was introduced.

Experience refinement after CP27 adds clearer positioning, repository-derived proof metrics, simplified navigation, static command search, technology filtering, contact/discovery surfaces and a static social preview. Personal contact credentials are only added when verified public destinations exist.

Final release status remains pending until the combined GitHub Actions Quality run passes and the resulting Vercel deployment is READY.


## Admin continuation

Admin Phase 0–3 are complete through master commit 21b01332ba10761e525881b0604e7acb3dae9c66.

The remaining implementation scope is:
- Phase 4 — Git / CI / Deployment
- Phase 5 — Engineering Intelligence
- Phase 6 — Hardening / Final Verification

These are continuation requirements from the original admin implementation specification, not previously completed work. Each phase remains subject to the repository Quality workflow, Git review and production verification.


## Admin Phase 5 checkpoint

Phase 5 — Engineering Intelligence is implemented and verified on branch `admin/phase-5-engineering-intelligence` / PR #9, based directly on the frozen Phase 4 HEAD `af8968bbf767748aa839a8bd952734f61426a4e8`.

Verified on Phase 5 HEAD:
- GitHub Actions Quality run `37653718026` passed
- admin suite: 27/27 tests passed
- repository validation passed
- production build passed
- browser quality audit passed
- performance audit passed
- Lighthouse audit passed
- interaction responsiveness audit passed
- production viewport audit passed

Phase 4 PR #8 merged as `ecb2a1b96c5e7a5fc0d6580fe5eadca58c7e0f6d` after Quality passed and its Vercel preview reached READY. Phase 5 PR #9 merged as `3ac527254efc3658169e62e87d30f1162c523459` after fresh Quality run `37888706035` passed and its Vercel preview reached READY. Phase 6 remains the final integration step.


## Admin Phase 5 targeted completeness audit

A targeted post-implementation audit found and corrected three concrete issues without changing the Phase 5 architecture:
- JSON export now loads and includes repository-backed site configuration instead of referencing an undefined value.
- Content relationship target validation now uses the correct Markdown/MDX path expression.
- Malformed percent-encoded cookies are rejected safely instead of throwing during session parsing.

Regression coverage was added for configuration export and malformed-cookie handling. Phase 5 is merged; its fresh Quality run `37888706035` passed and its Vercel preview reached READY.

Phase 5 verification: fresh Quality run `37888706035` passed the admin-security suite and all repository validation, build, browser, performance, Lighthouse, interaction and viewport audits.


## Admin integration status — 2026-10-09

Phase 4 PR #8 is merged as `ecb2a1b96c5e7a5fc0d6580fe5eadca58c7e0f6d`. Phase 5 PR #9 is merged as `3ac527254efc3658169e62e87d30f1162c523459`; its fresh Quality run `37888706035` passed and its Vercel preview reached READY. These current results supersede the historical Phase 5 gate note above. Phase 6 still requires fresh Quality and Vercel verification on its current head before final integration.


## Phase 6 independent hardening

Phase 6 independent hardening is implemented and quality-verified on branch `admin/phase-6-hardening`.

Verified independently:
- explicit `ADMIN_BASE_URL` OAuth callback construction
- `__Host-` session/OAuth cookies
- bounded JSON mutation parsing and controlled malformed-body responses
- GitHub request timeouts and sanitized upstream failures
- strict `.md` / `.mdx` content path matching
- engineering-intelligence export configuration wiring
- command-palette modal focus containment and restoration
- GitHub failure regression coverage

Quality run: GitHub Actions run `37656763756` — admin-security PASS; repository validation/build/browser/performance/Lighthouse/interaction/viewport checks PASS.

Phase boundary remains:
- Phase 4: merged as `ecb2a1b96c5e7a5fc0d6580fe5eadca58c7e0f6d`; Quality and Vercel preview passed.
- Phase 5: merged as `3ac527254efc3658169e62e87d30f1162c523459`; fresh Quality and Vercel preview passed.
- Phase 6 final integration: pending fresh verification on the current head.
- Final production verification: pending the Phase 6 merge and resulting READY production deployment.

## Admin Phase 6 current quality checkpoint

Phase 6 hardening remains on `admin/phase-6-hardening` / draft PR #10. The branch preserves its existing hardening history and now additionally enforces CSRF tokens on admin mutations and safely handles malformed cookie encoding.

Quality workflow `37659657170` passed `admin-security` and `build-and-audit`, including repository validation, build, browser quality, performance, Lighthouse, interaction responsiveness and production viewport checks.

Phase 6 status is **IMPLEMENTED / PRIOR QUALITY VERIFIED / FINAL INTEGRATION PENDING**. Phases 4 and 5 are now merged; this branch needs fresh Quality and Vercel checks on its current head before Phase 6 can merge.
