import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS, SITE_DURATION } from "../constants";
import { TopBar } from "../components/TopBar";
import { BrowserChrome } from "../components/BrowserChrome";
import { Caption } from "../components/Caption";

// Scene 01 — Site walkthrough.
// Scrolls the AgentBakery / Pancake-demo pricing page top→bottom so the viewer
// sees the 4 billing shapes that the later scenes will onboard, migrate,
// and check out against.

type ProductCard = {
  badge: string;
  name: string;
  price: string;
  priceSuffix?: string;
  desc: string;
  status: "live" | "roadmap" | "new";
  cta: string;
  ctaFilled: boolean;
  highlight?: boolean;
};

const CARDS: ProductCard[] = [
  {
    badge: "one-time",
    name: "Competitor snapshot",
    price: "$29",
    desc: "5-page snapshot of a single competitor. Delivered in under 10 minutes.",
    status: "live",
    cta: "Buy",
    ctaFilled: true,
  },
  {
    badge: "subscription",
    name: "Weekly intel brief",
    price: "$99",
    priceSuffix: "/mo",
    desc: "Every Monday, a curated competitive brief. Cancel anytime.",
    status: "live",
    cta: "Subscribe",
    ctaFilled: true,
  },
  {
    badge: "usage-based",
    name: "Research API access",
    price: "$0.001",
    priceSuffix: "/token",
    desc: "Metered research endpoints. Bills per token processed.",
    status: "roadmap",
    cta: "Request access",
    ctaFilled: false,
  },
  {
    badge: "result-based",
    name: "Bespoke deep-dive",
    price: "$200",
    priceSuffix: "on pass",
    desc: "Custom research to your rubric. Escrow held; paid only on rubric pass.",
    status: "new",
    cta: "Run live demo →",
    ctaFilled: true,
    highlight: true,
  },
];

export const SiteScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Scroll: hold 0 → scroll down smoothly → hold at bottom.
  // With a 2×2 card grid the page body is ~940px; viewport ~694px → shift -280.
  const scrollY = interpolate(
    frame,
    [30, 75, 260, 320],
    [0, 0, -280, -280],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.45, 0, 0.55, 1),
    },
  );

  return (
    <AbsoluteFill style={{ background: COLORS.bg, color: COLORS.text }}>
      <TopBar title="Scene 01 · Site walkthrough" subtitle="AgentBakery — four billing shapes on one merchant" />

      <BrowserChrome url="pancake-demo.vercel.app/pricing">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${scrollY}px)`,
            willChange: "transform",
          }}
        >
          <PageHeader />
          <PageHero />
          <PageCardsGrid />
        </div>
      </BrowserChrome>

      <Caption
        text="AgentBakery — a real SaaS demo. Four billing shapes on one merchant: one-time, subscription, usage-based, and result-based."
        start={40}
        end={SITE_DURATION - 30}
      />
    </AbsoluteFill>
  );
};

const PageHeader: React.FC = () => (
  <div
    style={{
      borderBottom: `1px solid ${COLORS.border}`,
      padding: "14px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontFamily: FONTS.sans,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 4,
          background: COLORS.primary,
          color: "#000",
          fontWeight: 700,
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        P
      </div>
      <span style={{ fontWeight: 600, fontSize: 14 }}>Pancake</span>
      <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textDim }}>/ pricing demo</span>
    </div>
    <div style={{ display: "flex", gap: 22, fontSize: 12, color: COLORS.textMuted }}>
      <span>Demo reel</span>
      <span>AgentBakery site</span>
    </div>
  </div>
);

const PageHero: React.FC = () => (
  <div style={{ padding: "48px 40px 24px", fontFamily: FONTS.sans }}>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        border: `1px solid ${COLORS.border}`,
        background: `${COLORS.card}99`,
        borderRadius: 999,
        padding: "4px 12px",
        fontFamily: FONTS.mono,
        fontSize: 10,
        color: COLORS.textMuted,
      }}
    >
      <span
        style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.primary }}
      />
      Live demo · four billing models
    </div>
    <div
      style={{
        marginTop: 18,
        fontSize: 36,
        fontWeight: 600,
        letterSpacing: "-0.02em",
        lineHeight: 1.1,
      }}
    >
      Every billing shape an agent needs,{" "}
      <span style={{ color: COLORS.primarySoft }}>on one merchant</span>.
    </div>
    <div
      style={{
        marginTop: 14,
        maxWidth: 720,
        fontSize: 14,
        lineHeight: 1.55,
        color: COLORS.textMuted,
      }}
    >
      Each card below is a real transaction you can try. One-time and subscription hit{" "}
      <span style={{ color: COLORS.text }}>Waffo Pancake Checkout</span> in test mode. Result-based hits the{" "}
      <span style={{ color: COLORS.text }}>Pancake mock API</span> and runs the full escrow-and-judge lifecycle in your browser.
    </div>
  </div>
);

const PageCardsGrid: React.FC = () => (
  <div
    style={{
      padding: "24px 40px 60px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 20,
      fontFamily: FONTS.sans,
    }}
  >
    {CARDS.map((c) => (
      <CardView key={c.name} card={c} />
    ))}
  </div>
);

const CardView: React.FC<{ card: ProductCard }> = ({ card }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      borderRadius: 12,
      border: `1px solid ${card.highlight ? COLORS.primary : COLORS.border}`,
      background: card.highlight ? `${COLORS.primary}0D` : COLORS.card,
      padding: 18,
      minHeight: 260,
      boxShadow: card.highlight ? `0 0 28px ${COLORS.primary}33` : "none",
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span
        style={{
          fontFamily: FONTS.mono,
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: COLORS.textMuted,
        }}
      >
        {card.badge}
      </span>
      <StatusChip status={card.status} />
    </div>

    <div style={{ marginTop: 16 }}>
      <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.01em" }}>{card.name}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginTop: 4 }}>
        <span style={{ fontFamily: FONTS.mono, fontSize: 22 }}>{card.price}</span>
        {card.priceSuffix && (
          <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted }}>
            {card.priceSuffix}
          </span>
        )}
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 11.5,
          lineHeight: 1.5,
          color: COLORS.textMuted,
        }}
      >
        {card.desc}
      </div>
    </div>

    <div style={{ flex: 1 }} />

    <button
      type="button"
      style={{
        marginTop: 16,
        borderRadius: 6,
        padding: "8px 12px",
        fontSize: 12,
        fontWeight: 500,
        fontFamily: FONTS.sans,
        border: card.ctaFilled ? "none" : `1px solid ${COLORS.border}`,
        background: card.ctaFilled ? COLORS.primary : "transparent",
        color: card.ctaFilled ? "#000" : COLORS.textMuted,
      }}
    >
      {card.cta}
    </button>
  </div>
);

const StatusChip: React.FC<{ status: ProductCard["status"] }> = ({ status }) => {
  const theme = {
    live: {
      bg: `${COLORS.primary}1A`,
      border: `${COLORS.primary}66`,
      color: COLORS.primary,
      label: "Live",
    },
    roadmap: {
      bg: "transparent",
      border: COLORS.border,
      color: COLORS.textMuted,
      label: "Roadmap",
    },
    new: {
      bg: COLORS.primary,
      border: COLORS.primary,
      color: "#000",
      label: "New",
    },
  }[status];

  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 500,
        padding: "2px 8px",
        borderRadius: 999,
        border: `1px solid ${theme.border}`,
        background: theme.bg,
        color: theme.color,
      }}
    >
      {theme.label}
    </span>
  );
};
