import { describe, it, expect } from 'vitest';
import {
  damageOnHit,
  anvilDamageChance,
  degradesAnvil,
  MAX_FALL_DAMAGE,
} from './falling_block_damage';

describe('falling block damage', () => {
  it('sand harmless', () => {
    expect(damageOnHit({ blockId: 'sand', fallDistance: 20 })).toBe(0);
  });

  it('anvil 3-block fall = 4 dmg', () => {
    expect(damageOnHit({ blockId: 'anvil', fallDistance: 3 })).toBe(4);
  });

  it('damage capped', () => {
    expect(damageOnHit({ blockId: 'anvil', fallDistance: 1000 })).toBe(MAX_FALL_DAMAGE);
  });

  it('chance grows with fall', () => {
    expect(anvilDamageChance({ blockId: 'anvil', fallDistance: 10 })).toBeGreaterThan(
      anvilDamageChance({ blockId: 'anvil', fallDistance: 1 }),
    );
  });

  it('degrade anvil', () => {
    expect(degradesAnvil({ blockId: 'anvil', fallDistance: 20 }, () => 0)).toBe('chipped_anvil');
    expect(degradesAnvil({ blockId: 'chipped_anvil', fallDistance: 20 }, () => 0)).toBe(
      'damaged_anvil',
    );
  });

  it('damaged anvil destroyed', () => {
    expect(degradesAnvil({ blockId: 'damaged_anvil', fallDistance: 20 }, () => 0)).toBeNull();
  });
});
