import { chromium } from "@playwright/test";

const base = process.env.AUDIT_BASE_URL ?? "http://127.0.0.1:4321";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });

const response = await page.goto(base + "/sitemap.xml", { waitUntil: "domcontentloaded" });
if (!response?.ok()) throw new Error(`Could not load sitemap: HTTP ${response?.status()}`);
const sitemap = await page.locator("body").innerText();
const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname);
if (!routes.length) throw new Error("Performance audit found no sitemap routes.");

const failures = [];
const observations = [];
for (const route of routes) {
  let lcp = 0;
  let cls = 0;
  await page.addInitScript(() => {
    window.__labVitals = { lcp: 0, cls: 0 };
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) window.__labVitals.lcp = entry.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__labVitals.cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  const started = Date.now();
  const result = await page.goto(base + route, { waitUntil: "networkidle" });
  if (!result?.ok()) {
    failures.push(`${route}: HTTP ${result?.status()}`);
    continue;
  }
  await page.waitForTimeout(100);
  const metrics = await page.evaluate(() => {
    const resources = performance.getEntriesByType("resource");
    const scripts = document.scripts.length;
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]').length;
    const externalResources = resources.filter(resource => {
      try { return new URL(resource.name).origin !== location.origin; } catch { return false; }
    }).length;
    const domNodes = document.querySelectorAll("*").length;
    const imagesWithoutDimensions = [...document.images].filter(image => !image.getAttribute("width") && !image.getAttribute("height") && !image.hasAttribute("loading")).length;
    return {
      lcp: window.__labVitals?.lcp ?? 0,
      cls: window.__labVitals?.cls ?? 0,
      ttfb: performance.getEntriesByType("navigation")[0]?.responseStart ?? 0,
      scripts, stylesheets, externalResources, domNodes, imagesWithoutDimensions,
    };
  });
  lcp = metrics.lcp; cls = metrics.cls;
  observations.push({route, ...metrics, wallMs: Date.now() - started});
  if (metrics.lcp > 2500) failures.push(`${route}: LCP ${Math.round(metrics.lcp)}ms exceeds 2500ms budget`);
  if (metrics.cls > 0.1) failures.push(`${route}: CLS ${metrics.cls.toFixed(3)} exceeds 0.10 budget`);
  if (metrics.externalResources > 0) failures.push(`${route}: ${metrics.externalResources} external runtime resources detected`);
  if (metrics.scripts > 8) failures.push(`${route}: ${metrics.scripts} script tags exceed the 8-script budget`);
  if (metrics.imagesWithoutDimensions > 0) failures.push(`${route}: image dimension/loading contract is incomplete`);
}

await browser.close();

console.log(`Performance audit checked ${observations.length} routes.`);
const maxLcp = Math.max(...observations.map(item => item.lcp), 0);
const maxCls = Math.max(...observations.map(item => item.cls), 0);
console.log(`Worst LCP: ${Math.round(maxLcp)}ms`);
console.log(`Worst CLS: ${maxCls.toFixed(3)}`);
if (failures.length) {
  console.error("Performance audit failed:");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}
