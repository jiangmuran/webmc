import { describe, it, expect } from 'vitest';
import { handSwing, handSwayXY, itemPositionOffset } from './hand_view_bob';

describe('hand view bob', () => {
  it('swing peaks at 0.5', () => {
    expect(handSwing(0.5)).toBeCloseTo(1);
  });

  it('swing zero at ends', () => {
    expect(handSwing(0)).toBeCloseTo(0);
    expect(handSwing(1)).toBeCloseTo(0);
  });

  it('sway scales with delta', () => {
    expect(handSwayXY(0, 10).x).toBeGreaterThan(0);
    expect(handSwayXY(10, 0).y).toBeGreaterThan(0);
  });

  it('block different from sword offset', () => {
    expect(itemPositionOffset('block')).not.toEqual(itemPositionOffset('sword'));
  });
});
