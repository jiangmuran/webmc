import { describe, it, expect } from 'vitest';
import {
  WITHER_EFFECT_DURATION_SEC,
  WITHER_SKULL_DAMAGE,
  makeWitherSkull,
  tickWitherSkull,
} from './wither_skull';

describe('wither skull', () => {
  it('moves along initial direction', () => {
    const s = makeWitherSkull({ x: 0, y: 80, z: 0 }, { x: 1, y: 0, z: 0 }, 5, false);
    tickWitherSkull(s, 0.1, { isSolid: () => false });
    expect(s.position.x).toBeGreaterThan(0);
  });

  it('explodes on hit with power 1', () => {
    const s = makeWitherSkull({ x: 0, y: 80, z: 0 }, { x: 1, y: 0, z: 0 }, 5, false);
    const r = tickWitherSkull(s, 0.1, { isSolid: () => true });
    expect(r.hitBlock).toBe(true);
    expect(r.explosionPower).toBe(1);
  });

  it('charged (blue) skull also explodes with power 1 (wiki: same blast power)', () => {
    const s = makeWitherSkull({ x: 0, y: 80, z: 0 }, { x: 1, y: 0, z: 0 }, 5, true);
    const r = tickWitherSkull(s, 0.1, { isSolid: () => true });
    expect(r.explosionPower).toBe(1);
  });

  it('expires after 30s', () => {
    const s = makeWitherSkull({ x: 0, y: 80, z: 0 }, { x: 1, y: 0, z: 0 }, 5, false);
    let expired = false;
    for (let i = 0; i < 600; i++) {
      if (tickWitherSkull(s, 0.1, { isSolid: () => false }).expired) expired = true;
    }
    expect(expired).toBe(true);
  });

  it('damage + effect constants (wiki: 8 HP on Normal, Wither II 10s)', () => {
    expect(WITHER_SKULL_DAMAGE).toBe(8);
    expect(WITHER_EFFECT_DURATION_SEC).toBe(10);
  });
});
