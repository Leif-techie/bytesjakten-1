/**
 * Exporterar A/B-test-affischer för marknadsföring.
 * Kör: npm run export:ab-posters
 */
import puppeteer from "puppeteer";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "marketing", "ab-poster.html");
const outputDir = path.resolve(
  process.argv[2] ?? "/opt/cursor/artifacts/marketing"
);

const AB_VARIANTS = [
  {
    id: "a_spara_pengar",
    label: "A – Spara pengar",
    headline: "Betalar du för mycket för mobilabonnemanget?",
    cta: "Kolla Bytesjakten - vi hittar bästa priset åt dig.",
  },
  {
    id: "b_automatisering",
    label: "B – Automatisering",
    headline:
      "Vi bevakar kampanjer och säger till när du kan byta billigare.",
    cta: "Testa Bytesjakten. Det är gratis.",
  },
];

const SIZES = [
  {
    suffix: "1080x1080",
    width: 1080,
    height: 1080,
    layout: "square",
    vars: {
      "--pad-y": "72px",
      "--pad-x": "56px",
      "--icon-size": "64px",
      "--brand-font": "36px",
      "--brand-gap": "48px",
      "--headline-font": "46px",
      "--headline-gap": "36px",
      "--cta-font": "30px",
      "--content-max": "880px",
    },
  },
  {
    suffix: "1200x628",
    width: 1200,
    height: 628,
    layout: "wide",
    vars: {},
  },
  {
    suffix: "1080x1920",
    width: 1080,
    height: 1920,
    layout: "tall",
    vars: {
      "--pad-y": "96px",
      "--headline-font": "50px",
      "--cta-font": "32px",
      "--brand-gap": "56px",
    },
  },
];

async function exportPoster(page, abVariant, size) {
  await page.setViewport({
    width: size.width,
    height: size.height,
    deviceScaleFactor: 2,
  });
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
  await page.evaluate(
    ({ layout, vars, headline, cta }) => {
      document.body.classList.remove("layout-tall", "layout-wide");
      if (layout === "tall") document.body.classList.add("layout-tall");
      if (layout === "wide") document.body.classList.add("layout-wide");
      for (const [key, value] of Object.entries(vars)) {
        document.documentElement.style.setProperty(key, value);
      }
      document.getElementById("headline").textContent = headline;
      document.getElementById("cta").textContent = cta;
    },
    {
      layout: size.layout,
      vars: size.vars,
      headline: abVariant.headline,
      cta: abVariant.cta,
    }
  );
  await new Promise((r) => setTimeout(r, 200));
  const out = path.join(
    outputDir,
    `bytesjakten_ab_${abVariant.id}_${size.suffix}.png`
  );
  await page.screenshot({ path: out, fullPage: false });
  console.log(out);
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--allow-file-access-from-files",
    ],
  });
  const page = await browser.newPage();
  try {
    for (const abVariant of AB_VARIANTS) {
      for (const size of SIZES) {
        await exportPoster(page, abVariant, size);
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
