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

  it('grants regen II 45s, fire I 40s, abs II 5s (wiki)', () => {
    const holder = {
      mainHand: { name: 'webmc:totem_of_undying' },
      offHand: null,
    };
    const r = tryTotem(holder);
    const regen = r.appliedEffects.find((e) => e.id === 'regeneration');
    const fire = r.appliedEffects.find((e) => e.id === 'fire_resistance');
    const abs = r.appliedEffects.find((e) => e.id === 'absorption');
    expect(regen?.durationSec).toBe(45);
    expect(fire?.durationSec).toBe(40);
    expect(abs?.durationSec).toBe(5);
  });
});
