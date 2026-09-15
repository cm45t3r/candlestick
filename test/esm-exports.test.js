const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const { pathToFileURL } = require("url");

const cjs = require("../src/candlestick.js");
const esmUrl = pathToFileURL(
  path.join(__dirname, "..", "src", "index.mjs"),
).href;

// src/index.mjs names every export against its own module so that bundlers can
// prove unused ones unreachable (#155). The cost of that is a second list to
// keep in step with src/candlestick.js: a pattern added to one and forgotten in
// the other would go missing from the ESM entry silently. These tests are the
// guard against that drift.
describe("ESM entry mirrors the CommonJS surface (#155)", () => {
  it("exports every name the CommonJS aggregate does", async () => {
    const esm = await import(esmUrl);

    const expected = Object.keys(cjs).sort();
    const actual = Object.keys(esm)
      .filter((name) => name !== "default")
      .sort();

    assert.deepEqual(
      actual,
      expected,
      "src/index.mjs and src/candlestick.js have drifted",
    );
  });

  it("exports the same function identities, not equivalent copies", async () => {
    const esm = await import(esmUrl);

    for (const name of Object.keys(cjs)) {
      assert.equal(
        esm[name],
        cjs[name],
        `${name} is not the same binding in both entries`,
      );
    }
  });

  it("keeps the aggregate object as the default export", async () => {
    const esm = await import(esmUrl);

    assert.equal(esm.default, cjs);
    assert.equal(esm.default.hammer, esm.hammer);
  });

  it("exposes the four namespaces as objects", async () => {
    const esm = await import(esmUrl);

    for (const name of ["utils", "plugins", "metadata", "streaming"]) {
      assert.equal(typeof esm[name], "object", `${name} is not an object`);
      assert.ok(
        Object.keys(esm[name]).length > 0,
        `${name} is empty, so the default re-export did not resolve`,
      );
    }
  });

  it("detects patterns through the ESM entry", async () => {
    const { patternChain, allPatterns } = await import(esmUrl);

    const data = [
      { open: 100, high: 110, low: 90, close: 101 },
      { open: 101, high: 112, low: 99, close: 111 },
    ];

    assert.ok(patternChain(data, allPatterns).length > 0);
  });
});
