# Alok Engineering Lab — Current State

> Snapshot of the project at the last confirmed stopping point.

## Release

**Current release:** `v1.0.0`

**Release commit:** `b0c61f8` — `feat: make v1 responsive` (tag: v1.0.0)

**Post-release HEAD:** `5711e91` — `docs: establish project context system`

v1.1 implementation is in progress on top of this commit (uncommitted as of last session).

Reported Git state at v1.0.0 tag:

```text
master...origin/master
b0c61f8 (tag: v1.0.0) feat: make v1 responsive
79c0ef6 (tag: v1.0.0-pre-responsive) feat: establish engineering lab content foundation
5a6517f link content cards to detail pages
```

The `v1.0.0` tag was successfully pushed to GitHub.

## Confirmed v1 foundation

- Astro check completed successfully
- no reported errors, warnings or hints
- 15 static pages generated
- responsive/mobile work completed
- mobile navigation handled
- responsive typography/layout/content cards/grids/footer addressed
- `git diff --check` clean
- GitHub remote synchronized
- Vercel deployment live

## v1.1 work in progress

CP-1 (Structural), CP-2 (Metadata/SEO), CP-3 (UX Polish), and CP-4 (Documentation)
are complete. CP-5 (final verification and commit) is the remaining step.

Changes included in v1.1 (uncommitted):

- Duplicate `h1` removed from all six detail-page Markdown files
- `ContentCard` heading changed from `h2` to `h3`
- `projects/[slug].astro` layout restructured to match other detail pages
- Date display added to project detail page
- Back-navigation added to all six detail pages
- `/docs` removed from Navbar (route preserved)
- Branded `404.astro` created
- Full `<head>` metadata: description, canonical URL, favicon links, Open Graph, Twitter card
- `site: 'https://www.alokthakur.me'` added to `astro.config.mjs`
- System font stack replaces undeclared Inter reference in `global.css`
- Per-page descriptions wired from frontmatter on all detail pages
- `README.md` replaced with project-specific documentation

## Deployment

Production deployment is through Vercel.

Domain `alokthakur.me` is live. DNS configured through Namecheap.
Production URL: `https://www.alokthakur.me` (bare domain redirects to www).
Vercel deployment confirmed live and serving the current build (verified in Checkpoint B).

Do not randomly change nameservers or delete existing DNS records, especially mail/MX records.

Previously applied Vercel DNS values:

```text
A
Host: @
Value: 216.198.79.1

CNAME
Host: www
Value: 75a7cde743866b88.vercel-dns-017.com
```

## Existing project direction

The site contains or is designed around areas such as:

- Home
- Projects
- Writing
- Notes
- Experiments / Lab
- Garden
- Timeline
- Documentation (stub — not in navbar for v1.1)
- Changelog
- About (planned, not yet implemented)

The exact information architecture may evolve, but it should preserve the Engineering Lab concept.

## Next step

v1.1 CP-5 final verification:

1. Run `npm run build` — confirm 0 errors, 16 pages.
2. Run `git diff --check`.
3. Audit built HTML head tags.
4. Commit all v1.1 changes.
5. Tag `v1.1.0`.
6. Push to GitHub — Vercel will deploy automatically.
7. Verify production after deploy.
8. Update this document to reflect the completed v1.1 release.
