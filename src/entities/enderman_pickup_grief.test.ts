import { describe, it, expect } from 'vitest';
import { canPickUp, pickupTicks, dropsOnDeath } from './enderman_pickup_grief';

describe('enderman pickup grief', () => {
  it('grass pickable', () => {
    expect(canPickUp('grass_block')).toBe(true);
  });

  it('obsidian not', () => {
    expect(canPickUp('obsidian')).toBe(false);
  });

  it('pickup delay positive', () => {
    expect(pickupTicks()).toBeGreaterThan(0);
  });

  it('drops held on death', () => {
    expect(dropsOnDeath('dirt')).toBe('dirt');
  });

  it('empty hands drop undefined', () => {
    expect(dropsOnDeath()).toBeUndefined();
  });
});
