import { describe, it, expect } from 'vitest';
import { makeXpBottle, tickXpBottle } from './xp_bottle';

describe('xp bottle', () => {
  it('shatters on solid impact + drops 3-11 XP', () => {
    const b = makeXpBottle({ x: 0, y: 10, z: 0 }, { x: 0, y: -1, z: 0 }, 5);
    let result = { shattered: false, xpDropped: 0 };
    for (let i = 0; i < 100; i++) {
      result = tickXpBottle(b, { isSolid: (_x, y) => y <= 0, dtSec: 0.05 });
      if (result.shattered) break;
    }
    expect(result.shattered).toBe(true);
    expect(result.xpDropped).toBeGreaterThanOrEqual(3);
    expect(result.xpDropped).toBeLessThanOrEqual(11);
  });

  it('no impact → no shatter', () => {
    const b = makeXpBottle({ x: 0, y: 10, z: 0 }, { x: 1, y: 0, z: 0 }, 5);
    const r = tickXpBottle(b, { isSolid: () => false, dtSec: 0.05 });
    expect(r.shattered).toBe(false);
  });
});
