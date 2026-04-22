import { describe, it, expect } from 'vitest';
import { drops, onBonemeal, hoeConverts } from './rooted_dirt';

describe('rooted dirt', () => {
  it('drops self', () => {
    expect(drops('shovel')).toContain('rooted_dirt');
  });

  it('bonemeal below places hanging roots', () => {
    expect(onBonemeal({ faceClickedDown: true, blockBelowIsAir: true })).toEqual({
      kind: 'place_hanging_roots',
    });
  });

  it('bonemeal elsewhere no-op', () => {
    expect(onBonemeal({ faceClickedDown: false, blockBelowIsAir: true })).toEqual({ kind: 'none' });
  });

  it('bonemeal no space no-op', () => {
    expect(onBonemeal({ faceClickedDown: true, blockBelowIsAir: false })).toEqual({ kind: 'none' });
  });

  it('hoe to dirt', () => {
    expect(hoeConverts()).toBe('dirt');
  });
});
