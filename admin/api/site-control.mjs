import { send } from "../lib/response.mjs";
import { parseJsonBody, requireCsrf, requireSameOrigin } from "../lib/security.mjs";
import { requireSession } from "../lib/session.mjs";
import { readSiteControl, writeSiteControl } from "../lib/site-control.mjs";

function branchName(value) {
  return /^admin\/[a-z0-9][a-z0-9._/-]{2,79}$/.test(value || "");
}

export default async function handler(req, res) {
  const session = requireSession(req, res);
  if (!session) return;
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const ref = url.searchParams.get("ref") || "master";
    if (req.method === "GET") {
      const data = await readSiteControl(session.token, ref);
      return send(res, 200, {
        ref,
        site: data.site.value,
        navigation: data.navigation.value,
        redirects: data.redirects.value,
        shas: { site: data.site.sha, navigation: data.navigation.sha, redirects: data.redirects.sha },
      });
    }
    if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
    if (!requireSameOrigin(req) || !requireCsrf(req, session)) return send(res, 403, { error: "csrf_validation_failed" });
    let body;
    try { body = parseJsonBody(req); } catch (error) { return send(res, error.status || 400, { error: error.message }); }
    if (!branchName(body.branch) || !body.values || typeof body.values !== "object") return send(res, 400, { error: "invalid_target" });
    const current = await readSiteControl(session.token, "master");
    const commits = await writeSiteControl(session.token, body.branch, body.values, current);
    return send(res, 200, { branch: body.branch, commits });
  } catch (error) {
    const status = error?.status === 422 ? 422 : error?.status === 409 ? 409 : 502;
    return send(res, status, { error: "site_control_failed", message: error instanceof Error ? error.message : "unknown error" });
  }
}
