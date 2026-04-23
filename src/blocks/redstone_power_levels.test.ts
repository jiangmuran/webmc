import { describe, it, expect } from 'vitest';
import {
  levelAfterWire,
  maxOfNeighbors,
  isFull,
  dustPropagates,
  DUST_MAX,
} from './redstone_power_levels';

describe('redstone power levels', () => {
  it('attenuation 1', () => {
    expect(levelAfterWire({ sourceLevel: 15, attenuation: 1 })).toBe(14);
  });

  it('clamps at 0', () => {
    expect(levelAfterWire({ sourceLevel: 0, attenuation: 5 })).toBe(0);
  });

  it('max of neighbors', () => {
    expect(maxOfNeighbors([3, 10, 7])).toBe(10);
  });

  it('full at 15', () => {
    expect(isFull(15)).toBe(true);
    expect(isFull(14)).toBe(false);
  });

  it('dust propagate 15 → 14', () => {
    expect(dustPropagates(15)).toBe(14);
    expect(dustPropagates(0)).toBe(0);
  });

  it('max 15', () => {
    expect(DUST_MAX).toBe(15);
  });
});
