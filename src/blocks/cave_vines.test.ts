import { describe, it, expect } from 'vitest';
import { boneMealVine, growVine, harvestBerries, lightEmission, makeCaveVine } from './cave_vines';

describe('cave vines', () => {
  it('grows downward over time', () => {
    const v = makeCaveVine();
    for (let i = 0; i < 1000 && v.segments.length < 26; i++) {
      growVine(v, () => 0.01);
    }
    expect(v.segments.length).toBe(26);
  });

  it('berries emit light 14', () => {
    expect(lightEmission({ hasBerries: true, isBase: false })).toBe(14);
    expect(lightEmission({ hasBerries: false, isBase: false })).toBe(0);
  });

  it('harvest drops 1 berry + clears', () => {
    const seg = { hasBerries: true, isBase: true };
    expect(harvestBerries(seg)).toBe(1);
    expect(seg.hasBerries).toBe(false);
    expect(harvestBerries(seg)).toBe(0);
  });

  it('bone meal adds 1-2 segments with berries', () => {
    const v = makeCaveVine();
    const added = boneMealVine(v, () => 0.5);
    expect(added).toBeGreaterThanOrEqual(1);
    expect(added).toBeLessThanOrEqual(2);
    expect(v.segments[v.segments.length - 1]?.hasBerries).toBe(true);
  });
});
