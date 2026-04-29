export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-pancake-border">
      <div className="absolute inset-0 grain opacity-50" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,203,2,0.15),transparent_60%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="inline-flex items-center gap-2 rounded-full border border-pancake-border bg-pancake-card/60 px-3 py-1 text-xs font-mono text-pancake-text-muted backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-pancake-primary animate-pulse-slow" />
          Agent-native commerce · preview
        </div>

        <h1 className="mt-8 text-5xl font-semibold tracking-tight md:text-7xl">
          <span className="text-gradient">Commerce for AI agents.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-pancake-text-muted md:text-xl">
          The payments platform purpose-built for developers shipping agentic products —
          with one-time, subscription, and <span className="text-pancake-primary-soft">result-based</span> billing,
          all wired for agents to operate end-to-end.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#reel"
            className="inline-flex items-center gap-2 rounded-md bg-pancake-primary px-5 py-3 text-sm font-medium text-black transition hover:bg-pancake-primary-hover"
          >
            Watch the demo
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10m0 0L8.5 3.5M13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-md border border-pancake-border px-5 py-3 text-sm font-medium text-pancake-text transition hover:border-pancake-primary hover:text-pancake-primary"
          >
            Try the pricing demo →
          </a>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-mono text-pancake-text-dim">
          <span>SDK · TypeScript / Next.js</span>
          <span className="opacity-40">·</span>
          <span>MCP server</span>
          <span className="opacity-40">·</span>
          <span>Agent skills</span>
          <span className="opacity-40">·</span>
          <span>Webhooks · RSA-SHA256</span>
        </div>
      </div>
    </section>
  );
}
