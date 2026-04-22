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
});
