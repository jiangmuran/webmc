import { describe, it, expect } from 'vitest';
import { bubbleKindFor, bubbleAppliesVertical, pullsEntitiesIn } from './soul_sand_bubble_column';

describe('soul sand bubble column', () => {
  it('soul sand up', () => {
    expect(bubbleKindFor('soul_sand')).toBe('upward');
  });

  it('magma down', () => {
    expect(bubbleKindFor('magma_block')).toBe('downward');
  });

  it('dirt none', () => {
    expect(bubbleKindFor('dirt')).toBe('none');
  });

  it('upward positive y vel', () => {
    expect(bubbleAppliesVertical('upward')).toBeGreaterThan(0);
  });

  it('downward negative y vel', () => {
    expect(bubbleAppliesVertical('downward')).toBeLessThan(0);
  });

  it('none zero velocity', () => {
    expect(bubbleAppliesVertical('none')).toBe(0);
  });

  it('active pulls in', () => {
    expect(pullsEntitiesIn('upward')).toBe(true);
    expect(pullsEntitiesIn('none')).toBe(false);
  });
});
