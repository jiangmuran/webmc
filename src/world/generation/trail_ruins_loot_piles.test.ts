import { describe, it, expect } from 'vitest';
import { brush, trailRuinsLootItems, type SuspiciousSurface } from './trail_ruins_loot_piles';

describe('trail ruins loot piles', () => {
  it('brush drops sherd', () => {
    const s: SuspiciousSurface = { hasSherd: true, hasItem: false, sherd: 'angler_sherd' };
    expect(brush(s, () => 0.5).dropped).toBe('angler_sherd');
  });

  it('brush drops item preferred', () => {
    const s: SuspiciousSurface = {
      hasSherd: true,
      hasItem: true,
      item: 'emerald',
      sherd: 'angler_sherd',
    };
    expect(brush(s, () => 0.5).dropped).toBe('emerald');
  });

  it('empty brush rarely yields', () => {
    const s: SuspiciousSurface = { hasSherd: false, hasItem: false };
    expect(brush(s, () => 0.001).dropped).toBe('emerald');
  });

  it('unlucky empty nothing', () => {
    const s: SuspiciousSurface = { hasSherd: false, hasItem: false };
    expect(brush(s, () => 0.9).dropped).toBeUndefined();
  });

  it('loot items include sherds', () => {
    expect(trailRuinsLootItems().some((i) => i.includes('_sherd'))).toBe(true);
  });
});
