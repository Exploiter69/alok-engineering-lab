import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const baseURL = "http://localhost:4321";

const distDir = path.resolve("dist");

async function discoverRoutes(directory, prefix = "") {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const routes = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    const routePath = path.join(prefix, entry.name);

    if (entry.isDirectory()) {
      routes.push(...(await discoverRoutes(fullPath, routePath)));
      continue;
    }

    if (entry.name !== "index.html" && entry.name.endsWith(".html")) {
      if (routePath === "404.html") continue;
      routes.push("/" + routePath.replace(/\\.html$/, ""));
      continue;
    }

    if (entry.name === "index.html") {
      const route = prefix ? "/" + prefix + "/" : "/";
      routes.push(route.replaceAll("//", "/"));
    }
  }

  return routes;
}

if (!(await fs.stat(distDir).catch(() => null))) {
  throw new Error("dist/ is missing. Run npm run build before npm run audit.");
}

const routes = [...new Set(await discoverRoutes(distDir))].sort();

const viewports = {
  mobile320: { width: 320, height: 800 },
  mobile375: { width: 375, height: 812 },
  mobile390: { width: 390, height: 844 },
  mobile430: { width: 430, height: 932 },
  tablet768: { width: 768, height: 900 },
  tablet1024: { width: 1024, height: 900 },
  desktop1280: { width: 1280, height: 900 },
  desktop1440: { width: 1440, height: 900 },
};

const ciViewportNames = new Set(["mobile320", "mobile390", "tablet768", "desktop1440"]);
const auditViewports = process.env.CI
  ? Object.fromEntries(Object.entries(viewports).filter(([name]) => ciViewportNames.has(name)))
  : viewports;

const auditDir = path.resolve("audit");
const screenshotRoutes = new Set(["/", "/projects/", "/explore/", "/garden/", "/about/", "/contact/"]);

await fs.rm(auditDir, { recursive: true, force: true });
await fs.mkdir(auditDir, { recursive: true });

const browser = await chromium.launch({ timeout: 15000 });
const results = [];

for (const [device, viewport] of Object.entries(auditViewports)) {
  const deviceDir = path.join(auditDir, device);
  await fs.mkdir(deviceDir, { recursive: true });

  for (const route of routes) {
    const errors = [];
    const warnings = [];

    const page = await browser.newPage({ viewport });
    page.setDefaultTimeout(5000);
    page.setDefaultNavigationTimeout(15000);

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
      // This is a static site audit: DOM readiness is the meaningful gate.
      // Waiting for networkidle can hang on harmless browser/runtime activity.
      const response = await page.goto(`${baseURL}${route}`, {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });

      status = response?.status() ?? "no response";

      audit = await page.evaluate(() => {
        const root = document.documentElement;

        const mobileMenu = document.querySelector("[data-nav-mobile]");
        if (window.matchMedia("(max-width: 767px)").matches && mobileMenu instanceof HTMLDetailsElement) mobileMenu.open = true;
        const navScope = window.matchMedia("(min-width: 768px)").matches ? "[data-nav-desktop] a" : "[data-nav-mobile][open] a";
        const visibleNavLinks = [...document.querySelectorAll(navScope)].filter((link) => {
          const style = getComputedStyle(link);
          return link.getClientRects().length > 0 && style.display !== "none" && style.visibility !== "hidden";
        });
        const navKeys = visibleNavLinks.map((link) => link.getAttribute("href") + "|" + (link.textContent?.trim() || ""));
        const duplicateNavLinks = navKeys.filter((value, index) => navKeys.indexOf(value) !== index);
        const externalResources = [...performance.getEntriesByType("resource")]
          .map((entry) => entry.name)
          .filter((name) => {
            try { return new URL(name).origin !== location.origin; } catch { return false; }
          });

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
          lang: root.getAttribute("lang") || "",
          hasSkipLink: Boolean(document.querySelector('a[href="#main-content"]')),
          duplicateNavLinks,
          externalResources,
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

      // Interaction target checks: primary controls should remain comfortably tappable.
      const primaryTargets = await page.evaluate(() => [...document.querySelectorAll("nav a, nav summary, button, input")].filter((element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden").map((element) => {
        const rect = element.getBoundingClientRect();
        return { tag: element.tagName, text: element.textContent?.trim() || "", width: rect.width, height: rect.height };
      }));
      for (const target of primaryTargets) {
        if (target.width < 44 || target.height < 44) {
          errors.push(`primary interactive target is smaller than 44px: ${target.tag} "${target.text}" (${target.width.toFixed(1)}×${target.height.toFixed(1)})`);
        }
      }

      // Full real Tab traversal on navigation-heavy representative routes at every viewport.
      // Every route still gets focusable-control naming/visibility checks below.
      const focusState = { count: 0, failures: [] };
      const keyboardAuditRoutes = new Set(["/", "/projects/", "/garden/"]);
      if (keyboardAuditRoutes.has(route) && (device === "mobile390" || device === "desktop1440")) {
        const seenFocus = new Set();
        for (let i = 0; i < 120; i++) {
          await page.keyboard.press("Tab");
          const state = await page.evaluate(() => {
            const active = document.activeElement;
            if (!(active instanceof HTMLElement) || active === document.body) return { key: "", focused: false, visible: false, named: true };
            const rect = active.getBoundingClientRect();
            const style = getComputedStyle(active);
            const key = active.tagName + "|" + (active.getAttribute("href") || "") + "|" + (active.textContent || "").trim();
            const named = !["A","BUTTON","SUMMARY"].includes(active.tagName) || Boolean((active.textContent || "").trim() || active.getAttribute("aria-label"));
            return { key, focused: true, visible: rect.width > 0 && rect.height > 0 && style.visibility !== "hidden", named };
          });
          if (!state.focused || seenFocus.has(state.key)) break;
          seenFocus.add(state.key);
          focusState.count++;
          if (!state.visible) focusState.failures.push("focused element is not visible: " + state.key);
          if (!state.named) focusState.failures.push("focusable control has no accessible name: " + state.key);
        }
        for (const failure of focusState.failures) errors.push(failure);
        if (focusState.count === 0) errors.push("keyboard traversal found no focusable controls");
        await page.evaluate(() => window.scrollTo(0, 0));
      } else {
        focusState.count = await page.locator("a,button,input,summary,select,textarea,[tabindex]:not([tabindex='-1'])").count();
      }

      // Basic document structure checks.
      if (!audit.lang) errors.push("document is missing a lang attribute");
      if (!audit.hasSkipLink) errors.push("missing skip link to main content");
      if (audit.duplicateNavLinks.length > 0) errors.push("duplicate visible navigation links: " + audit.duplicateNavLinks.join(", "));
      if (audit.externalResources.length > 0) warnings.push("external resources detected: " + audit.externalResources.length);

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

      // Interactive accessibility checks.
      for (const button of audit.buttons) {
        if (!button.text && !button.ariaLabel) errors.push("button has no accessible name");
      }
      const interactiveA11y = await page.evaluate(() => {
        const issues = [];
        for (const link of document.querySelectorAll("a")) {
          const text = (link.textContent || "").trim();
          if (!text && !link.getAttribute("aria-label")) issues.push("link has no accessible name");
        }
        for (const control of document.querySelectorAll("input,select,textarea")) {
          if (!control.id) continue;
          const label = document.querySelector(`label[for="${CSS.escape(control.id)}"]`) || control.closest("label");
          const labelled = control.getAttribute("aria-label") || control.getAttribute("aria-labelledby");
          if (!label && !labelled) issues.push("form control has no label: " + control.id);
        }
        return issues;
      });
      for (const issue of interactiveA11y) errors.push(issue);

      let focusAppearance = { checked: false, visible: true };
      if (keyboardAuditRoutes.has(route)) {
        focusAppearance = await page.evaluate(() => {
          const active = document.activeElement;
          if (!(active instanceof HTMLElement) || active === document.body) return { checked: false, visible: false };
          const style = getComputedStyle(active);
          return { checked: true, visible: style.outlineStyle !== "none" && parseFloat(style.outlineWidth) >= 2 || style.boxShadow !== "none" };
        });
        if (!focusAppearance.visible) warnings.push("keyboard focus indicator may be insufficient");
      }

      const contrastIssues = await page.evaluate(() => {
        const parse = (value) => {
          const m = value.match(/rgba?\\(([^)]+)\\)/); if (!m) return null;
          const parts = m[1].split(",").map(Number); return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
        };
        const lum = (rgb) => {
          const c = [rgb.r,rgb.g,rgb.b].map(v => v/255).map(v => v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055,2.4));
          return .2126*c[0]+.7152*c[1]+.0722*c[2];
        };
        const issues = [];
        for (const el of document.querySelectorAll("p,h1,h2,h3,h4,h5,h6,a,button,label,li,time,span")) {
          if (!(el instanceof HTMLElement) || !el.textContent?.trim() || el.getClientRects().length === 0) continue;
          if (el.closest(".lab-label") || el.className.includes("text-neutral-600")) continue;
          const fg = parse(getComputedStyle(el).color); if (!fg || fg.a < .99) continue;
          let node = el, bg = null;
          while (node && !bg) { const candidate=parse(getComputedStyle(node).backgroundColor); if (candidate && candidate.a > .99) bg=candidate; node=node.parentElement; }
          if (!bg) bg=parse(getComputedStyle(document.body).backgroundColor);
          if (!bg) continue;
          const ratio=(Math.max(lum(fg),lum(bg))+.05)/(Math.min(lum(fg),lum(bg))+.05);
          const size=parseFloat(getComputedStyle(el).fontSize);
          if (ratio < (size >= 24 ? 3 : 4.5)) issues.push((el.textContent.trim().slice(0,50)) + " (" + ratio.toFixed(2) + ":1)");
        }
        return issues;
      });
      for (const issue of contrastIssues) warnings.push("contrast below AA threshold: " + issue);

      // Check every internal link.
      const internalLinks = device === "desktop1440" && route === "/" ? [
        ...new Set(
          audit.links
            .map((link) => link.href)
            .filter((href) => href.startsWith(baseURL))
            .map((href) => {
              const url = new URL(href);
              return `${url.origin}${url.pathname}`;
            })
        ),
      ] : [];

      const brokenLinks = [];

      for (const href of internalLinks) {
        try {
          const linkResponse = await page.request.get(href, { timeout: 5000 });

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

      // Route-level interaction tests.
      if (route === "/projects/") {
        const interaction = await page.evaluate(() => {
          const search = document.querySelector("#project-search");
          const filters = [...document.querySelectorAll("[data-project-filter]")];
          const before = document.querySelectorAll("[data-project-item]:not([hidden])").length;
          const building = document.querySelector('[data-project-filter="building"]');
          if (!(search instanceof HTMLInputElement) || !(building instanceof HTMLButtonElement)) return { ok: false, reason: "project controls missing" };
          building.click();
          const pressed = building.getAttribute("aria-pressed") === "true";
          const activeStyled = building.classList.contains("bg-neutral-900") && building.classList.contains("text-white");
          search.value = "__no_such_project__"; search.dispatchEvent(new Event("input", { bubbles: true }));
          const empty = !document.querySelector("#project-empty")?.classList.contains("hidden");
          return { ok: pressed && activeStyled && empty && filters.length >= 5 && before >= 1 };
        });
        if (!interaction.ok) errors.push("project filter/search interaction failed: " + (interaction.reason || "state mismatch"));
      }
      if (route === "/garden/") {
        const interaction = await page.evaluate(async () => {
          const search = document.querySelector("#garden-search");
          if (!(search instanceof HTMLInputElement)) return { ok: false, reason: "garden search missing" };
          search.value = "__no_such_item__"; search.dispatchEvent(new Event("input", { bubbles: true }));
          await new Promise(resolve => setTimeout(resolve, 250));
          const empty = !document.querySelector("#garden-empty")?.classList.contains("hidden");
          return { ok: empty };
        });
        if (!interaction.ok) errors.push("Garden shared-index search empty-state interaction failed");
      }

      if (route === "/explore/") {
        const interaction = await page.evaluate(async () => {
          const search = document.querySelector("#explore-search");
          const all = document.querySelector('button[data-type="All"]');
          const projects = document.querySelector('button[data-type="Project"]');
          if (!(search instanceof HTMLInputElement) || !(projects instanceof HTMLButtonElement) || !(all instanceof HTMLButtonElement)) return { ok: false, reason: "Explore controls missing" };
          search.value = "__no_such_record__";
          search.dispatchEvent(new Event("input", { bubbles: true }));
          await new Promise(resolve => setTimeout(resolve, 250));
          const empty = !document.querySelector("#explore-empty")?.classList.contains("hidden");
          search.value = "";
          search.dispatchEvent(new Event("input", { bubbles: true }));
          await new Promise(resolve => setTimeout(resolve, 250));
          projects.click();
          await new Promise(resolve => setTimeout(resolve, 250));
          const pressed = projects.getAttribute("aria-pressed") === "true";
          const count = document.querySelectorAll("#explore-results article").length;
          all.click();
          return { ok: empty && pressed && count >= 1 };
        });
        if (!interaction.ok) errors.push("Explore shared-index search/filter interaction failed: " + (interaction.reason || "state mismatch"));
      }

      if (route === "/" ) {
        const interaction = await page.evaluate(async () => {
          const desktop = window.matchMedia("(min-width: 1024px)").matches;
          const opener = document.querySelector(desktop ? "nav [data-nav-desktop] [data-command-open]" : "nav [data-nav-mobile] [data-command-open]");
          if (!(opener instanceof HTMLButtonElement)) return { ok: false, reason: "command opener missing" };
          if (!desktop) {
            const menu = document.querySelector<HTMLDetailsElement>("[data-nav-mobile]");
            menu?.querySelector("summary")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
          }
          opener.click();
          await new Promise(resolve => setTimeout(resolve, 400));
          const dialog = document.querySelector("#command-palette");
          const input = document.querySelector("#command-search");
          if (!dialog?.open || !(input instanceof HTMLInputElement)) return { ok: false, reason: "command palette did not open" };
          input.value = "vajra";
          input.dispatchEvent(new Event("input", { bubbles: true }));
          await new Promise(resolve => setTimeout(resolve, 400));
          const resultCount = document.querySelectorAll("#command-result-items a[role='option']").length;
          input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
          const active = input.getAttribute("aria-activedescendant");
          input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
          await new Promise(resolve => setTimeout(resolve, 50));
          return { ok: resultCount >= 1 && Boolean(active) && !dialog.open && document.activeElement === opener };
        });
        if (!interaction.ok) errors.push("command palette keyboard interaction failed: " + (interaction.reason || "state mismatch"));
      }

      const navigationInteraction = await page.evaluate(() => {
        const mobile = document.querySelector("[data-nav-mobile]");
        const desktop = document.querySelector("[data-nav-desktop] details");
        const result = { mobile: true, desktop: true };
        if (mobile instanceof HTMLDetailsElement && window.matchMedia("(max-width: 767px)").matches) {
          mobile.open = false;
          mobile.querySelector("summary")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
          result.mobile = mobile.open && mobile.querySelectorAll("a").length >= 8;
        }
        if (desktop instanceof HTMLDetailsElement && window.matchMedia("(min-width: 768px)").matches) {
          desktop.open = false;
          desktop.querySelector("summary")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
          result.desktop = desktop.open && desktop.querySelectorAll("a").length >= 3;
        }
        return result;
      });
      if (!navigationInteraction.mobile) errors.push("mobile navigation open interaction failed");
      if (!navigationInteraction.desktop) errors.push("desktop Garden dropdown interaction failed");

      const currentNavigation = await page.evaluate(() => {
        const pathname = location.pathname.replace(/\/$/, "") || "/";
        const current = [...document.querySelectorAll("nav a[aria-current='page']")].filter(link => {
          try { return new URL(link.href).pathname.replace(/\/$/, "") === pathname; } catch { return false; }
        });
        const gardenArea = /^\/(garden|writing|notes|experiments|evidence)(\/|$)/.test(pathname);
        const gardenActive = document.querySelector("nav summary")?.classList.contains("bg-neutral-900") ?? false;
        return pathname === "/" ? current.length === 0 || current.some(link => link.getAttribute("href") === "/") : current.length >= 1 || [...document.querySelectorAll("nav a[aria-current='page']")].some(link => { try { const hrefPath = new URL(link.href).pathname.replace(/\/$/, "") || "/"; return pathname.startsWith(hrefPath + "/"); } catch { return false; } }) || (gardenArea && gardenActive);
      });
      if (!currentNavigation) warnings.push("current navigation state may not match the current route");
      const slug =
        route === "/"
          ? "home"
          : route.replace(/^\/|\/$/g, "").replaceAll("/", "-");

      if ((device === "mobile390" || device === "desktop1440") && screenshotRoutes.has(route)) {
        await page.screenshot({
          path: path.join(deviceDir, `${slug}.png`),
          fullPage: true,
        });
      }

      results.push({
        device,
        route,
        status,
        overflow: audit.overflow,
        errors,
        warnings,
        checks: {
          lang: Boolean(audit.lang),
          skipLink: audit.hasSkipLink,
          noDuplicateNavigation: audit.duplicateNavLinks.length === 0,
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
          noExternalResources: audit.externalResources.length === 0,
          primaryTargetsMeetMinimum: primaryTargets.every((target) => target.width >= 44 && target.height >= 44),
          keyboardTraversal: focusState.count > 0 && focusState.failures.length === 0,
          interactiveNames: interactiveA11y.length === 0,
          focusAppearance: !focusAppearance.checked || focusAppearance.visible,
          keyboardFocusVisible: focusState.count > 0,
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
