import { describe, it, expect } from 'vitest';
import { buildDrawList, armorRenderOrder } from './armor_layer_render';

describe('armor layer render', () => {
  it('empty layers → skin only', () => {
    const d = buildDrawList({ helmet: null, chestplate: null, leggings: null, boots: null }, [], {
      hasEnchantOnAny: false,
    });
    expect(d).toEqual([{ kind: 'skin' }]);
  });

  it('skin first', () => {
    const d = buildDrawList(
      { helmet: 'iron_helmet', chestplate: null, leggings: null, boots: null },
      [],
      { hasEnchantOnAny: false },
    );
    expect(d[0]).toEqual({ kind: 'skin' });
  });

  it('glint last when present', () => {
    const d = buildDrawList(
      { helmet: 'iron_helmet', chestplate: null, leggings: null, boots: null },
      [],
      { hasEnchantOnAny: true },
    );
    expect(d[d.length - 1]).toEqual({ kind: 'glint' });
  });

  it('trim after armor', () => {
    const d = buildDrawList(
      { helmet: null, chestplate: 'iron', leggings: null, boots: null },
      [{ slot: 'chestplate', pattern: 'dune', material: 'gold' }],
      { hasEnchantOnAny: false },
    );
    const armorIdx = d.findIndex((c) => c.kind === 'armor');
    const trimIdx = d.findIndex((c) => c.kind === 'trim');
    expect(trimIdx).toBeGreaterThan(armorIdx);
  });

  it('order: boots→leggings→chest→helmet', () => {
    expect(armorRenderOrder()).toEqual(['boots', 'leggings', 'chestplate', 'helmet']);
  });
});
