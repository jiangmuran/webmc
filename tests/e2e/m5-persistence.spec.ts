import { test, expect } from '@playwright/test';

test.describe('M5 persistence', () => {
  test('player position and world state persist across reload', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/?autoplay=1');
    await page.evaluate(async () => {
      // Clear IDB so each run starts fresh.
      const dbs = await indexedDB.databases();
      await Promise.all(
        dbs.map(
          (d) =>
            new Promise<void>((resolve) => {
              if (!d.name) {
                resolve();
                return;
              }
              const req = indexedDB.deleteDatabase(d.name);
              req.onsuccess = (): void => {
                resolve();
              };
              req.onerror = (): void => {
                resolve();
              };
              req.onblocked = (): void => {
                resolve();
              };
            }),
        ),
      );
    });

    await page.goto('/?autoplay=1');
    await page.waitForFunction(
      () => {
        const hud = document.querySelector('#hud')?.textContent ?? '';
        const m = /tris\s+(\d+)/.exec(hud);
        return m !== null && Number(m[1]) > 100;
      },
      { timeout: 20_000 },
    );

    const readPos = async (): Promise<{ x: number; y: number; z: number }> => {
      const text = (await page.getByTestId('hud').textContent()) ?? '';
      const m = /pos\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/.exec(text);
      if (!m) throw new Error(`could not parse position from HUD: ${text}`);
      return { x: Number(m[1]), y: Number(m[2]), z: Number(m[3]) };
    };

    // Walk forward briefly to force a position change.
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(1500);
    await page.keyboard.up('KeyW');
    await page.waitForTimeout(6500); // > periodic save interval (5s)

    const before = await readPos();

    await page.reload();
    await page.waitForFunction(
      () => {
        const hud = document.querySelector('#hud')?.textContent ?? '';
        const m = /tris\s+(\d+)/.exec(hud);
        return m !== null && Number(m[1]) > 100;
      },
      { timeout: 20_000 },
    );

    const after = await readPos();
    const dist = Math.hypot(after.x - before.x, after.z - before.z);
    expect(dist).toBeLessThan(2);
    expect(Math.abs(after.y - before.y)).toBeLessThan(2);
  });

  test('HUD exposes a save counter', async ({ page }) => {
    await page.goto('/?autoplay=1');
    const hud = page.getByTestId('hud');
    await expect(hud).toContainText(/save\d+/);
  });
});
