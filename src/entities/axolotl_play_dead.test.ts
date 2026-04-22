import { describe, it, expect } from 'vitest';
import {
  makeAxolotl,
  onDamage,
  isPlayingDead,
  PLAY_DEAD_DURATION_MS,
  PLAY_DEAD_COOLDOWN_MS,
} from './axolotl_play_dead';

describe('axolotl', () => {
  it('plays dead in water with roll', () => {
    const a = makeAxolotl();
    expect(onDamage(a, { amount: 2, inWater: true, nowMs: 0, rand: () => 0 })).toBe(true);
    expect(isPlayingDead(a, 100)).toBe(true);
  });

  it('not on land', () => {
    const a = makeAxolotl();
    expect(onDamage(a, { amount: 2, inWater: false, nowMs: 0, rand: () => 0 })).toBe(false);
  });

  it('cooldown blocks', () => {
    const a = makeAxolotl();
    onDamage(a, { amount: 2, inWater: true, nowMs: 0, rand: () => 0 });
    expect(
      onDamage(a, {
        amount: 2,
        inWater: true,
        nowMs: PLAY_DEAD_DURATION_MS + 1,
        rand: () => 0,
      }),
    ).toBe(false);
    expect(
      onDamage(a, {
        amount: 2,
        inWater: true,
        nowMs: PLAY_DEAD_COOLDOWN_MS + 1,
        rand: () => 0,
      }),
    ).toBe(true);
  });

  it('hp drops on damage', () => {
    const a = makeAxolotl();
    onDamage(a, { amount: 5, inWater: true, nowMs: 0, rand: () => 1 });
    expect(a.hp).toBe(a.maxHp - 5);
  });
});
