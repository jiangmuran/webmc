import { describe, it, expect } from 'vitest';
import { conversionChance, onVillagerKilledByZombie } from './zombie_villager_summon';

const v = { profession: 'farmer', tradesHash: 'abc', xp: 5 };

describe('villager zombify', () => {
  it('chance by difficulty', () => {
    expect(conversionChance('easy')).toBe(0);
    expect(conversionChance('normal')).toBe(0.5);
    expect(conversionChance('hard')).toBe(1);
  });

  it('hard always converts', () => {
    expect(
      onVillagerKilledByZombie({ difficulty: 'hard', rand: () => 0.99, villager: v }).converted,
    ).toBe(true);
  });

  it('normal by roll', () => {
    expect(
      onVillagerKilledByZombie({ difficulty: 'normal', rand: () => 0.1, villager: v }).converted,
    ).toBe(true);
    expect(
      onVillagerKilledByZombie({ difficulty: 'normal', rand: () => 0.9, villager: v }).converted,
    ).toBe(false);
  });

  it('easy never', () => {
    expect(
      onVillagerKilledByZombie({ difficulty: 'easy', rand: () => 0, villager: v }).converted,
    ).toBe(false);
  });

  it('carries over snapshot', () => {
    const r = onVillagerKilledByZombie({ difficulty: 'hard', rand: () => 0, villager: v });
    expect(r.carriedOver?.profession).toBe('farmer');
  });
});
