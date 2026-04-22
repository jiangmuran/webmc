import { describe, it, expect } from 'vitest';
import { batFireball, makeFireball, tickFireball } from './ghast_fireball';

describe('ghast fireball', () => {
  it('moves along initial direction', () => {
    const f = makeFireball({ x: 0, y: 80, z: 0 }, { x: 1, y: 0, z: 0 }, 10);
    tickFireball(f, 0.1, { isSolid: () => false });
    expect(f.position.x).toBeGreaterThan(0);
  });

  it('explodes + ignites on block contact', () => {
    const f = makeFireball({ x: 0, y: 80, z: 0 }, { x: 1, y: 0, z: 0 }, 10);
    const r = tickFireball(f, 0.1, { isSolid: () => true });
    expect(r.explosionPower).toBe(1);
    expect(r.igniteFire).toBe(true);
  });

  it('bat reverses velocity + transfers owner', () => {
    const f = makeFireball({ x: 0, y: 80, z: 0 }, { x: 1, y: 0, z: 0 }, 10, 42);
    batFireball(f, { x: -1, y: 0, z: 0 }, 7);
    expect(f.velocity.x).toBeLessThan(0);
    expect(f.ownerId).toBe(7);
  });

  it('expires after lifetime', () => {
    const f = makeFireball({ x: 0, y: 80, z: 0 }, { x: 1, y: 0, z: 0 }, 10);
    let expired = false;
    for (let i = 0; i < 600; i++) {
      if (tickFireball(f, 0.1, { isSolid: () => false }).expired) expired = true;
    }
    expect(expired).toBe(true);
  });
});
