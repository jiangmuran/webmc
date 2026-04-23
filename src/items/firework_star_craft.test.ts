import { describe, it, expect } from 'vitest';
import { shapeFromModifier, canCraft, modifierEffect } from './firework_star_craft';

describe('firework star craft', () => {
  it('default small ball', () => {
    expect(shapeFromModifier(null)).toBe('small_ball');
  });

  it('fire charge = large ball', () => {
    expect(shapeFromModifier('fire_charge')).toBe('large_ball');
  });

  it('head = creeper', () => {
    expect(shapeFromModifier('head')).toBe('creeper');
  });

  it('can craft minimal', () => {
    expect(canCraft({ gunpowder: 1, dye: 1, modifier: null, trail: false, twinkle: false })).toBe(
      true,
    );
  });

  it('no craft missing', () => {
    expect(canCraft({ gunpowder: 0, dye: 1, modifier: null, trail: false, twinkle: false })).toBe(
      false,
    );
  });

  it('modifier effect passthrough', () => {
    const r = modifierEffect({ gunpowder: 1, dye: 1, modifier: null, trail: true, twinkle: false });
    expect(r.trail).toBe(true);
  });
});
