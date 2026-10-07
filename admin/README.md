# Alok Engineering Lab Admin

The admin is a separate Vercel application rooted at this directory. It is a GitHub-backed control plane; the public Astro site remains static and repository-backed.

## Phase 1

Phase 1 establishes GitHub OAuth with PKCE, a single-user allowlist, encrypted HttpOnly/Secure/SameSite session cookies, CSRF-protected logout, server-side GitHub token handling, restrictive security headers, noindex, and a health endpoint. Content mutation is intentionally not exposed yet.

## Required environment

Configure these on the admin Vercel project only:

- ADMIN_BASE_URL — exact admin origin
- ADMIN_ALLOWED_LOGINS — comma-separated GitHub login allowlist
- ADMIN_SESSION_SECRET — random secret, minimum 32 characters
- GITHUB_CLIENT_ID — GitHub OAuth App client ID
- GITHUB_CLIENT_SECRET — GitHub OAuth App client secret
- GITHUB_OAUTH_SCOPE — defaults to read:user repo

Register the exact callback:
https://admin.alokthakur.me/api/auth/callback

Never put these values in source control or browser code.

For production, configure the GitHub OAuth application and Vercel environment variables before testing login.
