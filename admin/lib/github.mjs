const API = "https://api.github.com";
const TIMEOUT_MS = 10_000;

function safeMessage(status) {
  if (status === 401) return "GitHub authorization failed";
  if (status === 403) return "GitHub access denied";
  if (status === 404) return "GitHub resource not found";
  if (status === 409) return "GitHub resource changed";
  if (status === 422) return "GitHub rejected the request";
  if (status >= 500) return "GitHub is temporarily unavailable";
  return "GitHub request failed";
}

export async function github(path, options = {}, token) {
  let response;
  try {
    response = await fetch(`${API}${path}`, {
      ...options,
      signal: options.signal || AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2026-03-10",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    const timeout = error?.name === "TimeoutError" || error?.name === "AbortError";
    const failure = new Error(timeout ? "GitHub request timed out" : "GitHub request unavailable");
    failure.status = timeout ? 504 : 502;
    throw failure;
  }

  const bodyText = await response.text();
  if (!response.ok) {
    const error = new Error(safeMessage(response.status));
    error.status = response.status;
    throw error;
  }
  try { return JSON.parse(bodyText); } catch { return {}; }
}

export async function exchangeCode(code, redirectUri, verifier) {
  let response;
  try {
    response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
        code_verifier: verifier,
      }),
    });
  } catch {
    const error = new Error("GitHub token exchange unavailable");
    error.status = 504;
    throw error;
  }
  let body;
  try { body = await response.json(); } catch { body = {}; }
  if (!response.ok || body.error || !body.access_token) {
    const error = new Error("GitHub token exchange failed");
    error.status = response.status >= 400 ? response.status : 502;
    throw error;
  }
  return body;
}

export async function currentUser(token) { return github("/user", {}, token); }
