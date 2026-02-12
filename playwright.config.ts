import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  reporter: 'list',

  use: {
    baseURL: 'http://localhost:5173',
    /* Record video for every test */
    video: {
      mode: 'on',
      size: { width: 1280, height: 720 },
    },
    /* Viewport matches the video size for a crisp recording */
    viewport: { width: 1280, height: 720 },
    /* Use the dark color scheme to match our default theme */
    colorScheme: 'dark',
    /* Launch flags for headless / sandboxed environments */
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
      ],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Start the Vite dev server before tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: false,
    timeout: 15_000,
  },
})
