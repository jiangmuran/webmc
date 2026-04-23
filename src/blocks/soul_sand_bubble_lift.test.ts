import { describe, it, expect } from 'vitest';
import {
  createsUpwardBubble,
  movementSlowdown,
  witherSkeletonSkullForWither,
} from './soul_sand_bubble_lift';

describe('soul sand bubble lift', () => {
  it('water above = bubble', () => {
    expect(createsUpwardBubble({ waterAbove: true })).toBe(true);
    expect(createsUpwardBubble({ waterAbove: false })).toBe(false);
  });

  it('slows movement', () => {
    expect(movementSlowdown()).toBeLessThan(1);
  });

  it('3 skulls summons wither', () => {
    expect(witherSkeletonSkullForWither(3)).toBe(true);
    expect(witherSkeletonSkullForWither(2)).toBe(false);
  });
});
