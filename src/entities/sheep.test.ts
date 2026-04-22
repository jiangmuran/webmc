import { describe, it, expect } from 'vitest';
import { dyeSheep, eatGrass, makeSheep, shearSheep } from './sheep';

describe('sheep', () => {
  it('shearing drops 1-3 wool', () => {
    const s = makeSheep('red');
    const r = shearSheep(s, () => 0.99);
    expect(r.drops.length).toBeGreaterThanOrEqual(1);
    expect(r.drops.length).toBeLessThanOrEqual(3);
    expect(s.sheared).toBe(true);
  });

  it('already sheared drops nothing', () => {
    const s = makeSheep();
    shearSheep(s);
    expect(shearSheep(s).drops.length).toBe(0);
  });

  it('eating grass regrows coat', () => {
    const s = makeSheep();
    shearSheep(s);
    expect(eatGrass(s)).toBe(true);
    expect(s.sheared).toBe(false);
  });

  it('eating grass when coat present is a no-op', () => {
    const s = makeSheep();
    expect(eatGrass(s)).toBe(false);
  });

  it('dye changes color', () => {
    const s = makeSheep('white');
    expect(dyeSheep(s, 'red')).toBe(true);
    expect(s.color).toBe('red');
  });

  it('same color returns false', () => {
    const s = makeSheep('red');
    expect(dyeSheep(s, 'red')).toBe(false);
  });
});
