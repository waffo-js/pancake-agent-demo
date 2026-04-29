"use client";

import { useState } from "react";

type Card = {
  kind: "onetime" | "subscription" | "usage" | "result";
  name: string;
  price: string;
  priceSuffix?: string;
  desc: string;
  badge: string;
  status: "live" | "roadmap" | "new";
  highlight?: boolean;
  sku?: "onetime" | "subscription";
};

const CARDS: Card[] = [
  {
    kind: "onetime",
    name: "Competitor snapshot",
    price: "$29",
    desc: "5-page snapshot of a single competitor. Delivered in under 10 minutes.",
    badge: "one-time",
    status: "live",
    sku: "onetime",
  },
  {
    kind: "subscription",
    name: "Weekly intel brief",
    price: "$99",
    priceSuffix: "/mo",
    desc: "Every Monday, a curated competitive brief. Cancel anytime.",
    badge: "subscription",
    status: "live",
    sku: "subscription",
  },
  {
    kind: "usage",
    name: "Research API access",
    price: "$0.001",
    priceSuffix: "/token",
    desc: "Metered research endpoints. Bills per token processed.",
    badge: "usage-based",
    status: "roadmap",
  },
  {
    kind: "result",
    name: "Bespoke deep-dive",
    price: "$200",
    priceSuffix: "on pass",
    desc: "Custom research to your rubric. Escrow held; paid only on rubric pass.",
    badge: "result-based",
    status: "new",
    highlight: true,
  },
];

export function PricingCards() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {CARDS.map((c) => (
        <CardView key={c.kind} card={c} />
      ))}
    </div>
  );
}

function CardView({ card }: { card: Card }) {
  return (
    <div
      className={`flex flex-col rounded-xl border p-6 ${
        card.highlight
          ? "border-pancake-primary bg-pancake-primary/5 glow"
          : "border-pancake-border bg-pancake-card"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-pancake-text-muted">
          {card.badge}
        </span>
        <StatusChip status={card.status} />
      </div>

      <div className="mt-5">
        <div className="text-lg font-semibold tracking-tight text-pancake-text">{card.name}</div>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="font-mono text-3xl text-pancake-text">{card.price}</span>
          {card.priceSuffix && (
            <span className="font-mono text-sm text-pancake-text-muted">{card.priceSuffix}</span>
          )}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-pancake-text-muted">{card.desc}</p>
      </div>

      <div className="mt-6 flex-1" />

      <Action card={card} />
    </div>
  );
}

function StatusChip({ status }: { status: Card["status"] }) {
  const map = {
    live: "border-pancake-primary/40 bg-pancake-primary/10 text-pancake-primary",
    roadmap: "border-pancake-border bg-transparent text-pancake-text-muted",
    new: "border-pancake-primary bg-pancake-primary text-black",
  } as const;
  const label = { live: "Live", roadmap: "Roadmap", new: "New" }[status];
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${map[status]}`}>
      {label}
    </span>
  );
}

function Action({ card }: { card: Card }) {
  if (card.kind === "onetime" || card.kind === "subscription") {
    return <StripeButton sku={card.sku!} label={card.kind === "onetime" ? "Buy" : "Subscribe"} />;
  }
  if (card.kind === "usage") {
    return (
      <button
        type="button"
        disabled
        className="rounded-md border border-pancake-border px-4 py-2.5 text-sm text-pancake-text-muted"
      >
        Request access (roadmap)
      </button>
    );
  }
  return <ResultBasedButton />;
}

/** Create a Stripe checkout session and redirect to it. */
function StripeButton({ sku, label }: { sku: "onetime" | "subscription"; label: string }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onClick = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sku }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErr(json.errors?.[0]?.message ?? `HTTP ${res.status}`);
        setLoading(false);
        return;
      }
      window.location.href = json.data.url;
    } catch (e) {
      setErr((e as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="w-full rounded-md bg-pancake-primary px-4 py-2.5 text-sm font-medium text-black transition hover:bg-pancake-primary-hover disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "Opening Stripe…" : label}
      </button>
      {err && <div className="text-xs text-pancake-danger">{err}</div>}
    </div>
  );
}

/** Fire the full result-contract lifecycle against the local mock API
 *  and render per-step progress inline. */
function ResultBasedButton() {
  type Step = "idle" | "ask" | "quote" | "accept" | "deliver" | "done" | "error";
  const [step, setStep] = useState<Step>("idle");
  const [err, setErr] = useState<string | null>(null);
  const [contract, setContract] = useState<{ id?: string; price?: string; verdict?: string } | null>(null);

  const run = async () => {
    setErr(null);
    setStep("ask");
    setContract({});
    try {
      // 1. Ava (buyer) posts a request.
      const req = await postJson("/mock/result-contract/create-request", {
        buyerApiKeyId: "KEY_demo_ava",
        topic: "Competitive deep-dive · Apple, Samsung, Xiaomi · last 4 quarters",
        rubric: "Cover all 3 companies. ≥5 insights each. ≥2 sources each. Focus on smartphone market.",
        budgetMax: { amount: "250.00", currency: "USD" },
      });

      // 2. Kestrel (seller) responds with a quote.
      setStep("quote");
      const quote = await postJson("/mock/result-contract/create-quote", {
        requestId: req.request.id,
        sellerApiKeyId: "KEY_demo_kestrel",
        price: { amount: "200.00", currency: "USD" },
        judgeModel: "claude-sonnet-4-6",
        etaSeconds: 120,
      });

      // 3. Ava accepts → Pancake mints contract and escrows.
      setStep("accept");
      const acc = await postJson("/mock/result-contract/accept-quote", {
        quoteId: quote.quote.id,
      });
      setContract({ id: acc.contract.id, price: `$${acc.contract.price.amount}` });

      // 4. Kestrel submits deliverable → judge runs → settle.
      setStep("deliver");
      const deliverable =
        "Apple: revenue grew 5% YoY, iPhone 16 lineup, services margin up 2pts, " +
        "tariff headwinds acknowledged. Samsung: Galaxy S25 launch, Android market " +
        "share up to 23%, memory cycle recovering. Xiaomi: EV launch, India growth " +
        "strong, supply chain diversified. Sources: 10-K filings and investor calls.";
      const fin = await postJson("/mock/result-contract/submit-deliverable", {
        contractId: acc.contract.id,
        deliverableText: deliverable,
      });
      setContract({
        id: fin.contract.id,
        price: `$${fin.contract.price.amount}`,
        verdict: fin.contract.verdict,
      });
      setStep("done");
    } catch (e) {
      setErr((e as Error).message);
      setStep("error");
    }
  };

  if (step === "idle") {
    return (
      <button
        type="button"
        onClick={run}
        className="w-full rounded-md bg-pancake-primary px-4 py-2.5 text-sm font-medium text-black transition hover:bg-pancake-primary-hover"
      >
        Run live demo →
      </button>
    );
  }

  return (
    <div className="space-y-2 font-mono text-xs">
      <ProgressRow label="Buyer posts request" done={step !== "ask"} active={step === "ask"} />
      <ProgressRow label="Seller quotes price + rubric" done={["accept","deliver","done"].includes(step)} active={step === "quote"} />
      <ProgressRow label="Pancake escrows funds" done={["deliver","done"].includes(step)} active={step === "accept"} />
      <ProgressRow label="Judge runs · settle" done={step === "done"} active={step === "deliver"} />

      {contract?.id && (
        <div className="mt-2 rounded border border-pancake-border bg-pancake-bg p-2 text-[10px] text-pancake-text-muted">
          <div>contract: <span className="text-pancake-text">{contract.id}</span></div>
          {contract.price && <div>price: <span className="text-pancake-text">{contract.price}</span></div>}
          {contract.verdict && (
            <div>
              verdict: <span className={contract.verdict === "pass" ? "text-pancake-primary" : "text-pancake-danger"}>{contract.verdict.toUpperCase()}</span>
            </div>
          )}
        </div>
      )}
      {err && <div className="text-pancake-danger">{err}</div>}
      {(step === "done" || step === "error") && (
        <button
          type="button"
          onClick={() => { setStep("idle"); setContract(null); }}
          className="w-full rounded border border-pancake-border px-3 py-1.5 text-pancake-text-muted hover:border-pancake-primary hover:text-pancake-primary"
        >
          run again
        </button>
      )}
    </div>
  );
}

function ProgressRow({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={
          done ? "text-pancake-primary" : active ? "text-pancake-primary-soft animate-pulse-slow" : "text-pancake-text-dim"
        }
      >
        {done ? "✓" : active ? "●" : "○"}
      </span>
      <span className={done || active ? "text-pancake-text" : "text-pancake-text-dim"}>{label}</span>
    </div>
  );
}

async function postJson(url: string, body: unknown): Promise<any> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.errors?.[0]?.message ?? `HTTP ${res.status}`);
  return json.data;
}
