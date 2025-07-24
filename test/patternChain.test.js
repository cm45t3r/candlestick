const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { patternChain, allPatterns } = require('../src/patternChain.js');
const hammer = require('../src/hammer.js');
const doji = require('../src/doji.js');
const engulfing = require('../src/engulfing.js');
const utils = require('../src/utils.js');

describe('patternChain', () => {
  it('finds multiple patterns in a series', () => {
    const candles = [
      { open: 28, high: 30, low: 20, close: 29.5 }, // bullish hammer
      { open: 29.5, high: 30, low: 20, close: 28 }, // bearish hammer
      { open: 10, high: 15, low: 10, close: 10.4 }, // doji
      { open: 20, high: 25, low: 19, close: 24 }, // no pattern
    ];
    const results = patternChain(candles, [
      { name: 'bullishHammer', fn: hammer.bullishHammer },
      { name: 'bearishHammer', fn: hammer.bearishHammer },
      { name: 'doji', fn: doji.doji },
    ]);
    assert.deepStrictEqual(
      results.map(r => ({ index: r.index, pattern: r.pattern })),
      [
        { index: 0, pattern: 'bullishHammer' },
        { index: 1, pattern: 'bearishHammer' },
        { index: 2, pattern: 'doji' },
      ]
    );
    assert.deepStrictEqual(results[0].match, [candles[0]]);
    assert.deepStrictEqual(results[1].match, [candles[1]]);
    assert.deepStrictEqual(results[2].match, [candles[2]]);
  });

  it('returns empty array if no patterns found', () => {
    const candles = [
      { open: 10, high: 15, low: 10, close: 14 },
      { open: 15, high: 16, low: 15, close: 16 },
    ];
    const results = patternChain(candles, [
      { name: 'bullishHammer', fn: hammer.bullishHammer },
      { name: 'doji', fn: doji.doji },
    ]);
    assert.deepStrictEqual(results, []);
  });

  it('works with allPatterns (integration)', () => {
    const candles = [
      { open: 28, high: 30, low: 20, close: 29.5 }, // bullish hammer
      { open: 29.5, high: 30, low: 20, close: 28 }, // bearish hammer
      { open: 10, high: 15, low: 10, close: 10.4 }, // doji
    ];
    const results = patternChain(candles);
    // Should find at least one pattern for each candle
    const found = results.map(r => r.pattern);
    assert(found.includes('bullishHammer'));
    assert(found.includes('bearishHammer'));
    assert(found.includes('doji'));
  });

  it('finds multi-candle patterns (engulfing)', () => {
    const candles = [
      { open: 15, high: 16, low: 10, close: 10 }, // bearish
      { open: 10, high: 20, low: 9, close: 19 }, // bullish, engulfs previous
      { open: 20, high: 25, low: 19, close: 24 },
    ];
    const results = patternChain(candles, [
      { name: 'bullishEngulfing', fn: engulfing.bullishEngulfing, paramCount: 2 },
    ]);
    assert.deepStrictEqual(results, [
      { index: 0, pattern: 'bullishEngulfing', match: [candles[0], candles[1]] },
    ]);
  });

  it('handles overlapping patterns', () => {
    const candles = [
      { open: 15, high: 16, low: 10, close: 10 }, // bearish
      { open: 10, high: 20, low: 9, close: 19 }, // bullish, engulfs previous
      { open: 28, high: 30, low: 20, close: 29.5 }, // bullish hammer (strict)
    ];
    const results = patternChain(candles, [
      { name: 'bullishEngulfing', fn: engulfing.bullishEngulfing },
      { name: 'bullishHammer', fn: hammer.bullishHammer },
    ]);
    // Should find engulfing at 0, hammer at 2
    assert(results.some(r => r.pattern === 'bullishEngulfing' && r.index === 0));
    assert(results.some(r => r.pattern === 'bullishHammer' && r.index === 2));
  });

  it('sorts results chronologically by index', () => {
    const candles = [
      { open: 28, high: 30, low: 20, close: 29.5 }, // bullish hammer
      { open: 29.5, high: 30, low: 20, close: 28 }, // bearish hammer
      { open: 10, high: 15, low: 10, close: 10.4 }, // doji
    ];
    const results = patternChain(candles, [
      { name: 'doji', fn: doji.doji },
      { name: 'bullishHammer', fn: hammer.bullishHammer },
      { name: 'bearishHammer', fn: hammer.bearishHammer },
    ]);
    const indices = results.map(r => r.index);
    assert.deepStrictEqual(indices, [0, 1, 2]);
  });

  it('works with custom two-candle pattern', () => {
    // Custom: bullish then bearish
    function bullBear(a, b) {
      return a.open < a.close && b.open > b.close;
    }
    const candles = [
      { open: 10, close: 20 }, // bullish
      { open: 20, close: 10 }, // bearish
      { open: 10, close: 20 }, // bullish
      { open: 20, close: 10 }, // bearish
    ];
    // Use findPattern to generate indices for the custom pattern
    const indices = utils.findPattern(candles, bullBear);
    const results = patternChain(candles, [
      { name: 'bullBear', fn: arr => indices, paramCount: 2 },
    ]);
    assert.deepStrictEqual(results, [
      { index: 0, pattern: 'bullBear', match: [candles[0], candles[1]] },
      { index: 2, pattern: 'bullBear', match: [candles[2], candles[3]] },
    ]);
  });

  it('returns empty array for empty input', () => {
    const results = patternChain([], [
      { name: 'bullishHammer', fn: hammer.bullishHammer },
    ]);
    assert.deepStrictEqual(results, []);
  });
}); 