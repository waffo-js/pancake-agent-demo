import { AbsoluteFill, Series } from "remotion";
import {
  CHECKOUT_DURATION,
  COLORS,
  RESULT_DURATION,
  SITE_DURATION,
  SUMMARY_DURATION,
  V1_DURATION,
  V2_DURATION,
} from "../constants";
import { SiteScene } from "./SiteScene";
import { V1Scene } from "./V1Scene";
import { V2Scene } from "./V2Scene";
import { CheckoutScene } from "./CheckoutScene";
import { ResultScene } from "./ResultScene";
import { SummaryScene } from "./SummaryScene";

/**
 * Combined — the six scenes stitched into a single deliverable.
 *
 * site → onboard (v1) → migrate (v2) → checkout → result → summary.
 */
export const Combined: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Series>
        <Series.Sequence durationInFrames={SITE_DURATION}>
          <SiteScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={V1_DURATION}>
          <V1Scene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={V2_DURATION}>
          <V2Scene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CHECKOUT_DURATION}>
          <CheckoutScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={RESULT_DURATION}>
          <ResultScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SUMMARY_DURATION}>
          <SummaryScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
