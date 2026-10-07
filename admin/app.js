const app = document.querySelector("#app");
const state = { session: null, schema: null, collection: null, slug: null, branch: null, sha: null, extension: "md", refs: [] };

const esc = (value) => {
  const node = document.createElement("span");
  node.textContent = String(value ?? "");
  return node.innerHTML;
};

async function api(path, options = {}) {
  const response = await fetch(path, { credentials: "same-origin", ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.errors?.join("\n") || data.message || data.error || `Request failed: ${response.status}`);
  return data;
}

function shell(body) {
  app.innerHTML = `
    <div class="admin-layout">
      <aside class="sidebar">
        <a class="brand" href="/">Alok / Engineering Lab <span>Admin</span></a>
        <nav id="collections" aria-label="Collections"></nav>
        <button id="new-content" class="button secondary full">+ New content</button><button id="site-control" class="button secondary full">Site control</button>
        <form id="logout"><input type="hidden" value="${esc(state.session.csrf)}"><button class="link-button" type="submit">Log out</button></form>
      </aside>
      <main class="workspace">${body}</main>
    </div>`;
  document.querySelector("#logout")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await fetch("/api/auth/logout", { method: "POST", headers: { "X-CSRF-Token": event.currentTarget.querySelector("input").value }, credentials: "same-origin" });
    location.reload();
  });
  document.querySelector("#new-content")?.addEventListener("click", () => editor(state.collection || Object.keys(state.schema.collections)[0]));
  document.querySelector("#site-control")?.addEventListener("click", siteControl);
}

async function loadCollections() {
  const nav = document.querySelector("#collections");
  if (!nav) return;
  nav.innerHTML = "";
  for (const [name, definition] of Object.entries(state.schema.collections)) {
    const button = document.createElement("button");
    button.className = "nav-item";
    button.textContent = definition.label;
    button.addEventListener("click", () => list(name));
    nav.appendChild(button);
  }
}


async function siteControl() {
  const data = await api("/api/site-control");
  shell(`
    <header class="page-head"><p class="eyebrow">SITE CONTROL</p><h1>Site configuration</h1><p class="muted">Edit repository-backed identity, navigation and redirects. Save only to an admin branch.</p></header>
    <section class="editor-grid">
      <div class="card">
        <label for="site-json">Site identity / SEO
          <textarea id="site-json" class="body-editor" rows="22">${esc(JSON.stringify(data.site, null, 2))}</textarea>
        </label>
        <label for="nav-json">Navigation
          <textarea id="nav-json" class="body-editor" rows="18">${esc(JSON.stringify(data.navigation, null, 2))}</textarea>
        </label>
      </div>
      <div class="card">
        <label for="redirects-json">Redirects
          <textarea id="redirects-json" class="body-editor" rows="18">${esc(JSON.stringify(data.redirects, null, 2))}</textarea>
        </label>
        <label for="site-branch">Admin branch
          <input id="site-branch" placeholder="admin/site-control-${Date.now().toString(36)}">
        </label>
        <div class="actions"><button id="site-save" class="button" type="button">Validate & save</button><button id="site-back" class="button secondary" type="button">Dashboard</button></div>
        <div id="site-validation" class="validation" aria-live="polite"><strong>Ready.</strong> The server validates all three files before committing.</div>
      </div>
    </section>`);
  loadCollections();
  document.querySelector("#site-save").addEventListener("click", async () => {
    const validation = document.querySelector("#site-validation");
    try {
      const values = {
        site: JSON.parse(document.querySelector("#site-json").value),
        navigation: JSON.parse(document.querySelector("#nav-json").value),
        redirects: JSON.parse(document.querySelector("#redirects-json").value),
      };
      const branchName = document.querySelector("#site-branch").value.trim() || `admin/site-control-${Date.now().toString(36)}`;
      document.querySelector("#site-branch").value = branchName;
      await api("/api/content", { method: "POST", body: JSON.stringify({ action: "branch", branch: branchName }) });
      const result = await api("/api/site-control", { method: "POST", body: JSON.stringify({ branch: branchName, values }) });
      validation.innerHTML = `<strong>✓ Saved to branch</strong><pre>${esc(JSON.stringify(result.commits, null, 2))}</pre>`;
    } catch (error) {
      validation.innerHTML = `<strong>Action failed</strong><pre>${esc(error.message)}</pre>`;
    }
  });
  document.querySelector("#site-back").addEventListener("click", dashboard);
}

async function dashboard() {
  const data = await api("/api/content");
  shell(`
    <header class="page-head"><p class="eyebrow">CONTROL PLANE</p><h1>Engineering Lab Admin</h1><p class="muted">Repository-backed content management. Every mutation stays on an admin branch.</p></header>
    <section class="cards">
      ${Object.entries(state.schema.collections).map(([name, def]) => `<button class="stat-card" data-collection="${name}"><strong>${data.counts[name] ?? 0}</strong><span>${esc(def.label)}</span></button>`).join("")}
    </section>
    <section class="card"><p class="eyebrow">WORKFLOW</p><h2>Edit → validate → branch → commit</h2><p class="muted">Preview, CI and publishing controls arrive only after the repository workflow is implemented. The admin never writes directly to master.</p></section>`);
  document.querySelectorAll("[data-collection]").forEach((el) => el.addEventListener("click", () => list(el.dataset.collection)));
  loadCollections();
}

async function list(name) {
  state.collection = name; state.slug = null; state.sha = null;
  const data = await api(`/api/content?collection=${encodeURIComponent(name)}`);
  shell(`
    <header class="page-head"><div><p class="eyebrow">${esc(state.schema.collections[name].label)}</p><h1>Content records</h1></div><button id="create" class="button">+ Create</button></header>
    <div class="list-card">${data.items.length ? data.items.map((item) => `<button class="record" data-slug="${esc(item.slug)}"><span>${esc(item.slug)}</span><small>${esc(item.path)}</small></button>`).join("") : `<div class="empty"><h2>No records</h2><p>Create the first repository-backed record.</p></div>`}</div>`);
  loadCollections();
  document.querySelector("#create").addEventListener("click", () => editor());
  document.querySelectorAll(".record").forEach((el) => el.addEventListener("click", () => editor(name, el.dataset.slug)));
}

function fieldInput(key, descriptor, value) {
  const [kind, required, options] = descriptor;
  const label = `<label for="field-${key}">${esc(key)}${required ? " *" : ""}`;
  if (kind === "enum") return `${label}<select id="field-${key}" data-field="${key}">${options.map((x) => `<option value="${esc(x)}" ${value === x ? "selected" : ""}>${esc(x)}</option>`).join("")}</select></label>`;
  if (kind === "string-array") return `${label}<input id="field-${key}" data-field="${key}" value="${esc((value || []).join(", "))}" placeholder="Comma-separated values"></label>`;
  if (kind === "lifecycle-history") return `${label}<textarea id="field-${key}" data-field="${key}" rows="8" placeholder='[{"state":"building","date":"2026-10-07","note":"..."}]'>${esc(JSON.stringify(value || [], null, 2))}</textarea><small>Chronology is validated before save.</small></label>`;
  if (kind === "textarea") return `${label}<textarea id="field-${key}" data-field="${key}" rows="4">${esc(value || "")}</textarea></label>`;
  const type = kind === "date" ? "date" : "text";
  return `${label}<input type="${type}" id="field-${key}" data-field="${key}" value="${esc(value || "")}"></label>`;
}


function collectMetadata(def) {
  const metadata = {};
  for (const [key, descriptor] of Object.entries(def.fields)) {
    const element = document.querySelector(`[data-field="${key}"]`);
    if (!element) continue;
    const kind = descriptor[0];
    if (kind === "string-array") metadata[key] = element.value.split(",").map((value) => value.trim()).filter(Boolean);
    else if (kind === "lifecycle-history") {
      try { metadata[key] = element.value.trim() ? JSON.parse(element.value) : []; }
      catch { metadata[key] = "__invalid_json__"; }
    } else metadata[key] = element.value;
  }
  return metadata;
}

function defaultMetadata(def) {
  const metadata = {};
  for (const [key, descriptor] of Object.entries(def.fields)) {
    if (descriptor[0] === "string-array" || descriptor[0] === "lifecycle-history") metadata[key] = [];
    else if (descriptor[0] === "enum") metadata[key] = descriptor[2]?.[0] ?? "";
    else metadata[key] = "";
  }
  return metadata;
}

async function editor(name = state.collection || Object.keys(state.schema.collections)[0], slug = null) {
  state.collection = name;
  state.slug = slug;
  state.branch = null;
  state.sha = null;
  state.extension = "md";
  const def = state.schema.collections[name];
  let record = { metadata: defaultMetadata(def), body: "" };
  if (slug) {
    const data = await api(`/api/content?collection=${encodeURIComponent(name)}&slug=${encodeURIComponent(slug)}`);
    record = data;
    state.sha = data.sha;
    state.extension = data.path.endsWith(".mdx") ? "mdx" : "md";
  }
  shell(`
    <header class="page-head">
      <p class="eyebrow">${esc(def.label)}</p>
      <h1>${slug ? "Edit record" : "Create record"}</h1>
      <p class="muted">${slug ? esc(slug) : "Create a repository-backed record. Saving always starts an admin branch."}</p>
    </header>
    <section class="editor-grid">
      <div class="card">
        <div class="fields">
          <label for="slug">Slug *<input id="slug" value="${esc(slug || "")}" placeholder="lowercase-slug"></label>
          ${Object.entries(def.fields).map(([key, descriptor]) => fieldInput(key, descriptor, record.metadata?.[key])).join("")}
        </div>
        <label class="workflow-row-label" for="branch">Admin branch
          <input id="branch" value="" placeholder="admin/${esc(slug || "new-content")}-...">
        </label>
        <div class="actions">
          <button id="save" class="button" type="button">Save to branch</button>
          ${slug ? '<button id="delete" class="button danger" type="button">Delete from branch</button>' : ""}
          <button id="back" class="button secondary" type="button">Back</button>
        </div>
        <div id="validation" class="validation" aria-live="polite"><strong>Ready.</strong> Validation runs before every save.</div>
      </div>
      <div class="card">
        <label for="body">Markdown / MDX body
          <textarea id="body" class="body-editor" rows="28" placeholder="# Technical record">${esc(record.body || "")}</textarea>
        </label>
        <p class="tiny">Frontmatter is generated from the validated metadata. The body remains Markdown/MDX source.</p>
      </div>
    </section>`);
  loadCollections();
  document.querySelector("#save").addEventListener("click", () => save(def));
  document.querySelector("#delete")?.addEventListener("click", remove);
  document.querySelector("#back").addEventListener("click", () => list(name));
}

async function validateForm(def) {
  const metadata = collectMetadata(def);
  const related = metadata.related || [];
  const errors = [];
  for (const [key, descriptor] of Object.entries(def.fields)) {
    if (descriptor[1] && (metadata[key] === undefined || metadata[key] === "" || (Array.isArray(metadata[key]) && !metadata[key].length))) errors.push(`${key} is required`);
  }
  if (def === state.schema.collections.projects) {
    if (!Array.isArray(metadata.lifecycleHistory) || !metadata.lifecycleHistory.length) errors.push("lifecycleHistory must contain at least one event");
    else {
      const last = metadata.lifecycleHistory.at(-1);
      if (last.state !== metadata.lifecycle) errors.push("latest lifecycle history state must equal lifecycle");
      if (last.date !== metadata.lifecycleSince) errors.push("lifecycleSince must equal latest lifecycle event date");
    }
  }
  if (state.collection === "writing" && (metadata.status === "published" || ["case-study","postmortem"].includes(metadata.format)) && !related.length) errors.push("writing provenance is required");
  document.querySelector("#validation").innerHTML = errors.length ? `<strong>Validation failed</strong><ul>${errors.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "<strong>✓ Local form validation passed</strong>";
  return { metadata, errors };
}

async function ensureBranch(slug) {
  if (state.branch) return state.branch;
  const value = document.querySelector("#branch").value.trim() || `admin/${slug}-${Date.now().toString(36)}`;
  document.querySelector("#branch").value = value;
  await api("/api/content", { method: "POST", body: JSON.stringify({ action: "branch", branch: value }) });
  state.branch = value;
  return value;
}

async function save(def) {
  const { metadata, errors } = await validateForm(def);
  if (errors.length) return;
  const slug = document.querySelector("#slug").value.trim();
  if (!/^[a-z0-9][a-z0-9._-]{0,99}$/.test(slug)) return showError("Slug must contain lowercase letters, numbers, dots, underscores or hyphens.");
  try {
    const branch = await ensureBranch(slug);
    const result = await api("/api/content", { method:"POST", body: JSON.stringify({ collection:state.collection, slug, metadata, body:document.querySelector("#body").value, branch, sha:state.sha, extension:state.extension, message:`admin: update ${state.collection}/${slug}` }) });
    state.slug = slug; state.sha = result.content?.sha || null;
    document.querySelector("#validation").innerHTML = `<strong>✓ Saved</strong> <span class="muted">Commit ${esc(result.commit)}</span>`;
  } catch (error) { showError(error.message); }
}

async function remove() {
  if (!confirm("Delete this repository file on the admin branch? Git keeps the change recoverable.")) return;
  try {
    const branch = await ensureBranch(state.slug);
    const data = await api(`/api/content?collection=${encodeURIComponent(state.collection)}&slug=${encodeURIComponent(state.slug)}&ref=${encodeURIComponent(branch)}`);
    const result = await api(`/api/content?collection=${encodeURIComponent(state.collection)}&slug=${encodeURIComponent(state.slug)}&branch=${encodeURIComponent(branch)}&path=${encodeURIComponent(data.path)}&sha=${encodeURIComponent(data.sha)}`, { method:"DELETE" });
    document.querySelector("#validation").innerHTML = `<strong>✓ Deleted on branch</strong> <span class="muted">Commit ${esc(result.commit)}</span>`;
  } catch (error) { showError(error.message); }
}

function showError(message) {
  document.querySelector("#validation").innerHTML = `<strong>Action failed</strong><pre>${esc(message)}</pre>`;
}

async function boot() {
  try {
    const session = await api("/api/session");
    if (!session.authenticated) return;
    state.session = session;
    state.schema = await api("/api/schema");
    await dashboard();
  } catch (error) {
    app.innerHTML = `<div class="card"><h1>Admin unavailable</h1><p class="muted">${esc(error.message)}</p></div>`;
  }
}
boot();
