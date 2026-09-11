# Contributing to Candlestick

Thank you for your interest in contributing! Your help is welcome and appreciated.

## How to Contribute

- **Bug Reports:** Please open an [issue](https://github.com/cm45t3r/candlestick/issues) with a clear description and, if possible, a minimal reproducible example.
- **Feature Requests:** Open an issue describing your idea and its use case.
- **Pull Requests:** Fork the repo, create a feature branch, and submit a pull request. Please describe your changes clearly.

## Coding Standards

- Use modern JavaScript (ES2020+).
- Keep code modular: each pattern or utility in its own file.
- Use descriptive names and add JSDoc comments to all exported functions.
- Follow the code style enforced by ESLint and Prettier.
- Ensure TypeScript definitions are updated for new functions (types/index.d.ts).
- Write tests for all new features (target 99%+ line coverage and 100% function coverage).

## Supported Node.js Versions

The package requires Node.js >= 20 (`package.json#engines`). CI runs the full
suite on **20.x, 22.x, 24.x and 26.x** across Linux, Windows and macOS, so a
change must pass on all four before it can merge. Develop on a version inside
that range; anything that only works on a newer runtime will fail the 20.x
jobs.

`.nvmrc` pins **20.19**, the floor, so `nvm use` puts you on the oldest
supported runtime — the one most likely to catch an accidental dependency on a
newer API.

The patch version in `.nvmrc` is deliberate: `c8`, the coverage tool, declares
`engines: ^20.19.0 || ^22.12.0 || >=23`, so an older 20.x installs it with an
`EBADENGINE` warning and `npm run coverage` may misbehave. If you see that
warning, update your local Node 20 (`nvm install 20.19`). This affects
contributors only — `c8` is a devDependency and never reaches anyone who
installs the package, whose requirement stays `>=20`.

## Running Tests

- Run all tests with:
  ```bash
  npm test
  ```
- Run tests in watch mode:
  ```bash
  npm run test:watch
  ```
- Check test coverage:
  ```bash
  npm run coverage
  ```
- Add or update tests for any new features or bug fixes.
- Target 99%+ line coverage and 100% function coverage for all modules.
- Include integration tests for complex features.

## Linting & Formatting

- Lint your code with:
  ```bash
  npm run lint
  ```
- Fix lint errors automatically with:
  ```bash
  npm run lint:fix
  ```
- Code is formatted with Prettier. Please run your editor’s formatter or use:
  ```bash
  npx prettier --write .
  ```

## Commit Messages

- Use clear, descriptive commit messages.
- Prefix with `feat:`, `fix:`, `docs:`, `test:`, or `chore:` as appropriate.

## Pull Request Checklist

- [ ] All tests pass (`npm test`)
- [ ] Lint passes (`npm run lint`)
- [ ] Code is formatted (Prettier)
- [ ] Coverage maintained or improved (`npm run coverage`)
- [ ] TypeScript definitions updated if API changed (`types/index.d.ts`)
- [ ] New/changed code is documented (JSDoc and/or README)
- [ ] Examples added/updated if relevant
- [ ] PR description explains the change
- [ ] No breaking changes (or clearly documented)

## Architecture

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed information about the project structure and design patterns.

## Adding New Patterns

When adding a new pattern:

1. Create pattern module in `src/newPattern.js`
2. Follow existing pattern structure (is\*, array functions)
3. Add comprehensive tests in `test/newPattern.test.js`
4. Register in `src/candlestick.js`
5. Add to `src/patternChain.js` allPatterns array
6. Update TypeScript definitions in `types/index.d.ts`
7. Update README.md pattern descriptions
8. Add example in `examples/` if helpful

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed guidelines.

## Code of Conduct

Be respectful and constructive. See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) if present.

---

Thank you for helping make Candlestick better!
