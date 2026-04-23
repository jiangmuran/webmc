import { describe, it, expect } from 'vitest';
import { aoVertex, aoToBrightness } from './ao_corner_calc';

describe('ambient occlusion corner', () => {
  it('no occlusion full light', () => {
    expect(aoVertex({ side1Solid: false, side2Solid: false, cornerSolid: false })).toBe(3);
  });

  it('both sides occluded → dark 0', () => {
    expect(aoVertex({ side1Solid: true, side2Solid: true, cornerSolid: false })).toBe(0);
  });

  it('one side only', () => {
    expect(aoVertex({ side1Solid: true, side2Solid: false, cornerSolid: false })).toBe(2);
  });

  it('corner adds darkness', () => {
    const noCorner = aoVertex({ side1Solid: true, side2Solid: false, cornerSolid: false });
    const withCorner = aoVertex({ side1Solid: true, side2Solid: false, cornerSolid: true });
    expect(withCorner).toBeLessThan(noCorner);
  });

  it('brightness scales', () => {
    expect(aoToBrightness(3)).toBeGreaterThan(aoToBrightness(0));
  });

  it('level 0 dim not black', () => {
    expect(aoToBrightness(0)).toBeGreaterThan(0);
  });
});
