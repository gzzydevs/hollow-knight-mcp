import screenshot from "screenshot-desktop";

export interface ScreenshotResult {
  data: string;
  width?: number;
  height?: number;
}

/**
 * Capture a screenshot from the specified display
 * @param display Display number (0 for primary display)
 * @returns Screenshot as base64-encoded PNG
 */
export async function captureScreenshot(display: number = 0): Promise<ScreenshotResult> {
  try {
    // Get list of available displays
    const displays = await screenshot.listDisplays();
    
    if (displays.length === 0) {
      throw new Error("No displays found");
    }

    if (display < 0 || display >= displays.length) {
      throw new Error(
        `Invalid display ${display}. Available displays: 0-${displays.length - 1}`
      );
    }

    // Capture screenshot from the specified display
    const img = await screenshot({ screen: displays[display].id });
    
    // Convert buffer to base64
    const base64 = img.toString("base64");

    return {
      data: base64,
    };
  } catch (error) {
    throw new Error(
      `Failed to capture screenshot: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * List available displays
 */
export async function listDisplays(): Promise<Array<{ id: string; name: string }>> {
  try {
    const displays = await screenshot.listDisplays();
    return displays.map((display, index) => ({
      id: display.id,
      name: display.name || `Display ${index}`,
    }));
  } catch (error) {
    throw new Error(
      `Failed to list displays: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
