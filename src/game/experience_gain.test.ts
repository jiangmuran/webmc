import { describe, it, expect } from 'vitest';
import { mobXpRange, oreXpRange, rollXp } from './experience_gain';

describe('xp gain', () => {
  it('zombie drops 5 xp', () => {
    expect(rollXp({ source: { kind: 'mob', mob: 'zombie' }, rng: () => 0.5 })).toBe(5);
  });

  it('unknown mob drops 0', () => {
    expect(rollXp({ source: { kind: 'mob', mob: 'cow' }, rng: () => 0.5 })).toBe(0);
  });

  it('ender dragon drops 12000', () => {
    expect(mobXpRange('ender_dragon')[0]).toBe(12000);
  });

  it('diamond ore range is 3..7', () => {
    const [lo, hi] = oreXpRange('diamond_ore');
    expect(lo).toBe(3);
    expect(hi).toBe(7);
  });

  it('iron ingot smelt gives 0.7', () => {
    expect(rollXp({ source: { kind: 'smelt', smelting: 'iron_ingot' }, rng: () => 0 })).toBe(0.7);
  });

  it('breed baby gives 1..7', () => {
    const xp = rollXp({ source: { kind: 'breed_baby' }, rng: () => 0.5 });
    expect(xp).toBeGreaterThanOrEqual(1);
    expect(xp).toBeLessThanOrEqual(7);
  });

  it('bottle throw gives 3..11', () => {
    const xp = rollXp({ source: { kind: 'bottle_throw' }, rng: () => 0 });
    expect(xp).toBeGreaterThanOrEqual(3);
  });

  it('trade gives 3..6', () => {
    const xp = rollXp({ source: { kind: 'trade' }, rng: () => 0 });
    expect(xp).toBe(3);
  });
});
