import { describe, it, expect } from 'vitest';
import { damageWither, makeWither, tickWither } from './wither';

describe('wither boss', () => {
  it('spawning state is invulnerable', () => {
    const w = makeWither();
    const taken = damageWither(w, { amount: 100, source: 'player' });
    expect(taken).toBe(0);
  });

  it('spawn completes after 11 seconds + triggers explosion (wiki: 220 ticks)', () => {
    const w = makeWither();
    let sawExplosion = false;
    for (let i = 0; i < 120; i++) {
      const r = tickWither(w, 0.1);
      if (r.summoningExplosion) sawExplosion = true;
    }
    expect(sawExplosion).toBe(true);
    expect(w.stage).toBe('charged');
  });

  it('health climbs during spawn', () => {
    const w = makeWither();
    const before = w.health;
    for (let i = 0; i < 50; i++) tickWither(w, 0.1);
    expect(w.health).toBeGreaterThan(before);
  });

  it('transitions to low_health at half HP', () => {
    const w = makeWither();
    for (let i = 0; i < 120; i++) tickWither(w, 0.1); // finish spawn
    damageWither(w, { amount: 160, source: 'player' });
    expect(w.stage).toBe('low_health');
    expect(w.explosionResist).toBe(true);
  });

  it('low_health wither is projectile-immune (wiki: arrows etc.)', () => {
    const w = makeWither();
    for (let i = 0; i < 120; i++) tickWither(w, 0.1);
    damageWither(w, { amount: 160, source: 'player' });
    const taken = damageWither(w, { amount: 50, source: 'projectile' });
    expect(taken).toBe(0);
  });

  it('low_health wither still takes explosion damage (wiki)', () => {
    const w = makeWither();
    for (let i = 0; i < 120; i++) tickWither(w, 0.1);
    damageWither(w, { amount: 160, source: 'player' });
    const taken = damageWither(w, { amount: 50, source: 'explosion' });
    expect(taken).toBe(50);
  });

  it('fatal damage moves to dead', () => {
    const w = makeWither();
    for (let i = 0; i < 120; i++) tickWither(w, 0.1);
    damageWither(w, { amount: 999, source: 'player' });
    expect(w.stage).toBe('dead');
  });
});
