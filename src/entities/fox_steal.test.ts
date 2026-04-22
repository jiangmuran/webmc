import { describe, it, expect } from 'vitest';
import { foxIsTrusted, makeFox, setSleeping, trustPlayer, tryFoxSteal } from './fox_steal';

describe('fox steal', () => {
  it('fox picks up sweet berries', () => {
    const f = makeFox();
    const r = tryFoxSteal(f, {
      item: { itemId: 1, count: 3, damage: 0 },
      itemName: 'webmc:sweet_berries',
    });
    expect(r.stolen).toBe(true);
    expect(f.heldStack?.count).toBe(3);
  });

  it('refuses non-stealable items', () => {
    const f = makeFox();
    const r = tryFoxSteal(f, {
      item: { itemId: 1, count: 1, damage: 0 },
      itemName: 'webmc:stone',
    });
    expect(r.stolen).toBe(false);
  });

  it('sleeping fox does not steal', () => {
    const f = makeFox();
    setSleeping(f, true);
    const r = tryFoxSteal(f, {
      item: { itemId: 1, count: 1, damage: 0 },
      itemName: 'webmc:apple',
    });
    expect(r.stolen).toBe(false);
  });

  it('refuses second steal while carrying', () => {
    const f = makeFox();
    f.heldStack = { itemId: 1, count: 1, damage: 0 };
    const r = tryFoxSteal(f, {
      item: { itemId: 2, count: 1, damage: 0 },
      itemName: 'webmc:apple',
    });
    expect(r.stolen).toBe(false);
  });

  it('trustPlayer records + checks', () => {
    const f = makeFox();
    trustPlayer(f, 7);
    expect(foxIsTrusted(f, 7)).toBe(true);
    expect(foxIsTrusted(f, 99)).toBe(false);
  });
});
