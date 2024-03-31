/*
 * Copyright (C) 2016-Present cm45t3r.
 * MIT License.
 */

const assert = require('assert');
const cs = require('../index');

describe('candlestick', () => {
  describe('#isBullishKicker()', () => {
    it('should return false when previous candle is not bearish', () => {
      const prev = {open: 1, close: 2};
      const curr = {open: 3, close: 4};
      assert.equal(false, cs.isBullishKicker(prev, curr));
    });

    it('should return false when current candle is not bullish', () => {
      const prev = {open: 2, close: 1};
      const curr = {open: 4, close: 3};
      assert.equal(false, cs.isBullishKicker(prev, curr));
    });

    it('should return false when no gap between candles', () => {
      const prev = {open: 2, close: 1};
      const curr = {open: 2, close: 3};
      assert.equal(false, cs.isBullishKicker(prev, curr));
    });

    it(`should return true when candles are bear, bull and gap 
      in-between`, () => {
      const prev = {open: 2, close: 1};
      const curr = {open: 3, close: 4};
      assert.equal(true, cs.isBullishKicker(prev, curr));
    });
  });

  describe('#isBearishKicker()', () => {
    it('should return false when previous candle is not bullish', () => {
      const prev = {open: 4, close: 3};
      const curr = {open: 2, close: 1};
      assert.equal(false, cs.isBearishKicker(prev, curr));
    });

    it('should return false when current candle is not bearish', () => {
      const prev = {open: 3, close: 4};
      const curr = {open: 1, close: 2};
      assert.equal(false, cs.isBearishKicker(prev, curr));
    });

    it('should return false when no gap between candles', () => {
      const prev = {open: 3, close: 4};
      const curr = {open: 3, close: 2};
      assert.equal(false, cs.isBearishKicker(prev, curr));
    });

    it(`should return true when a bullish candle is followed by
      a bearish candle with down gap between`, () => {
      const prev = {open: 3, close: 4};
      const curr = {open: 2, close: 1};
      assert.equal(true, cs.isBearishKicker(prev, curr));
    });
  });

  describe('#isShootingStar()', () => {
    it('should return false when previous candle is not bullish', () => {
      const prev = {open: 2, high: 10, low: 0.5, close: 1};
      const curr = {open: 4, high: 20, low: 2.9, close: 3};
      assert.equal(false, cs.isShootingStar(prev, curr));
    });

    it('should return false when current candle is not bearish', () => {
      const prev = {open: 1, high: 10, low: 0.5, close: 2};
      const curr = {open: 3, high: 20, low: 2.9, close: 4};
      assert.equal(false, cs.isShootingStar(prev, curr));
    });

    it('should return false when no gap between candles', () => {
      const prev = {open: 1, high: 10, low: 0.5, close: 2};
      const curr = {open: 3, high: 30, low: 1.4, close: 1.5};
      assert.equal(false, cs.isShootingStar(prev, curr));
    });

    it(`should return true when candles are bull, bear, gap in-between, 
      long high and short low`, () => {
      const prev = {open: 1, high: 10, low: 0.5, close: 2};
      const curr = {open: 4, high: 20, low: 2.9, close: 3};
      assert.equal(true, cs.isShootingStar(prev, curr));
    });
  });

  describe('#bullishKicker()', () => {
    it('should find bullish kickers at positions 1 and 6 in array', () => {
      const data = [
        { open: 1, close: 2 }, { open: 2, close: 1 },
        { open: 3, close: 4 }, { open: 6, close: 7 },
        { open: 3, close: 6 }, { open: 4, close: 5 },
        { open: 5, close: 3 }, { open: 7, close: 9 },
      ];
      
      const results = cs.bullishKicker(data);
      assert.deepStrictEqual([1, 6], results);
    });
  });

  describe('#bearishKicker()', () => {
    it('should find bearish kickers at positions 2 and 5 in array', () => {
      const data = [
        { open: 5, close: 2 }, { open: 7, close: 8 },
        { open: 3, close: 4 }, { open: 2, close: 1 },
        { open: 3, close: 6 }, { open: 4, close: 5 },
        { open: 2, close: 1 }, { open: 7, close: 9 },
      ];

      const results = cs.bearishKicker(data);
      assert.deepStrictEqual([2, 5], results);
    });
  });

  describe('#shootingStar()', () => {
    it('should find shooting stars at positions 0 and 4 in array', () => {
      const data = [
        { open: 1, high: 10, low: 0.5, close: 2},
        { open: 4, high: 20, low: 2.9, close: 3},
        { open: 2, high: 10, low: 0.5, close: 1},
        { open: 2, high: 10, low: 0.5, close: 1},
        { open: 1, high: 10, low: 0.5, close: 2},
        { open: 4, high: 20, low: 2.9, close: 3},
        { open: 1, high: 10, low: 0.5, close: 2},
        { open: 3, high: 30, low: 1.4, close: 2},
      ];

      const results = cs.shootingStar(data);
      assert.deepStrictEqual([0, 4], results);
    });
  });
});
