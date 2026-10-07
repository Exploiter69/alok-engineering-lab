import { send, text } from "../lib/response.mjs";
import { requireSameOrigin } from "../lib/security.mjs";
import { requireSession } from "../lib/session.mjs";
import { collection } from "../lib/schema.mjs";
import { validCollection, validSlug, parseDocument, validateMetadata, tree, readFile, createBranch, writeFile, deleteFile } from "../lib/content.mjs";

function pathFor(collectionName, slug, extension = "md") {
  return `src/content/${collectionName}/${slug}.${extension}`;
}

function branchName(value) {
  return /^admin\/[a-z0-9][a-z0-9._/-]{2,79}$/.test(value || "");
}

export default async function handler(req,res) {
  const session = requireSession(req,res);
  if (!session) return;
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const name = url.searchParams.get("collection");
    const slug = url.searchParams.get("slug");
    if (req.method === "GET") {
      if (name && !validCollection(name)) return send(res,400,{error:"invalid_collection"});
      const ref = url.searchParams.get("ref") || "master";
      const entries = await tree(session.token, ref);
      if (!name) {
        const counts = Object.fromEntries(Object.keys((await import("../lib/schema.mjs")).COLLECTIONS).map((x)=>[x,0]));
        for (const entry of entries) {
          const match = entry.path.match(/^src\/content\/([^/]+)\/(.+)\.(md|mdx)$/);
          if (match && counts[match[1]] !== undefined) counts[match[1]] += 1;
        }
        return send(res,200,{ref,counts});
      }
      if (slug) {
        if (!validSlug(slug)) return send(res,400,{error:"invalid_slug"});
        const pathMd = pathFor(name,slug,"md"), pathMdx = pathFor(name,slug,"mdx");
        const entry = entries.find((x)=>x.path===pathMd || x.path===pathMdx);
        if (!entry) return send(res,404,{error:"not_found"});
        const file = await readFile(session.token,entry.path,ref);
        const parsed = parseDocument(file.source);
        return send(res,200,{collection:name,slug,path:entry.path,sha:file.sha,source:file.source,metadata:parsed.metadata,body:parsed.body,ref});
      }
      const items = entries.filter((x)=>x.path.startsWith(`src/content/${name}/`) && /\.(md|mdx)$/.test(x.path)).map((x)=>({slug:x.path.split("/").at(-1).replace(/\.(md|mdx)$/,""),path:x.path}));
      return send(res,200,{collection:name,ref,items});
    }

    if (req.method === "POST") {
      if (!requireSameOrigin(req)) return send(res,403,{error:"cross_origin_request"});
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const action = body.action || "save";
      if (action === "branch") {
        const branch = body.branch;
        if (!branchName(branch)) return send(res,400,{error:"invalid_branch"});
        await createBranch(session.token,branch);
        return send(res,201,{branch});
      }
      if (!validCollection(body.collection) || !validSlug(body.slug) || !branchName(body.branch)) return send(res,400,{error:"invalid_target"});
      const refs = Array.isArray(body.metadata?.related) ? body.metadata.related : [];
      const errors = validateMetadata(body.collection,body.metadata,refs);
      if (errors.length) return send(res,422,{error:"validation_failed",errors});
      const entries = await tree(session.token, body.branch);
      const known = new Set(entries.filter((entry) => /^(src\\/content\\/[^/]+\\/.*\\.(md|mdx))$/.test(entry.path)).map((entry) => {
        const match = entry.path.match(/^src\\/content\\/([^/]+)\\/(.+)\\.(md|mdx)$/);
        return match ? `${match[1]}:${match[2]}` : null;
      }).filter(Boolean));
      for (const reference of refs) {
        if (!known.has(reference)) errors.push(`related target does not exist: ${reference}`);
      }
      if (errors.length) return send(res,422,{error:"validation_failed",errors});
      const source = serializeForApi(body.metadata,body.body || "");
      const result = await writeFile(session.token,pathFor(body.collection,body.slug,body.extension==="mdx"?"mdx":"md"),source,body.branch,body.message || `admin: update ${body.collection}/${body.slug}`,body.sha || undefined);
      return send(res,200,{commit:result.commit,content:result.content,path:pathFor(body.collection,body.slug,body.extension==="mdx"?"mdx":"md"),branch:body.branch});
    }

    if (req.method === "DELETE") {
      if (!requireSameOrigin(req)) return send(res,403,{error:"cross_origin_request"});
      if (!validCollection(name) || !validSlug(slug) || !branchName(url.searchParams.get("branch"))) return send(res,400,{error:"invalid_target"});
      const branch = url.searchParams.get("branch"), sha = url.searchParams.get("sha"), path = url.searchParams.get("path");
      if (!sha || !path || !path.startsWith(`src/content/${name}/`)) return send(res,400,{error:"invalid_file"});
      const result = await deleteFile(session.token,path,branch,`admin: delete ${name}/${slug}`,sha);
      return send(res,200,{commit:result.commit,branch});
    }
    return send(res,405,{error:"method_not_allowed"});
  } catch (error) {
    const status = error?.status === 404 ? 404 : error?.status === 409 ? 409 : 502;
    return send(res,status,{error:"github_operation_failed",message:error instanceof Error ? error.message : "unknown error"});
  }
}

function serializeForApi(metadata,body) {
  const lines=["---"];
  for (const [key,value] of Object.entries(metadata || {})) {
    if (Array.isArray(value)) {
      if (!value.length) { lines.push(`${key}: []`); continue; }
      lines.push(`${key}:`);
      for (const item of value) {
        if (key==="lifecycleHistory" && item && typeof item==="object") {
          lines.push(`  - state: ${JSON.stringify(item.state)}`);
          lines.push(`    date: ${JSON.stringify(item.date)}`);
          lines.push(`    note: ${JSON.stringify(item.note)}`);
        } else lines.push(`  - ${JSON.stringify(String(item ?? ""))}`);
      }
      continue;
    }
    if (value === undefined || value === null || value === "") continue;
    lines.push(`${key}: ${JSON.stringify(String(value))}`);
  }
  lines.push("---","","",body || "");
  return lines.join("\n");
}
