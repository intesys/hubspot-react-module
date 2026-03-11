import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup",
  webServer: {
    command: "npx serve test/myModule.module -l 3000",
    port: 3000,
    reuseExistingServer: false,
  },
  use: {
    baseURL: "http://localhost:3000",
  },
});
