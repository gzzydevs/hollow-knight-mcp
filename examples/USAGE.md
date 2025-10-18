# Hollow Knight MCP Server - Usage Examples

## Example 1: Reading a Save File

When you want to analyze your Hollow Knight progress, you can use the `read_save_file` tool:

**Windows:**
```json
{
  "name": "read_save_file",
  "arguments": {
    "filePath": "C:\\Users\\YourUsername\\AppData\\LocalLow\\Team Cherry\\Hollow Knight\\user1.dat"
  }
}
```

**Linux:**
```json
{
  "name": "read_save_file",
  "arguments": {
    "filePath": "/home/username/.config/unity3d/Team Cherry/Hollow Knight/user1.dat"
  }
}
```

**macOS:**
```json
{
  "name": "read_save_file",
  "arguments": {
    "filePath": "/Users/username/Library/Application Support/unity.Team Cherry.Hollow Knight/user1.dat"
  }
}
```

### Expected Output

The tool will return:
- A human-readable summary of your progress
- Full JSON data of your save file
- Statistics including:
  - Current health and max health
  - Geo (currency) amount
  - Essence collected
  - Play time
  - Completion percentage
  - Acquired abilities (Dash, Wall Jump, Double Jump, etc.)
  - Charms owned
  - Spell levels
  - Boss kill tracking

## Example 2: Capturing a Screenshot

To capture a screenshot of your game for analysis:

**Basic usage (primary display):**
```json
{
  "name": "capture_game_screenshot",
  "arguments": {}
}
```

**Specific display:**
```json
{
  "name": "capture_game_screenshot",
  "arguments": {
    "display": 1
  }
}
```

### Expected Output

The tool will return:
- A base64-encoded PNG image
- The image can be sent to vision-capable LLMs for analysis

### Use Cases for Screenshots

1. **Enemy Identification**: "What enemy is this and how do I defeat it?"
2. **Puzzle Help**: "How do I solve this platforming section?"
3. **Navigation**: "Where should I go next?"
4. **Boss Strategy**: "What attack pattern is this boss using?"
5. **Charm Recommendations**: "What charms should I use for this area?"

## Example 3: Combined Analysis

You can combine both tools for comprehensive game assistance:

1. First, read your save file to understand your current abilities and progress
2. Then, capture a screenshot of where you're stuck
3. The LLM can provide contextual advice based on both your current abilities and the visual situation

**Example conversation flow:**
- User: "I'm stuck in this area, can you help?"
- Assistant uses `read_save_file` to see what abilities you have
- Assistant uses `capture_game_screenshot` to see the current situation
- Assistant provides specific advice: "Based on your save file, you have the Mothwing Cloak (dash) but not the Monarch Wings (double jump). Looking at the screenshot, you need to find an alternate path using your dash ability..."

## Finding Your Save Files

### Windows
1. Press `Win + R` to open Run dialog
2. Type: `%USERPROFILE%\AppData\LocalLow\Team Cherry\Hollow Knight`
3. Press Enter
4. Look for files named `user1.dat`, `user2.dat`, `user3.dat`, or `user4.dat`

### Linux
1. Open terminal
2. Navigate to: `~/.config/unity3d/Team Cherry/Hollow Knight/`
3. Look for files named `user1.dat`, `user2.dat`, `user3.dat`, or `user4.dat`

### macOS
1. Open Finder
2. Press `Cmd + Shift + G`
3. Enter: `~/Library/Application Support/unity.Team Cherry.Hollow Knight/`
4. Look for files named `user1.dat`, `user2.dat`, `user3.dat`, or `user4.dat`

## Tips

- **Multiple Save Slots**: Hollow Knight supports 4 save slots (user1.dat through user4.dat)
- **Backup Your Saves**: Always backup your save files before analyzing them
- **Steel Soul Mode**: The save reader can detect Steel Soul (permadeath) mode
- **Screenshot Timing**: Make sure Hollow Knight is in focus when capturing screenshots
- **Multi-Monitor**: If you play on a secondary monitor, use the `display` parameter
