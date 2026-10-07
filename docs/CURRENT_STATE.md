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

Fresh local verification against the current tree passed: `npm run build` completed with 0 errors and generated 41 pages. The only diagnostic was one non-blocking Zod deprecation hint for `z.string().url()`.

## CP6 status
CP6 Release / Production Readiness is implemented and in final automated verification.

Implemented:
- browser audit discovers every generated HTML route instead of a fixed sample list
- GitHub Actions runs build plus Chromium browser audit
- generated XML sitemap at `/sitemap.xml`
- explicit `robots.txt`
- production changelog entry
- Vercel deployment for the current checkpoint verified successful

Remaining release gate:
- confirm the new GitHub browser-audit run passes
- record the final release checkpoint/tag

## Deployment
Production is configured for Vercel with `www.alokthakur.me` as the canonical site URL and Namecheap as the registrar/DNS provider. The repository's current Vercel deployment status is successful; live DNS/domain probing is not available from the current execution environment.

## Verification baseline
The repository already contains a Playwright-based visual/quality audit. CP6 upgrades it to cover every generated HTML route and run automatically after the production build.

## Development rules
- Inspect before modifying.
- Preserve Astro architecture.
- Do not rewrite v1.0.0.
- Prefer small reviewable changes.
- Run appropriate checks.
- Use Git checkpoints.
- Keep the project at ₹0 / $0.
- Treat current repository/Git state as the strongest source of truth.
