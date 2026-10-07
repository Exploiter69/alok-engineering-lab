import test from "node:test";
import assert from "node:assert/strict";

test("Phase 4 branch names are repository-scoped", () => {
  const valid = /^admin\/[a-z0-9][a-z0-9._/-]{2,79}$/;
  assert.equal(valid.test("admin/project-update"), true);
  assert.equal(valid.test("master"), false);
  assert.equal(valid.test("../master"), false);
});

test("Phase 4 merge contract requires a full commit SHA", () => {
  assert.equal(/^[0-9a-f]{40}$/.test("a".repeat(40)), true);
  assert.equal(/^[0-9a-f]{40}$/.test("short"), false);
});
