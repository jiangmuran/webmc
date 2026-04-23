import { describe, it, expect } from 'vitest';
import { shouldSpawnReinforcement } from './zombie_reinforcement';

describe('zombie reinforcement', () => {
  it('peaceful never', () => {
    expect(
      shouldSpawnReinforcement({ difficulty: 'peaceful', rng: () => 0, zombieAttackCount: 0 }),
    ).toBe(false);
  });

  it('hard + low rng triggers', () => {
    expect(
      shouldSpawnReinforcement({ difficulty: 'hard', rng: () => 0, zombieAttackCount: 0 }),
    ).toBe(true);
  });

  it('high rng skips', () => {
    expect(
      shouldSpawnReinforcement({ difficulty: 'hard', rng: () => 0.99, zombieAttackCount: 0 }),
    ).toBe(false);
  });

  it('easy no reinforce', () => {
    expect(
      shouldSpawnReinforcement({ difficulty: 'easy', rng: () => 0, zombieAttackCount: 10 }),
    ).toBe(false);
  });
});
