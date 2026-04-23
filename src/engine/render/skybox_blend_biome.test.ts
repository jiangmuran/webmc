import { describe, it, expect } from 'vitest';
import { blendSky } from './skybox_blend_biome';

describe('skybox blend biome', () => {
  it('t=0 is a', () => {
    expect(blendSky('blue', 'orange_desert', 0)[0]).toBeCloseTo(0.47);
  });

  it('t=1 is b', () => {
    expect(blendSky('blue', 'orange_desert', 1)[0]).toBeCloseTo(0.85);
  });

  it('mid blends', () => {
    const c = blendSky('blue', 'red_nether', 0.5);
    expect(c[0]).toBeGreaterThan(0);
    expect(c[0]).toBeLessThan(1);
  });
});
