import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentRoot = path.join(root, "src", "content");
const collections = [
  "projects",
  "writing",
  "notes",
  "experiments",
  "timeline",
  "changelog",
];

const errors = [];

function collectMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) return collectMarkdown(fullPath);
    if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) return [fullPath];

    return [];
  });
}

function relatedReferences(source) {
  const match = source.match(/^related:\s*(.*)$/m);
  if (!match) return [];

  const firstLine = match[1].trim();

  if (firstLine.startsWith("[") && firstLine.endsWith("]")) {
    return firstLine
      .slice(1, -1)
      .split(",")
      .map((value) => value.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  const block = [];
  const lines = source.split("\n");
  const start = lines.findIndex((line) => /^related:\s*$/.test(line));

  if (start === -1) return [];

  for (const line of lines.slice(start + 1)) {
    const item = line.match(/^\s+-\s+(.+?)\s*$/);
    if (item) {
      block.push(item[1].trim().replace(/^["']|["']$/g, ""));
      continue;
    }

    if (line.trim() === "") continue;
    break;
  }

  return block;
}

const entries = new Map();

for (const collection of collections) {
  for (const file of collectMarkdown(path.join(contentRoot, collection))) {
    const relative = path.relative(path.join(contentRoot, collection), file).replaceAll(path.sep, "/");
    const id = relative.replace(/\.(md|mdx)$/, "");
    entries.set(`${collection}:${id}`, file);
  }
}

for (const collection of collections) {
  for (const file of collectMarkdown(path.join(contentRoot, collection))) {
    const source = fs.readFileSync(file, "utf8");
    const sourceId = `${collection}:${path
      .relative(path.join(contentRoot, collection), file)
      .replaceAll(path.sep, "/")
      .replace(/\.(md|mdx)$/, "")}`;

    for (const reference of relatedReferences(source)) {
      const separator = reference.indexOf(":");

      if (separator <= 0 || separator === reference.length - 1) {
        errors.push(`${sourceId}: invalid related reference "${reference}"`);
        continue;
      }

      const targetCollection = reference.slice(0, separator);
      if (!collections.includes(targetCollection)) {
        errors.push(`${sourceId}: unknown related collection "${targetCollection}"`);
        continue;
      }

      if (!entries.has(reference)) {
        errors.push(`${sourceId}: related target does not exist "${reference}"`);
        continue;
      }

      if (reference === sourceId) {
        errors.push(`${sourceId}: self-reference is not allowed`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error("Content relationship validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Content relationship validation passed: ${entries.size} entries checked.`);
