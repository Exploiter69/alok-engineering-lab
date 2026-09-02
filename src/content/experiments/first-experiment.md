---
title: "First Engineering Experiment"
description: "Testing whether automated checks can make iterative Engineering Lab development faster and safer."
date: 2026-09-01
tags:
  - Experiment
  - Testing
  - Automation
status: active
related:
  - projects:astra
  - notes:engineering-philosophy
---
## Experiment

Can a small automated quality loop make rapid changes to the Engineering Lab safer without slowing development down?

The Lab is intended to evolve continuously. That means content, layouts, components, and other parts of the system will change regularly.

The risk is simple: a change that looks harmless can accidentally break something somewhere else.

This experiment explores a lightweight way to catch those problems early.

## Hypothesis

If every meaningful change is followed by automated validation, then the development process should become more reliable without requiring a large testing infrastructure.

The important part is not having hundreds of tests.

The important part is checking the things that matter most to the current system.

## Setup

The Lab already has several useful verification layers:

1. **Astro check** validates the project's TypeScript and Astro diagnostics.
2. **Astro build** verifies that the static site can actually be generated.
3. **Automated visual audit** loads the site's important routes in a real browser.
4. The audit checks both desktop and mobile layouts.
5. Git provides a checkpoint after a verified change.

Together, these form a small feedback loop:

**change → build → browser audit → inspect result → checkpoint**

## What the audit checks

The automated audit is deliberately focused on common failure modes.

It verifies things such as:

* HTTP responses
* browser errors
* horizontal overflow
* page title
* meta description
* canonical URL
* viewport metadata
* navigation
* main content
* footer
* heading structure
* image accessibility
* button accessibility
* internal links

It also checks the site's routes at both desktop and mobile viewport sizes.

## Why this matters

A successful build does not necessarily mean that a page is usable.

For example, a project can compile correctly while still having:

* broken navigation
* an incorrect heading hierarchy
* mobile overflow
* browser-side errors
* missing metadata
* inaccessible controls

The browser audit adds another layer of evidence between "the code compiles" and "the site still behaves correctly."

## Observation

During development of the Lab, the automated audit has already caught a real content-level regression.

Adding a Markdown `#` heading to a content page created two `<h1>` elements because the page template already provides the primary heading.

The site still built successfully.

The automated audit detected the problem:

**expected exactly 1 h1, found 2**

Removing the duplicate heading restored the expected structure, after which the complete audit passed again.

This is a useful example of why different verification layers catch different classes of problems.

## Result

The experiment is not intended to prove that automated testing prevents every possible regression.

Instead, it demonstrates a practical principle:

> Fast development becomes safer when feedback is fast too.

A lightweight automated audit can provide useful confidence without introducing a large testing framework or external service.

The experiment therefore supports continuing with this verification loop as the Lab grows.

## Lessons

### 1. Build success is necessary but not sufficient

A successful build tells us that the project can be generated.

It does not tell us everything about the rendered experience.

### 2. Small audits can have high value

A focused set of checks can catch problems that would otherwise require manual inspection.

### 3. Test the real interface

Testing generated pages in a browser gives different information from checking source code alone.

### 4. Mobile should be part of normal development

Responsive behavior should not be treated as a final polishing step.

It should be checked whenever the interface changes.

### 5. Verification should stay proportional

The goal is not to build a huge testing system for a small personal site.

The goal is to have enough automated feedback to make changes confidently.

## Next iteration

As the Lab grows, this experiment can evolve.

New checks can be added when they correspond to real failure modes.

Checks that stop providing useful signal should be reconsidered.

The experiment therefore remains open.

The system for verifying the Lab should evolve alongside the Lab itself.
