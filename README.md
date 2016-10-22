# Candlestick

[![Build Status](https://travis-ci.org/Trendz/candlestick.svg?branch=master)](https://travis-ci.org/Trendz/candlestick)

A [node.js](http://nodejs.org) library for candlestick pattern detection. It is written in pure javascript and solves the need for node-gyp builds.


## Installation

To install the most recent release from npm, run:

	npm install candlestick


## Supported functions

* isBullishKicker(previous, current)
* isBearishKicker(previous, current)
* bullishKicker(dataArray)
* bearishKicker(dataArray)


## Examples

### Single pair functions

``` js
const cs = require('candlestick');

// Market data: previous and current open and close positions
const prev = { ticker: 'ORCL', date: '2016-09-15', open: 40.18, close: 40.86 };
const curr = { ticker: 'ORCL', date: '2016-09-16', open: 39.61, close: 38.92 };

console.log(cs.isBullishKicker(prev, curr)); // false
console.log(cs.isBearishKicker(prev, curr)); // true
```

## Find pattern in series
``` js
const cs = require('candlestick');

// Market data: array of open and close positions
const data = [{ ticker: 'ORCL', date: '2016-09-01', open: 40.18, close: 40.86 }, 
			  { ... }, { ... }, ..., { ... }];

let result = cs.bearishKicker(data);
// Returns a filtered array where bearish kicker happened.
// result: [{ ticker: 'ORCL', date: '2016-09-08', ... }, { ticker: 'ORCL', date: '2016-09-16', ... }]
```


## Running tests

	npm test


## Contributing

You are welcome to contribute to this library creating issues and pull requests.

## Licence

This project is licensed under the MIT license. See the [LICENSE](https://github.com/Trendz/candlestick/blob/master/LICENSE) file for more info.
