import { describe, it, expect } from 'vitest';
import { makeSlimeVariant, slimeAabbSize, splitSlime } from './slime_size';

describe('slime variants', () => {
  it('size determines HP + attack', () => {
    const big = makeSlimeVariant(4);
    const small = makeSlimeVariant(2);
    const tiny = makeSlimeVariant(1);
    expect(big.hp).toBeGreaterThan(small.hp);
    expect(big.attackDamage).toBeGreaterThan(small.attackDamage);
    expect(tiny.attackDamage).toBe(0);
  });

  it("tiny slime doesn't split", () => {
    const s = makeSlimeVariant(1);
    expect(splitSlime(s).spawnedSizes.length).toBe(0);
  });

  it('large slime spawns small slimes', () => {
    const s = makeSlimeVariant(4);
    const r = splitSlime(s, () => 0.99);
    expect(r.spawnedSizes.length).toBe(4);
    expect(r.spawnedSizes.every((x) => x === 2)).toBe(true);
  });

  it('small slime spawns tinies', () => {
    const s = makeSlimeVariant(2);
    const r = splitSlime(s, () => 0.5);
    expect(r.spawnedSizes.every((x) => x === 1)).toBe(true);
  });

  it('aabb size scales linearly', () => {
    expect(slimeAabbSize(4)).toBeGreaterThan(slimeAabbSize(2));
  });
});
