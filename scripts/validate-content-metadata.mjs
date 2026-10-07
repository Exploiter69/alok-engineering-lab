import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentRoot = path.join(root, "src", "content");
const collections = ["projects", "writing", "notes", "experiments", "timeline", "changelog", "evidence"];
const errors = [];

function files(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return files(full);
    return entry.isFile() && /\.(md|mdx)$/.test(entry.name) ? [full] : [];
  });
}

function frontmatter(source, file) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) {
    errors.push(file + ": missing frontmatter");
    return "";
  }
  return match[1];
}

function value(fm, key) {
  const match = fm.match(new RegExp("^" + key + ":\\s*(.*)$", "m"));
  return match ? match[1].trim().replace(/^["']|["']$/g, "") : "";
}

for (const collection of collections) {
  for (const file of files(path.join(contentRoot, collection))) {
    const source = fs.readFileSync(file, "utf8");
    const fm = frontmatter(source, file);
    if (!fm) continue;

    for (const key of ["title", "description", "date", "status"]) {
      if (!value(fm, key)) errors.push(file + ": missing required metadata " + key);
    }
    if (!/^tags:\s*.*$/m.test(fm)) errors.push(file + ": missing required metadata tags");

    const status = value(fm, "status");
    if (status && !["draft", "active", "archived", "published"].includes(status)) {
      errors.push(file + ": invalid status " + status);
    }

    const date = value(fm, "date");
    if (date && Number.isNaN(Date.parse(date))) errors.push(file + ": invalid date " + date);

    if (collection === "projects") {
      const lifecycle = value(fm, "lifecycle");
      if (!["exploring", "building", "maintaining", "archived"].includes(lifecycle)) errors.push(file + ": invalid lifecycle " + lifecycle);
      if (!value(fm, "lifecycleSince")) errors.push(file + ": missing lifecycleSince");
      if (!/^lifecycleHistory:\s*$/m.test(fm)) errors.push(file + ": missing lifecycleHistory");
    }

    if (collection === "writing") {
      const format = value(fm, "format");
      if (!["essay", "case-study", "guide", "postmortem", "reference"].includes(format)) errors.push(file + ": invalid writing format " + format);
    }

    if (collection === "evidence") {
      for (const key of ["kind", "outcome", "method", "result"]) {
        if (!value(fm, key)) errors.push(file + ": missing evidence field " + key);
      }
      if (!["benchmark", "failure", "verification", "observation"].includes(value(fm, "kind"))) errors.push(file + ": invalid evidence kind");
      if (!["confirmed", "failed", "inconclusive", "informational"].includes(value(fm, "outcome"))) errors.push(file + ": invalid evidence outcome");
    }
  }
}

if (errors.length) {
  console.error("Content metadata validation failed:");
  for (const error of errors) console.error("- " + error);
  process.exit(1);
}
console.log("Content metadata validation passed.");
