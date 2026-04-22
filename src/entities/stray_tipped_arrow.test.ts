import { describe, it, expect } from 'vitest';
import {
  nextShot,
  dropsOnDeath,
  onlySpawnsInSnowyBiomes,
  STRAY_SLOWNESS_DURATION_TICKS,
} from './stray_tipped_arrow';

describe('stray tipped arrow', () => {
  it('shoots slowness', () => {
    expect(nextShot().arrowType).toBe('tipped_slowness');
  });

  it('30 second slowness', () => {
    expect(nextShot().slownessDurationTicks).toBe(STRAY_SLOWNESS_DURATION_TICKS);
    expect(STRAY_SLOWNESS_DURATION_TICKS).toBe(600);
  });

  it('always drops bone', () => {
    expect(dropsOnDeath(() => 0.5)).toContain('bone');
  });

  it('arrow on lucky roll', () => {
    expect(dropsOnDeath(() => 0)).toContain('arrow_slowness');
  });

  it('snowy biome check', () => {
    expect(onlySpawnsInSnowyBiomes('snowy_plains')).toBe(true);
    expect(onlySpawnsInSnowyBiomes('frozen_ocean')).toBe(true);
    expect(onlySpawnsInSnowyBiomes('plains')).toBe(false);
  });
});
