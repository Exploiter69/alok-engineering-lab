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
**Complete.** Established the restrained engineering aesthetic, typography-led hierarchy, black canvas, thin rules, technical labels, responsive spacing and minimal decoration.

### CP2 — Information Architecture
**Complete.** Established Projects, Writing, Notes, Experiments and Timeline as primary areas, with Garden, Changelog, Docs and About as supporting areas.

### CP3 — Visual / UX Refinement
**Complete.** Refined homepage, collection/detail pages, metadata, responsive behavior and mobile layouts.

### CP4.1 — Content + Discovery Foundation
**Complete.** Established initial content depth, related-content support, Garden, timeline/release milestones and browser quality auditing.

### CP4.2 — Engineering Archive Curation
**Complete.** Curated six substantial engineering projects from current repository evidence and added repository provenance.

### CP4.3 — Deep Engineering Case Studies
**Complete.** Six projects now explain problem, constraints, architecture, engineering evolution, verification/safety boundaries, current state and lessons.

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

## CP6 — Release / Production Readiness
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

## CP7 — Long-Term Maintenance
**Complete at the repository level.**

Completed:
- build-blocking content relationship validation
- maintenance and release discipline documentation
- durable content-integrity note
- CP7 changelog entry
- zero-cost verification preserved

CP7 establishes the maintenance contract rather than adding infrastructure for its own sake.

## CP8 — Continued Engineering Growth
**Next.**

Grow the archive through real projects, experiments, writing, notes and milestones. Repeat the verification loop after meaningful structural changes and only add new system complexity when a demonstrated product need justifies it.

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
