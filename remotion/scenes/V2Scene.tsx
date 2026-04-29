import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS, V2_DURATION } from "../constants";
import { TopBar } from "../components/TopBar";
import { Terminal, type Line } from "../components/Terminal";
import { Caption } from "../components/Caption";

// Scene 03 — Agentic integration & migration.
// Same Waffo skill + SDK surface, but a different job: migrate off Stripe.
// AgentBakery's live Stripe catalog = 2 products (one-time + subscription).
// Pancake additionally unlocks result-based and usage-based — so the agent
// recreates the 2 Stripe products 1:1, then adds the 2 Pancake-only shapes
// for a 4-product catalog that matches the pricing page shown in Scene 01.

const LINES: Line[] = [
  { t: "system",    content: "~/agentbakery · main",                                                                at: 20 },
  { t: "user",      content: "Migrate my Stripe catalog to Pancake. Keep pricing identical. Test mode first.",      at: 40 },
  { t: "assistant", content: "Reading your Stripe workspace…",                                                       at: 180 },
  { t: "tool",      content: "stripe.list_products · 2 products · 2 prices · 1 webhook",                             at: 205 },
  { t: "assistant", content: "Loading Waffo migration skill…",                                                       at: 250 },
  { t: "tool",      content: "Skill loaded · waffo-pancake-migrate · stripe adapter",                                at: 275 },
  { t: "assistant", content: "Mapping Stripe schema → Pancake (prices kept identical):",                             at: 315 },
  { t: "tool",      content: "pancake.create_product · Competitor snapshot · $29 · one-time",                        at: 345 },
  { t: "tool",      content: "pancake.create_product · Weekly intel brief · $99/mo · subscription",                  at: 375 },
  { t: "tool",      content: "pancake.create_webhook × 1 · RSA-SHA256 signing",                                      at: 405 },
  { t: "assistant", content: "Pancake also unlocks two shapes Stripe doesn't support — adding them:",                at: 435 },
  { t: "tool",      content: "pancake.create_product · Bespoke deep-dive · $200 on-pass · result-based",             at: 465 },
  { t: "tool",      content: "pancake.create_product · Research API · $0.001/tok · usage-based (roadmap)",           at: 490 },
  { t: "assistant", content: "Running parity check: test charge + webhook roundtrip.",                               at: 520 },
  { t: "success",   content: "4/4 products · 4/4 prices · 1/1 webhook delivering",                                   at: 560 },
  { t: "assistant", content: "Parity verified. Promote to prod whenever you're ready.",                              at: 585 },
];

export const V2Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg, color: COLORS.text }}>
      <TopBar title="Scene 03 · Agentic migration" subtitle="Stripe → Pancake in one prompt" />

      <div style={{ position: "absolute", top: 44, left: 0, right: 0, bottom: 0, display: "flex" }}>
        <div style={{ flex: 1.2, borderRight: `1px solid ${COLORS.border}` }}>
          <Terminal path="~/my-saas" lines={LINES} cps={3.4} />
        </div>
        <div style={{ flex: 1 }}>
          <ParityPanel />
        </div>
      </div>

      <Caption
        text="Merchants don't click through wizards anymore. They tell an agent what they want, and the agent migrates catalog, prices, and webhooks — then proves parity with a test charge."
        start={80}
        end={V2_DURATION - 30}
      />
    </AbsoluteFill>
  );
};

// Stripe side lists what existed on Stripe; Pancake side lists what's live
// after migration (2 carried over + 2 Pancake-only shapes).
const ROWS = [
  { label: "Products",    stripe: 2, pancake: 4, readyAt: 500 },
  { label: "Prices",      stripe: 2, pancake: 4, readyAt: 500 },
  { label: "Webhooks",    stripe: 1, pancake: 1, readyAt: 420 },
  { label: "Test charge", stripe: 0, pancake: 1, readyAt: 560 },
];

const ParityPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const panelOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const progress = interpolate(
    frame,
    [0, 200, 345, 490, 560],
    [0.05, 0.25, 0.55, 0.85, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  const statusText =
    frame < 200 ? "Reading Stripe catalog…"
    : frame < 345 ? "Mapping schema…"
    : frame < 435 ? "Creating in Pancake…"
    : frame < 490 ? "Adding Pancake-only shapes…"
    : frame < 560 ? "Running parity check…"
    : "Verified — ready to promote";

  return (
    <div
      style={{
        height: "100%",
        padding: 32,
        opacity: panelOpacity,
        fontFamily: FONTS.sans,
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textDim, letterSpacing: "0.2em" }}>
        PARITY REPORT
      </div>

      {/* Rows */}
      <div
        style={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr auto 1fr auto",
            gap: 8,
            padding: "10px 16px",
            background: `${COLORS.card}80`,
            fontFamily: FONTS.mono,
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: COLORS.textMuted,
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <span></span>
          <span>Stripe</span>
          <span></span>
          <span>Pancake</span>
          <span></span>
        </div>
        {ROWS.map((r, i) => (
          <Row key={r.label} frame={frame} index={i} {...r} />
        ))}
      </div>

      {/* Progress card */}
      <div
        style={{
          marginTop: "auto",
          padding: 18,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 10,
          background: `${COLORS.card}80`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: COLORS.textMuted }}>Current environment</span>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: COLORS.warning,
              background: `${COLORS.warning}20`,
              padding: "2px 8px",
              borderRadius: 999,
            }}
          >
            test
          </span>
        </div>
        <div
          style={{
            height: 6,
            background: COLORS.border,
            borderRadius: 999,
            overflow: "hidden",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              background: COLORS.primary,
            }}
          />
        </div>
        <div style={{ fontSize: 12, color: COLORS.textMuted }}>{statusText}</div>
      </div>
    </div>
  );
};

const Row: React.FC<{
  label: string;
  stripe: number;
  pancake: number;
  readyAt: number;
  frame: number;
  index: number;
}> = ({ label, stripe, pancake, readyAt, frame, index }) => {
  const ready = frame >= readyAt;
  const pulseFrame = Math.max(0, frame - readyAt);
  const readyOpacity = interpolate(pulseFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // When Pancake exceeds Stripe (e.g. Pancake-only billing shapes), tint
  // the rhs count in primary green once settled so the viewer catches the
  // net-new capability at a glance.
  const netNew = pancake > stripe;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr auto 1fr auto",
        gap: 8,
        alignItems: "center",
        padding: "14px 16px",
        borderTop: index === 0 ? "none" : `1px solid ${COLORS.border}30`,
      }}
    >
      <span style={{ fontSize: 13 }}>{label}</span>
      <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.textMuted }}>{stripe}</span>
      <span style={{ color: COLORS.textDim }}>→</span>
      <span
        style={{
          fontFamily: FONTS.mono,
          fontSize: 13,
          color: ready ? (netNew ? COLORS.primary : COLORS.text) : COLORS.textDim,
        }}
      >
        {ready ? pancake : "…"}
      </span>
      <span
        style={{
          color: ready ? COLORS.primary : COLORS.textDim,
          opacity: ready ? readyOpacity : 1,
        }}
      >
        {ready ? "✓" : "…"}
      </span>
    </div>
  );
};
