import test from "node:test";
import assert from "node:assert/strict";

test("GitHub API failures are sanitized", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("upstream secret token", { status: 500 });
  try {
    const github = await import("../lib/github.mjs?phase6=" + Date.now());
    await assert.rejects(github.github("/rate-limit", {}, "secret-token"), (error) =>
      error.status === 500 && error.message === "GitHub is temporarily unavailable");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("GitHub request timeouts become controlled failures", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { const error = new Error("timed out"); error.name = "TimeoutError"; throw error; };
  try {
    const github = await import("../lib/github.mjs?timeout=" + Date.now());
    await assert.rejects(github.github("/slow"), (error) =>
      error.status === 504 && error.message === "GitHub request timed out");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
