import { describe, it, expect } from 'vitest';
import { createDefaultRegistry } from './registry';

// Regression: a bunch of blocks that should pass light were defaulting
// to opaque:true (the SimpleBlock default). The user's symptom: glass
// roofs blocked all skylight, water/lava lakes were pitch black, leaves
// canopy made forest floor night-dark, and torches in walls darkened
// the surrounding cells.
describe('default registry — non-opaque blocks let light pass', () => {
  const r = createDefaultRegistry();
  const shouldBeNonOpaque = [
    'webmc:glass',
    'webmc:water',
    'webmc:lava',
    'webmc:torch',
    'webmc:oak_leaves',
    'webmc:cherry_leaves',
    'webmc:azalea_leaves',
    'webmc:spruce_leaves',
    'webmc:birch_leaves',
    'webmc:jungle_leaves',
    'webmc:acacia_leaves',
    'webmc:dark_oak_leaves',
    'webmc:mangrove_leaves',
    'webmc:pale_oak_leaves',
    'webmc:white_stained_glass',
    'webmc:end_rod',
    'webmc:ladder',
    'webmc:oak_fence',
  ];

  for (const name of shouldBeNonOpaque) {
    it(`${name} is non-opaque`, () => {
      const id = r.byName(name);
      expect(id, `missing ${name}`).toBeDefined();
      if (id === undefined) return;
      expect(r.get(id).opaque, `${name} should be opaque:false`).toBe(false);
    });
  }
});
