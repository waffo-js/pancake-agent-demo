import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../constants";

type Props = {
  text: string;
  /** frame the caption starts fading in */
  start: number;
  /** frame the caption fades out */
  end: number;
};

export const Caption: React.FC<Props> = ({ text, start, end }) => {
  const frame = useCurrentFrame();
  // Fade in over 10 frames, fade out over 15
  const opacity = interpolate(
    frame,
    [start, start + 10, end - 15, end],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  const translateY = interpolate(
    frame,
    [start, start + 20],
    [8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) },
  );

  if (opacity < 0.001) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 48,
        transform: `translate(-50%, ${-translateY}px)`,
        opacity,
        padding: "14px 28px",
        borderRadius: 10,
        border: `1px solid ${COLORS.border}`,
        background: `${COLORS.bg}f0`,
        backdropFilter: "blur(12px)",
        boxShadow: "0 20px 40px -10px rgba(0,0,0,0.6)",
        fontFamily: FONTS.sans,
        fontSize: 15,
        fontWeight: 500,
        color: COLORS.text,
        maxWidth: 880,
        textAlign: "center",
        lineHeight: 1.5,
      }}
    >
      {text}
    </div>
  );
};
