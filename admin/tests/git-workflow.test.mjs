import test from "node:test";
import assert from "node:assert/strict";
import { mergeReadiness } from "../lib/git-workflow.mjs";

const sha = "a".repeat(40);
const greenStatus = { state: "success" };
const greenChecks = { total_count: 1, check_runs: [{ name: "Quality", status: "completed", conclusion: "success" }] };
const greenPr = { number: 8, head: { sha }, base: { ref: "master" }, state: "open", draft: false, mergeable: true, mergeable_state: "clean" };

test("Phase 4 branch names are repository-scoped", () => {
  const valid = /^admin\/[a-z0-9][a-z0-9._/-]{2,79}$/;
  assert.equal(valid.test("admin/project-update"), true);
  assert.equal(valid.test("master"), false);
  assert.equal(valid.test("../master"), false);
});

test("Phase 4 merge contract requires a full commit SHA", () => {
  assert.equal(/^[0-9a-f]{40}$/.test(sha), true);
  assert.equal(/^[0-9a-f]{40}$/.test("short"), false);
});

test("merge readiness requires successful commit statuses and check runs", () => {
  assert.deepEqual(mergeReadiness({ status: greenStatus, checkRuns: greenChecks, pr: greenPr, expectedSha: sha, number: 8 }), {
    ready: true, reason: "Commit statuses, check runs and pull request state are green",
  });
});

test("merge readiness blocks failed deployment/status contexts", () => {
  assert.equal(mergeReadiness({ status: { state: "failure" }, checkRuns: greenChecks, pr: greenPr, expectedSha: sha, number: 8 }).ready, false);
});

test("merge readiness fails closed when checks are absent, pending, incomplete, or failed", () => {
  assert.equal(mergeReadiness({ status: greenStatus, checkRuns: { total_count: 0, check_runs: [] }, pr: greenPr, expectedSha: sha, number: 8 }).ready, false);
  assert.equal(mergeReadiness({ status: greenStatus, checkRuns: { total_count: 2, check_runs: greenChecks.check_runs }, pr: greenPr, expectedSha: sha, number: 8 }).ready, false);
  assert.equal(mergeReadiness({ status: greenStatus, checkRuns: { total_count: 1, check_runs: [{ name: "Quality", status: "in_progress", conclusion: null }] }, pr: greenPr, expectedSha: sha, number: 8 }).ready, false);
  assert.equal(mergeReadiness({ status: greenStatus, checkRuns: { total_count: 1, check_runs: [{ name: "Quality", status: "completed", conclusion: "failure" }] }, pr: greenPr, expectedSha: sha, number: 8 }).ready, false);
});

test("merge readiness blocks stale, draft, or unmergeable pull requests", () => {
  assert.equal(mergeReadiness({ status: greenStatus, checkRuns: greenChecks, pr: { ...greenPr, head: { sha: "b".repeat(40) } }, expectedSha: sha, number: 8 }).ready, false);
  assert.equal(mergeReadiness({ status: greenStatus, checkRuns: greenChecks, pr: { ...greenPr, draft: true }, expectedSha: sha, number: 8 }).ready, false);
  assert.equal(mergeReadiness({ status: greenStatus, checkRuns: greenChecks, pr: { ...greenPr, mergeable: false }, expectedSha: sha, number: 8 }).ready, false);
});
