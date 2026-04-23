import { describe, it, expect } from 'vitest';
import {
  shouldIgnite,
  tickFuse,
  readyToExplode,
  explosionPower,
  FUSE_TICKS,
  type CreeperState,
} from './creeper_explode_charge';

const base: CreeperState = {
  fuseTicks: 0,
  chargedByLightning: false,
  ignitedManually: false,
  targetInRange: false,
};

describe('creeper explode charge', () => {
  it('ignites when target close', () => {
    expect(shouldIgnite({ ...base, targetInRange: true })).toBe(true);
  });

  it('manual ignite works', () => {
    expect(shouldIgnite({ ...base, ignitedManually: true })).toBe(true);
  });

  it('idle no ignite', () => {
    expect(shouldIgnite(base)).toBe(false);
  });

  it('fuse increments', () => {
    expect(tickFuse(base, true).fuseTicks).toBe(1);
  });

  it('fuse decrements when target leaves', () => {
    const lit: CreeperState = { ...base, fuseTicks: 10 };
    expect(tickFuse(lit, false).fuseTicks).toBe(9);
  });

  it('explodes at full fuse', () => {
    expect(readyToExplode({ ...base, fuseTicks: FUSE_TICKS })).toBe(true);
  });

  it('charged twice the power', () => {
    const normal = explosionPower(base);
    const charged = explosionPower({ ...base, chargedByLightning: true });
    expect(charged).toBe(normal * 2);
  });
});
