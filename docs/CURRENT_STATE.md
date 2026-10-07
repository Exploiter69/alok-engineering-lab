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

## Development rules
- Inspect before modifying.
- Preserve Astro architecture.
- Do not rewrite v1.0.0.
- Prefer small reviewable changes.
- Run appropriate checks.
- Use Git checkpoints.
- Keep the project at ₹0 / $0.
- Treat current repository/Git state as the strongest source of truth.
