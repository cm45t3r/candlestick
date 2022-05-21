/*
 * Copyright (C) 2016-present cm45t3r.
 * MIT License.
 */

process.env['private_function'] = true;

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const candlestick = require('../index.js');

describe.only('isValid()', () => {
  it('should be false if ohlc not a valid object', () => {
    assert.equal(false, candlestick.isValid(undefined));
    assert.equal(false, candlestick.isValid(null));
    assert.equal(false, candlestick.isValid(false));
    assert.equal(false, candlestick.isValid(true));
    assert.equal(false, candlestick.isValid(NaN));
    assert.equal(false, candlestick.isValid(Infinity));
    assert.equal(false, candlestick.isValid(0));
    assert.equal(false, candlestick.isValid(3n));
    assert.equal(false, candlestick.isValid(''));
    assert.equal(false, candlestick.isValid('0'));
    assert.equal(false, candlestick.isValid('bodySize'));
    assert.equal(false, candlestick.isValid(new Date()));
    assert.equal(false, candlestick.isValid([]));
    assert.equal(false, candlestick.isValid([0]));
    assert.equal(false, candlestick.isValid(new Int8Array()));
    assert.equal(false, candlestick.isValid(new Float64Array()));
    assert.equal(false, candlestick.isValid(new Set()));
    assert.equal(false, candlestick.isValid(new WeakSet()));
    assert.equal(false, candlestick.isValid(new Map()));
    assert.equal(false, candlestick.isValid(new WeakMap()));
    assert.equal(false, candlestick.isValid(Symbol()));
    assert.equal(false, candlestick.isValid(Promise.resolve()));
    assert.equal(false, candlestick.isValid(() => { }));
  });

  it('should be false if open is not a number or BigInt', () => {
    const close = 321.07;
    assert.equal(false, candlestick.bodySize({ close, open: undefined }));
    assert.equal(false, candlestick.bodySize({ close, open: null }));
    assert.equal(false, candlestick.bodySize({ close, open: false }));
    assert.equal(false, candlestick.bodySize({ close, open: true }));
    assert.equal(false, candlestick.bodySize({ close, open: 3n }));
    assert.equal(false, candlestick.bodySize({ close, open: '' }));
    assert.equal(false, candlestick.bodySize({ close, open: '0' }));
    assert.equal(false, candlestick.bodySize({ close, open: 'bodySize' }));
    assert.equal(false, candlestick.bodySize({ close, open: new Date() }));
    assert.equal(false, candlestick.bodySize({ close, open: [] }));
    assert.equal(false, candlestick.bodySize({ close, open: [0] }));
    assert.equal(false, candlestick.bodySize({ close, open: new Int8Array() }));
    assert.equal(false, candlestick.bodySize({ close, open: new Float64Array() }));
    assert.equal(false, candlestick.bodySize({ close, open: new Set() }));
    assert.equal(false, candlestick.bodySize({ close, open: new WeakSet() }));
    assert.equal(false, candlestick.bodySize({ close, open: new Map() }));
    assert.equal(false, candlestick.bodySize({ close, open: new WeakMap() }));
    assert.equal(false, candlestick.bodySize({ close, open: Symbol() }));
    assert.equal(false, candlestick.bodySize({ close, open: Promise.resolve() }));
    assert.equal(false, candlestick.bodySize({ close, open: () => { } }));
  });

  it('should be NaN if close is not a number or BigInt', () => {
    const open = 124.89;
    assert.equal(false, candlestick.bodySize({ open, close: undefined }));
    assert.equal(false, candlestick.bodySize({ open, close: null })); 
    assert.equal(false, candlestick.bodySize({ open, close: false }));
    assert.equal(false, candlestick.bodySize({ open, close: true }));
    assert.equal(false, candlestick.bodySize({ open, close: '' }));
    assert.equal(false, candlestick.bodySize({ open, close: '0' }));
    assert.equal(false, candlestick.bodySize({ open, close: 'bodySize' }));
    assert.equal(false, candlestick.bodySize({ open, close: new Date() }));
    assert.equal(false, candlestick.bodySize({ open, close: [] }));
    assert.equal(false, candlestick.bodySize({ open, close: [0] }));
    assert.equal(false, candlestick.bodySize({ open, close: new Set() }));
    assert.equal(false, candlestick.bodySize({ open, close: new WeakSet() }));
    assert.equal(false, candlestick.bodySize({ open, close: new Map() }));
    assert.equal(false, candlestick.bodySize({ open, close: new WeakMap() }));
    assert.equal(false, candlestick.bodySize({ open, close: Symbol() }));
    assert.equal(false, candlestick.bodySize({ open, close: Promise.resolve() }));
    assert.equal(false, candlestick.bodySize({ open, close: () => { } }));
  });

  
});