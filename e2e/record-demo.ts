/**
 * Standalone Playwright script that records a video walkthrough
 * of the native desktop layout.
 *
 * Usage:  npx tsx e2e/record-demo.ts
 * Output: e2e/demo-video/  (webm file)
 */
import { chromium } from 'playwright-core'
import { spawn, type ChildProcess } from 'node:child_process'

const DEV_PORT = 5199
const VIDEO_DIR = 'e2e/demo-video'
const W = 1280
const H = 720

/* Timing helpers */
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
const TRANSITION = 400 // enough for the 260ms css transition
const BEAT = 900       // pause between demo steps

async function startDevServer(): Promise<ChildProcess> {
  const child = spawn('npx', ['vite', '--port', String(DEV_PORT)], {
    cwd: process.cwd(),
    stdio: 'pipe',
  })
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Dev server timeout')), 15_000)
    child.stdout?.on('data', (d: Buffer) => {
      if (d.toString().includes('Local:')) {
        clearTimeout(timeout)
        resolve()
      }
    })
    child.on('error', reject)
  })
  return child
}

async function main() {
  console.log('Starting dev server…')
  const server = await startDevServer()

  console.log('Launching browser…')
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  })

  const context = await browser.newContext({
    viewport: { width: W, height: H },
    colorScheme: 'dark',
    recordVideo: { dir: VIDEO_DIR, size: { width: W, height: H } },
  })
  const page = await context.newPage()

  try {
    // ── 1. Load ──
    console.log('1/9  Loading app…')
    await page.goto(`http://localhost:${DEV_PORT}`, { waitUntil: 'load' })
    await wait(BEAT)

    // ── 2. Close left sidebar (button click) ──
    console.log('2/9  Close left sidebar via button…')
    const leftToggle = page.getByRole('button', { name: /Toggle sidebar.*\+B\)/i }).first()
    await leftToggle.click()
    await wait(TRANSITION + BEAT)

    // ── 3. Re-open left sidebar (keyboard) ──
    console.log('3/9  Re-open left sidebar via Ctrl+B…')
    await page.keyboard.press('Control+b')
    await wait(TRANSITION + BEAT)

    // ── 4. Close right sidebar (button click) ──
    console.log('4/9  Close right sidebar via button…')
    const rightToggle = page.getByRole('button', { name: /Toggle sidebar.*Shift\+B\)/i })
    await rightToggle.click()
    await wait(TRANSITION + BEAT)

    // ── 5. Re-open right sidebar (keyboard) ──
    console.log('5/9  Re-open right sidebar via Ctrl+Shift+B…')
    await page.keyboard.press('Control+Shift+b')
    await wait(TRANSITION + BEAT)

    // ── 6. Close both via keyboard ──
    console.log('6/9  Close both sidebars…')
    await page.keyboard.press('Control+b')
    await wait(TRANSITION)
    await page.keyboard.press('Control+Shift+b')
    await wait(TRANSITION + BEAT)

    // ── 7. Re-open both ──
    console.log('7/9  Re-open both sidebars…')
    await page.keyboard.press('Control+b')
    await wait(TRANSITION)
    await page.keyboard.press('Control+Shift+b')
    await wait(TRANSITION + BEAT)

    // ── 8. Hover tooltips ──
    console.log('8/9  Hover toggle tooltips…')
    await leftToggle.hover()
    await wait(BEAT)
    await rightToggle.hover()
    await wait(BEAT)
    await page.mouse.move(W / 2, H / 2)
    await wait(BEAT / 2)

    // ── 9. Rapid toggles ──
    console.log('9/9  Rapid toggle sequence…')
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Control+b')
      await wait(300)
      await page.keyboard.press('Control+b')
      await wait(300)
    }
    await wait(BEAT)

    console.log('Demo complete.')
  } finally {
    // Close context to finalize the video file
    await context.close()
    await browser.close()
    server.kill()
  }

  // The video path
  console.log(`\nVideo saved to: ${VIDEO_DIR}/`)
}

main().catch((e) => {
  console.error('Fatal:', e)
  process.exit(1)
})
