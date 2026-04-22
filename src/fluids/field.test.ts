import { describe, it, expect } from 'vitest';
import { type FluidCell, LEVEL_SOURCE, applyFluidUpdates, keyOf, tickFluid } from './field';

function run(cells: Map<string, FluidCell>, solids: Set<string>, ticks = 1): void {
  const isSolid = (x: number, y: number, z: number): boolean => solids.has(keyOf({ x, y, z }));
  for (let i = 0; i < ticks; i++) {
    const { updates } = tickFluid(cells, isSolid);
    applyFluidUpdates(cells, updates);
  }
}

describe('tickFluid — water', () => {
  it('source cell fills the block directly below unconditionally', () => {
    const cells = new Map<string, FluidCell>();
    cells.set(keyOf({ x: 0, y: 10, z: 0 }), { kind: 'water', level: LEVEL_SOURCE, source: true });
    const solids = new Set<string>(); // nothing below — open air
    run(cells, solids, 1);
    const below = cells.get(keyOf({ x: 0, y: 9, z: 0 }));
    expect(below).toBeDefined();
    expect(below?.kind).toBe('water');
    expect(below?.source).toBe(false);
  });

  it('source spreads horizontally with level-1 attenuation per block on a flat floor', () => {
    const cells = new Map<string, FluidCell>();
    cells.set(keyOf({ x: 0, y: 10, z: 0 }), { kind: 'water', level: LEVEL_SOURCE, source: true });
    const solids = new Set<string>();
    for (let x = -5; x <= 5; x++) {
      for (let z = -5; z <= 5; z++) solids.add(keyOf({ x, y: 9, z }));
    }
    run(cells, solids, 6);
    const at1 = cells.get(keyOf({ x: 1, y: 10, z: 0 }));
    const at2 = cells.get(keyOf({ x: 2, y: 10, z: 0 }));
    expect(at1?.level).toBeGreaterThanOrEqual(at2?.level ?? 0);
    expect(at1?.level).toBeGreaterThan(0);
  });

  it('water does not flow through solid blocks', () => {
    const cells = new Map<string, FluidCell>();
    cells.set(keyOf({ x: 0, y: 10, z: 0 }), { kind: 'water', level: LEVEL_SOURCE, source: true });
    const solids = new Set<string>();
    for (let x = -3; x <= 3; x++) solids.add(keyOf({ x, y: 9, z: 0 }));
    solids.add(keyOf({ x: 1, y: 10, z: 0 }));
    run(cells, solids, 3);
    expect(cells.get(keyOf({ x: 1, y: 10, z: 0 }))).toBeUndefined();
  });

  it('lava attenuates 2 per horizontal block (vs water 1)', () => {
    const waterCells = new Map<string, FluidCell>();
    waterCells.set(keyOf({ x: 0, y: 10, z: 0 }), {
      kind: 'water',
      level: LEVEL_SOURCE,
      source: true,
    });
    const lavaCells = new Map<string, FluidCell>();
    lavaCells.set(keyOf({ x: 0, y: 10, z: 0 }), {
      kind: 'lava',
      level: LEVEL_SOURCE,
      source: true,
    });
    const solids = new Set<string>();
    for (let x = -5; x <= 5; x++) solids.add(keyOf({ x, y: 9, z: 0 }));
    run(waterCells, solids, 5);
    run(lavaCells, solids, 5);
    const waterReach = Array.from(waterCells.keys()).filter(
      (k) => k.startsWith('') && k !== keyOf({ x: 0, y: 10, z: 0 }),
    ).length;
    const lavaReach = Array.from(lavaCells.keys()).filter(
      (k) => k.startsWith('') && k !== keyOf({ x: 0, y: 10, z: 0 }),
    ).length;
    expect(lavaReach).toBeLessThan(waterReach);
  });

  it('dries up non-source cells once the source is removed', () => {
    const cells = new Map<string, FluidCell>();
    cells.set(keyOf({ x: 0, y: 10, z: 0 }), { kind: 'water', level: LEVEL_SOURCE, source: true });
    const solids = new Set<string>();
    for (let x = -5; x <= 5; x++) solids.add(keyOf({ x, y: 9, z: 0 }));
    run(cells, solids, 10);
    cells.delete(keyOf({ x: 0, y: 10, z: 0 })); // remove source
    run(cells, solids, 15);
    // All flowing cells should have drained.
    for (const [, cell] of cells) {
      expect(cell.source).toBe(true); // but there are no sources left
    }
    expect(cells.size).toBe(0);
  });
});

describe('applyFluidUpdates', () => {
  it('sets and deletes cells in place', () => {
    const cells = new Map<string, FluidCell>();
    cells.set(keyOf({ x: 0, y: 0, z: 0 }), { kind: 'water', level: 5, source: false });
    const updates = new Map<string, FluidCell | null>();
    updates.set(keyOf({ x: 0, y: 0, z: 0 }), null);
    updates.set(keyOf({ x: 1, y: 0, z: 0 }), { kind: 'water', level: 7, source: true });
    applyFluidUpdates(cells, updates);
    expect(cells.has(keyOf({ x: 0, y: 0, z: 0 }))).toBe(false);
    expect(cells.get(keyOf({ x: 1, y: 0, z: 0 }))?.source).toBe(true);
  });
});
