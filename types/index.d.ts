// Type definitions for candlestick v2.0.2
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
  /**
   * @deprecated Fixed, context-blind reliability score — does not check
   * whether the preceding trend matches what the pattern expects (see
   * https://github.com/cm45t3r/candlestick/issues/95). Prefer
   * `effectiveConfidence` (present when `patternChain` was called with a
   * `trendContext` option). Kept for backward compatibility; not scheduled
   * for removal before a major version.
   */
  confidence: number;
  strength: "weak" | "moderate" | "strong";
  description: string;
  /** How well the measured preceding trend matches this pattern's expected direction (0-1). Only present when `patternChain` was called with a `trendContext` option. See `TrendContextOptions`. */
  contextFit?: number;
  /** `confidence * contextFit`. The trend-aware alternative to the deprecated static `confidence`. Only present alongside `contextFit`. */
  effectiveConfidence?: number;
}

/**
 * Built-in trend measures for `TrendContextOptions.trendMethod`. All three
 * require `trendPeriod` (or one extra candle beyond it) prior candles to
 * produce a value (`NaN`/no context otherwise). See `src/trend.js`.
 */
export type TrendMethod = "sma-slope" | "ema-slope" | "pct-change";

/**
 * Options enabling the optional trend-context confidence adjustment for
 * `patternChain` (#95). Fully opt-in: omitting this object preserves the
 * pre-existing `patternChain` result shape exactly (no `trendContext`/
 * `contextFit` fields, no filtering).
 */
export interface TrendContextOptions {
  /** Built-in trend measure used when `externalTrend`/`trendFn` aren't given. Defaults to `"sma-slope"`. */
  trendMethod?: TrendMethod;
  /** Lookback window (in candles) for the built-in methods. Defaults to `10`. */
  trendPeriod?: number;
  /** Precomputed trend series (one signed value per candle, same order as the input array). Takes precedence over `trendMethod`. */
  externalTrend?: number[];
  /** Callback invoked per candle index to resolve trend lazily. Takes precedence over both `externalTrend` and `trendMethod`. */
  trendFn?: (candles: OHLC[], index: number) => number;
  /** Sensitivity of `contextFit` to the measured trend's magnitude. Defaults to `5`. See `src/contextFit.js`. */
  contextSensitivity?: number;
  /** When two matches with opposite `direction` metadata share at least one candle, drop whichever has the lower `contextFit` (ties keep both). Defaults to `false`: surface every match and let the caller filter/rank using `contextFit`. */
  resolveConflicts?: boolean;
}

/**
 * Pattern match result from patternChain
 */
export interface PatternMatch {
  index: number;
  pattern: string;
  match: OHLC[] | OHLCExtended[];
  metadata?: PatternMetadata;
  /** Coarse label for the trend measured just before this match begins. Only present when `patternChain` was called with a `trendContext` option; `undefined` when there isn't enough preceding history to measure it. */
  trendContext?: "uptrend" | "downtrend" | "sideways";
  /** How well the measured preceding trend matches this pattern's expected direction (0-1). Only present alongside `trendContext` option usage. */
  contextFit?: number;
}

/**
 * Pattern definition for patternChain
 */
export interface PatternDefinition {
  name: string;
  fn: (dataArray: OHLC[]) => number[];
  paramCount?: number;
}

// ========== Utility Functions (internal type helpers, accessed via utils namespace) ==========

declare function bodyLen(candlestick: OHLC): number;
declare function wickLen(candlestick: OHLC): number;
declare function tailLen(candlestick: OHLC): number;
declare function bodyEnds(candlestick: OHLC): { bottom: number; top: number };
declare function isBullish(candlestick: OHLC): boolean;
declare function isBearish(candlestick: OHLC): boolean;
declare function hasGapUp(previous: OHLC, current: OHLC): boolean;
declare function hasGapDown(previous: OHLC, current: OHLC): boolean;
declare function isEngulfed(previous: OHLC, current: OHLC): boolean;
declare function findPattern(
  dataArray: OHLC[],
  callback: (...args: OHLC[]) => boolean,
  /** Explicit candle count per pattern. Defaults to `callback.length`; pass explicitly when the callback uses default or rest parameters. */
  paramCount?: number,
): number[];
declare function precomputeCandleProps(
  dataArray: OHLC[],
  strict?: boolean,
): OHLCExtended[];
/** @param throwError When true (default), throws on invalid data; when false, returns false instead. */
declare function validateOHLC(candle: any, throwError?: boolean): boolean;
/** @param throwError When true (default), throws on invalid data; when false, returns false instead. */
declare function validateOHLCArray(
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
 * Returns true if a bearish candle is followed by a smaller bullish candle inside it (bullish reversal signal)
 */
export function isBullishHarami(previous: OHLC, current: OHLC): boolean;

/**
 * Returns true if a bullish candle is followed by a smaller bearish candle inside it (bearish reversal signal)
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
 * Built-in volatility measures for `GapThresholdOptions.volMethod`.
 * `"fixed-pct"` needs no history/lookback; the other three require `volPeriod`
 * prior candles to produce a value (`NaN` otherwise). See `src/volatility.js`.
 */
export type VolatilityMethod = "atr" | "stddev" | "percentile" | "fixed-pct";

/**
 * Options controlling the optional gap-significance threshold for Kicker
 * detection. Fully opt-in: omitting this object (or `minGapVol: 0`, the
 * default) preserves the pre-existing "any nonzero gap counts" behavior.
 * See README.md#gap-significance-threshold-kicker for usage examples.
 */
export interface GapThresholdOptions {
  /**
   * Minimum gap size required for a kicker to count, expressed as a multiple
   * of the resolved volatility unit — or, when `volMethod` is `"fixed-pct"`,
   * read directly as a fraction of the previous close (e.g. `0.005` = 0.5%,
   * not a multiplier). Defaults to `0` (off).
   */
  minGapVol?: number;
  /** Built-in volatility measure used when `externalVolatility`/`volatilityFn` aren't given. Defaults to `"atr"`. */
  volMethod?: VolatilityMethod;
  /** Lookback window (in candles) for `"atr"`/`"stddev"`/`"percentile"`. Ignored for `"fixed-pct"`. Defaults to `14`. */
  volPeriod?: number;
  /** Target quantile (0-1) used only by `volMethod: "percentile"`. Defaults to `0.9`. */
  volPercentile?: number;
  /**
   * Precomputed volatility series (one value per candle, same order as the
   * input array), expressed as a fraction of price. Takes precedence over `volMethod`.
   */
  externalVolatility?: number[];
  /** Callback invoked per candle index to resolve volatility lazily. Takes precedence over both `externalVolatility` and `volMethod`. */
  volatilityFn?: (candles: OHLC[], index: number) => number;
  /**
   * Only meaningful when calling `isBullishKicker`/`isBearishKicker` directly
   * on a single candle pair (which have no series context to resolve
   * `volMethod` from): the already-resolved volatility value to compare the
   * gap against.
   */
  volatility?: number;
}

/**
 * Returns true if pattern is a Bullish Kicker
 */
export function isBullishKicker(
  previous: OHLC,
  current: OHLC,
  options?: GapThresholdOptions,
): boolean;

/**
 * Returns true if pattern is a Bearish Kicker
 */
export function isBearishKicker(
  previous: OHLC,
  current: OHLC,
  options?: GapThresholdOptions,
): boolean;

/**
 * Finds all Bullish Kicker patterns in a series
 */
export function bullishKicker(
  dataArray: OHLC[],
  options?: GapThresholdOptions,
): number[];

/**
 * Finds all Bearish Kicker patterns in a series
 */
export function bearishKicker(
  dataArray: OHLC[],
  options?: GapThresholdOptions,
): number[];

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

// ========== Marubozu Pattern ==========

/**
 * Returns true if the candle is a Marubozu (strong directional candle with minimal shadows)
 */
export function isMarubozu(candle: OHLC): boolean;

/**
 * Returns true if the candle is a Bullish Marubozu
 */
export function isBullishMarubozu(candle: OHLC): boolean;

/**
 * Returns true if the candle is a Bearish Marubozu
 */
export function isBearishMarubozu(candle: OHLC): boolean;

/**
 * Finds all Marubozu patterns in a series
 */
export function marubozu(dataArray: OHLC[]): number[];

/**
 * Finds all Bullish Marubozu patterns in a series
 */
export function bullishMarubozu(dataArray: OHLC[]): number[];

/**
 * Finds all Bearish Marubozu patterns in a series
 */
export function bearishMarubozu(dataArray: OHLC[]): number[];

// ========== Spinning Top Pattern ==========

/**
 * Returns true if the candle is a Spinning Top (small body, long shadows - indecision)
 */
export function isSpinningTop(candle: OHLC): boolean;

/**
 * Returns true if the candle is a Bullish Spinning Top
 */
export function isBullishSpinningTop(candle: OHLC): boolean;

/**
 * Returns true if the candle is a Bearish Spinning Top
 */
export function isBearishSpinningTop(candle: OHLC): boolean;

/**
 * Finds all Spinning Top patterns in a series
 */
export function spinningTop(dataArray: OHLC[]): number[];

/**
 * Finds all Bullish Spinning Top patterns in a series
 */
export function bullishSpinningTop(dataArray: OHLC[]): number[];

/**
 * Finds all Bearish Spinning Top patterns in a series
 */
export function bearishSpinningTop(dataArray: OHLC[]): number[];

// ========== Tweezers Patterns ==========

/**
 * Returns true if the pattern is a Tweezers (top or bottom)
 */
export function isTweezers(first: OHLC, second: OHLC): boolean;

/**
 * Returns true if the pattern is a Tweezers Top (bearish reversal)
 */
export function isTweezersTop(first: OHLC, second: OHLC): boolean;

/**
 * Returns true if the pattern is a Tweezers Bottom (bullish reversal)
 */
export function isTweezersBottom(first: OHLC, second: OHLC): boolean;

/**
 * Finds all Tweezers patterns in a series
 */
export function tweezers(dataArray: OHLC[]): number[];

/**
 * Finds all Tweezers Top patterns in a series
 */
export function tweezersTop(dataArray: OHLC[]): number[];

/**
 * Finds all Tweezers Bottom patterns in a series
 */
export function tweezersBottom(dataArray: OHLC[]): number[];

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
  options?: { strict?: boolean; trendContext?: TrendContextOptions },
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
   * Filter pattern results by minimum confidence.
   * @param minConfidence Minimum confidence threshold (0–1). Defaults to 0.5.
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

// ========== Streaming API ==========

/**
 * Streaming options interface
 */
export interface StreamOptions {
  patterns?: string[] | string | null;
  chunkSize?: number;
  onMatch?: (match: PatternMatch) => void;
  onProgress?: (progress: {
    processed: number;
    matchesFound: number;
    complete?: boolean;
  }) => void;
  enrichMetadata?: boolean;
  strict?: boolean;
}

/**
 * Stream processor interface
 */
export interface StreamProcessor {
  /** Throws if called after `end()`; call `reset()` to reuse the stream. */
  process(chunk: OHLC[]): void;
  /**
   * Drains the buffer and finalizes the stream. Idempotent: later calls return
   * the same summary without re-emitting matches or firing `onProgress` again.
   *
   * `totalProcessed` counts distinct candles consumed, excluding the overlap
   * that is re-scanned at each chunk boundary. `patternsDetected` is the number
   * of pattern *detectors* that were active, not the number of matches found.
   */
  end(): { totalProcessed: number; patternsDetected: number };
  reset(): void;
}

/**
 * Streaming system namespace
 */
export const streaming: {
  /**
   * Create a streaming pattern detector for processing large datasets in chunks
   */
  createStream: (options?: StreamOptions) => StreamProcessor;

  /**
   * Helper function to process large dataset in streaming fashion
   */
  processLargeDataset: (
    data: OHLC[],
    options?: StreamOptions,
  ) => PatternMatch[];
};
