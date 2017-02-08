/* Bullish harami boolean detection. */

const candlestick = require('../index');

// Market data: previous and current ticks.
const previous = {
    ticker: 'GE',
    date: '2016-09-29',
    open: 29.81,
    high: 30.10,
    low: 29.44,
    close: 29.53
};

const current = {
    ticker: 'GE',
    date: '2016-09-30',
    open: 29.60,
    high: 29.85,
    low: 29.58,
    close: 29.62
};

const check = candlestick.isBullishHarami(previous, current);
console.log(`Bullish harami? ${check}`); // true