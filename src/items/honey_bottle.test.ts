import { describe, it, expect } from 'vitest';
import { HONEY_BOTTLES_PER_BLOCK, drinkHoneyBottle } from './honey_bottle';

describe('honey bottle', () => {
  it('feeds + removes poison', () => {
    const c = {
      hunger: 10,
      effects: new Map<string, unknown>([['poison', { amplifier: 0, remainingSec: 10 }]]),
      eat(h: number, _s: number): void {
        this.hunger += h;
      },
    };
    expect(drinkHoneyBottle(c)).toBe(true);
    expect(c.effects.has('poison')).toBe(false);
    expect(c.hunger).toBe(16);
  });

  it('drinkable at full hunger to cure poison (wiki)', () => {
    // Wiki (minecraft.wiki/w/Honey_Bottle): "Honey bottles can be drunk
    // even with a full hunger bar." Old code refused at full hunger,
    // so a poisoned full-hunger player could not honey-cure.
    const c = {
      hunger: 20,
      effects: new Map<string, unknown>([['poison', { amplifier: 0, remainingSec: 30 }]]),
      eat(): void {
        /* noop */
      },
    };
    expect(drinkHoneyBottle(c)).toBe(true);
    expect(c.effects.has('poison')).toBe(false);
  });

  it('keeps non-poison effects', () => {
    const c = {
      hunger: 10,
      effects: new Map<string, unknown>([['regeneration', { amplifier: 1 }]]),
      eat(): void {
        /* noop */
      },
    };
    drinkHoneyBottle(c);
    expect(c.effects.has('regeneration')).toBe(true);
  });

  it('4 bottles craft 1 block', () => {
    expect(HONEY_BOTTLES_PER_BLOCK).toBe(4);
  });
});
