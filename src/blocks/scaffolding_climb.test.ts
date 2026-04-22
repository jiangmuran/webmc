import { describe, it, expect } from 'vitest';
import {
  canPlace,
  verticalVelocity,
  cascadeBreakCount,
  MAX_HORIZONTAL_SPAN,
} from './scaffolding_climb';

describe('scaffolding', () => {
  it('places on solid', () => {
    expect(canPlace({ hasSolidBelow: true, adjacentScaffoldDistance: 99 })).toBe(true);
  });

  it('places within horizontal span', () => {
    expect(canPlace({ hasSolidBelow: false, adjacentScaffoldDistance: MAX_HORIZONTAL_SPAN })).toBe(
      true,
    );
    expect(
      canPlace({ hasSolidBelow: false, adjacentScaffoldDistance: MAX_HORIZONTAL_SPAN + 1 }),
    ).toBe(false);
  });

  it('climb up/down', () => {
    expect(verticalVelocity({ crouching: false, jumping: true, standingOnScaffold: true })).toBe(
      0.15,
    );
    expect(
      verticalVelocity({ crouching: true, jumping: false, standingOnScaffold: true }),
    ).toBeLessThan(0);
  });

  it('no velocity off-scaffold', () => {
    expect(verticalVelocity({ crouching: false, jumping: true, standingOnScaffold: false })).toBe(
      0,
    );
  });

  it('cascade break', () => {
    expect(cascadeBreakCount(5)).toBe(5);
    expect(cascadeBreakCount(-1)).toBe(0);
  });
});
