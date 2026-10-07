# Alok Engineering Lab — Content Workflow

The repository is the publishing system. Content is created, reviewed and released through Git rather than a CMS.

## Create

Use:

```bash
npm run new:content -- projects my-project --title "My Project"
npm run new:content -- notes durable-boundary --title "A Durable Boundary"
npm run new:content -- writing technical-essay --title "A Technical Essay"
```

The generator creates a draft with collection-specific metadata and section structure.

## Develop

1. Replace template text with evidence-backed content.
2. Add tags that describe the real subject.
3. Add `related:` references to projects, knowledge, evidence or chronology.
4. For projects, keep objective, lifecycle, architecture, decisions, lessons, current focus, known problems and future work current.
5. Keep claims bounded by their evidence.

## Verify

Before publishing:

```bash
npm run validate
astro check
npm run build
npm run audit
npm run audit:performance
```

The GitHub Quality workflow runs the same repository/build/browser gates automatically.

## Relationship contract

`related:` is the canonical connection model. Do not create a second manual index or database.

A relationship must:

- use `collection:slug` syntax
- target an existing entry
- avoid duplicates
- avoid self-reference
- avoid unpublished/draft targets when the source is published

## Publishing

Change `status: draft` to the appropriate published state only after the content is complete and verified.

A normal release flow is:

```text
draft
  ↓
content review
  ↓
metadata / relationship validation
  ↓
Astro diagnostics
  ↓
production build
  ↓
1120+ case browser audit
  ↓
performance audit
  ↓
Git checkpoint
  ↓
GitHub
  ↓
Vercel
```

## Long-term rule

Do not add a CMS, database, paid API or runtime search service merely to make publishing easier. The Git repository already provides durable history, review, rollback and provenance.
