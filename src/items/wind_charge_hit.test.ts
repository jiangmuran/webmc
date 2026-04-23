import { describe, it, expect } from 'vitest';
import { knockbackForEntity, breaksSomeBlocks, KNOCKBACK_RADIUS } from './wind_charge_hit';

describe('wind charge hit', () => {
  const w = { impactX: 0, impactY: 0, impactZ: 0, knockbackStrength: 1 };

  it('pushes entity outward', () => {
    const kb = knockbackForEntity(w, 2, 0, 0);
    expect(kb.vx).toBeGreaterThan(0);
  });

  it('outside radius no push', () => {
    const kb = knockbackForEntity(w, KNOCKBACK_RADIUS + 5, 0, 0);
    expect(kb.vx).toBe(0);
  });

  it('at impact no push', () => {
    expect(knockbackForEntity(w, 0, 0, 0)).toEqual({ vx: 0, vy: 0, vz: 0 });
  });

  it('breakable list', () => {
    expect(breaksSomeBlocks()).toContain('chorus_flower');
  });
});
