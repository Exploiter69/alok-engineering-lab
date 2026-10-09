import { github } from "./github.mjs";

const OWNER = "Exploiter69";
const REPO = "alok-engineering-lab";

function apiPath(path) { return `/repos/${OWNER}/${REPO}${path}`; }

export function mergeReadiness({ status, checkRuns, pr, expectedSha, number }) {
  if (status?.state !== "success") return { ready: false, reason: `Commit statuses are not green: ${status?.state || "unknown"}` };

  const runs = checkRuns?.check_runs || [];
  const total = Number(checkRuns?.total_count || 0);
  if (!total || !runs.length || runs.length !== total) {
    return { ready: false, reason: "GitHub check runs are missing or incomplete" };
  }
  const pending = runs.filter((run) => run.status !== "completed");
  if (pending.length) return { ready: false, reason: "GitHub check runs are still in progress" };
  const failed = runs.filter((run) => !["success", "skipped", "neutral"].includes(run.conclusion));
  if (failed.length) return { ready: false, reason: `GitHub check runs are not green: ${failed.map((run) => run.name).join(", ")}` };

  if (!pr || pr.number !== number || pr.head?.sha !== expectedSha || pr.base?.ref !== "master" || pr.state !== "open") {
    return { ready: false, reason: "Pull request changed or is no longer open" };
  }
  if (pr.draft) return { ready: false, reason: "Draft pull requests cannot be merged" };
  if (pr.mergeable !== true || ["dirty", "blocked"].includes(pr.mergeable_state)) {
    return { ready: false, reason: "Pull request is not confirmed mergeable" };
  }
  return { ready: true, reason: "Commit statuses, check runs and pull request state are green" };
}

export async function branches(token) {
  const data = await github(apiPath("/branches?per_page=100"), {}, token);
  return data.map((item) => ({ name: item.name, sha: item.commit.sha, protected: item.protected }));
}

export async function pullRequests(token, state = "open") {
  const data = await github(apiPath(`/pulls?state=${encodeURIComponent(state)}&per_page=50&sort=updated&direction=desc`), {}, token);
  return data.map((pr) => ({
    number: pr.number, title: pr.title, state: pr.state, draft: pr.draft,
    head: { branch: pr.head.ref, sha: pr.head.sha },
    base: { branch: pr.base.ref, sha: pr.base.sha },
    mergeable: pr.mergeable, mergeable_state: pr.mergeable_state,
    html_url: pr.html_url, updated_at: pr.updated_at,
  }));
}

export async function branchStatus(token, branch) {
  const encoded = encodeURIComponent(branch);
  const [ref, compare] = await Promise.all([
    github(apiPath(`/git/ref/heads/${encoded}`), {}, token),
    github(apiPath(`/compare/master...${encoded}`), {}, token),
  ]);
  return {
    branch,
    sha: ref.object.sha,
    ahead_by: compare.ahead_by,
    behind_by: compare.behind_by,
    status: compare.status,
    files: (compare.files || []).map((file) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      patch: file.patch || null,
    })),
  };
}

export async function createPullRequest(token, branch, title, body = "") {
  return github(apiPath("/pulls"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, head: branch, base: "master", body, draft: true }),
  }, token);
}

export async function mergePullRequest(token, number, expectedSha) {
  const [status, checkRuns] = await Promise.all([
    github(apiPath(`/commits/${expectedSha}/status`), {}, token),
    github(apiPath(`/commits/${expectedSha}/check-runs?per_page=100`), {}, token),
  ]);
  const pr = await github(apiPath(`/pulls/${number}`), {}, token);
  const readiness = mergeReadiness({ status, checkRuns, pr, expectedSha, number });
  if (!readiness.ready) {
    const error = new Error(readiness.reason);
    error.status = 409;
    throw error;
  }
  return github(apiPath(`/pulls/${number}/merge`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sha: expectedSha, merge_method: "merge" }),
  }, token);
}

export async function rerunFailed(token, runId) {
  return github(apiPath(`/actions/runs/${encodeURIComponent(runId)}/rerun-failed-jobs`), { method: "POST" }, token);
}

export async function commitStatus(token, sha) {
  const data = await github(apiPath(`/commits/${sha}/status`), {}, token);
  return { state: data.state, total_count: data.total_count, statuses: (data.statuses || []).map((item) => ({ context: item.context, state: item.state, description: item.description, target_url: item.target_url })) };
}

export async function workflowRuns(token, branchName) {
  const data = await github(apiPath(`/actions/runs?branch=${encodeURIComponent(branchName)}&per_page=20`), {}, token);
  return (data.workflow_runs || []).map((run) => ({
    id: run.id, name: run.name, status: run.status, conclusion: run.conclusion,
    sha: run.head_sha, branch: run.head_branch, event: run.event,
    duration_ms: run.updated_at && run.created_at ? Date.parse(run.updated_at) - Date.parse(run.created_at) : null,
    html_url: run.html_url, created_at: run.created_at, updated_at: run.updated_at,
  }));
}
