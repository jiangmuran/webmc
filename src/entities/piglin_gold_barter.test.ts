import { describe, it, expect } from 'vitest';
import { barterReward, totalWeight } from './piglin_gold_barter';

describe('piglin gold barter', () => {
  it('picks valid entry', () => {
    expect(barterReward(() => 0.5)).toBeDefined();
  });

  it('total weight > 0', () => {
    expect(totalWeight()).toBeGreaterThan(0);
  });

  it('low rng first', () => {
    expect(barterReward(() => 0)?.id).toBe('enchanted_book');
  });
});
