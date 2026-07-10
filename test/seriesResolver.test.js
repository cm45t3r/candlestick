const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { resolveSeries } = require("../src/seriesResolver.js");

describe("resolveSeries", () => {
  const candles = [{ close: 1 }, { close: 2 }, { close: 3 }];

  it("returns null when none of fn/external/method is given", () => {
    assert.equal(resolveSeries(candles), null);
    assert.equal(resolveSeries(candles, {}), null);
  });

  it("uses the built-in method when only `method` is given", () => {
    const builtins = { double: (c, period) => c.map((x) => x.close * period) };
    const result = resolveSeries(candles, {
      builtins,
      method: "double",
      period: 10,
    });
    assert.deepStrictEqual(result, [10, 20, 30]);
  });

  it("throws for an unknown method", () => {
    assert.throws(
      () => resolveSeries(candles, { builtins: {}, method: "nope" }),
      /Unknown method "nope"/,
    );
  });

  it("uses the external series when given, ignoring method", () => {
    const builtins = { double: (c) => c.map((x) => x.close * 2) };
    const external = [100, 200, 300];
    const result = resolveSeries(candles, {
      builtins,
      method: "double",
      external,
    });
    assert.deepStrictEqual(result, external);
  });

  it("throws when the external series length doesn't match candles", () => {
    assert.throws(
      () => resolveSeries(candles, { external: [1, 2] }),
      RangeError,
    );
  });

  it("uses the callback when given, taking precedence over external and method", () => {
    const builtins = { double: (c) => c.map((x) => x.close * 2) };
    const external = [100, 200, 300];
    const fn = (c, index) => c[index].close * 1000;
    const result = resolveSeries(candles, {
      builtins,
      method: "double",
      external,
      fn,
    });
    assert.deepStrictEqual(result, [1000, 2000, 3000]);
  });
});
