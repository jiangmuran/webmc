import { describe, it, expect } from 'vitest';
import {
  makeStorage,
  inventoryFor,
  onBroken,
  craftEnderChest,
  ENDER_SIZE,
} from './ender_chest_global';

describe('ender chest', () => {
  it('creates inventory on demand', () => {
    const s = makeStorage();
    const inv = inventoryFor(s, 'Steve');
    expect(inv.length).toBe(ENDER_SIZE);
  });

  it('shared across instances per player', () => {
    const s = makeStorage();
    const a = inventoryFor(s, 'Steve');
    const b = inventoryFor(s, 'Steve');
    expect(a).toBe(b);
  });

  it('silk touch drops block', () => {
    expect(onBroken({ withSilkTouch: true, withFortuneLevel: 0 }).drops[0]?.id).toBe(
      'webmc:ender_chest',
    );
  });

  it('normal drops obsidian', () => {
    expect(onBroken({ withSilkTouch: false, withFortuneLevel: 0 }).drops[0]?.id).toBe(
      'webmc:obsidian',
    );
  });

  it('craft requires obsidian + eye', () => {
    expect(craftEnderChest(8, 1)).toBe(true);
    expect(craftEnderChest(7, 1)).toBe(false);
    expect(craftEnderChest(8, 0)).toBe(false);
  });
});
