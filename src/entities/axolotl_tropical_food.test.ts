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

  it('play dead exactly 200 ticks (wiki: flat 10s)', () => {
    // Wiki (minecraft.wiki/w/Axolotl#Behavior): play-dead duration is
    // a flat 10 seconds (200 ticks). Siblings axolotl_play_dead.ts
    // and axolotl_revive.ts use the same fixed value.
    expect(playDeadDuration(() => 0)).toBe(200);
    expect(playDeadDuration(() => 0.999)).toBe(200);
  });
});
