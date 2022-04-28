# Candlestick

[![Build Status](https://api.travis-ci.org/cm45t3r/candlestick.svg?branch=master)](https://travis-ci.com/cm45t3r/candlestick)
[![npm version](https://badge.fury.io/js/candlestick.svg)](https://badge.fury.io/js/candlestick)

A JavaScript library for candlestick pattern detection. Easy to use and solves the need for node-gyp builds.


## Installation

To use the most recent release in your project:

  npm install --save candlestick


## Available functions

**Boolean pattern detection**

* `isHammer(candlestick)`
* `isInvertedHammer(candlestick)`
* `isBullishHammer(candlestick)`
* `isBearishHammer(candlestick)`
* `isBullishInvertedHammer(candlestick)`
* `isBearishInvertedHammer(candlestick)`
* `isHangingMan(previous, current)`
* `isShootingStar(previous, current)`
* `isBullishEngulfing(previous, current)`
* `isBearishEngulfing(previous, current)`
* `isBullishHarami(previous, current)`
* `isBearishHarami(previous, current)`
* `isBullishKicker(previous, current)`
* `isBearishKicker(previous, current)`


**Search patterns in arrays**

* `hammer(dataArray)`
* `invertedHammer(dataArray)`
* `bullishHammer(dataArray)`
* `bearishHammer(dataArray)`
* `bullishInvertedHammer(dataArray)`
* `bearishInvertedHammer(dataArray)`
* `hangingMan(dataArray)`
* `shootingStar(dataArray)`
* `bullishEngulfing(dataArray)`
* `bearishEngulfing(dataArray)`
* `bullishHarami(dataArray)`
* `bearishHarami(dataArray)`
* `bullishKicker(dataArray)`
* `bearishKicker(dataArray)`

`previous` and `current` are OHLC (Open, High, Low, Close) objects:

``` js
{
  ...
  open: Number,   // security's opening price
  high: Number,   // security's highest price
  low: Number,    // security's lowest price
  close: Number   // security's closing price
}
```

`dataArray` is an array of OHLC objects like `previous` or `current`.

**Note:** OHLC objects can have more fields and does not affect the final result.


## Examples

## Boolean detection
Use two OHLCs to assess the pattern:

``` js
const cs = require('candlestick');

// Market data: previous and current ticks
const prev = {
  security: 'ORCL',
  date: '2016-09-15',
  open: 40.18,
  high: 41.03,
  low: 40.09,
  close: 40.86
};

const curr = {
  security: 'ORCL',
  date: '2016-09-16',
  open: 39.61,
  high: 39.35,
  low: 38.71,
  close: 38.92
};

console.log(cs.isBullishKicker(prev, curr)); // false
console.log(cs.isBearishKicker(prev, curr)); // true
```

## Finding patterns in series
Find the points in a dataset where the pattern occurs:

``` js
const cs = require('candlestick');

// Market data: array of ticks
const data = [
  {
    security: 'GE',
    date: '2016-02-01',
    open: 29.01,
    high: 29.03,
    low: 28.56,
    close: 28.64
  },
  { ... },
  { ... },
  ...
  { ... }
];

console.log(cs.shootingStar(data));
// result: [{ security: 'GE', date: '2016-02-10', ... }, { security: 'GE', date: '2016-07-11', ... }]
```


## Running tests

  npm test


## Contributing

You are welcome to contribute to this library creating new issues or pull requests.


## Licence

This project is licensed under the MIT license. See the [LICENSE](https://github.com/cm45t3r/candlestick/blob/master/LICENSE) file for more info.
