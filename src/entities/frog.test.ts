import { describe, it, expect } from 'vitest';
import { FROG_MAX_HEALTH, frogVariantFor, magmaDropFor, makeFrog, tickFrog } from './frog';

describe('frog', () => {
  it('mangrove swamp frog is warm', () => {
    expect(frogVariantFor('mangrove_swamp')).toBe('warm');
  });

  it('unknown biome falls back to temperate', () => {
    expect(frogVariantFor('xyz')).toBe('temperate');
  });

  it('fresh frog at max health', () => {
    expect(makeFrog(1, 'temperate', { x: 0, y: 0, z: 0 }).health).toBe(FROG_MAX_HEALTH);
  });

  it('idles without prey', () => {
    const f = makeFrog(1, 'temperate', { x: 0, y: 0, z: 0 });
    tickFrog(f, { nearestPrey: null, dtSec: 0.1 });
    expect(f.stance).toBe('idle');
  });

  it('tongue strikes close prey', () => {
    const f = makeFrog(1, 'warm', { x: 0, y: 0, z: 0 });
    const r = tickFrog(f, {
      nearestPrey: { id: 99, kind: 'slime', position: { x: 2, y: 0, z: 0 } },
      dtSec: 0.1,
    });
    expect(r.tongueAt).toBe(99);
  });

  it('warm frog eating magma cube drops pearlescent froglight', () => {
    const f = makeFrog(1, 'warm', { x: 0, y: 0, z: 0 });
    const r = tickFrog(f, {
      nearestPrey: { id: 99, kind: 'magma_cube', position: { x: 2, y: 0, z: 0 } },
      dtSec: 0.1,
    });
    expect(r.magmaEatenVariant).toBe('warm');
    expect(magmaDropFor('warm')).toBe('webmc:pearlescent_froglight');
  });

  it('tongue cooldown prevents double strike', () => {
    const f = makeFrog(1, 'temperate', { x: 0, y: 0, z: 0 });
    tickFrog(f, {
      nearestPrey: { id: 99, kind: 'slime', position: { x: 2, y: 0, z: 0 } },
      dtSec: 0.1,
    });
    const r2 = tickFrog(f, {
      nearestPrey: { id: 99, kind: 'slime', position: { x: 2, y: 0, z: 0 } },
      dtSec: 0.1,
    });
    expect(r2.tongueAt).toBeNull();
  });

  it('far prey triggers hopping, not tongue', () => {
    const f = makeFrog(1, 'temperate', { x: 0, y: 0, z: 0 });
    const r = tickFrog(f, {
      nearestPrey: { id: 99, kind: 'slime', position: { x: 50, y: 0, z: 0 } },
      dtSec: 0.1,
    });
    expect(r.tongueAt).toBeNull();
    expect(f.stance).toBe('hopping');
  });
});
