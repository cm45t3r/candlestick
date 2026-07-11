// trendContext.js
// Wires the trend-measurement layer (`trend.js`), the shared resolution
// helper (`seriesResolver.js`, from #97), and the expected-direction scoring
// (`contextFit.js`) into `patternChain`'s optional `trendContext` option.
// See https://github.com/cm45t3r/candlestick/issues/95.

const { resolveSeries } = require("./seriesResolver.js");
const {
  pctChangeSeries,
  smaSlopeSeries,
  emaSlopeSeries,
  DEFAULT_PERIOD,
} = require("./trend.js");
const { getPatternMetadata } = require("./patternMetadata.js");
const {
  expectedTrendDirection,
  computeContextFit,
} = require("./contextFit.js");

const TREND_BUILTINS = {
  "sma-slope": smaSlopeSeries,
  "ema-slope": emaSlopeSeries,
  "pct-change": pctChangeSeries,
};

/**
 * @typedef {Object} TrendContextOptions
 * @property {"sma-slope"|"ema-slope"|"pct-change"} [trendMethod="sma-slope"] - Built-in trend measure used when `externalTrend`/`trendFn` aren't given. See `trend.js`.
 * @property {number} [trendPeriod=10] - Lookback window (in candles) for the built-in methods.
 * @property {Array<number>} [externalTrend] - Precomputed trend series (one signed value per candle, same order as the input array). Takes precedence over `trendMethod`.
 * @property {function(Array<Object>, number): number} [trendFn] - Callback invoked per candle index to resolve trend lazily. Takes precedence over both `externalTrend` and `trendMethod`.
 * @property {number} [contextSensitivity=5] - See `contextFit.js`.
 * @property {boolean} [resolveConflicts=false] - When two matches with opposite `direction` metadata share at least one candle, drop whichever has the lower `contextFit` (ties keep both). Default `false`: surface every match and let the caller filter/rank using `contextFit`.
 */

/**
 * Resolves the per-candle trend series for `applyTrendContext`.
 * @param {Array<Object>} candles
 * @param {TrendContextOptions} options
 * @return {Array<number>}
 */
function resolveTrendSeries(candles, options) {
  const { trendMethod, trendPeriod, externalTrend, trendFn } = options;
  return resolveSeries(candles, {
    builtins: TREND_BUILTINS,
    method: trendMethod || "sma-slope",
    period: trendPeriod ?? DEFAULT_PERIOD,
    external: externalTrend,
    fn: trendFn,
  });
}

function rangeOf(result) {
  return [result.index, result.index + result.match.length - 1];
}

function rangesOverlap(a, b) {
  return a[0] <= b[1] && b[0] <= a[1];
}

/**
 * Drops the lower-`contextFit` match whenever two matches with opposite
 * `direction` metadata share at least one candle. Ties (equal `contextFit`,
 * including when neither pattern has trend metadata to compare) keep both.
 * @param {Array<Object>} results - `patternChain` results, each already carrying `contextFit`.
 * @return {Array<Object>}
 */
function filterConflicts(results) {
  const drop = new Set();
  for (let i = 0; i < results.length; i += 1) {
    const a = results[i];
    const metaA = getPatternMetadata(a.pattern);
    if (!metaA || metaA.direction === "neutral") continue;

    for (let j = i + 1; j < results.length; j += 1) {
      if (drop.has(j)) continue;
      const b = results[j];
      const metaB = getPatternMetadata(b.pattern);
      if (!metaB || metaB.direction === "neutral") continue;
      if (metaA.direction === metaB.direction) continue;
      if (!rangesOverlap(rangeOf(a), rangeOf(b))) continue;

      if (a.contextFit > b.contextFit) {
        drop.add(j);
      } else if (b.contextFit > a.contextFit) {
        drop.add(i);
      }
    }
  }
  return results.filter((_, index) => !drop.has(index));
}

/**
 * Attaches `trendContext` (a coarse label) and `contextFit` (0-1) to each
 * `patternChain` result, based on the trend measured just before the match
 * begins (never at/after its own start, to avoid the match's own candles
 * biasing the context they're being evaluated against). Optionally drops
 * the weaker side of same-candle, opposite-direction conflicts (see
 * `resolveConflicts`).
 * @param {Array<Object>} candles - Precomputed candle series.
 * @param {Array<Object>} results - `patternChain` results (mutated in place with `trendContext`/`contextFit`, then optionally filtered).
 * @param {TrendContextOptions} options
 * @return {Array<Object>}
 */
function applyTrendContext(candles, results, options) {
  const { contextSensitivity, resolveConflicts = false } = options;
  const trendSeries = resolveTrendSeries(candles, options);

  for (const result of results) {
    const contextIndex = result.index - 1;
    const measuredTrend =
      contextIndex >= 0 ? trendSeries[contextIndex] : undefined;
    const metadata = getPatternMetadata(result.pattern);
    const expectedDirection = expectedTrendDirection(metadata);

    result.trendContext =
      measuredTrend === undefined || Number.isNaN(measuredTrend)
        ? undefined
        : measuredTrend > 0
          ? "uptrend"
          : measuredTrend < 0
            ? "downtrend"
            : "sideways";
    result.contextFit = computeContextFit(
      measuredTrend,
      expectedDirection,
      contextSensitivity,
    );
  }

  return resolveConflicts ? filterConflicts(results) : results;
}

module.exports = {
  applyTrendContext,
  resolveTrendSeries,
  filterConflicts,
  TREND_BUILTINS,
};
