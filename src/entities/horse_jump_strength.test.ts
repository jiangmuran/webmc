import { describe, it, expect } from 'vitest';
import {
  rollJumpStrength,
  jumpHeightBlocks,
  canClearHeight,
  MIN_JUMP,
} from './horse_jump_strength';

describe('horse jump strength', () => {
  it('roll in range', () => {
    const s = rollJumpStrength(() => 0.5);
    expect(s).toBeGreaterThanOrEqual(MIN_JUMP);
  });

  it('height scales with strength', () => {
    expect(jumpHeightBlocks(1)).toBeGreaterThan(jumpHeightBlocks(0.4));
  });

  it('strong horse clears 3', () => {
    expect(canClearHeight(1.0, 3)).toBe(true);
    expect(canClearHeight(0.4, 3)).toBe(false);
  });
});
