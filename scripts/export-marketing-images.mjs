/**
 * Exporterar marknadsföringsbilder från lokala Bytesjakten-sidor.
 * Kör: npm run export:marketing
 * Kräver: dev-server (npm run dev) + npx puppeteer (installeras vid behov).
 */
import puppeteer from "puppeteer";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve(process.argv[2] ?? "/opt/cursor/artifacts/marketing");
const baseUrl = process.argv[3] ?? "http://localhost:3000";

const HIDE_CHROME_CSS = `
  header, footer { display: none !important; }
  html, body { margin: 0; padding: 0; background: #fff; }
`;

async function waitForOffers(page) {
  await page.waitForFunction(
    () => {
      const text = document.body.innerText;
      return (
        text.includes("Bästa erbjudandet just nu") ||
        text.includes("De bästa erbjudandena just nu") ||
        text.includes("Inga aktiva kampanjer")
      );
    },
    { timeout: 20000 }
  );
  await new Promise((r) => setTimeout(r, 600));
}

async function hideChrome(page) {
  await page.addStyleTag({ content: HIDE_CHROME_CSS });
}

async function getClip(page, selectorFn, pad = 24) {
  const box = await page.evaluate((fnSource) => {
    const fn = new Function(`return (${fnSource})`)();
    const el = fn(document);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  }, selectorFn.toString());

  if (!box || box.width < 10 || box.height < 10) return null;

  return {
    x: Math.max(0, box.x - pad),
    y: Math.max(0, box.y - pad),
    width: box.width + pad * 2,
    height: box.height + pad * 2,
  };
}

async function getCombinedClip(page, selectorFns, pad = 16) {
  const box = await page.evaluate((sources) => {
    const rects = sources
      .map((src) => {
        const fn = new Function(`return (${src})`)();
        const el = fn(document);
        if (!el) return null;
        return el.getBoundingClientRect();
      })
      .filter(Boolean);
    if (rects.length === 0) return null;
    const top = Math.min(...rects.map((r) => r.top));
    const left = Math.min(...rects.map((r) => r.left));
    const bottom = Math.max(...rects.map((r) => r.bottom));
    const right = Math.max(...rects.map((r) => r.right));
    return { x: left, y: top, width: right - left, height: bottom - top };
  }, selectorFns.map((fn) => fn.toString()));

  if (!box) return null;
  return {
    x: Math.max(0, box.x - pad),
    y: Math.max(0, box.y - pad),
    width: box.width + pad * 2,
    height: box.height + pad * 2,
  };
}

async function shotClip(page, clip, filePath) {
  if (!clip) throw new Error(`Saknar clip för ${filePath}`);
  await page.screenshot({ path: filePath, clip });
}

async function shotViewport(page, filePath, width, height) {
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: filePath, fullPage: false });
}

const heroSel = (doc) => doc.querySelector("main section");
const savingsSel = (doc) => {
  const sections = [...doc.querySelectorAll("main section")];
  return sections.find((s) => s.className.includes("bg-emerald-600")) ?? null;
};
const offersSel = (doc) => {
  const h2 = [...doc.querySelectorAll("h2")].find((el) =>
    el.textContent?.includes("De bästa erbjudandena just nu")
  );
  return h2?.closest("section") ?? null;
};

async function capturePage(browser, urlPath, prefix) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 2 });
  await page.goto(`${baseUrl}${urlPath}`, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  await waitForOffers(page);
  await hideChrome(page);
  await page.evaluate(() => window.scrollTo(0, 0));

  await shotClip(
    page,
    await getClip(page, heroSel),
    path.join(outputDir, `reddit_${prefix}_hero.png`)
  );

  const savingsClip = await getClip(page, savingsSel, 0);
  if (savingsClip) {
    await shotClip(
      page,
      savingsClip,
      path.join(outputDir, `reddit_${prefix}_sparbar.png`)
    );
  }

  await shotClip(
    page,
    await getClip(page, offersSel),
    path.join(outputDir, `reddit_${prefix}_erbjudanden.png`)
  );

  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await shotClip(
    page,
    await getClip(page, heroSel, 32),
    path.join(outputDir, `reddit_${prefix}_kvadrat_1080.png`)
  );

  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 2 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await shotClip(
    page,
    await getCombinedClip(page, [heroSel, offersSel]),
    path.join(outputDir, `snap_${prefix}_story.png`)
  );

  await shotViewport(
    page,
    path.join(outputDir, `snap_${prefix}_viewport_1080x1920.png`),
    1080,
    1920
  );

  await page.close();
}

async function resizeOutputs() {
  async function cover(input, output, w, h) {
    await sharp(input)
      .resize(w, h, { fit: "cover", position: "centre" })
      .png()
      .toFile(output);
  }

  const landscape = [
    ["reddit_mobil_hero.png", "reddit_mobil_hero_1200x628.png"],
    ["reddit_mobil_erbjudanden.png", "reddit_mobil_erbjudanden_1200x628.png"],
    ["reddit_mobil_sparbar.png", "reddit_mobil_sparbar_1200x628.png"],
    ["reddit_bredband_hero.png", "reddit_bredband_hero_1200x628.png"],
    ["reddit_bredband_erbjudanden.png", "reddit_bredband_erbjudanden_1200x628.png"],
  ];

  for (const [src, dst] of landscape) {
    await cover(path.join(outputDir, src), path.join(outputDir, dst), 1200, 628);
  }

  await cover(
    path.join(outputDir, "reddit_mobil_kvadrat_1080.png"),
    path.join(outputDir, "reddit_mobil_1080x1080.png"),
    1080,
    1080
  );
  await cover(
    path.join(outputDir, "reddit_bredband_kvadrat_1080.png"),
    path.join(outputDir, "reddit_bredband_1080x1080.png"),
    1080,
    1080
  );

  await cover(
    path.join(outputDir, "snap_mobil_viewport_1080x1920.png"),
    path.join(outputDir, "snap_mobil_1080x1920.png"),
    1080,
    1920
  );
  await cover(
    path.join(outputDir, "snap_bredband_viewport_1080x1920.png"),
    path.join(outputDir, "snap_bredband_1080x1920.png"),
    1080,
    1920
  );
  await cover(
    path.join(outputDir, "snap_mobil_story.png"),
    path.join(outputDir, "snap_mobil_story_1080x1920.png"),
    1080,
    1920
  );
  await cover(
    path.join(outputDir, "snap_bredband_story.png"),
    path.join(outputDir, "snap_bredband_story_1080x1920.png"),
    1080,
    1920
  );
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1200, height: 900, deviceScaleFactor: 2 },
  });

  try {
    await capturePage(browser, "/", "mobil");
    await capturePage(browser, "/bredband", "bredband");
    await resizeOutputs();
    console.log(`Exporterade bilder till ${outputDir}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
