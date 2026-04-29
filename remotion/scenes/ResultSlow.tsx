import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { COLORS } from "../constants";

// ResultSlow — plays `public/videos/scene-result.mp4` at 1/3 speed.
//
// The `result` composition renders the scene at its natural 22s pacing.
// `result-slow` stretches that to ~66s so the billing-stage boxes breathe.
// Kept as a separate composition so the fast cut stays available if we
// ever want to embed the crisp version elsewhere.
export const ResultSlow: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <OffthreadVideo
        src={staticFile("videos/scene-result.mp4")}
        playbackRate={1 / 3}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};
