import { describe, it, expect } from 'vitest';
import { craftYield, effectDurationFromLingering, amplifierInherited } from './tipped_arrow_craft';

describe('tipped arrow craft', () => {
  it('yields 8 arrows', () => {
    expect(craftYield(8, true)).toBe(8);
  });

  it('needs 8 arrows', () => {
    expect(craftYield(7, true)).toBe(0);
  });

  it('needs lingering', () => {
    expect(craftYield(8, false)).toBe(0);
  });

  it('duration = lingering/8', () => {
    expect(effectDurationFromLingering(800)).toBe(100);
  });

  it('amplifier inherited', () => {
    expect(amplifierInherited(2)).toBe(2);
  });
});
