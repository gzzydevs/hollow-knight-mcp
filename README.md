# Hollow Knight MCP Server

A Model Context Protocol (MCP) server for Hollow Knight that provides tools to analyze save files and capture game screenshots.

## Features

- **Save File Analysis**: Read and parse Hollow Knight save files to extract detailed game statistics, progress, abilities, and player data
- **Screenshot Capture**: Capture screenshots of the game for visual analysis by LLMs

## Installation

```bash
npm install
npm run build
```

## Usage

This MCP server is designed to be used with MCP-compatible clients. Add it to your MCP client configuration:

```json
{
  "mcpServers": {
    "hollow-knight": {
      "command": "node",
      "args": ["/path/to/hollow-knight-mcp/dist/index.js"]
    }
  }
}
```

Or use `npx` if published to npm:

```json
{
  "mcpServers": {
    "hollow-knight": {
      "command": "npx",
      "args": ["hollow-knight-mcp"]
    }
  }
}
```

## Available Tools

### 1. read_save_file

Reads and analyzes a Hollow Knight save file to extract game statistics and progress.

**Parameters:**
- `filePath` (required): Path to the Hollow Knight save file

**Save File Locations:**
- **Windows**: `%USERPROFILE%\AppData\LocalLow\Team Cherry\Hollow Knight\`
- **Linux**: `~/.config/unity3d/Team Cherry/Hollow Knight/`
- **macOS**: `~/Library/Application Support/unity.Team Cherry.Hollow Knight/`

Save files are typically named `user1.dat`, `user2.dat`, `user3.dat`, or `user4.dat`.

**Example:**
```typescript
{
  "filePath": "/home/user/.config/unity3d/Team Cherry/Hollow Knight/user1.dat"
}
```

**Returns:**
- Player stats (health, geo, essence)
- Play time
- Completion percentage
- Acquired abilities and items
- Charms owned
- Spell levels
- Boss kill tracking
- Full save data for advanced analysis

### 2. capture_game_screenshot

Captures a screenshot of the current screen to capture Hollow Knight gameplay.

**Parameters:**
- `display` (optional): Display/monitor number to capture (default: 0 for primary display)

**Example:**
```typescript
{
  "display": 0
}
```

**Returns:**
- Base64-encoded PNG image
- Can be sent directly to LLMs for visual analysis

## Use Cases

### Save File Analysis
- Track your game progress and completion percentage
- Check which abilities and items you've acquired
- Monitor geo (currency) and essence collection
- Verify Steel Soul mode status
- Analyze play time and statistics

### Screenshot Analysis
- Get help identifying enemies or bosses
- Receive guidance on puzzle solutions
- Analyze platforming challenges
- Document your gameplay progress
- Share game state for troubleshooting

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

## Project Structure

```
hollow-knight-mcp/
├── src/
│   ├── index.ts              # Main MCP server
│   ├── tools/
│   │   ├── save-reader.ts    # Save file parsing logic
│   │   └── screenshot.ts     # Screenshot capture logic
│   └── types/
│       └── screenshot-desktop.d.ts  # Type definitions
├── dist/                     # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Technical Details

### Save File Format

Hollow Knight save files are JSON-based files that contain:
- Player statistics (health, geo, essence)
- Game progress flags
- Ability and item acquisition status
- Charm inventory
- Spell upgrades
- Boss kill tracking
- Location and scene data

The save reader parses this JSON and extracts meaningful statistics, presenting them in both structured and human-readable formats.

### Screenshot Technology

Screenshots are captured using `screenshot-desktop`, which provides cross-platform screen capture capabilities. The screenshots are:
- Captured as PNG images
- Encoded in base64 for easy transmission
- Compatible with MCP image content type
- Suitable for analysis by vision-capable LLMs

## License

MIT
