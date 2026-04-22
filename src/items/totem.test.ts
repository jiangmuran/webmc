import { describe, it, expect } from 'vitest';
import { tryTotem } from './totem';

describe('totem of undying', () => {
  it('main-hand totem activates on fatal damage', () => {
    const holder = {
      mainHand: { name: 'webmc:totem_of_undying' },
      offHand: null,
    };
    const r = tryTotem(holder);
    expect(r.activated).toBe(true);
    expect(r.consumedHand).toBe('main');
    expect(holder.mainHand).toBeNull();
  });

  it('off-hand totem also counts', () => {
    const holder = {
      mainHand: { name: 'webmc:apple' },
      offHand: { name: 'webmc:totem_of_undying' },
    };
    const r = tryTotem(holder);
    expect(r.activated).toBe(true);
    expect(r.consumedHand).toBe('off');
    expect(holder.offHand).toBeNull();
  });

  it('no activation without a totem', () => {
    const holder = { mainHand: null, offHand: null };
    const r = tryTotem(holder);
    expect(r.activated).toBe(false);
  });

  it('grants regen + fire resist + absorption', () => {
    const holder = {
      mainHand: { name: 'webmc:totem_of_undying' },
      offHand: null,
    };
    const r = tryTotem(holder);
    const ids = r.appliedEffects.map((e) => e.id);
    expect(ids).toContain('regeneration');
    expect(ids).toContain('fire_resistance');
    expect(ids).toContain('absorption');
  });
});
