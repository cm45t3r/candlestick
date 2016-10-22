/*
 * Copyright (C) 2016-Present Trendz.
 * MIT Licence.
 */

const assert = require('assert');
const cs = require('../index');

describe('candlestick', () => {
    describe('#isBullishKicker()', () => {
        it('should return false when previous candle is not bearish', () => {
            const prev = { open: 1, close: 2 };
            const curr = { open: 3, close: 4 };
            assert.equal(false, cs.isBullishKicker(prev, curr));
        });

        it('should return false when current candle is not bullish', () => {
            const prev = { open: 2, close: 1 };
            const curr = { open: 4, close: 3 };
            assert.equal(false, cs.isBullishKicker(prev, curr));
        });

        it('should return false when no gap between candles', () => {
            const prev = { open: 2, close: 1 };
            const curr = { open: 2, close: 3 };
            assert.equal(false, cs.isBullishKicker(prev, curr));
        });

        it('should return true when candles are bear, bull and gap between', () => {
            const prev = { open: 2, close: 1 };
            const curr = { open: 3, close: 4 };
            assert.equal(true, cs.isBullishKicker(prev, curr));
        });
    });

    describe('#isBearishKicker()', () => {
        it('should return false when previous candle is not bullish', () => {
            const prev = { open: 4, close: 3 };
            const curr = { open: 2, close: 1 };
            assert.equal(false, cs.isBearishKicker(prev, curr));
        });

        it('should return false when current candle is not bearish', () => {
            const prev = { open: 3, close: 4 };
            const curr = { open: 1, close: 2 };
            assert.equal(false, cs.isBearishKicker(prev, curr));
        });

        it('should return false when no gap between candles', () => {
            const prev = { open: 3, close: 4 };
            const curr = { open: 3, close: 2 };
            assert.equal(false, cs.isBearishKicker(prev, curr));
        });

        it('should return true when candles are bull, bear and gap between', () => {
            const prev = { open: 3, close: 4 };
            const curr = { open: 2, close: 1 };
            assert.equal(true, cs.isBearishKicker(prev, curr));
        });
    });

    describe('#bullishKicker()', () => {
        it('should find bullish kickers at positions 2 and 7 in array', () => {
            const data = [{ id: 0, open: 1, close: 2 }, { id: 1, open: 2, close: 1 },
                          { id: 2, open: 3, close: 4 }, { id: 3, open: 6, close: 7 },
                          { id: 4, open: 3, close: 6 }, { id: 5, open: 4, close: 5 },
                          { id: 6, open: 5, close: 3 }, { id: 7, open: 7, close: 9 },
            ];

            const [r1, r2] = cs.bullishKicker(data).map(e => e.id);
            assert.equal(2, r1);
            assert.equal(7, r2);
        });
    });

    describe('#bearishKicker()', () => {
        it('should find bearish kickers at positions 3 and 6 in array', () => {
            const data = [{ id: 0, open: 5, close: 2 }, { id: 1, open: 7, close: 8 },
                          { id: 2, open: 3, close: 4 }, { id: 3, open: 2, close: 1 },
                          { id: 4, open: 3, close: 6 }, { id: 5, open: 4, close: 5 },
                          { id: 6, open: 2, close: 1 }, { id: 7, open: 7, close: 9 },
            ];

            const [r1, r2] = cs.bearishKicker(data).map(e => e.id);
            assert.equal(3, r1);
            assert.equal(6, r2);
        });
    });
});
