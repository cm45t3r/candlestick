/* Bullish kicker boolean detection. */

const candlestick = require('../index');

// Market data: previous and current ticks.
const previous = {
    ticker: 'CSCO',
    date: '2016-06-27',
    open: 27.48,
    high: 27.55,
    low: 27.13,
    close: 27.31
};

const current = {
    ticker: 'CSCO',
    date: '2016-06-28',
    open: 27.55,
    high: 27.85,
    low: 27.50,
    close: 27.79
};

const check = candlestick.isBullishKicker(previous, current);
console.log(`Bullish kicker? ${check}`); // true