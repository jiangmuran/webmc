import { describe, it, expect } from 'vitest';
import {
  boneMealClump,
  largeFungusFootprint,
  BONE_MEAL_CLUMP_RADIUS,
} from './nether_sprout_clumps';

describe('nether sprouts', () => {
  it('produces sprouts', () => {
    const r = boneMealClump({ surfaceKind: 'crimson', rand: () => 0 });
    expect(r.every((s) => s.kind === 'crimson')).toBe(true);
    expect(r.length).toBeGreaterThanOrEqual(4);
  });

  it('variants vary', () => {
    const r = boneMealClump({ surfaceKind: 'warped', rand: () => 0.95 });
    expect(r[0]?.variant).toBe('vines');
  });

  it('warped fungus larger', () => {
    expect(largeFungusFootprint('warped').height).toBeGreaterThan(
      largeFungusFootprint('crimson').height,
    );
  });

  it('clump radius set', () => {
    expect(BONE_MEAL_CLUMP_RADIUS).toBeGreaterThan(0);
  });
});
