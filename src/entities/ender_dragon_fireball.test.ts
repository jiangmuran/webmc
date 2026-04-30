import { describe, it, expect } from 'vitest';
import {
  makeBreath,
  tickBreath,
  damageThisTick,
  collectBreath,
  MAX_AGE_TICKS,
  DMG_INTERVAL_TICKS,
  DMG_PER_TICK,
} from './ender_dragon_fireball';

describe('dragon breath', () => {
  it('expires after max age (wiki: 600 ticks = 30s)', () => {
    expect(MAX_AGE_TICKS).toBe(600);
    const b = makeBreath(0, 64, 0);
    for (let i = 0; i < MAX_AGE_TICKS - 1; i++) tickBreath(b);
    expect(tickBreath(b).expired).toBe(true);
  });

  it('damages in radius at interval', () => {
    const b = makeBreath(0, 64, 0);
    b.ageTicks = DMG_INTERVAL_TICKS;
    expect(damageThisTick(b, { x: 1, y: 64, z: 0 })).toBe(DMG_PER_TICK);
  });

  it('no damage outside radius', () => {
    const b = makeBreath(0, 64, 0);
    b.ageTicks = DMG_INTERVAL_TICKS;
    expect(damageThisTick(b, { x: 100, y: 64, z: 0 })).toBe(0);
  });

  it('no damage off-interval', () => {
    const b = makeBreath(0, 64, 0);
    b.ageTicks = 1;
    expect(damageThisTick(b, { x: 0, y: 64, z: 0 })).toBe(0);
  });

  it('collect with bottle', () => {
    expect(collectBreath({ playerHoldsEmptyBottle: true, playerInsideBreath: true })).toBe(
      'webmc:dragon_breath',
    );
  });

  it('no collect without bottle', () => {
    expect(collectBreath({ playerHoldsEmptyBottle: false, playerInsideBreath: true })).toBeNull();
  });
});
