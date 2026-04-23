import { describe, it, expect } from 'vitest';
import { isActive, conduitPowerRange, attacksHostiles, POWER_FULL } from './conduit_structure';

describe('conduit structure', () => {
  it('dry is inactive', () => {
    expect(isActive({ prismarineBlockCount: 40, inWaterOrWaterlogged: false })).toBe(false);
  });

  it('needs min frame', () => {
    expect(isActive({ prismarineBlockCount: 10, inWaterOrWaterlogged: true })).toBe(false);
  });

  it('active in water + frame', () => {
    expect(isActive({ prismarineBlockCount: 16, inWaterOrWaterlogged: true })).toBe(true);
  });

  it('range scales', () => {
    expect(
      conduitPowerRange({ prismarineBlockCount: POWER_FULL, inWaterOrWaterlogged: true }),
    ).toBeGreaterThan(
      conduitPowerRange({ prismarineBlockCount: 16, inWaterOrWaterlogged: true }),
    );
  });

  it('full ring attacks', () => {
    expect(attacksHostiles({ prismarineBlockCount: POWER_FULL, inWaterOrWaterlogged: true })).toBe(
      true,
    );
  });
});
