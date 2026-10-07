import test from "node:test";
import assert from "node:assert/strict";
import { validateNavigation, validateRedirects, validateSiteConfig } from "../../scripts/site-control-contract.mjs";

const site = {
  name: "Alok Engineering Lab",
  tagline: "Build reliable systems.",
  description: "Engineering archive.",
  author: "Alok Thakur",
  currently: "Building systems.",
  links: { github: "https://github.com/Exploiter69", linkedin: "" },
  seo: { locale: "en_IN", themeColor: "#050505", ogImage: "/og.png" },
};

test("site config validator accepts repository values", () => {
  assert.deepEqual(validateSiteConfig(site), []);
});

test("navigation rejects duplicate destinations and external links", () => {
  assert.ok(validateNavigation({ primary: [{ href: "/projects", label: "Projects" }], lab: [{ href: "/projects", label: "Lab" }] }).some((error) => error.includes("duplicate")));
  assert.ok(validateNavigation({ primary: [{ href: "https://evil.example", label: "Bad" }], lab: [] }).some((error) => error.includes("internal path")));
});

test("redirects reject conflicts, loops and unsafe destinations", () => {
  const errors = validateRedirects([
    { source: "/old", destination: "/old" },
    { source: "/old", destination: "https://example.com" },
  ]);
  assert.ok(errors.some((error) => error.includes("cannot redirect to itself")));
  assert.ok(errors.some((error) => error.includes("duplicate redirect source")));
  assert.ok(validateRedirects([{ source: "/safe", destination: "javascript:alert(1)" }]).length > 0);
});
