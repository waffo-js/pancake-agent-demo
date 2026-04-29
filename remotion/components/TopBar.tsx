import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../constants";

type Props = {
  title: string;
  subtitle?: string;
};

export const TopBar: React.FC<Props> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: `1px solid ${COLORS.border}`,
        fontFamily: FONTS.mono,
        fontSize: 11,
        color: COLORS.textMuted,
        opacity,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Dot />
        <span style={{ textTransform: "uppercase", letterSpacing: "0.2em" }}>{title}</span>
        {subtitle && (
          <span style={{ color: COLORS.textDim }}>· {subtitle}</span>
        )}
      </div>
      <div style={{ color: COLORS.textDim, fontSize: 10 }}>pancake demo</div>
    </div>
  );
};

const Dot: React.FC = () => {
  const frame = useCurrentFrame();
  // Slow pulse: 0.6 → 1 → 0.6 over 60 frames
  const t = (frame % 60) / 60;
  const brightness = 0.6 + 0.4 * Math.abs(Math.sin(t * Math.PI));
  return (
    <div
      style={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: COLORS.primary,
        opacity: brightness,
      }}
    />
  );
};
