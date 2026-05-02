import { describe, it, expect } from 'vitest';
import { tryTotem } from './totem_self_save';

describe('totem', () => {
  it('non-lethal passes through', () => {
    const r = tryTotem({
      mainhand: null,
      offhand: null,
      incomingDamage: 3,
      currentHp: 10,
    });
    expect(r.saved).toBe(false);
    expect(r.newHp).toBe(7);
  });

  it('saves with totem in main', () => {
    const r = tryTotem({
      mainhand: 'webmc:totem_of_undying',
      offhand: null,
      incomingDamage: 100,
      currentHp: 5,
    });
    expect(r.saved).toBe(true);
    expect(r.consumedFromMain).toBe(true);
    expect(r.newHp).toBe(1);
  });

  it('saves with totem in off', () => {
    const r = tryTotem({
      mainhand: 'webmc:sword',
      offhand: 'webmc:totem_of_undying',
      incomingDamage: 100,
      currentHp: 5,
    });
    expect(r.saved).toBe(true);
    expect(r.consumedFromMain).toBe(false);
  });

  it('no totem = death', () => {
    const r = tryTotem({
      mainhand: null,
      offhand: null,
      incomingDamage: 100,
      currentHp: 5,
    });
    expect(r.saved).toBe(false);
    expect(r.newHp).toBe(0);
  });

  it('off-hand consumed first when both hold totems (wiki)', () => {
    const r = tryTotem({
      mainhand: 'webmc:totem_of_undying',
      offhand: 'webmc:totem_of_undying',
      incomingDamage: 100,
      currentHp: 5,
    });
    expect(r.saved).toBe(true);
    expect(r.consumedFromMain).toBe(false);
  });

  it('applies 3 effects with wiki durations (regen 45s, fire 40s, abs 5s)', () => {
    const r = tryTotem({
      mainhand: 'webmc:totem_of_undying',
      offhand: null,
      incomingDamage: 100,
      currentHp: 5,
    });
    expect(r.effects.length).toBe(3);
    const regen = r.effects.find((e) => e.id === 'regeneration');
    const abs = r.effects.find((e) => e.id === 'absorption');
    const fire = r.effects.find((e) => e.id === 'fire_resistance');
    expect(regen?.durationTicks).toBe(900); // 45s
    expect(abs?.durationTicks).toBe(100); // 5s
    expect(fire?.durationTicks).toBe(800); // 40s
  });
});
