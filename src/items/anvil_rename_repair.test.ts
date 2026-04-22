import { describe, it, expect } from 'vitest';
import { anvil, type AnvilItem, TOO_EXPENSIVE_THRESHOLD } from './anvil_rename_repair';

function tool(damage = 100): AnvilItem {
  return {
    id: 'webmc:iron_pickaxe',
    damage,
    maxDurability: 250,
    name: null,
    enchantments: [],
    priorWorkCost: 0,
  };
}

describe('anvil', () => {
  it('rename costs 1', () => {
    const r = anvil({
      left: tool(),
      right: { kind: 'rename_only', newName: 'Foo' },
      playerLevel: 10,
      inCreative: false,
    });
    expect(r.xpCost).toBe(1);
    expect(r.outputItem?.name).toBe('Foo');
  });

  it('same name no-op', () => {
    const t = tool();
    t.name = 'Foo';
    const r = anvil({
      left: t,
      right: { kind: 'rename_only', newName: 'Foo' },
      playerLevel: 10,
      inCreative: false,
    });
    expect(r.outputItem).toBeNull();
  });

  it('repair decreases damage', () => {
    const r = anvil({
      left: tool(100),
      right: tool(50),
      playerLevel: 10,
      inCreative: false,
    });
    expect(r.outputItem?.damage).toBeLessThan(100);
  });

  it('too expensive threshold', () => {
    const t = tool();
    t.priorWorkCost = TOO_EXPENSIVE_THRESHOLD;
    const r = anvil({
      left: t,
      right: { kind: 'rename_only', newName: 'X' },
      playerLevel: 100,
      inCreative: false,
    });
    expect(r.tooExpensive).toBe(true);
  });

  it('not enough levels', () => {
    const r = anvil({
      left: tool(),
      right: { kind: 'rename_only', newName: 'Y' },
      playerLevel: 0,
      inCreative: false,
    });
    expect(r.outputItem).toBeNull();
  });

  it('creative bypasses cost', () => {
    const t = tool();
    t.priorWorkCost = TOO_EXPENSIVE_THRESHOLD;
    const r = anvil({
      left: t,
      right: { kind: 'rename_only', newName: 'Y' },
      playerLevel: 0,
      inCreative: true,
    });
    expect(r.outputItem?.name).toBe('Y');
  });
});
