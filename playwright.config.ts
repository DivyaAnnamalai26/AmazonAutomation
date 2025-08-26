import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  workers: 1,
  testDir: './src/tests',
  timeout: 60000,
  retries: 1,
  use: {
    headless: true,
    screenshot: { mode: 'on', fullPage: true },
    video: { mode: 'on', size: { width: 1280, height: 720 } },
    trace: 'retain-on-failure',
    baseURL: process.env.BASE_URL || 'https://www.amazon.ca/',
  },

  reporter: [
    ['html', {outputFolder: 'playwright-report', open: 'always' }], 
    ['junit', { outputFile: 'test-results/junit.xml', embedAttachmentsAsProperty: 'testrun_evidence'}],
    ['list'], // Shows test progress in console
    ['json', { outputFile: 'test-results/test-results.json'}]
  ],

 projects: [
    {
      name: 'Desktop Chrome',
    use: {
      ...(() => {
        const { deviceScaleFactor, ...rest } = devices['Desktop Chrome'];
        return rest;
      })(),
      viewport: null, // disables Playwright's default viewport
      launchOptions: {
        args: ['--start-maximized'],
      },
    }
    },
  ],
});
