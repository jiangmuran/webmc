import { describe, it, expect } from 'vitest';
import { createDefaultRegistry } from './registry';

describe('default registry — 1.21 trial chamber + tuff family', () => {
  const r = createDefaultRegistry();
  const newBlocks = [
    'webmc:breeze_rod',
    'webmc:ominous_trial_spawner',
    'webmc:ominous_vault',
    'webmc:chiseled_copper',
    'webmc:waxed_chiseled_copper',
    'webmc:exposed_copper_door',
    'webmc:weathered_copper_door',
    'webmc:oxidized_copper_door',
    'webmc:tuff_wall',
    'webmc:tuff_brick_wall',
    'webmc:polished_tuff_wall',
    'webmc:tuff_brick_slab',
    'webmc:tuff_brick_stairs',
    'webmc:polished_tuff_stairs',
    'webmc:cobbled_deepslate_wall',
  ];

  it('every trial-chamber block resolves by name', () => {
    for (const n of newBlocks) {
      expect(r.byName(n), `missing ${n}`).toBeDefined();
    }
  });

  it('ominous_trial_spawner is unbreakable-ish (hardness ≥ 50)', () => {
    const id = r.byName('webmc:ominous_trial_spawner');
    expect(id).toBeDefined();
    if (id === undefined) return;
    expect(r.get(id).hardness).toBeGreaterThanOrEqual(50);
  });

  it('copper doors are non-opaque', () => {
    for (const n of [
      'webmc:exposed_copper_door',
      'webmc:weathered_copper_door',
      'webmc:oxidized_copper_door',
    ]) {
      const id = r.byName(n);
      expect(id, `missing ${n}`).toBeDefined();
      if (id === undefined) continue;
      expect(r.get(id).opaque).toBe(false);
    }
  });
});
