import { test, expect } from '@playwright/test'

/**
 * Video demo — walks through every feature of the native desktop layout:
 *
 *   1. App loads with both sidebars open
 *   2. Close left sidebar via toggle button
 *   3. Re-open left sidebar via keyboard shortcut (Ctrl+B)
 *   4. Close right sidebar via toggle button
 *   5. Re-open right sidebar via keyboard shortcut (Ctrl+Shift+B)
 *   6. Close both sidebars simultaneously via keyboard
 *   7. Re-open both
 *   8. Hover tooltips on toggle buttons
 *
 * The resulting video lands in `./test-results/`.
 */

const TRANSITION_MS = 400 // enough time for 260ms transition + settle
const PAUSE_MS = 800      // breathing room between actions so the viewer can follow

test('desktop layout – full feature walkthrough', async ({ page }) => {
  // ── 1. Load the app ──
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(PAUSE_MS)

  // Verify both sidebars are visible on load
  const leftSidebar = page.locator('aside').first()
  const rightSidebar = page.locator('aside').last()
  await expect(leftSidebar).toBeVisible()
  await expect(rightSidebar).toBeVisible()
  await page.waitForTimeout(PAUSE_MS)

  // ── 2. Close left sidebar via toggle button ──
  const leftToggle = page.getByRole('button', { name: /Toggle sidebar.*\+B\)/i }).first()
  await leftToggle.click()
  await page.waitForTimeout(TRANSITION_MS)

  // Left sidebar should now be collapsed (width → 0)
  await expect(leftSidebar).toHaveCSS('width', '0px')
  await page.waitForTimeout(PAUSE_MS)

  // ── 3. Re-open left sidebar via keyboard shortcut ──
  await page.keyboard.press('Control+b')
  await page.waitForTimeout(TRANSITION_MS)
  await expect(leftSidebar).not.toHaveCSS('width', '0px')
  await page.waitForTimeout(PAUSE_MS)

  // ── 4. Close right sidebar via toggle button ──
  const rightToggle = page.getByRole('button', { name: /Toggle sidebar.*Shift\+B\)/i })
  await rightToggle.click()
  await page.waitForTimeout(TRANSITION_MS)
  await expect(rightSidebar).toHaveCSS('width', '0px')
  await page.waitForTimeout(PAUSE_MS)

  // ── 5. Re-open right sidebar via keyboard shortcut ──
  await page.keyboard.press('Control+Shift+b')
  await page.waitForTimeout(TRANSITION_MS)
  await expect(rightSidebar).not.toHaveCSS('width', '0px')
  await page.waitForTimeout(PAUSE_MS)

  // ── 6. Close both sidebars via keyboard ──
  await page.keyboard.press('Control+b')
  await page.waitForTimeout(TRANSITION_MS)
  await page.keyboard.press('Control+Shift+b')
  await page.waitForTimeout(TRANSITION_MS)

  // Both collapsed
  await expect(leftSidebar).toHaveCSS('width', '0px')
  await expect(rightSidebar).toHaveCSS('width', '0px')
  await page.waitForTimeout(PAUSE_MS)

  // ── 7. Re-open both ──
  await page.keyboard.press('Control+b')
  await page.waitForTimeout(TRANSITION_MS)
  await page.keyboard.press('Control+Shift+b')
  await page.waitForTimeout(TRANSITION_MS)
  await page.waitForTimeout(PAUSE_MS)

  // ── 8. Hover tooltips ──
  await leftToggle.hover()
  await page.waitForTimeout(PAUSE_MS)
  await rightToggle.hover()
  await page.waitForTimeout(PAUSE_MS)

  // Move away to dismiss tooltip
  await page.mouse.move(400, 300)
  await page.waitForTimeout(PAUSE_MS)

  // ── 9. Quick rapid toggles to show smoothness ──
  await page.keyboard.press('Control+b')
  await page.waitForTimeout(300)
  await page.keyboard.press('Control+b')
  await page.waitForTimeout(300)
  await page.keyboard.press('Control+Shift+b')
  await page.waitForTimeout(300)
  await page.keyboard.press('Control+Shift+b')
  await page.waitForTimeout(PAUSE_MS)

  // Final state: both sidebars open
  await expect(leftSidebar).not.toHaveCSS('width', '0px')
  await expect(rightSidebar).not.toHaveCSS('width', '0px')
})
