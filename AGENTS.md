# Alok Engineering Lab — Agent Rules

## Purpose

Alok Engineering Lab is a long-lived personal Engineering Lab / digital garden. It is a public engineering record covering projects, writing, notes, experiments, evidence, timeline and changelog.

## Architecture invariants

- Public site: Astro 7 + Tailwind CSS 4 + MDX, statically generated.
- Git/GitHub is the source of truth and long-term memory.
- Vercel is the public deployment target.
- Keep the public site static; do not introduce a runtime CMS/database.
- Do not migrate Astro to Next.js without an explicit architecture decision.
- Keep the entire system ₹0 / $0.
- The admin is a separate management application and must never be required for the public site to build or publish.

## Content model

The authoritative validation schemas live in `src/content.config.ts`.
The typed tooling descriptor is `src/content/schema-metadata.ts`; it exists so management tooling can consume the repository contract without inventing collection-specific admin schemas.

Current collections:
- projects
- writing
- notes
- experiments
- evidence
- timeline
- changelog

Relationships use the repository-backed `related:` field and must remain valid.

Project lifecycle is historical data. Never silently replace `lifecycleHistory` with the current state.

## Validation and release gate

Before considering a change complete, run:

```bash
npm run validate
npm run check
npm run build
npm run audit
npm run audit:performance
```

The GitHub Actions Quality workflow is a release gate. Lighthouse targets are Performance >=95, Accessibility >=95, Best Practices >=95, SEO >=95, LCP <1500ms, CLS <=0 and INP <200ms.

If a metric cannot be measured reliably, document the limitation. Never fabricate a pass.

## Git discipline

- Never write directly to `master`.
- Work on a named branch.
- Keep commits small and meaningful.
- Never force-push.
- Never rewrite v1.0.0 history.
- Review the diff before merge.
- Production publishing must remain Git-backed, CI-gated and reversible.
- Do not commit generated audit output, secrets or local environment files without an explicit reason.

## Admin architecture

The admin lives separately from the public runtime and talks to GitHub through server-side APIs. It may create branches, commits and pull requests, but it must not mutate `master` directly or publish around CI.

Authentication must be single-user and server-side. GitHub credentials, OAuth secrets and session material must never reach browser JavaScript.

## Security

Never add:
- arbitrary shell execution
- arbitrary repository path writes
- unvalidated redirects
- secrets in source control
- client-side GitHub tokens
- unsafe MDX execution of user-controlled content

Treat filenames, URLs, Markdown and frontmatter as untrusted input.

## Documentation

Canonical project context:
- `docs/AI_HANDOFF.md`
- `docs/MASTER_CONTEXT.md`
- `docs/CURRENT_STATE.md`
- `docs/DECISIONS.md`
- `docs/ROADMAP.md`

Inspect the repository before modifying it. Prefer:
**inspect → implement → verify → review → checkpoint**.
