import { describe, it, expect } from 'vitest';
import { sneakSpeed, sneakSpeedFraction } from './swift_sneak';

describe('swift sneak', () => {
  it('no sneak = full speed', () => {
    expect(sneakSpeedFraction({ sneaking: false, swiftSneakLevel: 0 })).toBe(1);
  });

  it('sneak with no enchant = 30%', () => {
    expect(sneakSpeedFraction({ sneaking: true, swiftSneakLevel: 0 })).toBe(0.3);
  });

  it('level 1 = 45%', () => {
    expect(sneakSpeedFraction({ sneaking: true, swiftSneakLevel: 1 })).toBeCloseTo(0.45);
  });

  it('level 3 = 75%', () => {
    expect(sneakSpeedFraction({ sneaking: true, swiftSneakLevel: 3 })).toBeCloseTo(0.75);
  });

  it('applies to base speed', () => {
    expect(sneakSpeed(4, { sneaking: true, swiftSneakLevel: 2 })).toBeCloseTo(2.4);
  });
});
