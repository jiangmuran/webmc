import { describe, it, expect } from 'vitest';
import { capFor, spawnAllowed, remainingSpawnBudget } from './spawn_density_cap';

describe('spawn cap', () => {
  it('caps per category', () => {
    expect(capFor('hostile')).toBe(70);
    expect(capFor('passive')).toBe(10);
  });

  it('no players = no spawn', () => {
    expect(spawnAllowed('hostile', 0, 0)).toBe(false);
  });

  it('respects cap', () => {
    expect(spawnAllowed('passive', 9, 1)).toBe(true);
    expect(spawnAllowed('passive', 10, 1)).toBe(false);
  });

  it('scales with players', () => {
    expect(spawnAllowed('passive', 15, 2)).toBe(true);
    expect(spawnAllowed('passive', 20, 2)).toBe(false);
  });

  it('remaining budget', () => {
    expect(remainingSpawnBudget('hostile', 50, 1)).toBe(20);
    expect(remainingSpawnBudget('hostile', 100, 1)).toBe(0);
  });
});
