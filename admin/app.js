const app = document.querySelector("#app");
const esc = (value) => {
  const node = document.createElement("span");
  node.textContent = String(value);
  return node.innerHTML;
};

async function load() {
  try {
    const response = await fetch("/api/session", { credentials: "same-origin" });
    if (!response.ok) return;
    const session = await response.json();
    if (!session.authenticated) return;

    app.innerHTML = `
      <div class="card"><p class="eyebrow">CONTROL PLANE</p><h1>Engineering Lab Admin</h1>
      <p class="muted">Signed in as <strong>${esc(session.user.login)}</strong>.</p>
      <div class="grid"><a class="tile" href="https://github.com/Exploiter69/alok-engineering-lab">Repository<span>GitHub source of truth</span></a>
      <a class="tile" href="/api/health">Health<span>Server status</span></a></div>
      <form id="logout" method="post" action="/api/auth/logout"><input type="hidden" name="csrf" value="${esc(session.csrf)}">
      <button class="button secondary" type="submit">Log out</button></form>
      <p class="tiny">Phase 1 shell: content management is intentionally not exposed until its Git workflow is implemented and tested.</p></div>`;

    document.querySelector("#logout").addEventListener("submit", async (event) => {
      event.preventDefault();
      const csrf = event.currentTarget.querySelector("input").value;
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "X-CSRF-Token": csrf },
        credentials: "same-origin",
      });
      location.reload();
    });
  } catch {}
}

load();
