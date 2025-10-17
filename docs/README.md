# Documentation Index

This directory contains additional documentation for the Candlestick library.

## Available Documentation

### [PLUGIN_API.md](./PLUGIN_API.md)

Complete guide to the plugin system for registering custom candlestick patterns.

**Covers:**

- Plugin registration API
- Pattern detection functions
- Metadata system
- Integration with patternChain
- Best practices and examples

### [CLI_GUIDE.md](./CLI_GUIDE.md)

Complete guide to the command-line interface for pattern detection.

**Covers:**

- Installation and usage
- Input formats (JSON, CSV, stdin)
- Output formats (JSON, table, CSV)
- Pattern filtering
- Confidence thresholds
- Examples and troubleshooting

---

## Main Documentation

For general library documentation, see:

- **[README.md](../README.md)** - Main library documentation, quick start, usage examples
- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Detailed architecture and design documentation
- **[CHANGELOG.md](../CHANGELOG.md)** - Release history and changes
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Contribution guidelines
- **[ROADMAP.md](../ROADMAP.md)** - Future features and planned improvements

---

## Examples

See the [`examples/`](../examples/) directory for working code examples of all patterns and features.

---

## TypeScript

TypeScript definitions are available in [`types/index.d.ts`](../types/index.d.ts).

```typescript
import { OHLC, PatternMatch, patternChain } from "candlestick";
```

---

For questions or issues, please visit the [GitHub repository](https://github.com/cm45t3r/candlestick).
