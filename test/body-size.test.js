/*
 * Copyright (C) 2016-present cm45t3r.
 * MIT License.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const candlestick = require('../index.js');

describe('bodySize()', () => {
  it('should be NaN if open or close are NaN', () => {
    assert.equal(NaN, candlestick.bodySize({ close: 998.12, open: NaN }));
    assert.equal(NaN, candlestick.bodySize({ open: 388.34, close: NaN }));
  });

  it('should be Infinity if open or close are Infinity', () => {
    assert.equal(Infinity, candlestick.bodySize({ close: 321.07, open: Infinity }));
    assert.equal(Infinity, candlestick.bodySize({ open: 103.83, close: Infinity }));
  });

  it('should be 0 if open = close', () => {
    assert.equal(0, candlestick.bodySize({ close: 693.52, open: 693.52 }));
  });
});