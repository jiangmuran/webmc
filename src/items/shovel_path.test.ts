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

  it('rooted dirt → hanging roots drop + convert to dirt (wiki)', () => {
    // Wiki (minecraft.wiki/w/Shovel): "Using a shovel on rooted dirt
    // converts it to dirt and drops 1 hanging roots." Old action
    // omitted the destination block, so callers could not know to
    // replace the rooted_dirt — the block stayed and re-shoveling
    // gave infinite hanging_roots.
    const r = useShovel({
      targetBlockName: 'webmc:rooted_dirt',
      airAbove: true,
      campfireLit: false,
    });
    expect(r.kind).toBe('hanging_roots');
    if (r.kind === 'hanging_roots') {
      expect(r.newBlock).toBe('webmc:dirt');
      expect(r.drops).toEqual(['webmc:hanging_roots']);
    }
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
