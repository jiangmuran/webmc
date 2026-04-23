import { describe, it, expect } from 'vitest';
import { evaluate, and, type LootCtx } from './loot_condition';

const ctx: LootCtx = {
  rand: () => 0.3,
  killedByPlayer: true,
  entityOnFire: false,
  entitySneaking: false,
  entityInWater: false,
  lootingLevel: 2,
};

describe('loot condition', () => {
  it('random chance passes low roll', () => {
    expect(evaluate({ kind: 'random_chance', chance: 0.5 }, ctx)).toBe(true);
  });

  it('killed by player', () => {
    expect(evaluate({ kind: 'killed_by_player' }, ctx)).toBe(true);
  });

  it('inverted flips', () => {
    expect(evaluate({ kind: 'inverted', inner: { kind: 'killed_by_player' } }, ctx)).toBe(false);
  });

  it('entity property sneaking', () => {
    expect(
      evaluate({ kind: 'entity_property', property: 'sneaking' }, { ...ctx, entitySneaking: true }),
    ).toBe(true);
  });

  it('looting scales chance', () => {
    expect(
      evaluate(
        { kind: 'looting_chance', base: 0, bonus: 0.2 },
        { ...ctx, lootingLevel: 3, rand: () => 0.5 },
      ),
    ).toBe(true);
  });

  it('and combines', () => {
    expect(and({ kind: 'killed_by_player' }, { kind: 'killed_by_player' }, ctx)).toBe(true);
  });
});
