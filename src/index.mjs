/*
 * Copyright (C) 2016-present cm45t3r.
 * MIT License.
 */

// Static re-exports, one per source module.
//
// This file used to import ./candlestick.js as a default binding and
// destructure the whole namespace at runtime. That is opaque to static
// analysis, so no bundler could prove any export unreachable and every import
// pulled in the entire library. Naming each export against its own module
// makes the graph analysable, and `sideEffects: false` in package.json finally
// has something to act on.
//
// Keep this list in sync with src/candlestick.js.

// Hammer
export {
  isHammer,
  isBullishHammer,
  isBearishHammer,
  hammer,
  bullishHammer,
  bearishHammer,
} from "./hammer.js";

// Inverted Hammer
export {
  isInvertedHammer,
  isBullishInvertedHammer,
  isBearishInvertedHammer,
  invertedHammer,
  bullishInvertedHammer,
  bearishInvertedHammer,
} from "./invertedHammer.js";

// Engulfing
export {
  isBullishEngulfing,
  isBearishEngulfing,
  bullishEngulfing,
  bearishEngulfing,
} from "./engulfing.js";

// Harami
export {
  isBullishHarami,
  isBearishHarami,
  bullishHarami,
  bearishHarami,
} from "./harami.js";

// Kicker
export {
  isBullishKicker,
  isBearishKicker,
  bullishKicker,
  bearishKicker,
} from "./kicker.js";

// Reversal (Hanging Man, Shooting Star)
export {
  isHangingMan,
  isShootingStar,
  hangingMan,
  shootingStar,
} from "./reversal.js";

// Doji
export { isDoji, doji } from "./doji.js";

// Morning Star
export { isMorningStar, morningStar } from "./morningStar.js";

// Evening Star
export { isEveningStar, eveningStar } from "./eveningStar.js";

// Three White Soldiers
export {
  isThreeWhiteSoldiers,
  threeWhiteSoldiers,
} from "./threeWhiteSoldiers.js";

// Three Black Crows
export { isThreeBlackCrows, threeBlackCrows } from "./threeBlackCrows.js";

// Piercing Line
export { isPiercingLine, piercingLine } from "./piercingLine.js";

// Dark Cloud Cover
export { isDarkCloudCover, darkCloudCover } from "./darkCloudCover.js";

// Marubozu
export {
  isMarubozu,
  isBullishMarubozu,
  isBearishMarubozu,
  marubozu,
  bullishMarubozu,
  bearishMarubozu,
} from "./marubozu.js";

// Spinning Top
export {
  isSpinningTop,
  isBullishSpinningTop,
  isBearishSpinningTop,
  spinningTop,
  bullishSpinningTop,
  bearishSpinningTop,
} from "./spinningTop.js";

// Tweezers
export {
  isTweezers,
  isTweezersTop,
  isTweezersBottom,
  tweezers,
  tweezersTop,
  tweezersBottom,
} from "./tweezers.js";

// Pattern Chain
export { patternChain, allPatterns } from "./patternChain.js";

// Namespaces. A CommonJS module.exports becomes the ESM default export,
// so each of these is re-exported under its established name.
export { default as utils } from "./utils.js";
export { default as plugins } from "./pluginManager.js";
export { default as metadata } from "./patternMetadata.js";
export { default as streaming } from "./streaming.js";

// The aggregate object, unchanged, for `import candlestick from "candlestick"`.
// Importing only named exports leaves this unreferenced, so a bundler drops it
// along with the aggregator it comes from.
export { default } from "./candlestick.js";
