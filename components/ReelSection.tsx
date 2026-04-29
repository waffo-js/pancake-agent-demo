import { VideoEmbed } from "./VideoEmbed";

// The combined 3-act reel, prominent placement right below the hero.
// This is the elevator pitch — bank managers who only watch one thing watch this.
export function ReelSection() {
  return (
    <section id="reel" className="border-b border-pancake-border">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-pancake-border bg-pancake-card/60 px-3 py-1 text-xs font-mono text-pancake-text-muted backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-pancake-primary" />
            68 seconds · 3 scenes · one reel
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
            Watch the combined reel
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-pancake-text-muted">
            Full demo in one play — developer onboarding, agentic migration, then result-based billing between two agents.
          </p>
        </div>
        <div className="mx-auto max-w-4xl">
          <VideoEmbed videoSrc="/videos/combined.mp4" label="combined reel" />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-pancake-text-dim">
            <a href="#developers" className="transition hover:text-pancake-primary">01 · Dev experience</a>
            <span className="opacity-40">·</span>
            <a href="#agentic"    className="transition hover:text-pancake-primary">02 · Agentic integration</a>
            <span className="opacity-40">·</span>
            <a href="#billing"    className="transition hover:text-pancake-primary">03 · Result-based billing</a>
          </div>
        </div>
      </div>
    </section>
  );
}
