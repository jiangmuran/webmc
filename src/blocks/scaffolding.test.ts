import { describe, it, expect } from 'vitest';
import { distanceToSupport, isFloating, type ScaffoldingLookup } from './scaffolding';

class Grid implements ScaffoldingLookup {
  constructor(
    private readonly scaff: Set<string>,
    private readonly supports: Set<string>,
  ) {}
  private k(x: number, y: number, z: number): string {
    return `${x.toString()},${y.toString()},${z.toString()}`;
  }
  isScaffolding(x: number, y: number, z: number): boolean {
    return this.scaff.has(this.k(x, y, z));
  }
  hasSupport(x: number, y: number, z: number): boolean {
    return this.supports.has(this.k(x, y, z));
  }
}

describe('scaffolding', () => {
  it('0 distance when directly supported', () => {
    const g = new Grid(new Set(['0,0,0']), new Set(['0,0,0']));
    expect(distanceToSupport({ x: 0, y: 0, z: 0 }, g)).toBe(0);
  });

  it('finds chain to support within 6', () => {
    const scaff = new Set<string>();
    for (let x = 0; x <= 5; x++) scaff.add(`${x.toString()},0,0`);
    const supports = new Set(['5,0,0']);
    const g = new Grid(scaff, supports);
    expect(distanceToSupport({ x: 0, y: 0, z: 0 }, g)).toBe(5);
  });

  it('returns -1 when chain exceeds 6', () => {
    const scaff = new Set<string>();
    for (let x = 0; x <= 7; x++) scaff.add(`${x.toString()},0,0`);
    const supports = new Set(['7,0,0']);
    const g = new Grid(scaff, supports);
    expect(distanceToSupport({ x: 0, y: 0, z: 0 }, g)).toBe(-1);
  });

  it('isFloating is -1 shorthand', () => {
    const g = new Grid(new Set(['0,0,0']), new Set());
    expect(isFloating({ x: 0, y: 0, z: 0 }, g)).toBe(true);
  });
});
