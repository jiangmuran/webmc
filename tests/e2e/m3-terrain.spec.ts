import { test, expect } from '@playwright/test';

test.describe('M3 terrain & lighting', () => {
  test('terrain streams in, FPS stays healthy, no console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.message));

    await page.goto('/?autoplay=1');
    await page.waitForFunction(
      () => {
        const hud = document.querySelector('#hud')?.textContent ?? '';
        const m = /tris\s+(\d+)/.exec(hud);
        return m !== null && Number(m[1]) > 500;
      },
      { timeout: 20_000 },
    );

    const readTris = async (): Promise<number> => {
      const text = (await page.getByTestId('hud').textContent()) ?? '';
      const m = /tris\s+(\d+)/.exec(text);
      return Number(m?.[1] ?? 0);
    };

    const readChunks = async (): Promise<number> => {
      const text = (await page.getByTestId('hud').textContent()) ?? '';
      const m = /chunks\s+(\d+)/.exec(text);
      return Number(m?.[1] ?? 0);
    };

    const chunksAtStart = await readChunks();
    expect(chunksAtStart).toBeGreaterThanOrEqual(1);

    const trisAtStart = await readTris();
    expect(trisAtStart).toBeGreaterThan(500);

    await page.waitForFunction(
      () => {
        const hud = document.querySelector('#hud')?.textContent ?? '';
        const m = /FPS\s+(\d+)/.exec(hud);
        return m !== null && Number(m[1]) >= 15;
      },
      { timeout: 10_000 },
    );

    expect(consoleErrors).toEqual([]);
  });

  test('HUD reports world seed and pending chunk count', async ({ page }) => {
    await page.goto('/?autoplay=1');
    const hud = page.getByTestId('hud');
    await expect(hud).toContainText(/seed\s+[0-9a-f]+/);
    await expect(hud).toContainText(/pending\s+\d+/);
  });
});
