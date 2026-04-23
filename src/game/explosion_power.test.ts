import { describe, it, expect } from 'vitest';
import { damageToEntity, blastResistanceAbsorb, breaksBlocks } from './explosion_power';

const ex = { centerX: 0, centerY: 0, centerZ: 0, power: 4 };

describe('explosion power', () => {
  it('center max damage', () => {
    expect(damageToEntity(ex, 0, 0, 0, 1)).toBeGreaterThan(10);
  });

  it('far zero damage', () => {
    expect(damageToEntity(ex, 100, 0, 0, 1)).toBe(0);
  });

  it('exposure scales', () => {
    const a = damageToEntity(ex, 2, 0, 0, 0.5);
    const b = damageToEntity(ex, 2, 0, 0, 1);
    expect(b).toBeGreaterThan(a);
  });

  it('resistance absorbs', () => {
    expect(blastResistanceAbsorb(4, 30, 1)).toBeLessThan(4);
  });

  it('breaks when power > 0', () => {
    expect(breaksBlocks(ex)).toBe(true);
    expect(breaksBlocks({ ...ex, power: 0 })).toBe(false);
  });
});
