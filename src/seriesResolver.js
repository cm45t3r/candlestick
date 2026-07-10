// seriesResolver.js
// Internal helper (not part of the public API) shared by any feature that
// needs to resolve a per-candle numeric series from one of three sources:
// a named built-in method, a caller-precomputed array, or a caller callback.
//
// Used by kicker.js's gap-significance threshold (`volMethod`/`externalVolatility`/
// `volatilityFn`) and intended for reuse by the trend-context work tracked in
// https://github.com/cm45t3r/candlestick/issues/95 (`trendMethod`/`externalTrend`/`trendFn`).
// See https://github.com/cm45t3r/candlestick/issues/97 for the design discussion.

/**
 * Resolves a per-candle numeric series from a callback, a precomputed array,
 * or a named built-in method, in that order of precedence.
 *
 * @param {Array<Object>} candles - Candle series the resolved values align with.
 * @param {Object} [options]
 * @param {Object<string, function(Array<Object>, number=): Array<number>>} [options.builtins] -
 *   Map of method name to a function `(candles, period) => number[]` producing one value per candle.
 * @param {string} [options.method] - Key into `builtins` to use when neither `external` nor `fn` is given.
 * @param {number} [options.period] - Forwarded as the second argument to the selected builtin.
 * @param {Array<number>} [options.external] - Precomputed series, one value per candle, same length/order as `candles`.
 * @param {function(Array<Object>, number): number} [options.fn] - Callback invoked once per candle index.
 * @return {Array<number>|null} Resolved series (may contain `NaN` for indices without enough history), or `null` if none of `fn`/`external`/`method` was provided.
 * @throws {RangeError} If `external` is provided with a length different from `candles.length`.
 * @throws {Error} If `method` is provided but not found in `builtins`.
 */
function resolveSeries(
  candles,
  { builtins = {}, method, period, external, fn } = {},
) {
  if (typeof fn === "function") {
    return candles.map((_, index) => fn(candles, index));
  }

  if (external !== undefined) {
    if (!Array.isArray(external) || external.length !== candles.length) {
      throw new RangeError(
        "external series must be an array with the same length as candles",
      );
    }
    return external;
  }

  if (method !== undefined) {
    const builtin = builtins[method];
    if (typeof builtin !== "function") {
      throw new Error(
        `Unknown method "${method}". Available methods: ${Object.keys(builtins).join(", ")}`,
      );
    }
    return builtin(candles, period);
  }

  return null;
}

module.exports = { resolveSeries };
