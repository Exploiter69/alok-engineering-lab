import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dir = path.join(root, "src", "content", "projects");
const allowed = new Set(["exploring", "building", "maintaining", "archived"]);
const errors = [];

const files = fs.readdirSync(dir, { withFileTypes: true })
  .filter(entry => entry.isFile() && /\.(md|mdx)$/.test(entry.name))
  .map(entry => path.join(dir, entry.name));

function value(fm, key) {
  const match = fm.match(new RegExp("^" + key + ":\\s*(.*)$", "m"));
  return match ? match[1].trim().replace(/^["']|["']$/g, "") : "";
}

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) continue;
  const fm = match[1];
  const current = value(fm, "lifecycle");
  const since = value(fm, "lifecycleSince");
  const history = [...fm.matchAll(/- state:\s*["']?([a-z-]+)["']?\s*\n\s+date:\s*([0-9-]+)/g)]
    .map(item => ({ state: item[1], date: item[2] }));

  if (!allowed.has(current)) errors.push(file + ": invalid lifecycle");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(since)) errors.push(file + ": lifecycleSince must be YYYY-MM-DD");
  if (!history.length) {
    errors.push(file + ": lifecycle history must contain at least one event");
    continue;
  }

  for (let i = 1; i < history.length; i++) {
    if (history[i].date < history[i - 1].date) errors.push(file + ": lifecycle history is not chronological");
  }

  const latest = history[history.length - 1];
  if (latest.state !== current) errors.push(file + ": latest lifecycle history state must equal current lifecycle");
  if (latest.date !== since) errors.push(file + ": lifecycleSince must equal latest lifecycle event date");
}

if (errors.length) {
  console.error("Project lifecycle validation failed:");
  for (const error of errors) console.error("- " + error);
  process.exit(1);
}
console.log("Project lifecycle validation passed.");
