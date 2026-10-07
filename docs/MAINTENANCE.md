# Alok Engineering Lab — Maintenance

The Lab is intended to remain small, durable and inspectable over many years.

## Verification contract

Every meaningful content or structural change should pass these layers:

1. content relationship validation
2. Astro diagnostics
3. production build
4. generated-route browser audit
5. Git checkpoint

The normal local gate is:

```text
npm run build
npm run audit
```

GitHub Actions runs the production build and browser audit automatically.

## Content integrity

Content relationships use the canonical form:

```text
collection:entry-id
```

For example:

```text
projects:astra
writing:verification-first-engineering
notes:complexity-budget
```

Every relationship target must exist in the repository. Missing, malformed, unknown or self-referential targets are treated as verification failures rather than silently disappearing from the site.

## Adding knowledge

Prefer durable engineering value over volume.

- Add a project when there is a meaningful system to archive.
- Add writing when an idea has enough evidence to explain clearly.
- Add a note when a principle or observation is worth retaining independently.
- Add an experiment when there is a real question, setup, observation and result.
- Add timeline or changelog entries for meaningful milestones rather than individual commits.

## Complexity rule

Do not introduce infrastructure merely because it is conventional.

The Lab remains:

- Astro-first
- static/content-driven
- ₹0 / $0
- dependency-light
- inspectable
- free of unnecessary databases, CMSs, queues, analytics and client-side state

New complexity must solve a demonstrated problem.

## Release discipline

Do not rewrite the `v1.0.0` history.

Future checkpoints should move forward through normal commits and releases. If a release tag cannot be created through an available integration, do not simulate one with a branch.

## Maintenance cadence

Repeat the full verification loop after meaningful structural changes. Revisit content quality periodically, but do not manufacture changes simply to make the repository look active.

The goal of maintenance is to preserve trust in the archive while allowing the archive to grow naturally.
