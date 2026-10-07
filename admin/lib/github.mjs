const API = "https://api.github.com";

export async function github(path, options = {}, token) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2026-03-10",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let body;
  try { body = JSON.parse(text); } catch { body = { message: text }; }
  if (!response.ok) {
    const error = new Error(body.message || `GitHub ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return body;
}

export async function exchangeCode(code, redirectUri, verifier) {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code, redirect_uri: redirectUri, code_verifier: verifier }),
  });
  const body = await response.json();
  if (!response.ok || body.error || !body.access_token) throw new Error(body.error_description || "GitHub token exchange failed");
  return body;
}

export async function currentUser(token) { return github("/user", {}, token); }
