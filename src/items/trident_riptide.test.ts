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

  it('speed grows with level', () => {
    expect(launchSpeed(3)).toBeGreaterThan(launchSpeed(1));
  });

  it('conflicts with loyalty', () => {
    expect(conflictsWithLoyalty(1)).toBe(true);
    expect(conflictsWithLoyalty(0)).toBe(false);
  });
});
