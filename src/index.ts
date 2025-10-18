#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readSaveFile } from "./tools/save-reader.js";
import { captureScreenshot } from "./tools/screenshot.js";

// Create MCP server
const server = new Server(
  {
    name: "hollow-knight-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "read_save_file",
        description:
          "Reads and analyzes a Hollow Knight save file to extract game statistics, progress, and player data. " +
          "The save file is typically located in: " +
          "Windows: %USERPROFILE%\\AppData\\LocalLow\\Team Cherry\\Hollow Knight\\ " +
          "Linux: ~/.config/unity3d/Team Cherry/Hollow Knight/ " +
          "macOS: ~/Library/Application Support/unity.Team Cherry.Hollow Knight/",
        inputSchema: {
          type: "object",
          properties: {
            filePath: {
              type: "string",
              description: "Path to the Hollow Knight save file (e.g., user1.dat, user2.dat, user3.dat, or user4.dat)",
            },
          },
          required: ["filePath"],
        },
      },
      {
        name: "capture_game_screenshot",
        description:
          "Captures a screenshot of the current screen (to capture Hollow Knight gameplay). " +
          "The screenshot is returned as a base64-encoded PNG image that can be sent to an LLM for analysis. " +
          "This is useful for analyzing game state, identifying enemies, or getting help with puzzles.",
        inputSchema: {
          type: "object",
          properties: {
            display: {
              type: "number",
              description: "Display/monitor number to capture (0 for primary display). Optional, defaults to 0.",
              default: 0,
            },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "read_save_file": {
        if (!args || typeof args.filePath !== "string") {
          throw new Error("filePath is required and must be a string");
        }
        const result = await readSaveFile(args.filePath);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "capture_game_screenshot": {
        const display = args?.display ?? 0;
        const screenshot = await captureScreenshot(display as number);
        return {
          content: [
            {
              type: "image",
              data: screenshot.data,
              mimeType: "image/png",
            },
            {
              type: "text",
              text: `Screenshot captured from display ${display}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log to stderr so it doesn't interfere with MCP communication
  console.error("Hollow Knight MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
