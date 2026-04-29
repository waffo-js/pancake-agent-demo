export default function SummaryPage() {
  const cards = [
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

  return (
    <main
      style={{
        background: "#060F11",
        color: "#E8F2E8",
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        position: "relative",
        overflow: "hidden",
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
          background: "radial-gradient(circle, #7CCB0218, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* pill badge */}
      <div
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid #16323B",
          background: "#0A1A1FCC",
          borderRadius: 999,
          padding: "6px 14px",
          fontFamily:
            '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#7A8A85",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#7CCB02",
            flexShrink: 0,
          }}
        />
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
        }}
      >
        One SDK. One prompt.
        <br />
        <span style={{ color: "#ADF185" }}>
          Every billing shape agents can sell.
        </span>
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
        {cards.map((c) => (
          <div
            key={c.eyebrow}
            style={{
              border: "1px solid #16323B",
              borderRadius: 14,
              background: "#0A1A1F",
              padding: "22px 22px 24px",
              minHeight: 180,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontFamily:
                  '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#7CCB02",
              }}
            >
              {c.eyebrow}
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
              {c.title}
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 12.5,
                lineHeight: 1.55,
                color: "#7A8A85",
              }}
            >
              {c.body}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 36,
          fontFamily:
            '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 11,
          color: "#4A5A55",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        docs.waffo.ai · @waffo/pancake-ts
      </div>
    </main>
  );
}
