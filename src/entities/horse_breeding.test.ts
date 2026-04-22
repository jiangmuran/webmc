import { describe, it, expect } from 'vitest';
import { breedHorses, breedToMule, canBreed, wildHorseStats } from './horse_breeding';

const SLOW = { maxHealth: 15, movementSpeed: 0.15, jumpStrength: 0.5 };
const FAST = { maxHealth: 30, movementSpeed: 0.33, jumpStrength: 0.95 };

describe('horse breeding', () => {
  it('offspring averages parents', () => {
    const child = breedHorses({ parentA: SLOW, parentB: FAST, rng: () => 0.5 });
    expect(child.maxHealth).toBeGreaterThan(15);
    expect(child.maxHealth).toBeLessThan(30);
  });

  it('clamped to natural range', () => {
    const c = breedHorses({ parentA: SLOW, parentB: SLOW, rng: () => 1 });
    expect(c.maxHealth).toBeGreaterThanOrEqual(15);
  });

  it('wild stats in range', () => {
    const s = wildHorseStats(() => 0.5);
    expect(s.maxHealth).toBeGreaterThanOrEqual(15);
    expect(s.maxHealth).toBeLessThanOrEqual(31);
  });

  it('horse + donkey = mule (infertile)', () => {
    const mule = breedToMule({ parentA: SLOW, parentB: FAST, rng: () => 0.5 });
    expect(mule.mule).toBe(true);
    expect(mule.infertile).toBe(true);
  });

  it('canBreed rules', () => {
    expect(canBreed('horse', 'donkey')).toBe(true);
    expect(canBreed('mule', 'horse')).toBe(false);
    expect(canBreed('skeleton_horse', 'horse')).toBe(false);
    expect(canBreed('zombie_horse', 'horse')).toBe(false);
  });
});
