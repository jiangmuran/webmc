import { describe, it, expect } from 'vitest';
import { canPlaceAzaleaOn, convertsToMossBelow, flowerDrop, growAzaleaTree } from './azalea';

describe('azalea', () => {
  it('grows tall with moss base', () => {
    const t = growAzaleaTree({ kind: 'azalea', rng: () => 0.5 });
    expect(t.height).toBeGreaterThanOrEqual(6);
    expect(t.mossBlockAtBase).toBe(true);
    expect(t.flowering).toBe(false);
  });

  it('flowering variant is tagged', () => {
    const t = growAzaleaTree({ kind: 'flowering_azalea', rng: () => 0 });
    expect(t.flowering).toBe(true);
  });

  it('flower drops seldom', () => {
    expect(flowerDrop(0.5).length).toBe(0);
    expect(flowerDrop(0.001).length).toBe(1);
  });

  it('fortune raises drop chance', () => {
    const base = flowerDrop(0.025, 0).length;
    const fortune3 = flowerDrop(0.025, 3).length;
    expect(fortune3).toBeGreaterThanOrEqual(base);
  });

  it('dirt converts to moss', () => {
    expect(convertsToMossBelow('webmc:dirt')).toBe('webmc:moss_block');
  });

  it('coarse dirt → rooted dirt', () => {
    expect(convertsToMossBelow('webmc:coarse_dirt')).toBe('webmc:rooted_dirt');
  });

  it('stone does not convert', () => {
    expect(convertsToMossBelow('webmc:stone')).toBeNull();
  });

  it('can place on moss/dirt/mud', () => {
    expect(canPlaceAzaleaOn('webmc:moss_block')).toBe(true);
    expect(canPlaceAzaleaOn('webmc:mud')).toBe(true);
    expect(canPlaceAzaleaOn('webmc:stone')).toBe(false);
  });
});
