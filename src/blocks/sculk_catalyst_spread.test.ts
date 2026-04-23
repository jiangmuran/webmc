import { describe, it, expect } from 'vitest';
import {
  chargeFromKill,
  sculkBlocksPlaced,
  emitsSoulSpawnParticle,
  MAX_SPREAD_RADIUS,
} from './sculk_catalyst_spread';

describe('sculk catalyst spread', () => {
  it('charge = xp', () => {
    expect(chargeFromKill(5)).toBe(5);
  });

  it('no xp no charge', () => {
    expect(chargeFromKill(0)).toBe(0);
  });

  it('placed clamped by available', () => {
    expect(sculkBlocksPlaced({ mobXpDrop: 10, nearbyBlocksAvailable: 3 })).toBe(3);
  });

  it('placed clamped by charge', () => {
    expect(sculkBlocksPlaced({ mobXpDrop: 2, nearbyBlocksAvailable: 100 })).toBe(2);
  });

  it('soul particle only on xp', () => {
    expect(emitsSoulSpawnParticle(0)).toBe(false);
    expect(emitsSoulSpawnParticle(3)).toBe(true);
  });

  it('max radius positive', () => {
    expect(MAX_SPREAD_RADIUS).toBeGreaterThan(0);
  });
});
