import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/studio",
  timeout: 30_000,
  use: {
    baseURL: "https://ai-game-studio-one.vercel.app",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
});
