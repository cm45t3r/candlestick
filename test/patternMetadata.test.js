const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  getPatternMetadata,
  enrichWithMetadata,
  filterByConfidence,
  filterByType,
  filterByDirection,
  sortByConfidence,
} = require("../src/patternMetadata.js");

describe("patternMetadata", () => {
  describe("getPatternMetadata", () => {
    it("returns metadata for known pattern", () => {
      const meta = getPatternMetadata("bullishEngulfing");
      assert.equal(meta.type, "reversal");
      assert.equal(meta.direction, "bullish");
      assert.equal(meta.confidence, 0.85);
      assert.equal(meta.strength, "strong");
    });

    it("returns undefined for unknown pattern", () => {
      const meta = getPatternMetadata("unknownPattern");
      assert.equal(meta, undefined);
    });
  });

  describe("enrichWithMetadata", () => {
    it("adds metadata to pattern results", () => {
      const results = [
        { index: 0, pattern: "bullishEngulfing", match: [] },
        { index: 1, pattern: "doji", match: [] },
      ];

      const enriched = enrichWithMetadata(results);

      assert.equal(enriched[0].metadata.type, "reversal");
      assert.equal(enriched[0].metadata.confidence, 0.85);
      assert.equal(enriched[1].metadata.type, "neutral");
      assert.equal(enriched[1].metadata.confidence, 0.55);
    });

    it("handles patterns without metadata", () => {
      const results = [{ index: 0, pattern: "unknownPattern", match: [] }];

      const enriched = enrichWithMetadata(results);
      assert.equal(enriched[0].metadata, undefined);
    });
  });

  describe("filterByConfidence", () => {
    it("filters patterns by minimum confidence", () => {
      const results = [
        { index: 0, pattern: "bullishEngulfing", match: [] }, // 0.85
        { index: 1, pattern: "doji", match: [] }, // 0.55
        { index: 2, pattern: "bullishKicker", match: [] }, // 0.90
      ];

      const enriched = enrichWithMetadata(results);
      const filtered = filterByConfidence(enriched, 0.7);

      assert.equal(filtered.length, 2);
      assert.equal(filtered[0].pattern, "bullishEngulfing");
      assert.equal(filtered[1].pattern, "bullishKicker");
    });

    it("uses default confidence 0.5", () => {
      const results = [
        { index: 0, pattern: "doji", match: [] }, // 0.55
      ];

      const enriched = enrichWithMetadata(results);
      const filtered = filterByConfidence(enriched);

      assert.equal(filtered.length, 1);
    });
  });

  describe("filterByType", () => {
    it("filters patterns by type", () => {
      const results = [
        { index: 0, pattern: "bullishEngulfing", match: [] }, // reversal
        { index: 1, pattern: "doji", match: [] }, // neutral
        { index: 2, pattern: "threeWhiteSoldiers", match: [] }, // continuation
      ];

      const enriched = enrichWithMetadata(results);
      const reversals = filterByType(enriched, "reversal");

      assert.equal(reversals.length, 1);
      assert.equal(reversals[0].pattern, "bullishEngulfing");
    });
  });

  describe("filterByDirection", () => {
    it("filters patterns by direction", () => {
      const results = [
        { index: 0, pattern: "bullishEngulfing", match: [] }, // bullish
        { index: 1, pattern: "bearishEngulfing", match: [] }, // bearish
        { index: 2, pattern: "doji", match: [] }, // neutral
      ];

      const enriched = enrichWithMetadata(results);
      const bullish = filterByDirection(enriched, "bullish");

      assert.equal(bullish.length, 1);
      assert.equal(bullish[0].pattern, "bullishEngulfing");
    });
  });

  describe("sortByConfidence", () => {
    it("sorts patterns by confidence descending", () => {
      const results = [
        { index: 0, pattern: "doji", match: [] }, // 0.55
        { index: 1, pattern: "bullishKicker", match: [] }, // 0.90
        { index: 2, pattern: "bullishEngulfing", match: [] }, // 0.85
      ];

      const enriched = enrichWithMetadata(results);
      const sorted = sortByConfidence(enriched);

      assert.equal(sorted[0].pattern, "bullishKicker"); // 0.90
      assert.equal(sorted[1].pattern, "bullishEngulfing"); // 0.85
      assert.equal(sorted[2].pattern, "doji"); // 0.55
    });
  });

  describe("integration", () => {
    it("complete workflow with metadata", () => {
      const { patternChain, allPatterns } = require("../src/patternChain.js");

      const data = [
        { open: 40, high: 50, low: 39, close: 49 },
        { open: 52, high: 53, low: 42, close: 43 },
      ];

      const results = patternChain(data, allPatterns);
      const enriched = enrichWithMetadata(results);
      const highConfidence = filterByConfidence(enriched, 0.8);
      const sorted = sortByConfidence(highConfidence);

      assert.ok(sorted.length >= 0);
      if (sorted.length > 0) {
        assert.ok(sorted[0].metadata);
        assert.ok(sorted[0].metadata.confidence >= 0.8);
      }
    });
  });

  describe("edge cases with missing metadata", () => {
    it("filterByConfidence handles results without metadata", () => {
      const results = [
        { index: 0, pattern: "hammer" },
        { index: 1, pattern: "unknownPattern" }, // pattern without metadata
        { index: 2, pattern: "doji" },
      ];

      const filtered = filterByConfidence(results, 0.7);
      // Should get patterns from patternMetadata, unknownPattern gets metadata from getPatternMetadata
      assert.ok(Array.isArray(filtered));
    });

    it("filterByType handles results without metadata", () => {
      const results = [
        { index: 0, pattern: "hammer" },
        { index: 1, pattern: "unknownPattern" },
      ];

      const filtered = filterByType(results, "reversal");
      assert.ok(Array.isArray(filtered));
    });

    it("filterByDirection handles results without metadata", () => {
      const results = [
        { index: 0, pattern: "hammer" },
        { index: 1, pattern: "unknownPattern" },
      ];

      const filtered = filterByDirection(results, "bullish");
      assert.ok(Array.isArray(filtered));
    });

    it("sortByConfidence handles results without metadata", () => {
      const results = [
        { index: 0, pattern: "unknownPattern1" },
        { index: 1, pattern: "hammer" },
        { index: 2, pattern: "unknownPattern2" },
      ];

      const sorted = sortByConfidence(results);
      assert.equal(sorted.length, 3);
      // hammer has metadata with confidence 0.75, unknowns get 0
      assert.equal(sorted[0].pattern, "hammer");
    });

    it("sortByConfidence handles mixed metadata and no metadata", () => {
      const results = [
        { index: 0, pattern: "doji", metadata: { confidence: 0.55 } },
        { index: 1, pattern: "unknownPattern" }, // no metadata
        {
          index: 2,
          pattern: "bullishEngulfing",
          metadata: { confidence: 0.85 },
        },
      ];

      const sorted = sortByConfidence(results);
      assert.equal(sorted.length, 3);
      assert.equal(sorted[0].pattern, "bullishEngulfing"); // 0.85
      assert.equal(sorted[1].pattern, "doji"); // 0.55
      assert.equal(sorted[2].pattern, "unknownPattern"); // 0
    });
  });
});
