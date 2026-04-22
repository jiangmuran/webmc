import { describe, it, expect } from 'vitest';
import { consumeCharge, type SculkSpreadBlock } from './sculk_catalyst';

describe('sculk catalyst', () => {
  it('spreads sculk around a nearby death', () => {
    const out = consumeCharge({ x: 0, y: 0, z: 0 }, { x: 2, y: 0, z: 2 }, 10, {
      isReplaceable: () => true,
    });
    expect(out.length).toBeGreaterThan(0);
  });

  it('ignores deaths beyond 8 blocks', () => {
    const out = consumeCharge({ x: 0, y: 0, z: 0 }, { x: 30, y: 0, z: 0 }, 10, {
      isReplaceable: () => true,
    });
    expect(out.length).toBe(0);
  });

  it('occasionally drops sculk_sensor or shrieker', () => {
    const seen = new Set<SculkSpreadBlock>();
    for (let i = 0; i < 200; i++) {
      const out = consumeCharge({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, 15, {
        isReplaceable: () => true,
      });
      for (const entry of out) seen.add(entry.block);
    }
    expect(seen.has('sculk')).toBe(true);
  });

  it('respects isReplaceable false', () => {
    const out = consumeCharge({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, 5, {
      isReplaceable: () => false,
    });
    expect(out.length).toBe(0);
  });
});
