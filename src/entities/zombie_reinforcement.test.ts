import { describe, it, expect } from 'vitest';
import {
  isBabyZombie,
  pickSummonOffset,
  shouldSummonReinforcement,
  willPickup,
} from './zombie_reinforcement';

describe('zombie reinforcement', () => {
  it('peaceful = never summons', () => {
    expect(
      shouldSummonReinforcement({
        difficulty: 'peaceful',
        zombiesNearby: 0,
        canSummon: true,
        roll: 0,
      }).summon,
    ).toBe(false);
  });

  it('hard with low roll summons', () => {
    const r = shouldSummonReinforcement({
      difficulty: 'hard',
      zombiesNearby: 0,
      canSummon: true,
      roll: 0.01,
    });
    expect(r.summon).toBe(true);
  });

  it('cap at 7 nearby stops summons', () => {
    expect(
      shouldSummonReinforcement({
        difficulty: 'hard',
        zombiesNearby: 7,
        canSummon: true,
        roll: 0.01,
      }).summon,
    ).toBe(false);
  });

  it('canSummon=false prevents chain', () => {
    expect(
      shouldSummonReinforcement({
        difficulty: 'hard',
        zombiesNearby: 0,
        canSummon: false,
        roll: 0.01,
      }).summon,
    ).toBe(false);
  });

  it('summon offset distance 7..12', () => {
    const o = pickSummonOffset(0, 0.5);
    expect(Math.hypot(o.dx, o.dz)).toBeGreaterThanOrEqual(7);
    expect(Math.hypot(o.dx, o.dz)).toBeLessThanOrEqual(12);
  });

  it('baby probability higher on hard', () => {
    expect(isBabyZombie(0.06, 'hard')).toBe(true);
    expect(isBabyZombie(0.06, 'normal')).toBe(false);
  });

  it('weapons have higher pickup chance than food', () => {
    expect(willPickup('weapon', 0.3)).toBe(true);
    expect(willPickup('food', 0.3)).toBe(false);
  });
});
