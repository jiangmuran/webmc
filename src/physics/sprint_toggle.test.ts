import { describe, it, expect } from 'vitest';
import { canStart, shouldStopSprinting } from './sprint_toggle';

describe('sprint toggle', () => {
  it('double tap + high hunger starts', () => {
    expect(
      canStart({
        doubleTappedForward: true,
        currentHunger: 20,
        holdingForward: true,
        sprinting: false,
      }),
    ).toBe(true);
  });

  it('low hunger blocks', () => {
    expect(
      canStart({
        doubleTappedForward: true,
        currentHunger: 5,
        holdingForward: true,
        sprinting: false,
      }),
    ).toBe(false);
  });

  it('release forward stops', () => {
    expect(
      shouldStopSprinting({
        doubleTappedForward: false,
        currentHunger: 20,
        holdingForward: false,
        sprinting: true,
      }),
    ).toBe(true);
  });

  it('low hunger stops', () => {
    expect(
      shouldStopSprinting({
        doubleTappedForward: false,
        currentHunger: 3,
        holdingForward: true,
        sprinting: true,
      }),
    ).toBe(true);
  });
});
