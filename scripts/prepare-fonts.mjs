import { mkdir, copyFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const targets = [
  ["@fontsource-variable/inter", "inter-latin-wght-normal.woff2", "Inter-Variable.woff2"],
  ["@fontsource-variable/jetbrains-mono", "jetbrains-mono-latin-wght-normal.woff2", "JetBrainsMono-Variable.woff2"],
];

async function findFile(dir, filename) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = await findFile(path, filename);
      if (found) return found;
    } else if (entry.name === filename) {
      return path;
    }
  }
  return null;
}

await mkdir(join(root, "public", "fonts"), { recursive: true });

for (const [pkg, filename, output] of targets) {
  const source = await findFile(join(root, "node_modules", pkg), filename);
  if (!source) throw new Error(`Font file not found: ${pkg}/${filename}`);
  await copyFile(source, join(root, "public", "fonts", output));
}
