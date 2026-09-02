import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const baseURL = "http://localhost:4321";

const routes = [
  "/",
  "/about",
  "/projects",
  "/projects/astra",
  "/writing",
  "/writing/welcome",
  "/notes",
  "/notes/engineering-philosophy",
  "/experiments",
  "/experiments/first-experiment",
  "/timeline",
  "/timeline/start",
  "/garden",
  "/changelog",
  "/docs",
];

const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

const auditDir = path.resolve("audit");

await fs.rm(auditDir, { recursive: true, force: true });
await fs.mkdir(auditDir, { recursive: true });

const browser = await chromium.launch();
const results = [];

for (const [device, viewport] of Object.entries(viewports)) {
  const deviceDir = path.join(auditDir, device);
  await fs.mkdir(deviceDir, { recursive: true });

  for (const route of routes) {
    const errors = [];
    const warnings = [];

    const page = await browser.newPage({ viewport });

    page.on("pageerror", (error) => {
      errors.push(`pageerror: ${error.message}`);
    });

    page.on("console", (message) => {
      if (message.type() === "error") {
        errors.push(`console: ${message.text()}`);
      }
    });

    let status = "no response";
    let audit = {};

    try {
      const response = await page.goto(`${baseURL}${route}`, {
        waitUntil: "networkidle",
      });

      status = response?.status() ?? "no response";

      audit = await page.evaluate(() => {
        const root = document.documentElement;

        const overflow = root.scrollWidth > root.clientWidth;

        const h1s = [...document.querySelectorAll("h1")];

        const images = [...document.images].map((image) => ({
          src: image.currentSrc || image.src,
          alt: image.getAttribute("alt"),
          width: image.naturalWidth,
          height: image.naturalHeight,
        }));

        const links = [...document.querySelectorAll("a")].map((link) => ({
          href: link.href,
          text: link.textContent?.trim() || "",
        }));

        const buttons = [...document.querySelectorAll("button")].map(
          (button) => ({
            text: button.textContent?.trim() || "",
            ariaLabel: button.getAttribute("aria-label"),
            disabled: button.disabled,
          })
        );

        const headings = [
          ...document.querySelectorAll("h1, h2, h3, h4, h5, h6"),
        ].map((heading) => ({
          level: Number(heading.tagName.substring(1)),
          text: heading.textContent?.trim() || "",
        }));

        const title = document.title.trim();

        const description =
          document
            .querySelector('meta[name="description"]')
            ?.getAttribute("content")
            ?.trim() || "";

        const canonical =
          document
            .querySelector('link[rel="canonical"]')
            ?.getAttribute("href")
            ?.trim() || "";

        const viewportMeta = document.querySelector(
          'meta[name="viewport"]'
        );

        const nav = document.querySelector("nav");

        const main = document.querySelector("main");

        const footer = document.querySelector("footer");

        return {
          overflow,
          viewport: {
            width: root.clientWidth,
            scrollWidth: root.scrollWidth,
          },
          title,
          description,
          canonical,
          hasViewportMeta: Boolean(viewportMeta),
          hasNav: Boolean(nav),
          hasMain: Boolean(main),
          hasFooter: Boolean(footer),
          h1Count: h1s.length,
          h1Text: h1s.map((h1) => h1.textContent?.trim() || ""),
          headings,
          images,
          links,
          buttons,
        };
      });

      // Basic document structure checks.
      if (!audit.title) {
        errors.push("missing document title");
      }

      if (!audit.description) {
        warnings.push("missing meta description");
      }

      if (!audit.canonical) {
        warnings.push("missing canonical URL");
      }

      if (!audit.hasViewportMeta) {
        errors.push("missing viewport meta tag");
      }

      if (!audit.hasNav) {
        warnings.push("missing nav element");
      }

      if (!audit.hasMain) {
        warnings.push("missing main element");
      }

      if (!audit.hasFooter) {
        warnings.push("missing footer element");
      }

      if (audit.h1Count !== 1) {
        errors.push(`expected exactly 1 h1, found ${audit.h1Count}`);
      }

      // Heading hierarchy checks.
      for (let i = 1; i < audit.headings.length; i++) {
        const previous = audit.headings[i - 1].level;
        const current = audit.headings[i].level;

        if (current > previous + 1) {
          warnings.push(
            `heading hierarchy jumps from h${previous} to h${current}`
          );
        }
      }

      // Image accessibility checks.
      for (const image of audit.images) {
        if (image.alt === null) {
          errors.push(`image missing alt attribute: ${image.src}`);
        }
      }

      // Basic button accessibility checks.
      for (const button of audit.buttons) {
        if (!button.text && !button.ariaLabel) {
          errors.push("button has no accessible name");
        }
      }

      // Check every internal link.
      const internalLinks = [
        ...new Set(
          audit.links
            .map((link) => link.href)
            .filter((href) => href.startsWith(baseURL))
            .map((href) => {
              const url = new URL(href);
              return `${url.origin}${url.pathname}`;
            })
        ),
      ];

      const brokenLinks = [];

      for (const href of internalLinks) {
        try {
          const linkResponse = await page.request.get(href);

          if (linkResponse.status() >= 400) {
            brokenLinks.push({
              href,
              status: linkResponse.status(),
            });
          }
        } catch (error) {
          brokenLinks.push({
            href,
            status: "request failed",
            error: error.message,
          });
        }
      }

      if (brokenLinks.length > 0) {
        for (const link of brokenLinks) {
          errors.push(
            `broken internal link: ${link.href} (${link.status})`
          );
        }
      }

      const slug =
        route === "/"
          ? "home"
          : route.replace(/^\/|\/$/g, "").replaceAll("/", "-");

      await page.screenshot({
        path: path.join(deviceDir, `${slug}.png`),
        fullPage: true,
      });

      results.push({
        device,
        route,
        status,
        overflow: audit.overflow,
        errors,
        warnings,
        checks: {
          title: Boolean(audit.title),
          description: Boolean(audit.description),
          canonical: Boolean(audit.canonical),
          viewportMeta: audit.hasViewportMeta,
          navigation: audit.hasNav,
          main: audit.hasMain,
          footer: audit.hasFooter,
          singleH1: audit.h1Count === 1,
          imagesHaveAlt: audit.images.every(
            (image) => image.alt !== null
          ),
          buttonsAccessible: audit.buttons.every(
            (button) => Boolean(button.text || button.ariaLabel)
          ),
          internalLinks: brokenLinks.length === 0,
        },
      });
    } catch (error) {
      results.push({
        device,
        route,
        status,
        overflow: false,
        errors: [...errors, `navigation: ${error.message}`],
        warnings,
        checks: {},
      });
    } finally {
      await page.close();
    }
  }
}

await browser.close();

console.log("\n=== ALOK ENGINEERING LAB QUALITY AUDIT ===\n");

let failures = 0;
let warningCount = 0;

for (const result of results) {
  const statusOK = result.status === 200;
  const overflowOK = !result.overflow;
  const errorsOK = result.errors.length === 0;

  const ok = statusOK && overflowOK && errorsOK;

  if (!ok) {
    failures++;
  }

  warningCount += result.warnings.length;

  console.log(
    `${ok ? "✓" : "✗"} ${result.device.padEnd(7)} ${result.route.padEnd(35)} ` +
      `HTTP ${result.status} | overflow=${result.overflow} | ` +
      `errors=${result.errors.length} | warnings=${result.warnings.length}`
  );

  for (const error of result.errors) {
    console.log(`    ERROR: ${error}`);
  }

  for (const warning of result.warnings) {
    console.log(`    WARN:  ${warning}`);
  }
}

await fs.writeFile(
  path.join(auditDir, "results.json"),
  JSON.stringify(results, null, 2)
);

const summary = {
  totalCases: results.length,
  passedCases: results.filter(
    (result) =>
      result.status === 200 &&
      !result.overflow &&
      result.errors.length === 0
  ).length,
  failedCases: failures,
  warnings: warningCount,
  desktopCases: results.filter(
    (result) => result.device === "desktop"
  ).length,
  mobileCases: results.filter(
    (result) => result.device === "mobile"
  ).length,
};

await fs.writeFile(
  path.join(auditDir, "summary.json"),
  JSON.stringify(summary, null, 2)
);

console.log("\n=== SUMMARY ===");
console.log(`Cases:     ${summary.totalCases}`);
console.log(`Passed:    ${summary.passedCases}`);
console.log(`Failed:    ${summary.failedCases}`);
console.log(`Warnings:  ${summary.warnings}`);
console.log(`Screenshots: ${auditDir}/`);
console.log(`Results:     ${auditDir}/results.json`);
console.log(`Summary:     ${auditDir}/summary.json`);

if (failures > 0) {
  console.log(`\n✗ ${failures} audit case(s) need attention.`);
  process.exitCode = 1;
} else {
  console.log("\n✓ All automated quality audit checks passed.");
}
