import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { COLORS } from "../constants";
import { TopBar } from "../components/TopBar";
import { Caption } from "../components/Caption";
import { CHECKOUT_DURATION } from "../constants";

// Scene 04 — Live checkout.
//
// This scene used to be Remotion-drawn. It's now a thin wrapper around
// `public/videos/checkout.mp4` — a real Playwright capture of the Waffo
// Pancake hosted checkout flow (see scripts/record-checkout.mjs).
//
// The capture is ~27s of real browser time; playbackRate={1.25} paces it
// down to ~21s so it fits the reel without feeling rushed (the pricing-page
// scroll moment needs breathing room). Re-record any time with
// `npm run record:checkout` (dev server must be running).
export const CheckoutScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <TopBar
        title="Scene 04 · Live checkout"
        subtitle="real Waffo Pancake hosted checkout · js@waffo.com · card 4242 4242 4242 4242"
      />

      <div
        style={{
          position: "absolute",
          top: 44,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        <OffthreadVideo
          src={staticFile("videos/checkout.mp4")}
          playbackRate={1.25}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <Caption
        text="Real Waffo Pancake checkout — test mode, $99/mo subscription, card 4242 4242 4242 4242. 1.25× playback."
        start={20}
        end={CHECKOUT_DURATION - 20}
      />
    </AbsoluteFill>
  );
};
