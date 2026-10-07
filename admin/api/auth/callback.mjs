import { clearCookie, cookie, decrypt, encrypt, OAUTH_COOKIE, parseCookies, randomToken, SESSION_COOKIE, SESSION_TTL } from "../../lib/security.mjs";
import { exchangeCode, currentUser } from "../../lib/github.mjs";
import { text } from "../../lib/response.mjs";

export default async function handler(req, res) {
  if (req.method !== "GET") return text(res, 405, "Method not allowed");
  const query = new URL(req.url, `https://${req.headers.host}`).searchParams;
  const code = query.get("code"), state = query.get("state");
  const oauth = decrypt(parseCookies(req.headers.cookie || "")[OAUTH_COOKIE] || "");
  if (!code || !state || !oauth || oauth.exp < Date.now() || oauth.state !== state) return text(res, 400, "Invalid authentication state.");

  try {
    const token = await exchangeCode(code, oauth.redirectUri, oauth.verifier);
    const user = await currentUser(token.access_token);
    const allowed = (process.env.ADMIN_ALLOWED_LOGINS || "Exploiter69").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
    if (!allowed.includes(String(user.login).toLowerCase())) return text(res, 403, "This GitHub identity is not authorized for the Engineering Lab admin.");

    const session = encrypt({
      login: user.login,
      avatar: user.avatar_url || null,
      token: token.access_token,
      refreshToken: token.refresh_token || null,
      tokenExpiresAt: token.expires_in ? Date.now() + token.expires_in * 1000 : null,
      refreshExpiresAt: token.refresh_token_expires_in ? Date.now() + token.refresh_token_expires_in * 1000 : null,
      csrf: randomToken(32),
      exp: Date.now() + SESSION_TTL * 1000,
    });

    res.statusCode = 303;
    res.setHeader("Location", "/");
    res.setHeader("Set-Cookie", [cookie(SESSION_COOKIE, session, SESSION_TTL), clearCookie(OAUTH_COOKIE)]);
    res.end();
  } catch {
    return text(res, 502, "GitHub authentication failed. Please try again.");
  }
}
