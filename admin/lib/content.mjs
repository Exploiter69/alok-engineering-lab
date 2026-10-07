import { github } from "./github.mjs";
import { collection } from "./schema.mjs";

const OWNER = "Exploiter69";
const REPO = "alok-engineering-lab";
const COLLECTION_NAMES = Object.keys({
  projects: true, writing: true, notes: true, experiments: true, evidence: true, timeline: true, changelog: true,
});

export function validCollection(name) { return COLLECTION_NAMES.includes(name) && Boolean(collection(name)); }
export function validSlug(slug) { return /^[a-z0-9][a-z0-9._-]{0,99}$/.test(slug); }

function decode(value) {
  return Buffer.from(value, "base64").toString("utf8");
}

function cleanScalar(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  try { return JSON.parse(raw); } catch { return raw.replace(/^["']|["']$/g, ""); }
}

function parseArray(lines, index) {
  const values = [];
  for (let i = index; i < lines.length; i += 1) {
    const match = lines[i].match(/^\s+-\s+(.+)$/);
    if (!match) break;
    values.push(cleanScalar(match[1]));
  }
  return { values, next: index + values.length };
}

function parseHistory(lines, index) {
  const events = [];
  let i = index;
  while (i < lines.length) {
    if (!/^\s+-\s+state:\s*/.test(lines[i])) break;
    const state = cleanScalar(lines[i].replace(/^\s+-\s+state:\s*/, ""));
    const date = cleanScalar((lines[i + 1] || "").replace(/^\s+date:\s*/, ""));
    const note = cleanScalar((lines[i + 2] || "").replace(/^\s+note:\s*/, ""));
    events.push({ state, date, note });
    i += 3;
  }
  return { values: events, next: i };
}

export function parseDocument(source) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) throw new Error("Missing frontmatter");
  const lines = match[1].split("\n");
  const metadata = {};
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    const keyMatch = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!keyMatch) { i += 1; continue; }
    const [, key, inline] = keyMatch;
    if (inline.trim()) {
      if (inline.trim() === "[]") metadata[key] = [];
      else metadata[key] = cleanScalar(inline);
      i += 1;
      continue;
    }
    if (key === "lifecycleHistory") {
      const parsed = parseHistory(lines, i + 1);
      metadata[key] = parsed.values; i = parsed.next; continue;
    }
    const parsed = parseArray(lines, i + 1);
    metadata[key] = parsed.values; i = parsed.next;
  }
  return { metadata, body: match[2].replace(/^\n/, "") };
}

function scalar(value) {
  return JSON.stringify(String(value ?? ""));
}

function serialize(metadata, body) {
  const lines = ["---"];
  const keys = Object.keys(metadata);
  for (const key of keys) {
    const value = metadata[key];
    if (Array.isArray(value)) {
      if (value.length === 0) { lines.push(`${key}: []`); continue; }
      lines.push(`${key}:`);
      for (const item of value) {
        if (key === "lifecycleHistory" && item && typeof item === "object") {
          lines.push(`  - state: ${scalar(item.state)}`);
          lines.push(`    date: ${scalar(item.date)}`);
          lines.push(`    note: ${scalar(item.note)}`);
        } else {
          lines.push(`  - ${scalar(item)}`);
        }
      }
      continue;
    }
    if (value === undefined || value === null || value === "") continue;
    lines.push(`${key}: ${scalar(value)}`);
  }
  lines.push("---", "", body || "");
  return lines.join("\n");
}

export function validateMetadata(collectionName, metadata, references) {
  const definition = collection(collectionName);
  const errors = [];
  if (!definition) return ["Unknown collection"];
  for (const [key, descriptor] of Object.entries(definition.fields)) {
    const value = metadata[key];
    if (descriptor[1] && (value === undefined || value === null || value === "" || (Array.isArray(value) && !value.length))) errors.push(`${key} is required`);
    if (descriptor[0] === "enum" && value && !descriptor[2].includes(value)) errors.push(`${key} must be one of: ${descriptor[2].join(", ")}`);
    if (descriptor[0] === "url" && value) {
      try { new URL(value); } catch { errors.push(`${key} must be a valid URL`); }
    }
    if (descriptor[0] === "date" && value && !/^\d{4}-\d{2}-\d{2}$/.test(String(value))) errors.push(`${key} must be YYYY-MM-DD`);
    if (descriptor[0] === "string-array" && value !== undefined && !Array.isArray(value)) errors.push(`${key} must be an array`);
  }
  if (collectionName === "projects") {
    const history = Array.isArray(metadata.lifecycleHistory) ? metadata.lifecycleHistory : [];
    if (!history.length) errors.push("lifecycleHistory must contain at least one event");
    if (metadata.lifecycleSince && !/^\d{4}-\d{2}-\d{2}$/.test(metadata.lifecycleSince)) errors.push("lifecycleSince must be YYYY-MM-DD");
    history.forEach((event, index) => {
      if (!event || !["exploring","building","maintaining","archived"].includes(event.state)) errors.push(`lifecycleHistory[${index}].state is invalid`);
      if (!event?.date || !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) errors.push(`lifecycleHistory[${index}].date is invalid`);
      if (!event?.note) errors.push(`lifecycleHistory[${index}].note is required`);
      if (index && event.date < history[index - 1].date) errors.push("lifecycleHistory must be chronological");
    });
    if (history.length && metadata.lifecycle !== history.at(-1).state) errors.push("latest lifecycle history state must equal lifecycle");
    if (history.length && metadata.lifecycleSince !== history.at(-1).date) errors.push("lifecycleSince must equal latest lifecycle event date");
  }
  if (collectionName === "writing") {
    const related = Array.isArray(metadata.related) ? metadata.related : [];
    if (metadata.status === "published" && !related.length) errors.push("published writing must have related provenance");
    if (["case-study","postmortem"].includes(metadata.format) && !related.length) errors.push(`${metadata.format} writing must have related provenance`);
  }
  if (collectionName === "evidence" && (!metadata.method || !metadata.result)) errors.push("evidence requires method and result");
  const seen = new Set();
  for (const reference of Array.isArray(references) ? references : []) {
    if (seen.has(reference)) errors.push(`duplicate related reference: ${reference}`);
    seen.add(reference);
    if (!/^([a-z]+):[^:]+$/.test(reference)) errors.push(`invalid related reference: ${reference}`);
  }
  return errors;
}

export async function tree(token, ref) {
  const root = await github(`/repos/${OWNER}/${REPO}/git/trees/${ref}?recursive=1`, {}, token);
  return root.tree || [];
}

export async function readFile(token, path, ref) {
  const file = await github(`/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path).replaceAll("%2F","/")}?ref=${encodeURIComponent(ref)}`, {}, token);
  return { sha: file.sha, source: decode(file.content.replaceAll("\n", "")) };
}

export async function createBranch(token, branch) {
  const master = await github(`/repos/${OWNER}/${REPO}/git/ref/heads/master`, {}, token);
  await github(`/repos/${OWNER}/${REPO}/git/refs`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ ref:`refs/heads/${branch}`, sha:master.object.sha }) }, token);
  return master.object.sha;
}

export async function writeFile(token, path, source, branch, message, sha) {
  const body = { message, content: Buffer.from(source,"utf8").toString("base64"), branch };
  if (sha) body.sha = sha;
  return github(`/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path).replaceAll("%2F","/")}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }, token);
}

export async function deleteFile(token, path, branch, message, sha) {
  return github(`/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path).replaceAll("%2F","/")}`, { method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({message,branch,sha}) }, token);
}
