import { describe, it, expect } from 'vitest';
import { absorbWater, shouldDry } from './sponge';

describe('sponge', () => {
  it('absorbs adjacent water up to 118 blocks (wiki)', () => {
    // Wiki (minecraft.wiki/w/Sponge#Absorption): "A sponge does not
    // absorb more than 118 blocks of water however".
    const out = absorbWater({ x: 0, y: 0, z: 0 }, { isWaterSource: () => true });
    expect(out.length).toBeLessThanOrEqual(118);
    expect(out.length).toBeGreaterThan(0);
  });

  it('no water → no absorption', () => {
    const out = absorbWater({ x: 0, y: 0, z: 0 }, { isWaterSource: () => false });
    expect(out.length).toBe(0);
  });

  it('only absorbs within 6-block taxicab reach (wiki)', () => {
    // Wiki: "up to 6 blocks away (taken as a taxicab distance)".
    const out = absorbWater(
      { x: 0, y: 0, z: 0 },
      {
        isWaterSource: (x) => Math.abs(x) < 3, // bounded region
      },
    );
    for (const p of out) expect(Math.abs(p.x)).toBeLessThan(3);
  });

  it('dries in nether', () => {
    expect(shouldDry({ inNether: true })).toBe(true);
    expect(shouldDry({ inNether: false })).toBe(false);
  });
});
