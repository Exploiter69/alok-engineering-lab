# Alok Engineering Lab — CP2 Information Architecture

**Status:** Final Candidate — Pending Lock
**Phase:** CP2 — Information Architecture
**Implementation Status:** Not Started
**Architecture:** Astro + Tailwind CSS + MDX / Content Collections
**Current Repository Baseline:** `c4e444c`
**Budget Constraint:** ₹0 / $0
**Prerequisite:** CP0 UI/UX Audit complete; CP1 Design System complete and locked
**Principle:** Information architecture first, implementation second

---

# 0. Executive Decision

Alok Engineering Lab must **not** become a conventional portfolio, blog, or documentation website.

It is a **personal Engineering Lab and connected knowledge system**.

The site contains several different content domains, each with a distinct purpose, while allowing meaningful connections between them.

```text
                    ALOK ENGINEERING LAB
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
        BUILD               LEARN              JOURNEY
          │                   │                   │
      Projects          Writing / Notes       Timeline
      Experiments          Garden             Changelog
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
                     Documentation / Docs
```

The fundamental architectural principle is:

> **Content types are different representations of the same engineering journey, not isolated islands.**

The homepage acts as the curated front door.

Collection pages act as archives.

Detail pages act as canonical content.

Relationships connect meaningful pieces of knowledge.

Garden provides a future discovery layer rather than becoming another duplicate content collection.

The architecture remains deliberately simple:

```text
Astro
+
Content Collections
+
MDX
+
Static Rendering
+
Git
```

No database, CMS, external API, paid service, or complex client-side infrastructure is required for CP2.

---

# 1. CP2 Goals

CP2 has eight goals.

## G1 — Establish a clear mental model

A visitor should understand quickly:

> What is this website?

The answer should be:

> **Alok's personal Engineering Lab — a place where engineering work, experiments, learning, writing, and progress are documented.**

---

## G2 — Make navigation predictable

A visitor should always be able to determine:

* where they are
* what section they are in
* how to go deeper
* how to return
* what related material exists

---

## G3 — Separate content by purpose

Content types must exist because they answer different questions.

| Content Type | Primary Question                               |
| ------------ | ---------------------------------------------- |
| Projects     | What am I building?                            |
| Experiments  | What am I testing or exploring?                |
| Writing      | What do I want to explain?                     |
| Notes        | What did I notice, learn, or want to remember? |
| Timeline     | How did my engineering journey evolve?         |
| Changelog    | What changed in the Lab/site?                  |
| Docs         | Where is the deep technical reference?         |
| Garden       | What knowledge is connected?                   |

---

## G4 — Connect knowledge

A meaningful project may have:

* experiments
* notes
* writing
* timeline events
* documentation

associated with it.

For example:

```text
ASTRA Engine
│
├── Project
├── Experiments
├── Writing
├── Notes
├── Timeline
└── Documentation
```

The architecture must allow these relationships to grow naturally.

---

## G5 — Preserve implementation simplicity

CP2 must preserve the existing architecture.

Do not introduce:

* databases
* CMS platforms
* authentication
* external APIs
* paid services
* search infrastructure
* graph databases
* unnecessary client-side state
* framework migration

Astro Content Collections remain the foundation.

---

## G6 — Scale over time

The IA should remain understandable if the Lab eventually contains:

```text
100+ projects
300+ writings
500+ notes
100+ experiments
many timeline events
many documentation pages
```

Scaling should occur primarily through organization and discovery rather than increasing architectural complexity.

---

## G7 — Preserve the engineering journey

The site should answer three fundamental questions:

> **What did I build?**

> **What did I learn?**

> **How did I get here?**

---

## G8 — Progressive complexity

The architecture should support future capabilities without implementing them prematurely.

Future possibilities include:

* richer cross-linking
* search
* knowledge exploration
* graph-like discovery
* richer project case studies
* interactive engineering visualizations

These are **future layers**, not automatic CP2 requirements.

---

# 2. Core Information Architecture

The top-level information architecture is:

```text
/
│
├── projects/
│   ├── index
│   └── [slug]
│
├── writing/
│   ├── index
│   └── [slug]
│
├── notes/
│   ├── index
│   └── [slug]
│
├── experiments/
│   ├── index
│   └── [slug]
│
├── timeline/
│   ├── index
│   └── [slug]
│
├── garden/
│   └── index
│
├── changelog/
│   ├── index
│   └── [slug]
│
├── docs/
│   └── index
│
└── about/
    └── index
```

Not every route is a primary navigation destination.

The IA distinguishes between:

```text
Primary destinations
Secondary destinations
Contextual destinations
Utility/reference destinations
```

This prevents the navbar from becoming an index of every system in the website.

---

# 3. Primary Navigation

## 3.1 Final proposed primary navigation

```text
Home
Projects
Writing
Notes
Experiments
Timeline
```

On desktop:

```text
Alok Engineering Lab

Projects   Writing   Notes   Experiments   Timeline
```

The brand/logo links to `/`.

A separate `Home` text item is optional and should not be required if the brand already provides an obvious home route.

---

## 3.2 Why Timeline belongs in primary navigation

Timeline is an important part of the Engineering Lab identity.

It provides something the other collections cannot:

> chronological context.

It answers:

> How did this Lab evolve?

Therefore Timeline is more important than a purely utility-oriented route such as Docs or Changelog.

---

## 3.3 Why Garden is not primary navigation initially

Garden is not intended to be another archive.

Its role is discovery and connection.

Until the Garden has enough meaningful connected knowledge to justify being a major destination, it should remain accessible through contextual navigation and the footer.

---

## 3.4 Why About is not mandatory in the primary navigation

About is a supporting identity page rather than a core content domain.

It may eventually be included in the navbar if the page becomes important enough.

CP2 does not require forcing About into the primary navigation before its content is ready.

---

# 4. Secondary Navigation

The following destinations remain available outside the primary navbar.

## Timeline

Primary navigation destination.

Also discoverable from:

* homepage Journey section
* project pages
* About
* related content

---

## Garden

Accessible through:

* footer
* Notes
* related-content areas
* future discovery interfaces

---

## Changelog

Accessible through:

* footer
* release references
* project/site history
* contextual links

---

## Docs

Accessible through:

* footer
* project pages
* technical references
* contextual links

The existing decision to keep `/docs` available while not placing it in the main navbar is preserved.

---

## About

Accessible through:

* footer
* optional navbar placement later
* homepage identity/context where appropriate

---

# 5. Homepage Architecture

The current homepage integration at `c4e444c` already establishes the correct direction.

The homepage hierarchy is:

```text
Identity
    ↓
Currently
    ↓
Selected Work
    ↓
From the Lab
    ↓
Knowledge
    ├── Writing
    └── Notes
    ↓
Journey
```

The homepage is a **curated gateway**, not an archive.

---

## 5.1 Identity

Purpose:

Immediately communicate:

* who
* what
* why

Current conceptual structure:

```text
Alok Thakur · Engineering Lab

Building systems.
Exploring technology.
Documenting the journey.
```

---

## 5.2 Currently

Purpose:

Communicate what is happening now.

```text
Currently = present
Timeline  = history
```

This distinction must remain explicit.

The current `SITE.currently` mechanism is therefore an appropriate foundation.

---

## 5.3 Selected Work

Show approximately:

```text
2–4 projects
```

Purpose:

Answer:

> What does Alok build?

The homepage project cards are previews of canonical project pages.

---

## 5.4 From the Lab

Show approximately:

```text
2–3 experiments
```

Purpose:

Demonstrate that the Lab includes exploration, not only polished finished work.

---

## 5.5 Knowledge

Two primary views:

```text
Writing
Notes
```

Writing communicates deliberate explanations.

Notes communicate lightweight ongoing knowledge capture.

---

## 5.6 Journey

Show approximately:

```text
2–3 timeline entries
```

Purpose:

Provide a compact sense of progression.

A visitor can then enter the full Timeline.

---

# 6. Content-Type Model

Each content type has exactly one primary responsibility.

---

# 6.1 Projects

## Definition

A Project represents a meaningful engineering system, application, tool, or substantial body of work.

Examples:

```text
ASTRA Engine
Alok Engineering Lab
Future automation systems
```

## Primary question

> **What am I building?**

## Projects may contain

* overview
* purpose
* current state
* technical approach
* stack
* implementation details
* lessons
* links
* related content

The exact metadata/schema must be determined from the current repository before implementation.

CP2 defines the information architecture, not an arbitrary new schema.

---

# 6.2 Experiments

## Definition

An Experiment represents an exploration where the outcome is uncertain.

Examples:

```text
Testing a local AI workflow
Exploring Linux configuration
Testing an automation approach
Exploring rendering techniques
```

## Primary question

> **What am I trying to discover?**

Core distinction:

```text
Project:
"I am building this."

Experiment:
"I am testing whether this works."
```

An experiment may eventually contribute to a project, writing, note, or other content.

---

# 6.3 Writing

## Definition

Writing represents deliberate, relatively polished technical communication.

Examples:

```text
How ASTRA works
Understanding Linux namespaces
Lessons from building X
Engineering architecture explanations
```

## Primary question

> **What do I want to explain?**

Writing has a higher publishing threshold than Notes.

---

# 6.4 Notes

## Definition

Notes represent lightweight engineering knowledge.

Examples:

```text
Command reference
Debugging observation
Small discovery
Architecture thought
Research note
Useful concept
```

## Primary question

> **What did I notice, learn, or want to remember?**

Notes should have lower publishing friction than Writing.

This is important to the Engineering Lab because continuous documentation should be easy.

---

# 6.5 Garden

## Definition

Garden represents **connected knowledge discovery**.

It is not initially a competing article collection.

Conceptually:

```text
Garden
│
├── Notes
├── Experiments
├── Ideas
├── References
└── Relationships
```

## CP2 decision

**Garden should initially be a discovery/navigation layer over existing content.**

Do not create a completely separate Garden collection merely to populate `/garden`.

This prevents:

```text
Notes
+
Garden Notes
+
Writing
+
Garden Writing
```

which would create unnecessary duplication.

Garden may become a richer interface later when the amount of interconnected knowledge justifies it.

---

# 6.6 Timeline

## Definition

Timeline represents chronological milestones in the Engineering Lab and engineering journey.

## Primary question

> **How did the journey evolve?**

Examples:

```text
Started Engineering Lab
Built ASTRA foundation
Learned a new technology
Released a major project version
Started a new experiment
```

Timeline events should point toward related content rather than duplicate entire project descriptions.

---

# 6.7 Changelog

## Definition

Changelog records changes to the Lab/site itself.

## Primary question

> **What changed?**

Distinction:

| System    | Question                      |
| --------- | ----------------------------- |
| Timeline  | What happened in my journey?  |
| Changelog | What changed in the Lab/site? |

Some events may appear conceptually in both systems, but their purpose remains different.

---

# 6.8 Docs

## Definition

Docs represent deep technical reference material.

Potential content:

```text
Architecture
Technical specifications
Project references
Engineering decisions
System documentation
```

Docs are reference-oriented rather than narrative.

The existing `/docs` route remains valid.

---

# 6.9 About

## Definition

About explains the person and philosophy behind the Lab.

It should answer:

```text
Who is Alok?
What does he build?
What does he enjoy learning?
Why does the Lab exist?
What is the Lab's philosophy?
```

It should not become a generic resume dump.

Conceptual structure:

```text
About
│
├── Identity
├── Engineering interests
├── Lab philosophy
└── Journey → Timeline
```

About remains a supporting page until meaningful content exists.

---

# 7. URL Architecture

URLs should remain predictable, stable, and intentionally boring.

```text
/
 /projects
 /projects/astra

 /writing
 /writing/example

 /notes
 /notes/example

 /experiments
 /experiments/example

 /timeline
 /timeline/example

 /garden

 /changelog
 /changelog/example

 /docs

 /about
```

Avoid unnecessary nesting.

Avoid URLs such as:

```text
/blog/engineering/2026/09/example
```

unless a genuine architectural requirement emerges.

---

# 8. Slug Strategy

Use stable, human-readable slugs.

Good:

```text
/projects/astra
/writing/building-a-local-ai-system
/notes/astro-content-collections
/experiments/testing-local-llms
```

Avoid dates in URLs unless there is a strong reason.

Prefer:

```text
/projects/astra
```

over:

```text
/projects/2026-09-02-astra
```

Dates belong in metadata.

Changing a published slug should be treated as a deliberate migration because URLs are long-term identifiers.

---

# 9. Collection-to-Route Relationship

Major content collections should follow an understandable one-to-one model:

```text
Collection       Index                 Detail

projects    →    /projects        →    /projects/[slug]

writing     →    /writing         →    /writing/[slug]

notes       →    /notes           →    /notes/[slug]

experiments →    /experiments     →    /experiments/[slug]

timeline    →    /timeline        →    /timeline/[slug]
```

Supporting systems may differ:

```text
garden      →    /garden
docs        →    /docs
changelog   →    /changelog
about       →    /about
```

The architecture should not force every route into an identical technical implementation merely for symmetry.

---

# 10. Canonical Content Principle

Every published content item must have one canonical home.

For example:

```text
/projects/astra
```

is the canonical Project page.

The homepage card:

```text
Selected Work → ASTRA
```

is only a preview.

Likewise:

```text
/writing/example
```

is canonical.

A homepage Writing card is only a discovery mechanism.

This prevents duplicated content.

---

# 11. Content Hierarchy

The general hierarchy is:

```text
Site
 ↓
Section
 ↓
Collection Index
 ↓
Content Card / List Item
 ↓
Detail Page
 ↓
Related Content
```

Example:

```text
/projects
      ↓
ASTRA card
      ↓
/projects/astra
      ↓
Related Writing
Related Notes
Related Experiments
Related Timeline
```

This pattern should be reused across the major content domains.

---

# 12. Cross-Linking Architecture

Connected content is a core long-term capability.

The preferred approach is **explicit references**, not a graph database.

Conceptually:

```yaml
related:
  - projects/astra
  - writing/example
  - notes/example
```

However:

> **Do not implement a `related` field until the actual content schema has been inspected and the exact representation has been approved.**

CP2 defines the relationship architecture.

Implementation comes afterward.

---

# 13. Relationship Philosophy

Relationships must be meaningful.

Do not implement:

```text
Everything links to everything.
```

Prefer semantic relationships:

```text
ASTRA
│
├── explained by → Writing
├── explored through → Experiment
├── remembered through → Note
├── documented by → Docs
└── occurred during → Timeline
```

The relationship itself should provide context.

---

# 14. Discovery Model

Content discovery should operate at multiple levels.

```text
Level 1
Navigation
      ↓
Level 2
Collection Index
      ↓
Level 3
Content Cards
      ↓
Level 4
Detail Page
      ↓
Level 5
Related Content
```

This creates:

```text
Browse
  ↓
Read
  ↓
Explore
  ↓
Discover
```

Search is not required to make the architecture discoverable at current scale.

---

# 15. Search

Search is **not part of CP2 implementation**.

The IA should nevertheless remain compatible with future search.

Because content remains structured in Astro collections, a future search layer can index:

```text
Projects
Writing
Notes
Experiments
Timeline
Docs
```

without replacing the underlying architecture.

---

# 16. Metadata Principles

CP2 should establish conceptual consistency without forcing every collection into one identical schema.

Conceptually, many content types may share:

```text
title
description
date
status
```

while type-specific content can have additional metadata.

For example:

```text
PROJECT
├── title
├── description
├── date
├── status
└── stack

WRITING
├── title
├── description
├── date
├── status
└── tags

NOTE
├── title
├── description
├── date
├── status
└── tags
```

However:

> **The actual repository schema is authoritative.**

CP2 implementation must first inspect:

```text
src/content/
src/content/config.*
```

and existing frontmatter.

Do not redesign schemas based solely on this conceptual model.

---

# 17. Status Semantics

The current implementation already filters drafts using the content status.

The minimum conceptual distinction is:

```text
draft
published
```

Additional states may exist where genuinely useful:

```text
active
archived
experimental
```

But CP2 should not create a large state machine unnecessarily.

The principle is:

> Use the smallest status vocabulary that accurately describes the content.

---

# 18. Date Semantics

Dates must have an understandable meaning.

For Writing:

```text
date = publication/content date
```

For Timeline:

```text
date = chronological event date
```

For Projects, the meaning must be determined by the actual content model.

If multiple project dates become necessary, they should be explicit:

```text
started
updated
released
```

Do not silently assign different meanings to the same `date` field.

---

# 19. Collection Index Architecture

Each major collection index should provide a consistent information structure:

```text
Section label
      ↓
Page title
      ↓
Short explanation
      ↓
Content list/grid
```

Example:

```text
WORK

Projects

Engineering systems and substantial
work built, explored, or maintained.

[ ASTRA ]
[ ... ]
```

CP2 defines the information hierarchy.

CP1 remains authoritative for visual treatment.

---

# 20. Detail Page Architecture

Major detail pages should follow a consistent structural hierarchy:

```text
Back navigation
      ↓
Content type
      ↓
Title
      ↓
Description
      ↓
Metadata
      ↓
Content
      ↓
Related content
      ↓
Collection navigation
```

Example:

```text
← Projects

PROJECT

ASTRA Engine

Autonomous engineering system...

ACTIVE · Python · ...

[content]

Related
...
```

The exact visual design belongs to CP1 and implementation.

CP2 defines the information order only.

---

# 21. Navigation Back to Parent

Complex breadcrumbs are not required.

For the current depth of the Lab:

```text
← Projects
```

is sufficient.

This is preferable to adding elaborate breadcrumb infrastructure before the information hierarchy becomes deep enough to require it.

---

# 22. Footer Architecture

The footer should provide secondary navigation.

Conceptually:

```text
Alok Engineering Lab

Engineering work, experiments,
learning and documentation.

Explore
Projects
Writing
Notes
Experiments
Timeline
Garden
Changelog
Docs
About

Elsewhere
GitHub
LinkedIn

© Alok Thakur
```

Only destinations that actually exist should be displayed.

Empty social/contact values must not generate empty links.

The footer is a discovery mechanism, not a duplicate primary navbar.

---

# 23. Mobile Information Architecture

There is only **one information architecture**.

Desktop and mobile must not have separate content hierarchies.

```text
Desktop IA
     =
Mobile IA
```

Only presentation and interaction change.

Mobile navigation may collapse into a menu, but the destination hierarchy remains identical.

---

# 24. Accessibility Requirements

The IA must remain understandable without relying on visual styling.

Implementation must preserve:

* one clear primary `h1`
* logical heading hierarchy
* meaningful link text
* keyboard-accessible navigation
* accessible mobile navigation
* no confusing nested interactive elements
* metadata that does not rely solely on color
* predictable page structure

These are implementation verification requirements rather than visual-design decisions.

---

# 25. SEO Implications

CP2 must preserve the existing metadata system established during the previous release work.

Each canonical content page should maintain:

```text
unique title
unique description
canonical URL
```

CP2 must not unnecessarily redesign the existing head/SEO architecture.

Information architecture should produce stable, understandable URLs.

---

# 26. Performance Architecture

CP2 introduces no new client-side content infrastructure.

Preferred architecture:

```text
Astro
+
Content Collections
+
MDX
+
Static HTML
```

Avoid introducing:

```text
client-side content database
heavy navigation JavaScript
third-party CMS
runtime search service
external content API
```

This preserves:

* performance
* simplicity
* maintainability
* zero-cost operation

---

# 27. Garden Strategy

Garden deserves an explicit decision.

## CP2 decision

Garden is initially:

> **A discovery layer over existing knowledge.**

It is not initially:

```text
another article collection
```

and not:

```text
another Notes collection
```

Possible future Garden capabilities include:

```text
Topic exploration
Related knowledge
Connected notes
Experiments
References
Ideas
Graph-like navigation
```

These capabilities should only be implemented when enough content exists to make them useful.

---

# 28. 3D and Visual Effects

3D, WebGL, advanced motion, and visual effects are **not part of CP2**.

The information architecture must not be designed around decorative technology.

Future visualizations may be valuable when they communicate engineering concepts.

Examples:

```text
ASTRA architecture visualization
Project dependency visualization
Engineering timeline visualization
Knowledge relationship visualization
Interactive system diagrams
```

The principle is:

> **Visualization should explain or enhance engineering content, not compete with it.**

CP2 therefore establishes the information structure first.

Any future visual layer must remain compatible with CP1's locked design system.

---

# 29. Future Knowledge Graph

The IA intentionally prepares for future graph-like exploration.

Conceptually:

```text
                  ASTRA
                 /  |  \
                /   |   \
               /    |    \
          Writing  Notes  Experiments
              \      |      /
               \     |     /
                 Timeline
```

Garden may eventually become the interface through which these relationships are explored.

But:

> **Graph visualization is a future capability, not CP2 implementation.**

No graph database is required.

---

# 30. Content Lifecycle

Content may conceptually evolve through:

```text
IDEA
  ↓
DRAFT
  ↓
PUBLISHED
  ↓
UPDATED
  ↓
ARCHIVED
```

Not every content item must pass through every stage.

The purpose is to support long-lived documentation without forcing every collection into an identical workflow.

---

# 31. Publishing Philosophy

The Lab should make publishing knowledge easy.

A possible evolution is:

```text
Observation
    ↓
Note
    ↓
Experiment
    ↓
Writing
    ↓
Project knowledge
```

But this is **not a mandatory pipeline**.

Content may originate anywhere.

For example:

```text
Note
"Trying local LLM X"

        ↓

Experiment
"Testing X for ASTRA"

        ↓

Writing
"What I learned"

        ↓

Project
"ASTRA implementation"
```

The relationship between these items should be meaningful rather than artificially sequential.

---

# 32. Primary vs Supporting Systems

The final conceptual hierarchy is:

```text
PRIMARY CONTENT DOMAINS
│
├── Projects
├── Experiments
├── Writing
└── Notes

JOURNEY
│
└── Timeline

SUPPORTING KNOWLEDGE SYSTEMS
│
├── Garden
├── Docs
└── Changelog

IDENTITY
│
└── About

CURATED ENTRY POINT
│
└── Home
```

This is the clearest representation of the Lab.

---

# 33. CP2 Scope

CP2 implementation may address:

```text
Navigation hierarchy
Collection/index consistency
Detail-page information hierarchy
Route consistency
Content-type boundaries
Garden positioning
Supporting navigation
Cross-linking foundation
Content metadata alignment
About information architecture
```

Only changes required to establish the approved IA should be made.

---

# 34. CP2 Non-Goals

The following are explicitly outside CP2:

```text
❌ Search implementation
❌ Analytics
❌ Newsletter
❌ CMS
❌ Authentication
❌ Comments
❌ AI chatbot
❌ Database
❌ Graph database
❌ External APIs
❌ Paid services
❌ Framework migration
❌ Major visual redesign
❌ New design system
❌ 3D/WebGL system
❌ Decorative animation system
```

Future work may propose these separately.

---

# 35. CP2 Implementation Checkpoints

After this specification is locked, implementation should proceed incrementally.

## CP2.1 — Global Navigation

Review and implement only:

```text
Navbar
Footer
Mobile navigation
Primary/secondary hierarchy
```

Verify existing routes before changing links.

---

## CP2.2 — Collection Architecture

Review:

```text
/projects
/writing
/notes
/experiments
/timeline
```

Ensure their information hierarchy is consistent while preserving their distinct purposes.

---

## CP2.3 — Detail Architecture

Review:

```text
/projects/[slug]
/writing/[slug]
/notes/[slug]
/experiments/[slug]
/timeline/[slug]
```

Ensure:

```text
parent navigation
content type
title
description
metadata
content
related content
```

appear in an understandable order.

---

## CP2.4 — Content Schema Audit

Inspect the actual repository:

```text
src/content/
src/content/config.*
```

and existing frontmatter.

Only then determine whether metadata changes are necessary.

---

## CP2.5 — Relationship Foundation

Implement the smallest useful relationship mechanism if the current content volume justifies it.

Do not introduce graph infrastructure.

Do not create a universal relationship schema without evidence.

---

## CP2.6 — Garden

Implement Garden as a discovery layer only if the existing content provides enough useful material.

If not, preserve `/garden` as a future-ready route rather than manufacturing content merely to populate it.

---

## CP2.7 — About

Implement `/about` when meaningful content is ready.

Do not create a generic placeholder page merely to satisfy the IA diagram.

---

## CP2.8 — Verification

Run:

```bash
npm run build
```

and:

```bash
git diff --check
```

Then perform route and visual verification.

---

# 36. Git Safety Model

Every implementation checkpoint should be reviewable.

Preferred cycle:

```text
Inspect
  ↓
Make small change
  ↓
Build
  ↓
Review diff
  ↓
Visual verification
  ↓
Git checkpoint
```

Do not combine unrelated CP2 changes into one uncontrolled edit.

The existing v1.0.0 history must remain untouched.

---

# 37. Repository Authority

When implementing CP2, information sources must be trusted in this order:

```text
1. Actual repository code
2. Actual Git state
3. Explicit current project decisions
4. Canonical project documentation
5. Current approved CP2 specification
6. Older conversations
```

If this specification conflicts with the actual repository, the conflict must be investigated before implementation.

The repository is the strongest source of truth.

---

# 38. CP2 Acceptance Criteria

CP2 is complete when the approved information architecture is represented correctly in the implementation.

## Navigation

* [ ] Primary navigation is small and understandable.
* [ ] Projects are discoverable.
* [ ] Writing is discoverable.
* [ ] Notes are discoverable.
* [ ] Experiments are discoverable.
* [ ] Timeline is discoverable.
* [ ] Secondary destinations remain accessible.
* [ ] Mobile preserves the same IA.
* [ ] No dead navigation links exist.

## Content Boundaries

* [ ] Projects have a clear purpose.
* [ ] Experiments have a clear purpose.
* [ ] Writing has a clear purpose.
* [ ] Notes have a clear purpose.
* [ ] Timeline has a clear purpose.
* [ ] Changelog has a clear purpose.
* [ ] Docs has a clear purpose.
* [ ] Garden does not duplicate Notes/Writing.
* [ ] About has a clear identity purpose.

## URLs

* [ ] Routes are predictable.
* [ ] Slugs are stable.
* [ ] Unnecessary nesting is avoided.
* [ ] Published canonical URLs are preserved.

## Relationships

* [ ] Canonical content pages are clear.
* [ ] Related-content architecture is defined.
* [ ] Relationships are meaningful.
* [ ] No graph database is introduced.
* [ ] No unnecessary relationship infrastructure is introduced.

## Homepage

* [ ] Homepage acts as a curated gateway.
* [ ] Identity is clear.
* [ ] Currently communicates present activity.
* [ ] Selected Work exposes projects.
* [ ] From the Lab exposes experiments.
* [ ] Knowledge exposes Writing/Notes.
* [ ] Journey exposes Timeline.
* [ ] Homepage does not become an archive.

## Architecture

* [ ] Astro remains the framework.
* [ ] Content Collections remain the foundation.
* [ ] MDX remains supported.
* [ ] Static rendering remains the default.
* [ ] No database is introduced.
* [ ] No paid service is introduced.
* [ ] No unnecessary external API is introduced.
* [ ] No unnecessary client-side infrastructure is introduced.
* [ ] v1.0.0 history remains untouched.

## Quality

* [ ] Existing working routes remain functional.
* [ ] `npm run build` passes.
* [ ] `git diff --check` passes.
* [ ] Navigation works on mobile.
* [ ] No obvious orphaned published content exists.
* [ ] Changes are committed in reviewable checkpoints.
* [ ] Project documentation is updated after meaningful durable changes.

---

# 39. Final CP2 Architectural Decision

The information architecture of Alok Engineering Lab is:

> **Alok Engineering Lab is a connected personal engineering knowledge system whose primary content domains are Projects, Experiments, Writing, and Notes; Timeline represents the engineering journey; Garden provides a future discovery layer; Docs and Changelog are supporting systems; About represents the person and philosophy behind the Lab; and Home acts as the curated front door. Meaningful relationships between content should be introduced incrementally using the existing Astro content architecture, without databases, external services, or unnecessary infrastructure.**

The architecture intentionally follows:

```text
Simple now
     ↓
Structured underneath
     ↓
Connected over time
     ↓
Richer when justified
```

The goal is not to build the most complicated website.

The goal is to build a system that can remain useful for years.

---

# 40. CP2 Lock Condition

This specification becomes **CP2 Locked** only after:

1. The information architecture has been reviewed.
2. Any disagreements with the actual repository have been resolved.
3. The final navigation hierarchy has been accepted.
4. Content-type boundaries have been accepted.
5. Garden's discovery-layer role has been accepted.
6. Cross-linking remains incremental rather than over-engineered.
7. No CP1 visual-design decisions are unnecessarily reopened.
8. No framework or architecture migration is introduced.

Until then:

```text
CP2 = Proposed / Review
```

After approval:

```text
CP2 = Locked
```

Only after CP2 is locked should implementation begin.
