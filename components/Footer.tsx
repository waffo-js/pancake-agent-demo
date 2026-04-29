export function Footer() {
  return (
    <footer className="border-t border-pancake-border">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr] md:items-end">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Building something agent-native?
            </h3>
            <p className="mt-3 max-w-lg text-pancake-text-muted">
              We&rsquo;re onboarding partners ahead of GA. Bring your use case — we&rsquo;ll bring the billing rail.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <a
              href="mailto:partners@waffo.com"
              className="inline-flex items-center rounded-md bg-pancake-primary px-5 py-3 text-sm font-medium text-black transition hover:bg-pancake-primary-hover"
            >
              Talk to us →
            </a>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-pancake-border pt-8 text-xs font-mono text-pancake-text-dim">
          <span>© 2026 Pancake · A Waffo product</span>
          <span>Made for agents</span>
        </div>
      </div>
    </footer>
  );
}
