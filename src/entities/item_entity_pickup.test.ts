import { describe, it, expect } from 'vitest';
import { canPickUp, isDespawning, bobY, DESPAWN_TICKS } from './item_entity_pickup';

describe('item entity pickup', () => {
  it('blocked by pickup delay', () => {
    expect(canPickUp({ age: 0, pickupDelayTicks: 10, bobbingOffset: 0 }, true)).toBe(false);
  });

  it('picks up when delay 0 and overlapping', () => {
    expect(canPickUp({ age: 0, pickupDelayTicks: 0, bobbingOffset: 0 }, true)).toBe(true);
  });

  it('despawns at cap', () => {
    expect(isDespawning({ age: DESPAWN_TICKS, pickupDelayTicks: 0, bobbingOffset: 0 })).toBe(true);
  });

  it('bob y within range', () => {
    expect(Math.abs(bobY(0))).toBeLessThanOrEqual(0.1);
  });
});
