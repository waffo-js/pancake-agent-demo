import { Config } from "@remotion/cli/config";

// 30fps · 1280×800 · H.264 at solid quality for landing-page embeds
Config.setConcurrency(4);
Config.setVideoImageFormat("jpeg"); // faster per-frame render than PNG; output is still H.264
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");   // max browser compatibility for <video> tag
Config.setCrf(20);                  // constant rate factor — 18 near-lossless, 23 default
Config.setOverwriteOutput(true);
