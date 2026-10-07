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
        <button id="new-content" class="button secondary full">+ New content</button>
        <form id="logout"><input type="hidden" value="${esc(state.session.csrf)}"><button class="link-button" type="submit">Log out</button></form>
      </aside>
      <main class="workspace">${body}</main>
    </div>`;
  document.querySelector("#logout")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await fetch("/api/auth/logout", { method: "POST", headers: { "X-CSRF-Token": event.currentTarget.querySelector("input").value }, credentials: "same-origin" });
    location.reload();
  });
  document.querySelector("#new-content")?.addEventListener("click", () => editor());
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
  const label = `<label for="field-${key}">${esc(key)}${required ? " *" : ""}</label>`;
  if (kind === "enum") return `${label}<select id="field-${key}" data-field="${key}">${options.map((x) => `<option value="${esc(x)}" ${value === x ? "selected" : ""}>${esc(x)}</option>`).join("")}</select>`;
  if (kind === "string-array") return `${label}<input id="field-${key}" data-field="${key}" value="${esc((value || []).join(", "))}" placeholder="Comma-separated values">`;
  if (kind === "lifecycle-history") return `${label}<textarea id="field-${key}" data-field="${key}" rows="8" placeholder='[{"state":"building","date":"2026-10-07","note":"..."}]'>${esc(JSON.stringify(value || [], null, 2))}</textarea><small>Keep lifecycle history chronological; the validator enforces the current state/date boundary.</small>`;
  const type = kind === "date" ? "date" : "text";
  return `${label}<${kind === "textarea" ? "textarea" : "input"} ${kind === "textarea" ? "rows=\"4\"" : `type="${type}"`} id="field-${key}" data-field="${key}" ${kind === "textarea" ? "" : `value="${esc(value || "")}"`}>${kind === "textarea" ? esc(value || "") : ""}</${kind === "textarea" ? "textarea" : "input"}>`;
}

async function editor(name = state.collection, slug = null) {
  const data = slug ? await api(`/api/content?collection=${encodeURIComponent(name)}&slug=${encodeURIComponent(slug)}`) : { metadata: {}, body: "", sha: null };
  state.collection = name || Object.keys(state.schema.collections)[0];
  state.slug = slug; state.sha = data.sha || null; state.extension = data.path?.endsWith(".mdx") ? "mdx" : "md";
  const def = state.schema.collections[state.collection];
  shell(`
    <header class="page-head"><p class="eyebrow">${esc(def.label)}</p><h1>${slug ? "Edit record" : "Create record"}</h1><p class="muted">Frontmatter is generated from the repository schema descriptor; MDX/Markdown body remains editable source.</p></header>
    <div class="editor-grid"><section class="card"><div class="fields">
      ${Object.entries(def.fields).map(([key, descriptor]) => fieldInput(key, descriptor, data.metadata?.[key])).join("")}
    </div></section>
    <section class="card"><label for="body">Markdown / MDX body</label><textarea id="body" class="body-editor" rows="30">${esc(data.body || "")}</textarea></section></div>
    <section class="card"><div class="workflow-row"><label for="slug">Slug</label><input id="slug" value="${esc(slug || "")}" placeholder="my-entry"><label for="branch">Branch</label><input id="branch" value="${esc(state.branch || "")}" placeholder="admin/my-entry"></div>
      <div id="validation" class="validation" aria-live="polite"></div><div class="actions"><button id="validate" class="button secondary">Validate</button><button id="save" class="button">Save to branch</button>${slug ? '<button id="delete" class="button danger">Delete</button>' : ""}</div></section>`);
  loadCollections();
  document.querySelector("#validate").addEventListener("click", () => validateForm(def));
  document.querySelector("#save").addEventListener("click", () => save(def));
  document.querySelector("#delete")?.addEventListener("click", () => remove());
}

function collectMetadata(def) {
  const metadata = {};
  for (const key of Object.keys(def.fields)) {
    const input = document.querySelector(`[data-field="${key}"]`);
    if (!input) continue;
    const kind = def.fields[key][0];
    if (kind === "string-array") metadata[key] = input.value.split(",").map((x) => x.trim()).filter(Boolean);
    else if (kind === "lifecycle-history") {
      try { metadata[key] = JSON.parse(input.value || "[]"); } catch { metadata[key] = input.value; }
    } else metadata[key] = input.value;
  }
  return metadata;
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
