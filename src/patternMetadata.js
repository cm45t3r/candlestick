// patternMetadata.js
// Metadata system for pattern confidence and strength

/**
 * Pattern metadata definitions
 * Each pattern has:
 * - type: 'reversal' | 'continuation' | 'neutral'
 * - confidence: 0-1 (higher = more reliable)
 * - strength: 'weak' | 'moderate' | 'strong'
 */

const patternMetadata = {
  // Single candle patterns
  hammer: {
    type: "reversal",
    direction: "bullish",
    confidence: 0.7,
    strength: "moderate",
    description: "Potential bullish reversal with long lower shadow",
  },
  bullishHammer: {
    type: "reversal",
    direction: "bullish",
    confidence: 0.75,
    strength: "moderate",
    description: "Bullish hammer with bullish body",
  },
  bearishHammer: {
    type: "reversal",
    direction: "bullish",
    confidence: 0.65,
    strength: "moderate",
    description: "Hammer with bearish body (still bullish signal)",
  },
  invertedHammer: {
    type: "reversal",
    direction: "bullish",
    confidence: 0.65,
    strength: "moderate",
    description: "Potential bullish reversal with long upper shadow",
  },
  bullishInvertedHammer: {
    type: "reversal",
    direction: "bullish",
    confidence: 0.7,
    strength: "moderate",
    description: "Inverted hammer with bullish body",
  },
  bearishInvertedHammer: {
    type: "reversal",
    direction: "bullish",
    confidence: 0.6,
    strength: "weak",
    description: "Inverted hammer with bearish body",
  },
  doji: {
    type: "neutral",
    direction: "neutral",
    confidence: 0.55,
    strength: "weak",
    description: "Indecision, trend reversal possible",
  },

  // Two candle patterns
  bullishEngulfing: {
    type: "reversal",
    direction: "bullish",
    confidence: 0.85,
    strength: "strong",
    description: "Strong bullish reversal signal",
  },
  bearishEngulfing: {
    type: "reversal",
    direction: "bearish",
    confidence: 0.85,
    strength: "strong",
    description: "Strong bearish reversal signal",
  },
  bullishHarami: {
    type: "reversal",
    direction: "bullish",
    confidence: 0.7,
    strength: "moderate",
    description: "Bullish reversal with inside candle",
  },
  bearishHarami: {
    type: "reversal",
    direction: "bearish",
    confidence: 0.7,
    strength: "moderate",
    description: "Bearish reversal with inside candle",
  },
  bullishKicker: {
    type: "reversal",
    direction: "bullish",
    confidence: 0.9,
    strength: "strong",
    description: "Very strong bullish reversal with gap",
  },
  bearishKicker: {
    type: "reversal",
    direction: "bearish",
    confidence: 0.9,
    strength: "strong",
    description: "Very strong bearish reversal with gap",
  },
  hangingMan: {
    type: "reversal",
    direction: "bearish",
    confidence: 0.75,
    strength: "moderate",
    description: "Bearish reversal after uptrend",
  },
  shootingStar: {
    type: "reversal",
    direction: "bearish",
    confidence: 0.75,
    strength: "moderate",
    description: "Bearish reversal with long upper shadow",
  },
  piercingLine: {
    type: "reversal",
    direction: "bullish",
    confidence: 0.8,
    strength: "strong",
    description: "Bullish reversal piercing into bearish candle",
  },
  darkCloudCover: {
    type: "reversal",
    direction: "bearish",
    confidence: 0.8,
    strength: "strong",
    description: "Bearish reversal covering bullish candle",
  },

  // Three candle patterns
  morningStar: {
    type: "reversal",
    direction: "bullish",
    confidence: 0.9,
    strength: "strong",
    description: "Strong bullish reversal with gap and star",
  },
  eveningStar: {
    type: "reversal",
    direction: "bearish",
    confidence: 0.9,
    strength: "strong",
    description: "Strong bearish reversal with gap and star",
  },
  threeWhiteSoldiers: {
    type: "continuation",
    direction: "bullish",
    confidence: 0.85,
    strength: "strong",
    description: "Strong bullish continuation with three advancing candles",
  },
  threeBlackCrows: {
    type: "continuation",
    direction: "bearish",
    confidence: 0.85,
    strength: "strong",
    description: "Strong bearish continuation with three declining candles",
  },

  // Marubozu patterns
  marubozu: {
    type: "continuation",
    direction: "neutral",
    confidence: 0.8,
    strength: "strong",
    description: "Strong directional move with minimal shadows",
  },
  bullishMarubozu: {
    type: "continuation",
    direction: "bullish",
    confidence: 0.85,
    strength: "strong",
    description: "Very strong bullish candle with no shadows",
  },
  bearishMarubozu: {
    type: "continuation",
    direction: "bearish",
    confidence: 0.85,
    strength: "strong",
    description: "Very strong bearish candle with no shadows",
  },

  // Spinning Top patterns
  spinningTop: {
    type: "neutral",
    direction: "neutral",
    confidence: 0.6,
    strength: "weak",
    description: "Indecision candle, potential reversal or consolidation",
  },
  bullishSpinningTop: {
    type: "neutral",
    direction: "neutral",
    confidence: 0.58,
    strength: "weak",
    description: "Spinning top with slight bullish bias",
  },
  bearishSpinningTop: {
    type: "neutral",
    direction: "neutral",
    confidence: 0.58,
    strength: "weak",
    description: "Spinning top with slight bearish bias",
  },

  // Tweezers patterns
  tweezersTop: {
    type: "reversal",
    direction: "bearish",
    confidence: 0.75,
    strength: "moderate",
    description: "Bearish reversal with matching highs",
  },
  tweezersBottom: {
    type: "reversal",
    direction: "bullish",
    confidence: 0.75,
    strength: "moderate",
    description: "Bullish reversal with matching lows",
  },
};

/**
 * Get metadata for a pattern
 * @param {string} patternName - Name of the pattern
 * @return {Object|undefined} Pattern metadata or undefined if not found
 */
function getPatternMetadata(patternName) {
  return patternMetadata[patternName];
}

/**
 * Enhance pattern chain results with metadata
 * @param {Array<Object>} results - Results from patternChain
 * @return {Array<Object>} Results with metadata added
 */
function enrichWithMetadata(results) {
  return results.map((result) => {
    const metadata = getPatternMetadata(result.pattern);
    if (metadata) {
      return {
        ...result,
        metadata: {
          type: metadata.type,
          direction: metadata.direction,
          confidence: metadata.confidence,
          strength: metadata.strength,
          description: metadata.description,
        },
      };
    }
    return result;
  });
}

/**
 * Filter pattern results by minimum confidence
 * @param {Array<Object>} results - Results with metadata
 * @param {number} minConfidence - Minimum confidence threshold (0-1)
 * @return {Array<Object>} Filtered results
 */
function filterByConfidence(results, minConfidence = 0.5) {
  return results.filter((r) => {
    const metadata = r.metadata || getPatternMetadata(r.pattern);
    return metadata && metadata.confidence >= minConfidence;
  });
}

/**
 * Filter pattern results by type
 * @param {Array<Object>} results - Results with metadata
 * @param {string} type - Pattern type ('reversal', 'continuation', 'neutral')
 * @return {Array<Object>} Filtered results
 */
function filterByType(results, type) {
  return results.filter((r) => {
    const metadata = r.metadata || getPatternMetadata(r.pattern);
    return metadata && metadata.type === type;
  });
}

/**
 * Filter pattern results by direction
 * @param {Array<Object>} results - Results with metadata
 * @param {string} direction - Pattern direction ('bullish', 'bearish', 'neutral')
 * @return {Array<Object>} Filtered results
 */
function filterByDirection(results, direction) {
  return results.filter((r) => {
    const metadata = r.metadata || getPatternMetadata(r.pattern);
    return metadata && metadata.direction === direction;
  });
}

/**
 * Sort pattern results by confidence (descending)
 * @param {Array<Object>} results - Results with metadata
 * @return {Array<Object>} Sorted results
 */
function sortByConfidence(results) {
  return results.slice().sort((a, b) => {
    const metaA = a.metadata || getPatternMetadata(a.pattern);
    const metaB = b.metadata || getPatternMetadata(b.pattern);
    const confA = metaA ? metaA.confidence : 0;
    const confB = metaB ? metaB.confidence : 0;
    return confB - confA;
  });
}

module.exports = {
  patternMetadata,
  getPatternMetadata,
  enrichWithMetadata,
  filterByConfidence,
  filterByType,
  filterByDirection,
  sortByConfidence,
};
