import { securityHeaders } from "./security.mjs";

export function send(res, status, body, extra = {}) {
  res.statusCode = status;
  for (const [name, value] of Object.entries({ ...securityHeaders(), "Content-Type": "application/json; charset=utf-8", ...extra })) res.setHeader(name, value);
  res.end(JSON.stringify(body));
}

export function redirect(res, location, cookies = []) {
  res.statusCode = 303;
  res.setHeader("Location", location);
  for (const [name, value] of Object.entries(securityHeaders())) res.setHeader(name, value);
  if (cookies.length) res.setHeader("Set-Cookie", cookies);
  res.end();
}

export function text(res, status, message) {
  res.statusCode = status;
  for (const [name, value] of Object.entries(securityHeaders())) res.setHeader(name, value);
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(message);
}
