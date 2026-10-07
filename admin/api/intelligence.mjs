import { send } from "../lib/response.mjs";
import { requireSameOrigin } from "../lib/security.mjs";
import { requireSession } from "../lib/session.mjs";
import { readRecord, repositorySnapshot, repositoryRuns, contentHealth, auditFromHealth, serializeExport, markdownArchive, validateBulkSelection, bulkMetadata, contentPath, serializeMetadata } from "../lib/intelligence.mjs";
import { tree, writeFile } from "../lib/content.mjs";
import { validCollection, validSlug, parseDocument, validateMetadata } from "../lib/content.mjs";
import { github } from "../lib/github.mjs";
import { deployments } from "../lib/vercel.mjs";\nimport { readSiteControl } from "../lib/site-control.mjs";

const OWNER = "Exploiter69";
const REPO = "alok-engineering-lab";
const ROOT = `/repos/${OWNER}/${REPO}`;

function branchName(value) {
  return /^admin\/[a-z0-9][a-z0-9._/-]{2,79}$/.test(value || "");
}

function safeValue(value, max = 120) {
  const text = String(value || "").trim();
  return text.length > max ? null : text;
}

async function deploymentForRef(ref, sha) {
  try {
    const list = await deployments(20);
    return list.find((item) => item.commit === sha && (!item.branch || item.branch === ref)) || list.find((item) => item.commit === sha) || null;
  } catch {
    return null;
  }
}

async function bulk(token, body) {
  const selection = validateBulkSelection(body.items);
  if (!selection.ok) {
    const error = new Error(selection.error);
    error.status = 400;
    throw error;
  }
  if (!branchName(body.branch)) {
    const error = new Error("bulk operations require an admin/* branch");
    error.status = 400;
    throw error;
  }
  const action = String(body.action || "");
  if (!["archive", "restore", "add-tag", "remove-tag", "add-related", "remove-related"].includes(action)) {
    const error = new Error("unsupported bulk action");
    error.status = 400;
    throw error;
  }
  const value = safeValue(body.value);
  if (["add-tag", "remove-tag"].includes(action) && (!value || value.length > 80)) {
    const error = new Error("a tag value is required and must be <= 80 characters");
    error.status = 400;
    throw error;
  }
  if (["add-related", "remove-related"].includes(action)) {
    if (!value || !/^([a-z]+):[a-z0-9][a-z0-9._-]{0,99}$/.test(value)) {
      const error = new Error("relationship must be collection:slug");
      error.status = 400;
      throw error;
    }
  }

  const entries = await tree(token, body.branch);
  const known = new Set(entries.map((entry) => {
    const match = entry.path.match(/^src\/content\/([^/]+)\/(.+)\.(md|mdx)$/);
    return match ? `${match[1]}:${match[2]}` : null;
  }).filter(Boolean));
  if (action === "add-related" && !known.has(value)) {
    const error = new Error("relationship target does not exist on the selected branch");
    error.status = 422;
    throw error;
  }

  const results = [];
  for (const reference of selection.references) {
    const [collectionName, slug] = reference.split(":");
    const record = await readRecord(token, body.branch, collectionName, slug);
    const metadata = bulkMetadata(record.metadata, action, value);
    const references = Array.isArray(metadata.related) ? metadata.related : [];
    const errors = validateMetadata(collectionName, metadata, references);
    if (errors.length) {
      const error = new Error(`${reference}: ${errors.join("; ")}`);
      error.status = 422;
      throw error;
    }
    const path = record.path;
    const result = await writeFile(token, path, serializeMetadata(metadata, record.body), body.branch, `admin: bulk ${action} ${reference}`, record.sha);
    results.push({ reference, commit: result.commit?.sha || result.commit || null });
  }
  return { action, branch: body.branch, count: results.length, results };
}

export default async function handler(req, res) {
  const session = requireSession(req, res);
  if (!session) return;
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const ref = url.searchParams.get("ref") || "master";

    if (req.method === "GET") {
      if (!/^master$|^admin\/[a-z0-9][a-z0-9._/-]{2,79}$/.test(ref)) return send(res, 400, { error: "invalid_ref" });
      const repository = await repositorySnapshot(session.token, ref);
      const [health, runs] = await Promise.all([
        contentHealth(session.token, ref),
        repositoryRuns(session.token, ref, 12),
      ]);
      const deployment = await deploymentForRef(ref, repository.sha);
      const audits = auditFromHealth(health, repository, runs, deployment);
      return send(res, 200, {
        repository,
        health,
        audits,
        runs,
        deployment,
        staleRule: { days: health.thresholdDays, description: `A record is stale when its latest repository commit (or content date if history is unavailable) is at least ${health.thresholdDays} days old.` },
      });
    }

    if (req.method === "POST") {
      if (!requireSameOrigin(req)) return send(res, 403, { error: "cross_origin_request" });
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      if (body.action === "bulk") return send(res, 200, await bulk(session.token, body));
      if (body.action === "export") {
        const exportRef = body.ref || "master";
        if (!/^master$|^admin\/[a-z0-9][a-z0-9._/-]{2,79}$/.test(exportRef)) return send(res, 400, { error: "invalid_ref" });
        const health = await contentHealth(session.token, exportRef);
        const repository = await repositorySnapshot(session.token, exportRef);
        const runs = await repositoryRuns(session.token, exportRef, 12);
        const selection = Array.isArray(body.selection) ? body.selection : null;
        if (selection && !validateBulkSelection(selection).ok) return send(res, 400, { error: "invalid_selection" });
        const format = body.format === "markdown" ? "markdown" : "json";
        const payload = format === "markdown" ? markdownArchive(health, selection) : JSON.stringify(serializeExport({ health, repository, runs, config, selection }), null, 2);
        res.statusCode = 200;
        res.setHeader("Content-Type", format === "markdown" ? "text/markdown; charset=utf-8" : "application/json; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="engineering-lab-${format === "markdown" ? "archive.md" : "export.json"}"`);
        res.setHeader("Cache-Control", "no-store");
        res.end(payload);
        return;
      }
      return send(res, 400, { error: "unknown_action" });
    }

    return send(res, 405, { error: "method_not_allowed" });
  } catch (error) {
    const status = [400, 401, 403, 404, 409, 422, 503].includes(error?.status) ? error.status : 502;
    return send(res, status, { error: "intelligence_failed", message: error instanceof Error ? error.message : "unknown error" });
  }
}
