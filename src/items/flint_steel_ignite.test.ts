import { describe, it, expect } from 'vitest';
import { ignitesBlock, durabilityCost } from './flint_steel_ignite';

describe('flint and steel', () => {
  it('lights tnt', () => {
    expect(ignitesBlock({ block: 'tnt', adjacentToFlammable: false })).toBe('tnt_primed');
  });

  it('portal frame → nether portal', () => {
    expect(ignitesBlock({ block: 'obsidian_frame', adjacentToFlammable: false })).toBe(
      'nether_portal',
    );
  });

  it('flammable → fire', () => {
    expect(ignitesBlock({ block: 'oak_planks', adjacentToFlammable: true })).toBe('fire');
  });

  it('nonflammable → undefined', () => {
    expect(ignitesBlock({ block: 'stone', adjacentToFlammable: false })).toBeUndefined();
  });

  it('durability cost 1', () => {
    expect(durabilityCost()).toBe(1);
  });
});
