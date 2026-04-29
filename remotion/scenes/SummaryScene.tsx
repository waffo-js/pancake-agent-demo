import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS, SUMMARY_DURATION } from "../constants";

// Scene 05 — Closing summary.
// Tagline, 3-card summary of the 3 beats that preceded it
// (onboard / migrate / every billing shape), and a wordmark.

type SummaryCard = {
  eyebrow: string;
  title: string;
  body: string;
};

const CARDS: SummaryCard[] = [
  {
    eyebrow: "Agent-native",
    title: "Onboard with one prompt",
    body: "Claude skill + llms-full.txt + @waffo/pancake-ts. Agents scaffold checkout, webhooks, and plans end-to-end.",
  },
  {
    eyebrow: "Zero-click migration",
    title: "Stripe → Pancake in one command",
    body: "Agents read your existing PSP, map products and webhooks, and verify parity in test mode before promoting.",
  },
  {
    eyebrow: "Every billing shape",
    title: "One-time · subscription · usage · result-based",
    body: "Four billing models on one merchant — including escrow-and-judge result contracts Stripe can't express.",
  },
];

export const SummaryScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in the whole scene over 20 frames.
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  // Fade out the tail 15 frames for a clean reel ending.
  const tailFade = interpolate(
    frame,
    [SUMMARY_DURATION - 15, SUMMARY_DURATION],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Tagline rises into place.
  const titleY = interpolate(frame, [0, 30], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: FONTS.sans,
        opacity: opacity * tailFade,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
      }}
    >
      {/* ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.primary}18, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          border: `1px solid ${COLORS.border}`,
          background: `${COLORS.card}CC`,
          borderRadius: 999,
          padding: "6px 14px",
          fontFamily: FONTS.mono,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: COLORS.textMuted,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.primary }} />
        Billing infrastructure for agents
      </div>

      <h1
        style={{
          margin: "24px 0 0",
          fontSize: 52,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          textAlign: "center",
          transform: `translateY(${titleY}px)`,
        }}
      >
        One SDK. One prompt.<br />
        <span style={{ color: COLORS.primarySoft }}>Every billing shape agents can sell.</span>
      </h1>

      <div
        style={{
          marginTop: 48,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 18,
          width: "100%",
          maxWidth: 1040,
        }}
      >
        {CARDS.map((c, i) => (
          <Card key={c.eyebrow} card={c} index={i} />
        ))}
      </div>

      <div
        style={{
          marginTop: 36,
          fontFamily: FONTS.mono,
          fontSize: 11,
          color: COLORS.textDim,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        docs.waffo.ai · @waffo/pancake-ts
      </div>
    </AbsoluteFill>
  );
};

const Card: React.FC<{ card: SummaryCard; index: number }> = ({ card, index }) => {
  const frame = useCurrentFrame();
  // Cards stagger in 8 frames apart, starting at frame 20.
  const start = 20 + index * 8;
  const cardOp = interpolate(frame, [start, start + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardY = interpolate(frame, [start, start + 18], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        background: COLORS.card,
        padding: "22px 22px 24px",
        opacity: cardOp,
        transform: `translateY(${cardY}px)`,
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: COLORS.primary,
        }}
      >
        {card.eyebrow}
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 17,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
        }}
      >
        {card.title}
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 12.5,
          lineHeight: 1.55,
          color: COLORS.textMuted,
        }}
      >
        {card.body}
      </div>
    </div>
  );
};
