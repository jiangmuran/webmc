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

  it('bone meal grows berries on berry-less vines (wiki: does NOT extend)', () => {
    // Wiki (minecraft.wiki/w/Glow_Berries): "Using bone meal on a
    // cave vine block does not grow a new vine block... Using bone
    // meal on any block of a cave vine causes it to grow glow
    // berries, if it was not already bearing them."
    const v = makeCaveVine();
    growVine(v, () => 0.01);
    growVine(v, () => 0.01);
    const beforeLen = v.segments.length;
    for (const s of v.segments) s.hasBerries = false;
    const added = boneMealVine(v, () => 0.5);
    expect(added).toBe(beforeLen);
    expect(v.segments.length).toBe(beforeLen);
    expect(v.segments.every((s) => s.hasBerries)).toBe(true);
  });

  it('bone meal does nothing if all segments already berry', () => {
    const v = makeCaveVine();
    v.segments[0]!.hasBerries = true;
    expect(boneMealVine(v, () => 0)).toBe(0);
  });
});
