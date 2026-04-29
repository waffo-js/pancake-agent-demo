// Kestrel Research — mock merchant site used as a prop in V1 and V3.
// Not a real product; kept minimal and on-brand for the fictional merchant.

export default function KestrelPage() {
  return (
    <main className="min-h-screen bg-[#0a0f14] text-[#e8f2e8]">
      <header className="border-b border-[#16323B]/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#3db8a6] text-sm font-bold text-black">
              K
            </div>
            <span className="font-semibold tracking-tight">Kestrel Research</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-[#8a9a95]">
            <a href="#products">Products</a>
            <a href="#about">About</a>
            <a
              href="#contact"
              className="rounded-md bg-[#3db8a6] px-3 py-1.5 text-black hover:bg-[#55d0bc]"
            >
              Get a report
            </a>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#16323B]/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(61,184,166,0.12),transparent_60%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#16323B] bg-[#0a1a1f] px-3 py-1 text-xs font-mono text-[#7a8a85]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3db8a6]" />
            Autonomous market intel
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
            Competitive intel,<br />delivered by an agent.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-[#8a9a95]">
            Kestrel&rsquo;s research agent reads the web, synthesizes findings, and delivers a deliverable
            that meets your acceptance rubric — or you pay nothing.
          </p>
          <div className="mt-8 flex gap-3">
            <a
              href="#products"
              className="rounded-md bg-[#3db8a6] px-5 py-3 text-sm font-medium text-black hover:bg-[#55d0bc]"
            >
              Browse products
            </a>
            <a
              href="#api"
              className="rounded-md border border-[#16323B] px-5 py-3 text-sm font-medium hover:border-[#3db8a6]"
            >
              Agent API docs
            </a>
          </div>
        </div>
      </section>

      <section id="products" className="border-b border-[#16323B]/60">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#3db8a6]">Three ways to buy</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Competitor snapshot",
                price: "$29",
                model: "one-time",
                desc: "A 5-page snapshot of a single competitor. Delivered in under 10 minutes.",
              },
              {
                name: "Weekly intel brief",
                price: "$99/mo",
                model: "subscription",
                desc: "Every Monday, a curated brief on your watchlist. Cancel anytime.",
              },
              {
                name: "Bespoke deep-dive",
                price: "from $200",
                model: "result-based",
                desc: "Custom research to your rubric. Pay only on rubric pass — verified by an agent judge.",
                highlight: true,
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-xl border p-6 ${
                  p.highlight
                    ? "border-[#3db8a6] bg-[#3db8a6]/5 shadow-[0_0_30px_-10px_rgba(61,184,166,0.3)]"
                    : "border-[#16323B] bg-[#0a1a1f]"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs uppercase text-[#7a8a85]">{p.model}</span>
                  {p.highlight && (
                    <span className="rounded-full bg-[#3db8a6] px-2 py-0.5 text-[10px] font-bold text-black">
                      NEW
                    </span>
                  )}
                </div>
                <div className="mt-4 text-xl font-semibold tracking-tight">{p.name}</div>
                <div className="mt-1 font-mono text-2xl text-[#e8f2e8]">{p.price}</div>
                <p className="mt-4 text-sm text-[#8a9a95]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 py-10 text-xs font-mono text-[#4a5a55]">
        Kestrel Research · demo merchant for Pancake
      </footer>
    </main>
  );
}
