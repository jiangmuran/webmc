import { describe, it, expect } from 'vitest';
import { knockbackVector, maceSmash, makeWindChargeBurst } from './wind_charge';

describe('wind charge', () => {
  it('makes a 2-radius burst', () => {
    const b = makeWindChargeBurst({ x: 0, y: 0, z: 0 });
    expect(b.radius).toBe(2);
    expect(b.damage).toBe(0);
  });

  it('knockback falls off with distance', () => {
    const b = makeWindChargeBurst({ x: 0, y: 0, z: 0 });
    const near = knockbackVector(b, { x: 0.5, y: 0, z: 0 });
    const far = knockbackVector(b, { x: 1.8, y: 0, z: 0 });
    expect(Math.abs(near?.x ?? 0)).toBeGreaterThan(Math.abs(far?.x ?? 0));
  });

  it('out-of-range returns null', () => {
    const b = makeWindChargeBurst({ x: 0, y: 0, z: 0 });
    expect(knockbackVector(b, { x: 10, y: 0, z: 0 })).toBeNull();
  });

  it('knockback includes upward lift', () => {
    const b = makeWindChargeBurst({ x: 0, y: 0, z: 0 });
    const k = knockbackVector(b, { x: 0.5, y: 0, z: 0 });
    expect(k?.y).toBeGreaterThan(0);
  });
});

describe('mace smash', () => {
  it('3-block fall adds 12 damage', () => {
    const r = maceSmash({ fallDistance: 3, densityLevel: 0, base: 6 });
    expect(r.damage).toBe(18);
  });

  it('density enchant adds per-block bonus', () => {
    const plain = maceSmash({ fallDistance: 5, densityLevel: 0, base: 6 });
    const dense = maceSmash({ fallDistance: 5, densityLevel: 3, base: 6 });
    expect(dense.damage).toBeGreaterThan(plain.damage);
  });

  it('smash burst has bigger radius than a plain wind charge', () => {
    const r = maceSmash({ fallDistance: 5, densityLevel: 0, base: 6 });
    expect(r.burst.radius).toBeGreaterThan(2);
  });

  it('8-block fall: 12 (tier 1) + 10 (tier 2) = 22 bonus (wiki)', () => {
    const r = maceSmash({ fallDistance: 8, densityLevel: 0, base: 0 });
    expect(r.damage).toBe(22);
  });

  it('20-block fall: tier1+tier2+tier3 = 12+10+12 = 34 (wiki, unlimited)', () => {
    const r = maceSmash({ fallDistance: 20, densityLevel: 0, base: 0 });
    // 3 × 4 = 12 (tier1), 5 × 2 = 10 (tier2), (20 − 8) × 1 = 12 (tier3) = 34
    expect(r.damage).toBe(34);
  });

  it('density applies to the full fall distance, not capped', () => {
    const r = maceSmash({ fallDistance: 20, densityLevel: 5, base: 0 });
    // Base bonus (above) = 34. Density: 5 × 0.5 × 20 = 50. Total = 84.
    expect(r.damage).toBe(84);
  });
});
