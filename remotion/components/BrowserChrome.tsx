import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../constants";

type Props = {
  url: string;
  children: React.ReactNode;
  /** frame at which chrome fades in. Defaults to 0. */
  startFrame?: number;
};

// Browser chrome — traffic-light dots, URL bar, scrollable body below.
// Sits inside the 44px TopBar offset, so total usable height is HEIGHT - 44.
export const BrowserChrome: React.FC<Props> = ({ url, children, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [startFrame, startFrame + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 44,
        left: 24,
        right: 24,
        bottom: 24,
        borderRadius: 12,
        border: `1px solid ${COLORS.border}`,
        background: COLORS.bg,
        overflow: "hidden",
        opacity,
        boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7)",
      }}
    >
      {/* chrome bar */}
      <div
        style={{
          height: 38,
          borderBottom: `1px solid ${COLORS.border}`,
          background: COLORS.card,
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <Dot color="#E5484D" />
          <Dot color="#F5A623" />
          <Dot color="#3DB8A6" />
        </div>
        <div
          style={{
            flex: 1,
            height: 22,
            borderRadius: 6,
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            fontFamily: FONTS.mono,
            fontSize: 11,
            color: COLORS.textMuted,
          }}
        >
          <span style={{ color: COLORS.primary, marginRight: 6 }}>●</span>
          {url}
        </div>
      </div>
      {/* viewport */}
      <div style={{ position: "relative", height: "calc(100% - 38px)", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
};

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
);
