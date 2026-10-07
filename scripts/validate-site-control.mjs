import fs from "node:fs";
import { validateNavigation, validateRedirects, validateSiteConfig } from "./site-control-contract.mjs";

const read = (path) => JSON.parse(fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const checks = [
  ["site", validateSiteConfig(read("src/data/site-config.json"))],
  ["navigation", validateNavigation(read("src/data/navigation.json"))],
  ["redirects", validateRedirects(read("src/data/redirects.json"))],
];
const errors = checks.flatMap(([name, result]) => result.map((error) => `${name}: ${error}`));
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Site control validation passed.");
