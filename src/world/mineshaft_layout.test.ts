import { describe, it, expect } from 'vitest';
import {
  defaultCorridor,
  rollChestCart,
  cobwebDensity,
  railKind,
  CHEST_CART_CHANCE,
} from './mineshaft_layout';

describe('mineshaft layout', () => {
  it('default has rails + cobweb', () => {
    const c = defaultCorridor();
    expect(c.hasRails).toBe(true);
    expect(c.hasCobweb).toBe(true);
  });

  it('chest cart rare', () => {
    expect(rollChestCart(() => 0)).toBe(true);
    expect(rollChestCart(() => 0.99)).toBe(false);
    expect(CHEST_CART_CHANCE).toBeLessThan(0.5);
  });

  it('cobweb count ≤ length', () => {
    const n = cobwebDensity(100, Math.random);
    expect(n).toBeLessThanOrEqual(100);
  });

  it('rail kind toggles', () => {
    expect(railKind(true)).toBe('powered_rail');
    expect(railKind(false)).toBe('rail');
  });
});
