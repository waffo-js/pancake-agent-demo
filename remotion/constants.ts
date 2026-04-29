// Shared timing + layout constants for all compositions.
//
// Video config — all scenes use the same frame rate + dimensions so the
// Combined composition can concatenate them seamlessly without resize.
export const FPS = 30;
export const WIDTH = 1280;
export const HEIGHT = 800;

// Per-scene durations (seconds). Tune here — updates propagate everywhere.
// Reel order: site → v1 → v2 → checkout → result → summary.
export const SITE_SECONDS = 12;
export const V1_SECONDS = 22;
export const V2_SECONDS = 20;
export const CHECKOUT_SECONDS = 21;         // real Playwright capture @ 2× playback
export const RESULT_SECONDS = 33;  // longer pauses between each billing stage
export const SUMMARY_SECONDS = 8;

export const SITE_DURATION = SITE_SECONDS * FPS;
export const V1_DURATION = V1_SECONDS * FPS;
export const V2_DURATION = V2_SECONDS * FPS;
export const CHECKOUT_DURATION = CHECKOUT_SECONDS * FPS;
export const RESULT_DURATION = RESULT_SECONDS * FPS;
export const SUMMARY_DURATION = SUMMARY_SECONDS * FPS;

export const COMBINED_DURATION =
  SITE_DURATION +
  V1_DURATION +
  V2_DURATION +
  CHECKOUT_DURATION +
  RESULT_DURATION +
  SUMMARY_DURATION;

// Product-tour cut — same story as combined but without the result-based
// billing scene. Non-checkout scenes run at 0.5× playback (doubled duration)
// for calmer pacing; checkout keeps its native 1.25× Playwright-capture rate.
export const PANCAKE_DEMO_DURATION =
  SITE_DURATION * 2 +
  V1_DURATION * 2 +
  V2_DURATION * 2 +
  CHECKOUT_DURATION +
  SUMMARY_DURATION * 2;

// Slow cut of the result-based billing scene — plays scene-result.mp4 at
// 1/3 speed for a 66s duration.
export const RESULT_SLOW_DURATION = RESULT_DURATION * 3;

// Brand palette — matches the landing-page Pancake theme
export const COLORS = {
  bg: "#060F11",
  card: "#0A1A1F",
  cardHover: "#0F2329",
  border: "#16323B",
  borderSoft: "#16323B80",
  text: "#E8F2E8",
  textMuted: "#7A8A85",
  textDim: "#4A5A55",
  primary: "#7CCB02",
  primaryHover: "#8EDC1A",
  primarySoft: "#ADF185",
  teal: "#3DB8A6",
  warning: "#F5A623",
  danger: "#E5484D",
  terminal: "#0B1014",
} as const;

export const FONTS = {
  sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
} as const;
