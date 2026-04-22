import { describe, it, expect } from 'vitest';
import { POTIONS, brewResult, drinkPotion } from './potion';

class StubPlayer {
  readonly log: { id: string; amplifier: number; durationSec: number }[] = [];
  applyEffect(id: string, amplifier: number, durationSec: number): void {
    this.log.push({ id, amplifier, durationSec });
  }
}

describe('potion', () => {
  it('has all 10 canonical potions', () => {
    const names = Object.keys(POTIONS);
    expect(names.length).toBe(10);
    for (const n of ['healing', 'harming', 'regeneration', 'poison', 'swiftness']) {
      expect(names).toContain(n);
    }
  });

  it('drinkPotion applies each effect', () => {
    const p = new StubPlayer();
    expect(drinkPotion('regeneration', p)).toBe(true);
    expect(p.log).toHaveLength(1);
    expect(p.log[0]?.id).toBe('regeneration');
  });

  it('drinkPotion returns false for unknown key', () => {
    const p = new StubPlayer();
    expect(drinkPotion('elixir_of_dreams', p)).toBe(false);
  });

  it('brewResult: awkward + glistering melon → healing', () => {
    expect(brewResult('awkward', 'webmc:glistering_melon')).toBe('healing');
  });

  it('brewResult: fermented spider eye inverts healing → harming', () => {
    expect(brewResult('healing', 'webmc:fermented_spider_eye')).toBe('harming');
  });

  it('brewResult: unknown combo returns null', () => {
    expect(brewResult('awkward', 'webmc:rotten_flesh')).toBeNull();
  });
});
