import { describe, it, expect } from 'vitest';
import { replacesStone, oreVariantName, oresEmbeddable } from './tuff_carver_ore';

describe('tuff carver ore', () => {
  it('replaces stone', () => {
    expect(replacesStone('stone')).toBe(true);
  });

  it('does not replace grass', () => {
    expect(replacesStone('grass_block')).toBe(false);
  });

  it('name composition', () => {
    expect(oreVariantName('copper')).toBe('tuff_copper_ore');
  });

  it('filters valid ores', () => {
    expect(oresEmbeddable({ block: 'tuff', oreWithin: ['copper', 'diamond'] })).toEqual(['copper']);
  });
});
