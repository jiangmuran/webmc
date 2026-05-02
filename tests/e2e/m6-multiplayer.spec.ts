import { test, expect, type Page } from '@playwright/test';

// Two browser contexts: host creates a room, guest joins with the code,
// guest places a block, host sees the edit land in its world.

async function waitForTerrain(page: Page): Promise<void> {
  await page.waitForFunction(
    () => {
      const hud = document.querySelector('#hud')?.textContent ?? '';
      const m = /tris\s+(\d+)/.exec(hud);
      return m !== null && Number(m[1]) > 100;
    },
    { timeout: 20_000 },
  );
}

async function clearIdb(page: Page): Promise<void> {
  await page.goto('/?autoplay=1');
  await page.evaluate(async () => {
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
}

async function readRoomCode(page: Page): Promise<string | null> {
  const text = (await page.getByTestId('hud').textContent()) ?? '';
  const m = /room\s+([A-Z0-9]{6})/.exec(text);
  return m?.[1] ?? null;
}

// Skipped in CI: the WebRTC handshake is flaky in headless Chromium and
// requires a working signaling server + STUN. Manual testing covers
// this scenario; the unit tests under src/net/ exercise the codec +
// room state transitions deterministically.
test.describe.skip('M6 multiplayer', () => {
  test('two browsers can join the same room and HUD reports the code', async ({ browser }) => {
    const hostCtx = await browser.newContext();
    const guestCtx = await browser.newContext();
    const host = await hostCtx.newPage();
    const guest = await guestCtx.newPage();

    try {
      await clearIdb(host);
      await clearIdb(guest);

      await host.goto('/?mp=create');
      await waitForTerrain(host);

      let code: string | null = null;
      for (let i = 0; i < 80; i++) {
        code = await readRoomCode(host);
        if (code) break;
        await host.waitForTimeout(250);
      }
      expect(code).toMatch(/^[A-Z0-9]{6}$/);
      if (!code) throw new Error('no room code');

      await guest.goto(`/?mp=${code}`);
      await waitForTerrain(guest);

      let guestCode: string | null = null;
      for (let i = 0; i < 80; i++) {
        guestCode = await readRoomCode(guest);
        if (guestCode) break;
        await guest.waitForTimeout(250);
      }
      expect(guestCode).toBe(code);
    } finally {
      await hostCtx.close();
      await guestCtx.close();
    }
  });
});
