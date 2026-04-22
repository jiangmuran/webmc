import { describe, it, expect } from 'vitest';
import { useShovel } from './shovel_path';

describe('shovel', () => {
  it('grass → dirt path', () => {
    const r = useShovel({
      targetBlockName: 'webmc:grass_block',
      airAbove: true,
      campfireLit: false,
    });
    expect(r.kind).toBe('place_path');
  });

  it('campfire → extinguish', () => {
    const r = useShovel({
      targetBlockName: 'webmc:campfire',
      airAbove: false,
      campfireLit: true,
    });
    expect(r.kind).toBe('extinguish_campfire');
  });

  it('rooted dirt → hanging roots drop', () => {
    const r = useShovel({
      targetBlockName: 'webmc:rooted_dirt',
      airAbove: true,
      campfireLit: false,
    });
    expect(r.kind).toBe('hanging_roots');
  });

  it('stone → none', () => {
    expect(
      useShovel({
        targetBlockName: 'webmc:stone',
        airAbove: true,
        campfireLit: false,
      }).kind,
    ).toBe('none');
  });
});
