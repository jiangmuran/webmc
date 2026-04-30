import { describe, it, expect } from 'vitest';
import { tryGrow, walkDamage, harvest, BERRY_MAX_AGE } from './sweet_berry_growth';

describe('sweet berry growth', () => {
  it('grows on lucky roll', () => {
    expect(tryGrow({ age: 0 }, () => 0).age).toBe(1);
  });

  it('skips on high roll', () => {
    expect(tryGrow({ age: 0 }, () => 0.9).age).toBe(0);
  });

  it('caps at max', () => {
    expect(tryGrow({ age: BERRY_MAX_AGE }, () => 0).age).toBe(BERRY_MAX_AGE);
  });

  it('walk damage at age 1+ (wiki: only age-0 sapling is harmless)', () => {
    expect(walkDamage({ age: 0 })).toBe(false);
    expect(walkDamage({ age: 1 })).toBe(true);
    expect(walkDamage({ age: 2 })).toBe(true);
    expect(walkDamage({ age: 3 })).toBe(true);
  });

  it('harvest age 3 yields berries + resets', () => {
    const r = harvest({ age: 3 }, () => 0.5);
    expect(r.berries).toBeGreaterThan(0);
    expect(r.bush.age).toBe(1);
  });

  it('harvest age 0 nothing', () => {
    expect(harvest({ age: 0 }, Math.random).berries).toBe(0);
  });
});
