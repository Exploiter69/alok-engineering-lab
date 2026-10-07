import test from "node:test";
import assert from "node:assert/strict";
import {
  STALE_DAYS, isStale, staleReason, classifyDiffFile, semanticDiff,
  validateBulkSelection, bulkMetadata, auditFromHealth, parseReference,
} from "../lib/intelligence.mjs";

test("stale detection uses the explicit 180-day rule", () => {
  const now = Date.parse("2026-10-07T00:00:00Z");
  assert.equal(STALE_DAYS, 180);
  assert.equal(isStale({ date: "2026-04-10" }, now), true);
  assert.equal(isStale({ date: "2026-04-11" }, now), false);
  assert.equal(staleReason({ date: "2026-04-10" }, now).thresholdDays, 180);
});

test("relationship references remain collection-scoped", () => {
  assert.deepEqual(parseReference("projects:astra"), { collection:"projects", slug:"astra", reference:"projects:astra" });
  assert.equal(parseReference("../escape"), null);
});

test("diff classification separates content, assets and configuration", () => {
  assert.equal(classifyDiffFile({ filename:"src/content/projects/astra.md" }), "content");
  assert.equal(classifyDiffFile({ filename:"src/assets/social.svg" }), "assets");
  assert.equal(classifyDiffFile({ filename:"src/content.config.ts" }), "configuration");
  assert.equal(classifyDiffFile({ filename:"src/pages/index.astro" }), "source");
});

test("content-aware diff reports frontmatter and body changes", () => {
  const file = { filename:"src/content/projects/astra.md", patch:"@@", additions:3, deletions:2 };
  const oldSource = `---
title: "Old"
tags:
  - "linux"
---
one
two
`;
  const newSource = `---
title: "New"
tags:
  - "linux"
  - "rooting"
---
one
three
four
`;
  const result = semanticDiff(file, oldSource, newSource);
  assert.equal(result.category, "content");
  assert.ok(result.metadata.some(change => change.field === "title"));
  assert.ok(result.metadata.some(change => change.field === "tags"));
  assert.equal(result.body.added, 2);
  assert.equal(result.body.removed, 1);
  assert.equal(result.rawPatch, "@@");
});

test("bulk selection rejects unsafe and oversized targets", () => {
  assert.deepEqual(validateBulkSelection([{collection:"projects",slug:"astra"}]), {ok:true,references:["projects:astra"]});
  assert.equal(validateBulkSelection([{collection:"projects",slug:"../escape"}]).ok, false);
  assert.equal(validateBulkSelection(Array.from({length:101}, () => ({collection:"projects",slug:"astra"}))).ok, false);
});

test("bulk metadata operations are deterministic", () => {
  const base = { status:"active", tags:["linux"], related:["projects:astra"] };
  assert.equal(bulkMetadata(base,"archive").status, "archived");
  assert.deepEqual(bulkMetadata(base,"add-tag","rooting").tags, ["linux","rooting"]);
  assert.deepEqual(bulkMetadata(base,"remove-tag","linux").tags, []);
  assert.deepEqual(bulkMetadata(base,"remove-related","projects:astra").related, []);
});

test("audit states never promote unavailable data to healthy", () => {
  const health = { totals:{validationFailures:0,brokenReferences:0,missingRelationships:0,stale:0}, thresholdDays:180 };
  const repository = {branch:"master",sha:"a".repeat(40),shortSha:"aaaaaaaaaaaa"};
  const audits = auditFromHealth(health, repository, [], null);
  assert.equal(audits.find(item => item.id === "deployment").status, "unknown");
  assert.equal(audits.find(item => item.id === "ci").status, "unknown");
  assert.equal(audits.find(item => item.id === "metadata").status, "healthy");
});
