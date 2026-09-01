# Alok Engineering Lab — Current State

> Snapshot of the project at the last confirmed stopping point.

## Release

**Current release:** `v1.0.0`

**HEAD / release commit:** `b0c61f8` — `feat: make v1 responsive`

Reported Git state:

```text
master...origin/master
b0c61f8 (HEAD -> master, tag: v1.0.0, origin/master)
79c0ef6 (tag: v1.0.0-pre-responsive) feat: establish engineering lab content foundation
5a6517f link content cards to detail pages
```

The `v1.0.0` tag was successfully pushed to GitHub.

## Confirmed v1 foundation

Previous development reported:

- Astro check completed successfully
- no reported errors, warnings or hints
- 15 static pages generated
- responsive/mobile work completed
- mobile navigation handled
- responsive typography/layout/content cards/grids/footer addressed
- `git diff --check` clean
- GitHub remote synchronized
- Vercel deployment live

## Deployment

Production deployment is through Vercel.

The custom Namecheap domain was the last external setup item.

At the stopping point, Namecheap was under maintenance, so DNS work was paused.

Do not randomly change nameservers or delete existing DNS records, especially mail/MX records.

Previously supplied Vercel DNS values were:

```text
A
Host: @
Value: 216.198.79.1

CNAME
Host: www
Value: 75a7cde743866b88.vercel-dns-017.com
```

These values must be rechecked against the current Vercel/Namecheap UI before applying them.

## Existing project direction

The site contains or was designed around areas such as:

- Home
- Projects
- Writing
- Notes
- Experiments / Lab
- Garden
- Timeline
- Documentation
- Changelog
- About

The exact information architecture may evolve, but it should preserve the Engineering Lab concept.

## Next step

Before implementing v1.1:

1. Inspect the actual current repository.
2. Run the relevant checks.
3. Compare actual code against this context.
4. Identify drift, bugs or unfinished work.
5. Decide the v1.1 scope.
6. Implement incrementally with Git checkpoints.
