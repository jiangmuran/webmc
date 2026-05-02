import { describe, it, expect } from 'vitest';
import { slotOf, dispense } from './dispenser_armor_equip';

describe('dispenser armor equip', () => {
  it('knows helmet slot', () => {
    expect(slotOf('iron_helmet')).toBe('helmet');
  });

  it('non-armor null', () => {
    expect(slotOf('stone')).toBeNull();
  });

  it('equips on empty slot', () => {
    expect(dispense({ facingPlayerId: 'p1', slotEmpty: true, itemId: 'iron_helmet' })).toEqual({
      kind: 'equipped',
    });
  });

  it('ejects if slot filled', () => {
    expect(dispense({ facingPlayerId: 'p1', slotEmpty: false, itemId: 'iron_helmet' })).toEqual({
      kind: 'ejected_item',
    });
  });

  it('ejects if no player', () => {
    expect(dispense({ facingPlayerId: null, slotEmpty: true, itemId: 'iron_helmet' })).toEqual({
      kind: 'ejected_item',
    });
  });

  it('ejects non-armor', () => {
    expect(dispense({ facingPlayerId: 'p1', slotEmpty: true, itemId: 'apple' })).toEqual({
      kind: 'ejected_item',
    });
  });

  it('equips mob heads + carved pumpkin in helmet slot (wiki)', () => {
    // Wiki (minecraft.wiki/w/Dispenser): "Mob heads, skulls, and
    // carved pumpkins / jack o'lanterns can be equipped in the
    // helmet slot by a dispenser."
    expect(slotOf('creeper_head')).toBe('helmet');
    expect(slotOf('skeleton_skull')).toBe('helmet');
    expect(slotOf('wither_skeleton_skull')).toBe('helmet');
    expect(slotOf('zombie_head')).toBe('helmet');
    expect(slotOf('player_head')).toBe('helmet');
    expect(slotOf('dragon_head')).toBe('helmet');
    expect(slotOf('piglin_head')).toBe('helmet');
    expect(slotOf('carved_pumpkin')).toBe('helmet');
    expect(slotOf('jack_o_lantern')).toBe('helmet');
  });
});
