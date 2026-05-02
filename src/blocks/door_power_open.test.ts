import { describe, it, expect } from 'vitest';
import { syncedHalf, onRedstonePower, canHandOpen, type DoorState } from './door_power_open';

const lower: DoorState = { half: 'lower', hinge: 'left', open: false, powered: false };

describe('door power open', () => {
  it('syncs open state between halves', () => {
    const upper: DoorState = { ...lower, half: 'upper', open: true };
    expect(syncedHalf(lower, upper).open).toBe(true);
  });

  it('powering opens door', () => {
    expect(onRedstonePower(lower, true).open).toBe(true);
  });

  it('unpowering closes', () => {
    const powered = onRedstonePower(lower, true);
    expect(onRedstonePower(powered, false).open).toBe(false);
  });

  it('same signal no change', () => {
    expect(onRedstonePower(lower, false)).toBe(lower);
  });

  it('wooden door hand-open', () => {
    expect(canHandOpen('oak_door')).toBe(true);
  });

  it('iron door needs power', () => {
    expect(canHandOpen('iron_door')).toBe(false);
  });

  it('copper door is hand-openable per wiki', () => {
    expect(canHandOpen('copper_door')).toBe(true);
  });
});
