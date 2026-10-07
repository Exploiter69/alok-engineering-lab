# Alok Engineering Lab

Personal engineering laboratory and public knowledge record.

**Public site:** https://www.alokthakur.me  
**Repository:** https://github.com/Exploiter69/alok-engineering-lab

**Stack:** Astro 7 · Tailwind CSS 4 · MDX · TypeScript · Git/GitHub · Vercel

## What this is

A long-term Engineering Lab / digital garden documenting projects, technical writing, engineering notes, experiments, evidence, timeline and changelog.

The public site is deliberately static:

```
Git repository
   ↓
Astro build
   ↓
Vercel
   ↓
static public site
```

Git is the memory. The management layer must never become a second source of truth.

## Content

Current collections:

- Projects
- Writing
- Notes
- Experiments
- Evidence
- Timeline
- Changelog

Content lives under `src/content/` and is validated by the repository's build-time gates.

## Development

```bash
npm ci
npm run dev
npm run validate
astro check
npm run build
npm run audit
npm run audit:performance
```

For a complete local quality pass:

```bash
npm run check
```

## Admin

The admin is a separate application under `admin/`. It is a GitHub-backed control plane for repository content and publishing; it is not a runtime CMS.

Normal publication flow:

```
Admin
  ↓
branch
  ↓
commit
  ↓
GitHub Actions
  ↓
Vercel preview
  ↓
review diff
  ↓
merge
  ↓
master
  ↓
static production
```

Admin deployment/configuration and recovery instructions live under `docs/admin/`.

## Zero-cost rule

The project is permanently **₹0 / $0**. Do not introduce paid APIs, databases, CMS products, analytics, paid monitoring or pay-per-use AI.

## Recovery

If the admin is unavailable, edit content directly in a Git branch, run the repository validation/build/audit gates, review the diff, and merge through the normal GitHub workflow. Git remains authoritative.

## Project documentation

Read these before engineering work:

- `docs/AI_HANDOFF.md`
- `docs/MASTER_CONTEXT.md`
- `docs/CURRENT_STATE.md`
- `docs/DECISIONS.md`
- `docs/ROADMAP.md`

## Stable baseline

The v1.0.0 history is preserved and must not be rewritten.
