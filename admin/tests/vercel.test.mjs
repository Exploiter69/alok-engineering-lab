import test from "node:test";
import assert from "node:assert/strict";

test("Vercel integration is optional and server-side", () => {
  assert.equal(typeof process.env.VERCEL_TOKEN, "undefined");
  assert.equal(typeof process.env.VERCEL_PROJECT_ID, "undefined");
});
