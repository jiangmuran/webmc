import { describe, it, expect } from 'vitest';
import { computeExplosion, type ExplosionLookup } from './explosion';

class UniformWorld implements ExplosionLookup {
  constructor(
    private readonly solidEverywhere: boolean,
    private readonly res: number,
  ) {}
  resistance(): number {
    return this.res;
  }
  exists(): boolean {
    return this.solidEverywhere;
  }
}

describe('explosion', () => {
  it('destroys blocks near the center with low resistance', () => {
    const w = new UniformWorld(true, 0.5);
    const r = computeExplosion({ x: 0, y: 0, z: 0 }, 4, w);
    expect(r.destroyedBlocks.length).toBeGreaterThan(0);
  });

  it('higher resistance shrinks the destruction radius', () => {
    const weak = new UniformWorld(true, 0.5);
    const strong = new UniformWorld(true, 20);
    const weakR = computeExplosion({ x: 0, y: 0, z: 0 }, 4, weak);
    const strongR = computeExplosion({ x: 0, y: 0, z: 0 }, 4, strong);
    expect(strongR.destroyedBlocks.length).toBeLessThan(weakR.destroyedBlocks.length);
  });

  it('damages entities within radius', () => {
    const w = new UniformWorld(false, 0);
    const r = computeExplosion({ x: 0, y: 0, z: 0 }, 4, w, [
      { id: 1, position: { x: 0, y: 0, z: 0 }, radius: 0.5 }, // at center = max damage
      { id: 2, position: { x: 7, y: 0, z: 0 }, radius: 0.5 }, // near edge = less damage
      { id: 3, position: { x: 20, y: 0, z: 0 }, radius: 0.5 }, // out of range
    ]);
    expect(r.damagedEntities.some((e) => e.id === 1)).toBe(true);
    expect(r.damagedEntities.some((e) => e.id === 3)).toBe(false);
    const dmg1 = r.damagedEntities.find((e) => e.id === 1)?.damage ?? 0;
    const dmg2 = r.damagedEntities.find((e) => e.id === 2)?.damage ?? 0;
    expect(dmg1).toBeGreaterThanOrEqual(dmg2);
  });

  it('zero-power explosion does nothing', () => {
    const w = new UniformWorld(true, 1);
    const r = computeExplosion({ x: 0, y: 0, z: 0 }, 0, w);
    expect(r.destroyedBlocks.length).toBe(0);
    expect(r.damagedEntities.length).toBe(0);
  });
});
