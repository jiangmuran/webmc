import { describe, it, expect } from 'vitest';
import {
  MINESHAFT,
  STRONGHOLD_MARKER,
  StructureCoordinator,
  VILLAGE_HUT,
  type StructureRule,
} from './structures';

describe('StructureCoordinator', () => {
  it('produces no placements for a low-probability rule and small search', () => {
    const rules: StructureRule[] = [{ template: VILLAGE_HUT, anchorChance: 0.0, anchorSalt: 1 }];
    const coord = new StructureCoordinator(42, rules);
    expect(coord.blocksFor(0, 0).length).toBe(0);
  });

  it('produces placements for a high-probability rule', () => {
    const rules: StructureRule[] = [{ template: VILLAGE_HUT, anchorChance: 1, anchorSalt: 1 }];
    const coord = new StructureCoordinator(42, rules);
    const blocks = coord.blocksFor(0, 0);
    expect(blocks.length).toBeGreaterThan(0);
  });

  it('deterministic: same seed + chunk → same placements', () => {
    const rules: StructureRule[] = [{ template: MINESHAFT, anchorChance: 1, anchorSalt: 2 }];
    const a = new StructureCoordinator(123, rules).blocksFor(5, -3);
    const b = new StructureCoordinator(123, rules).blocksFor(5, -3);
    expect(a.length).toBe(b.length);
    expect(a[0]?.pos).toEqual(b[0]?.pos);
  });

  it('different seeds produce different results', () => {
    const rules: StructureRule[] = [{ template: MINESHAFT, anchorChance: 1, anchorSalt: 2 }];
    const a = new StructureCoordinator(123, rules).blocksFor(5, -3);
    const b = new StructureCoordinator(999, rules).blocksFor(5, -3);
    expect(a).not.toEqual(b);
  });

  it('stronghold marker places one end_portal_frame', () => {
    const rules: StructureRule[] = [
      { template: STRONGHOLD_MARKER, anchorChance: 1, anchorSalt: 3 },
    ];
    const coord = new StructureCoordinator(7, rules);
    const blocks = coord.blocksFor(0, 0);
    expect(blocks.filter((b) => b.block === 'webmc:end_portal_frame').length).toBeGreaterThan(0);
  });

  it('mineshaft spans multiple chunks when anchored at a boundary', () => {
    // Anchor at (0, 0); mineshaft of 8 segments along x could spill into (1, 0).
    const rules: StructureRule[] = [{ template: MINESHAFT, anchorChance: 1, anchorSalt: 2 }];
    const coord = new StructureCoordinator(77, rules);
    const own = coord.blocksFor(0, 0);
    const neighbour = coord.blocksFor(1, 0);
    expect(own.length + neighbour.length).toBeGreaterThan(own.length);
  });
});
