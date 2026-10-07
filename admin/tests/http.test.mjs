import test from "node:test";
import assert from "node:assert/strict";
import health from "../api/health.mjs";

function response() {
  return { statusCode: 200, headers: {}, setHeader(name, value) { this.headers[name] = value; }, end(body = "") { this.body = body; } };
}
test("health endpoint returns JSON and security headers", async () => {
  const res = response(); await health({ method: "GET" }, res);
  assert.equal(res.statusCode, 200); assert.equal(JSON.parse(res.body).status, "ok");
  assert.equal(res.headers["X-Frame-Options"], "DENY"); assert.match(res.headers["Content-Security-Policy"], /default-src 'self'/);
});
test("health endpoint rejects unsupported methods", async () => {
  const res = response(); await health({ method: "POST" }, res); assert.equal(res.statusCode, 405);
});
