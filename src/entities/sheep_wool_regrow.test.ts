import { describe, it, expect } from 'vitest';
import { onShear, eatingGrassRegrowsWool, applyDye, type SheepState } from './sheep_wool_regrow';

const white: SheepState = { color: 'white', hasWool: true, eatingGrassTicks: 0 };

describe('sheep wool regrow', () => {
  it('shearing drops wool', () => {
    expect(onShear(white).drops.length).toBeGreaterThan(0);
  });

  it('shearing removes wool', () => {
    expect(onShear(white).newSheep.hasWool).toBe(false);
  });

  it('shearing bald no drops', () => {
    expect(onShear({ ...white, hasWool: false }).drops).toEqual([]);
  });

  it('regrows only when bald', () => {
    expect(eatingGrassRegrowsWool({ ...white, hasWool: false }).regrows).toBe(true);
    expect(eatingGrassRegrowsWool(white).regrows).toBe(false);
  });

  it('dye recolors', () => {
    expect(applyDye(white, 'blue').color).toBe('blue');
  });

  it('dye bald has no effect', () => {
    expect(applyDye({ ...white, hasWool: false }, 'red').color).toBe('white');
  });

  it('shearing drops 1-3 wool (wiki: variable, not fixed 2)', () => {
    expect(onShear(white, () => 0).drops.length).toBe(1);
    expect(onShear(white, () => 0.999).drops.length).toBe(3);
    const seen = new Set<number>();
    for (let i = 0; i < 200; i++) {
      seen.add(onShear(white, Math.random).drops.length);
    }
    expect(seen.has(1) || seen.has(2) || seen.has(3)).toBe(true);
    for (const c of seen) {
      expect(c).toBeGreaterThanOrEqual(1);
      expect(c).toBeLessThanOrEqual(3);
    }
  });
});
