import { describe, it, expect } from 'vitest';
import { totemSaves, grantsEffects } from './totem_undying_revive';

describe('totem undying revive', () => {
  it('no totem no save', () => {
    expect(
      totemSaves({
        currentHealth: 5,
        incomingDamage: 10,
      }).consumedHand,
    ).toBe(null);
  });

  it('offhand preferred', () => {
    expect(
      totemSaves({
        heldMainHand: 'totem_of_undying',
        heldOffhand: 'totem_of_undying',
        currentHealth: 1,
        incomingDamage: 10,
      }).consumedHand,
    ).toBe('off');
  });

  it('mainhand used if offhand empty', () => {
    expect(
      totemSaves({
        heldMainHand: 'totem_of_undying',
        currentHealth: 1,
        incomingDamage: 10,
      }).consumedHand,
    ).toBe('main');
  });

  it('no save when survivable', () => {
    expect(
      totemSaves({
        heldOffhand: 'totem_of_undying',
        currentHealth: 20,
        incomingDamage: 5,
      }).consumedHand,
    ).toBe(null);
  });

  it('effects match wiki: regen II 45s, fire resist 40s, abs II 5s', () => {
    const e = grantsEffects();
    expect(e.reviveHealth).toBe(1);
    expect(e.regen).toBe(900); // 45s = 900 ticks
    expect(e.fireResistance).toBe(800); // 40s = 800 ticks
    expect(e.absorption).toBe(100); // 5s = 100 ticks
  });
});
