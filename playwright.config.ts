import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173/',
    trace: 'on-first-retry',
    actionTimeout: 5000,
  },
  projects: [
    // Dev profile: only Chromium
    {
      name: 'dev',
      use: { ...devices['Desktop Chrome'] },
    },
    // Full profile: all three browsers
    {
      name: 'chromium-full',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
}); 