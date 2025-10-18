import { readFile } from "fs/promises";
import { existsSync } from "fs";

/**
 * Hollow Knight save file structure
 * The save files are JSON-based but may contain additional metadata
 */
export interface HollowKnightSaveData {
  // Player stats
  health?: number;
  maxHealth?: number;
  maxHealthBase?: number;
  geo?: number;
  
  // Progress
  playTime?: number;
  completionPercentage?: number;
  permadeathMode?: number;
  
  // Location
  playerData?: {
    health?: number;
    maxHealth?: number;
    geo?: number;
    permadeathMode?: number;
    dreamOrbs?: number;
  };
  
  // Abilities and items
  hasMap?: boolean;
  hasQuill?: boolean;
  hasDash?: boolean;
  hasWallJump?: boolean;
  hasDoubleJump?: boolean;
  hasSuperDash?: boolean;
  hasDreamNail?: boolean;
  hasKingsBrand?: boolean;
  hasShadowDash?: boolean;
  hasAcidArmour?: boolean;
  
  // Charms
  charms?: number;
  charmsOwned?: number;
  
  // Skills
  fireballLevel?: number;
  quakeLevel?: number;
  screamLevel?: number;
  
  // Completion tracking
  killedBigFly?: boolean;
  killedBigBee?: boolean;
  killedMageLord?: boolean;
  killedBlackKnight?: boolean;
  
  // Raw data for anything we didn't parse
  [key: string]: any;
}

/**
 * Parse Hollow Knight save file and extract statistics
 */
export async function readSaveFile(filePath: string): Promise<{
  success: boolean;
  data?: HollowKnightSaveData;
  summary?: string;
  error?: string;
}> {
  try {
    // Check if file exists
    if (!existsSync(filePath)) {
      return {
        success: false,
        error: `Save file not found: ${filePath}. Common locations:\n` +
               `Windows: %USERPROFILE%\\AppData\\LocalLow\\Team Cherry\\Hollow Knight\\\n` +
               `Linux: ~/.config/unity3d/Team Cherry/Hollow Knight/\n` +
               `macOS: ~/Library/Application Support/unity.Team Cherry.Hollow Knight/`,
      };
    }

    // Read the file
    const fileContent = await readFile(filePath, "utf-8");
    
    // Try to parse as JSON
    let saveData: any;
    try {
      saveData = JSON.parse(fileContent);
    } catch (parseError) {
      // If JSON parsing fails, the file might be encrypted or in a different format
      // Hollow Knight save files are actually JSON, but might have different structure
      return {
        success: false,
        error: "Unable to parse save file. The file may be corrupted or in an unexpected format.",
      };
    }

    // Extract key statistics
    const summary = generateSummary(saveData);

    return {
      success: true,
      data: saveData,
      summary,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Generate a human-readable summary of the save data
 */
function generateSummary(data: any): string {
  const lines: string[] = ["=== Hollow Knight Save File Summary ===\n"];

  // Player stats
  if (data.playerData) {
    const pd = data.playerData;
    lines.push("Player Stats:");
    if (pd.health !== undefined && pd.maxHealth !== undefined) {
      lines.push(`  Health: ${pd.health}/${pd.maxHealth}`);
    }
    if (pd.maxHealthBase !== undefined) {
      lines.push(`  Base Max Health: ${pd.maxHealthBase}`);
    }
    if (pd.geo !== undefined) {
      lines.push(`  Geo: ${pd.geo}`);
    }
    if (pd.dreamOrbs !== undefined) {
      lines.push(`  Essence: ${pd.dreamOrbs}`);
    }
    if (pd.permadeathMode !== undefined) {
      lines.push(`  Steel Soul Mode: ${pd.permadeathMode > 0 ? 'Yes' : 'No'}`);
    }
    lines.push("");
  }

  // Play time
  if (data.playTime !== undefined) {
    const hours = Math.floor(data.playTime / 3600);
    const minutes = Math.floor((data.playTime % 3600) / 60);
    lines.push(`Play Time: ${hours}h ${minutes}m`);
    lines.push("");
  }

  // Completion percentage
  if (data.completionPercentage !== undefined) {
    lines.push(`Completion: ${data.completionPercentage}%`);
    lines.push("");
  }

  // Key abilities
  const abilities: string[] = [];
  if (data.hasMap) abilities.push("Map");
  if (data.hasQuill) abilities.push("Quill");
  if (data.hasDash) abilities.push("Mothwing Cloak");
  if (data.hasWallJump) abilities.push("Mantis Claw");
  if (data.hasDoubleJump) abilities.push("Monarch Wings");
  if (data.hasSuperDash) abilities.push("Crystal Heart");
  if (data.hasDreamNail) abilities.push("Dream Nail");
  if (data.hasKingsBrand) abilities.push("King's Brand");
  if (data.hasShadowDash) abilities.push("Shade Cloak");
  if (data.hasAcidArmour) abilities.push("Isma's Tear");

  if (abilities.length > 0) {
    lines.push("Abilities Acquired:");
    lines.push(`  ${abilities.join(", ")}`);
    lines.push("");
  }

  // Charms
  if (data.charmsOwned !== undefined) {
    lines.push(`Charms Owned: ${data.charmsOwned}`);
    lines.push("");
  }

  // Spell levels
  const spells: string[] = [];
  if (data.fireballLevel !== undefined && data.fireballLevel > 0) {
    spells.push(`Vengeful Spirit (Level ${data.fireballLevel})`);
  }
  if (data.quakeLevel !== undefined && data.quakeLevel > 0) {
    spells.push(`Desolate Dive (Level ${data.quakeLevel})`);
  }
  if (data.screamLevel !== undefined && data.screamLevel > 0) {
    spells.push(`Howling Wraiths (Level ${data.screamLevel})`);
  }

  if (spells.length > 0) {
    lines.push("Spells:");
    lines.push(`  ${spells.join(", ")}`);
    lines.push("");
  }

  return lines.join("\n");
}
