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

  it('foal regresses toward mean of natural-spawn range (wiki)', () => {
    // Wiki minecraft.wiki/w/Horse#Breeding: (p1 + p2 + R) / 3.
    // With two FAST parents (HP 30, jump 0.95) and rng=0 (R=15), the
    // foal lands at (30 + 30 + 15)/3 = 25 — strictly below both
    // parents. Old (a+b)/2+jitter model couldn't drop foals below
    // their parents' average.
    const c = breedHorses({ parentA: FAST, parentB: FAST, rng: () => 0 });
    expect(c.maxHealth).toBeCloseTo(25, 1);
    expect(c.maxHealth).toBeLessThan(30);
  });

  it('two min parents + rng=1 reach near top of range', () => {
    // (15 + 15 + 30)/3 = 20 — pulls foal upward from the floor when
    // R rolls high; old jitter model never moved beyond 15.075.
    const c = breedHorses({ parentA: SLOW, parentB: SLOW, rng: () => 1 });
    expect(c.maxHealth).toBeCloseTo(20, 1);
  });
});
