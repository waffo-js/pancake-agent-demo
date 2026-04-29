import { Composition, Folder } from "remotion";
import { SiteScene } from "./scenes/SiteScene";
import { V1Scene } from "./scenes/V1Scene";
import { V2Scene } from "./scenes/V2Scene";
import { CheckoutScene } from "./scenes/CheckoutScene";
import { ResultScene } from "./scenes/ResultScene";
import { SummaryScene } from "./scenes/SummaryScene";
import { Combined } from "./scenes/Combined";
import { PancakeDemo } from "./scenes/PancakeDemo";
import { ResultSlow } from "./scenes/ResultSlow";
import {
  CHECKOUT_DURATION,
  COMBINED_DURATION,
  FPS,
  HEIGHT,
  PANCAKE_DEMO_DURATION,
  RESULT_DURATION,
  RESULT_SLOW_DURATION,
  SITE_DURATION,
  SUMMARY_DURATION,
  V1_DURATION,
  V2_DURATION,
  WIDTH,
} from "./constants";

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="Scenes">
        <Composition
          id="site"
          component={SiteScene}
          durationInFrames={SITE_DURATION}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="v1"
          component={V1Scene}
          durationInFrames={V1_DURATION}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="v2"
          component={V2Scene}
          durationInFrames={V2_DURATION}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="checkout"
          component={CheckoutScene}
          durationInFrames={CHECKOUT_DURATION}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="result"
          component={ResultScene}
          durationInFrames={RESULT_DURATION}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="result-slow"
          component={ResultSlow}
          durationInFrames={RESULT_SLOW_DURATION}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="summary"
          component={SummaryScene}
          durationInFrames={SUMMARY_DURATION}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      </Folder>
      <Composition
        id="pancake-demo"
        component={PancakeDemo}
        durationInFrames={PANCAKE_DEMO_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="combined"
        component={Combined}
        durationInFrames={COMBINED_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
