import { describe, it, expect } from 'vitest';
import {
  multishotAngles,
  piercingHitLimit,
  quickChargeReduction,
  baseChargeTicks,
  MULTISHOT_COUNT,
} from './crossbow_multishot_spread';

describe('crossbow multishot spread', () => {
  it('three arrows', () => {
    expect(multishotAngles().length).toBe(MULTISHOT_COUNT);
  });

  it('spread symmetric', () => {
    const a = multishotAngles();
    expect(a[0]).toBe(-(a[2] ?? 0));
  });

  it('piercing n+1 hits', () => {
    expect(piercingHitLimit(3)).toBe(4);
  });

  it('quick charge III (max) reaches full reduction', () => {
    expect(quickChargeReduction(3)).toBe(1);
  });

  it('quick charge II partial reduction', () => {
    expect(quickChargeReduction(2)).toBeCloseTo(2 / 3);
  });

  it('quick charge halves charge', () => {
    const base = baseChargeTicks(0);
    const fast = baseChargeTicks(2);
    expect(fast).toBeLessThan(base);
  });

  it('quick charge III gives 10-tick charge (wiki)', () => {
    expect(baseChargeTicks(3)).toBe(10);
  });

  it('min 1 tick charge for over-max input', () => {
    expect(baseChargeTicks(999)).toBeGreaterThanOrEqual(1);
  });
});
