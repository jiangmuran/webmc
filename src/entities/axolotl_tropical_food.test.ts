import { describe, it, expect } from 'vitest';
import {
  canFeed,
  grantsRegenOnAttack,
  clearsOnAttack,
  playDeadDuration,
} from './axolotl_tropical_food';

describe('axolotl tropical food', () => {
  it('tropical fish feed ok', () => {
    expect(canFeed('tropical_fish_bucket')).toBe(true);
  });

  it('random item rejected', () => {
    expect(canFeed('cooked_beef')).toBe(false);
  });

  it('regen on attack includes regen', () => {
    expect(grantsRegenOnAttack().some((e) => e.id === 'regeneration')).toBe(true);
  });

  it('regen-on-attack does NOT grant Resistance (wiki: Regeneration only)', () => {
    expect(grantsRegenOnAttack().some((e) => e.id === 'resistance')).toBe(false);
  });

  it('mining fatigue is CLEARED, not granted (wiki)', () => {
    expect(grantsRegenOnAttack().some((e) => e.id === 'mining_fatigue')).toBe(false);
    expect(clearsOnAttack()).toContain('mining_fatigue');
  });

  it('play dead 200-300 ticks', () => {
    const d = playDeadDuration(() => 0.5);
    expect(d).toBeGreaterThanOrEqual(200);
    expect(d).toBeLessThanOrEqual(300);
  });
});
