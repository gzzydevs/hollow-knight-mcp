/**
 * Hollow Knight Save File Decoder
 * 
 * This implementation is based on the work by ReznoR from the repository:
 * https://github.com/ReznoRMichael/hollow-knight-completion-check
 * 
 * ReznoR passed away in 2022. We honor their contribution to the Hollow Knight community.
 */

import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { createRequire } from "module";

// Create require for CommonJS modules
const require = createRequire(import.meta.url);

// Import AES library (JavaScript file)
const aesjs = require("../lib/hk-analyzer/aes-js.js");

// AES decryption constants from the original code
const CSHARP_HEADER = [0, 1, 0, 0, 0, 255, 255, 255, 255, 1, 0, 0, 0, 0, 0, 0, 0, 6, 1, 0, 0, 0];
const BASE64_ARRAY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split("").map(c => c.charCodeAt(0));
const BASE64_DECODE_TABLE = new Map(BASE64_ARRAY.map((ord, i) => [ord, i]));
const AES_KEY = new TextEncoder().encode('UKu52ePUBwetZ9wNX88o54dnfKRu0T1l');
const ECB_STREAM_CIPHER = new aesjs.ModeOfOperation.ecb(AES_KEY);

/**
 * Removes C# header and LengthPrefixedString header from buffer
 */
function removeHeaders(buffer: Uint8Array): Uint8Array {
  buffer = buffer.subarray(CSHARP_HEADER.length, buffer.length - 1);
  
  let lengthCount = 0;
  for (let i = 0; i < 5; i++) {
    lengthCount++;
    if ((buffer[i] & 0x80) == 0) {
      break;
    }
  }
  
  return buffer.subarray(lengthCount);
}

/**
 * Base64 decode using the custom decode table
 */
function base64Decode(buffer: Uint8Array): Uint8Array {
  buffer = new Uint8Array(buffer).slice();
  buffer = buffer.map(v => BASE64_DECODE_TABLE.get(v)!);

  let p = buffer.indexOf(64);
  let end = p != -1 ? p : buffer.length;
  buffer = buffer.subarray(0, end);

  let output = new Uint8Array(3 * buffer.length / 4);
  let continuous = Math.floor(buffer.length / 4) * 4;

  for (let i = 0; i < continuous; i += 4) {
    let k = 3 * i / 4;
    output[k] = buffer[i] << 2 | buffer[i + 1] >> 4;
    output[k + 1] = (buffer[i + 1] & 0x0F) << 4 | buffer[i + 2] >> 2;
    output[k + 2] = (buffer[i + 2] & 0x03) << 6 | buffer[i + 3];
  }
  
  if (buffer[continuous] != undefined) {
    let k = 3 * continuous / 4;
    output[k] = buffer[continuous] << 2 | buffer[continuous + 1] >> 4;
    if (buffer[continuous + 2] != undefined) {
      output[k + 1] = (buffer[continuous + 1] & 0x0F) << 4 | buffer[continuous + 2] >> 2;
    }
  }

  return output;
}

/**
 * AES decryption with ECB mode and remove pkcs7 padding
 */
function aesDecryption(buffer: Uint8Array): Uint8Array {
  let output = ECB_STREAM_CIPHER.decrypt(buffer);
  return output.subarray(0, -output[output.length - 1]);
}

/**
 * Decrypt and decode a Hollow Knight save file
 * Returns the decoded JSON data
 */
export async function decodeHollowKnightSave(filePath: string): Promise<any> {
  console.error(`[DEBUG] Checking if file exists: ${filePath}`);
  
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  console.error(`[DEBUG] Reading file...`);
  let buffer = await readFile(filePath);
  let arrayBuffer: Uint8Array = new Uint8Array(buffer);
  
  console.error(`[DEBUG] File size: ${arrayBuffer.length} bytes`);
  console.error(`[DEBUG] Removing headers...`);
  arrayBuffer = removeHeaders(arrayBuffer) as Uint8Array;
  
  console.error(`[DEBUG] Decoding base64...`);
  arrayBuffer = base64Decode(arrayBuffer) as Uint8Array;
  
  console.error(`[DEBUG] Decrypting with AES...`);
  arrayBuffer = aesDecryption(arrayBuffer) as Uint8Array;
  
  console.error(`[DEBUG] Converting to string...`);
  const decodedString = new TextDecoder().decode(arrayBuffer);
  
  console.error(`[DEBUG] Parsing JSON...`);
  const saveData = JSON.parse(decodedString);
  
  console.error(`[DEBUG] ✓ Save file decoded successfully`);
  return saveData;
}
