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

### Project archive
Six deep case studies: VAJRA, AstraUserbot, VGU Signal, TelDrive Lab, GeminiAgentBridge and Astra.

### Knowledge archive
Three technical essays, five durable notes and five focused experiments now form a substantive non-project knowledge layer.

### Journey and product surfaces
Timeline has meaningful CP4 milestones. Changelog records the CP4 checkpoint. Docs explains the Lab structure and engineering conventions. About explains identity and direction. Garden now provides type views and a topic index.

### Cross-linking
Projects, writing, notes and experiments use related-content metadata so the archive behaves as a connected system rather than isolated collections.

## CP5 status
CP5 Product Quality / UX Hardening is implemented at the repository level.

The hardening pass covered:
- shared metadata and canonical handling
- removal of the favicon as an implicit social-preview image
- explicit robots behavior with 404 noindex
- keyboard focus visibility across primary and related navigation
- semantic navigation labels
- deterministic Garden topic anchors
- consistent external-link security attributes
- current-direction About copy
- a zero-cost GitHub Actions build gate

A fresh local/browser validation against the current tree remains the final verification step before CP5 is declared fully closed.

## Next priorities
1. Finish CP5 verification against the current tree
2. CP6 — Release / Production Readiness
3. CP7 — Long-Term Maintenance

## Verification baseline
Previously confirmed local verification includes npm install, npm run build, Astro diagnostics with 0 errors/warnings/hints, 20 generated pages, and a 30/30 desktop/mobile browser audit. Earlier local verification covered the pre-CP5 tree. Current CP5 changes now have a repository CI build gate; the latest Vercel deployment check is still pending.

## Deployment
Production uses Vercel at alokthakur.me; DNS is managed through Namecheap.

## Development rules
- Inspect before modifying.
- Preserve Astro architecture.
- Do not rewrite v1.0.0.
- Prefer small reviewable changes.
- Run appropriate checks.
- Use Git checkpoints.
- Keep the project at ₹0 / $0.
- Treat current repository/Git state as the strongest source of truth.