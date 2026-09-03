import { defineConfig, devices } from "@playwright/test"

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000"
const isLocalBaseURL = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(
  baseURL
)
const shouldStartWebServer =
  isLocalBaseURL && process.env.PLAYWRIGHT_SKIP_WEB_SERVER !== "1"
const shouldReuseExistingServer =
  process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === "1"

export default defineConfig({
  testDir: "./tests/critical-flows",
  outputDir: "test-results/critical-flows",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "desktop-webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-webkit",
      use: { ...devices["iPhone 15"] },
    },
  ],
  webServer: shouldStartWebServer
    ? {
        command:
          process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ||
          (process.env.CI
            ? "pnpm start --hostname 127.0.0.1"
            : "pnpm dev --hostname 127.0.0.1"),
        env: {
          ...process.env,
          CRITICAL_FLOW_TESTING: "1",
          GETTING_STARTED_FLOW_EXPERIMENT_ENABLED:
            process.env.GETTING_STARTED_FLOW_EXPERIMENT_ENABLED ?? "true",
          NEXT_PUBLIC_DEFAULT_SITE_URL: baseURL,
        },
        url: baseURL,
        reuseExistingServer: shouldReuseExistingServer,
        timeout: 180_000,
      }
    : undefined,
})
