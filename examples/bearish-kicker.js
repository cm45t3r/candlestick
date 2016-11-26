// Bearish kicker example.

const candlestick = require('../index');

// Market data
const tick0 = {
    ticker: 'ORCL',
    date: '2016-09-15',
    open: 40.18,
    high: 41.03,
    low: 40.09,
    close: 40.86
};

const tick1 = {
    ticker: 'ORCL',
    date: '2016-09-16',
    open: 39.61,
    high: 39.35,
    low: 38.71,
    close: 38.92
};

const check = candlestick.isBearishKicker(tick0, tick1);
console.log(`Bearish kicker? ${check}`); // true
