import { describe, it, expect } from 'vitest';
import { isSpiderJockey, isChickenJockey } from './chicken_jockey_spawn';

describe('chicken/spider jockey spawn', () => {
  it('peaceful blocks', () => {
    expect(
      isSpiderJockey({ rollSpiderJockey: 0, rollChickenJockey: 0, difficulty: 'peaceful' }),
    ).toBe(false);
  });

  it('spider jockey lucky', () => {
    expect(
      isSpiderJockey({ rollSpiderJockey: 0, rollChickenJockey: 1, difficulty: 'normal' }),
    ).toBe(true);
  });

  it('chicken jockey lucky', () => {
    expect(
      isChickenJockey({ rollSpiderJockey: 1, rollChickenJockey: 0, difficulty: 'normal' }),
    ).toBe(true);
  });

  it('unlucky skip', () => {
    expect(
      isChickenJockey({ rollSpiderJockey: 1, rollChickenJockey: 0.9, difficulty: 'normal' }),
    ).toBe(false);
  });
});
