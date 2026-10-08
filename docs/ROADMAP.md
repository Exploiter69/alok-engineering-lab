# Alok Engineering Lab — Roadmap

> Directional roadmap for the Engineering Lab. Roadmap items are not automatically approved for implementation.

## Completed

### v1.0.0 — Foundation
Initial Engineering Lab foundation, content structure, responsive improvements, Git/GitHub checkpoint and Vercel deployment foundation. The v1.0.0 history is preserved and must not be rewritten.

### v1.1 — Website Release Baseline
Established the current Astro/Tailwind website foundation.

### CP0 — UI/UX Audit
**Complete.** Hierarchy, navigation, responsiveness, visual consistency and product direction audited.

### CP1 — Design System
**Complete.** Established the restrained engineering aesthetic, typography-led hierarchy, black canvas, thin rules, technical labels, editorial spacing, responsive layouts and minimal decoration.

### CP2 — Information Architecture
**Complete.** Established Projects, Writing, Notes, Experiments and Timeline as primary areas, with Garden, Changelog, Docs and About as supporting areas.

### CP3 — Visual / UX Refinement
**Complete.** Refined homepage, collection/detail pages, metadata, responsive behavior and mobile layouts.

### CP4.1 — Content + Discovery Foundation
**Complete.** Established initial content depth, related-content support, Garden, timeline/release milestones and browser quality auditing.

### CP4.2 — Engineering Archive Curation
**Complete.** Curated eleven substantive engineering projects from current repository evidence and added repository provenance.

### CP4.3 — Deep Engineering Case Studies
**Complete.** Ten projects now explain problem, constraints, architecture, engineering evolution, verification/safety boundaries, current state and lessons.

### CP4.4 — Knowledge Archive Depth
**Complete.** Added substantive technical writing, durable notes and real experiments based on recurring engineering themes from the projects.

### CP4.5 — Cross-Linking / Knowledge Graph
**Complete.** Added meaningful project ↔ writing/note/experiment relationships and expanded related-content paths.

### CP4.6 — Journey / Timeline Depth
**Complete.** Added meaningful milestones for archive curation, knowledge-archive growth and verification as a recurring engineering theme.

### CP4.7 — Garden / Discovery
**Complete.** Garden exposes content by type and provides a topic index over the knowledge archive without a database or client-side search system.

### CP4.8 — Documentation Surface
**Complete.** /docs explains the Lab's purpose, content model, engineering principles, technology and maintenance workflow.

### CP4.9 — Changelog / Release History
**Complete.** Added meaningful release entries describing the archive's evolution rather than logging individual commits.

### CP4.10 — About / Identity
**Complete.** About explains what the Lab is, what is explored, how engineering decisions are approached and where the Lab is heading.

### CP5 — Product Quality / UX Hardening
**Complete.** Repository-level hardening covers metadata/SEO, 404 indexing behavior, keyboard focus, semantic navigation labels, Garden anchor determinism, external-link safety and a free build-quality workflow. The current local production build passes.

### CP6 — Release / Production Readiness
**Complete at repository and production-verification level.**

Completed within CP6:
- production build verification
- generated-route coverage in the browser audit
- browser audit wired into the zero-cost GitHub Actions workflow
- generated XML sitemap
- explicit robots.txt
- production changelog/release note
- Git history review
- Vercel deployment verification

Confirmed:
- successful GitHub browser-audit run for the CP6 checkpoint
- successful Vercel production deployment
- verified custom domains
- v1.0.0 history preserved

Operational release checkpoint not represented in the repository because the available GitHub connector cannot create tags; no branch is used as a fake tag.

### CP7 — Long-Term Maintenance
**Complete at the repository level.**

Completed:
- build-blocking content relationship validation
- maintenance and release discipline documentation
- durable content-integrity note
- CP7 changelog entry
- zero-cost verification preserved

CP7 establishes the maintenance contract rather than adding infrastructure for its own sake.

### CP8 — Continued Engineering Growth
**Complete at the repository level.**

Completed:
- exposed documented project status in project cards and project detail pages
- preserved the static/repository-backed architecture instead of introducing live status infrastructure
- added a durable note defining documented status versus live operational truth
- added an experiment validating repository-backed project status
- added a CP8 timeline milestone and changelog entry
- maintained the build-blocking relationship integrity gate and full generated-route browser audit

CP8 makes the Lab more useful as a living engineering archive without adding a database, CMS, runtime API, analytics or paid service.

### CP9 — Knowledge Expansion
**Complete.** Added reusable engineering knowledge derived from actual project architecture, constraints and verification, plus a traceable knowledge-extraction experiment and writing record.

### CP10 — Project Intelligence
**Complete.** Project records now include structured objectives, lifecycle, architecture summaries, decisions and lessons. Project detail pages expose linked knowledge and project-specific timeline records without introducing runtime infrastructure.

### CP11 — Knowledge Provenance
**Complete.** Knowledge detail pages now expose the project records connected to their ideas through the existing repository-backed relationship model. This makes the project ↔ knowledge graph bidirectional without introducing a second source of truth, runtime infrastructure or cost.

### CP12 — Project Lifecycle System
**Complete.** Project records now separate publication status from engineering lifecycle, record lifecycle baselines/history, and support browser-local lifecycle filtering.

### CP13 — Discovery & Navigation
**Complete.** The Garden now exposes stable static topic routes, while Projects has lightweight lifecycle filtering and search. No backend search infrastructure was introduced.

### CP14 — Engineering Evidence
**Complete.** Added a first-class Evidence collection with benchmark, failure, verification and observation records plus method/result/limitations fields and project provenance.

### CP15 — Technical Writing System
**Complete.** Writing records now declare a format, detail pages expose the writing metadata, and docs/WRITING.md defines a durable source-to-publication workflow.

### CP16 — Lab Automation
**Complete.** Metadata, relationship, lifecycle and writing validators now run before Astro diagnostics/build, and GitHub Actions runs the repository validation explicitly.

### CP17 — Long-Term Archive
**Complete.** Project archive surfaces now summarize lifecycle state counts and historical records, while project detail pages make the chronology boundary explicit. The archive remains composed from repository-backed dates, lifecycle history and timeline records.

### CP18 — Performance & Accessibility Excellence
**Complete.** The shared layout now provides a skip link and reduced-motion behavior, navigation is deduplicated and keyboard-oriented controls expose state. The browser audit now checks document language, skip navigation, visible navigation duplicates and external resources across every generated route and both target viewports.

### CP19 — Visual Evolution
**Complete.** Archive-facing surfaces were visually aligned with the current engineering design language after CP17/CP18 stabilization, including Timeline, Changelog and Evidence indexes/detail records. The evolution remains typography-led, border-based and responsive without introducing decorative systems or a framework change.

## Explicitly Not Needed Unless Proven Necessary

- database/CMS
- authentication
- paid APIs/services
- analytics
- newsletter
- heavy search infrastructure
- WebGL/3D/particles
- framework migration
- unnecessary client-side state

The Lab should earn complexity through real product needs.

## Product Direction

The Lab is a long-term personal Engineering Lab / digital garden containing projects, technical writing, engineering notes, experiments, Linux/rooting work, AI experiments, learning journey, timeline, changelog, documentation and a durable knowledge archive.

Preferred workflow:

**inspect → implement → verify → review → checkpoint**

The repository and current Git state remain the strongest sources of truth.


### CP20 — Experience Excellence
**Complete.**

CP20 transformed the Lab from a polished archive toward a clearer engineering product without changing the Astro architecture.

Completed:
- homepage identity and information hierarchy
- project archive and case-study presentation
- reduced primary navigation with Garden grouping
- lifecycle/evidence visual language
- Garden discovery and provenance polish
- long-form reading improvements
- footer and internal navigation polish
- responsive metadata/media safeguards
- browser audit checks for visible interaction targets and keyboard focus

Verification:
- GitHub Actions Quality run 37583092301 passed
- 264 generated desktop/mobile browser cases passed
- repository validation and production build passed
- no paid or runtime infrastructure introduced


## CP21 — UX Reliability & Interaction Excellence
Complete the post-CP20 reliability pass before any future visual expansion. Scope includes interaction semantics, accessibility regression coverage, responsive validation, discovery improvements and long-form navigation. Future visual experimentation must preserve the restrained engineering identity and remain justified by UX value.


## CP22 — Content & Knowledge Architecture
**Complete at implementation level; final Quality verification pending.**
- project case-study metadata now records current focus, known problems and future work
- project intelligence renders those fields alongside architecture, decisions, lessons, linked knowledge and chronology
- connected knowledge remains repository-backed through existing `related:` references

## CP23 — Engineering Lab / Project Intelligence
**Complete at implementation level; final Quality verification pending.**
- project records now expose the full engineering record in one technical surface
- lifecycle, status, stack, architecture, objective, decisions, lessons, current focus, known problems, future work, evidence and chronology are represented without a runtime database

## CP24 — Discovery & Navigation
**Complete at implementation level; final Quality verification pending.**
- added `/explore` for full-text search across all published collections
- added type and topic filters with accessible pressed-state semantics
- added `/connections` for repository-backed knowledge hubs and connection-gap discovery
- sitemap includes the new discovery surfaces

## CP25 — Performance & Accessibility Excellence
**Complete at implementation level; final Quality verification pending.**
- existing 1120-case browser audit remains the primary interaction/accessibility gate
- added Playwright performance audit for LCP, CLS, TTFB, runtime external resources, script count and image contracts
- added structured WebSite metadata
- preserved zero-runtime analytics/monitoring architecture

## CP26 — Content Automation / Developer Workflow
**Complete at implementation level; final Quality verification pending.**
- added `npm run new:content -- <collection> <slug> --title "..."` scaffolding workflow
- templates encode collection-specific frontmatter and durable content sections
- validation, Astro diagnostics, build and browser/performance audits remain the publishing gate

## CP27 — Visual Identity Refinement
**Complete at implementation level; final Quality verification pending.**
- new discovery/intelligence surfaces follow the existing restrained typography, borders, spacing and semantic-status language
- no 3D/WebGL, particles, heavy animation, client framework, CMS or runtime visual system was introduced

The combined CP22–CP27 checkpoint is not considered fully released until the final GitHub Actions Quality run passes and the resulting Vercel production deployment is READY.


### Experience refinement checkpoint — implementation complete

The post-CP27 refinement pass implements the actionable parts of the external UX review without changing the architecture:
- specific engineering positioning and clearer homepage story
- repository-derived proof metrics
- simplified navigation terminology: Projects, Writing, Lab, Journey, About, Contact
- static keyboard command palette over published records
- project technology filtering alongside lifecycle/search filtering
- sticky navigation with preserved 44px interaction targets
- public contact surface using only verified GitHub identity
- static social-preview artwork and default Open Graph/Twitter image metadata
- homepage project problem framing, recent-work activity and stronger connection CTA
- contact added to sitemap

Not invented: email, LinkedIn, education, internship claims, personal metrics, testimonials or a fabricated resume credential set. The repository remains the source of truth and the site remains ₹0 / $0.
