const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const hammer = require('../src/hammer.js');

describe('hammer', () => {
  it('isHammer: detects a hammer', () => {
    // Standard hammer: body in upper third, long lower shadow, small upper shadow
    const candle = { open: 28, high: 30, low: 20, close: 29 };
    assert.equal(hammer.isHammer(candle), true);
  });
  it('isHammer: rejects non-hammer', () => {
    // Not a hammer: body not in upper third, or lower shadow not long enough
    const candle = { open: 10, high: 15, low: 9, close: 14 };
    assert.equal(hammer.isHammer(candle), false);
  });
  it('isBullishHammer: detects bullish hammer', () => {
    const candle = { open: 28, high: 30, low: 20, close: 29.5 };
    assert.equal(hammer.isBullishHammer(candle), true);
  });
  it('isBearishHammer: detects bearish hammer', () => {
    const candle = { open: 29.5, high: 30, low: 20, close: 28 };
    assert.equal(hammer.isBearishHammer(candle), true);
  });
  it('hammer: finds hammers in array', () => {
    const arr = [
      { open: 28, high: 30, low: 20, close: 29 }, // hammer
      { open: 10, high: 15, low: 9, close: 14 }, // not hammer
      { open: 29.5, high: 30, low: 20, close: 28 }, // hammer
    ];
    assert.deepStrictEqual(hammer.hammer(arr), [0, 2]);
  });
  it('bullishHammer: finds bullish hammers in array', () => {
    const arr = [
      { open: 28, high: 30, low: 20, close: 29.5 }, // bullish hammer
      { open: 29.5, high: 30, low: 20, close: 28 }, // bearish hammer
    ];
    assert.deepStrictEqual(hammer.bullishHammer(arr), [0]);
  });
  it('bearishHammer: finds bearish hammers in array', () => {
    const arr = [
      { open: 28, high: 30, low: 20, close: 29.5 }, // bullish hammer
      { open: 29.5, high: 30, low: 20, close: 28 }, // bearish hammer
    ];
    assert.deepStrictEqual(hammer.bearishHammer(arr), [1]);
  });
}); 