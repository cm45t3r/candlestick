# Candlestick

[![Build Status](https://travis-ci.org/Trendz/candlestick.svg?branch=master)](https://travis-ci.org/Trendz/candlestick)
[![npm version](https://badge.fury.io/js/candlestick.svg)](https://badge.fury.io/js/candlestick)

A [node.js](http://nodejs.org) library for candlestick pattern detection. It is written in pure javascript and solves the need for node-gyp builds.


## Installation

To install the most recent release from npm, run:

	npm install candlestick


## Available functions

* `isBullishKicker(previous, current)`
* `isBearishKicker(previous, current)`
* `isShootingStar(previous, current)`
* `bullishKicker(dataArray)`
* `bearishKicker(dataArray)`
* `shootingStar(dataArray)`

Mandatory fields of `previous` and `current` are:

``` js
{
	...
	open: Number,	// security's opening price
	high: Number,	// security's highest price
	low: Number,	// security's lowest price 
	close: Number	// security's closing price
}
```

Parameter `dataArray` is an array of OHLC objects like `previous` or `current`.


## Examples

## Boolean detection
Use two OHLCs to assess the pattern:

``` js
const cs = require('candlestick');

// Market data: previous and current ticks
const prev = {
	ticker: 'ORCL',
	date: '2016-09-15',
	open: 40.18,
	high: 41.03,
	low: 40.09,
	close: 40.86
};

const curr = {
	ticker: 'ORCL',
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
Get the points in a dataset where the pattern was found:

``` js
const cs = require('candlestick');

// Market data: array of ticks
const data = [
	{
		ticker: 'GE',
		date: '2016-02-01',
		open: 29.01,
		high: 29.03,
		low: 28.56,
		close: 28.64
	},
	{ ... },
	{ ... },

	...
];

console.log(cs.shootingStar(data));
// result: [{ ticker: 'GE', date: '2016-02-10', ... }, { ticker: 'ORCL', date: '2016-07-11', ... }]
```


## Running tests

	npm test


## Contributing

You are welcome to contribute to this library creating issues and pull requests.

## Licence

This project is licensed under the MIT license. See the [LICENSE](https://github.com/Trendz/candlestick/blob/master/LICENSE) file for more info.
