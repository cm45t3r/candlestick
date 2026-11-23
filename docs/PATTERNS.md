# Pattern Descriptions

Detailed descriptions of all 18 candlestick patterns (29 variants) detected by this library, including the specific thresholds used for detection.

For a general introduction to candlestick patterns, see [Candlestick chart — Wikipedia](https://en.wikipedia.org/wiki/Candlestick_chart).

## Single Candle Patterns

- **Hammer**: Small body near the top (body < 1/3 of range), long lower shadow (tail ≥ 2× body), small upper shadow. Signals possible bullish reversal. Note: this is pure geometry — it does not check for a preceding downtrend, so the identical shape after an _uptrend_ is really a **Hanging Man** (bearish), not a hammer. Pass a `trendContext` option to `patternChain` to score/resolve this — see [README: Trend-Context Confidence Adjustment](../README.md#trend-context-confidence-adjustment).
- **Inverted Hammer**: Small body near the bottom, long upper shadow (wick ≥ 2× body), small lower shadow. Bullish reversal signal.
- **Doji**: Very small body (body < 10% of range), open ≈ close. Indicates indecision. Candle must have range (high > low).
- **Marubozu**: Long body (≥ 70% of range) with minimal shadows (< 10% of body). Strong directional move. Bullish Marubozu shows strong buying, Bearish shows strong selling.
- **Spinning Top**: Small body (< 30% of range) with long upper and lower shadows (each > 20% of range). Indicates market indecision or potential reversal.

## Two Candle Patterns

- **Engulfing**: Second candle's body fully engulfs the previous (body range covers previous body). Bullish or bearish.
- **Harami**: Second candle's body is inside the previous (body range within previous body). Bullish or bearish.
- **Kicker**: Opposite-color candles with a body gap between them (second body does not overlap first body). The second candle must not be a Hammer or Inverted Hammer shape. Bullish or bearish. By default, any nonzero gap counts; pass a `minGapVol` option to `bullishKicker`/`bearishKicker` (or `isBullishKicker`/`isBearishKicker`) to require the gap to clear a configurable, volatility-relative threshold — see [README: Gap Significance Threshold (Kicker)](../README.md#gap-significance-threshold-kicker) for the full option reference.
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

## Pattern Metadata

What `metadata.getPatternMetadata(name)` returns for each variant, in `allPatterns` order. This is what the CLI's `--type`, `--direction` and `--confidence` filters, and the `metadata.filterBy*` helpers, compare against. `confidence` is the static, context-blind score; see [README: Trend-Context Confidence Adjustment](../README.md#trend-context-confidence-adjustment) for the trend-aware `effectiveConfidence`.

The **direction is the signal, not the candle's colour**, and two groups of names read the other way:

- `bearishHammer` and `bearishInvertedHammer` are **bullish**. The "bearish" in the name describes the red body; the shape is still a bullish reversal. So `--direction bullish` returns them, and `--direction bearish` does not.
- `bullishSpinningTop` and `bearishSpinningTop` are **neutral**, like `spinningTop`. Their names describe the body colour only, so neither direction filter returns them.

`test/patternMetadata.test.js` checks this table against the source, so it cannot drift from the code.

<!-- metadata-table:start -->

| Pattern                 | Candles | Type         | Direction | Confidence | Strength |
| ----------------------- | ------- | ------------ | --------- | ---------- | -------- |
| `hammer`                | 1       | reversal     | bullish   | 0.7        | moderate |
| `bullishHammer`         | 1       | reversal     | bullish   | 0.75       | moderate |
| `bearishHammer`         | 1       | reversal     | bullish   | 0.65       | moderate |
| `invertedHammer`        | 1       | reversal     | bullish   | 0.65       | moderate |
| `bullishInvertedHammer` | 1       | reversal     | bullish   | 0.7        | moderate |
| `bearishInvertedHammer` | 1       | reversal     | bullish   | 0.6        | weak     |
| `bullishEngulfing`      | 2       | reversal     | bullish   | 0.85       | strong   |
| `bearishEngulfing`      | 2       | reversal     | bearish   | 0.85       | strong   |
| `bullishHarami`         | 2       | reversal     | bullish   | 0.7        | moderate |
| `bearishHarami`         | 2       | reversal     | bearish   | 0.7        | moderate |
| `bullishKicker`         | 2       | reversal     | bullish   | 0.9        | strong   |
| `bearishKicker`         | 2       | reversal     | bearish   | 0.9        | strong   |
| `hangingMan`            | 2       | reversal     | bearish   | 0.75       | moderate |
| `shootingStar`          | 2       | reversal     | bearish   | 0.75       | moderate |
| `piercingLine`          | 2       | reversal     | bullish   | 0.8        | strong   |
| `darkCloudCover`        | 2       | reversal     | bearish   | 0.8        | strong   |
| `doji`                  | 1       | neutral      | neutral   | 0.55       | weak     |
| `morningStar`           | 3       | reversal     | bullish   | 0.9        | strong   |
| `eveningStar`           | 3       | reversal     | bearish   | 0.9        | strong   |
| `threeWhiteSoldiers`    | 3       | continuation | bullish   | 0.85       | strong   |
| `threeBlackCrows`       | 3       | continuation | bearish   | 0.85       | strong   |
| `marubozu`              | 1       | continuation | neutral   | 0.8        | strong   |
| `bullishMarubozu`       | 1       | continuation | bullish   | 0.85       | strong   |
| `bearishMarubozu`       | 1       | continuation | bearish   | 0.85       | strong   |
| `spinningTop`           | 1       | neutral      | neutral   | 0.6        | weak     |
| `bullishSpinningTop`    | 1       | neutral      | neutral   | 0.58       | weak     |
| `bearishSpinningTop`    | 1       | neutral      | neutral   | 0.58       | weak     |
| `tweezersTop`           | 2       | reversal     | bearish   | 0.75       | moderate |
| `tweezersBottom`        | 2       | reversal     | bullish   | 0.75       | moderate |

<!-- metadata-table:end -->
