#!/usr/bin/env node
// Records the live Waffo Pancake checkout flow as an mp4 suitable for
// embedding in the Remotion reel.
//
// Flow: /pricing → click Subscribe → hosted Pancake checkout → fill email,
// country, card (4242 4242 4242 4242) → pay → land on /pricing/success.
//
// Output: public/videos/checkout.mp4 (staticFile convention for Remotion).
//
// Prereqs:
//   - `npm run dev` running at BASE_URL (default http://localhost:4000)
//   - .env.local has WAFFO_MERCHANT_ID + WAFFO_PRIVATE_KEY (for test mode)
//   - ffmpeg on PATH (webm → mp4 transcode)

import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { readdir, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:4000";
const TEST_EMAIL = "js@waffo.com";
const TEST_COUNTRY = "Singapore";
const TEST_CARD = "4242 4242 4242 4242";
const TEST_EXPIRY = "12 / 29";
const TEST_CVC = "123";

const OUT_DIR = path.resolve("public", "videos");
const OUT_FILE = path.join(OUT_DIR, "checkout.mp4");
const RAW_DIR = path.resolve(".playwright-recordings");

async function waitForServer(url, timeoutMs = 10000) {
  const start = Date.now();
  let lastErr;
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
      lastErr = new Error(`${res.status} ${res.statusText}`);
    } catch (e) {
      lastErr = e;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(
    `Server at ${url} did not respond within ${timeoutMs}ms: ${lastErr?.message}. Run 'npm run dev' first.`,
  );
}

// Best-effort locator that tries several strategies. Returns the first match
// or throws with useful diagnostics.
async function findOneOf(page, candidates, label) {
  for (const fn of candidates) {
    try {
      const loc = await fn();
      if (loc && (await loc.count()) > 0) return loc.first();
    } catch {}
  }
  throw new Error(`Could not locate "${label}" on ${page.url()}`);
}

async function main() {
  console.log("→ Checking dev server...");
  await waitForServer(BASE_URL);

  console.log("→ Preparing output dirs...");
  if (existsSync(RAW_DIR)) await rm(RAW_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(RAW_DIR, { recursive: true });

  console.log("→ Launching Chromium (headed, 1280×800)...");
  const browser = await chromium.launch({ headless: false, slowMo: 80 });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: { dir: RAW_DIR, size: { width: 1280, height: 800 } },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("  [browser error]", msg.text());
  });

  let recordingPath;
  try {
    console.log(`→ GET ${BASE_URL}/pricing`);
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: "networkidle" });

    // Brief pause on the hero so the viewer sees the page land first.
    await page.waitForTimeout(800);

    console.log("→ Scrolling down to reveal the pricing cards");
    await page.evaluate(() => window.scrollBy({ top: 360, left: 0, behavior: "smooth" }));
    await page.waitForTimeout(2000);

    console.log('→ Clicking "Subscribe" on Weekly intel brief');
    await page.getByRole("button", { name: /^subscribe$/i }).click();

    console.log("→ Waiting for Pancake hosted checkout redirect...");
    await page.waitForURL((u) => !u.toString().includes(BASE_URL), { timeout: 30_000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    console.log(`  now on: ${page.url()}`);

    // Let animations/fonts settle
    await page.waitForTimeout(1500);

    // ── STEP 1: details (email + country) → Continue ─────────────────────
    console.log(`→ Filling email: ${TEST_EMAIL}`);
    const emailField = await findOneOf(
      page,
      [
        () => page.locator('input[type="email"]'),
        () => page.locator('input[placeholder*="@"]'),
        () => page.locator('input[name*="email" i]'),
        () => page.getByLabel(/email/i),
      ],
      "email input",
    );
    await emailField.fill(TEST_EMAIL);

    console.log(`→ Verifying country: ${TEST_COUNTRY} (auto-detected by IP, overriding if needed)`);
    const countryCtrl = await findOneOf(
      page,
      [
        () => page.locator('select').filter({ hasText: TEST_COUNTRY }),
        () => page.locator('select[name*="country" i]'),
        () => page.getByLabel(/country/i),
        () => page.locator('select').first(),
      ],
      "country control",
    ).catch(() => null);
    if (countryCtrl) {
      try {
        await countryCtrl.selectOption({ label: TEST_COUNTRY });
      } catch {
        // Custom dropdown fallback
        await countryCtrl.click();
        await page.getByRole("option", { name: new RegExp(`^${TEST_COUNTRY}$`, "i") }).click().catch(() => {});
      }
    }

    await page.waitForTimeout(400);
    console.log('→ Clicking "Continue" to advance to payment step');
    await page.getByRole("button", { name: /^continue$/i }).click();

    // ── STEP 2: payment (card fields) → Pay ──────────────────────────────
    console.log("→ Waiting for payment step DOM (card input to appear)...");
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    // The "Processing..." spinner can run for a few seconds while Pancake
    // mints the payment intent. Wait up to 30s for ANY card-like input to
    // mount (direct input or PSP iframe), not a fixed sleep.
    await Promise.race([
      page.locator('input[autocomplete="cc-number"]').first().waitFor({ state: "visible", timeout: 30_000 }),
      page.locator('input[name*="cardnumber" i], input[name*="card_number" i], input[name*="card-number" i]').first().waitFor({ state: "visible", timeout: 30_000 }),
      page.frameLocator('iframe[name*="card" i], iframe[title*="card" i]').locator('input[autocomplete="cc-number"]').first().waitFor({ state: "visible", timeout: 30_000 }),
    ]).catch(() => {
      // Even if none of the above resolve (e.g. different selector in use)
      // give the DOM a final settle window before findOneOf runs.
      return page.waitForTimeout(2000);
    });
    console.log(`  now on: ${page.url()}`);

    console.log(`→ Filling card number: ${TEST_CARD}`);
    const cardField = await findOneOf(
      page,
      [
        () => page.locator('input[autocomplete="cc-number"]'),
        () => page.locator('input[name*="cardnumber" i], input[name*="card_number" i], input[name*="card-number" i]'),
        () => page.getByLabel(/card number/i),
        // Stripe/PSP iframe fallback
        () => page.frameLocator('iframe[name*="card" i], iframe[title*="card number" i]').locator('input[autocomplete="cc-number"]'),
        () => page.frameLocator('iframe').locator('input[autocomplete="cc-number"]'),
      ],
      "card number input",
    );
    await cardField.fill(TEST_CARD);

    console.log(`→ Filling expiry: ${TEST_EXPIRY}`);
    const expField = await findOneOf(
      page,
      [
        () => page.locator('input[autocomplete="cc-exp"]'),
        () => page.locator('input[name*="exp" i]'),
        () => page.getByLabel(/expir|mm.?\/.?yy/i),
        () => page.frameLocator('iframe[title*="expir" i], iframe[name*="exp" i]').locator('input[name*="exp" i]'),
      ],
      "expiry input",
    );
    await expField.fill(TEST_EXPIRY);

    console.log(`→ Filling CVC: ${TEST_CVC}`);
    const cvcField = await findOneOf(
      page,
      [
        () => page.locator('input[autocomplete="cc-csc"]'),
        () => page.locator('input[name*="cvc" i], input[name*="cvv" i]'),
        () => page.getByLabel(/cvc|cvv|security code/i),
        () => page.frameLocator('iframe[title*="cvc" i], iframe[title*="security" i]').locator('input[name*="cvc" i]'),
      ],
      "cvc input",
    );
    await cvcField.fill(TEST_CVC);

    // Optional name-on-card
    const nameField = page.getByLabel(/name on card|cardholder name|^name$/i).first();
    if (await nameField.isVisible({ timeout: 500 }).catch(() => false)) {
      console.log("→ Filling name on card");
      await nameField.fill("Ava Test");
    }

    await page.waitForTimeout(400);
    console.log("→ Submitting payment");
    const payBtn = await findOneOf(
      page,
      [
        () => page.getByRole("button", { name: /^pay\b.*\$/i }),
        () => page.getByRole("button", { name: /pay now|complete|confirm|subscribe/i }),
        () => page.locator('button[type="submit"]').last(),
      ],
      "pay button",
    );
    await payBtn.click();

    console.log("→ Waiting for success redirect...");
    await page.waitForURL(/\/pricing\/success/, { timeout: 45_000 });
    await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
    await page.waitForTimeout(1500); // let success page settle

    console.log("→ Flow complete");
  } catch (err) {
    const failShot = path.join(RAW_DIR, "failure.png");
    await page.screenshot({ path: failShot, fullPage: true }).catch(() => {});
    console.error(`✗ Flow failed at ${page.url()}`);
    console.error(`  screenshot: ${failShot}`);
    throw err;
  } finally {
    try {
      recordingPath = await page.video()?.path();
    } catch {}
    await context.close(); // finalises video
    await browser.close();
  }

  // Locate the saved .webm (filename is random id)
  const files = await readdir(RAW_DIR);
  const webm = recordingPath && existsSync(recordingPath)
    ? recordingPath
    : files.filter((f) => f.endsWith(".webm")).map((f) => path.join(RAW_DIR, f))[0];
  if (!webm) throw new Error(".webm recording not found");

  console.log("→ Transcoding webm → mp4 (libx264, yuv420p, crf 20)...");
  await new Promise((resolve, reject) => {
    const ff = spawn(
      "ffmpeg",
      [
        "-y",
        "-i", webm,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "20",
        "-movflags", "+faststart",
        "-an",
        OUT_FILE,
      ],
      { stdio: ["ignore", "inherit", "inherit"] },
    );
    ff.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
  });

  console.log(`✓ ${OUT_FILE}`);
  // Cleanup raw recording dir (preserve failure artefacts if any)
  await rm(RAW_DIR, { recursive: true, force: true }).catch(() => {});
}

main().catch((e) => {
  console.error("✗", e.message);
  process.exit(1);
});
