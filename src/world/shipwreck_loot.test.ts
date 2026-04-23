import { describe, it, expect } from 'vitest';
import { hasChestsGiven, orientationForGround } from './shipwreck_loot';

describe('shipwreck loot', () => {
  it('all chests present on low roll', () => {
    const r = hasChestsGiven(() => 0);
    expect(r.supply).toBe(true);
    expect(r.map).toBe(true);
    expect(r.treasure).toBe(true);
  });

  it('all chests absent on high roll', () => {
    const r = hasChestsGiven(() => 0.95);
    expect(r.supply).toBe(false);
    expect(r.map).toBe(false);
    expect(r.treasure).toBe(false);
  });

  it('coast = upright', () => {
    expect(orientationForGround(false, true)).toBe('upright');
  });

  it('buried in sand offshore', () => {
    expect(orientationForGround(true, false)).toBe('buried');
  });

  it('default sideways', () => {
    expect(orientationForGround(false, false)).toBe('sideways');
  });
});
