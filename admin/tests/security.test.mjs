import test from "node:test";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
process.env.ADMIN_SESSION_SECRET = "test-secret-that-is-longer-than-thirty-two-characters";
const security = await import("../lib/security.mjs");

test("encrypted payload round-trips without exposing plaintext", () => {
  const payload = { token: "secret-token", exp: Date.now() + 1000 };
  const encrypted = security.encrypt(payload);
  assert.equal(encrypted.includes(payload.token), false);
  assert.deepEqual(security.decrypt(encrypted), payload);
});
test("tampered encrypted payload is rejected", () => {
  const encrypted = security.encrypt({ value: "safe" });
  const [iv, ciphertext, tag] = encrypted.split(".");
  const bytes = Buffer.from(ciphertext, "base64url");
  bytes[0] ^= 1;
  const tampered = [iv, bytes.toString("base64url"), tag].join(".");
  assert.equal(security.decrypt(tampered), null);
});
test("cookies are HttpOnly, Secure and SameSite=Lax", () => {
  const header = security.cookie("session", "abc", 3600);
  assert.match(header, /HttpOnly/); assert.match(header, /Secure/); assert.match(header, /SameSite=Lax/);
});
test("security headers prevent indexing and framing", () => {
  const headers = security.securityHeaders();
  assert.match(headers["Content-Security-Policy"], /frame-ancestors 'none'/);
  assert.equal(headers["X-Robots-Tag"], "noindex, nofollow, noarchive");
  assert.equal(headers["X-Frame-Options"], "DENY");
});


test("admin base URL is explicit and production-safe", () => {
  delete process.env.ADMIN_BASE_URL;
  assert.throws(() => security.adminBaseUrl(), /must be configured/);
  process.env.ADMIN_BASE_URL = "https://admin.example.test";
  process.env.NODE_ENV = "production";
  assert.equal(security.adminBaseUrl(), "https://admin.example.test");
  process.env.ADMIN_BASE_URL = "https://admin.example.test/path";
  assert.throws(() => security.adminBaseUrl(), /must be an origin/);
  process.env.ADMIN_BASE_URL = "http://admin.example.test";
  assert.throws(() => security.adminBaseUrl(), /HTTPS in production/);
  delete process.env.ADMIN_BASE_URL;
});

test("admin mutation bodies are bounded and reject malformed JSON", () => {
  assert.deepEqual(security.parseJsonBody({ body: '{"ok":true}' }), { ok: true });
  assert.throws(() => security.parseJsonBody({ body: "{" }), /invalid JSON body/);
  assert.throws(() => security.parseJsonBody({ body: "x".repeat(1_000_001) }), /request body too large/);
});

test("session cookies use host-only prefixes", () => {
  assert.match(security.cookie(security.SESSION_COOKIE, "abc", 3600), /^__Host-ael_admin_session=/);
  assert.match(security.cookie(security.OAUTH_COOKIE, "abc", 600), /^__Host-ael_admin_oauth=/);
});

test("malformed cookie encoding is ignored instead of throwing", () => {
  assert.doesNotThrow(() => security.parseCookies("a=%E0%A4%A; b=safe"));
  assert.equal(security.parseCookies("a=%E0%A4%A; b=safe").b, "safe");
});

test("CSRF tokens require an exact match", () => {
  const req = { headers: { "x-csrf-token": "token" } };
  assert.equal(security.requireCsrf(req, { csrf: "token" }), true);
  assert.equal(security.requireCsrf(req, { csrf: "other" }), false);
  assert.equal(security.requireCsrf({ headers: {} }, { csrf: "token" }), false);
});


test("engineering intelligence mutations require CSRF and bounded JSON parsing", async () => {
  const source = await readFile(new URL("../api/intelligence.mjs", import.meta.url), "utf8");
  assert.match(source, /requireCsrf\\(req, session\\)/);
  assert.match(source, /parseJsonBody\\(req\\)/);
});
