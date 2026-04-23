import { describe, it, expect } from 'vitest';
import {
  canPlaceAt,
  DEFAULT_WATER_SPRING,
  DEFAULT_LAVA_SPRING,
} from './water_spring';

describe('water spring', () => {
  it('water in range + neighbors', () => {
    expect(canPlaceAt(10, DEFAULT_WATER_SPRING, true)).toBe(true);
  });

  it('out of range fails', () => {
    expect(canPlaceAt(500, DEFAULT_WATER_SPRING, true)).toBe(false);
  });

  it('exposed no neighbors', () => {
    expect(canPlaceAt(10, DEFAULT_WATER_SPRING, false)).toBe(false);
  });

  it('lava only low', () => {
    expect(canPlaceAt(-20, DEFAULT_LAVA_SPRING, true)).toBe(true);
    expect(canPlaceAt(200, DEFAULT_LAVA_SPRING, true)).toBe(false);
  });
});
