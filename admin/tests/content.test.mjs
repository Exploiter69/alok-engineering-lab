import test from "node:test";
import assert from "node:assert/strict";
import { parseDocument, validateMetadata, validSlug } from "../lib/content.mjs";

test("parses repository frontmatter and preserves the body", () => {
  const source = `---
title: "Example"
description: "Description"
date: "2026-10-07"
tags:
  - "engineering"
  - "notes"
status: "draft"
related:
  - "projects:astra-userbot"
---

# Body

MDX remains source text.`;
  const result = parseDocument(source);
  assert.equal(result.metadata.title, "Example");
  assert.deepEqual(result.metadata.tags, ["engineering", "notes"]);
  assert.deepEqual(result.metadata.related, ["projects:astra-userbot"]);
  assert.match(result.body, /MDX remains source text/);
});

test("enforces project lifecycle chronology and current-state boundary", () => {
  const metadata = {
    title: "Project",
    description: "Description",
    date: "2026-10-07",
    tags: [],
    related: [],
    status: "active",
    lifecycle: "building",
    lifecycleSince: "2026-10-07",
    lifecycleHistory: [{ state: "exploring", date: "2026-10-06", note: "Started" }, { state: "building", date: "2026-10-07", note: "Building" }],
  };
  assert.deepEqual(validateMetadata("projects", metadata, []), []);
});

test("rejects invalid relationships and slugs", () => {
  const metadata = { title:"x", description:"x", date:"2026-10-07", tags:[], related:["missing"], status:"draft" };
  assert.ok(validateMetadata("notes", metadata, ["missing"]).some((error) => error.includes("invalid related reference")));
  assert.equal(validSlug("safe-entry"), true);
  assert.equal(validSlug("../escape"), false);
  assert.equal(validSlug("UPPER"), false);
});
