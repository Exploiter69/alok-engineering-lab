const API = "https://api.vercel.com";

async function vercel(path, options = {}) {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    const error = new Error("Vercel integration is not configured");
    error.status = 503;
    throw error;
  }
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error?.message || `Vercel request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

export async function deployments(limit = 10) {
  const project = process.env.VERCEL_PROJECT_ID;
  if (!project) throw Object.assign(new Error("Vercel project integration is not configured"), { status: 503 });
  const data = await vercel(`/v6/deployments?projectId=${encodeURIComponent(project)}&limit=${limit}`);
  return (data.deployments || []).map((deployment) => ({
    id: deployment.uid, state: deployment.readyState, target: deployment.target,
    url: deployment.url ? `https://${deployment.url}` : null,
    commit: deployment.meta?.githubCommitSha || deployment.gitSource?.sha || null,
    branch: deployment.meta?.githubCommitRef || deployment.gitSource?.ref || null,
    created_at: deployment.createdAt, ready_at: deployment.ready,
  }));
}
