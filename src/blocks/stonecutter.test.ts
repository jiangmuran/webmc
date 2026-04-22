import { describe, it, expect } from 'vitest';
import { STONECUTTER_RECIPES, cut, outputsFor } from './stonecutter';

describe('stonecutter', () => {
  it('lists 20+ recipes', () => {
    expect(STONECUTTER_RECIPES.length).toBeGreaterThanOrEqual(20);
  });

  it('outputsFor returns all variants of a stone', () => {
    const outs = outputsFor('webmc:stone');
    expect(outs.length).toBeGreaterThanOrEqual(3);
    expect(outs.some((r) => r.output === 'webmc:stone_slab' && r.count === 2)).toBe(true);
  });

  it('cut returns the matching recipe', () => {
    const r = cut('webmc:cobblestone', 'webmc:cobblestone_slab');
    expect(r?.count).toBe(2);
  });

  it('unknown input + output returns null', () => {
    expect(cut('webmc:dirt', 'webmc:dirt_slab')).toBeNull();
  });
});
