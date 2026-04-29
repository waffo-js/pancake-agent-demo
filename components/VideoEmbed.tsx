"use client";

import { useEffect, useState } from "react";

type Props = {
  videoSrc: string;
  /** Descriptive label shown in the "not rendered yet" placeholder */
  label?: string;
};

/**
 * Probes the video URL with a HEAD request. If the file exists, renders a
 * normal <video> element. If not, shows a "run `npm run render`" placeholder
 * so the site still looks intentional before the first Remotion render.
 */
export function VideoEmbed({ videoSrc, label }: Props) {
  const [hasVideo, setHasVideo] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(videoSrc, { method: "HEAD" })
      .then((r) => { if (!cancelled) setHasVideo(r.ok); })
      .catch(() => { if (!cancelled) setHasVideo(false); });
    return () => { cancelled = true; };
  }, [videoSrc]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-pancake-border bg-pancake-card glow">
      <div className="aspect-video">
        {hasVideo ? (
          <video
            className="h-full w-full"
            src={videoSrc}
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-pancake-text-muted">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-pancake-text-dim">
              {label ?? "video"}
            </div>
            <div className="text-sm">Run <code className="rounded bg-pancake-bg px-1.5 py-0.5 font-mono text-pancake-primary">npm run render</code> to produce the video.</div>
            <div className="font-mono text-[10px] text-pancake-text-dim">
              or <code>npm run studio</code> for live preview
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
