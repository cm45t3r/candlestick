// trend.js
// Built-in trend measures for the trend-context confidence adjustment
// proposed in https://github.com/cm45t3r/candlestick/issues/95. All measures
// are signed fractions (positive = uptrend, negative = downtrend), so they
// are directly comparable to each other and to the pattern's expected
// direction regardless of price level. Mirrors the style of `volatility.js`.

const DEFAULT_PERIOD = 10;

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

/**
 * Simple percentage change from `period` candles ago to the current candle's close.
 * Simplest trend measure: no smoothing, sensitive to the two endpoint candles.
 * @param {Array<Object>} candles
 * @param {number} [period=10]
 * @return {Array<number>} One value per candle; `NaN` where there isn't enough history.
 */
function pctChangeSeries(candles, period = DEFAULT_PERIOD) {
  return candles.map((candle, index) => {
    if (index < period) return NaN;
    const past = candles[index - period].close;
    return (candle.close - past) / past;
  });
}

/**
 * One-step percentage slope of a Simple Moving Average of `period` closes:
 * `(sma[i] - sma[i-1]) / sma[i-1]`. Smoother/less noisy than `pctChangeSeries`,
 * at the cost of needing one extra candle of history and reacting slightly later.
 * @param {Array<Object>} candles
 * @param {number} [period=10]
 * @return {Array<number>} One value per candle; `NaN` where there isn't enough history.
 */
function smaSlopeSeries(candles, period = DEFAULT_PERIOD) {
  const closes = candles.map((c) => c.close);
  const sma = rollingMean(closes, period);
  return sma.map((value, index) => {
    if (index === 0 || Number.isNaN(value) || Number.isNaN(sma[index - 1])) {
      return NaN;
    }
    return (value - sma[index - 1]) / sma[index - 1];
  });
}

/**
 * One-step percentage slope of an Exponential Moving Average of `period`
 * closes (seeded with the SMA of the first `period` closes). More responsive
 * to recent candles than `smaSlopeSeries`, with less lag.
 * @param {Array<Object>} candles
 * @param {number} [period=10]
 * @return {Array<number>} One value per candle; `NaN` where there isn't enough history.
 */
function emaSlopeSeries(candles, period = DEFAULT_PERIOD) {
  const closes = candles.map((c) => c.close);
  const multiplier = 2 / (period + 1);
  const ema = new Array(closes.length).fill(NaN);

  if (closes.length > period - 1) {
    let seedSum = 0;
    for (let i = 0; i < period; i += 1) {
      seedSum += closes[i];
    }
    ema[period - 1] = seedSum / period;
    for (let i = period; i < closes.length; i += 1) {
      ema[i] = closes[i] * multiplier + ema[i - 1] * (1 - multiplier);
    }
  }

  return ema.map((value, index) => {
    if (index === 0 || Number.isNaN(value) || Number.isNaN(ema[index - 1])) {
      return NaN;
    }
    return (value - ema[index - 1]) / ema[index - 1];
  });
}

module.exports = {
  pctChangeSeries,
  smaSlopeSeries,
  emaSlopeSeries,
  DEFAULT_PERIOD,
};
