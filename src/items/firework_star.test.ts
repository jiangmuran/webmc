import { describe, it, expect } from 'vitest';
import { composeDetonation, makeFireworkStar } from './firework_star';

describe('firework star', () => {
  it('default shape + single dye', () => {
    const s = makeFireworkStar({
      shape: 'small',
      dyeRgbs: [[255, 0, 0]],
      glowstoneDust: false,
      diamond: false,
    });
    expect(s.shape).toBe('small');
    expect(s.colors).toHaveLength(1);
    expect(s.trail).toBe(false);
    expect(s.twinkle).toBe(false);
  });

  it('diamond adds trail', () => {
    const s = makeFireworkStar({
      shape: 'large',
      dyeRgbs: [[255, 255, 255]],
      glowstoneDust: false,
      diamond: true,
    });
    expect(s.trail).toBe(true);
  });

  it('glowstone dust adds twinkle', () => {
    const s = makeFireworkStar({
      shape: 'star',
      dyeRgbs: [[0, 255, 0]],
      glowstoneDust: true,
      diamond: false,
    });
    expect(s.twinkle).toBe(true);
  });

  it('composeDetonation bundles stars', () => {
    const a = makeFireworkStar({
      shape: 'creeper',
      dyeRgbs: [[0, 255, 0]],
      glowstoneDust: false,
      diamond: false,
    });
    const b = makeFireworkStar({
      shape: 'burst',
      dyeRgbs: [[0, 0, 255]],
      glowstoneDust: true,
      diamond: true,
    });
    const spec = composeDetonation([a, b]);
    expect(spec.stars).toHaveLength(2);
  });

  it('empty dyes defaults to white', () => {
    const s = makeFireworkStar({
      shape: 'burst',
      dyeRgbs: [],
      glowstoneDust: false,
      diamond: false,
    });
    expect(s.colors[0]).toEqual([255, 255, 255]);
  });
});
