import { describe, it, expect } from 'vitest';
import {
  repelsPiglin,
  damagePerTick,
  smokeHeight,
  smokeColor,
  CAMPFIRE_DAMAGE,
  SOUL_CAMPFIRE_DAMAGE,
  PIGLIN_REPEL_RADIUS,
} from './soul_campfire_repel';

describe('soul campfire', () => {
  it('repels piglin in range', () => {
    expect(
      repelsPiglin({
        variant: 'soul_campfire',
        playerStandsOn: false,
        piglinWithinRadius: true,
        piglinDistance: PIGLIN_REPEL_RADIUS,
      }),
    ).toBe(true);
  });

  it('normal campfire does not', () => {
    expect(
      repelsPiglin({
        variant: 'campfire',
        playerStandsOn: false,
        piglinWithinRadius: true,
        piglinDistance: 2,
      }),
    ).toBe(false);
  });

  it('damage variants', () => {
    expect(
      damagePerTick({
        variant: 'campfire',
        playerStandsOn: true,
        piglinWithinRadius: false,
        piglinDistance: 0,
      }),
    ).toBe(CAMPFIRE_DAMAGE);
    expect(
      damagePerTick({
        variant: 'soul_campfire',
        playerStandsOn: true,
        piglinWithinRadius: false,
        piglinDistance: 0,
      }),
    ).toBe(SOUL_CAMPFIRE_DAMAGE);
  });

  it('no damage if off', () => {
    expect(
      damagePerTick({
        variant: 'campfire',
        playerStandsOn: false,
        piglinWithinRadius: false,
        piglinDistance: 0,
      }),
    ).toBe(0);
  });

  it('hay raises smoke', () => {
    expect(smokeHeight(true)).toBeGreaterThan(smokeHeight(false));
  });

  it('soul smoke color', () => {
    expect(smokeColor('soul_campfire')).not.toBe(smokeColor('campfire'));
  });
});
