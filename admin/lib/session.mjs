import { decrypt, parseCookies, SESSION_COOKIE } from "./security.mjs";

export function getSession(req) {
  const session = decrypt(parseCookies(req.headers.cookie || "")[SESSION_COOKIE] || "");
  if (!session || session.exp < Date.now()) return null;
  return session;
}

export function allowedLogin(login) {
  const allowed = (process.env.ADMIN_ALLOWED_LOGINS || "Exploiter69").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(String(login).toLowerCase());
}

export function requireSession(req, res) {
  const session = getSession(req);
  if (!session || !allowedLogin(session.login)) {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "unauthorized" }));
    return null;
  }
  return session;
}
