// volatility.js
// Built-in volatility measures for the gap-significance threshold proposed in
// https://github.com/cm45t3r/candlestick/issues/96. All measures are expressed
// as a fraction of price (e.g. 0.015 = 1.5%), not raw price units, so they are
// directly comparable to each other and to a plain percentage gap regardless
// of an instrument's price level.

const DEFAULT_PERIOD = 14;
const DEFAULT_PERCENTILE_QUANTILE = 0.9;

/**
 * True Range (Wilder, 1978) for a single candle relative to the previous close.
 * @param {Object} previous - { close }
 * @param {Object} current - { high, low }
 * @return {number}
 */
function trueRange(previous, current) {
  return Math.max(
    current.high - current.low,
    Math.abs(current.high - previous.close),
    Math.abs(current.low - previous.close),
  );
}

/**
 * Daily close-to-close percentage return.
 * @param {Object} previous - { close }
 * @param {Object} current - { close }
 * @return {number}
 */
function pctReturn(previous, current) {
  return (current.close - previous.close) / previous.close;
}

function rollingMean(values, period) {
  return values.map((_, index) => {
    if (index < period) return NaN;
    let sum = 0;
    for (let i = index - period + 1; i <= index; i += 1) {
      sum += values[i];
    }
    return sum / period;
  });
}

function rollingStdDev(values, period) {
  return values.map((_, index) => {
    if (index < period) return NaN;
    const window = values.slice(index - period + 1, index + 1);
    const mean = window.reduce((sum, v) => sum + v, 0) / period;
    const variance =
      window.reduce((sum, v) => sum + (v - mean) ** 2, 0) / period;
    return Math.sqrt(variance);
  });
}

function rollingQuantile(values, period, quantile) {
  return values.map((_, index) => {
    if (index < period) return NaN;
    const window = values
      .slice(index - period + 1, index + 1)
      .slice()
      .sort((a, b) => a - b);
    const position = quantile * (window.length - 1);
    const lower = Math.floor(position);
    const upper = Math.ceil(position);
    if (lower === upper) return window[lower];
    return window[lower] + (window[upper] - window[lower]) * (position - lower);
  });
}

/**
 * Average True Range expressed as a percentage of each candle's close
 * (ATR / close, sometimes called "ATRP"), so it's on the same fractional
 * scale as `stddev`/`percentile` and comparable across price levels.
 * @param {Array<Object>} candles
 * @param {number} [period=14]
 * @return {Array<number>} One value per candle; `NaN` where there isn't enough history.
 */
function atrSeries(candles, period = DEFAULT_PERIOD) {
  const trueRanges = candles.map((candle, index) =>
    index === 0 ? NaN : trueRange(candles[index - 1], candle),
  );
  const atr = rollingMean(trueRanges, period);
  return atr.map((value, index) => value / candles[index].close);
}

/**
 * Standard deviation of daily close-to-close percentage returns.
 * @param {Array<Object>} candles
 * @param {number} [period=14]
 * @return {Array<number>} One value per candle; `NaN` where there isn't enough history.
 */
function stddevSeries(candles, period = DEFAULT_PERIOD) {
  const returns = candles.map((candle, index) =>
    index === 0 ? NaN : pctReturn(candles[index - 1], candle),
  );
  return rollingStdDev(returns, period);
}

/**
 * Historical percentile (default: 90th) of this instrument's own past
 * close-to-close percentage-return magnitudes, used as the "volatility unit"
 * a gap is compared against (e.g. `minGapVol: 1` means "at least as large as
 * the 90th percentile of this ticker's recent daily moves").
 * @param {Array<Object>} candles
 * @param {number} [period=14]
 * @param {number} [quantile=0.9] - Between 0 and 1.
 * @return {Array<number>} One value per candle; `NaN` where there isn't enough history.
 */
function percentileSeries(
  candles,
  period = DEFAULT_PERIOD,
  quantile = DEFAULT_PERCENTILE_QUANTILE,
) {
  const magnitudes = candles.map((candle, index) =>
    index === 0 ? NaN : Math.abs(pctReturn(candles[index - 1], candle)),
  );
  return rollingQuantile(magnitudes, period, quantile);
}

module.exports = {
  atrSeries,
  stddevSeries,
  percentileSeries,
  DEFAULT_PERIOD,
  DEFAULT_PERCENTILE_QUANTILE,
};
