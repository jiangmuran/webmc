import { describe, it, expect } from 'vitest';
import {
  portalBlockCount,
  MIN_INNER_WIDTH,
  MIN_INNER_HEIGHT,
  MAX_INNER_WIDTH,
  MAX_INNER_HEIGHT,
} from './obsidian_portal_ignite';

describe('portal ignite', () => {
  it('block count on minimum frame', () => {
    const s = {
      minX: 0,
      maxX: MIN_INNER_WIDTH - 1,
      minY: 0,
      maxY: MIN_INNER_HEIGHT - 1,
      minZ: 0,
      maxZ: 0,
      axis: 'x' as const,
    };
    expect(portalBlockCount(s)).toBe(MIN_INNER_WIDTH * MIN_INNER_HEIGHT);
  });

  it('block count on max frame', () => {
    const s = {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: MAX_INNER_HEIGHT - 1,
      minZ: 0,
      maxZ: MAX_INNER_WIDTH - 1,
      axis: 'z' as const,
    };
    expect(portalBlockCount(s)).toBe(MAX_INNER_WIDTH * MAX_INNER_HEIGHT);
  });

  it('size bounds', () => {
    expect(MIN_INNER_WIDTH).toBeLessThan(MAX_INNER_WIDTH);
    expect(MIN_INNER_HEIGHT).toBeLessThan(MAX_INNER_HEIGHT);
  });
});
