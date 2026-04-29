import { VideoEmbed } from "./VideoEmbed";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  lede: string;
  videoSrc: string;          // path to the rendered .mp4
  videoLabel?: string;       // fallback label when video isn't rendered yet
  bullets: { title: string; body: string }[];
  children?: React.ReactNode;
};

export function Section({ id, eyebrow, title, lede, videoSrc, videoLabel, bullets, children }: Props) {
  return (
    <section id={id} className="border-b border-pancake-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-pancake-primary">
              {eyebrow}
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-pancake-text-muted">{lede}</p>
            <ul className="mt-8 space-y-5">
              {bullets.map((b, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-pancake-primary" aria-hidden="true" />
                  <div>
                    <div className="font-medium text-pancake-text">{b.title}</div>
                    <div className="text-sm text-pancake-text-muted">{b.body}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <VideoEmbed videoSrc={videoSrc} label={videoLabel} />
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
