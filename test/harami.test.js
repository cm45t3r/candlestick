const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const harami = require('../src/harami.js');

describe('harami', () => {
  it('isBullishHarami: detects bullish harami', () => {
    const prev = { open: 12, high: 13, low: 10, close: 10 };
    const curr = { open: 9, high: 14, low: 8, close: 15 };
    assert.equal(harami.isBullishHarami(prev, curr), false); // not harami, engulfing
    const prev2 = { open: 12, high: 13, low: 10, close: 10 };
    const curr2 = { open: 11, high: 12, low: 10, close: 12 };
    assert.equal(harami.isBullishHarami(prev2, curr2), true);
  });
  it('isBearishHarami: detects bearish harami', () => {
    const prev = { open: 10, high: 14, low: 8, close: 15 };
    const curr = { open: 15, high: 16, low: 9, close: 9 };
    assert.equal(harami.isBearishHarami(prev, curr), false); // not harami, engulfing
    const prev2 = { open: 10, high: 14, low: 8, close: 15 };
    const curr2 = { open: 11, high: 13, low: 10, close: 10 };
    assert.equal(harami.isBearishHarami(prev2, curr2), true);
  });
  it('bullishHarami: finds bullish haramis in array', () => {
    const arr = [
      { open: 12, high: 13, low: 10, close: 10 },
      { open: 11, high: 12, low: 10, close: 12 }, // bullish harami
      { open: 10, high: 14, low: 8, close: 15 },
      { open: 11, high: 13, low: 10, close: 10 },
    ];
    assert.deepStrictEqual(harami.bullishHarami(arr), [0]);
  });
  it('bearishHarami: finds bearish haramis in array', () => {
    const arr = [
      { open: 10, high: 14, low: 8, close: 15 },
      { open: 11, high: 13, low: 10, close: 10 }, // bearish harami
      { open: 12, high: 13, low: 10, close: 10 },
      { open: 11, high: 12, low: 10, close: 12 },
    ];
    assert.deepStrictEqual(harami.bearishHarami(arr), [0]);
  });
}); 