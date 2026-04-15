# Technology Stack

## Architecture

Pure JavaScript library with no runtime dependencies. Source logic lives in `src/` as individual CommonJS modules (one per pattern), aggregated via `src/candlestick.js`. Dual-format distribution: CJS via `index.js` (proxies to `src/candlestick.js`) and ESM via `src/index.mjs`. TypeScript consumers use `types/index.d.ts`.

## Core Technologies

- **Language**: JavaScript (ES2020+), with full TypeScript type definitions
- **Module formats**: CommonJS (`.js`) and ESM (`.mjs`) — dual export via `package.json` `exports` field
- **Runtime**: Node.js >= 18

## Key Libraries

- **fast-check** — property-based testing (dev only); generates 1000+ OHLC scenarios per invariant
- **c8** — V8-native coverage; targets 99%+ line coverage, 97%+ branch coverage
- **ESLint** (flat config) + **Prettier** — code quality and formatting

No production runtime dependencies.

## Development Standards

### Code Quality

- ESLint flat config (`eslint.config.js`): `@eslint/js` recommended + `eslint-config-prettier`
- Rules: `no-unused-vars` (error), `eqeqeq` (error), `no-console` (warn)
- `.mjs` files use `sourceType: "module"` with console allowed (used in examples)
- Prettier for formatting; `format:check` enforced in CI

### Testing

- Built-in Node.js test runner (`node --test`), no external test framework
- Test files mirror source: `test/<module>.test.js`
- Three test categories: unit (per pattern), integration (`integration.test.js`), property-based (`property.test.js`)
- Coverage via `c8`; run with `npm run coverage`

### Type Safety

- TypeScript definitions maintained manually in `types/index.d.ts`
- Key exported types: `OHLC`, `OHLCExtended`, `PatternMatch`, `PatternDefinition`, `PatternMetadata`
- No TypeScript compiler in the build pipeline — `.d.ts` files are hand-authored

## Development Environment

### Required Tools

- Node.js >= 18

### Common Commands

```bash
# Lint:     npm run lint
# Format:   npm run format
# Test:     npm test
# Watch:    npm run test:watch
# Coverage: npm run coverage
# Bench:    npm run bench
```

### Pre-publish Gate

`prepublishOnly` runs `lint` then `test` — both must pass before any npm publish.

## Key Technical Decisions

- **One module per pattern**: Keeps each pattern independently auditable and tree-shakeable; avoids a monolithic file.
- **`precomputeCandleProps` caching**: All series-level functions precompute `bodyLen`, `wickLen`, `tailLen`, `isBullish`, `isBearish`, `bodyEnds` once per call, avoiding redundant arithmetic across multi-pattern scans.
- **`paramCount` on pattern definitions**: Drives `findPattern` loop bounds and `patternChain` match slicing without pattern-specific branching.
- **No mutation**: All functions return new objects; caller data is never modified.
- **Streaming via overlap buffer**: `createStream` retains a trailing overlap of `maxPatternSize - 1` candles between chunks to detect patterns that span chunk boundaries.

---
_Document standards and patterns, not every dependency_
