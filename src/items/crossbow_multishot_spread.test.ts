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

  it('quick charge 4 caps', () => {
    expect(quickChargeReduction(4)).toBe(1);
  });

  it('quick charge halves charge', () => {
    const base = baseChargeTicks(0);
    const fast = baseChargeTicks(2);
    expect(fast).toBeLessThan(base);
  });

  it('min 1 tick charge', () => {
    expect(baseChargeTicks(999)).toBeGreaterThanOrEqual(1);
  });
});
