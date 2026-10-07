import fs from "node:fs";
import path from "node:path";

const [collection, slug, ...args] = process.argv.slice(2);
const allowed = new Set(["projects", "writing", "notes", "experiments", "evidence", "timeline", "changelog"]);
if (!collection || !slug || !allowed.has(collection)) {
  console.error('Usage: node scripts/new-content.mjs <collection> <slug> --title "Title"');
  console.error("Collections: " + [...allowed].join(", "));
  process.exit(1);
}
const titleIndex = args.indexOf("--title");
const title = titleIndex >= 0 ? args[titleIndex + 1] : slug.split("-").map(part => part[0]?.toUpperCase() + part.slice(1)).join(" ");
if (!title) throw new Error("A title is required.");

const today = new Date().toISOString().slice(0, 10);
const templates = {
  projects: `---
title: "${title}"
description: "Describe the engineering problem and why this project exists."
date: ${today}
tags:
  - Engineering
status: draft
repository: ""
stack:
  - TypeScript
objective: "What engineering outcome is this project pursuing?"
lifecycle: "exploring"
lifecycleSince: ${today}
lifecycleHistory:
  - state: "exploring"
    date: ${today}
    note: "Initial lifecycle baseline."
architectureSummary: "Summarize the system boundary and major components."
decisions:
  - "Record a durable architectural decision."
lessons:
  - "Record a lesson grounded in implementation or verification."
currentFocus: "What is being worked on now?"
knownProblems:
  - "Known limitation or unresolved engineering risk."
futureWork:
  - "Concrete next engineering step."
related: []
---

## Problem

Describe the problem.

## Constraints

Describe the non-negotiable constraints.

## Architecture

Describe the architecture.

## Verification

Describe how the result is checked.

## Current State

Describe what is true now.
`,
  writing: `---
title: "${title}"
description: "Describe the argument or technical subject."
date: ${today}
tags:
  - Engineering
status: draft
format: essay
related: []
---

## Thesis

State the central idea.

## Evidence

Connect the argument to engineering work.

## Conclusion

State what changed in your understanding.
`,
  notes: `---
title: "${title}"
description: "A durable engineering observation."
date: ${today}
tags:
  - Engineering
status: draft
stage: seedling
related: []
---

## Observation

Write the durable idea.

## Why it matters

Connect it to engineering work.
`,
  experiments: `---
title: "${title}"
description: "A bounded engineering question."
date: ${today}
tags:
  - Engineering
status: draft
related: []
---

## Question

What are you testing?

## Setup

What conditions are controlled?

## Result

What happened?

## Limits

What does this experiment not prove?
`,
  evidence: `---
title: "${title}"
description: "A compact engineering evidence record."
date: ${today}
tags:
  - Verification
status: draft
kind: verification
outcome: informational
method: "How was the evidence produced?"
result: "What did the evidence show?"
limitations:
  - "What remains unproven?"
related: []
---

## Context

Explain the claim this evidence supports.
`,
  timeline: `---
title: "${title}"
description: "A durable engineering milestone."
date: ${today}
tags:
  - Journey
status: draft
related: []
---

Describe why this milestone matters.
`,
  changelog: `---
title: "${title}"
description: "A meaningful product or engineering checkpoint."
date: ${today}
tags:
  - Release
status: draft
related: []
---

## Changed

Describe the durable change.

## Verification

Describe how it was checked.
`,
};
const target = path.join(process.cwd(), "src", "content", collection, slug + ".md");
if (fs.existsSync(target)) throw new Error("File already exists: " + target);
fs.writeFileSync(target, templates[collection]);
console.log("Created " + path.relative(process.cwd(), target));
console.log("Next: edit the draft, then run npm run validate && npm run build.");
