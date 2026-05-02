import { describe, it, expect } from 'vitest';
import { COBWEB_DENSITY, planMineshaft, rollMinecartLoot } from './mineshaft';

describe('mineshaft', () => {
  it('starts with a corridor', () => {
    const p = planMineshaft({ rng: () => 0.1, maxDepth: 5, maxPieces: 1 });
    expect(p[0]?.kind).toBe('corridor');
  });

  it('respects maxPieces', () => {
    const p = planMineshaft({ rng: () => 0.5, maxDepth: 100, maxPieces: 7 });
    expect(p.length).toBeLessThanOrEqual(7);
  });

  it('respects maxDepth', () => {
    const p = planMineshaft({ rng: () => 0.5, maxDepth: 2, maxPieces: 100 });
    for (const piece of p) expect(piece.depth).toBeLessThanOrEqual(2);
  });

  it('cobweb density is 15%', () => {
    expect(COBWEB_DENSITY).toBe(0.15);
  });

  it('loot at low roll = diamond', () => {
    expect(rollMinecartLoot(0.01)?.item).toBe('webmc:diamond');
  });

  it('loot at high roll still returns something', () => {
    expect(rollMinecartLoot(0.99)).not.toBeNull();
  });

  it('lapis entry uses canonical webmc:lapis_lazuli id (not legacy lapis)', () => {
    // Wiki minecraft.wiki/w/Mineshaft: lapis_lazuli is the dropped
    // item. The item registry keys it as `webmc:lapis_lazuli`. Old
    // table id `webmc:lapis` resolved to nothing.
    const all: { item: string }[] = [];
    for (let i = 0; i < 200; i++) {
      const e = rollMinecartLoot(i / 200);
      if (e) all.push(e);
    }
    const ids = new Set(all.map((e) => e.item));
    expect(ids.has('webmc:lapis_lazuli')).toBe(true);
    expect(ids.has('webmc:lapis')).toBe(false);
  });
});
