import { describe, it, expect } from 'vitest';
import { totalSlots, canAdd, fullnessFraction, BUNDLE_CAPACITY } from './bundle_open_inventory';

describe('bundle open inventory', () => {
  it('empty is 0 slots', () => {
    expect(totalSlots([])).toBe(0);
  });

  it('stack fills slots', () => {
    expect(totalSlots([{ id: 'stone', count: 32, stackSize: 64 }])).toBe(64);
  });

  it('can add while under cap', () => {
    expect(canAdd([], 64, 1)).toBe(true);
  });

  it('reject overfill', () => {
    expect(canAdd([{ id: 'a', count: 64, stackSize: 64 }], 64, 1)).toBe(false);
  });

  it('fullness clamps to 1', () => {
    expect(fullnessFraction([{ id: 'a', count: 65, stackSize: 64 }])).toBe(1);
    expect(fullnessFraction([])).toBe(0);
  });

  it('capacity 64', () => {
    expect(BUNDLE_CAPACITY).toBe(64);
  });
});
