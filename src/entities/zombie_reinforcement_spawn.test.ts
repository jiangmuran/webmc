import { describe, it, expect } from 'vitest';
import {
  makeReinforcement,
  tryReinforce,
  initialChanceForLocalDifficulty,
  MAX_CHAIN,
} from './zombie_reinforcement_spawn';

describe('zombie reinforcement', () => {
  it('only on hard', () => {
    const s = makeReinforcement(1);
    expect(tryReinforce(s, { difficulty: 'normal', rand: () => 0 })).toBe(false);
    expect(tryReinforce(s, { difficulty: 'hard', rand: () => 0 })).toBe(true);
  });

  it('chance decays', () => {
    const s = makeReinforcement(0.5);
    tryReinforce(s, { difficulty: 'hard', rand: () => 0 });
    expect(s.currentSpawnChance).toBeCloseTo(0.45);
  });

  it('cap at MAX_CHAIN', () => {
    const s = makeReinforcement(1);
    for (let i = 0; i < MAX_CHAIN; i++) {
      expect(tryReinforce(s, { difficulty: 'hard', rand: () => 0 })).toBe(true);
    }
    expect(tryReinforce(s, { difficulty: 'hard', rand: () => 0 })).toBe(false);
  });

  it('local difficulty scales init chance', () => {
    expect(initialChanceForLocalDifficulty(0)).toBe(0.05);
    expect(initialChanceForLocalDifficulty(5)).toBeGreaterThan(0.05);
    expect(initialChanceForLocalDifficulty(100)).toBe(0.5);
  });
});
