import { describe, it, expect } from 'vitest';
import { allowsFluidFlow, isPassable, makeCopperGrate, oxidize, wax } from './copper_grate';

describe('copper grate', () => {
  it('is passable + fluids flow', () => {
    expect(isPassable()).toBe(true);
    expect(allowsFluidFlow()).toBe(true);
  });

  it('oxidizes through 3 stages + caps', () => {
    const g = makeCopperGrate();
    expect(oxidize(g)).toBe(true);
    expect(g.oxidation).toBe('exposed');
    oxidize(g);
    oxidize(g);
    expect(g.oxidation).toBe('oxidized');
    expect(oxidize(g)).toBe(false);
  });

  it('waxing stops oxidation', () => {
    const g = makeCopperGrate();
    wax(g);
    expect(oxidize(g)).toBe(false);
  });
});
