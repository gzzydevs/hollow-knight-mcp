declare module "screenshot-desktop" {
  interface Display {
    id: string;
    name: string;
  }

  interface ScreenshotOptions {
    screen?: string;
    format?: "png" | "jpg";
  }

  function screenshot(options?: ScreenshotOptions): Promise<Buffer>;

  namespace screenshot {
    function listDisplays(): Promise<Display[]>;
  }

  export = screenshot;
}
