# Project Structure

## Organization Philosophy

Flat, module-per-concern layout. Source code is not feature-foldered — each pattern and subsystem is a single file at the `src/` level. Tests mirror `src/` 1-to-1 under `test/`. There are no nested sub-packages.

## Directory Patterns

### Pattern Modules (`src/`)

**Location**: `/src/`
**Purpose**: One `.js` file per pattern or subsystem. Each file is self-contained CommonJS and exports named functions.
**Import rule**: Pattern modules import `utils.js` for geometry helpers. Pattern modules that share geometry with another pattern (e.g., `reversal.js` reuses `isBearishHammer` from `hammer.js`) may also import sibling pattern modules.
**Example**: `src/hammer.js` exports `{ isHammer, isBullishHammer, isBearishHammer, hammer, bullishHammer, bearishHammer }`

### Shared Utilities (`src/utils.js`)

**Location**: `/src/utils.js`
**Purpose**: Pure geometric and structural helpers (`bodyLen`, `wickLen`, `tailLen`, `bodyEnds`, `isBullish`, `isBearish`, `hasGapUp`, `hasGapDown`, `isEngulfed`, `findPattern`, `precomputeCandleProps`, `validateOHLC`, `validateOHLCArray`). No pattern logic lives here. No imports.

### Aggregator and Entry Points

- `src/candlestick.js` — re-exports everything from all pattern modules; the canonical CJS entry
- `index.js` — thin proxy: `module.exports = require("./src/candlestick")`
- `src/index.mjs` — ESM re-export surface
- `src/patternChain.js` — `patternChain` function + `allPatterns` registry

### Subsystem Modules (`src/`)

Beyond pattern modules, several purpose-specific modules live at the same `src/` level:

- `src/utils.js` — pure geometric/structural helpers (no pattern logic; no imports)
- `src/patternMetadata.js` — metadata system for pattern confidence and strength; consumed by patternChain
- `src/pluginManager.js` — plugin registry (`registerPattern`, `getCustomPatterns`); powers the extensibility API
- `src/streaming.js` — chunk-based streaming processor; imports from `../index.js` for pattern access

### Type Definitions (`types/`)

**Location**: `/types/index.d.ts`
**Purpose**: Hand-authored TypeScript declarations for all exported functions and interfaces. Updated manually when public API changes.

### Tests (`test/`)

**Location**: `/test/`
**Purpose**: Node.js built-in test runner files. Named `<module>.test.js` to match source files exactly.
**Special files**: `integration.test.js` (cross-module scenarios), `property.test.js` (fast-check invariants), `validation.test.js` (OHLC validation edge cases)
**CLI tests**: The CLI is covered by three dedicated files (`cli.test.js`, `cli-main.test.js`, `cli-output.test.js`) — CLI testing is split by concern rather than following strict 1-to-1 mirroring.

### CLI (`cli/`, `bin/`)

**Location**: `/cli/index.js`, `/bin/candlestick`
**Purpose**: Command-line interface for CSV/JSON file analysis. Separate from the library API; not re-exported from `src/`.

### Examples (`examples/`)

**Location**: `/examples/`
**Purpose**: Runnable, copy-pasteable usage files. One file per pattern or feature group. Not part of the published API.

### Documentation (`docs/`)

**Location**: `/docs/`
**Purpose**: Supplementary guides (`CLI_GUIDE.md`, `PLUGIN_API.md`). Narrative documentation beyond README scope.

## Naming Conventions

- **Source files**: `camelCase.js` matching the exported function group (e.g., `darkCloudCover.js`)
- **Test files**: `<sourceFile>.test.js`
- **Exported functions**: `camelCase` — boolean checkers prefixed `is` (e.g., `isHammer`), array scanners use the pattern name directly (e.g., `hammer`, `bullishHammer`)
- **Pattern variants**: directional prefix `bullish` / `bearish` before the pattern name

## Code Organization Principles

- Each pattern module follows the same structure: import `{ findPattern, precomputeCandleProps }` from utils, define `is*` boolean function(s), define array-scanning wrapper(s) that call `precomputeCandleProps` then `findPattern`, then export all.
- `patternChain.js` owns the `allPatterns` registry — adding a new pattern requires a new module + a new entry in `allPatterns`.
- `paramCount` on every pattern definition is the single source of truth for how many consecutive candles a pattern consumes.
- No circular dependencies: `utils.js` has no imports; pattern modules import only `utils.js`; `patternChain.js` imports pattern modules; `candlestick.js` imports everything.

---
_Document patterns, not file trees. New files following patterns shouldn't require updates_
