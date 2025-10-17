// pluginManager.js
// Plugin system for registering custom candlestick patterns

const customPatterns = new Map();

/**
 * Register a custom pattern plugin
 * @param {Object} plugin - Pattern plugin configuration
 * @param {string} plugin.name - Unique name for the pattern
 * @param {Function} plugin.fn - Detection function (single candle or series)
 * @param {number} [plugin.paramCount=1] - Number of candles the pattern uses
 * @param {Object} [plugin.metadata] - Optional metadata (type, confidence, etc.)
 * @throws {Error} If pattern name already exists or invalid configuration
 */
function registerPattern(plugin) {
  // Validation
  if (!plugin || typeof plugin !== "object") {
    throw new Error("Plugin must be an object");
  }

  if (!plugin.name || typeof plugin.name !== "string") {
    throw new Error("Plugin must have a valid name (string)");
  }

  if (customPatterns.has(plugin.name)) {
    throw new Error(`Pattern "${plugin.name}" is already registered`);
  }

  if (!plugin.fn || typeof plugin.fn !== "function") {
    throw new Error("Plugin must have a valid detection function (fn)");
  }

  const paramCount = plugin.paramCount !== undefined ? plugin.paramCount : 1;
  if (typeof paramCount !== "number" || paramCount < 1 || paramCount > 10) {
    throw new Error("paramCount must be a number between 1 and 10");
  }

  // Store the pattern
  const patternDef = {
    name: plugin.name,
    fn: plugin.fn,
    paramCount,
    metadata: plugin.metadata || {},
  };

  customPatterns.set(plugin.name, patternDef);

  return patternDef;
}

/**
 * Unregister a custom pattern
 * @param {string} name - Pattern name to remove
 * @returns {boolean} True if pattern was removed, false if it didn't exist
 */
function unregisterPattern(name) {
  return customPatterns.delete(name);
}

/**
 * Get a registered custom pattern by name
 * @param {string} name - Pattern name
 * @returns {Object|undefined} Pattern definition or undefined
 */
function getPattern(name) {
  return customPatterns.get(name);
}

/**
 * Get all registered custom patterns
 * @returns {Array<Object>} Array of pattern definitions
 */
function getAllCustomPatterns() {
  return Array.from(customPatterns.values());
}

/**
 * Clear all registered custom patterns
 */
function clearAllPatterns() {
  customPatterns.clear();
}

/**
 * Check if a pattern is registered
 * @param {string} name - Pattern name
 * @returns {boolean}
 */
function hasPattern(name) {
  return customPatterns.has(name);
}

/**
 * Get count of registered custom patterns
 * @returns {number}
 */
function getPatternCount() {
  return customPatterns.size;
}

module.exports = {
  registerPattern,
  unregisterPattern,
  getPattern,
  getAllCustomPatterns,
  clearAllPatterns,
  hasPattern,
  getPatternCount,
};
