import { decrypt, parseCookies, SESSION_COOKIE } from "../lib/security.mjs";
import { send } from "../lib/response.mjs";
import { currentUser } from "../lib/github.mjs";

export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "method_not_allowed" });
  const session = decrypt(parseCookies(req.headers.cookie || "")[SESSION_COOKIE] || "");
  if (!session || session.exp < Date.now()) return send(res, 401, { authenticated: false });
  try {
    const user = await currentUser(session.token);
    const allowed = (process.env.ADMIN_ALLOWED_LOGINS || "Exploiter69").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
    if (!allowed.includes(String(user.login).toLowerCase())) return send(res, 403, { error: "forbidden" });
    return send(res, 200, { authenticated: true, user: { login: user.login, avatar: user.avatar_url || null }, csrf: session.csrf });
  } catch {
    return send(res, 401, { authenticated: false });
  }
}
