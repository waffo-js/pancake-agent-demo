import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS, V1_DURATION } from "../constants";
import { TopBar } from "../components/TopBar";
import { Terminal, type Line } from "../components/Terminal";
import { Caption } from "../components/Caption";

// Scene 01 — Dev experience
//
// Weaves in the exact Waffo onboarding flow from docs.waffo.ai/quickstart:
// load llms-full.txt + the official skill, install @waffo/pancake-ts,
// scaffold checkout + webhook routes, run a test payment with 4576 7500 0000 0110.

const LINES: Line[] = [
  { t: "system",    content: "~/my-saas · main",                                                                 at: 20 },
  { t: "user",      content: "Read docs.waffo.ai/llms-full.txt, load the official skill, integrate Waffo Pancake", at: 40 },
  { t: "assistant", content: "Fetching Waffo's full LLM context…",                                               at: 140 },
  { t: "tool",      content: "WebFetch · docs.waffo.ai/llms-full.txt · 24,183 tokens",                           at: 160 },
  { t: "tool",      content: "Skill loaded · waffo-pancake-integrate · 14 recipes",                              at: 210 },
  { t: "assistant", content: "Installing the SDK…",                                                               at: 260 },
  { t: "tool",      content: "npm install @waffo/pancake-ts",                                                     at: 275 },
  { t: "success",   content: "added 1 package · 0 vulnerabilities",                                               at: 325 },
  { t: "assistant", content: "Wiring env + API keys (test mode first):",                                         at: 360 },
  { t: "code",      content: "# .env.local\nWAFFO_MERCHANT_ID=MER_5xQ2bK…\nWAFFO_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n…", at: 380 },
  { t: "assistant", content: "Scaffolding endpoints:",                                                            at: 450 },
  { t: "tool",      content: "write · app/api/checkout/route.ts",                                                 at: 470 },
  { t: "tool",      content: "write · app/api/webhook/route.ts · RSA-SHA256 verify",                              at: 495 },
  { t: "assistant", content: "Running a test charge (card 4576 7500 0000 0110) …",                                at: 540 },
  { t: "success",   content: "webhook → order.completed · $29.00 · PAY_8hCJpmQ2e…",                               at: 600 },
  { t: "assistant", content: "Integration complete. Switch keys to promote to prod.",                             at: 635 },
];

export const V1Scene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: COLORS.bg, color: COLORS.text }}>
      <TopBar title="Scene 02 · Agentic onboarding" subtitle="Claude Code wires plans & products via the Waffo skill" />

      <div style={{ position: "absolute", top: 44, left: 0, right: 0, bottom: 0, display: "flex" }}>
        {/* Left: terminal */}
        <div style={{ flex: 1.2, borderRight: `1px solid ${COLORS.border}` }}>
          <Terminal path="~/my-saas" lines={LINES} cps={3.4} />
        </div>

        {/* Right: stage-based visuals */}
        <div style={{ flex: 1 }}>
          <RightPane frame={frame} />
        </div>
      </div>

      <Caption
        text="One prompt. The agent reads the Waffo docs, loads the official skill, installs @waffo/pancake-ts, writes your routes — and ends on a verified test payment."
        start={80}
        end={V1_DURATION - 30}
      />
    </AbsoluteFill>
  );
};

// Right pane progresses through 3 phases
// phase 1 (0-220):  Waffo docs
// phase 2 (220-480): file tree + .env
// phase 3 (480+):   test transaction + webhook success
const RightPane: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < 220) return <DocsPanel frame={frame} />;
  if (frame < 480) return <FilesPanel frame={frame - 220} />;
  return <TxPanel frame={frame - 480} />;
};

const DocsPanel: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [0, 20, 200, 220], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div style={{ height: "100%", padding: 32, opacity, fontFamily: FONTS.sans }}>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 11,
          color: COLORS.textDim,
          borderBottom: `1px solid ${COLORS.borderSoft}`,
          paddingBottom: 10,
          marginBottom: 20,
        }}
      >
        docs.waffo.ai / llms-full.txt
      </div>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 12,
          lineHeight: 1.7,
          color: COLORS.textMuted,
        }}
      >
        <p style={{ color: COLORS.primarySoft, marginBottom: 16 }}># Waffo Pancake — for LLM integrators</p>
        <p style={{ marginBottom: 12 }}>
          ## Authenticating
        </p>
        <p style={{ marginBottom: 4 }}>
          Set <span style={{ color: COLORS.primary }}>WAFFO_MERCHANT_ID</span> and <span style={{ color: COLORS.primary }}>WAFFO_PRIVATE_KEY</span> from
        </p>
        <p style={{ marginBottom: 16 }}>
          Dashboard → Merchant → Integration → API Keys.
        </p>
        <p style={{ marginBottom: 12 }}>## Installing</p>
        <p style={{ color: COLORS.text, marginBottom: 16 }}>
          <span style={{ color: COLORS.textDim }}>$ </span>npm install @waffo/pancake-ts
        </p>
        <p style={{ marginBottom: 12 }}>## Checkout template URL</p>
        <p style={{ marginBottom: 16, color: COLORS.text }}>
          https://checkout.waffo.ai/{"{store-slug}"}/{"{product-slug}"}
        </p>
        <p style={{ marginBottom: 12 }}>## Test cards</p>
        <p style={{ color: COLORS.text }}>4576 7500 0000 0110 · approves</p>
      </div>
    </div>
  );
};

const FilesPanel: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [0, 20, 240, 260], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Files appear one by one
  const files = [
    { path: ".env.local",              hi: true,  appearsAt: 30 },
    { path: "app/api/checkout/route.ts",  hi: true,  appearsAt: 90 },
    { path: "app/api/webhook/route.ts",   hi: true,  appearsAt: 140 },
    { path: "app/checkout/page.tsx",      hi: false, appearsAt: 175 },
    { path: "lib/pancake.ts",             hi: false, appearsAt: 205 },
  ];

  return (
    <div
      style={{
        height: "100%",
        padding: 32,
        opacity,
        fontFamily: FONTS.mono,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div style={{ fontSize: 11, color: COLORS.textDim }}>Project files — agent edits</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {files.map((f) => (
          <FileRow key={f.path} frame={frame} {...f} />
        ))}
      </div>

      <div
        style={{
          marginTop: "auto",
          padding: 16,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          background: `${COLORS.card}80`,
          fontSize: 11,
          color: COLORS.textMuted,
          opacity: frame > 170 ? 1 : 0,
        }}
      >
        <div style={{ color: COLORS.primary, marginBottom: 6 }}>env · test mode</div>
        <div>WAFFO_MERCHANT_ID=<span style={{ color: COLORS.text }}>MER_5xQ2bK8vH4jPnRmZ2</span></div>
        <div>WAFFO_PRIVATE_KEY=<span style={{ color: COLORS.textDim }}>•••• •••• •••• •••• ••••</span></div>
      </div>
    </div>
  );
};

const FileRow: React.FC<{ path: string; hi: boolean; appearsAt: number; frame: number }> = ({
  path,
  hi,
  appearsAt,
  frame,
}) => {
  if (frame < appearsAt) return null;
  const elapsed = frame - appearsAt;
  const opacity = interpolate(elapsed, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const tx = interpolate(elapsed, [0, 18], [10, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${tx}px)`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontSize: 13,
        padding: "6px 12px",
        borderRadius: 4,
        border: `1px solid ${hi ? COLORS.primary : COLORS.border}`,
        background: hi ? `${COLORS.primary}15` : `${COLORS.card}60`,
        color: hi ? COLORS.primary : COLORS.textMuted,
      }}
    >
      <span style={{ fontSize: 10, letterSpacing: "0.1em" }}>
        {hi ? "NEW" : "ADD"}
      </span>
      <span style={{ color: COLORS.text, opacity: hi ? 1 : 0.8 }}>{path}</span>
    </div>
  );
};

const TxPanel: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const checkoutVisible = frame > 30;
  const webhookVisible = frame > 100;

  return (
    <div
      style={{
        height: "100%",
        padding: 32,
        opacity,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        fontFamily: FONTS.sans,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 11,
          color: COLORS.textDim,
          borderBottom: `1px solid ${COLORS.borderSoft}`,
          paddingBottom: 10,
        }}
      >
        checkout.waffo.ai / my-saas / pro
      </div>

      {checkoutVisible && <CheckoutCard />}
      {webhookVisible && <WebhookCard />}
    </div>
  );
};

const CheckoutCard: React.FC = () => {
  const frame = useCurrentFrame() - 510;
  const scale = interpolate(frame, [0, 20], [0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        padding: 20,
        background: COLORS.card,
      }}
    >
      <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 4 }}>Pay with card · test mode</div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 15, color: COLORS.text, letterSpacing: 2 }}>
        4576 7500 0000 0110
      </div>
      <div
        style={{
          marginTop: 14,
          padding: "10px 16px",
          background: COLORS.primary,
          borderRadius: 6,
          textAlign: "center",
          color: "black",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        Pay $29.00
      </div>
    </div>
  );
};

const WebhookCard: React.FC = () => {
  const frame = useCurrentFrame() - 580;
  const scale = interpolate(frame, [0, 15], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        transformOrigin: "top center",
        border: `1px solid ${COLORS.primary}`,
        borderRadius: 10,
        padding: 16,
        background: `${COLORS.primary}10`,
        fontFamily: FONTS.mono,
        fontSize: 12,
      }}
    >
      <div style={{ color: COLORS.primary, fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 }}>
        WEBHOOK · POST /api/webhook
      </div>
      <div style={{ color: COLORS.text, lineHeight: 1.7 }}>
        <div><span style={{ color: COLORS.textMuted }}>event:</span> order.completed</div>
        <div><span style={{ color: COLORS.textMuted }}>paymentId:</span> PAY_8hCJpmQ2e…</div>
        <div><span style={{ color: COLORS.textMuted }}>amount:</span> "29.00" USD</div>
        <div><span style={{ color: COLORS.textMuted }}>signature:</span> verified ✓</div>
      </div>
    </div>
  );
};
