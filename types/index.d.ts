// Type definitions for candlestick v1.1.0
// Project: https://github.com/cm45t3r/candlestick
// Definitions by: cm45t3r

/**
 * OHLC (Open, High, Low, Close) candlestick data structure
 */
export interface OHLC {
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * Extended OHLC with precomputed properties
 */
export interface OHLCExtended extends OHLC {
  bodyLen: number;
  wickLen: number;
  tailLen: number;
  isBullish: boolean;
  isBearish: boolean;
  bodyEnds: {
    bottom: number;
    top: number;
  };
}

/**
 * Pattern metadata information
 */
export interface PatternMetadata {
  type: "reversal" | "continuation" | "neutral";
  direction: "bullish" | "bearish" | "neutral";
  confidence: number;
  strength: "weak" | "moderate" | "strong";
  description: string;
}

/**
 * Pattern match result from patternChain
 */
export interface PatternMatch {
  index: number;
  pattern: string;
  match: OHLC[] | OHLCExtended[];
  metadata?: PatternMetadata;
}

/**
 * Pattern definition for patternChain
 */
export interface PatternDefinition {
  name: string;
  fn: (dataArray: OHLC[]) => number[];
  paramCount?: number;
}

// ========== Utility Functions ==========

/**
 * Absolute distance between open and close
 */
export function bodyLen(candlestick: OHLC): number;

/**
 * Absolute distance between high and max(open, close)
 */
export function wickLen(candlestick: OHLC): number;

/**
 * Absolute distance between min(open, close) and low
 */
export function tailLen(candlestick: OHLC): number;

/**
 * Returns top and bottom ends from a body
 */
export function bodyEnds(candlestick: OHLC): { bottom: number; top: number };

/**
 * Returns true if close is greater than open (bullish candle)
 */
export function isBullish(candlestick: OHLC): boolean;

/**
 * Returns true if close is less than open (bearish candle)
 */
export function isBearish(candlestick: OHLC): boolean;

/**
 * Returns true if previous top is less than current bottom (gap up)
 */
export function hasGapUp(previous: OHLC, current: OHLC): boolean;

/**
 * Returns true if previous bottom is greater than current top (gap down)
 */
export function hasGapDown(previous: OHLC, current: OHLC): boolean;

/**
 * Returns true if previous body is engulfed by current body
 */
export function isEngulfed(previous: OHLC, current: OHLC): boolean;

/**
 * Generalized pattern search utility for arrays
 */
export function findPattern(
  dataArray: OHLC[],
  callback: (...args: OHLC[]) => boolean,
): number[];

/**
 * Precompute and cache all relevant properties for each candle in a series
 */
export function precomputeCandleProps(dataArray: OHLC[]): OHLCExtended[];

/**
 * Validate OHLC data structure and relationships
 */
export function validateOHLC(candle: any, throwError?: boolean): boolean;

/**
 * Validate array of OHLC data
 */
export function validateOHLCArray(
  dataArray: any[],
  throwError?: boolean,
): boolean;

// ========== Hammer Patterns ==========

/**
 * Returns true if the candle is a Hammer
 */
export function isHammer(candlestick: OHLC): boolean;

/**
 * Returns true if the candle is a Bullish Hammer
 */
export function isBullishHammer(candlestick: OHLC): boolean;

/**
 * Returns true if the candle is a Bearish Hammer
 */
export function isBearishHammer(candlestick: OHLC): boolean;

/**
 * Finds all Hammer patterns in a series
 */
export function hammer(dataArray: OHLC[]): number[];

/**
 * Finds all Bullish Hammer patterns in a series
 */
export function bullishHammer(dataArray: OHLC[]): number[];

/**
 * Finds all Bearish Hammer patterns in a series
 */
export function bearishHammer(dataArray: OHLC[]): number[];

// ========== Inverted Hammer Patterns ==========

/**
 * Returns true if the candle is an Inverted Hammer
 */
export function isInvertedHammer(candlestick: OHLC): boolean;

/**
 * Returns true if the candle is a Bullish Inverted Hammer
 */
export function isBullishInvertedHammer(candlestick: OHLC): boolean;

/**
 * Returns true if the candle is a Bearish Inverted Hammer
 */
export function isBearishInvertedHammer(candlestick: OHLC): boolean;

/**
 * Finds all Inverted Hammer patterns in a series
 */
export function invertedHammer(dataArray: OHLC[]): number[];

/**
 * Finds all Bullish Inverted Hammer patterns in a series
 */
export function bullishInvertedHammer(dataArray: OHLC[]): number[];

/**
 * Finds all Bearish Inverted Hammer patterns in a series
 */
export function bearishInvertedHammer(dataArray: OHLC[]): number[];

// ========== Doji Patterns ==========

/**
 * Returns true if the candlestick is a Doji
 */
export function isDoji(candlestick: OHLC): boolean;

/**
 * Finds all Doji patterns in a series
 */
export function doji(dataArray: OHLC[]): number[];

// ========== Engulfing Patterns ==========

/**
 * Returns true if a bearish candle is followed by a bullish candle that engulfs it
 */
export function isBullishEngulfing(previous: OHLC, current: OHLC): boolean;

/**
 * Returns true if a bullish candle is followed by a bearish candle that engulfs it
 */
export function isBearishEngulfing(previous: OHLC, current: OHLC): boolean;

/**
 * Finds all Bullish Engulfing patterns in a series
 */
export function bullishEngulfing(dataArray: OHLC[]): number[];

/**
 * Finds all Bearish Engulfing patterns in a series
 */
export function bearishEngulfing(dataArray: OHLC[]): number[];

// ========== Harami Patterns ==========

/**
 * Returns true if a bullish candle is followed by a smaller bullish/bearish candle inside it
 */
export function isBullishHarami(previous: OHLC, current: OHLC): boolean;

/**
 * Returns true if a bearish candle is followed by a smaller bullish/bearish candle inside it
 */
export function isBearishHarami(previous: OHLC, current: OHLC): boolean;

/**
 * Finds all Bullish Harami patterns in a series
 */
export function bullishHarami(dataArray: OHLC[]): number[];

/**
 * Finds all Bearish Harami patterns in a series
 */
export function bearishHarami(dataArray: OHLC[]): number[];

// ========== Kicker Patterns ==========

/**
 * Returns true if pattern is a Bullish Kicker
 */
export function isBullishKicker(previous: OHLC, current: OHLC): boolean;

/**
 * Returns true if pattern is a Bearish Kicker
 */
export function isBearishKicker(previous: OHLC, current: OHLC): boolean;

/**
 * Finds all Bullish Kicker patterns in a series
 */
export function bullishKicker(dataArray: OHLC[]): number[];

/**
 * Finds all Bearish Kicker patterns in a series
 */
export function bearishKicker(dataArray: OHLC[]): number[];

// ========== Reversal Patterns ==========

/**
 * Returns true if pattern is a Hanging Man
 */
export function isHangingMan(previous: OHLC, current: OHLC): boolean;

/**
 * Returns true if pattern is a Shooting Star
 */
export function isShootingStar(previous: OHLC, current: OHLC): boolean;

/**
 * Finds all Hanging Man patterns in a series
 */
export function hangingMan(dataArray: OHLC[]): number[];

/**
 * Finds all Shooting Star patterns in a series
 */
export function shootingStar(dataArray: OHLC[]): number[];

// ========== Piercing Line Pattern ==========

/**
 * Returns true if the pattern is a Piercing Line (bullish reversal)
 */
export function isPiercingLine(first: OHLC, second: OHLC): boolean;

/**
 * Finds all Piercing Line patterns in a series
 */
export function piercingLine(dataArray: OHLC[]): number[];

// ========== Dark Cloud Cover Pattern ==========

/**
 * Returns true if the pattern is a Dark Cloud Cover (bearish reversal)
 */
export function isDarkCloudCover(first: OHLC, second: OHLC): boolean;

/**
 * Finds all Dark Cloud Cover patterns in a series
 */
export function darkCloudCover(dataArray: OHLC[]): number[];

// ========== Morning Star Pattern ==========

/**
 * Returns true if the pattern is a Morning Star (bullish reversal)
 */
export function isMorningStar(first: OHLC, second: OHLC, third: OHLC): boolean;

/**
 * Finds all Morning Star patterns in a series
 */
export function morningStar(dataArray: OHLC[]): number[];

// ========== Evening Star Pattern ==========

/**
 * Returns true if the pattern is an Evening Star (bearish reversal)
 */
export function isEveningStar(first: OHLC, second: OHLC, third: OHLC): boolean;

/**
 * Finds all Evening Star patterns in a series
 */
export function eveningStar(dataArray: OHLC[]): number[];

// ========== Three White Soldiers Pattern ==========

/**
 * Returns true if the pattern is Three White Soldiers (bullish continuation)
 */
export function isThreeWhiteSoldiers(
  first: OHLC,
  second: OHLC,
  third: OHLC,
): boolean;

/**
 * Finds all Three White Soldiers patterns in a series
 */
export function threeWhiteSoldiers(dataArray: OHLC[]): number[];

// ========== Three Black Crows Pattern ==========

/**
 * Returns true if the pattern is Three Black Crows (bearish continuation)
 */
export function isThreeBlackCrows(
  first: OHLC,
  second: OHLC,
  third: OHLC,
): boolean;

/**
 * Finds all Three Black Crows patterns in a series
 */
export function threeBlackCrows(dataArray: OHLC[]): number[];

// ========== Pattern Chain ==========

/**
 * Array of all available pattern definitions
 */
export const allPatterns: PatternDefinition[];

/**
 * Scans a candlestick series for multiple patterns in one pass
 */
export function patternChain(
  candles: OHLC[],
  patterns?: PatternDefinition[],
): PatternMatch[];

// ========== Utilities Export ==========

export const utils: {
  bodyLen: typeof bodyLen;
  wickLen: typeof wickLen;
  tailLen: typeof tailLen;
  bodyEnds: typeof bodyEnds;
  isBullish: typeof isBullish;
  isBearish: typeof isBearish;
  hasGapUp: typeof hasGapUp;
  hasGapDown: typeof hasGapDown;
  findPattern: typeof findPattern;
  isEngulfed: typeof isEngulfed;
  precomputeCandleProps: typeof precomputeCandleProps;
  validateOHLC: typeof validateOHLC;
  validateOHLCArray: typeof validateOHLCArray;
};

// ========== Plugin System ==========

/**
 * Plugin configuration for custom patterns
 */
export interface PatternPlugin {
  name: string;
  fn: (dataArray: OHLC[]) => number[];
  paramCount?: number;
  metadata?: {
    type?: "reversal" | "continuation" | "neutral" | string;
    confidence?: number;
    description?: string;
    [key: string]: any;
  };
}

export const plugins: {
  /**
   * Register a custom pattern plugin
   */
  registerPattern: (plugin: PatternPlugin) => PatternDefinition;

  /**
   * Unregister a custom pattern
   */
  unregisterPattern: (name: string) => boolean;

  /**
   * Get a registered custom pattern by name
   */
  getPattern: (name: string) => PatternDefinition | undefined;

  /**
   * Get all registered custom patterns
   */
  getAllCustomPatterns: () => PatternDefinition[];

  /**
   * Clear all registered custom patterns
   */
  clearAllPatterns: () => void;

  /**
   * Check if a pattern is registered
   */
  hasPattern: (name: string) => boolean;

  /**
   * Get count of registered custom patterns
   */
  getPatternCount: () => number;
};

// ========== Pattern Metadata System ==========

export const metadata: {
  /**
   * Pattern metadata definitions
   */
  patternMetadata: Record<string, PatternMetadata>;

  /**
   * Get metadata for a pattern
   */
  getPatternMetadata: (patternName: string) => PatternMetadata | undefined;

  /**
   * Enhance pattern chain results with metadata
   */
  enrichWithMetadata: (results: PatternMatch[]) => PatternMatch[];

  /**
   * Filter pattern results by minimum confidence
   */
  filterByConfidence: (
    results: PatternMatch[],
    minConfidence?: number,
  ) => PatternMatch[];

  /**
   * Filter pattern results by type
   */
  filterByType: (
    results: PatternMatch[],
    type: "reversal" | "continuation" | "neutral",
  ) => PatternMatch[];

  /**
   * Filter pattern results by direction
   */
  filterByDirection: (
    results: PatternMatch[],
    direction: "bullish" | "bearish" | "neutral",
  ) => PatternMatch[];

  /**
   * Sort pattern results by confidence (descending)
   */
  sortByConfidence: (results: PatternMatch[]) => PatternMatch[];
};
