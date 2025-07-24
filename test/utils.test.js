const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const utils = require('../src/utils.js');

describe('utils', () => {
  it('bodyLen: returns absolute body length', () => {
    assert.equal(utils.bodyLen({ open: 10, close: 15 }), 5);
    assert.equal(utils.bodyLen({ open: 15, close: 10 }), 5);
  });
  it('wickLen: returns correct upper shadow', () => {
    assert.equal(utils.wickLen({ open: 10, high: 20, close: 15 }), 5);
    assert.equal(utils.wickLen({ open: 20, high: 25, close: 15 }), 5);
  });
  it('tailLen: returns correct lower shadow', () => {
    assert.equal(utils.tailLen({ open: 10, low: 5, close: 15 }), 5);
    assert.equal(utils.tailLen({ open: 20, low: 10, close: 15 }), 5);
  });
  it('bodyEnds: returns correct top and bottom', () => {
    assert.deepStrictEqual(utils.bodyEnds({ open: 10, close: 15 }), { bottom: 10, top: 15 });
    assert.deepStrictEqual(utils.bodyEnds({ open: 15, close: 10 }), { bottom: 10, top: 15 });
  });
  it('isBullish: detects bullish candle', () => {
    assert.equal(utils.isBullish({ open: 10, close: 15 }), true);
    assert.equal(utils.isBullish({ open: 15, close: 10 }), false);
  });
  it('isBearish: detects bearish candle', () => {
    assert.equal(utils.isBearish({ open: 10, close: 15 }), false);
    assert.equal(utils.isBearish({ open: 15, close: 10 }), true);
  });
  it('hasGapUp: detects upward gap', () => {
    const prev = { open: 10, close: 15 };
    const curr = { open: 20, close: 25 };
    assert.equal(utils.hasGapUp(prev, curr), true);
    const curr2 = { open: 14, close: 16 };
    assert.equal(utils.hasGapUp(prev, curr2), false);
  });
  it('hasGapDown: detects downward gap', () => {
    const prev = { open: 20, close: 25 };
    const curr = { open: 10, close: 15 };
    assert.equal(utils.hasGapDown(prev, curr), true);
    const curr2 = { open: 19, close: 21 };
    assert.equal(utils.hasGapDown(prev, curr2), false);
  });
  it('findPattern: finds pattern indices', () => {
    const arr = [
      { open: 10, close: 15 },
      { open: 15, close: 10 },
      { open: 10, close: 15 },
      { open: 15, close: 10 },
    ];
    // Find bullish candles
    const indices = utils.findPattern(arr, utils.isBullish);
    assert.deepStrictEqual(indices, [0, 2]);
  });
}); 