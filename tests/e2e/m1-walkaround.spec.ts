import { test, expect } from '@playwright/test';

test.describe('M1 walkaround', () => {
  test('world renders chunk meshes and the player moves with WASD', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message);
    });

    await page.goto('/?autoplay=1');
    const hud = page.getByTestId('hud');
    await expect(hud).toContainText(/webmc M\d+/);

    await page.waitForFunction(
      () => {
        const hudText = document.querySelector('#hud')?.textContent ?? '';
        const m = /tris\s+(\d+)/.exec(hudText);
        return m !== null && Number(m[1]) > 0;
      },
      { timeout: 10_000 },
    );

    const triMatch = /tris\s+(\d+)/.exec((await hud.textContent()) ?? '');
    const tris = Number(triMatch?.[1] ?? 0);
    expect(tris).toBeGreaterThan(100);

    await page.waitForFunction(
      () => /FPS\s+[1-9]\d*/.test(document.querySelector('#hud')?.textContent ?? ''),
      { timeout: 5000 },
    );

    async function readPosition(): Promise<{ x: number; y: number; z: number }> {
      const text = (await hud.textContent()) ?? '';
      const m = /pos\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/.exec(text);
      if (!m) throw new Error('could not parse position from HUD');
      return { x: Number(m[1]), y: Number(m[2]), z: Number(m[3]) };
    }

    const before = await readPosition();
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(1200);
    await page.keyboard.up('KeyW');
    const after = await readPosition();

    const delta = Math.hypot(after.x - before.x, after.z - before.z);
    expect(delta).toBeGreaterThan(1.0);

    const fpsMatch = /FPS\s+(\d+)/.exec((await hud.textContent()) ?? '');
    const fps = Number(fpsMatch?.[1] ?? 0);
    expect(fps).toBeGreaterThan(20);

    expect(consoleErrors).toEqual([]);
  });
});
