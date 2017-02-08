/* Bearish harami boolean detection. */

const candlestick = require('../index');

// Market data: previous and current ticks.
const previous = {
    ticker: 'F',
    date: '2016-09-12',
    open: 12.32,
    high: 12.77,
    low: 12.28,
    close: 12.70
};

const current = {
    ticker: 'F',
    date: '2016-09-13',
    open: 12.53,
    high: 12.68,
    low: 12.33,
    close: 12.38
};

const check = candlestick.isBearishHarami(previous, current);
console.log(`Bearish harami? ${check}`); // true