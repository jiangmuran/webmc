import { describe, it, expect } from 'vitest';
import { applyTotem, TOTEM_ADVANCEMENT_ID } from './totem_death_save';

describe('totem of undying', () => {
  it('survives with totem in mainhand', () => {
    const r = applyTotem({
      heldMainhand: 'webmc:totem_of_undying',
      heldOffhand: 'webmc:air',
      damageAboutToTake: 100,
      currentHealth: 5,
    });
    expect(r.triggered).toBe(true);
    expect(r.consumedSlot).toBe('mainhand');
    expect(r.setHealthTo).toBe(1);
  });

  it('survives with totem in offhand', () => {
    const r = applyTotem({
      heldMainhand: 'webmc:air',
      heldOffhand: 'webmc:totem_of_undying',
      damageAboutToTake: 100,
      currentHealth: 5,
    });
    expect(r.consumedSlot).toBe('offhand');
  });

  it('non-lethal damage does not consume totem', () => {
    const r = applyTotem({
      heldMainhand: 'webmc:totem_of_undying',
      heldOffhand: 'webmc:air',
      damageAboutToTake: 2,
      currentHealth: 20,
    });
    expect(r.triggered).toBe(false);
  });

  it('no totem = regular death', () => {
    const r = applyTotem({
      heldMainhand: 'webmc:air',
      heldOffhand: 'webmc:air',
      damageAboutToTake: 100,
      currentHealth: 5,
    });
    expect(r.triggered).toBe(false);
    expect(r.setHealthTo).toBe(0);
  });

  it('applies regen II 45s, fire I 40s, abs II 5s (wiki)', () => {
    const r = applyTotem({
      heldMainhand: 'webmc:totem_of_undying',
      heldOffhand: 'webmc:air',
      damageAboutToTake: 100,
      currentHealth: 5,
    });
    const regen = r.appliedEffects.find((e) => e.id === 'regeneration');
    const fire = r.appliedEffects.find((e) => e.id === 'fire_resistance');
    const abs = r.appliedEffects.find((e) => e.id === 'absorption');
    expect(regen?.durationSec).toBe(45);
    expect(fire?.durationSec).toBe(40);
    expect(abs?.durationSec).toBe(5);
  });

  it('advancement id exported', () => {
    expect(TOTEM_ADVANCEMENT_ID).toBe('adventure/totem_of_undying');
  });
});
