import { describe, it, expect } from 'vitest';
import { computePull, computePush, facingDelta, type PistonLookup } from './piston';

class Grid implements PistonLookup {
  readonly solid = new Set<string>();
  readonly immovable = new Set<string>();
  k(x: number, y: number, z: number): string {
    return `${x.toString()},${y.toString()},${z.toString()}`;
  }
  add(x: number, y: number, z: number, opts: { immovable?: boolean } = {}): void {
    this.solid.add(this.k(x, y, z));
    if (opts.immovable) this.immovable.add(this.k(x, y, z));
  }
  isSolid(x: number, y: number, z: number): boolean {
    return this.solid.has(this.k(x, y, z));
  }
  isImmovable(x: number, y: number, z: number): boolean {
    return this.immovable.has(this.k(x, y, z));
  }
}

describe('piston', () => {
  it('pushes a single block one cell in the facing direction', () => {
    const g = new Grid();
    g.add(1, 0, 0);
    const r = computePush({ x: 0, y: 0, z: 0 }, 'east', g);
    expect(r.blocked).toBe(false);
    expect(r.moved).toHaveLength(1);
    expect(r.moved[0]?.from).toEqual({ x: 1, y: 0, z: 0 });
    expect(r.moved[0]?.to).toEqual({ x: 2, y: 0, z: 0 });
  });

  it('pushes a chain of up to 12 blocks', () => {
    const g = new Grid();
    for (let i = 1; i <= 5; i++) g.add(i, 0, 0);
    const r = computePush({ x: 0, y: 0, z: 0 }, 'east', g);
    expect(r.blocked).toBe(false);
    expect(r.moved).toHaveLength(5);
  });

  it('blocks when chain exceeds 12', () => {
    const g = new Grid();
    for (let i = 1; i <= 13; i++) g.add(i, 0, 0);
    const r = computePush({ x: 0, y: 0, z: 0 }, 'east', g);
    expect(r.blocked).toBe(true);
  });

  it('blocks when any chain member is immovable', () => {
    const g = new Grid();
    g.add(1, 0, 0);
    g.add(2, 0, 0, { immovable: true });
    const r = computePush({ x: 0, y: 0, z: 0 }, 'east', g);
    expect(r.blocked).toBe(true);
  });

  it('sticky pull brings the block stuck to the head back', () => {
    const g = new Grid();
    // piston at origin, head at x=1, stuck block at x=2
    g.add(2, 0, 0);
    const r = computePull({ x: 0, y: 0, z: 0 }, 'east', g);
    expect(r.blocked).toBe(false);
    expect(r.moved).toHaveLength(1);
    expect(r.moved[0]?.from).toEqual({ x: 2, y: 0, z: 0 });
    expect(r.moved[0]?.to).toEqual({ x: 1, y: 0, z: 0 });
  });

  it('facingDelta returns unit vectors', () => {
    expect(facingDelta('up')).toEqual({ x: 0, y: 1, z: 0 });
    expect(facingDelta('east')).toEqual({ x: 1, y: 0, z: 0 });
    expect(facingDelta('north')).toEqual({ x: 0, y: 0, z: -1 });
  });
});
