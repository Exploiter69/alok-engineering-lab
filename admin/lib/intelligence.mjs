import { github } from "./github.mjs";
import { COLLECTIONS, collection } from "./schema.mjs";
import { parseDocument, validateMetadata, validCollection, validSlug } from "./content.mjs";

const OWNER = "Exploiter69";
const REPO = "alok-engineering-lab";
const ROOT = `/repos/${OWNER}/${REPO}`;
export const STALE_DAYS = 180;
export const STALE_MS = STALE_DAYS * 24 * 60 * 60 * 1000;
export const CONTENT_TYPES = Object.keys(COLLECTIONS);
export const RELATION_PATTERN = /^([a-z]+):([^:]+)$/;

const STATUS = {
  healthy: "healthy",
  warning: "warning",
  failed: "failed",
  unknown: "unknown",
};

function pathFor(name, slug, extension = "md") {
  return `src/content/${name}/${slug}.${extension}`;
}

function iso(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function slugFromPath(path) {
  const match = path.match(/^src\/content\/([^/]+)\/(.+)\.(md|mdx)$/);
  return match && validCollection(match[1]) ? { collection: match[1], slug: match[2], path } : null;
}

function unique(values) {
  return [...new Set(values)];
}

export function parseReference(reference) {
  const match = String(reference || "").match(RELATION_PATTERN);
  return match ? { collection: match[1], slug: match[2], reference: match[0] } : null;
}

export function referenceFor(collectionName, slug) {
  return `${collectionName}:${slug}`;
}

export function isStale(record, now = Date.now(), thresholdMs = STALE_MS) {
  const updated = new Date(record.updatedAt || record.date || 0).getTime();
  return Number.isFinite(updated) && now - updated >= thresholdMs;
}

export function staleReason(record, now = Date.now(), thresholdMs = STALE_MS) {
  const updated = record.updatedAt || record.date;
  const ageDays = updated ? Math.floor((now - new Date(updated).getTime()) / 86400000) : null;
  return {
    stale: isStale(record, now, thresholdMs),
    thresholdDays: Math.round(thresholdMs / 86400000),
    basis: record.updatedAt ? "latest repository commit for this content file" : "content date (repository history unavailable)",
    updatedAt: updated || null,
    ageDays,
  };
}

export function classifyStatus(value) {
  if (value === true || value === "success" || value === "healthy" || value === "PASS" || value === "passed" || value === "ready" || value === "READY") return STATUS.healthy;
  if (value === "warning" || value === "neutral" || value === "pending" || value === "building" || value === "queued") return STATUS.warning;
  if (value === false || value === "failure" || value === "failed" || value === "error" || value === "ERROR" || value === "blocked") return STATUS.failed;
  return STATUS.unknown;
}

export function classifyDiffFile(file) {
  const name = String(file.filename || "");
  if (/^src\/content\/[^/]+\/.+\.(md|mdx)$/.test(name)) {
    return name.endsWith(".mdx") ? "content" : "content";
  }
  if (/\.(png|jpe?g|webp|gif|svg|avif|ico)$/i.test(name)) return "assets";
  if (/^src\/content\//.test(name)) return "content";
  if (/site-config|navigation|redirect|schema-metadata|content\.config/i.test(name)) return "configuration";
  return "source";
}

function frontmatterValue(source, key) {
  const match = source.match(new RegExp(`^\\\\s*${key}:\\\\s*(.*)$`, "m"));
  return match ? match[1].trim().replace(/^["']|["']$/g, "") : null;
}

export function semanticDiff(file, oldSource = "", newSource = "") {
  const category = classifyDiffFile(file);
  if (category !== "content") return { category, filename: file.filename, rawPatch: file.patch || null };
  const oldDoc = oldSource ? parseDocument(oldSource) : { metadata: {}, body: "" };
  const newDoc = newSource ? parseDocument(newSource) : { metadata: {}, body: "" };
  const keys = unique([...Object.keys(oldDoc.metadata), ...Object.keys(newDoc.metadata)]);
  const metadata = [];
  for (const key of keys) {
    const before = oldDoc.metadata[key];
    const after = newDoc.metadata[key];
    if (JSON.stringify(before) !== JSON.stringify(after)) metadata.push({ field: key, before: before ?? null, after: after ?? null });
  }
  const oldLines = oldDoc.body.split("\n");
  const newLines = newDoc.body.split("\n");
  return {
    category,
    filename: file.filename,
    metadata,
    body: { added: newLines.filter((line) => !oldLines.includes(line)).length, removed: oldLines.filter((line) => !newLines.includes(line)).length },
    rawPatch: file.patch || null,
  };
}

async function contentEntries(token, ref) {
  const tree = await github(`${ROOT}/git/trees/${encodeURIComponent(ref)}?recursive=1`, {}, token);
  return (tree.tree || []).map((entry) => slugFromPath(entry.path)).filter(Boolean);
}

async function readContent(token, entry, ref) {
  const encoded = encodeURIComponent(entry.path).replaceAll("%2F", "/");
  const file = await github(`${ROOT}/contents/${encoded}?ref=${encodeURIComponent(ref)}`, {}, token);
  const source = Buffer.from(String(file.content || "").replaceAll("\n", ""), "base64").toString("utf8");
  const parsed = parseDocument(source);
  return { ...entry, sha: file.sha, source, metadata: parsed.metadata, body: parsed.body };
}

async function mapLimit(items, limit, worker) {
  const results = [];
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, Math.max(items.length, 1)) }, run));
  return results;
}

async function latestCommitForPath(token, path, ref) {
  try {
    const data = await github(`${ROOT}/commits?path=${encodeURIComponent(path)}&sha=${encodeURIComponent(ref)}&per_page=1`, {}, token);
    const commit = data[0];
    return commit ? { sha: commit.sha, date: commit.commit?.committer?.date || commit.commit?.author?.date || null } : null;
  } catch {
    return null;
  }
}

export async function repositorySnapshot(token, ref = "master") {
  const branch = await github(`${ROOT}/git/ref/heads/${encodeURIComponent(ref)}`, {}, token);
  const sha = branch.object.sha;
  const commit = await github(`${ROOT}/commits/${sha}`, {}, token);
  let compare = { status: "identical", ahead_by: 0, behind_by: 0, files: [] };
  if (ref !== "master") {
    compare = await github(`${ROOT}/compare/master...${encodeURIComponent(ref)}`, {}, token);
  }
  return {
    branch: ref,
    sha,
    shortSha: sha.slice(0, 12),
    latestCommit: {
      sha: commit.sha,
      message: commit.commit?.message?.split("\n")[0] || "",
      date: commit.commit?.committer?.date || commit.commit?.author?.date || null,
      author: commit.author?.login || commit.commit?.author?.name || null,
    },
    ahead: compare.ahead_by || 0,
    behind: compare.behind_by || 0,
    compareStatus: compare.status || "unknown",
    changedFiles: (compare.files || []).map((file) => ({ ...file, category: classifyDiffFile(file) })),
  };
}

export async function repositoryRuns(token, ref = "master", limit = 12) {
  const data = await github(`${ROOT}/actions/runs?branch=${encodeURIComponent(ref)}&per_page=${limit}`, {}, token);
  return (data.workflow_runs || []).map((run) => ({
    id: run.id,
    name: run.name,
    status: run.status,
    conclusion: run.conclusion,
    sha: run.head_sha,
    branch: run.head_branch,
    event: run.event,
    createdAt: run.created_at,
    updatedAt: run.updated_at,
    url: run.html_url,
  }));
}

export async function workflowJobs(token, runId) {
  const data = await github(`${ROOT}/actions/runs/${encodeURIComponent(runId)}/jobs?per_page=100`, {}, token);
  return (data.jobs || []).map((job) => ({
    id: job.id,
    name: job.name,
    status: job.status,
    conclusion: job.conclusion,
    startedAt: job.started_at,
    completedAt: job.completed_at,
    url: job.html_url,
  }));
}

export async function contentHealth(token, ref = "master", now = Date.now(), includeBody = false) {
  const entries = await contentEntries(token, ref);
  const records = await mapLimit(entries, 8, async (entry) => {
    const [record, commit] = await Promise.all([readContent(token, entry, ref), latestCommitForPath(token, entry.path, ref)]);
    const metadata = record.metadata || {};
    const related = Array.isArray(metadata.related) ? metadata.related : [];
    const validationErrors = validateMetadata(entry.collection, metadata, related);
    return {
      ...entry,
      title: metadata.title || entry.slug,
      description: metadata.description || "",
      date: metadata.date instanceof Date ? metadata.date.toISOString().slice(0, 10) : String(metadata.date || ""),
      status: metadata.status || "unknown",
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      related: related.map(String),
      updatedAt: commit?.date || null,
      commitSha: commit?.sha || null,
      metadata,
      body: includeBody ? record.body : undefined,
      validationErrors,
      validationStatus: validationErrors.length ? STATUS.failed : STATUS.healthy,
    };
  });

  const byRef = new Map(records.map((record) => [referenceFor(record.collection, record.slug), record]));
  const inbound = new Map(records.map((record) => [referenceFor(record.collection, record.slug), []]));
  const brokenReferences = [];
  const missingRelationships = [];
  for (const record of records) {
    if (!record.related.length && ["projects", "writing", "notes", "experiments", "evidence"].includes(record.collection) && record.status !== "draft") missingRelationships.push(record);
    for (const reference of record.related) {
      const parsed = parseReference(reference);
      if (!parsed || !byRef.has(reference)) brokenReferences.push({ source: referenceFor(record.collection, record.slug), target: reference });
      else inbound.get(reference).push(referenceFor(record.collection, record.slug));
    }
  }

  const orphans = records.filter((record) => {
    if (["timeline", "changelog"].includes(record.collection) || record.status === "draft") return false;
    const ref = referenceFor(record.collection, record.slug);
    return record.related.length === 0 && inbound.get(ref).length === 0;
  });

  const stale = records.filter((record) => isStale(record, now)).map((record) => ({ ...record, staleReason: staleReason(record, now) }));
  const validationFailures = records.filter((record) => record.validationErrors.length);
  return {
    generatedAt: new Date(now).toISOString(),
    ref,
    thresholdDays: STALE_DAYS,
    totals: {
      records: records.length,
      validationFailures: validationFailures.length,
      brokenReferences: brokenReferences.length,
      missingRelationships: missingRelationships.length,
      orphans: orphans.length,
      stale: stale.length,
    },
    records,
    validationFailures,
    brokenReferences,
    missingRelationships,
    orphans,
    stale,
    graph: records.map((record) => ({
      id: referenceFor(record.collection, record.slug),
      collection: record.collection,
      title: record.title,
      outgoing: record.related,
      incoming: inbound.get(referenceFor(record.collection, record.slug)),
    })),
  };
}

export function auditFromHealth(health, repository, runs, deployment = null) {
  const checks = [
    { id: "metadata", label: "Metadata validation", status: health.totals.validationFailures ? STATUS.failed : STATUS.healthy, detail: `${health.totals.validationFailures} validation failure(s)` },
    { id: "relationships", label: "Relationship validation", status: health.totals.brokenReferences ? STATUS.failed : health.totals.missingRelationships ? STATUS.warning : STATUS.healthy, detail: `${health.totals.brokenReferences} broken, ${health.totals.missingRelationships} missing relationship(s)` },
    { id: "freshness", label: "Content freshness", status: health.totals.stale ? STATUS.warning : STATUS.healthy, detail: `${health.totals.stale} record(s) exceed the ${health.thresholdDays}-day threshold` },
  ];
  const latest = runs.find((run) => run.name === "Quality") || runs[0];
  const qualityStatus = latest ? classifyStatus(latest.conclusion) : STATUS.unknown;
  checks.push(
    { id: "repository", label: "Repository state", status: repository?.sha ? STATUS.healthy : STATUS.unknown, detail: repository?.sha ? `${repository.branch} @ ${repository.shortSha}` : "Repository state unavailable" },
    { id: "ci", label: "Latest CI", status: qualityStatus, detail: latest ? `${latest.name}: ${latest.conclusion || latest.status}` : "No workflow result available" },
    { id: "build", label: "Build", status: latest ? (qualityStatus === STATUS.healthy ? STATUS.healthy : qualityStatus) : STATUS.unknown, detail: "Derived from the repository Quality workflow; no result is fabricated." },
    { id: "performance", label: "Performance", status: latest ? qualityStatus : STATUS.unknown, detail: "Derived from the repository Quality workflow." },
    { id: "accessibility", label: "Accessibility", status: latest ? qualityStatus : STATUS.unknown, detail: "Derived from the repository Quality workflow." },
    { id: "seo", label: "SEO", status: latest ? qualityStatus : STATUS.unknown, detail: "Derived from the repository Quality workflow." },
    { id: "deployment", label: "Deployment", status: deployment ? classifyStatus(deployment.state) : STATUS.unknown, detail: deployment ? `${deployment.state} · ${deployment.commit || "commit unavailable"}` : "Vercel deployment data unavailable" },
  );
  return checks;
}

export function serializeExport({ health, repository, runs, config = null, selection = null }) {
  const records = selection ? health.records.filter((record) => selection.includes(referenceFor(record.collection, record.slug))) : health.records;
  return {
    exportedAt: new Date().toISOString(),
    source: "alok-engineering-lab repository",
    ref: health.ref,
    staleRule: `stale when the latest repository commit for a content file (or its content date when history is unavailable) is at least ${health.thresholdDays} days old`,
    repository: {
      branch: repository?.branch || null,
      sha: repository?.sha || null,
      latestCommit: repository?.latestCommit || null,
    },
    records: records.map(({ source, metadata, ...record }) => ({ ...record, metadata })),
    repositoryHealth: { totals: health.totals, workflowRuns: runs },\n    configuration: config,
  };
}

export function markdownArchive(health, selection = null) {
  const records = selection ? health.records.filter((record) => selection.includes(referenceFor(record.collection, record.slug))) : health.records;
  const sections = [
    "# Alok Engineering Lab — Content Archive",
    "",
    `Exported: ${new Date().toISOString()}`,
    `Source ref: ${health.ref}`,
    `Stale rule: ${health.thresholdDays} days without a meaningful repository update`,
    "",
  ];
  for (const record of records) {
    sections.push(`## ${record.title}`, "", `Source: ${record.path}`, "", record.body !== undefined ? serializeMetadata(record.metadata, record.body) : record.description || "", "");
  }
  return sections.join("\n");
}


export async function contentAwareDiff(token, branch) {
  const compare = await github(`${ROOT}/compare/master...${encodeURIComponent(branch)}`, {}, token);
  const files = compare.files || [];
  const result = [];
  for (const file of files) {
    const category = classifyDiffFile(file);
    if (category !== "content") {
      result.push({ ...file, category });
      continue;
    }
    let oldSource = "", newSource = "";
    const oldEncoded = encodeURIComponent(file.filename).replaceAll("%2F", "/");
    try {
      const oldFile = await github(`${ROOT}/contents/${oldEncoded}?ref=master`, {}, token);
      oldSource = Buffer.from(String(oldFile.content || "").replaceAll("\n", ""), "base64").toString("utf8");
    } catch {}
    try {
      const newFile = await github(`${ROOT}/contents/${oldEncoded}?ref=${encodeURIComponent(branch)}`, {}, token);
      newSource = Buffer.from(String(newFile.content || "").replaceAll("\n", ""), "base64").toString("utf8");
    } catch {}
    result.push({ ...semanticDiff(file, oldSource, newSource), status: file.status, additions: file.additions, deletions: file.deletions });
  }
  return result;
}

export function validateBulkSelection(items) {
  if (!Array.isArray(items) || !items.length || items.length > 100) return { ok: false, error: "selection must contain 1–100 records" };
  const normalized = [];
  for (const item of items) {
    if (!item || !validCollection(item.collection) || !validSlug(item.slug)) return { ok: false, error: "invalid bulk target" };
    normalized.push(referenceFor(item.collection, item.slug));
  }
  return { ok: true, references: unique(normalized) };
}

export function bulkMetadata(metadata, action, value) {
  const next = { ...metadata };
  if (action === "archive") next.status = "archived";
  else if (action === "restore") next.status = "active";
  else if (action === "add-tag") next.tags = unique([...(Array.isArray(next.tags) ? next.tags : []), String(value || "").trim()]);
  else if (action === "remove-tag") next.tags = (Array.isArray(next.tags) ? next.tags : []).filter((tag) => tag !== value);
  else if (action === "add-related") next.related = unique([...(Array.isArray(next.related) ? next.related : []), String(value || "").trim()]);
  else if (action === "remove-related") next.related = (Array.isArray(next.related) ? next.related : []).filter((ref) => ref !== value);
  else throw new Error("unsupported bulk action");
  return next;
}

export function contentPath(collectionName, slug, extension = "md") {
  if (!validCollection(collectionName) || !validSlug(slug) || !["md", "mdx"].includes(extension)) throw new Error("invalid content target");
  return pathFor(collectionName, slug, extension);
}

export function serializeMetadata(metadata, body = "") {
  const lines = ["---"];
  for (const [key, value] of Object.entries(metadata || {})) {
    if (Array.isArray(value)) {
      if (!value.length) { lines.push(`${key}: []`); continue; }
      lines.push(`${key}:`);
      for (const item of value) {
        if (key === "lifecycleHistory" && item && typeof item === "object") {
          lines.push(`  - state: ${JSON.stringify(item.state)}`);
          lines.push(`    date: ${JSON.stringify(item.date)}`);
          lines.push(`    note: ${JSON.stringify(item.note)}`);
        } else lines.push(`  - ${JSON.stringify(String(item ?? ""))}`);
      }
      continue;
    }
    if (value !== undefined && value !== null && value !== "") lines.push(`${key}: ${JSON.stringify(String(value))}`);
  }
  lines.push("---", "", body || "");
  return lines.join("\n");
}

export async function readRecord(token, ref, collectionName, slug) {
  const entry = { collection: collectionName, slug, path: pathFor(collectionName, slug) };
  try {
    return await readContent(token, entry, ref);
  } catch (error) {
    if (error?.status !== 404) throw error;
    entry.path = pathFor(collectionName, slug, "mdx");
    return readContent(token, entry, ref);
  }
}
