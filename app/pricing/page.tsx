import Link from "next/link";
import { PricingCards } from "@/components/PricingCards";

export const metadata = {
  title: "Pricing · Pancake Demo",
  description: "Live billing examples — one-time and subscription powered by Stripe Checkout; result-based powered by the Pancake mock API.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-pancake-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2 text-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-pancake-primary font-bold text-black">
              P
            </span>
            <span className="font-semibold tracking-tight">Pancake</span>
            <span className="font-mono text-xs text-pancake-text-dim">/ pricing demo</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-pancake-text-muted">
            <Link href="/#reel" className="hover:text-pancake-primary">Demo reel</Link>
            <Link href="/kestrel" className="hover:text-pancake-primary">Kestrel site</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-20 pb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-pancake-border bg-pancake-card/60 px-3 py-1 text-xs font-mono text-pancake-text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-pancake-primary" />
          Live demo · four billing models
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
          Every billing shape an agent needs, <span className="text-pancake-primary-soft">on one merchant</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-pancake-text-muted">
          Each card below is a real transaction you can try. One-time and subscription hit <span className="text-pancake-text">Stripe Checkout</span> in test mode. Result-based hits the <span className="text-pancake-text">Pancake mock API</span> and runs the full escrow-and-judge lifecycle in your browser.
        </p>
      </section>

      <TestBanner />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <PricingCards />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <IntegrationNote />
      </section>
    </main>
  );
}

function TestBanner() {
  return (
    <section className="mx-auto max-w-6xl px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-pancake-warning/30 bg-pancake-warning/5 px-4 py-3 text-sm">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="rounded bg-pancake-warning/20 px-2 py-0.5 uppercase tracking-widest text-pancake-warning">
            test mode
          </span>
          <span className="text-pancake-text-muted">
            Stripe Checkout runs against your test secret key — no real money moves.
          </span>
        </div>
        <div className="font-mono text-xs text-pancake-text-dim">
          Use card <span className="text-pancake-text">4242 4242 4242 4242</span> · any future date · any CVC
        </div>
      </div>
    </section>
  );
}

function IntegrationNote() {
  return (
    <div className="rounded-xl border border-pancake-border bg-pancake-card/50 p-8">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-pancake-primary">
        How this is wired
      </div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">
        Demo is powered by Stripe + the result-contract mock API.
      </h2>
      <p className="mt-3 max-w-3xl text-pancake-text-muted">
        One-time and subscription SKUs go through a real <code className="font-mono text-pancake-primary">stripe.checkout.sessions.create</code> call on the server, then the browser redirects to Stripe-hosted Checkout.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <CodeBlock
          title="One-time · Stripe"
          code={`const s = await stripe.checkout.sessions.create({
  mode: "payment",
  line_items: [{ price: priceId, quantity: 1 }],
  success_url, cancel_url,
});
redirect(s.url);`}
        />
        <CodeBlock
          title="Subscription · Stripe"
          code={`const s = await stripe.checkout.sessions.create({
  mode: "subscription",
  line_items: [{ price: priceId, quantity: 1 }],
  success_url, cancel_url,
});
redirect(s.url);`}
        />
      </div>
    </div>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-pancake-border bg-pancake-bg">
      <div className="border-b border-pancake-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-pancake-text-dim">
        {title}
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-pancake-text">
        {code}
      </pre>
    </div>
  );
}
