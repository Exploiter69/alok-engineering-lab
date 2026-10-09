import { adminBaseUrl, encrypt, OAUTH_COOKIE, pkceChallenge, randomToken, cookie } from "../../lib/security.mjs";
import { redirect, text } from "../../lib/response.mjs";

export default async function handler(req, res) {
  if (req.method !== "GET") return text(res, 405, "Method not allowed");
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET || !process.env.ADMIN_SESSION_SECRET) return text(res, 503, "Admin authentication is not configured.");

  const state = randomToken(32), verifier = randomToken(48);
  let redirectUri; try { redirectUri = new URL("/api/auth/callback", adminBaseUrl()).toString(); } catch { return text(res, 503, "Admin authentication base URL is not configured correctly."); }
  const payload = encrypt({ state, verifier, redirectUri, exp: Date.now() + 10 * 60_000 });
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    state,
    code_challenge: pkceChallenge(verifier),
    code_challenge_method: "S256",
    scope: process.env.GITHUB_OAUTH_SCOPE || "read:user repo",
    allow_signup: "false",
  });
  return redirect(res, `https://github.com/login/oauth/authorize?${params}`, [cookie(OAUTH_COOKIE, payload, 600)]);
}
