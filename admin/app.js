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
        <button id="new-content" class="button secondary full">+ New content</button><button id="intelligence" class="button secondary full">Engineering Intelligence</button><button id="site-control" class="button secondary full">Site control</button><button id="workflow" class="button secondary full">Git / CI / Deploy</button><button id="command" class="button secondary full">Command palette <span class="tiny">Ctrl K</span></button>
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
  document.querySelector("#intelligence")?.addEventListener("click", intelligence);
  document.querySelector("#site-control")?.addEventListener("click", siteControl);
  document.querySelector("#command")?.addEventListener("click", openCommandPalette);
  installCommandShortcut();
  document.querySelector("#workflow")?.addEventListener("click", workflow);
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


function diffLabel(file) {
  if (file.filename.endsWith(".md") || file.filename.endsWith(".mdx")) return "content / frontmatter + body";
  if (file.filename.includes("site-config") || file.filename.includes("navigation") || file.filename.includes("redirect")) return "configuration";
  if (/\\.(png|jpe?g|webp|svg|gif)$/i.test(file.filename)) return "asset";
  return "source";
}

async function workflow() {
  const data = await api("/api/workflow");
  shell(`
    <header class="page-head"><p class="eyebrow">GIT / CI / DEPLOYMENT</p><h1>Release control</h1><p class="muted">Every release stays on a branch, goes through CI and is merged through GitHub. No direct master writes.</p></header>
    <section class="cards">
      <button class="stat-card" id="workflow-refresh"><strong>${data.prs.length}</strong><span>Open pull requests</span></button>
      <button class="stat-card" id="workflow-branches"><strong>${data.branches.filter(x => x.name.startsWith("admin/")).length}</strong><span>Admin branches</span></button>
      <button class="stat-card"><strong>${data.deployments?.available === false ? "—" : (data.deployments?.length || 0)}</strong><span>Vercel deployments</span></button>
      <button class="stat-card"><strong>${data.deployments?.available === false ? "OFF" : "ON"}</strong><span>Deployment integration</span></button>
    </section>
    <section class="card"><p class="eyebrow">BRANCHES</p><div id="branch-list" class="list-card">${data.branches.filter(x => x.name.startsWith("admin/")).map(x => `<button class="record" data-workflow-branch="${esc(x.name)}"><span>${esc(x.name)}</span><small>${esc(x.sha.slice(0,12))}</small></button>`).join("") || "<div class='empty'>No admin branches.</div>"}</div></section>
    <section class="card"><p class="eyebrow">PULL REQUESTS</p><div class="list-card">${data.prs.map(pr => `<article class="record"><span><strong>#${pr.number} ${esc(pr.title)}</strong><small>${esc(pr.head.branch)} → ${esc(pr.base.branch)} · ${pr.mergeable_state || "checking"}</small></span><a class="button secondary" href="${esc(pr.html_url)}" target="_blank" rel="noopener noreferrer">GitHub</a></article>`).join("") || "<div class='empty'>No open pull requests.</div>"}</div></section>
    <section class="card"><p class="eyebrow">DEPLOYMENTS</p>${data.deployments?.available === false ? `<p class="muted">${esc(data.deployments.message)}. Set VERCEL_TOKEN and VERCEL_PROJECT_ID only on the server if this integration is desired.</p>` : `<div class="list-card">${(data.deployments || []).map(d => `<article class="record"><span><strong>${esc(d.state || "unknown")}</strong><small>${esc(d.branch || "unknown")} · ${esc(d.commit?.slice(0,12) || "no commit")}</small></span>${d.url ? `<a class="button secondary" href="${esc(d.url)}" target="_blank" rel="noopener noreferrer">Open</a>` : ""}</article>`).join("")}</div>`}</section>
    <section id="branch-detail" class="card" hidden></section>`);
  loadCollections();
  document.querySelectorAll("[data-workflow-branch]").forEach(el => el.addEventListener("click", () => workflowBranch(el.dataset.workflowBranch)));
}

async function workflowBranch(branch) {
  const detail = document.querySelector("#branch-detail");
  detail.hidden = false;
  detail.innerHTML = "<p class='muted'>Loading branch state…</p>";
  const data = await api(`/api/workflow?branch=${encodeURIComponent(branch)}`);
  const files = data.branch.files || [];
  detail.innerHTML = `
    <p class="eyebrow">BRANCH REVIEW</p><h2>${esc(branch)}</h2>
    <p class="muted">HEAD <code>${esc(data.branch.sha)}</code> · ${data.branch.ahead_by} ahead · ${data.branch.behind_by} behind · ${esc(data.branch.status)}</p>
    <div class="actions"><button id="create-pr" class="button">Create draft PR</button><button id="refresh-branch" class="button secondary">Refresh</button></div>
    <div class="validation"><strong>CI: ${esc(data.ci.state)}</strong> · ${data.runs?.length || 0} workflow runs</div>
    <div class="card"><p class="eyebrow">SEMANTIC REVIEW</p>${(data.semanticDiff || []).map(file => `<article class="diff-file"><header><strong>${esc(file.filename)}</strong><span>${esc(file.category)} · +${file.additions ?? 0} / -${file.deletions ?? 0}</span></header>${file.metadata ? `<div class="semantic-changes">${file.metadata.map(change => `<p><strong>${esc(change.field)}</strong><br><span class="muted">${esc(JSON.stringify(change.before))} → ${esc(JSON.stringify(change.after))}</span></p>`).join("") || "<p class='muted'>No frontmatter changes.</p>"}</div><p class="tiny">Body: ${file.body?.added || 0} lines added · ${file.body?.removed || 0} lines removed</p>` : `<p class="muted">${esc(file.category)} change</p>`}</article>`).join("") || "<div class='empty'>No semantic changes available.</div>"}</div>
    <div class="list-card">${files.map(file => `<article class="diff-file"><header><strong>${esc(file.filename)}</strong><span>${esc(diffLabel(file))} · +${file.additions} / -${file.deletions}</span></header><pre>${esc(file.patch || "Binary or unavailable patch")}</pre></article>`).join("") || "<div class='empty'>No changes relative to master.</div>"}</div>
    ${data.runs?.length ? `<div class="list-card">${data.runs.map(run => `<article class="record"><span><strong>${esc(run.name)}</strong><small>${esc(run.status)} / ${esc(run.conclusion || "running")} · ${esc(run.sha.slice(0,12))}</small></span><div class="actions"><a class="button secondary" href="${esc(run.html_url)}" target="_blank" rel="noopener noreferrer">Actions</a>${run.conclusion === "failure" ? `<button class="button secondary" data-rerun="${run.id}">Rerun failed</button>` : ""}</div></article>`).join("")}</div>` : ""}
    `;
  document.querySelector("#create-pr").addEventListener("click", async () => {
    const result = await api("/api/workflow", { method:"POST", body:JSON.stringify({action:"pr",branch,title:`Admin changes: ${branch}`,body:"Created from the Engineering Lab admin release control."}) });
    detail.querySelector("#create-pr").textContent = `PR #${result.number} created`;
    await workflow();
  });
  document.querySelector("#refresh-branch").addEventListener("click", () => workflowBranch(branch));
  document.querySelectorAll("[data-rerun]").forEach(button => button.addEventListener("click", async () => {
    await api("/api/workflow", {method:"POST",body:JSON.stringify({action:"rerun",runId:Number(button.dataset.rerun)})});
    await workflowBranch(branch);
  }));
}


function statusBadge(status) {
  const safe = ["healthy","warning","failed","unknown"].includes(status) ? status : "unknown";
  return `<span class="health-badge ${safe}">${esc(safe)}</span>`;
}

async function intelligence() {
  shell(`<header class="page-head"><p class="eyebrow">ENGINEERING INTELLIGENCE</p><h1>Health, provenance & repository reports</h1><p class="muted">Repository-derived health only. Unknown remains unknown when external data is unavailable.</p></header><div id="intelligence-root"><div class="card"><p class="muted">Loading repository intelligence…</p></div></div>`);
  loadCollections();
  try { const data = await api("/api/intelligence"); document.__aelHealth = data.health; renderIntelligence(data); }
  catch (error) { document.querySelector("#intelligence-root").innerHTML = `<div class="card"><strong>Health center unavailable</strong><p class="muted">${esc(error.message)}</p></div>`; }
}

function renderIntelligence(data) {
  const root = document.querySelector("#intelligence-root"), h = data.health, r = data.repository, selected = new Set();
  root.innerHTML = `
    <section class="cards"><div class="stat-card"><strong>${h.totals.records}</strong><span>Content records</span></div><div class="stat-card"><strong>${h.totals.validationFailures}</strong><span>Validation failures</span></div><div class="stat-card"><strong>${h.totals.orphans}</strong><span>Orphans</span></div><div class="stat-card"><strong>${h.totals.stale}</strong><span>Stale</span></div></section>
    <section class="card"><div class="actions"><button class="button" id="export-json">Export JSON</button><button class="button secondary" id="export-md">Export Markdown archive</button><button class="button secondary" id="refresh-intelligence">Refresh</button><button class="button secondary" id="evidence-only">Evidence / provenance</button></div><p class="tiny">Stale rule: ${esc(data.staleRule.description)}</p></section>
    <section class="card"><p class="eyebrow">REPOSITORY HEALTH</p><h2>${esc(r.branch)} @ <code>${esc(r.shortSha)}</code></h2><p class="muted">${esc(r.latestCommit.message)} · ${esc(r.latestCommit.date || "unknown")} · ahead ${r.ahead} / behind ${r.behind}</p><div class="health-grid">${data.audits.map(item => `<article class="health-row"><span>${esc(item.label)}</span>${statusBadge(item.status)}<small>${esc(item.detail)}</small></article>`).join("")}</div></section>
    <section class="card"><p class="eyebrow">HISTORICAL HEALTH</p><div class="list-card">${data.runs.length ? data.runs.map(run => `<article class="record"><span><strong>${esc(run.name)}</strong><small>${esc(run.branch)} · ${esc(run.sha.slice(0,12))} · ${esc(run.createdAt || "")}</small></span>${statusBadge(run.conclusion || run.status)}<a class="button secondary" href="${esc(run.url)}" target="_blank" rel="noopener noreferrer">Actions</a></article>`).join("") : "<div class='empty'>No workflow history available.</div>"}</div></section>
    <section class="card"><p class="eyebrow">AUDIT REPORT</p><div class="list-card">${data.audits.map(item => `<article class="record"><span><strong>${esc(item.label)}</strong><small>${esc(item.detail)}</small></span>${statusBadge(item.status)}</article>`).join("")}</div><p class="tiny">Validation, accessibility, performance and SEO states are derived from actual repository results; unavailable checks are never fabricated as PASS.</p></section>
    <section class="card"><div class="bulk-head"><div><p class="eyebrow">CONTENT / BULK OPERATIONS</p><h2>Content health records</h2><label for="intelligence-search">Search content <input id="intelligence-search" type="search" placeholder="Title, collection, tag or slug" autocomplete="off"></label></div><div class="bulk-controls"><select id="bulk-action" aria-label="Bulk action"><option value="archive">Archive</option><option value="restore">Restore</option><option value="add-tag">Add tag</option><option value="remove-tag">Remove tag</option><option value="add-related">Add relationship</option><option value="remove-related">Remove relationship</option></select><span id="bulk-value-wrap"><input id="bulk-value" placeholder="Tag or collection:slug" aria-label="Bulk value"></span><button id="bulk-run" class="button secondary">Apply on branch</button></div></div><div class="list-card">${h.records.map(record => `<label class="record record-select"><input type="checkbox" data-select-record value="${esc(record.collection+":"+record.slug)}"><span><strong>${esc(record.title)}</strong><small>${esc(record.collection)} · ${esc(record.slug)} · updated ${esc(record.updatedAt || record.date || "unknown")}</small></span><span>${statusBadge(record.validationStatus)} ${isStaleRecord(record) ? statusBadge("warning") : ""}</span></label>`).join("")}</div></section>
    <section class="card"><p class="eyebrow">RELATIONSHIP EXPLORER</p><h2>Repository knowledge graph</h2><div class="list-card">${h.graph.map(node => `<article class="record"><span><strong>${esc(node.title)}</strong><small>${esc(node.id)} · outgoing ${node.outgoing.length} · incoming ${node.incoming.length}</small></span><span class="tiny">${esc(node.incoming.slice(0,4).join(", ") || "no inbound")}</span></article>`).join("")}</div></section>
    ${reportSection("ORPHANS","Orphan content",h.orphans,"No inbound or outbound relationship where one is expected.")}
    ${reportSection("STALE CONTENT","Stale content",h.stale,`No meaningful repository update for at least ${h.thresholdDays} days.`)}
    ${reportSection("BROKEN REFERENCES","Broken relationships",h.brokenReferences,"Referenced target does not exist.")}
    ${reportSection("MISSING RELATIONSHIPS","Missing relationships",h.missingRelationships,"Active/published content has no outgoing relationship under the health rule.")}
  `;
  document.querySelector("#refresh-intelligence").addEventListener("click", intelligence);
  document.querySelector("#evidence-only").addEventListener("click", () => evidenceManager(document.__aelHealth));
  document.querySelector("#export-json").addEventListener("click", () => downloadExport("json", [...selected]));
  document.querySelector("#export-md").addEventListener("click", () => downloadExport("markdown", [...selected]));
  document.querySelectorAll("[data-select-record]").forEach(box => box.addEventListener("change", () => box.checked ? selected.add(box.value) : selected.delete(box.value)));
  document.querySelector("#bulk-run").addEventListener("click", () => runBulk(selected));
  document.querySelector("#intelligence-search").addEventListener("input", event => filterIntelligenceRecords(event.target.value));
}

function filterIntelligenceRecords(query) {
  const needle=String(query||"").trim().toLowerCase();
  document.querySelectorAll("[data-select-record]").forEach(box => { const row=box.closest(".record-select"); row.hidden=Boolean(needle && !row.textContent.toLowerCase().includes(needle)); });
}

function createAdminBranch() {
  const branch=prompt("New admin branch name:", `admin/work-${Date.now().toString(36)}`);
  if(!branch || !/^admin\/[a-z0-9][a-z0-9._/-]{2,79}$/.test(branch)) return;
  api("/api/content",{method:"POST",body:JSON.stringify({action:"branch",branch})}).then(()=>showGlobalMessage(`✓ Created ${branch}`)).catch(error=>showGlobalMessage(error.message));
}

function isStaleRecord(record) {
  const updated = new Date(record.updatedAt || record.date || 0).getTime();
  return Number.isFinite(updated) && Date.now() - updated >= 180 * 86400000;
}

function reportSection(eyebrow,title,items,reason) {
  return `<section class="card"><p class="eyebrow">${esc(eyebrow)}</p><h2>${esc(title)}</h2>${items.length ? `<div class="list-card">${items.map(item => `<article class="record"><span><strong>${esc(item.title || item.source || "record")}</strong><small>${esc(item.slug || item.target || item.staleReason?.basis || reason)}</small></span></article>`).join("")}</div>` : `<p class="muted">No findings.</p>`}</section>`;
}

async function runBulk(selected) {
  if (!selected.size) return showGlobalMessage("Select at least one record.");
  const action = document.querySelector("#bulk-action").value, value = document.querySelector("#bulk-value").value.trim();
  if (["archive","restore"].includes(action) && !confirm(`Apply ${action} to ${selected.size} record(s) on an admin branch?`)) return;
  const branch = prompt("Admin branch for this Git-backed bulk operation:", `admin/bulk-${Date.now().toString(36)}`);
  if (!branch || !/^admin\\/[a-z0-9][a-z0-9._/-]{2,79}$/.test(branch)) return showGlobalMessage("Invalid admin branch.");
  try {
    await api("/api/content",{method:"POST",body:JSON.stringify({action:"branch",branch})});
    const items=[...selected].map(ref => { const [collection,slug]=ref.split(":"); return {collection,slug}; });
    const result=await api("/api/intelligence",{method:"POST",body:JSON.stringify({action:"bulk",items,branch,action,value})});
    showGlobalMessage(`✓ Updated ${result.count} record(s) on ${branch}.`);
    await intelligence();
  } catch(error) { showGlobalMessage(error.message); }
}

async function evidenceManager(health) {
  const evidence=(health?.records || []).filter(record => record.collection === "evidence");
  shell(`<header class="page-head"><p class="eyebrow">EVIDENCE / PROVENANCE</p><h1>What proves this claim?</h1><p class="muted">Evidence remains repository-backed. Method, result, limitations and relationships are displayed exactly from content records.</p></header><section class="cards"><div class="stat-card"><strong>${evidence.length}</strong><span>Evidence records</span></div><div class="stat-card"><strong>${evidence.filter(x=>x.metadata.outcome==="confirmed").length}</strong><span>Confirmed</span></div><div class="stat-card"><strong>${evidence.filter(x=>x.metadata.outcome==="failed").length}</strong><span>Failed</span></div><div class="stat-card"><strong>${evidence.filter(x=>x.validationErrors.length).length}</strong><span>Validation failures</span></div></section><section class="list-card">${evidence.length ? evidence.map(item=>`<article class="evidence-card"><p class="eyebrow">${esc(item.metadata.kind || "evidence")} · ${esc(item.metadata.outcome || "unknown")}</p><h2>${esc(item.title)}</h2><p>${esc(item.description)}</p><dl><dt>Method</dt><dd>${esc(item.metadata.method || "—")}</dd><dt>Result</dt><dd>${esc(item.metadata.result || "—")}</dd><dt>Limitations</dt><dd>${esc((item.metadata.limitations||[]).join(", ") || "None recorded")}</dd><dt>Provenance</dt><dd>${esc(item.related.join(", ") || "No related content")}</dd></dl><div class="actions"><button class="button secondary" data-open-evidence="${esc(item.slug)}">Open record</button></div></article>`).join("") : "<div class='empty'>No evidence records.</div>"}</section><div class="actions"><button id="evidence-back" class="button secondary">Back to intelligence</button><button id="evidence-create" class="button">Create evidence</button></div>`);
  loadCollections();
  document.querySelector("#evidence-back").addEventListener("click", intelligence);
  document.querySelector("#evidence-create").addEventListener("click", () => editor("evidence"));
  document.querySelectorAll("[data-open-evidence]").forEach(button => button.addEventListener("click", () => editor("evidence",button.dataset.openEvidence)));
}

async function downloadExport(format, selection) {
  try {
    const response=await fetch("/api/intelligence",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"export",format,selection:selection.length?selection:null})});
    if(!response.ok){const data=await response.json().catch(()=>({}));throw new Error(data.message||data.error||`Export failed: ${response.status}`);}
    const blob=await response.blob(), url=URL.createObjectURL(blob), anchor=document.createElement("a");
    anchor.href=url; anchor.download=format==="markdown"?"engineering-lab-archive.md":"engineering-lab-export.json"; anchor.click(); URL.revokeObjectURL(url);
  } catch(error) { showGlobalMessage(error.message); }
}

function commandDefinitions() {
  return [
    ["Create project",()=>editor("projects")],["Create note",()=>editor("notes")],["Create writing",()=>editor("writing")],
    ["Search content",()=>intelligence().then(()=>document.querySelector("#intelligence-search")?.focus())],["Open project",()=>list("projects")],["Open evidence",()=>intelligence().then(()=>evidenceManager(document.__aelHealth))],
    ["Run validation",()=>intelligence()],["View repository health",()=>intelligence()],["View CI",()=>workflow()],["View deployment",()=>workflow()],
    ["Create branch",createAdminBranch],["View PR",()=>workflow()],["Publish",()=>workflow()],
    ["Open repository",()=>window.open("https://github.com/Exploiter69/alok-engineering-lab","_blank","noopener,noreferrer")]
  ];
}

function openCommandPalette() {
  if(document.querySelector("#command-palette")) return;
  const commands=commandDefinitions(), overlay=document.createElement("div");
  overlay.id="command-palette"; overlay.className="command-overlay";
  overlay.innerHTML=`<div class="command-dialog" role="dialog" aria-modal="true" aria-labelledby="command-title"><div class="command-head"><h2 id="command-title">Command palette</h2><kbd>Esc</kbd></div><input id="command-search" aria-label="Search commands" placeholder="Search commands…" autocomplete="off"><div id="command-list" role="listbox"></div><p class="tiny">↑ ↓ navigate · Enter run · Escape close</p></div>`;
  document.body.appendChild(overlay);
  const input=overlay.querySelector("#command-search"), listNode=overlay.querySelector("#command-list"); let index=0;
  function render(filter="") {
    const filtered=commands.filter(([label])=>label.toLowerCase().includes(filter.toLowerCase()));
    index=Math.min(index,Math.max(filtered.length-1,0));
    listNode.innerHTML=filtered.length?filtered.map(([label],i)=>`<button class="command-item ${i===index?"active":""}" role="option" aria-selected="${i===index}">${esc(label)}</button>`).join(""):"<div class='empty'>No commands match.</div>";
    listNode.querySelectorAll(".command-item").forEach((button,i)=>button.addEventListener("click",()=>{filtered[i][1]();overlay.remove();}));
    return filtered;
  }
  render(); input.addEventListener("input",()=>render(input.value));
  input.addEventListener("keydown",event=>{const filtered=render(input.value);if(event.key==="ArrowDown"){event.preventDefault();index=Math.min(index+1,filtered.length-1);render(input.value);}if(event.key==="ArrowUp"){event.preventDefault();index=Math.max(index-1,0);render(input.value);}if(event.key==="Enter"&&filtered[index]){event.preventDefault();filtered[index][1]();overlay.remove();}if(event.key==="Escape"){event.preventDefault();overlay.remove();}});
  overlay.addEventListener("click",event=>{if(event.target===overlay)overlay.remove();}); input.focus();
}

function installCommandShortcut() {
  if(window.__aelCommandShortcut)return;
  window.__aelCommandShortcut=true;
  document.addEventListener("keydown",event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="k"){event.preventDefault();openCommandPalette();}if(event.key==="/"&&!["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)){event.preventDefault();openCommandPalette();}});
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
