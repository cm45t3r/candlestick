const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  expectedTrendDirection,
  computeContextFit,
} = require("../src/contextFit.js");

describe("expectedTrendDirection", () => {
  it("reversal + bullish direction expects a preceding DOWNtrend (-1)", () => {
    assert.equal(
      expectedTrendDirection({ type: "reversal", direction: "bullish" }),
      -1,
    );
  });

  it("reversal + bearish direction expects a preceding UPtrend (1) — the hammer/hangingMan case", () => {
    assert.equal(
      expectedTrendDirection({ type: "reversal", direction: "bearish" }),
      1,
    );
  });

  it("continuation + bullish direction expects a preceding UPtrend (1)", () => {
    assert.equal(
      expectedTrendDirection({ type: "continuation", direction: "bullish" }),
      1,
    );
  });

  it("continuation + bearish direction expects a preceding DOWNtrend (-1)", () => {
    assert.equal(
      expectedTrendDirection({ type: "continuation", direction: "bearish" }),
      -1,
    );
  });

  it("returns 0 for neutral direction regardless of type", () => {
    assert.equal(
      expectedTrendDirection({ type: "reversal", direction: "neutral" }),
      0,
    );
    assert.equal(
      expectedTrendDirection({
        type: "continuation",
        direction: "neutral",
      }),
      0,
    );
  });

  it("returns 0 for missing/unknown metadata", () => {
    assert.equal(expectedTrendDirection(undefined), 0);
    assert.equal(expectedTrendDirection({}), 0);
    assert.equal(expectedTrendDirection({ type: "neutral" }), 0);
  });
});

describe("computeContextFit", () => {
  it("returns 1 (no penalty) when there is no directional expectation", () => {
    assert.equal(computeContextFit(0.5, 0), 1);
    assert.equal(computeContextFit(-0.5, 0), 1);
  });

  it("returns 1 (no penalty) when the measured trend is unavailable", () => {
    assert.equal(computeContextFit(undefined, 1), 1);
    assert.equal(computeContextFit(null, 1), 1);
    assert.equal(computeContextFit(NaN, -1), 1);
  });

  it("scores above 0.5 when the measured trend matches the expected direction", () => {
    assert.ok(computeContextFit(0.05, 1, 5) > 0.5); // uptrend, expects uptrend
    assert.ok(computeContextFit(-0.05, -1, 5) > 0.5); // downtrend, expects downtrend
  });

  it("scores below 0.5 when the measured trend contradicts the expected direction", () => {
    assert.ok(computeContextFit(0.05, -1, 5) < 0.5); // uptrend, expects downtrend
    assert.ok(computeContextFit(-0.05, 1, 5) < 0.5); // downtrend, expects uptrend
  });

  it("matches the documented formula exactly for a mid-range case", () => {
    // 0.5 + sensitivity * (expectedDirection * measuredTrend)
    assert.ok(Math.abs(computeContextFit(0.02, 1, 5) - 0.6) < 1e-12); // 0.5 + 5*0.02
    assert.ok(Math.abs(computeContextFit(0.02, -1, 5) - 0.4) < 1e-12); // 0.5 - 5*0.02
  });

  it("clamps to [0, 1] for large aligned/contradicting trends", () => {
    assert.equal(computeContextFit(1, 1, 5), 1);
    assert.equal(computeContextFit(1, -1, 5), 0);
  });

  it("uses the default sensitivity (5) when not specified", () => {
    assert.equal(computeContextFit(0.02, 1), computeContextFit(0.02, 1, 5));
  });
});
