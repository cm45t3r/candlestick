# 📚 Documentation Index - Candlestick Library

Complete guide to all documentation in the Candlestick library.

---

## 🚀 Getting Started

**Start here if you're new:**

1. [README.md](./README.md) - Main documentation, quick start, API overview
2. [examples/](./examples/) - Working code examples
3. [CHANGELOG.md](./CHANGELOG.md) - See what's new in v1.1.0

---

## 📖 Core Documentation

### [README.md](./README.md)

**Main library documentation**

- Quick Start (CommonJS, ESM, TypeScript)
- Installation
- Usage examples
- All 19 patterns documented (29 variants)
- Pattern chaining
- Data validation
- Plugin system basics
- Streaming API
- FAQ

### [ARCHITECTURE.md](./ARCHITECTURE.md)

**Technical architecture guide**

- Design principles
- Directory structure
- Core components
- Data flow
- Performance optimizations
- Pattern implementation guidelines
- Future considerations

### [CHANGELOG.md](./CHANGELOG.md)

**Release history**

- v1.2.0 (2025-10-18) - Latest
  - 3 new patterns (Marubozu, Spinning Top, Tweezers)
  - Streaming API for large datasets
  - Property-based testing
  - 306 tests, 99.75% coverage
- v1.1.0 (2025-10-17)
  - 6 new patterns
  - ESM support, TypeScript, Plugin system
- Previous versions

### [ROADMAP.md](./ROADMAP.md)

**Future plans**

- Near-term goals (mostly ✅ completed)
- Medium-term goals (🔜 planned)
- Long-term goals
- Community feedback

---

## 🔌 Advanced Features

### [docs/PLUGIN_API.md](./docs/PLUGIN_API.md)

**Plugin system complete guide**

- API reference
- registerPattern(), unregisterPattern(), etc.
- Pattern detection functions
- Metadata system
- Integration with patternChain
- Best practices
- Examples

---

## 🤝 Contributing

### [CONTRIBUTING.md](./CONTRIBUTING.md)

**How to contribute**

- Bug reports and feature requests
- Coding standards
- Running tests
- Linting & formatting
- Pull request checklist
- Adding new patterns guide

### [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

**Community standards**

- Expected behavior
- Enforcement

### [SECURITY.md](./SECURITY.md)

**Security policy**

- Reporting vulnerabilities
- Security best practices

---

## 💻 Code Examples

### [examples/README.md](./examples/README.md)

**Examples guide**

- How to run examples
- Available examples (14 total):
  - Single candle patterns (3)
  - Two candle patterns (4)
  - Multi-pattern detection (5)
  - Utilities (1)
  - Metadata (1)

---

## 📊 Quick Reference

### File Structure

```
candlestick/
├── README.md                 # Start here
├── ARCHITECTURE.md           # Technical details
├── CHANGELOG.md              # What's new
├── ROADMAP.md                # Future plans
├── CONTRIBUTING.md           # How to contribute
├── docs/
│   ├── README.md             # Docs index
│   └── PLUGIN_API.md         # Plugin guide
├── examples/
│   ├── README.md             # Examples guide
│   └── *.js, *.mjs           # 11 working examples
└── types/
    └── index.d.ts            # TypeScript definitions
```

### Quick Links

**For Users:**

- [Quick Start](./README.md#quick-start)
- [Pattern Descriptions](./README.md#pattern-descriptions)
- [CLI Tool Guide](./docs/CLI_GUIDE.md) ⭐ NEW
- [Examples](./examples/)
- [FAQ](./README.md#faq)

**For Developers:**

- [Architecture](./ARCHITECTURE.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Plugin API](./docs/PLUGIN_API.md)
- [TypeScript Definitions](./types/index.d.ts)

**For Traders:**

- [Pattern Metadata](./README.md#metadata-system)
- [Confidence Scores](./examples/metadata.js)
- [CLI Tool](./docs/CLI_GUIDE.md)

**For Maintainers:**

- [Changelog](./CHANGELOG.md)
- [Roadmap](./ROADMAP.md)
- [Security Policy](./SECURITY.md)

**docs/ Directory:**

The `docs/` directory contains specialized guides:

- [PLUGIN_API.md](./docs/PLUGIN_API.md) - Complete plugin development guide
- [CLI_GUIDE.md](./docs/CLI_GUIDE.md) - Command-line tool documentation

---

## 📊 Stats

- **Total Docs:** 10 markdown files (essential documentation)
- **Examples:** 14 working examples
- **Patterns Documented:** 19 unique patterns (29 variants)
- **API Functions Documented:** 53+
- **Tests:** 306 (99.75% coverage)
- **CLI Commands:** 1 (candlestick)
- **Metadata System:** Complete (confidence, type, strength, direction)
- **Streaming API:** Available for large datasets
- **Last Updated:** October 18, 2025 (v1.2.0)

---

## 🔍 Search by Topic

**Patterns:**

- See [README.md - Pattern Descriptions](./README.md#pattern-descriptions)
- See [examples/](./examples/) for code

**TypeScript:**

- See [types/index.d.ts](./types/index.d.ts)
- See [README.md - TypeScript usage](./README.md#typescript)

**ESM:**

- See [README.md - ESM usage](./README.md#esm-modern-javascript)
- See [examples/esm-example.mjs](./examples/esm-example.mjs)

**Plugins:**

- See [docs/PLUGIN_API.md](./docs/PLUGIN_API.md)
- See [README.md - Plugin System](./README.md#plugin-system-new)

**Validation:**

- See [README.md - Data Validation](./README.md#data-validation-new)
- See [ARCHITECTURE.md - Validation](./ARCHITECTURE.md)

**Metadata:**

- See [examples/metadata.js](./examples/metadata.js)
- See [src/patternMetadata.js](./src/patternMetadata.js)

**CLI:**

- See [docs/CLI_GUIDE.md](./docs/CLI_GUIDE.md)
- Run `candlestick --help`

**Contributing:**

- See [CONTRIBUTING.md](./CONTRIBUTING.md)
- See [ARCHITECTURE.md - Pattern Implementation](./ARCHITECTURE.md#pattern-implementation-guidelines)

---

**Need help?** Open an [issue](https://github.com/cm45t3r/candlestick/issues) on GitHub.
