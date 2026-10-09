import { send } from "../lib/response.mjs";
import { requireSession } from "../lib/session.mjs";
import { requireSameOrigin } from "../lib/security.mjs";
import { branches, branchStatus, commitStatus, createPullRequest, mergePullRequest, pullRequests, rerunFailed, workflowRuns } from "../lib/git-workflow.mjs";
import { deployments } from "../lib/vercel.mjs";
import { contentAwareDiff } from "../lib/intelligence.mjs";

export default async function handler(req, res) {
  const session = requireSession(req, res);
  if (!session) return;
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const branch = url.searchParams.get("branch");
    if (req.method === "GET") {
      const [branchList, prs] = await Promise.all([branches(session.token), pullRequests(session.token)]);
      const payload = { branches: branchList, prs };
      if (branch) {
        payload.branch = await branchStatus(session.token, branch);
        payload.ci = await commitStatus(session.token, payload.branch.sha);
        payload.runs = await workflowRuns(session.token, branch);
      }
      try { payload.deployments = await deployments(); }
      catch (error) { payload.deployments = { available: false, message: error.message }; }
      return send(res, 200, payload);
    }
    if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
    if (!requireSameOrigin(req)) return send(res, 403, { error: "cross_origin_request" });
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    if (body.action === "pr") {
      if (!/^admin\/[a-z0-9][a-z0-9._/-]{2,79}$/.test(body.branch || "")) return send(res, 400, { error: "invalid_branch" });
      const result = await createPullRequest(session.token, body.branch, body.title || `Admin changes: ${body.branch}`, body.body || "");
      return send(res, 201, { number: result.number, url: result.html_url, state: result.state, head: result.head.sha });
    }
    if (body.action === "rerun") return send(res, 200, await rerunFailed(session.token, body.runId));
    if (body.action === "merge") {
      if (!Number.isInteger(body.number) || !/^[0-9a-f]{40}$/.test(body.sha || "")) return send(res, 400, { error: "invalid_merge_target" });
      const result = await mergePullRequest(session.token, body.number, body.sha);
      return send(res, result.merged ? 200 : 409, { merged: result.merged, sha: result.sha, message: result.message });
    }
    return send(res, 400, { error: "unknown_action" });
  } catch (error) {
    const status = [400,401,403,404,409,422,503].includes(error?.status) ? error.status : 502;
    return send(res, status, { error: "workflow_failed", message: error instanceof Error ? error.message : "unknown error" });
  }
}
