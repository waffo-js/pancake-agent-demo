import { AbsoluteFill, OffthreadVideo, Series, staticFile } from "remotion";
import {
  CHECKOUT_DURATION,
  COLORS,
  SITE_DURATION,
  SUMMARY_DURATION,
  V1_DURATION,
  V2_DURATION,
} from "../constants";
import { CheckoutScene } from "./CheckoutScene";

// PancakeDemo — the short product-tour reel, with non-checkout scenes
// stretched to 2× duration (playbackRate 0.5) for a calmer pace.
//
// Each non-checkout scene plays from its pre-rendered mp4 at public/videos/
// (see `npm run render:scene-*` scripts). The checkout stays as its native
// React composition — the user explicitly called out that scene should be
// left at its current 1.25× Playwright-capture pacing.
//
// Duration math: each non-checkout scene's Sequence holds 2× the source
// mp4's length, so playbackRate=0.5 plays the full source across the
// doubled Sequence window.

const SLOW_FACTOR = 0.5;
const slow = (d: number) => Math.round(d / SLOW_FACTOR);

export const PancakeDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Series>
        <Series.Sequence durationInFrames={slow(SITE_DURATION)}>
          <SlowScene src="videos/scene-site.mp4" />
        </Series.Sequence>
        <Series.Sequence durationInFrames={slow(V1_DURATION)}>
          <SlowScene src="videos/scene-v1.mp4" />
        </Series.Sequence>
        <Series.Sequence durationInFrames={slow(V2_DURATION)}>
          <SlowScene src="videos/scene-v2.mp4" />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CHECKOUT_DURATION}>
          <CheckoutScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={slow(SUMMARY_DURATION)}>
          <SlowScene src="videos/scene-summary.mp4" />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

const SlowScene: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill style={{ background: COLORS.bg }}>
    <OffthreadVideo
      src={staticFile(src)}
      playbackRate={SLOW_FACTOR}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </AbsoluteFill>
);
