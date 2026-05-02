import { describe, it, expect } from 'vitest';
import { canPickUp, onDeath, mayPlace } from './enderman_held_block';

describe('enderman held block', () => {
  it('grass pickup', () => {
    expect(canPickUp('grass_block')).toBe(true);
  });

  it('stone blocked', () => {
    expect(canPickUp('stone')).toBe(false);
  });

  it('wiki holdables: mud, moss, fungi, nyliums, carved pumpkin', () => {
    // 1.19+ additions
    expect(canPickUp('mud')).toBe(true);
    expect(canPickUp('muddy_mangrove_roots')).toBe(true);
    expect(canPickUp('moss_block')).toBe(true);
    // 1.21.5 pale moss + cactus_flower
    expect(canPickUp('pale_moss_block')).toBe(true);
    expect(canPickUp('cactus_flower')).toBe(true);
    // Nether update
    expect(canPickUp('crimson_nylium')).toBe(true);
    expect(canPickUp('warped_nylium')).toBe(true);
    expect(canPickUp('crimson_fungus')).toBe(true);
    expect(canPickUp('warped_fungus')).toBe(true);
    expect(canPickUp('crimson_roots')).toBe(true);
    expect(canPickUp('warped_roots')).toBe(true);
    // Carved pumpkin (long-canonical companion to plain pumpkin)
    expect(canPickUp('carved_pumpkin')).toBe(true);
  });

  it('drops on death', () => {
    expect(onDeath('sand')).toBe('sand');
    expect(onDeath(null)).toBeNull();
  });

  it('place only with held + air', () => {
    expect(mayPlace('sand', true)).toBe(true);
    expect(mayPlace(null, true)).toBe(false);
    expect(mayPlace('sand', false)).toBe(false);
  });
});
