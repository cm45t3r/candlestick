const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const engulfing = require('../src/engulfing.js');

describe('engulfing', () => {
  it('isEngulfed: detects engulfed body', () => {
    const prev = { open: 10, close: 12 };
    const curr = { open: 9, close: 13 };
    assert.equal(engulfing.isEngulfed(prev, curr), true);
  });
  it('isEngulfed: rejects non-engulfed body', () => {
    const prev = { open: 10, close: 12 };
    const curr = { open: 11, close: 13 };
    assert.equal(engulfing.isEngulfed(prev, curr), false);
  });
  it('isBullishEngulfing: detects bullish engulfing', () => {
    const prev = { open: 12, high: 13, low: 10, close: 10 };
    const curr = { open: 9, high: 14, low: 8, close: 15 };
    assert.equal(engulfing.isBullishEngulfing(prev, curr), true);
  });
  it('isBearishEngulfing: detects bearish engulfing', () => {
    const prev = { open: 10, high: 14, low: 8, close: 15 };
    const curr = { open: 15, high: 16, low: 9, close: 9 };
    assert.equal(engulfing.isBearishEngulfing(prev, curr), true);
  });
  it('bullishEngulfing: finds bullish engulfings in array', () => {
    const arr = [
      { open: 12, high: 13, low: 10, close: 10 },
      { open: 9, high: 14, low: 8, close: 15 }, // bullish engulfing
      { open: 10, high: 14, low: 8, close: 15 },
      { open: 15, high: 16, low: 9, close: 9 },
    ];
    assert.deepStrictEqual(engulfing.bullishEngulfing(arr), [0]);
  });
  it('bearishEngulfing: finds bearish engulfings in array', () => {
    const arr = [
      { open: 10, high: 14, low: 8, close: 15 },
      { open: 15, high: 16, low: 9, close: 9 }, // bearish engulfing
      { open: 12, high: 13, low: 10, close: 10 },
      { open: 9, high: 14, low: 8, close: 15 },
    ];
    assert.deepStrictEqual(engulfing.bearishEngulfing(arr), [0]);
  });
}); 