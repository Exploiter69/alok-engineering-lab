import { clearCookie, decrypt, parseCookies, requireSameOrigin, SESSION_COOKIE } from "../../lib/security.mjs";
import { redirect, text } from "../../lib/response.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return text(res, 405, "Method not allowed");
  if (!requireSameOrigin(req)) return text(res, 403, "Cross-origin request rejected");
  const session = decrypt(parseCookies(req.headers.cookie || "")[SESSION_COOKIE] || "");
  if (!session || session.exp < Date.now() || req.headers["x-csrf-token"] !== session.csrf) return text(res, 403, "CSRF validation failed");
  return redirect(res, "/", [clearCookie(SESSION_COOKIE)]);
}
