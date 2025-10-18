import { existsSync } from "fs";
import { decodeHollowKnightSave } from "./save-file-decoder.js";

/**
 * Parse Hollow Knight save file and extract statistics
 */
export async function readSaveFile(filePath: string): Promise<{
  success: boolean;
  data?: any;
  summary?: string;
  error?: string;
}> {
  try {
    // Check if file exists
    console.error(`[DEBUG] Checking if file exists: ${filePath}`);
    if (!existsSync(filePath)) {
      const errorMsg = `❌ ARCHIVO NO ENCONTRADO: ${filePath}\n\n` +
               `Ubicaciones comunes:\n` +
               `  Windows: %USERPROFILE%\\AppData\\LocalLow\\Team Cherry\\Hollow Knight\\\n` +
               `  Linux: ~/.config/unity3d/Team Cherry/Hollow Knight/\n` +
               `  macOS: ~/Library/Application Support/unity.Team Cherry.Hollow Knight/\n\n` +
               `Los archivos se llaman: user1.dat, user2.dat, user3.dat, o user4.dat`;
      console.error(errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }

    console.error(`[DEBUG] ✓ Archivo encontrado, decodificando...`);
    
    // Decode the save file using the decoder
    const saveData = await decodeHollowKnightSave(filePath);
    console.error(`[DEBUG] ✓ Save decodificado exitosamente`);
    console.error(`[DEBUG] Claves principales: ${Object.keys(saveData).slice(0, 10).join(', ')}`);

    // Extract key statistics
    console.error(`[DEBUG] Generando resumen...`);
    const summary = generateSummary(saveData);
    console.error(`[DEBUG] ✓ Resumen generado exitosamente`);

    return {
      success: true,
      data: saveData,
      summary,
    };
  } catch (error) {
    const errorMsg = `❌ ERROR INESPERADO:\n  ${error instanceof Error ? error.message : String(error)}\n  Stack: ${error instanceof Error ? error.stack : 'N/A'}`;
    console.error(errorMsg);
    return {
      success: false,
      error: errorMsg,
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
