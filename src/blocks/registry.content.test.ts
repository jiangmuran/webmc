import { describe, it, expect } from 'vitest';
import { createDefaultRegistry } from './registry';

describe('default registry — M18 content breadth', () => {
  const r = createDefaultRegistry();

  const newBlocks = [
    'webmc:wool_green',
    'webmc:wool_orange',
    'webmc:wool_black',
    'webmc:copper_block',
    'webmc:copper_ore',
    'webmc:amethyst_block',
    'webmc:budding_amethyst',
    'webmc:amethyst_cluster',
    'webmc:sculk',
    'webmc:sculk_sensor',
    'webmc:reinforced_deepslate',
    'webmc:calcite',
    'webmc:tuff',
    'webmc:mud',
    'webmc:mangrove_log',
    'webmc:cherry_log',
    'webmc:cherry_leaves',
    'webmc:bamboo',
    'webmc:ice',
    'webmc:snow_block',
    'webmc:packed_ice',
    'webmc:purpur_pillar',
  ];

  it('every new block resolves by name', () => {
    for (const n of newBlocks) {
      expect(r.byName(n), `missing ${n}`).toBeDefined();
    }
  });

  it('amethyst cluster is non-solid and light-emitting', () => {
    const id = r.byName('webmc:amethyst_cluster');
    expect(id).toBeDefined();
    if (id === undefined) return;
    const def = r.get(id);
    expect(def.solid).toBe(false);
    expect(def.lightEmission).toBeGreaterThan(0);
  });

  it('reinforced_deepslate has > 50 hardness (basically unbreakable)', () => {
    const id = r.byName('webmc:reinforced_deepslate');
    expect(id).toBeDefined();
    if (id === undefined) return;
    expect(r.get(id).hardness).toBeGreaterThan(50);
  });
});
