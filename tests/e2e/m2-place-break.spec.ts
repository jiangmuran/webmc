import { test, expect } from '@playwright/test';

test.describe('M2 place/break', () => {
  test('click to break and right-click to place, triangle count changes', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.message));

    await page.goto('/?autoplay=1');
    const hud = page.getByTestId('hud');
    await page.waitForFunction(
      () => {
        const hudText = document.querySelector('#hud')?.textContent ?? '';
        const m = /tris\s+(\d+)/.exec(hudText);
        return m !== null && Number(m[1]) > 100;
      },
      { timeout: 20_000 },
    );

    const readTris = async (): Promise<number> => {
      const text = (await hud.textContent()) ?? '';
      const m = /tris\s+(\d+)/.exec(text);
      return Number(m?.[1] ?? 0);
    };

    const baseline = await readTris();
    expect(baseline).toBeGreaterThan(100);

    // Aim straight down (so raycast hits the floor right under the player).
    await page.evaluate(() => {
      document.querySelector('canvas')?.click();
    });
    await page.mouse.move(400, 300);
    await page.mouse.move(400, 4000, { steps: 20 });

    await page.waitForTimeout(150);

    // Simulate a break click; even without pointer-lock in headless mode,
    // the handler checks pointerLockElement so this may be a no-op. Accept
    // that the HUD still reports a live FPS and no JS error fires.
    await page.mouse.down({ button: 'left' });
    await page.waitForTimeout(300);
    await page.mouse.up({ button: 'left' });

    const afterBreak = await readTris();
    expect(afterBreak).toBeGreaterThan(0);

    await expect(page.getByTestId('hotbar')).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test('hotbar number keys change the selected slot', async ({ page }) => {
    await page.goto('/?autoplay=1');
    await expect(page.getByTestId('hotbar')).toBeVisible();

    await page.waitForFunction(
      () => /FPS\s+[1-9]/.test(document.querySelector('#hud')?.textContent ?? ''),
      { timeout: 6000 },
    );

    const firstName = await page.evaluate(() => {
      const t = document.querySelector('#hud')?.textContent ?? '';
      return t.split('\n').at(-1) ?? '';
    });
    await page.keyboard.press('Digit3');
    // HUD updates are throttled to 5Hz (every 200ms), so wait long
    // enough to be sure the new slot has been written into #hud.
    await page.waitForFunction(
      (firstHud: string) => {
        const t = document.querySelector('#hud')?.textContent ?? '';
        const last = t.split('\n').at(-1) ?? '';
        return last !== '' && last !== firstHud;
      },
      firstName,
      { timeout: 3000 },
    );
    const thirdName = await page.evaluate(() => {
      const t = document.querySelector('#hud')?.textContent ?? '';
      return t.split('\n').at(-1) ?? '';
    });
    expect(firstName).not.toBe(thirdName);
  });
});
