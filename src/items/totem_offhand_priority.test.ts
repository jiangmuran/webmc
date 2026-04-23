import { describe, it, expect } from 'vitest';
import {
  totemSlot,
  triggersOnLethalDamage,
  consumedAfterUse,
  TOTEM,
} from './totem_offhand_priority';

describe('totem offhand priority', () => {
  it('offhand preferred', () => {
    expect(totemSlot({ mainhand: TOTEM, offhand: TOTEM })).toBe('offhand');
  });

  it('mainhand only', () => {
    expect(totemSlot({ mainhand: TOTEM })).toBe('mainhand');
  });

  it('no totem → undefined', () => {
    expect(totemSlot({ mainhand: 'stick' })).toBeUndefined();
  });

  it('triggers on lethal', () => {
    expect(triggersOnLethalDamage({ offhand: TOTEM })).toBe(true);
    expect(triggersOnLethalDamage({})).toBe(false);
  });

  it('consumed', () => {
    expect(consumedAfterUse()).toBe(true);
  });
});
