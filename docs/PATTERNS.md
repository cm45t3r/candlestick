# Pattern Descriptions

Detailed descriptions of all 18 candlestick patterns (29 variants) detected by this library, including the specific thresholds used for detection.

For a general introduction to candlestick patterns, see [Candlestick chart — Wikipedia](https://en.wikipedia.org/wiki/Candlestick_chart).

## Single Candle Patterns

- **Hammer**: Small body near the top (body < 1/3 of range), long lower shadow (tail ≥ 2× body), small upper shadow. Signals possible bullish reversal.
- **Inverted Hammer**: Small body near the bottom, long upper shadow (wick ≥ 2× body), small lower shadow. Bullish reversal signal.
- **Doji**: Very small body (body < 10% of range), open ≈ close. Indicates indecision. Candle must have range (high > low).
- **Marubozu**: Long body (≥ 70% of range) with minimal shadows (< 10% of body). Strong directional move. Bullish Marubozu shows strong buying, Bearish shows strong selling.
- **Spinning Top**: Small body (< 30% of range) with long upper and lower shadows (each > 20% of range). Indicates market indecision or potential reversal.

## Two Candle Patterns

- **Engulfing**: Second candle's body fully engulfs the previous (body range covers previous body). Bullish or bearish.
- **Harami**: Second candle's body is inside the previous (body range within previous body). Bullish or bearish.
- **Kicker**: Opposite-color candles with a body gap between them (second body does not overlap first body). The second candle must not be a Hammer or Inverted Hammer shape. Bullish or bearish.
- **Hanging Man**: Bullish candle followed by a bearish hammer with a gap up. Bearish reversal.
- **Shooting Star**: Bullish candle followed by a bearish inverted hammer with a gap up. Bearish reversal.
- **Piercing Line**: Bullish reversal. Bearish candle (body ≥ 50% of range) followed by bullish candle (body ≥ 50% of range) that opens below first's low, closes above the first body's midpoint but below the first body's top (i.e., does not fully engulf).
- **Dark Cloud Cover**: Bearish reversal. Bullish candle (body ≥ 50% of range) followed by bearish candle (body ≥ 50% of range) that opens above first's high, closes below the first body's midpoint but above the first body's bottom (i.e., does not fully engulf).
- **Tweezers Top**: Bearish reversal. Bullish candle followed by bearish candle with matching highs (within 1% of the candles' average range). Both candles must have significant bodies (≥ 40% of their range). Indicates resistance level.
- **Tweezers Bottom**: Bullish reversal. Bearish candle followed by bullish candle with matching lows (within 1% of the candles' average range). Both candles must have significant bodies (≥ 40% of their range). Indicates support level.

## Three Candle Patterns

- **Morning Star**: Bullish reversal. Long bearish candle (body ≥ 60% of range), small-bodied star (body ≤ 30% of range) whose body gaps down from the first candle's body, long bullish candle (body ≥ 60% of range) closing above the midpoint of the first candle's body.
- **Evening Star**: Bearish reversal. Long bullish candle (body ≥ 60% of range), small-bodied star (body ≤ 30% of range) whose body gaps up from the first candle's body, long bearish candle (body ≥ 60% of range) closing below the midpoint of the first candle's body.
- **Three White Soldiers**: Three consecutive bullish candles, each opening within the previous body and closing higher. Each body ≥ 60% of its candle's range; upper shadows ≤ 30% of body. Signals strong bullish continuation/reversal.
- **Three Black Crows**: Three consecutive bearish candles, each opening within the previous body and closing lower. Each body ≥ 60% of its candle's range; lower shadows ≤ 30% of body. Signals strong bearish continuation/reversal.
