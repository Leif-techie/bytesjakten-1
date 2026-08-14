/**
 * Exporterar påminnelse-affischen (logga + copy) i Reddit/Snap-format.
 * Kör: node scripts/export-reminder-poster.mjs [outputDir]
 */
import puppeteer from "puppeteer";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "marketing", "reminder-poster.html");
const outputDir = path.resolve(
  process.argv[2] ?? "/opt/cursor/artifacts/marketing"
);

const VARIANTS = [
  {
    name: "bytesjakten_paminnelse_1080x1080",
    width: 1080,
    height: 1080,
    layout: "square",
    vars: {
      "--pad-y": "72px",
      "--pad-x": "64px",
      "--icon-size": "68px",
      "--brand-font": "38px",
      "--brand-gap": "48px",
      "--tagline-font": "48px",
      "--tagline-gap": "32px",
      "--copy-font": "38px",
      "--copy-max": "900px",
    },
  },
  {
    name: "bytesjakten_paminnelse_1200x628",
    width: 1200,
    height: 628,
    layout: "wide",
    vars: {},
  },
  {
    name: "bytesjakten_paminnelse_1080x1920",
    width: 1080,
    height: 1920,
    layout: "tall",
    vars: {
      "--pad-y": "100px",
      "--pad-x": "72px",
      "--icon-size": "76px",
      "--brand-font": "42px",
      "--brand-gap": "72px",
      "--tagline-font": "54px",
      "--tagline-gap": "36px",
      "--copy-font": "44px",
      "--copy-max": "920px",
    },
  },
];

async function exportVariant(page, variant) {
  await page.setViewport({
    width: variant.width,
    height: variant.height,
    deviceScaleFactor: 2,
  });
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
  await page.evaluate(
    ({ layout, vars }) => {
      document.body.classList.remove("layout-tall", "layout-wide");
      if (layout === "tall") document.body.classList.add("layout-tall");
      if (layout === "wide") document.body.classList.add("layout-wide");
      for (const [key, value] of Object.entries(vars)) {
        document.documentElement.style.setProperty(key, value);
      }
    },
    { layout: variant.layout, vars: variant.vars }
  );
  await new Promise((r) => setTimeout(r, 200));
  const out = path.join(outputDir, `${variant.name}.png`);
  await page.screenshot({ path: out, fullPage: false });
  console.log(out);
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--allow-file-access-from-files"],
  });
  const page = await browser.newPage();
  try {
    for (const variant of VARIANTS) {
      await exportVariant(page, variant);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
