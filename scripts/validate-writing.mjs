import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "src", "content", "writing");
const allowed = new Set(["essay", "case-study", "guide", "postmortem", "reference"]);
const errors = [];

const files = fs.readdirSync(dir, { withFileTypes: true })
  .filter(entry => entry.isFile() && /\.(md|mdx)$/.test(entry.name))
  .map(entry => path.join(dir, entry.name));

function value(fm, key) {
  const match = fm.match(new RegExp("^" + key + ":\\s*(.*)$", "m"));
  return match ? match[1].trim().replace(/^["']|["']$/g, "") : "";
}

function hasRelated(fm) {
  const lines = fm.split("\n");
  const index = lines.findIndex(line => /^related:\s*/.test(line));
  if (index === -1) return false;
  const inline = lines[index].replace(/^related:\s*/, "").trim();
  if (inline) return true;
  return lines.slice(index + 1).some(line => /^\s+-\s+/.test(line));
}

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) continue;
  const fm = match[1];
  const format = value(fm, "format");
  if (!allowed.has(format)) errors.push(file + ": invalid or missing writing format");
  if (value(fm, "status") === "published" && !hasRelated(fm)) errors.push(file + ": published writing must link to source knowledge or projects");
  if (["case-study", "postmortem"].includes(format) && !hasRelated(fm)) errors.push(file + ": " + format + " writing must have related provenance");
}

if (errors.length) {
  console.error("Writing workflow validation failed:");
  for (const error of errors) console.error("- " + error);
  process.exit(1);
}
console.log("Writing workflow validation passed.");
