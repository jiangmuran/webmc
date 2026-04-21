import { test, expect } from '@playwright/test';

test.describe('M0 boot smoke', () => {
  test('canvas mounts, HUD reports WebGL2 and live FPS', async ({ page }) => {
    await page.goto('/');
    const canvas = page.getByTestId('main-canvas');
    await expect(canvas).toBeVisible();
    const width = await canvas.evaluate((el: HTMLCanvasElement) => el.width);
    expect(width).toBeGreaterThan(0);

    const hud = page.getByTestId('hud');
    await expect(hud).toContainText(/webmc M\d+/);
    await expect(hud).toContainText('WebGL2');

    await page.waitForFunction(
      () => /FPS\s+[1-9]\d*/.test(document.querySelector('#hud')?.textContent ?? ''),
      { timeout: 8_000 },
    );
    const hudText = (await hud.textContent()) ?? '';
    const fpsMatch = /FPS\s+(\d+)/.exec(hudText);
    expect(fpsMatch).not.toBeNull();
    const fps = Number(fpsMatch?.[1] ?? 0);
    expect(fps).toBeGreaterThan(0);
  });
});
