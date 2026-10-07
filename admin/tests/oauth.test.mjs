import test from "node:test";
import assert from "node:assert/strict";
process.env.ADMIN_SESSION_SECRET = "test-secret-that-is-longer-than-thirty-two-characters";
const security = await import("../lib/security.mjs");
test("PKCE verifier produces a stable S256 challenge", () => {
  assert.equal(security.pkceChallenge("test-verifier"), "JBbiqONGWPaAmwXk_8bT6UnlPfrn65D32eZlJS-zGG0");
});
test("OAuth state payload is time-bounded", () => {
  const state = security.encrypt({ state: "abc", verifier: "xyz", exp: Date.now() - 1 });
  const decoded = security.decrypt(state);
  assert.ok(decoded); assert.ok(decoded.exp < Date.now());
});
