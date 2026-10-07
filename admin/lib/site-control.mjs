import { github } from "./github.mjs";

const OWNER = "Exploiter69";
const REPO = "alok-engineering-lab";

export const SITE_CONTROL_PATHS = {
  site: "src/data/site-config.json",
  navigation: "src/data/navigation.json",
  redirects: "src/data/redirects.json",
};

function decode(value) {
  return Buffer.from(value.replaceAll("\n", ""), "base64").toString("utf8");
}

function validInternalPath(value) {
  return typeof value === "string" && /^\/[a-z0-9][a-z0-9/_\-.?=&%]*$/i.test(value) && !value.includes("#");
}

function validDestination(value) {
  if (validInternalPath(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function readJson(token, path, ref) {
  return github(`/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path).replaceAll("%2F", "/")}?ref=${encodeURIComponent(ref)}`, {}, token)
    .then(file => ({ sha: file.sha, value: JSON.parse(decode(file.content)) }));
}

export function validateSiteConfig(value) {
  const errors = [];
  if (!value || typeof value !== "object" || Array.isArray(value)) return ["site config must be an object"];
  for (const key of ["name", "tagline", "description", "author", "currently"]) {
    if (typeof value[key] !== "string" || !value[key].trim()) errors.push(`${key} is required`);
  }
  if (!value.links || typeof value.links !== "object") errors.push("links is required");
  else {
    if (!/^https:\/\/github\.com\/[A-Za-z0-9-]+\/?$/.test(value.links.github || "")) errors.push("links.github must be a verified GitHub profile URL");
    if (value.links.linkedin && !/^https:\/\/www\.linkedin\.com\//.test(value.links.linkedin)) errors.push("links.linkedin must be an HTTPS LinkedIn URL");
  }
  if (!value.seo || typeof value.seo !== "object") errors.push("seo is required");
  else {
    if (!/^[a-z]{2}_[A-Z]{2}$/.test(value.seo.locale || "")) errors.push("seo.locale must use language_REGION format");
    if (typeof value.seo.themeColor !== "string" || !/^#[0-9a-f]{6}$/i.test(value.seo.themeColor)) errors.push("seo.themeColor must be a hex color");
    if (typeof value.seo.ogImage !== "string" || !validInternalPath(value.seo.ogImage)) errors.push("seo.ogImage must be an internal path");
  }
  return errors;
}

export function validateNavigation(value) {
  const errors = [];
  if (!value || !Array.isArray(value.primary) || !Array.isArray(value.lab)) return ["navigation requires primary and lab arrays"];
  const seen = new Set();
  for (const [group, entries] of [["primary", value.primary], ["lab", value.lab]]) {
    for (const [index, entry] of entries.entries()) {
      if (!entry || typeof entry !== "object") { errors.push(`${group}[${index}] must be an object`); continue; }
      if (typeof entry.label !== "string" || !entry.label.trim()) errors.push(`${group}[${index}].label is required`);
      if (!validInternalPath(entry.href)) errors.push(`${group}[${index}].href must be an internal path`);
      if (seen.has(entry.href)) errors.push(`duplicate navigation destination: ${entry.href}`);
      seen.add(entry.href);
    }
  }
  return errors;
}

export function validateRedirects(value) {
  if (!Array.isArray(value)) return ["redirects must be an array"];
  const errors = [];
  const sources = new Set();
  for (const [index, entry] of value.entries()) {
    if (!entry || typeof entry !== "object") { errors.push(`redirects[${index}] must be an object`); continue; }
    if (!validInternalPath(entry.source)) errors.push(`redirects[${index}].source must be an internal path`);
    if (!validDestination(entry.destination)) errors.push(`redirects[${index}].destination must be an internal path or HTTPS URL`);
    if (sources.has(entry.source)) errors.push(`duplicate redirect source: ${entry.source}`);
    sources.add(entry.source);
    if (entry.source === entry.destination) errors.push(`redirects[${index}] cannot redirect to itself`);
  }
  return errors;
}

export const SITE_CONTROL_VALIDATORS = {
  site: validateSiteConfig,
  navigation: validateNavigation,
  redirects: validateRedirects,
};

export async function readSiteControl(token, ref = "master") {
  const result = {};
  for (const [name, path] of Object.entries(SITE_CONTROL_PATHS)) result[name] = await readJson(token, path, ref);
  return result;
}

export async function writeSiteControl(token, branch, values, current = {}) {
  const results = {};
  for (const [name, path] of Object.entries(SITE_CONTROL_PATHS)) {
    const validator = SITE_CONTROL_VALIDATORS[name];
    const errors = validator(values[name]);
    if (errors.length) {
      const error = new Error(`${name}: ${errors.join("; ")}`);
      error.status = 422;
      throw error;
    }
    const response = await github(
      `/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path).replaceAll("%2F", "/")}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `admin: update ${name} control`,
          content: Buffer.from(JSON.stringify(values[name], null, 2) + "\n", "utf8").toString("base64"),
          branch,
          ...(current[name]?.sha ? { sha: current[name].sha } : {}),
        }),
      },
      token,
    );
    results[name] = response.commit?.sha || response.commit?.url || null;
  }
  return results;
}
