import { describe, it, expect } from 'vitest';
import { shouldMelt, meltsTo, silkTouchPreservesIce } from './ice_melt';

describe('ice melt', () => {
  it('melts in bright light', () => {
    expect(shouldMelt({ lightLevel: 14, hasSolidAbove: false, isPackedOrBlueIce: false })).toBe(
      true,
    );
  });

  it('protected by cover', () => {
    expect(shouldMelt({ lightLevel: 15, hasSolidAbove: true, isPackedOrBlueIce: false })).toBe(
      false,
    );
  });

  it('packed ice no melt', () => {
    expect(shouldMelt({ lightLevel: 15, hasSolidAbove: false, isPackedOrBlueIce: true })).toBe(
      false,
    );
  });

  it('melts to water', () => {
    expect(meltsTo()).toBe('water');
  });

  it('silk preserves', () => {
    expect(silkTouchPreservesIce()).toBe(true);
  });
});
