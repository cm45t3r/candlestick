// contextFit.js
// Derives, for a given pattern's metadata, which preceding trend direction
// the pattern actually expects — and scores how well a measured trend value
// matches that expectation. Implements the core of
// https://github.com/cm45t3r/candlestick/issues/95.
//
// Key insight: a pattern's `direction` (bullish/bearish) is the direction of
// the SIGNAL it produces, not necessarily the direction of the trend that
// should precede it:
// - reversal patterns expect the OPPOSITE preceding trend (e.g. `hammer` is
//   a bullish-reversal signal, so it expects a preceding DOWNtrend; the
//   identical candle shape after an UPtrend is `hangingMan`, a bearish
//   signal, not a hammer — see the worked example in #95).
// - continuation patterns expect the SAME preceding trend (e.g.
//   `bullishMarubozu` confirms an ongoing uptrend).
// - `neutral` direction/type patterns (doji, spinningTop, plain marubozu)
//   have no trend expectation at all.

const DEFAULT_SENSITIVITY = 5;

/**
 * @param {{type?: string, direction?: string}} [metadata] - Pattern metadata, e.g. from `patternMetadata.getPatternMetadata`.
 * @return {number} `1` (expects a preceding uptrend), `-1` (expects a preceding downtrend), or `0` (no expectation, e.g. `direction: "neutral"` or unknown pattern/type).
 */
function expectedTrendDirection(metadata) {
  if (!metadata || metadata.direction === "neutral" || !metadata.direction) {
    return 0;
  }
  const signalSign = metadata.direction === "bullish" ? 1 : -1;
  if (metadata.type === "reversal") return -signalSign;
  if (metadata.type === "continuation") return signalSign;
  return 0;
}

/**
 * Scores how well a measured trend value matches a pattern's expected
 * preceding trend direction. `1` = fully matches expectation, `0` = fully
 * contradicts it, `0.5` = neutral (no measurable trend, or no expectation
 * to begin with). Never penalizes missing data: absence of a measurable
 * trend (e.g. not enough history) resolves to `1` (no adjustment), the same
 * fail-safe philosophy as #96's gap-significance threshold, applied in the
 * direction that's safe here — "don't understate confidence when we simply
 * don't know the context."
 * @param {number} measuredTrend - Signed fraction from a trend series (e.g. `trend.js`), positive = uptrend, negative = downtrend.
 * @param {number} expectedDirection - `1`, `-1`, or `0`, from `expectedTrendDirection`.
 * @param {number} [sensitivity=5] - Higher values saturate to 0/1 faster for a given trend magnitude. `0.5 + sensitivity * (expectedDirection * measuredTrend)`, clamped to `[0, 1]`.
 * @return {number} Between 0 and 1.
 */
function computeContextFit(
  measuredTrend,
  expectedDirection,
  sensitivity = DEFAULT_SENSITIVITY,
) {
  if (expectedDirection === 0) return 1;
  if (
    measuredTrend === undefined ||
    measuredTrend === null ||
    Number.isNaN(measuredTrend)
  ) {
    return 1;
  }
  const alignment = expectedDirection * measuredTrend;
  return Math.min(1, Math.max(0, 0.5 + sensitivity * alignment));
}

module.exports = {
  expectedTrendDirection,
  computeContextFit,
  DEFAULT_SENSITIVITY,
};
