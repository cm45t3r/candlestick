/*
 * Copyright (C) 2016-present cm45t3r.
 * MIT License.
 */

// ESM wrapper for the CommonJS module
import candlestickModule from "./candlestick.js";

// Re-export everything from the CommonJS module
export const {
  // Hammer
  isHammer,
  isBullishHammer,
  isBearishHammer,
  hammer,
  bullishHammer,
  bearishHammer,

  // Inverted Hammer
  isInvertedHammer,
  isBullishInvertedHammer,
  isBearishInvertedHammer,
  invertedHammer,
  bullishInvertedHammer,
  bearishInvertedHammer,

  // Engulfing
  isBullishEngulfing,
  isBearishEngulfing,
  bullishEngulfing,
  bearishEngulfing,

  // Harami
  isBullishHarami,
  isBearishHarami,
  bullishHarami,
  bearishHarami,

  // Kicker
  isBullishKicker,
  isBearishKicker,
  bullishKicker,
  bearishKicker,

  // Reversal
  isHangingMan,
  isShootingStar,
  hangingMan,
  shootingStar,

  // Doji
  isDoji,
  doji,

  // Morning Star
  isMorningStar,
  morningStar,

  // Evening Star
  isEveningStar,
  eveningStar,

  // Three White Soldiers
  isThreeWhiteSoldiers,
  threeWhiteSoldiers,

  // Three Black Crows
  isThreeBlackCrows,
  threeBlackCrows,

  // Piercing Line
  isPiercingLine,
  piercingLine,

  // Dark Cloud Cover
  isDarkCloudCover,
  darkCloudCover,

  // Pattern Chain
  patternChain,
  allPatterns,

  // Utils, Plugins, and Metadata
  utils,
  plugins,
  metadata,
} = candlestickModule;

// Default export for convenience
export default candlestickModule;
