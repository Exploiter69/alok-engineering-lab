# Alok Engineering Lab — AI Handoff

> Start here when a new AI chat/session needs to continue the project.

## Current project

Alok Engineering Lab is a long-term personal Engineering Lab, not just a portfolio.

Current stack:

- Astro
- Tailwind
- content collections / MDX-oriented content
- Git/GitHub
- Vercel
- custom domain: `alokthakur.me`

## Current release

`v1.0.0`

Current release commit:

`b0c61f8` — `feat: make v1 responsive`

Pre-responsive checkpoint:

`v1.0.0-pre-responsive`

Post-release HEAD at last session:

`5711e91` — `docs: establish project context system`

v1.1 implementation is in progress on top of this commit (uncommitted as of last session).

## Last known stopping point

Custom domain `alokthakur.me` is live. DNS configured through Namecheap.
Production URL: `https://www.alokthakur.me` (bare domain redirects to www).
Vercel deployment confirmed live and serving the current build.

v1.1 production readiness work (CP-1 through CP-4) was completed in the last session.
CP-5 final verification and commit are the remaining steps before tagging `v1.1.0`.

## What to do first

Do not assume the old chat description is still accurate.

First inspect the current repository and Git state.

Recommended checks:

```bash
cd ~/alok-engineering-lab
git status --short --branch
git log --oneline --decorate -5
git tag --list --sort=-version:refname | head
find . -maxdepth 2 -type f | sort
```

Then run the project's existing validation commands after inspecting `package.json`.

## Important rules

- Do not migrate Astro to Next.js without an explicit new decision.
- Do not rewrite v1.0.0 history.
- Do not blindly redesign working parts.
- Inspect before modifying.
- Prefer small, reviewable changes.
- Run checks after changes.
- Keep Git checkpoints.
- Keep the project at ₹0 / $0.
- Do not enable paid APIs or pay-as-you-go services.
- Treat the repository as the strongest source of truth.

## Context hierarchy

Repository → Git state → current user decisions → `docs/` → recent conversations → old conversations.

## If this session reaches its limit

The next session should read:

1. `docs/MASTER_CONTEXT.md`
2. `docs/CURRENT_STATE.md`
3. `docs/DECISIONS.md`
4. `docs/ROADMAP.md`
5. `docs/AI_HANDOFF.md`

Then inspect the actual repository before making changes.

At the end of a meaningful work session, update `CURRENT_STATE.md` and `AI_HANDOFF.md` if the durable project state changed.
