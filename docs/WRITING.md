# Technical Writing System

The Lab treats deep technical writing as an engineering workflow rather than a publishing quota.

## Workflow

1. **Source** — start from a real project decision, experiment, failure, benchmark or verification record.
2. **Frame** — choose a format: essay, case study, guide, postmortem or reference.
3. **Outline** — state the engineering question, constraints, evidence and conclusion before polishing prose.
4. **Draft** — explain the reasoning, not only the final implementation.
5. **Verify** — check technical claims against the repository and linked evidence.
6. **Publish** — mark the entry published only when the source and evidence boundaries are clear.
7. **Revisit** — update or archive writing when the underlying engineering record materially changes.

## Relationship rule

Project-derived writing should use the existing `related:` graph to point back to its source work. No second provenance field is needed.

## Format guidance

- **essay** — a durable engineering argument or principle.
- **case-study** — a project-derived explanation of a real system or evolution.
- **guide** — a reusable procedure or technique.
- **postmortem** — a failure, incident or recovery analysis.
- **reference** — a compact technical record intended for lookup.

The repository remains the source of truth. Writing can explain engineering work, but it must not silently become a substitute for the implementation or its evidence.
