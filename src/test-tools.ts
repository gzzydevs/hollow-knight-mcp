#!/usr/bin/env node

import { readSaveFile } from "./tools/save-reader.js";

console.log("Testing Hollow Knight MCP Server Tools\n");

// Test 1: Read save file
console.log("=== Test 1: Read Save File ===");
const testSavePath = "/tmp/hollow-knight-test/test-save.dat";
const saveResult = await readSaveFile(testSavePath);

if (saveResult.success) {
  console.log("✓ Successfully read save file");
  console.log("\nSummary:");
  console.log(saveResult.summary);
  console.log("\nRaw data available:", Object.keys(saveResult.data || {}).length, "keys");
} else {
  console.log("✗ Failed to read save file:", saveResult.error);
}

// Test 2: Test error handling
console.log("\n=== Test 2: Error Handling ===");
const invalidResult = await readSaveFile("/tmp/nonexistent.dat");
if (!invalidResult.success && invalidResult.error) {
  console.log("✓ Error handling works correctly");
  console.log("Error message:", invalidResult.error.split('\n')[0]);
} else {
  console.log("✗ Error handling failed");
}

console.log("\n=== All Tests Complete ===");
