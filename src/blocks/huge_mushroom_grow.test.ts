import { describe, it, expect } from 'vitest';
import { canBonemealToHuge, stemHeight, capRadius } from './huge_mushroom_grow';

describe('huge mushroom grow', () => {
  it('too bright', () => {
    expect(canBonemealToHuge({ lightLevel: 15, verticalClearance: 10, validSoil: true })).toBe(
      false,
    );
  });

  it('not enough clearance', () => {
    expect(canBonemealToHuge({ lightLevel: 8, verticalClearance: 4, validSoil: true })).toBe(false);
  });

  it('invalid soil', () => {
    expect(canBonemealToHuge({ lightLevel: 8, verticalClearance: 10, validSoil: false })).toBe(
      false,
    );
  });

  it('valid all', () => {
    expect(canBonemealToHuge({ lightLevel: 8, verticalClearance: 10, validSoil: true })).toBe(true);
  });

  it('stem height in range', () => {
    for (let i = 0; i < 50; i++) {
      const h = stemHeight(Math.random);
      expect(h).toBeGreaterThanOrEqual(4);
      expect(h).toBeLessThanOrEqual(7);
    }
  });

  it('cap radius', () => {
    expect(capRadius()).toBe(2);
  });
});
