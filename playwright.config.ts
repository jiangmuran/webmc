import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env['CI'];

const noProxyEnv = {
  no_proxy: 'localhost,127.0.0.1,::1',
  NO_PROXY: 'localhost,127.0.0.1,::1',
};

const browserLaunchOptions = {
  args: ['--proxy-server=direct://', ...(isCI ? ['--no-sandbox'] : [])],
  env: {
    ...process.env,
    ...noProxyEnv,
  },
};

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  ...(isCI ? { workers: 1 } : {}),
  reporter: isCI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
    launchOptions: browserLaunchOptions,
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], launchOptions: browserLaunchOptions },
    },
    {
      name: 'chromium-mobile',
      use: { ...devices['Pixel 7'], launchOptions: browserLaunchOptions },
    },
  ],
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !isCI,
      timeout: 30_000,
      env: {
        ...noProxyEnv,
      },
    },
    {
      command: 'npm run signaling',
      url: 'http://localhost:7777/health',
      reuseExistingServer: !isCI,
      timeout: 15_000,
      env: {
        ...noProxyEnv,
      },
    },
  ],
});
