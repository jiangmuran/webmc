import { describe, it, expect } from 'vitest';
import { canLaunch, launchSpeed, conflictsWithLoyalty, MIN_CHARGE } from './trident_riptide';

describe('trident riptide', () => {
  it('needs enchant', () => {
    expect(canLaunch({ riptideLevel: 0, inWater: true, inRain: false, chargeTicks: 99 })).toBe(
      false,
    );
  });

  it('needs water or rain', () => {
    expect(canLaunch({ riptideLevel: 3, inWater: false, inRain: false, chargeTicks: 99 })).toBe(
      false,
    );
  });

  it('rain allows launch', () => {
    expect(
      canLaunch({ riptideLevel: 1, inWater: false, inRain: true, chargeTicks: MIN_CHARGE }),
    ).toBe(true);
  });

  it('undercharged rejected', () => {
    expect(canLaunch({ riptideLevel: 3, inWater: true, inRain: false, chargeTicks: 1 })).toBe(
      false,
    );
  });

  it('speed = (6 × level) + 3 (wiki: 9 / 15 / 21 for I / II / III)', () => {
    // Wiki (minecraft.wiki/w/Riptide): trident throws user
    // (6 × level) + 3 blocks. Old `3 + level * 1.8` was 47% of canon.
    expect(launchSpeed(1)).toBe(9);
    expect(launchSpeed(2)).toBe(15);
    expect(launchSpeed(3)).toBe(21);
  });

  it('conflicts with loyalty', () => {
    expect(conflictsWithLoyalty(1)).toBe(true);
    expect(conflictsWithLoyalty(0)).toBe(false);
  });
});
