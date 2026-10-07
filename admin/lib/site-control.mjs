import { github } from "./github.mjs";
import { validateNavigation, validateRedirects, validateSiteConfig } from "../../scripts/site-control-contract.mjs";

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

function readJson(token, path, ref) {
  return github(`/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path).replaceAll("%2F", "/")}?ref=${encodeURIComponent(ref)}`, {}, token)
    .then(file => ({ sha: file.sha, value: JSON.parse(decode(file.content)) }));
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
