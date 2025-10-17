# CLI Tool Guide - Candlestick Pattern Detection

The Candlestick library includes a command-line interface for detecting patterns in CSV or JSON files.

## Installation

After installing the package:

```bash
npm install -g candlestick
```

Or use locally:

```bash
npm install candlestick
npx candlestick --help
```

## Basic Usage

### Detect Patterns in JSON File

```bash
candlestick -i data.json
```

### Detect Patterns in CSV File

```bash
candlestick -i data.csv --output table
```

### Use with Pipes (stdin)

```bash
cat data.json | candlestick --output table
```

## Options

| Option               | Short | Description                                     | Default |
| -------------------- | ----- | ----------------------------------------------- | ------- |
| `--input <file>`     | `-i`  | Input CSV or JSON file                          | stdin   |
| `--output <format>`  | `-o`  | Output format: json, table, csv                 | json    |
| `--patterns <list>`  | `-p`  | Comma-separated pattern names                   | all     |
| `--confidence <min>` | `-c`  | Minimum confidence threshold (0-1)              | 0       |
| `--type <type>`      | `-t`  | Filter by type: reversal, continuation, neutral | none    |
| `--direction <dir>`  | `-d`  | Filter by direction: bullish, bearish, neutral  | none    |
| `--validate`         |       | Validate OHLC data before processing            | false   |
| `--metadata`         |       | Include pattern metadata in output              | false   |
| `--help`             | `-h`  | Show help message                               |         |

## Input Formats

### JSON Format

```json
[
  { "open": 10, "high": 15, "low": 8, "close": 12 },
  { "open": 12, "high": 16, "low": 11, "close": 14 }
]
```

### CSV Format

```csv
open,high,low,close
10,15,8,12
12,16,11,14
```

**Note:** First line must contain headers: `open,high,low,close`

## Output Formats

### JSON Output

```bash
candlestick -i data.json --output json --metadata
```

```json
[
  {
    "index": 0,
    "pattern": "piercingLine",
    "match": [...],
    "metadata": {
      "type": "reversal",
      "direction": "bullish",
      "confidence": 0.8,
      "strength": "strong",
      "description": "Bullish reversal piercing into bearish candle"
    }
  }
]
```

### Table Output

```bash
candlestick -i data.json --output table --metadata
```

```
┌─────────┬─────────────────────┬────────────┬────────────┬────────────┐
│  Index  │       Pattern       │    Type    │ Confidence │  Strength  │
├─────────┼─────────────────────┼────────────┼────────────┼────────────┤
│ 0       │ piercingLine        │ reversal   │ 0.80       │ strong     │
│ 2       │ darkCloudCover      │ reversal   │ 0.80       │ strong     │
└─────────┴─────────────────────┴────────────┴────────────┴────────────┘
```

### CSV Output

```bash
candlestick -i data.json --output csv --metadata
```

```csv
index,pattern,type,direction,confidence,strength
0,piercingLine,reversal,bullish,0.8,strong
2,darkCloudCover,reversal,bearish,0.8,strong
```

## Examples

### Detect Specific Patterns

```bash
candlestick -i data.json --patterns hammer,doji,engulfing
```

### High Confidence Patterns Only

```bash
candlestick -i data.json --confidence 0.85 --output table --metadata
```

### Bullish Reversal Patterns

```bash
candlestick -i data.json --type reversal --direction bullish --metadata
```

### Validate Data Before Processing

```bash
candlestick -i data.json --validate --output table
```

### Pipeline Processing

```bash
# Download data and detect patterns
curl https://api.example.com/ohlc | candlestick --output csv

# Process multiple files
for file in data/*.json; do
  candlestick -i "$file" --confidence 0.8 --output csv
done
```

## Pattern Names

Use these names with the `--patterns` option:

**Single Candle:**

- `hammer`, `bullishHammer`, `bearishHammer`
- `invertedHammer`, `bullishInvertedHammer`, `bearishInvertedHammer`
- `doji`

**Two Candles:**

- `bullishEngulfing`, `bearishEngulfing`
- `bullishHarami`, `bearishHarami`
- `bullishKicker`, `bearishKicker`
- `hangingMan`, `shootingStar`
- `piercingLine`, `darkCloudCover`

**Three Candles:**

- `morningStar`, `eveningStar`
- `threeWhiteSoldiers`, `threeBlackCrows`

## Advanced Usage

### Filter Strong Bullish Signals

```bash
candlestick -i data.json \
  --direction bullish \
  --confidence 0.85 \
  --output table \
  --metadata
```

### Export for Further Processing

```bash
# Get high-confidence patterns as CSV
candlestick -i data.json --confidence 0.8 --output csv > high-confidence.csv

# Process with jq
candlestick -i data.json --output json | jq '.[] | select(.index > 10)'
```

### Validation Mode

```bash
# Validate data without detection
candlestick -i suspicious-data.json --validate --patterns doji
```

If data is invalid, the CLI will exit with error code 1 and show descriptive error message.

## Exit Codes

- `0`: Success
- `1`: Error (invalid data, file not found, etc.)

## Performance

The CLI tool uses the same high-performance engine as the library:

- **Throughput:** 37,000+ candles/second
- **Memory:** Efficient for large datasets
- **Patterns:** All 21 pattern variants

## TypeScript Users

The CLI can be used programmatically:

```typescript
import { readInput, processData } from "candlestick/cli";

const data = readInput("data.json");
const results = processData(data, { confidence: 0.8 });
```

## Troubleshooting

**"CSV must have headers"**

- Ensure first line has: `open,high,low,close`

**"Invalid OHLC data"**

- Use `--validate` flag to see specific validation errors
- Check that high >= low, high >= open/close, etc.

**"Unsupported file format"**

- Only .json and .csv files are supported
- Or use stdin with JSON data

## More Information

- [README.md](../README.md) - Main documentation
- [examples/](../examples/) - Code examples
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Technical details

---

**CLI Tool is part of Candlestick v1.1.0+**
