import crypto from "node:crypto";

export const SESSION_COOKIE = "ael_admin_session";
export const OAUTH_COOKIE = "ael_admin_oauth";
export const SESSION_TTL = 8 * 60 * 60;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters");
  return crypto.createHash("sha256").update(value).digest();
}

export function randomToken(bytes = 32) { return crypto.randomBytes(bytes).toString("base64url"); }
export function pkceChallenge(verifier) { return crypto.createHash("sha256").update(verifier).digest("base64url"); }

export function encrypt(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", secret(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return [iv, ciphertext, cipher.getAuthTag()].map((part) => part.toString("base64url")).join(".");
}

export function decrypt(value) {
  try {
    const [ivRaw, ciphertextRaw, tagRaw] = String(value).split(".");
    if (!ivRaw || !ciphertextRaw || !tagRaw) return null;
    const decipher = crypto.createDecipheriv("aes-256-gcm", secret(), Buffer.from(ivRaw, "base64url"));
    decipher.setAuthTag(Buffer.from(tagRaw, "base64url"));
    const plaintext = Buffer.concat([decipher.update(Buffer.from(ciphertextRaw, "base64url")), decipher.final()]);
    return JSON.parse(plaintext.toString("utf8"));
  } catch { return null; }
}

export function parseCookies(header = "") {
  return Object.fromEntries(header.split(";").map((part) => part.trim()).filter(Boolean).map((part) => {
    const index = part.indexOf("=");
    return index === -1 ? [part, ""] : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
  }));
}

export function cookie(name, value, maxAge, extra = "") {
  return [`${name}=${encodeURIComponent(value)}`, "Path=/", `Max-Age=${maxAge}`, "HttpOnly", "Secure", "SameSite=Lax", extra].filter(Boolean).join("; ");
}

export function clearCookie(name) { return cookie(name, "", 0); }

export function securityHeaders() {
  return {
    "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https://avatars.githubusercontent.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    "Cache-Control": "no-store",
  };
}

export function requireSameOrigin(req) {
  const origin = req.headers.origin, host = req.headers.host;
  if (!origin || !host) return false;
  try { return new URL(origin).host === host; } catch { return false; }
}
