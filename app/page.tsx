import { Hero } from "@/components/Hero";
import { ReelSection } from "@/components/ReelSection";
import { Section } from "@/components/Section";
import { BillingTable } from "@/components/BillingTable";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <ReelSection />

      <Section
        id="developers"
        eyebrow="Message 01 · Developer experience"
        title="Built for AI developers."
        lede="Every Pancake surface is designed for agents to operate. Our SDK, MCP server, and the official Claude skill (docs.waffo.ai/integrate/skill) let AI developers ship integrations their tools can drive end-to-end — not UIs their users have to click through."
        videoSrc="/videos/v1.mp4"
        videoLabel="scene 01"
        bullets={[
          {
            title: "@waffo/pancake-ts — typed, zero runtime deps",
            body: "RSA request signing and webhook verification built into the SDK. Install, set WAFFO_MERCHANT_ID + WAFFO_PRIVATE_KEY, ship.",
          },
          {
            title: "Official Claude skill + llms-full.txt",
            body: "Load docs.waffo.ai/integrate/skill and Pancake's full context from one prompt. Agents scaffold checkout and webhook routes in seconds.",
          },
          {
            title: "Test mode first, always",
            body: "Card 4576 7500 0000 0110 verifies the loop end-to-end — order.completed webhook arrives before you promote to prod.",
          },
        ]}
      />

      <Section
        id="agentic"
        eyebrow="Message 02 · Onboarding & migration"
        title="100% agentic integration."
        lede="Merchants don't click through wizards anymore. They tell an agent what they want, and the agent does the rest — including migrating existing products, subscriptions, and webhooks off another provider with zero manual setup."
        videoSrc="/videos/v2.mp4"
        videoLabel="scene 02"
        bullets={[
          {
            title: "Zero-touch onboarding",
            body: "Point an agent at your marketing site. It reads, proposes a catalog, and wires up Pancake.",
          },
          {
            title: "One-command migration",
            body: "From Stripe, Paddle, or any PSP — catalog, prices, and webhooks reconciled with a parity check.",
          },
          {
            title: "Test-mode first, always",
            body: "Every migration runs against test keys, verifies parity, then promotes to prod.",
          },
        ]}
      />

      <Section
        id="billing"
        eyebrow="Message 03 · Billing models for agents"
        title="New billing models, built for agents."
        lede="When an agent buys from another agent, success isn't a click — it's a result. Pancake's result-based billing lets agents negotiate acceptance criteria up front, holds payment in escrow, and settles automatically on verdict. Agents can finally transact on outcomes."
        videoSrc="/videos/v3.mp4"
        videoLabel="scene 03"
        bullets={[
          {
            title: "Pre-agreed rubric",
            body: "Buyer and seller agents sign a contract defining what 'done' means, before money moves.",
          },
          {
            title: "Pancake as neutral arbiter",
            body: "Escrow + deterministic judge, so neither agent can cheat. Settlement is automatic.",
          },
          {
            title: "Stacks with existing billing",
            body: "One merchant can run one-time, subscription, and result-based products side by side.",
          },
        ]}
      >
        <BillingTable />
      </Section>

      <Footer />
    </main>
  );
}
