/* Bearish kicker boolean detection. */

const candlestick = require('../index');

// Market data: previous and current ticks.
const previous = {
    ticker: 'ORCL',
    date: '2016-06-23',
    open: 40.40,
    high: 40.87,
    low: 40.26,
    close: 40.83
};

const current = {
    ticker: 'ORCL',
    date: '2016-06-24',
    open: 39.38,
    high: 39.89,
    low: 39.02,
    close: 39.23
};

const check = candlestick.isBearishKicker(previous, current);
console.log(`Bearish kicker? ${check}`); // true