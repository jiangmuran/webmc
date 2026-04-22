import { describe, it, expect } from 'vitest';
import {
  planDripstoneCave,
  stalactiteFallDamage,
  stalagmiteBreakDrops,
  tickDrip,
} from './dripstone_cave';

describe('dripstone cave', () => {
  it('plan scales with cave volume', () => {
    const small = planDripstoneCave({ rng: () => 0.5, caveVolume: 500 });
    const big = planDripstoneCave({ rng: () => 0.5, caveVolume: 10000 });
    expect(big.stalactiteCount).toBeGreaterThan(small.stalactiteCount);
  });

  it('fall damage grows with length', () => {
    expect(stalactiteFallDamage(10)).toBe(20);
    expect(stalactiteFallDamage(0)).toBe(2);
  });
});

describe('drip cauldron', () => {
  it('no cauldron = no drip', () => {
    const s = { tipFluid: 'water' as const, cauldronBelowLevels: 0 };
    expect(tickDrip(s, 0.001, false)).toBe('no_cauldron');
  });

  it('drips when roll low + cauldron exists', () => {
    const s = { tipFluid: 'water' as const, cauldronBelowLevels: 0 };
    expect(tickDrip(s, 0.001, true)).toBe('dripped');
    expect(s.cauldronBelowLevels).toBe(1);
  });

  it('skips when roll high', () => {
    const s = { tipFluid: 'water' as const, cauldronBelowLevels: 0 };
    expect(tickDrip(s, 0.5, true)).toBe('none');
  });

  it('stops when cauldron full', () => {
    const s = { tipFluid: 'water' as const, cauldronBelowLevels: 3 };
    expect(tickDrip(s, 0.001, true)).toBe('full');
  });
});

describe('stalagmite break', () => {
  it('pickaxe drops pointed dripstone', () => {
    expect(stalagmiteBreakDrops(true)[0]?.item).toBe('webmc:pointed_dripstone');
  });

  it('hand drops nothing', () => {
    expect(stalagmiteBreakDrops(false)).toEqual([]);
  });
});
