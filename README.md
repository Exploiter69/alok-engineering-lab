# Alok Engineering Lab

Personal engineering laboratory and public knowledge record.

**Live:** [alokthakur.me](https://www.alokthakur.me)

**Stack:** Astro · Tailwind CSS · MDX · Vercel

## What this is

A long-term personal engineering lab documenting projects, technical writing,
experiments, notes, timeline and changelog.

## Development

```bash
npm install
npm run dev          # local dev server at localhost:4321
npm run build        # type-check + production build
npm run preview      # preview production build locally
```

## Project structure

```
src/
  content/     ← Markdown/MDX content (collections)
  pages/       ← Routes (Astro file-based routing)
  components/  ← Reusable Astro components
  layouts/     ← Page layout wrapper
  data/        ← Site configuration
  styles/      ← Global CSS
docs/          ← Project context and AI handoff documents
```

## Content

Content is managed through Astro content collections in `src/content/`.
Add new entries as `.md` or `.mdx` files in the appropriate subdirectory.

Collections: `projects` · `writing` · `notes` · `experiments` · `timeline` · `changelog`

## Release

Current release: `v1.0.0`
