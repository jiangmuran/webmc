import { describe, it, expect } from 'vitest';
import { makePotionProjectile, splashApply, tickPotionProjectile } from './splash_potion';

describe('splash potion', () => {
  it('impacts on solid block', () => {
    const p = makePotionProjectile('splash', { x: 0, y: 10, z: 0 }, { x: 0, y: -5, z: 0 }, []);
    let impacted = false;
    for (let i = 0; i < 100; i++) {
      if (tickPotionProjectile(p, { isSolid: (_x, y) => y <= 0, dtSec: 0.05 }).impacted) {
        impacted = true;
        break;
      }
    }
    expect(impacted).toBe(true);
  });

  it('splashApply applies diminished effect by distance', () => {
    const applied = splashApply(
      { x: 0, y: 0, z: 0 },
      [{ id: 'regeneration', amplifier: 0, durationSec: 45 }],
      [
        { id: 1, position: { x: 0, y: 0, z: 0 } },
        { id: 2, position: { x: 3, y: 0, z: 0 } },
      ],
    );
    const full = applied.find((r) => r.entityId === 1)?.effects[0];
    const partial = applied.find((r) => r.entityId === 2)?.effects[0];
    expect(full?.durationSec).toBe(45);
    expect(partial?.durationSec).toBeLessThan(45);
  });

  it('entities beyond 4 blocks skipped', () => {
    const applied = splashApply(
      { x: 0, y: 0, z: 0 },
      [{ id: 'poison', amplifier: 0, durationSec: 20 }],
      [{ id: 1, position: { x: 10, y: 0, z: 0 } }],
    );
    expect(applied.length).toBe(0);
  });
});
