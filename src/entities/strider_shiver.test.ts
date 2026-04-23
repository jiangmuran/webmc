import { describe, it, expect } from 'vitest';
import { isShivering, moveSpeed, offersSafetyToPiglins } from './strider_shiver';

describe('strider shiver', () => {
  it('shivers out of lava', () => {
    expect(isShivering({ inLava: false, hasWarpedFungusOnStick: false })).toBe(true);
  });

  it('not shivering in lava', () => {
    expect(isShivering({ inLava: true, hasWarpedFungusOnStick: false })).toBe(false);
  });

  it('lava faster than land', () => {
    const lava = moveSpeed({ inLava: true, hasWarpedFungusOnStick: false });
    const land = moveSpeed({ inLava: false, hasWarpedFungusOnStick: false });
    expect(lava).toBeGreaterThan(land);
  });

  it('fungus stick speed boost', () => {
    const boost = moveSpeed({ inLava: true, hasWarpedFungusOnStick: true });
    const plain = moveSpeed({ inLava: true, hasWarpedFungusOnStick: false });
    expect(boost).toBeGreaterThan(plain);
  });

  it('shivering strider not safe for piglins', () => {
    expect(offersSafetyToPiglins({ inLava: false, hasWarpedFungusOnStick: false })).toBe(false);
  });
});
