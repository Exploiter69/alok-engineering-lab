import test from "node:test";
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

test("malformed cookie encoding is ignored instead of throwing", () => {
  assert.doesNotThrow(() => security.parseCookies("a=%E0%A4%A; b=safe"));
  assert.equal(security.parseCookies("a=%E0%A4%A; b=safe").b, "safe");
});
