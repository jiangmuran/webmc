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

  it('range scales (wiki: 16→32, 21→48, 28→64, 35→80, 42→96)', () => {
    const at = (b: number) =>
      conduitPowerRange({ prismarineBlockCount: b, inWaterOrWaterlogged: true });
    expect(at(16)).toBe(32);
    expect(at(21)).toBe(48);
    expect(at(28)).toBe(64);
    expect(at(35)).toBe(80);
    expect(at(POWER_FULL)).toBe(96);
  });

  it('full ring attacks', () => {
    expect(attacksHostiles({ prismarineBlockCount: POWER_FULL, inWaterOrWaterlogged: true })).toBe(
      true,
    );
  });
});
