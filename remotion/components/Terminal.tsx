import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../constants";

export type Line =
  | { t: "user"; content: string; at: number }
  | { t: "assistant"; content: string; at: number }
  | { t: "tool"; content: string; at: number }
  | { t: "code"; content: string; at: number }
  | { t: "system"; content: string; at: number }
  | { t: "success"; content: string; at: number };

type Props = {
  path: string;   // shown in terminal chrome (e.g. "~/my-saas")
  lines: Line[];
  /** characters per frame for typewriter pacing (default 2.5 = ~75 chars/sec at 30fps) */
  cps?: number;
};

/**
 * Claude-Code-styled terminal that types user prompts character-by-character
 * and fades/slides in assistant / tool / system / success rows. Pure Remotion
 * (no timers) so renders are deterministic at any fps.
 */
export const Terminal: React.FC<Props> = ({ path, lines, cps = 2.5 }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: COLORS.terminal,
        display: "flex",
        flexDirection: "column",
        fontFamily: FONTS.mono,
      }}
    >
      {/* Terminal chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 16px",
          borderBottom: `1px solid ${COLORS.border}`,
          fontSize: 11,
          color: COLORS.textDim,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
        </div>
        <span style={{ color: COLORS.textMuted, marginLeft: 8 }}>claude-code</span>
        <span>· {path}</span>
      </div>

      {/* Lines */}
      <div
        style={{
          flex: 1,
          padding: "20px 24px",
          fontSize: 13,
          lineHeight: 1.7,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {lines.map((line, i) => (
          <TerminalLine key={i} line={line} frame={frame} cps={cps} />
        ))}
      </div>
    </div>
  );
};

const TerminalLine: React.FC<{ line: Line; frame: number; cps: number }> = ({
  line,
  frame,
  cps,
}) => {
  // Not visible yet
  if (frame < line.at) return null;

  const elapsed = frame - line.at;
  const reveal = Math.min(line.content.length, Math.ceil(elapsed * cps));
  const text = line.content.slice(0, reveal);
  const typingDone = reveal >= line.content.length;
  const showCaret = line.t === "user" && !typingDone;

  // Fade-in for non-user lines
  const opacity = line.t === "user"
    ? 1
    : interpolate(elapsed, [0, 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });

  const translateY = line.t === "user"
    ? 0
    : interpolate(elapsed, [0, 12], [4, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });

  if (line.t === "user") {
    return (
      <div style={{ color: COLORS.text }}>
        <span style={{ color: COLORS.primary }}>❯ </span>
        <span>{text}</span>
        {showCaret && <Caret />}
      </div>
    );
  }

  if (line.t === "assistant") {
    return (
      <div
        style={{
          color: COLORS.textMuted,
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        <span style={{ color: COLORS.primarySoft, marginRight: 10 }}>●</span>
        {text}
      </div>
    );
  }

  if (line.t === "tool") {
    return (
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          border: `1px solid ${COLORS.border}`,
          background: `${COLORS.card}a0`,
          borderRadius: 4,
          padding: "6px 12px",
          fontSize: 12,
          color: COLORS.textMuted,
        }}
      >
        <span style={{ color: COLORS.primary, marginRight: 8 }}>⚒</span>
        {text}
      </div>
    );
  }

  if (line.t === "code") {
    return (
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          padding: "12px 16px",
          background: "#0E1518",
          border: `1px solid ${COLORS.border}`,
          borderLeft: `2px solid ${COLORS.primary}`,
          borderRadius: 4,
          fontSize: 12,
          color: COLORS.text,
          whiteSpace: "pre",
        }}
      >
        {text}
      </div>
    );
  }

  if (line.t === "system") {
    return (
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          fontSize: 11,
          color: COLORS.textDim,
        }}
      >
        {text}
      </div>
    );
  }

  if (line.t === "success") {
    return (
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          color: COLORS.primary,
          fontWeight: 500,
        }}
      >
        <span style={{ marginRight: 8 }}>✓</span>
        {text}
      </div>
    );
  }

  return null;
};

const Caret: React.FC = () => {
  const frame = useCurrentFrame();
  const visible = Math.floor(frame / 15) % 2 === 0;
  return (
    <span style={{ color: COLORS.primary, marginLeft: 2, opacity: visible ? 1 : 0 }}>
      ▋
    </span>
  );
};
