import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS, RESULT_DURATION } from "../constants";
import { TopBar } from "../components/TopBar";
import { Caption } from "../components/Caption";

// Scene 05 — Result-based billing.
//
// Three-column lifecycle. Each agent carries its own stack of action boxes
// that animate pending → active → done in lockstep with the story:
//
//   Buyer (Ava)          Pancake                    Seller (AgentBakery)
//   1. post request      3. escrow $10 USDC          2. offer quote
//   4. accept quote      5. run judge                6. deliver payload
//                        7. settle
//
// A top banner tracks the active step verbally. A bottom unit-economics
// slab decomposes Pancake's $0.50 per-transaction take ($10 × 5% flat) into
// $0.10 rail + $0.05 judge + $0.35 gross profit (= 70% GM).
//
// Tune the milestone frames in `T` — banner, boxes, and the econ bar all
// key off the same source of truth.

type StepKey =
  | "buyerPost"
  | "sellerQuote"
  | "buyerAccept"
  | "pancakeEscrow"
  | "sellerDeliver"
  | "pancakeJudge"
  | "pancakeSettle";

type Milestone = { activateAt: number; doneAt: number };

// Each step's active window is kept at its original length (animation
// pacing untouched); a 60-frame (~2s) beat is inserted between steps so
// viewers have room to absorb each stage before the next lights up.
const T: Record<StepKey, Milestone> = {
  buyerPost:      { activateAt: 35,  doneAt: 115 },
  sellerQuote:    { activateAt: 175, doneAt: 250 },
  buyerAccept:    { activateAt: 310, doneAt: 380 },
  pancakeEscrow:  { activateAt: 440, doneAt: 535 },
  sellerDeliver:  { activateAt: 595, doneAt: 670 },
  pancakeJudge:   { activateAt: 730, doneAt: 810 },
  pancakeSettle:  { activateAt: 870, doneAt: 940 },
};

// Step banner labels — one entry per step, shown during [activateAt, doneAt+5].
const STEP_LABELS: { key: StepKey; title: string; role: "buyer" | "pancake" | "seller" }[] = [
  { key: "buyerPost",     title: "Buyer posts request",     role: "buyer" },
  { key: "sellerQuote",   title: "Seller quotes $10",       role: "seller" },
  { key: "buyerAccept",   title: "Buyer accepts",           role: "buyer" },
  { key: "pancakeEscrow", title: "Pancake escrows $10",     role: "pancake" },
  { key: "sellerDeliver", title: "Seller delivers",         role: "seller" },
  { key: "pancakeJudge",  title: "Judge: PASS",             role: "pancake" },
  { key: "pancakeSettle", title: "Settled",                 role: "pancake" },
];

export const ResultScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg, color: COLORS.text }}>
      <TopBar
        title="Scene 05 · Result-based billing"
        subtitle="buyer ↔ Pancake ↔ seller · escrow, judge, settle"
      />

      <div
        style={{
          position: "absolute",
          top: 44,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <StepBanner />

        <div style={{ flex: "0 0 auto", display: "flex", borderBottom: `1px solid ${COLORS.border}` }}>
          <BuyerColumn />
          <PancakeColumn />
          <SellerColumn />
        </div>

        <UnitEconPanel />
      </div>

      <Caption
        text="$10 task · 5% fee → $0.50 Pancake revenue · 70% gross margin"
        start={120}
        end={RESULT_DURATION - 30}
      />
    </AbsoluteFill>
  );
};

// ─────────────── Step banner (top strip)

const StepBanner: React.FC = () => {
  const frame = useCurrentFrame();

  // Find the current step (highest key whose activateAt <= frame).
  const current = STEP_LABELS.filter((s) => frame >= T[s.key].activateAt).slice(-1)[0];
  const introOp = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });

  const totalSteps = STEP_LABELS.length;
  const currentIndex = current ? STEP_LABELS.indexOf(current) + 1 : 0;

  const roleColor = current?.role === "buyer"
    ? COLORS.teal
    : current?.role === "seller"
    ? COLORS.warning
    : COLORS.primary;

  return (
    <div
      style={{
        flex: "0 0 auto",
        padding: "16px 30px",
        borderBottom: `1px solid ${COLORS.border}`,
        background: `${COLORS.card}60`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        opacity: introOp,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {/* dots */}
        <div style={{ display: "flex", gap: 6 }}>
          {STEP_LABELS.map((s, i) => {
            const done = frame >= T[s.key].doneAt;
            const active = !done && frame >= T[s.key].activateAt;
            const color = done || active
              ? (s.role === "buyer" ? COLORS.teal : s.role === "seller" ? COLORS.warning : COLORS.primary)
              : COLORS.border;
            return (
              <span
                key={s.key}
                style={{
                  width: active ? 10 : 8,
                  height: active ? 10 : 8,
                  borderRadius: "50%",
                  background: color,
                  boxShadow: active ? `0 0 8px ${color}` : "none",
                  opacity: done ? 0.7 : 1,
                  transition: "none",
                }}
              />
            );
          })}
        </div>

        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 12,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: COLORS.textDim,
          }}
        >
          Step {currentIndex} / {totalSteps}
        </div>

        <div style={{ fontSize: 17, fontWeight: 600, color: roleColor }}>
          {current?.title ?? "Starting…"}
        </div>
      </div>

      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 12,
          color: COLORS.textMuted,
          textAlign: "right",
        }}
      >
        rcc_K7mVjHxN · test-env
      </div>
    </div>
  );
};

// ─────────────── Columns

const ColumnShell: React.FC<{
  initial: string;
  name: string;
  subtitle: string;
  tint: string;
  square?: boolean;
  flex?: number;
  border?: boolean;
  children: React.ReactNode;
}> = ({ initial, name, subtitle, tint, square, flex = 1, border, children }) => (
  <div
    style={{
      flex,
      height: 508,
      padding: "24px 26px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      fontFamily: FONTS.sans,
      borderRight: border ? `1px solid ${COLORS.border}` : undefined,
      background: flex > 1 ? `${COLORS.card}30` : undefined,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: square ? 7 : "50%",
          background: tint,
          color: "#061014",
          fontWeight: 700,
          fontSize: 21,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {initial}
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>{name}</div>
        <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>{subtitle}</div>
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
  </div>
);

const BuyerColumn: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <ColumnShell initial="A" name="Ava" subtitle="buyer agent · Research Copilot" tint={COLORS.teal} border>
      <StepBox
        stepKey="buyerPost"
        number="01"
        title="Posts result request"
        tint={COLORS.teal}
        frame={frame}
        details={[
          "EV market report · 500 words",
          <><b style={{ color: COLORS.primary }}>$10 budget</b> · sonnet-4-6 judge</>,
        ]}
      />
      <StepBox
        stepKey="buyerAccept"
        number="04"
        title="Accepts quote"
        tint={COLORS.teal}
        frame={frame}
        details={[
          "contract rcc_K7mVjHxN",
          <span style={{ color: COLORS.textDim }}>
            verdict · <b style={{ color: COLORS.primary }}>PASS</b>
          </span>,
        ]}
        revealExtraAt={T.pancakeJudge.doneAt}
      />
    </ColumnShell>
  );
};

const PancakeColumn: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <ColumnShell
      initial="P"
      name="Pancake"
      subtitle="escrow · payment facilitator · judge"
      tint={COLORS.primary}
      square
      flex={1.25}
      border
    >
      <StepBox
        stepKey="pancakeEscrow"
        number="03"
        title="Escrows $10 USDC"
        tint={COLORS.primary}
        frame={frame}
        details={[
          "$10 USDC · Base Sepolia",
          "rubric locked on-chain",
        ]}
      />
      <StepBox
        stepKey="pancakeJudge"
        number="06"
        title="Runs judge"
        tint={COLORS.primary}
        frame={frame}
        details={[
          <>
            score <b style={{ color: COLORS.primary, fontFamily: FONTS.mono }}>0.92</b> ≥ 0.75 ·{" "}
            <b style={{ color: COLORS.primary }}>PASS</b>
          </>,
        ]}
      />
      <StepBox
        stepKey="pancakeSettle"
        number="07"
        title="Settles contract"
        tint={COLORS.primary}
        frame={frame}
        details={[
          <><b style={{ color: COLORS.text, fontFamily: FONTS.mono }}>$9.50</b>{" "}→ seller</>,
          <><b style={{ color: COLORS.primary, fontFamily: FONTS.mono }}>$0.50</b>{" "}fee → Pancake <span style={{ color: COLORS.textDim }}>(5%)</span></>,
        ]}
      />
    </ColumnShell>
  );
};

const SellerColumn: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <ColumnShell initial="AB" name="AgentBakery" subtitle="seller agent · Deep Research" tint={COLORS.warning}>
      <StepBox
        stepKey="sellerQuote"
        number="02"
        title="Offers quote"
        tint={COLORS.warning}
        frame={frame}
        details={[
          <><b style={{ fontFamily: FONTS.mono }}>$10.00</b> · ETA ~40s</>,
          "quote rcq_5xQ2bKvM",
        ]}
      />
      <StepBox
        stepKey="sellerDeliver"
        number="05"
        title="Delivers payload"
        tint={COLORS.warning}
        frame={frame}
        details={[
          "RSA-signed · → Pancake judge",
        ]}
      />
    </ColumnShell>
  );
};

// ─────────────── Step box

const StepBox: React.FC<{
  stepKey: StepKey;
  number: string;
  title: string;
  details: React.ReactNode[];
  tint: string;
  frame: number;
  revealExtraAt?: number;
}> = ({ stepKey, number, title, details, tint, frame, revealExtraAt }) => {
  const { activateAt, doneAt } = T[stepKey];
  const pending = frame < activateAt;
  const active = frame >= activateAt && frame < doneAt;
  const done = frame >= doneAt;

  // Entry fade — box becomes visible briefly before its activation frame
  // so the column isn't full of ghostly invisible placeholders.
  const boxOp = interpolate(frame, [activateAt - 40, activateAt - 10], [0.25, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Active pulse on the indicator dot.
  const pulse = active
    ? 0.7 + 0.3 * Math.abs(Math.sin(((frame - activateAt) % 45) / 45 * Math.PI))
    : 1;

  const borderColor = done ? `${tint}99` : active ? tint : `${COLORS.border}`;
  const background = done ? `${tint}12` : active ? `${tint}1C` : COLORS.card;

  // Certain detail lines only reveal at a later milestone (e.g. verdict
  // showing up on the "accepts quote" box only *after* the judge returns).
  const extraReveal = revealExtraAt != null
    ? interpolate(frame, [revealExtraAt, revealExtraAt + 15], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <div
      style={{
        opacity: boxOp,
        padding: "14px 16px",
        borderRadius: 10,
        border: `1px solid ${borderColor}`,
        background,
        transition: "none",
        boxShadow: active ? `0 0 28px ${tint}55` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: done ? tint : active ? `${tint}33` : `${COLORS.card}`,
            border: `1px solid ${done ? tint : active ? tint : COLORS.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: done ? "#061014" : active ? tint : COLORS.textDim,
            fontSize: 12,
            fontWeight: 700,
            fontFamily: FONTS.mono,
            opacity: pulse,
            boxShadow: active ? `0 0 14px ${tint}99` : "none",
          }}
        >
          {done ? "✓" : number}
        </span>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: pending ? COLORS.textMuted : COLORS.text,
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          fontSize: 14,
          lineHeight: 1.5,
          color: pending ? COLORS.textDim : COLORS.textMuted,
        }}
      >
        {details.map((d, i) => {
          const isExtra = revealExtraAt != null && i === details.length - 1;
          return (
            <div key={i} style={isExtra ? { opacity: extraReveal } : undefined}>
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────── Unit economics panel (bottom slab)

const UnitEconPanel: React.FC = () => {
  const frame = useCurrentFrame();

  const panelOp = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const feeReveal = interpolate(
    frame,
    [T.pancakeEscrow.activateAt, T.pancakeEscrow.activateAt + 30],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const railFill = interpolate(
    frame,
    [T.pancakeEscrow.activateAt + 20, T.pancakeEscrow.activateAt + 50],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );
  const judgeFill = interpolate(
    frame,
    [T.pancakeJudge.activateAt, T.pancakeJudge.activateAt + 30],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );
  const profitFill = interpolate(
    frame,
    [T.pancakeSettle.activateAt, T.pancakeSettle.activateAt + 30],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  return (
    <div
      style={{
        flex: 1,
        padding: "20px 32px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontFamily: FONTS.sans,
        opacity: panelOp,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: COLORS.textDim,
            }}
          >
            Pancake · unit economics
          </div>
          <div style={{ marginTop: 6, fontSize: 18, color: COLORS.text }}>
            <span style={{ fontFamily: FONTS.mono }}>$10.00</span>{" "}
            <span style={{ color: COLORS.textMuted }}>×</span>{" "}
            <span style={{ color: COLORS.primary, fontWeight: 600 }}>5% flat</span>{" "}
            <span style={{ color: COLORS.textMuted }}>→</span>{" "}
            <span
              style={{
                fontFamily: FONTS.mono,
                color: COLORS.primary,
                fontWeight: 600,
                opacity: feeReveal,
              }}
            >
              $0.50
            </span>{" "}
            <span style={{ fontSize: 14, color: COLORS.textMuted }}>Pancake revenue per txn</span>
          </div>
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 14,
            color: COLORS.textMuted,
            textAlign: "right",
          }}
        >
          gross margin ·{" "}
          <span style={{ color: profitFill > 0.5 ? COLORS.primary : COLORS.textDim, fontWeight: 600 }}>
            70%
          </span>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          height: 42,
          borderRadius: 8,
          border: `1px solid ${COLORS.border}`,
          background: COLORS.card,
          overflow: "hidden",
          display: "flex",
          opacity: feeReveal,
        }}
      >
        <EconSegment flex={2} label="$0.10" sub="rail · USDC" color={COLORS.teal} fill={railFill} />
        <EconSegment flex={1} label="$0.05" sub="judge" color={COLORS.warning} fill={judgeFill} />
        <EconSegment flex={7} label="$0.35" sub="gross profit" color={COLORS.primary} fill={profitFill} emphasize />
      </div>
    </div>
  );
};

const EconSegment: React.FC<{
  flex: number;
  label: string;
  sub: string;
  color: string;
  fill: number;
  emphasize?: boolean;
}> = ({ flex, label, sub, color, fill, emphasize }) => (
  <div
    style={{
      flex,
      position: "relative",
      borderRight: `1px solid ${COLORS.bg}`,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      padding: "0 12px",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: `${fill * 100}%`,
        background: emphasize ? `linear-gradient(90deg, ${color}CC, ${color})` : `${color}CC`,
      }}
    />
    <div
      style={{
        position: "relative",
        color: fill > 0.3 ? "#061014" : COLORS.textMuted,
        fontSize: 14,
        fontWeight: 700,
        fontFamily: FONTS.mono,
        lineHeight: 1.1,
      }}
    >
      {label}
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          opacity: 0.8,
          marginTop: 2,
        }}
      >
        {sub}
      </div>
    </div>
  </div>
);
