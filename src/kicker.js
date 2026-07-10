// kicker.js
// Kicker pattern logic extracted from candlestick.js

const {
  hasGapUp,
  hasGapDown,
  bodyEnds,
  findPattern,
  precomputeCandleProps,
  ensurePrecomputed,
} = require("./utils.js");
const { isHammer } = require("./hammer.js");
const { isInvertedHammer } = require("./invertedHammer.js");
const { resolveSeries } = require("./seriesResolver.js");
const {
  atrSeries,
  stddevSeries,
  percentileSeries,
  DEFAULT_PERIOD,
  DEFAULT_PERCENTILE_QUANTILE,
} = require("./volatility.js");

/**
 * @typedef {Object} GapThresholdOptions
 * @property {number} [minGapVol=0] - Minimum gap size required for a kicker to
 *   count, expressed as a multiple of the resolved volatility unit (or, when
 *   `volMethod` is `"fixed-pct"`, read directly as a fraction of the previous
 *   close, e.g. `0.005` = 0.5% — not a multiplier). `0` (default) preserves
 *   the pre-existing "any nonzero gap counts" behavior, fully backward compatible.
 * @property {"atr"|"stddev"|"percentile"|"fixed-pct"} [volMethod="atr"] - Built-in
 *   volatility measure used when `externalVolatility`/`volatilityFn` aren't given.
 *   See `volatility.js` for the definition of each. `"fixed-pct"` needs no
 *   history/lookback at all.
 * @property {number} [volPeriod=14] - Lookback window (in candles) for
 *   `"atr"`/`"stddev"`/`"percentile"`. Ignored for `"fixed-pct"`.
 * @property {number} [volPercentile=0.9] - Target quantile (0-1) used only by
 *   `volMethod: "percentile"`.
 * @property {Array<number>} [externalVolatility] - Precomputed volatility
 *   series (one value per candle, same order as the input array), expressed
 *   as a fraction of price, e.g. from a GARCH model fit externally. Takes
 *   precedence over `volMethod`.
 * @property {function(Array<Object>, number): number} [volatilityFn] - Callback
 *   invoked per candle index to resolve volatility lazily. Takes precedence
 *   over both `externalVolatility` and `volMethod`.
 * @property {number} [volatility] - Only meaningful when calling
 *   `isBullishKicker`/`isBearishKicker` directly on a single candle pair
 *   (which have no series context to resolve `volMethod` from): the
 *   already-resolved volatility value to compare the gap against.
 */

const VOLATILITY_BUILTINS = {
  atr: atrSeries,
  stddev: stddevSeries,
  percentile: percentileSeries,
};

/**
 * Resolves a per-candle volatility series for the whole array, or `null` when
 * gap-size filtering is disabled (`minGapVol <= 0`) or not needed (`"fixed-pct"`,
 * which compares directly against the previous close instead).
 * @param {Array<Object>} candles
 * @param {GapThresholdOptions} options
 * @return {Array<number>|null}
 */
function resolveVolatilitySeries(candles, options) {
  const {
    minGapVol = 0,
    volMethod,
    volPeriod,
    volPercentile,
    externalVolatility,
    volatilityFn,
  } = options;

  if (minGapVol <= 0 || volMethod === "fixed-pct") {
    return null;
  }

  const builtins = {
    ...VOLATILITY_BUILTINS,
    percentile: (candlesArg, period) =>
      percentileSeries(
        candlesArg,
        period,
        volPercentile ?? DEFAULT_PERCENTILE_QUANTILE,
      ),
  };

  return resolveSeries(candles, {
    builtins,
    method: volMethod || "atr",
    period: volPeriod ?? DEFAULT_PERIOD,
    external: externalVolatility,
    fn: volatilityFn,
  });
}

/**
 * Gap size as a fraction of the previous candle's close, for a gap-up
 * transition, measured body-to-body (consistent with `hasGapUp`).
 * @param {Object} previous
 * @param {Object} current
 * @return {number}
 */
function gapUpSizePct(previous, current) {
  return (bodyEnds(current).bottom - bodyEnds(previous).top) / previous.close;
}

/**
 * Gap size as a fraction of the previous candle's close, for a gap-down
 * transition, measured body-to-body (consistent with `hasGapDown`).
 * @param {Object} previous
 * @param {Object} current
 * @return {number}
 */
function gapDownSizePct(previous, current) {
  return (bodyEnds(previous).bottom - bodyEnds(current).top) / previous.close;
}

/**
 * Returns `true` if a (positive) gap size, expressed as a fraction of price,
 * clears the configured minimum. Fails safe (`false`) when a volatility-based
 * method is requested but no volatility value is available (e.g. not enough
 * history yet) — this never silently treats an unmeasurable gap as significant.
 * @param {number} gapSizePct
 * @param {GapThresholdOptions} options
 * @return {boolean}
 */
function isSignificantGap(gapSizePct, options) {
  const { minGapVol = 0, volMethod, volatility } = options;
  if (minGapVol <= 0) return true;
  if (volMethod === "fixed-pct") return gapSizePct >= minGapVol;
  if (
    volatility === undefined ||
    volatility === null ||
    Number.isNaN(volatility)
  ) {
    return false;
  }
  return gapSizePct >= minGapVol * volatility;
}

/**
 * Returns true if a bearish candle is followed by a bullish candle with a gap up (not a hammer or inverted hammer). (Bullish Kicker)
 * @param {Object} previous
 * @param {Object} current
 * @param {GapThresholdOptions} [options] - See `GapThresholdOptions`. Omit (or `minGapVol: 0`, the default) to preserve pre-existing behavior: any nonzero gap counts.
 * @return {boolean}
 */
function isBullishKicker(previous, current, options = {}) {
  let p = previous,
    c = current;
  if (p.isBearish === undefined || c.isBullish === undefined) {
    [p, c] = precomputeCandleProps([previous, current]);
  }
  return (
    p.isBearish &&
    c.isBullish &&
    hasGapUp(p, c) &&
    isSignificantGap(gapUpSizePct(p, c), options) &&
    !(isHammer(c) || isInvertedHammer(c))
  );
}

/**
 * Returns true if a bullish candle is followed by a bearish candle with a gap down (not a hammer or inverted hammer). (Bearish Kicker)
 * @param {Object} previous
 * @param {Object} current
 * @param {GapThresholdOptions} [options] - See `GapThresholdOptions`. Omit (or `minGapVol: 0`, the default) to preserve pre-existing behavior: any nonzero gap counts.
 * @return {boolean}
 */
function isBearishKicker(previous, current, options = {}) {
  let p = previous,
    c = current;
  if (p.isBullish === undefined || c.isBearish === undefined) {
    [p, c] = precomputeCandleProps([previous, current]);
  }
  return (
    p.isBullish &&
    c.isBearish &&
    hasGapDown(p, c) &&
    isSignificantGap(gapDownSizePct(p, c), options) &&
    !(isHammer(c) || isInvertedHammer(c))
  );
}

/**
 * Finds all Bullish Kicker patterns in a series.
 * @param {Array<Object>} dataArray
 * @param {GapThresholdOptions} [options] - Omit (or `minGapVol: 0`, the default) to preserve pre-existing behavior: any nonzero gap counts.
 * @return {Array<number>}
 */
function bullishKicker(dataArray, options = {}) {
  const candles = ensurePrecomputed(dataArray);
  const { minGapVol = 0 } = options;

  if (minGapVol <= 0) {
    return findPattern(candles, isBullishKicker);
  }

  const volatility = resolveVolatilitySeries(candles, options);
  const results = [];
  for (let i = 0; i < candles.length - 1; i += 1) {
    const pairOptions = {
      ...options,
      volatility: volatility ? volatility[i] : undefined,
    };
    if (isBullishKicker(candles[i], candles[i + 1], pairOptions)) {
      results.push(i);
    }
  }
  return results;
}

/**
 * Finds all Bearish Kicker patterns in a series.
 * @param {Array<Object>} dataArray
 * @param {GapThresholdOptions} [options] - Omit (or `minGapVol: 0`, the default) to preserve pre-existing behavior: any nonzero gap counts.
 * @return {Array<number>}
 */
function bearishKicker(dataArray, options = {}) {
  const candles = ensurePrecomputed(dataArray);
  const { minGapVol = 0 } = options;

  if (minGapVol <= 0) {
    return findPattern(candles, isBearishKicker);
  }

  const volatility = resolveVolatilitySeries(candles, options);
  const results = [];
  for (let i = 0; i < candles.length - 1; i += 1) {
    const pairOptions = {
      ...options,
      volatility: volatility ? volatility[i] : undefined,
    };
    if (isBearishKicker(candles[i], candles[i + 1], pairOptions)) {
      results.push(i);
    }
  }
  return results;
}

module.exports = {
  isBullishKicker,
  isBearishKicker,
  bullishKicker,
  bearishKicker,
};
